'use client'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import React from 'react'

export default function Header() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()

  console.log({ isConnected })

  const truncateAddress = (addr: string) => {
    if (!addr) return ''

    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className='bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo and Title */}
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center'>
              <span className='text-blue-600 font-bold text-xl'>X</span>
            </div>
            <div>
              <h1 className='text-white text-xl font-bold'>X402 Demo</h1>
              <p className='text-blue-200 text-sm'>Micropayment Protocol</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className='hidden md:flex items-center space-x-8' />

          {/* Wallet Connection */}
          <div className='flex items-center space-x-4'>
            {!isConnected ? (
              <button
                className='bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 shadow-md'
                onClick={() => open({ view: 'Connect' })}
              >
                Connect Wallet
              </button>
            ) : (
              <div className='flex items-center space-x-3'>
                <div className='bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2'>
                  <div className='flex items-center space-x-2'>
                    <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse' />
                    <span className='text-white font-mono text-sm'>{truncateAddress(address || '')}</span>
                  </div>
                </div>
                <button
                  className='bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200'
                  onClick={() => disconnect()}
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button className='text-white p-2'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path d='M4 6h16M4 12h16M4 18h16' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
