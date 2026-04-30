import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AiohaProvider } from '@aioha/providers/react'
import { HiveSignerCb } from '@aioha/react-ui'
import { aioha } from './lib/aioha'
import { wagmiConfig } from './lib/wagmi'
import { MagiWithBtc } from './lib/btc'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'

const queryClient = new QueryClient()

export const App = () => {
  if (window.location.pathname === '/hivesigner') {
    return (
      <div className="dark">
        <div className="min-h-screen min-w-full dark:bg-gray-800">
          <HiveSignerCb />
        </div>
      </div>
    )
  }
  return (
    <ErrorBoundary>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <AiohaProvider aioha={aioha}>
            <MagiWithBtc>
              <Layout />
            </MagiWithBtc>
          </AiohaProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}
