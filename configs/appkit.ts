import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork, avalanche, base, polygon } from '@reown/appkit/networks'

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'a1eb9d94568537fd74a6753ff2c83dca'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// export const networks = [base, ...[sei, avalanche, polygon, peaq, iotex]] as [AppKitNetwork, ...AppKitNetwork[]]
export const networks = [base, ...[avalanche, polygon]] as [AppKitNetwork, ...AppKitNetwork[]]

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
