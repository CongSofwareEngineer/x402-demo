'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { base } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
// import { SolanaAdapter } from '@reown/appkit-adapter-solana'

import { networks, projectId, wagmiAdapter } from '@/configs/appkit'
import { META_DATA_APP } from '@/configs/app'

// export const solanaAdapter = new SolanaAdapter()

// Set up queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
})

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'x402-demo',
  description: 'X402 demo',
  url: META_DATA_APP.url, // origin must match your domain & subdomain
  icons: [META_DATA_APP.icon],
}

// Create the modal
const modal = createAppKit({
  // adapters: [wagmiAdapter, solanaAdapter],
  adapters: [wagmiAdapter],
  projectId,
  networks: [...networks],
  defaultNetwork: base,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: ['google'],
  },
  enableInjected: true,
  enableNetworkSwitch: true,
  enableWalletConnect: true,
  enableEIP6963: true,
  enableReconnect: true,
  enableWallets: true,
})

function AppkitProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default AppkitProvider
