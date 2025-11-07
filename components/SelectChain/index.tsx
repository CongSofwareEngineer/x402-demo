import { useAppKit, useAppKitNetwork } from '@reown/appkit/react'
import React, { useMemo } from 'react'
import Image from 'next/image'

import { CHAIN_SUPPORT_X402 } from '@/constants/x402'

function SelectChain() {
  const { chainId } = useAppKitNetwork()
  const { open } = useAppKit()
  const chainCurrent = useMemo(() => {
    return CHAIN_SUPPORT_X402[chainId as keyof typeof CHAIN_SUPPORT_X402]
  }, [chainId])

  return (
    <div
      className='bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200'
      onClick={() => open({ view: 'Networks' })}
    >
      <div className='flex items-center space-x-2'>
        <div className='w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50' />
        <span className='text-white font-medium text-sm'>{chainCurrent?.name || 'Unknown'}</span>
        {chainCurrent?.iconChain && (
          <Image alt={chainCurrent?.name} className='!rounded-full ring-2 ring-white/30' height={18} src={chainCurrent?.iconChain} width={18} />
        )}
        <svg className='w-4 h-4 text-white/70 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path d='M19 9l-7 7-7-7' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
        </svg>
      </div>
    </div>
  )
}

export default SelectChain
