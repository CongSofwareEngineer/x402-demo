export const META_DATA_APP = {
  image: 'https://tc-ai-premium.vercel.app/logo.png',
  title: 'TC AI  Premium',
  des: 'TC AI Premium Description',
  icon: '/favicon.ico',
  url: 'https://tc-ai-premium.vercel.app',
}

export const APP_CONFIG = {
  CDP_API_KEY_ID: process.env.CDP_API_KEY_ID,
  CDP_API_KEY_SECRET: process.env.CDP_API_KEY_SECRET,
}

export const COINBASE_CONFIG = {
  MAX_TIMEOUT: 180,
  PAY_TO: process.env.RESOURCE_WALLET_ADDRESS,
  PAY_AMOUNT: '0.1',
  PAY_AMOUNT_PREMIUM: '0.5',
  PAY_ASSET: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, // USDC on base
}

export const MORALIS_CONFIG = {
  MoralisAPI: 'https://deep-index.moralis.io/api/v2.2',
  TokenMoralis: process.env.TOKEN_SERVICE_MORALIS_API_KEY,
}
