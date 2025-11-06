// export { POST } from 'x402-next'

import { facilitator } from '@coinbase/x402'
import { NextRequest, NextResponse } from 'next/server'
import { parseUnits } from 'viem'
import { ERC20TokenAmount, PaymentPayload, PaymentRequirements } from 'x402/types'
import { useFacilitator } from 'x402/verify'
import { computeRoutePatterns, findMatchingPaymentRequirements, findMatchingRoute, processPriceToAtomicAmount, safeBase64Encode } from 'x402/shared'
import { exact } from 'x402/schemes'

import { COINBASE_CONFIG } from '@/configs/app'

export async function POST(req: NextRequest) {
  const x402Version = 1

  try {
    const { verify, settle, supported } = useFacilitator(facilitator)

    let urlFinal = req.url
    let decodedPayment: PaymentPayload
    const url = new URL(req.url)
    const paymentHeader = req.headers.get('X-PAYMENT')
    const routePatterns = computeRoutePatterns({
      '/api/x402/demo': {
        price: COINBASE_CONFIG.PAY_AMOUNT,
        network: 'base',
      },
    })
    const matchingRoute = findMatchingRoute(routePatterns, '/api/x402/demo', 'POST')
    const { price, network, config = {} } = matchingRoute!.config || {}
    const atomicAmountForAsset = processPriceToAtomicAmount(price, network)
    const { asset } = atomicAmountForAsset as any

    const { inputSchema, outputSchema, errorMessages } = config

    console.log({ resource: url.href, matchingRoute, config, errorMessages })

    const paymentRequirements: PaymentRequirements[] = [
      {
        scheme: 'exact',
        network: 'base',
        maxAmountRequired: parseUnits(COINBASE_CONFIG.PAY_AMOUNT, 6).toString(),
        resource: url.href,
        description: 'Access to protected content',
        mimeType: 'application/json',
        payTo: COINBASE_CONFIG.PAY_TO,
        maxTimeoutSeconds: COINBASE_CONFIG.MAX_TIMEOUT,
        asset: COINBASE_CONFIG.PAY_ASSET,
        outputSchema: {
          input: {
            type: 'http',
            method: 'POST',
            discoverable: true,
            ...inputSchema,
          },
          output: outputSchema,
        },
        extra: (asset as ERC20TokenAmount['asset']).eip712,
      },
    ]

    if (paymentHeader) {
      decodedPayment = exact.evm.decodePayment(paymentHeader)
      decodedPayment.x402Version = x402Version
      const selectedPaymentRequirements = findMatchingPaymentRequirements(paymentRequirements, decodedPayment)
      const verification = await verify(decodedPayment, selectedPaymentRequirements!)
      const settlement = await settle(decodedPayment, selectedPaymentRequirements!)

      console.log({ settlement })
      if (settlement.success) {
        const response = new NextResponse(
          JSON.stringify({
            verification,
            selectedPaymentRequirements,
            data: 'have to data',
          })
        )

        response.headers.set(
          'X-PAYMENT-RESPONSE',
          safeBase64Encode(
            JSON.stringify({
              success: true,
              transaction: settlement.transaction,
              network: settlement.network,
              payer: settlement.payer,
            })
          )
        )

        return response
      }

      return new NextResponse(
        JSON.stringify({
          verification,
          selectedPaymentRequirements,
          data: 'have to data',
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      return new NextResponse(
        JSON.stringify({
          x402Version,
          error: errorMessages?.paymentRequired || 'X-PAYMENT header is required',
          accepts: paymentRequirements,
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error: any) {
    console.error('Error in /api/x402/demo:', error?.statusText)

    return new NextResponse(
      JSON.stringify({
        x402Version,
        error: 'Settlement failed',
      }),
      { status: 402, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
