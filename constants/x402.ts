import { solana } from '@reown/appkit/networks'
import { parseUnits } from 'viem'
import { abstract, avalanche, base, iotex, peaq, polygon, sei } from 'viem/chains'

import { COINBASE_CONFIG } from '@/configs/app'

export const CHAIN_SUPPORT_X402 = {
  [base.id]: {
    ...base,
    chainType: 'base',
  },
  [abstract.id]: {
    ...abstract,
    chainType: 'abstract',
  },
  [avalanche.id]: {
    ...avalanche,
    chainType: 'avalanche',
  },
  [sei.id]: {
    ...sei,
    chainType: 'sei',
  },
  [polygon.id]: {
    ...polygon,
    chainType: 'polygon',
  },
  [peaq.id]: {
    ...peaq,
    chainType: 'peaq',
  },
  [iotex.id]: {
    ...iotex,
    chainType: 'iotex',
  },
  [solana.id]: {
    ...solana,
    chainType: 'solana',
  },
}

export const TOKEN_PAYMENT_X402 = {
  [base.id]: {
    asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // BASE USDC
    decimals: 6,
  },
}

export const CONFIG_PAYMENT_X402 = {
  [base.id]: {
    basic: {
      scheme: 'exact',
      network: 'base',
      maxAmountRequired: parseUnits('0.01', TOKEN_PAYMENT_X402[base.id].decimals).toString(),
      resource: window.location.href,
      description: 'Access to protected content',
      mimeType: 'application/json',
      payTo: COINBASE_CONFIG.PAY_TO,
      maxTimeoutSeconds: COINBASE_CONFIG.MAX_TIMEOUT,
      asset: TOKEN_PAYMENT_X402[base.id].asset,
    },
  },
}
