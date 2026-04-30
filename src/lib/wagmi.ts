import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { mainnet, bitcoin } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'YOUR_REOWN_PROJECT_ID'

export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet],
  projectId
})

export const bitcoinAdapter = new BitcoinAdapter({
  projectId
})

export const appKit = createAppKit({
  adapters: [wagmiAdapter, bitcoinAdapter],
  networks: [mainnet, bitcoin],
  projectId,
  metadata: {
    name: 'Aioha Playground',
    description: 'Aioha + Magi live demo',
    url: window.location.origin,
    icons: []
  }
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
