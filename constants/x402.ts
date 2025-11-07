import { solana } from '@reown/appkit/networks'
import { abstract, avalanche, base, iotex, peaq, polygon, sei } from 'viem/chains'
import { facilitator } from '@coinbase/x402'

export const TYPE_FACILITATOR = {
  daydreams: {
    facilitator: {
      url: 'https://facilitator.daydreams.systems' as `${string}://${string}`,
    },
    icon: 'https://www.x402scan.com/router-logo-small.png',
  },
  base: {
    facilitator: facilitator,
    icon: 'https://www.x402scan.com/coinbase.png',
  },
  payAI: {
    facilitator: {
      url: 'https://facilitator.payai.network' as `${string}://${string}`,
    },
    icon: 'https://www.x402scan.com/payai.png',
  },
}

export const CHAIN_SUPPORT_X402 = {
  [8453]: {
    ...base,
    chainType: 'base',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  },
  [2741]: {
    ...abstract,
    chainType: 'abstract',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_abstract.jpg',
  },
  [43114]: {
    ...avalanche,
    chainType: 'avalanche',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
  },
  [1329]: {
    ...sei,
    chainType: 'sei',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_sei.jpg',
  },
  [137]: {
    ...polygon,
    chainType: 'polygon',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
  },
  [3338]: {
    ...peaq,
    chainType: 'peaq',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_peaq.jpg',
  },
  [4689]: {
    ...iotex,
    chainType: 'iotex',
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_iotex.jpg',
  },
  ['5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp']: {
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
