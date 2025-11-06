import { Address, Hash } from 'viem'
export const CHAIN_TYPE = {
  ethereum: 'eth',
  bsc: 'bsc',
  polygon: 'polygon',
  avalanche: 'avalanche',
  fantom: 'fantom',
  eth_goerli: 'eth_goerli',
  polygon_mumbai: 'polygon_mumbai',
  avalanche_fuji: 'avalanche_fuji',
  solana: 'solana',
  optimism: 'optimism',
  optimism_sepolia: 'optimism_sepolia',
  arbitrum: 'arbitrum',
  arbitrum_sepolia: 'arbitrum_sepolia',
  base: 'base',
  linea: 'linea',
}

export type ChainId = number | string
export type QueryNFTByOwner = {
  chainId: ChainId
  tokenAddresses?: Address[]
  address: Address
  pageToken?: string | undefined
  filter?: Array<Record<string, any>>
  pageSize?: number
}

export type QueryNFTByContract = {
  chain: keyof typeof CHAIN_TYPE
  format?: string
  address: Address
  normalizeMetadata?: boolean
  media_items?: boolean
  limit?: number
  cursor?: string | undefined
}

export type LastTransaction = {
  chain: keyof typeof CHAIN_TYPE
  fromAddress: Address
  toAddress?: Address
  timestamp?: string
  method: string
  tokenId: string
  transactionHash: Hash
  block?: number
  instructions?: Array<{
    accounts: Address[]
    programId: string
  }>
}
