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
    const chainType = url.pathname.split('/')[4]
    const paymentHeader = req.headers.get('X-PAYMENT')

    let body = {} as { address: string; chain?: string; facilitator?: FacilitatorType }

    try {
      body = ((await req.json()) || {}) as { address: string; chain?: string; facilitator?: FacilitatorType }
    } catch {
      body = {
        address: COINBASE_CONFIG.PAY_TO,
      }
    }
    if (!body.facilitator) {
      body.facilitator = 'base'
    }
    if (!body.chain) {
      body.chain = 'base'
    }

    const config = X402Server.getConfigX402(req, `/api/x402/nft-premium`, 'premium', body, {
      description: `Get your NFT balance premium on ${body.chain} chain for user premium`,
      input: {
        bodyFields: {
          address: {
            type: 'string',
            required: false,
            description: 'Your address to search data. \nDefault is the payment address.', // for nested objects
          },
          chain: {
            type: 'string',
            required: false,
            description:
              'List chain support: [base, sei, avalanche, polygon]. Default is chain base.\n Facilitator base support chain: base. \n Facilitator payAI support chain: base, sei, avalanche, polygon. \n Facilitator daydreams support chain: base, polygon ', // for nested objects
          },
          facilitator: {
            type: 'string',
            required: false,
            description: `The facilitator type.\n List support [base, payAI, daydreams]`,
          },
        },
      },
    })
    const { errorMessages, paymentRequirements } = config || {}

    if (paymentHeader && paymentRequirements) {
      const settlement = await X402Server.settlePayment(paymentHeader, paymentRequirements!, body.facilitator)

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
