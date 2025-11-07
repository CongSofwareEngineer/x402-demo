import { solana } from '@reown/appkit/networks'
import { abstract, avalanche, base, iotex, peaq, polygon, sei } from 'viem/chains'
import { facilitator } from '@coinbase/x402'

export const TYPE_FACILITATOR = {
  daydreams: 'https://facilitator.daydreams.systems' as `${string}://${string}`,
  base: facilitator,
  payAI: 'https://facilitator.payai.network' as `${string}://${string}`,
}

export const CHAIN_SUPPORT_X402 = {
  [base.id]: {
    ...base,
    chainType: 'base',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  },
  [abstract.id]: {
    ...abstract,
    chainType: 'abstract',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_abstract.jpg',
  },
  [avalanche.id]: {
    ...avalanche,
    chainType: 'avalanche',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
  },
  [sei.id]: {
    ...sei,
    chainType: 'sei',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_sei.jpg',
  },
  [polygon.id]: {
    ...polygon,
    chainType: 'polygon',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
  },
  [peaq.id]: {
    ...peaq,
    chainType: 'peaq',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_peaq.jpg',
  },
  [iotex.id]: {
    ...iotex,
    chainType: 'iotex',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_iotex.jpg',
  },
  [solana.id]: {
    ...solana,
    chainType: 'solana',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_solana.jpg',
  },
}

export const CONFIG_PAYMENT_X402 = {
  basic: {
    amount: '0.01',
  },
  premium: {
    amount: '10',
  },
} as {
  basic: {
    amount: string
  }
  premium: {
    amount: string
  }
}
