import { paymentMiddleware, Network, Resource } from 'x402-next'
import { facilitator } from '@coinbase/x402' // For mainnet

import { APP_CONFIG, COINBASE_CONFIG } from './configs/app'
const facilitatorUrl = (process.env.NEXT_PUBLIC_FACILITATOR_URL as Resource) || 'https://x402.org/facilitator'
const network = (process.env.NETWORK as Network) || 'base'

export const middleware = paymentMiddleware(
  COINBASE_CONFIG.PAY_TO as `0x${string}`,
  {
    '/api/x402/demo': {
      // price: {
      //   amount: parseUnits(COINBASE_CONFIG.PAY_AMOUNT, 6).toString(),
      //   asset: {
      //     address: COINBASE_CONFIG.PAY_ASSET,
      //     decimals: 6,
      //     eip712: {
      //       name: 'USDT Coin',
      //       version: '2',
      //     },
      //   },
      // },
      price: COINBASE_CONFIG.PAY_AMOUNT,
      network,
    },
  },
  facilitator,
  {
    cdpClientKey: APP_CONFIG.CDP_API_KEY_ID,
    appName: 'Next x402 Demo',
    appLogo: '/x402-icon-blue.png',
  }
)

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/api/x402/:path*'],
}
