import { useAppKitAccount } from '@reown/appkit/react'
import { appKit } from '../../lib/wagmi'
import { logInfo } from '../../lib/log'

export const ConnectEth = () => {
  const { address, isConnected } = useAppKitAccount({ namespace: 'eip155' })
  return (
    <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-2">
      <h3 className="font-medium text-sm">Ethereum (eip155)</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Connect any EVM wallet via the Reown AppKit modal. MagiProvider auto-binds via Wagmi <code>useConnectorClient</code>.
      </p>
      <p className="text-xs font-mono break-all text-gray-700 dark:text-gray-200">
        {isConnected && address ? address : 'not connected'}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            appKit.open({ view: 'Connect', namespace: 'eip155' })
            logInfo('appKit.open', { namespace: 'eip155' })
          }}
          className="px-3 py-1.5 text-sm rounded bg-[#f44444] hover:bg-[#f55555] text-white transition"
        >
          {isConnected ? 'Manage' : 'Connect Ethereum'}
        </button>
        {isConnected && (
          <button
            type="button"
            onClick={async () => {
              await appKit.disconnect('eip155')
              logInfo('appKit.disconnect', { namespace: 'eip155' })
            }}
            className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  )
}
