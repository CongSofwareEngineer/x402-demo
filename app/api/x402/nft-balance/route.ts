// export { POST } from 'x402-next'

import { facilitator } from '@coinbase/x402'
import { NextRequest, NextResponse } from 'next/server'
import { parseUnits } from 'viem'
import { ERC20TokenAmount, PaymentPayload, PaymentRequirements } from 'x402/types'
import { useFacilitator } from 'x402/verify'
import { computeRoutePatterns, findMatchingPaymentRequirements, findMatchingRoute, processPriceToAtomicAmount, safeBase64Encode } from 'x402/shared'
import { exact } from 'x402/schemes'
import { base } from 'viem/chains'

import { COINBASE_CONFIG } from '@/configs/app'
import MoralisService from '@/services/Moralis'

export async function POST(req: NextRequest) {
  const x402Version = 1

  try {
    const { verify, settle } = useFacilitator(facilitator)

    let decodedPayment: PaymentPayload
    const url = new URL(req.url)
    const paymentHeader = req.headers.get('X-PAYMENT')
    let body = {}

    try {
      body = ((await req.json()) || {}) as { address: string }
    } catch (error) {
      body = {
        address: COINBASE_CONFIG.PAY_TO,
      }
    }

    const routePatterns = computeRoutePatterns({
      'api/x402/usdc/nft-balance': {
        price: COINBASE_CONFIG.PAY_AMOUNT,
        network: 'base',
      },
    })

    const matchingRoute = findMatchingRoute(routePatterns, 'api/x402/usdc/nft-balance', 'POST')

    const { price, network, config = {} } = matchingRoute!.config || {}
    const atomicAmountForAsset = processPriceToAtomicAmount(price, network)
    const { asset } = atomicAmountForAsset as any

    const { inputSchema, outputSchema, errorMessages } = config

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

      if (verification?.isValid) {
        const settlement = await settle(decodedPayment, selectedPaymentRequirements!)

        if (settlement.success) {
          const listNFT = await MoralisService.getListNFTsByOwner({
            address: body.address as any,
            chainId: base.id,
          })

          const response = new NextResponse(
            JSON.stringify({
              listNFT: listNFT?.assets,
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
      }

      return new NextResponse(
        JSON.stringify({
          x402Version,
          error: verification?.invalidReason || 'Payment verification failed',
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
    return new NextResponse(
      JSON.stringify({
        x402Version,
        error: 'Settlement failed',
        errorDetail: JSON.stringify(error),
      }),
      { status: 402, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
