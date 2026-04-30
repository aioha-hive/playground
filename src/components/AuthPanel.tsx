import { useEffect, useState } from 'react'
import { AiohaModal } from '@aioha/react-ui'
import { useAioha } from '@aioha/providers/react'
import { Aioha, KeyTypes, Providers } from '@aioha/aioha'
import { logEvent, logInfo } from '../lib/log'

const safeExpiration = (aioha: Aioha): number | undefined => {
  const user = aioha.getCurrentUser()
  if (!user) return undefined
  try {
    return aioha.getLoginExpiration(user)
  } catch {
    return undefined
  }
}

const PROVIDER_LABELS: Record<Providers, string> = {
  [Providers.Keychain]: 'Keychain',
  [Providers.HiveSigner]: 'HiveSigner',
  [Providers.HiveAuth]: 'HiveAuth',
  [Providers.Ledger]: 'Ledger',
  [Providers.PeakVault]: 'PeakVault',
  [Providers.MetaMaskSnap]: 'MetaMask Snap',
  [Providers.ViewOnly]: 'View only',
  [Providers.Custom]: 'Custom'
}

export const AuthPanel = () => {
  const { aioha, user, provider, otherUsers } = useAioha()
  const [open, setOpen] = useState(false)
  const [expiration, setExpiration] = useState<number | undefined>(safeExpiration(aioha))

  useEffect(() => {
    setExpiration(safeExpiration(aioha))
    const onConnect = () => logEvent('aioha:connect', { user: aioha.getCurrentUser(), provider: aioha.getCurrentProvider() })
    const onDisconnect = () => logEvent('aioha:disconnect')
    const onAccountChanged = () => logEvent('aioha:account_changed', { user: aioha.getCurrentUser() })
    aioha.on('connect', onConnect)
    aioha.on('disconnect', onDisconnect)
    aioha.on('account_changed', onAccountChanged)
    return () => {
      aioha.off('connect', onConnect)
      aioha.off('disconnect', onDisconnect)
      aioha.off('account_changed', onAccountChanged)
    }
  }, [aioha, user])

  const logout = async () => {
    await aioha.logout()
    logInfo('aioha.logout')
  }

  const switchUser = async (target: string) => {
    aioha.switchUser(target)
    logInfo('aioha.switchUser', { target })
  }

  const others = Object.keys(otherUsers).filter((u) => u !== user)

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <header className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold">Authentication</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            All Aioha providers via the production-ready <code>@aioha/react-ui</code> modal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 text-sm rounded bg-[#f44444] hover:bg-[#f55555] text-white transition"
        >
          {user ? 'Manage account' : 'Connect wallet'}
        </button>
      </header>
      <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <Stat label="User" value={user ?? '—'} mono />
        <Stat label="Provider" value={provider ? PROVIDER_LABELS[provider] : '—'} />
        <Stat
          label="Login expires"
          value={expiration ? new Date(expiration).toLocaleString() : '—'}
        />
      </div>
      {others.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Other persisted accounts</p>
          <div className="flex flex-wrap gap-2">
            {others.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => switchUser(u)}
                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Switch to {u}
              </button>
            ))}
          </div>
        </div>
      )}
      {user && (
        <div className="px-5 pb-4">
          <button
            type="button"
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            Logout
          </button>
        </div>
      )}
      <AiohaModal
        displayed={open}
        loginOptions={{ msg: 'Aioha Playground login at ' + new Date().toISOString(), keyType: KeyTypes.Posting }}
        arrangement="grid"
        forceShowProviders={[Providers.Keychain, Providers.PeakVault, Providers.MetaMaskSnap]}
        onLogin={(r) => logEvent('aioha.login', r)}
        onClose={setOpen}
      />
    </section>
  )
}

const Stat = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="bg-gray-50 dark:bg-gray-900/40 rounded border border-gray-200 dark:border-gray-700 px-3 py-2">
    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
    <div className={`text-sm mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</div>
  </div>
)
