import { NextRequest, NextResponse } from 'next/server'
import { safeBase64Encode } from 'x402/shared'

import { COINBASE_CONFIG } from '@/configs/app'
import X402Server, { FacilitatorType } from '@/server/x402'
import MoralisService from '@/services/Moralis'
import { getChainIdFromChainType } from '@/utils/chain'
const x402Version = 1

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url!)
    const typeFacilitator = url.pathname.split('/')[3] as FacilitatorType
    const chainType = url.pathname.split('/')[4]
    const paymentHeader = req.headers.get('X-PAYMENT')

    let body = {} as { address: string }

    try {
      body = ((await req.json()) || {}) as { address: string }
    } catch {
      body = {
        address: COINBASE_CONFIG.PAY_TO,
      }
    }

    const config = X402Server.getConfigX402(req, `/api/x402/${typeFacilitator}/${chainType}/nft-premium`, 'premium', 'POST')
    const { errorMessages, paymentRequirements } = config || {}

    if (paymentHeader && paymentRequirements) {
      const settlement = await X402Server.settlePayment(paymentHeader, paymentRequirements!, typeFacilitator || 'base')

      if (settlement?.success) {
        const chainId = getChainIdFromChainType(chainType)
        const listNFT = await MoralisService.getListNFTsByOwner({
          address: body.address as any,
          chainId: chainId!,
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
    }

    console.log('require payment', { paymentRequirements })

    return new NextResponse(
      JSON.stringify({
        x402Version,
        error: errorMessages?.paymentRequired || 'X-PAYMENT header is required',
        accepts: paymentRequirements,
      }),
      { status: 402, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.log({ error })

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
