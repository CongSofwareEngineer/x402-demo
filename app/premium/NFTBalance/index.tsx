import React, { useEffect, useState, useTransition } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'
import { exact } from 'x402/schemes'
import { preparePaymentHeader } from 'x402/client'
import { getNetworkId } from 'x402/shared'
import { PaymentPayload } from 'x402/types'
import { useAppKit, useAppKitNetwork } from '@reown/appkit/react'

import DropItem from '../DropItem'

import { INftDetail } from '@/types/web3'
import fetcher from '@/configs/fetcher'
import MyLoading from '@/components/MyLoading'
import { COINBASE_CONFIG } from '@/configs/app'
import { copyToClipboard } from '@/utils/functions'
import { getChainTypeFromChainId } from '@/utils/chain'
import SelectFacilitator from '@/components/SelectFacilitator'
import { FacilitatorType } from '@/server/x402'

function NFTBalance() {
  const [isPending, startTransition] = useTransition()
  const { address, isConnected } = useAccount()
  const { signTypedDataAsync } = useSignTypedData()
  const { open } = useAppKit()
  const { chainId } = useAppKitNetwork()

  const [dataListNFT, setDataListNFT] = useState<INftDetail[]>([])
  const [error, setError] = useState('')
  const [addressScan, setAddressScan] = useState('')
  const [typeFacilitator, setTypeFacilitator] = useState<FacilitatorType>('base')

  useEffect(() => {
    setAddressScan(address || '')
  }, [address])

  const handleGetData = async () => {
    if (isPending) return
    setDataListNFT([])
    setError('')
    startTransition(async () => {
      try {
        const chainType = getChainTypeFromChainId(chainId?.toString() || '')

        const resRequire = await fetcher({
          url: `/api/x402/${typeFacilitator}/${chainType}/nft`,
          method: 'POST',
        })

        const paymentRequirements = resRequire?.data?.accepts[0]

        const unSignedPaymentHeader = preparePaymentHeader(address!, 1, paymentRequirements)

        const eip712Data = {
          types: {
            TransferWithAuthorization: [
              { name: 'from', type: 'address' },
              { name: 'to', type: 'address' },
              { name: 'value', type: 'uint256' },
              { name: 'validAfter', type: 'uint256' },
              { name: 'validBefore', type: 'uint256' },
              { name: 'nonce', type: 'bytes32' },
            ],
          },
          domain: {
            name: paymentRequirements.extra?.name,
            version: paymentRequirements.extra?.version,
            chainId: getNetworkId(paymentRequirements.network),
            verifyingContract: paymentRequirements.asset as `0x${string}`,
          },
          primaryType: 'TransferWithAuthorization' as const,
          message: unSignedPaymentHeader.payload.authorization,
        }

        const signature = await signTypedDataAsync(eip712Data)

        const paymentPayload: PaymentPayload = {
          ...unSignedPaymentHeader,
          payload: {
            ...unSignedPaymentHeader.payload,
            signature,
          },
        }
        const payment: string = exact.evm.encodePayment(paymentPayload)

        const res = await fetcher({
          url: `/api/x402/${typeFacilitator}/${chainType}/nft`,
          method: 'POST',
          headers: {
            'X-PAYMENT': payment,
          },
          body: {
            address,
          },
        })

        if (res?.data?.listNFT) {
          setDataListNFT(res.data.listNFT)
        }
        if (res?.data?.error) {
          setError(res?.data?.error)
        }
      } catch (error: any) {
        if (error?.message?.includes('Missing or invalid parameters')) {
          setError('User rejected methods.')
        }
        setError('Settlement failed')
      }
    })
  }

  return (
    <DropItem desc='Get user NFT collection data' method='POST' title='nft-balance'>
      {isConnected ? (
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <div className='block mb-2 font-medium !text-gray-700'>Address to scan:</div>
              <input
                className='w-full border border-gray-300 rounded-md p-2'
                placeholder='Enter wallet address...'
                value={addressScan}
                onChange={(e) => setAddressScan(e.target.value)}
              />
            </div>
            <div>
              <div className='block mb-2 font-medium !text-gray-700'>Facilitator Type:</div>
              <SelectFacilitator value={typeFacilitator} onChange={setTypeFacilitator} />
            </div>
          </div>
          <div className='w-full border-[1px] border-blue-700 justify-center flex items-center shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.1)] py-3 rounded-[6px] mt-6'>
            <div
              className={`w-full flex justify-center items-center gap-3 font-mono text-sm !text-black  ${isPending ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer '}`}
              onClick={handleGetData}
            >
              {isPending && <MyLoading />}
              Fetch USDC (${COINBASE_CONFIG.PAY_AMOUNT})
            </div>
          </div>

          {/* Display JSON Data */}
          {dataListNFT.length > 0 && (
            <div className='w-full bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-lg font-semibold text-gray-800'>NFT Balance Response</h3>
                <div className='flex items-center space-x-2'>
                  <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded'>{dataListNFT.length} items</span>
                  <button
                    className='bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded transition-colors duration-200 flex items-center gap-1'
                    title='Copy JSON to clipboard'
                    onClick={() => {
                      copyToClipboard(JSON.stringify(dataListNFT, null, 2))
                    }}
                  >
                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                      />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>

              <div className='bg-white rounded border p-3 max-h-96 overflow-auto'>
                <pre className='text-sm text-gray-700 whitespace-pre-wrap'>{JSON.stringify(dataListNFT, null, 2)}</pre>
              </div>
            </div>
          )}

          {error && <div className='w-full !text-red-600     p-4'>ERROR: {JSON.stringify(error)}</div>}
        </div>
      ) : (
        <div className='mt-6 pt-6 border-t border-gray-200'>
          <div className='flex items-center justify-center py-8'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path d='M13 10V3L4 14h7v7l9-11h-7z' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
                </svg>
              </div>
              <p className='text-gray-600 mb-4'>Connect wallet</p>
              <button
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200'
                onClick={() => open()}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </DropItem>
  )
}

export default NFTBalance
