import { Address } from 'viem'

export const META_DATA_APP = {
  image: 'https://ipfs.pantograph.app/ipfs/QmfAoyFC6n4ve9TuQGwgVddYWwRjMrHy1LQXx24QAVWEHw?filename=message_banner.png',
  title: 'X402 Demo',
  des: 'X402 Demor',
  icon: '/favicon.ico',
  url: 'https://tradecoinpro.com',
}

export const APP_CONFIG = {
  CDP_API_KEY_ID: process.env.CDP_API_KEY_ID || '394002',
  CDP_API_KEY_SECRET: process.env.CDP_API_KEY_SECRET || 'hX1u7r8v9w0xYzAq',
}

export const COINBASE_CONFIG = {
  MAX_TIMEOUT: 180,
  // PAY_TO: (process.env.RESOURCE_WALLET_ADDRESS as Address) || '0x5946ac23ef5f87900069c56f872f8de7a3f3e737',
  PAY_TO: (process.env.RESOURCE_WALLET_ADDRESS as Address) || '0x9f276af79b2b5de2946a88b0fe2717318f924d7c',
  PAY_AMOUNT: '0.01',
  PAY_AMOUNT_PREMIUM: '10',
  // PAY_ASSET: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' as Address, // USDT on base
  PAY_ASSET: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address, // USDC on base
  PAY_ASSET_USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' as Address, // USDC on base
}

export const MORALIS_CONFIG = {
  MoralisAPI: process.env.NEXT_PUBLIC_MORALIS_API_URL || 'https://deep-index.moralis.io/api/v2.2',
  TokenMoralis:
    process.env.TOKEN_SERVICE_MORALIS_API_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImJiZWI1N2ZlLTNmOWEtNGZhMi1iNDIyLTY0MzA2YTg1NzE3MyIsIm9yZ0lkIjoiMzk0MDAyIiwidXNlcklkIjoiNDA0ODUzIiwidHlwZUlkIjoiYjQyODExOTQtOGQ0Yi00NjkxLTlhZjItNjU4ODE2NzExYmRjIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTY4NzEwMDEsImV4cCI6NDg3MjYzMTAwMX0.omiI30GlTmkOzlWJkKiLcQ0Lk-YBjXnF6CoT0dj1sMQ',
}
