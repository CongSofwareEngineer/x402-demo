import { COINBASE_CONFIG } from '@/configs/app'
import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'

const fetcher = async (params: IFetch) => {
  let url = 'https://www.x402scan.com/api/trpc/' + params.url

  url = url.replace('//', '/')

  return fetcherConfig({
    ...params,
    url,
  })
}

class X402ScanService {
  static async getFirstTransferTimestamp(address?: string): Promise<string> {
    const params = { '0': { json: { recipients: { include: [address || COINBASE_CONFIG.PAY_TO] } } } }

    const res = await fetcher({
      url: '/public.stats.firstTransferTimestamp?batch=1&input=' + encodeURIComponent(JSON.stringify(params)),
    })

    return res?.data?.[0]?.result?.data?.json
  }

  static async getInfo(): Promise<string> {
    const params = { json: { recipients: { include: [COINBASE_CONFIG.PAY_TO] }, timeframe: 30 } }

    const res = await fetcher({
      url: '/public.stats.overall?input=' + encodeURIComponent(JSON.stringify(params)),
    })

    console.log({ res: res?.data?.data?.json })

    return res?.data?.result?.data?.json
  }
}

export default X402ScanService
