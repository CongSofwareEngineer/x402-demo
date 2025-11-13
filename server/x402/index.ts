'use server'

import { NextRequest } from 'next/server'
import { computeRoutePatterns, findMatchingPaymentRequirements, findMatchingRoute, processPriceToAtomicAmount } from 'x402/shared'
import { ERC20TokenAmount, PaymentRequirements, SettleResponse, VerifyResponse } from 'x402/types'
import { exact } from 'x402/schemes'
import { useFacilitator } from 'x402/verify'
import { parseUnits } from 'viem'

import { CONFIG_PAYMENT_X402, TYPE_FACILITATOR } from '@/constants/x402'
import { getChainIdFromChainType } from '@/utils/chain'
import { COINBASE_CONFIG } from '@/configs/app'
import { TOKEN_SUPPORT_X402 } from '@/constants/token'
export type FacilitatorType = 'base' | 'payAI' | 'daydreams'
class X402Server {
  static getFacilitatorUrl(type: FacilitatorType) {
    if (type === 'base') {
      return TYPE_FACILITATOR[type]
    }

    return TYPE_FACILITATOR[type]
  }

  static getConfigX402(req: NextRequest, router: string, type: 'basic' | 'premium', method: 'GET' | 'POST' = 'POST') {
    const url = new URL(req.url)
    const chainType = url.pathname.split('/')[4]

    const chainId = getChainIdFromChainType(chainType)

    if (chainId) {
      const tokenSystem = TOKEN_SUPPORT_X402[chainId as keyof typeof TOKEN_SUPPORT_X402]
      const configSystem = CONFIG_PAYMENT_X402[type]
      const maxAmountRequired = parseUnits(configSystem.amount, tokenSystem.decimals).toString()

      const routePatterns = computeRoutePatterns({
        [`${router}`]: {
          price: configSystem.amount,
          network: chainType as any,
        },
      })

      const matchingRoute = findMatchingRoute(routePatterns, router, method)

      const { price, network, config = {} } = matchingRoute!?.config || {}
      const atomicAmountForAsset = processPriceToAtomicAmount(price, network)
      const { asset } = atomicAmountForAsset as any

      const { inputSchema, outputSchema, errorMessages } = config

      const paymentRequirements: PaymentRequirements[] = [
        {
          scheme: 'exact',
          network: chainType as any,
          maxAmountRequired: maxAmountRequired,
          resource: url.href,
          description: 'Access to protected content',
          mimeType: 'application/json',
          payTo: COINBASE_CONFIG.PAY_TO,
          maxTimeoutSeconds: COINBASE_CONFIG.MAX_TIMEOUT,
          asset: tokenSystem.asset,
          outputSchema: {
            input: {
              type: 'http',
              method: method,
              discoverable: true,
              bodyType: 'json',
              bodyFields: {
                address: {
                  type: 'string',
                  required: false,
                  description: 'Your address to get access', // for nested objects
                },
              },
              ...inputSchema,
            },
            output: outputSchema,
          },
          extra: (asset as ERC20TokenAmount['asset']).eip712,
        },
      ]

      return {
        paymentRequirements,
        errorMessages,
      }
    }

    return null
  }

  static async settlePayment(
    paymentHeader: string,
    paymentRequirements: PaymentRequirements[],
    typeFacilitator: FacilitatorType = 'base',
    x402Version = 1
  ): Promise<SettleResponse & VerifyResponse> {
    const { verify, settle } = useFacilitator(this.getFacilitatorUrl(typeFacilitator).facilitator)

    let decodedPayment = exact.evm.decodePayment(paymentHeader)

    decodedPayment.x402Version = x402Version
    const selectedPaymentRequirements = findMatchingPaymentRequirements(paymentRequirements, decodedPayment)
    const verification = await verify(decodedPayment, selectedPaymentRequirements!)

    if (verification?.isValid) {
      const settlement = await settle(decodedPayment, selectedPaymentRequirements!)

      return settlement as any
    }

    return verification as any
  }
}
export default X402Server
