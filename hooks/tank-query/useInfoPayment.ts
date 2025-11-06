import { useQuery } from '@tanstack/react-query'

import fetcher from '@/configs/fetcher'
import { QUERY_KEY } from '@/constants/reactQuery'

const getData = async (): Promise<{
  total_transactions: number
  total_amount: number
  unique_buyers: number
  unique_sellers: number
  latest_block_timestamp: string
}> => {
  const res = await fetcher({
    url: '/api/x402/scan-info',
  })

  return res?.data as {
    total_transactions: number
    total_amount: number
    unique_buyers: number
    unique_sellers: number
    latest_block_timestamp: string
  }
}

const useInfoPayment = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [QUERY_KEY.getInfoPayment],
    queryFn: getData,
  })

  return {
    isLoading,
    isFetching,
    data: data,
    refetch,
  }
}

export default useInfoPayment
