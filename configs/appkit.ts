import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { avalanche, base, iotex, peaq, polygon, sei } from '@reown/appkit/networks'

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'a1eb9d94568537fd74a6753ff2c83dca'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [base, sei, avalanche, polygon, peaq, iotex]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
})

export const config = wagmiAdapter.wagmiConfig
