import { useState } from 'react'
import { useAioha } from '@aioha/providers/react'
import { SignMessage } from './SignMessage'
import { EncryptMemo } from './EncryptMemo'
import { TransferForm } from './TransferForm'
import { VoteForm } from './VoteForm'
import { CustomJsonForm } from './CustomJsonForm'
import { ClaimRewards } from './ClaimRewards'
import { OpBuilder } from './OpBuilder'

const TABS = [
  { id: 'sign', label: 'Sign message', Comp: SignMessage },
  { id: 'memo', label: 'Encrypt / decrypt', Comp: EncryptMemo },
  { id: 'transfer', label: 'Transfer', Comp: TransferForm },
  { id: 'vote', label: 'Vote', Comp: VoteForm },
  { id: 'custom', label: 'Custom JSON', Comp: CustomJsonForm },
  { id: 'rewards', label: 'Claim rewards', Comp: ClaimRewards },
  { id: 'builder', label: 'Op builder', Comp: OpBuilder }
] as const

type TabId = typeof TABS[number]['id']

export const AiohaOps = () => {
  const [active, setActive] = useState<TabId>('sign')
  const { user } = useAioha()
  const Comp = TABS.find((t) => t.id === active)!.Comp
  return (
    <div>
      {!user && (
        <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded px-3 py-2 mb-3">
          Connect a wallet first — operations require an Aioha session.
        </p>
      )}
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
  )
}
