import { stringify } from 'querystring'

import { Address, toHex } from 'viem'

import { ChainId, QueryNFTByOwner } from './type'

import { INftDetail } from '@/types/web3'
import { detectUrl, upperCase } from '@/utils/functions'
import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'
import { MORALIS_CONFIG } from '@/configs/app'

const fetcher = async (params: IFetch) => {
  let url = MORALIS_CONFIG.MoralisAPI + params.url

  url = url.replace('//', '/')

  return fetcherConfig({
    ...params,
    url,
    headers: {
      'X-API-Key': MORALIS_CONFIG.TokenMoralis,
      Accept: 'application/json',
    },
  })
}

class MoralisService {
  static formatTokenUri(tokenUri: string, contractAddress: Address, tokenId: string) {
    let urlFormat = tokenUri
    const arrKeyReplace: string[] = []

    //replace {keyTokenId} = tokenId
    urlFormat = urlFormat.replace('{ID}', tokenId)
    urlFormat = urlFormat.replace('{id}', tokenId)
    urlFormat = urlFormat.replace('{nftId}', tokenId)
    urlFormat = urlFormat.replace('{nftid}', tokenId)
    urlFormat = urlFormat.replace('{tokenId}', tokenId)
    urlFormat = urlFormat.replace('{tokenid}', tokenId)
    urlFormat = urlFormat.replace('{token}', tokenId)

    //replace {keyContract} = contractAddress
    urlFormat = urlFormat.replace('{address}', contractAddress)
    urlFormat = urlFormat.replace('{Address}', contractAddress)
    urlFormat = urlFormat.replace('{contractAddress}', contractAddress)
    urlFormat = urlFormat.replace('{contractaddress}', contractAddress)
    urlFormat = urlFormat.replace('{nftAddress}', contractAddress)
    urlFormat = urlFormat.replace('{nftaddress}', contractAddress)
    urlFormat = urlFormat.replace('{contract}', contractAddress)
    urlFormat = urlFormat.replace('{nft}', contractAddress)

    urlFormat.replace(/\{([^}]+)\}/g, (_, key) => {
      arrKeyReplace.push(key)

      return `{${key}}`
    })

    if (arrKeyReplace.length === 2) {
      urlFormat = urlFormat.replace(`{${arrKeyReplace[0]}}`, contractAddress)
      urlFormat = urlFormat.replace(`{${arrKeyReplace[1]}}`, tokenId)
    }
    if (arrKeyReplace.length === 1) {
      if (urlFormat.includes(`{${arrKeyReplace[0]}}.json`)) {
        urlFormat = urlFormat.replace(`{${arrKeyReplace[0]}}`, tokenId)
      }
      if (urlFormat.includes(`{${arrKeyReplace[0]}}/`)) {
        urlFormat = urlFormat.replace(`{${arrKeyReplace[0]}}`, contractAddress)
      }
    }

    return detectUrl(urlFormat, urlFormat)
  }

  static async formatNftDataByAnkrFormat(dataMoralis: any[], chainId: ChainId): Promise<INftDetail[]> {
    const dataClone = dataMoralis || []

    const data = dataClone.map((moralisItem: any) => {
      let image = moralisItem?.normalized_metadata?.image
      const contractAddress = moralisItem?.token_address
      const tokenId = moralisItem.token_id
      const tokenUrl = this.formatTokenUri(moralisItem?.token_uri || '', contractAddress, tokenId)

      if (image) {
        image = detectUrl(image, '')
      }

      return {
        tokenId, // '25',
        tokenUrl, // 'https://metadata.keyring.app/nft/metadata/0x0bc20812108efd604884bfe884b5ad32e6a2553a/25',
        contractAddress, // '0x0bc20812108efd604884bfe884b5ad32e6a2553a',
        amount: moralisItem?.amount || '1',
        owners: moralisItem?.owners || moralisItem?.owner_of ? [moralisItem?.owner_of] : [], // e.g. ['0x81aabb9abc31e6c0ec5fd30ee790a9f0e3089fe6'],
        blockchain: chainId, // 'polygon',
        collectionName: moralisItem?.name?.trim() || '', // 'degitaltic ticket',
        contractType: upperCase(moralisItem?.contract_type || ''), // 'ERC721',
        imageUrl: image,
        animationUrl: moralisItem?.normalized_metadata?.animation_url, // 'https://ipfs.pantograph.app/ipfs/QmUWQ8LMEapfqJ58BEBBajqWuYAkcP6jZaaFw3cdxzTvAG?filename=nft-3.jpg',
        name: moralisItem?.normalized_metadata?.name?.trim() || moralisItem.name?.trim(), // 'degitaltic ticket',
        quantity: moralisItem?.amount || '',
        symbol: upperCase(moralisItem?.symbol || ''), // 'DTT',

        traits: moralisItem?.normalized_metadata?.attributes || [], // [{trait_type: 'TITLE', value: 'Admission free. One drink service.'}],
        spam_score: moralisItem?.collection?.spam_score || null, // spam_score>= SPAM_SCORE is NFT spam
        audioUrl: moralisItem.audio_url || moralisItem?.extra_metadata?.audio_original_url,
        description: moralisItem?.normalized_metadata?.description,
        possibleSpam: moralisItem?.possible_spam || false,
      }
    })
    // const arrFetchMetaData = await this.getRealtimeMetaNFT(chainId, data)

    // arrFetchMetaData.forEach((tokenUrl: string, index: number) => {
    //   if (tokenUrl) {
    //     const nft = data[index]

    //     data[index].tokenUrl = this.formatTokenUri(tokenUrl, nft.contractAddress!, nft.tokenId!)
    //   }
    // })

    return data as INftDetail[]
  }

  static async getListNFTsByOwner(query: QueryNFTByOwner) {
    const { pageSize = 40, chainId, tokenAddresses, address, pageToken } = query

    const queryObj: any = {
      chain: toHex(Number(chainId?.toString())),
      limit: pageSize,
      normalizeMetadata: true,
    }

    if (tokenAddresses && tokenAddresses?.length > 0) {
      queryObj.token_addresses = tokenAddresses
    }
    if (pageToken) {
      queryObj.cursor = pageToken
    }

    const apiPath = `/${address}/nft?${stringify(queryObj)}`

    const nftRes = await fetcher({
      url: apiPath,
      method: 'GET',
    })

    console.log('====================================')
    console.log({ nftRes })
    console.log('====================================')

    if (nftRes) {
      const listNftWithAnkrFormat = await this.formatNftDataByAnkrFormat(nftRes?.data?.result, chainId)

      return {
        assets: listNftWithAnkrFormat as INftDetail[],
        nextPageToken: nftRes?.data?.cursor as string | undefined,
      }
    }

    return {
      assets: [] as INftDetail[],
      nextPageToken: undefined,
    }
  }
}

export default MoralisService
