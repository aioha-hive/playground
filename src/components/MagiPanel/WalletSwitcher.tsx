import { Wallet } from '@aioha/magi'
import { useMagi } from '../../lib/magiProvider'
import { magi } from '../../lib/magi'
import { logInfo } from '../../lib/log'

const OPTIONS: { value: Wallet | 'none'; label: string; hint: string }[] = [
  { value: 'none', label: 'None', hint: 'Clear active wallet' },
  { value: Wallet.Hive, label: 'Hive', hint: 'Requires Aioha login' },
  { value: Wallet.Ethereum, label: 'Ethereum', hint: 'Requires AppKit eip155 connection' },
  { value: Wallet.Bitcoin, label: 'Bitcoin', hint: 'Requires AppKit bip122 connection' },
  { value: Wallet.ViewOnly, label: 'View only', hint: 'Use form below to set DID' }
]

export const WalletSwitcher = () => {
  const { wallet } = useMagi()
  return (
    <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-2">
      <h3 className="font-medium text-sm">Active wallet override</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        MagiProvider auto-routes based on the connected source. Use this only to override.
      </p>
      <div className="flex flex-wrap gap-1">
        {OPTIONS.map((o) => {
          const isActive = (o.value === 'none' && !wallet) || o.value === wallet
          return (
            <button
              key={o.value}
              type="button"
              title={o.hint}
              onClick={() => {
                magi.setWallet(o.value === 'none' ? undefined : o.value)
                logInfo('magi.setWallet', { wallet: o.value })
              }}
              className={`text-xs px-3 py-1.5 rounded border transition ${
                isActive
                  ? 'bg-[#f44444] text-white border-[#f44444]'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
