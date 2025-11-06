'use client'
import React from 'react'
import { formatUnits } from 'viem'
import BigNumber from 'bignumber.js'

import NFTBalance from './NFTBalance'
import NFTBalanceByUSDT from './NFTBalanceByUSDT'

import { COINBASE_CONFIG } from '@/configs/app'
import { copyToClipboard, ellipsisAddress } from '@/utils/functions'
import useInfoPayment from '@/hooks/tank-query/useInfoPayment'
import MyLoading from '@/components/MyLoading'

export default function DemoPage() {
  const { data, isLoading } = useInfoPayment()

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>x402demo</h1>
              <div className='flex items-center space-x-2 text-gray-600 mb-4'>
                <div className='w-4 h-4 rounded-full border-2 border-gray-400' />
                <span className='text-sm'>{typeof window !== 'undefined' && window.location.origin}</span>
              </div>
              <p className='text-gray-500'>No Description</p>
            </div>
            <div className='text-right'>
              <div className='text-red-500 font-medium mb-2'>Address nhận tiền phí</div>
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
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-gray-600 text-sm font-medium mb-2'>Transactions</h3>
                  <div className='flex items-baseline space-x-2'>
                    {isLoading ? (
                      <MyLoading />
                    ) : (
                      <span className='text-2xl font-bold text-gray-900'>{BigNumber(data?.total_transactions || '0').toFormat()}</span>
                    )}

                    <span className='text-red-500 text-sm font-medium'>Số lượng transaction</span>
                  </div>
                </div>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
                  </svg>
                </div>
              </div>

              {/* Simple Chart Representation */}
              <div className='mt-4 flex items-end space-x-1 h-16'>
                {[20, 35, 25, 40, 30, 45, 35, 50, 40, 55, 45, 60].map((height, index) => (
                  <div key={index} className='bg-blue-200 rounded-t flex-1' style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            {/* Volume Card */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-gray-600 text-sm font-medium mb-2'>Volume</h3>
                  <div className='flex items-baseline space-x-2'>
                    {isLoading ? (
                      <MyLoading />
                    ) : (
                      <span className='text-2xl font-bold text-gray-900'>
                        {BigNumber(formatUnits(BigInt(data?.total_amount?.toString() || '0'), 6)).toFormat()}
                      </span>
                    )}

                    <span className='text-red-500 text-sm font-medium'>Số lượng USDC đã nhận</span>
                  </div>
                </div>
                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>

              {/* Simple Chart Representation */}
              <div className='mt-4 flex items-end space-x-1 h-16'>
                {[30, 25, 45, 35, 50, 40, 60, 45, 55, 40, 65, 50].map((height, index) => (
                  <div key={index} className='bg-purple-200 rounded-t flex-1' style={{ height: `${height}%` }} />
                ))}
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
