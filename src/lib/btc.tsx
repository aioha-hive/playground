import { ReactNode, useMemo } from 'react'
import { useAppKitProvider, useAppKitAccount } from '@reown/appkit/react'
import type { BitcoinConnector } from '@reown/appkit-adapter-bitcoin'
import { MagiProvider } from './magiProvider'
import type { BtcClient } from '@aioha/magi'
import { magi } from './magi'

export const useBtcClient = (): BtcClient | undefined => {
  const { walletProvider } = useAppKitProvider<BitcoinConnector>('bip122')
  const { address, isConnected } = useAppKitAccount({ namespace: 'bip122' })
  return useMemo<BtcClient | undefined>(() => {
    if (!walletProvider || !isConnected || !address) return undefined
    return {
      address,
      signMessage: (message: string) => walletProvider.signMessage({ address, message })
    }
  }, [walletProvider, address, isConnected])
}

export const MagiWithBtc = ({ children }: { children: ReactNode }) => {
  const btcClient = useBtcClient()
  return (
    <MagiProvider magi={magi} btcClient={btcClient}>
      {children}
    </MagiProvider>
  )
}
