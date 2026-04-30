import { useEffect, useState } from 'react'
import { useMagi } from '../../lib/magiProvider'
import { Wallet } from '@aioha/magi'
import { magi } from '../../lib/magi'
import { logEvent } from '../../lib/log'
import { ApiNetSettings } from './ApiNetSettings'
import { ConnectEth } from './ConnectEth'
import { ConnectBtc } from './ConnectBtc'
import { WalletSwitcher } from './WalletSwitcher'
import { ViewOnlyForm } from './ViewOnlyForm'
import { MagiTransfer } from './MagiTransfer'
import { MagiUnmap } from './MagiUnmap'
import { MagiStake } from './MagiStake'
import { MagiContractCall } from './MagiContractCall'
import { MagiOpBuilder } from './MagiOpBuilder'

const TABS = [
  { id: 'transfer', label: 'Transfer', Comp: MagiTransfer },
  { id: 'unmap', label: 'Unmap', Comp: MagiUnmap },
  { id: 'stake', label: 'Stake / unstake', Comp: MagiStake },
  { id: 'call', label: 'Contract call', Comp: MagiContractCall },
  { id: 'builder', label: 'Op builder', Comp: MagiOpBuilder }
] as const

const WALLET_LABEL: Record<Wallet, string> = {
  [Wallet.Hive]: 'Hive (via Aioha)',
  [Wallet.Ethereum]: 'Ethereum (via Viem)',
  [Wallet.Bitcoin]: 'Bitcoin (via AppKit bip122)',
  [Wallet.ViewOnly]: 'View only'
}

export const MagiPanel = () => {
  const { user, wallet } = useMagi()
  const [active, setActive] = useState<typeof TABS[number]['id']>('transfer')

  useEffect(() => {
    const onWalletChanged = () => logEvent('magi:wallet_changed', { wallet: magi.getWallet(), user: magi.getUser() })
    const onSignTx = () => logEvent('magi:sign_tx_request')
    magi.on('wallet_changed', onWalletChanged)
    magi.on('sign_tx_request', onSignTx)
    return () => {
      magi.off('wallet_changed', onWalletChanged)
      magi.off('sign_tx_request', onSignTx)
    }
  }, [])

  const Comp = TABS.find((t) => t.id === active)!.Comp

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-2 text-sm">
        <Stat label="Wallet" value={wallet ? WALLET_LABEL[wallet] : '— none —'} />
        <Stat label="User" value={user ?? '—'} mono />
        <Stat label="Net ID" value={magi.getNetId() ?? 'vsc-mainnet'} />
      </div>

      <ApiNetSettings />

      <div className="grid md:grid-cols-2 gap-3">
        <ConnectEth />
        <ConnectBtc />
      </div>

      <WalletSwitcher />
      <ViewOnlyForm />

      <div>
        <nav className="flex flex-wrap gap-1 mb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`text-xs px-3 py-1.5 rounded border transition ${
                active === t.id
                  ? 'bg-[#f44444] text-white border-[#f44444]'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <Comp />
      </div>
    </div>
  )
}

const Stat = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="bg-gray-50 dark:bg-gray-900/40 rounded border border-gray-200 dark:border-gray-700 px-3 py-2">
    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
    <div className={`text-sm mt-0.5 ${mono ? 'font-mono break-all' : ''}`}>{value}</div>
  </div>
)
