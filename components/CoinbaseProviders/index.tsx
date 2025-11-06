'use client'

import type { ReactNode } from 'react'

import { base } from 'wagmi/chains'
import { OnchainKitProvider } from '@coinbase/onchainkit'

import { APP_CONFIG } from '@/configs/app'

export function CoinbaseProviders(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={APP_CONFIG.CDP_API_KEY_ID}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          logo: '/x402-icon-blue.png',
          name: 'Next Advanced x402 Demo',
        },
      }}
    >
      {props.children}
    </OnchainKitProvider>
  )
}
