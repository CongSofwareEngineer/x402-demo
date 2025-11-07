'use client'
import React from 'react'
import { formatUnits } from 'viem'
import BigNumber from 'bignumber.js'
import Image from 'next/image'

import NFTBalance from './NFTBalance'
import NFTBalanceByUSDT from './NFTBalanceByUSDT'

import { COINBASE_CONFIG } from '@/configs/app'
import { copyToClipboard, ellipsisAddress } from '@/utils/functions'
import useInfoPayment from '@/hooks/tank-query/useInfoPayment'
import MyLoading from '@/components/MyLoading'
import { images } from '@/configs/images'

export default function DemoPage() {
  const { data, isLoading } = useInfoPayment()

  const renderVolume = () => {
    if (data?.total_amount) {
      const valueEther = formatUnits(BigInt(data?.total_amount), 6)

      if (BigNumber(valueEther).gt(1000)) {
        const value = BigNumber(valueEther).div(1000).decimalPlaces(2, BigNumber.ROUND_DOWN).toFormat()

        return `${value}K`
      }

      return BigNumber(valueEther).toFormat()
    }

    return <></>
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>X402 Premium</h1>
              <div className='flex items-center space-x-2 text-gray-600 mb-4'>
                <div className='w-4 h-4 rounded-full border-2 border-gray-400' />
                <span className='text-sm'>{typeof window !== 'undefined' && window.location.origin}</span>
              </div>
              <p className='text-gray-500'>No Description</p>
            </div>
            <div className='text-right'>
              <div className='flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2'>
                <div className='w-4 h-4 bg-blue-500 rounded' />
                <span className='font-mono cursor-pointer text-sm !text-black' onClick={() => copyToClipboard(COINBASE_CONFIG.PAY_TO)}>
                  Addresses {ellipsisAddress(COINBASE_CONFIG.PAY_TO, 6, 8)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Activity</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Transactions Card */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-gray-600 text-lgfont-medium mb-2'>Transactions</h3>
                  <div className='flex items-baseline space-x-2'>
                    {isLoading ? (
                      <MyLoading />
                    ) : (
                      <span className='text-2xl font-bold text-gray-900'>{BigNumber(data?.total_transactions || '0').toFormat()}</span>
                    )}
                  </div>
                </div>
                <div className='  rounded-lg flex items-center justify-center'>
                  <Image alt='Icon Info Detail' height={100} src={images.iconTotalTransaction} width={100} />
                </div>
              </div>
            </div>

            {/* Volume Card */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-gray-600 text-lg font-medium mb-2 '>Volume</h3>
                  <div className='flex items-baseline space-x-2'>
                    {isLoading ? <MyLoading /> : <span className='text-2xl font-bold text-gray-900'>${renderVolume()}</span>}
                  </div>
                </div>
                <div className='  rounded-lg flex items-center justify-center'>
                  <Image alt='Icon Info Detail' height={100} src={images.iconTotalVolume} width={100} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Resources</h2>

          <NFTBalance />
          <NFTBalanceByUSDT />
          {/* <NFTBalance /> */}
        </div>
      </div>
    </div>
  )
}
