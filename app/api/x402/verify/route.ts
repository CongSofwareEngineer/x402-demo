// export { POST } from 'x402-next'

import { facilitator } from '@coinbase/x402'
import { NextRequest } from 'next/server'
import { parseUnits } from 'viem'
import { exact } from 'x402/schemes'
import { PaymentRequirements } from 'x402/types'
import { useFacilitator } from 'x402/verify'

import { COINBASE_CONFIG } from '@/configs/app'

export async function POST(req: NextRequest) {
  const { verify, settle, list, } = useFacilitator(facilitator); // eslint-disable-line
  const paymentRequirements: PaymentRequirements = {
    scheme: 'exact',
    network: 'base',
    maxAmountRequired: parseUnits(COINBASE_CONFIG.PAY_AMOUNT, 6).toString(),
    resource: facilitator.url,
    description: 'Access to protected content',
    mimeType: 'text/html',
    payTo: COINBASE_CONFIG.PAY_TO,
    maxTimeoutSeconds: COINBASE_CONFIG.MAX_TIMEOUT,
    asset: COINBASE_CONFIG.PAY_ASSET,
    outputSchema: undefined,
    extra: {
      name: 'USDT Coin',
      version: '2',
    },
  }

  try {
    let urlFinal = req.url
    const url = new URL(req.url)
    const addressuser = url.searchParams.get('address') || ''
    const reqBody = await req.json()

    console.log({ reqBody })

    const payment = exact.evm.decodePayment(reqBody)
    const listData = await list()

    console.log({ url })
    // const settleResponse = await settle(payment, paymentRequirements)

    // console.log({ settleResponse })

    return new Response(
      JSON.stringify({
        message: 'Demo endpoint response',
        address: addressuser,
        requestBody: {
          status: 'success',
          reqBody,
          listData,
          payment,
        },
      })
    )
  } catch (error) {
    console.error('Error in /api/x402/demo:', error)

    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}
