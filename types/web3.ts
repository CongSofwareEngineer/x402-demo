import { Address } from 'viem'

import { CHAIN_TYPE } from '@/services/Moralis/type'
export const NFT_TYPE = {
  ERC721: 'ERC721',
  ERC1155: 'ERC1155',
  SOLANA: 'SOLANA',
  NonFungible: 'NonFungible',
}

export type INftDetail = {
  blockchain?: keyof typeof CHAIN_TYPE
  collectionName?: string
  collectionAddress?: Address
  contractAddress?: Address
  contractType?: keyof typeof NFT_TYPE
  imageUrl?: string
  animationUrl?: string
  name?: string
  quantity?: number
  symbol?: string
  tokenId?: string
  tokenUrl?: string
  traits?: Array<{
    trait_type?: string
    value?: string
    [key: string]: unknown
  }> // [{trait_type: 'TITLE', value: 'Admission free. One drink service.'}],
  description?: string
  possibleSpam?: boolean
  moreData?: any
  owners?: Address[]
  attributes?: Record<string, any>
  audioUrl?: string
  mintAddress?: Address
  amount?: string
  [key: string]: unknown
}
