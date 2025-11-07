// export { POST } from 'x402-next'

import { NextRequest, NextResponse } from 'next/server'
import { safeBase64Encode } from 'x402/shared'
import { base } from 'viem/chains'

import { COINBASE_CONFIG } from '@/configs/app'
import MoralisService from '@/services/Moralis'
import X402Server from '@/server/x402'

export async function POST(req: NextRequest) {
  const x402Version = 1

  try {
    const url = new URL(req.url)
    const typeFacilitator = url.searchParams.get('typeFacilitator') as 'daydreams' | 'base' | 'payAI'
    const paymentHeader = req.headers.get('X-PAYMENT')
    let body = {} as { address: string; typeFacilitator: 'daydreams' | 'base' | 'payAI' }

    try {
      body = ((await req.json()) || {}) as { address: string; typeFacilitator: 'daydreams' | 'base' | 'payAI' }
    } catch {
      body = {
        address: COINBASE_CONFIG.PAY_TO,
        typeFacilitator: 'base',
      }
    }
    console.log({ typeFacilitator })

    const chain = url.pathname.split('/')[2]
    const config = X402Server.getConfigX402(req, `api/${chain}/nft-premium`, 'basic', 'POST')
    const { errorMessages, paymentRequirements } = config || {}

    if (paymentHeader && paymentRequirements) {
      const settlement = await X402Server.settlePayment(paymentHeader, paymentRequirements!, typeFacilitator || body.typeFacilitator)

      if (settlement?.success) {
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

      return new NextResponse(
        JSON.stringify({
          x402Version,
          error: settlement?.invalidReason || 'Payment verification failed',
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

// export async function GET(req: NextRequest) {
//   try {
//     const url = new URL(req.url)
//     const chain = url.pathname.split('/')[2]
//     const config = X402Server.getConfigX402(req, 'api/x402/nft-balance', 'premium', 'POST')

//     return new NextResponse(
//       JSON.stringify({
//         config,
//         chain,
//         error: 'Settlement failed',
//       }),
//       { status: 402, headers: { 'Content-Type': 'application/json' } }
//     )
//   } catch (error) {
//     return new NextResponse(
//       JSON.stringify({
//         error: 'Settlement failed',
//         errorDetail: JSON.stringify(error),
//       }),
//       { status: 402, headers: { 'Content-Type': 'application/json' } }
//     )
//   }
// }
