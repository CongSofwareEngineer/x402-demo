import { CHAIN_SUPPORT_X402 } from '@/constants/x402'

export const getChainTypeFromChainId = (chainId: string) => {
  return CHAIN_SUPPORT_X402[chainId as keyof typeof CHAIN_SUPPORT_X402]?.chainType
}

export const getChainIdFromChainType = (chainType: string) => {
  const entry = Object.entries(CHAIN_SUPPORT_X402).find(([, value]) => value.chainType === chainType)

  return entry ? entry[0] : undefined
}
