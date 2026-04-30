import { Asset, KeyTypes } from '@aioha/aioha'
import { aioha } from '../../lib/aioha'
import { logInfo, runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { useDryRun } from '../DryRunToggle'
import { useAioha } from '@aioha/providers/react'
import { Field, FormCard, Input } from '../shared/FormCard'
import { AiohaAssetSelect } from '../shared/AssetSelect'

export const TransferForm = () => {
  const [to, setTo] = usePersistedState('transfer.to', '')
  const [amount, setAmount] = usePersistedState('transfer.amount', '0.001')
  const [currency, setCurrency] = usePersistedState<Asset>('transfer.currency', Asset.HIVE)
  const [memo, setMemo] = usePersistedState('transfer.memo', '')
  const [dryRun] = useDryRun()
  const { user } = useAioha()

  const submit = async () => {
    const amt = parseFloat(amount)
    if (!Number.isFinite(amt) || amt <= 0) {
      logInfo('aioha.transfer skipped', { reason: 'amount must be > 0' })
      return
    }
    if (dryRun) {
      logInfo('aioha.transfer (dry run — not broadcast)', {
        operation: ['transfer', { from: user, to, amount: `${amt.toFixed(3)} ${currency}`, memo }],
        keyType: KeyTypes.Active
      })
      return
    }
    await runOp('aioha.transfer', () => aioha.transfer(to, amt, currency, memo))
  }

  return (
    <FormCard
      title="aioha.transfer"
      description={dryRun ? 'Dry run — operation will be logged, not broadcast.' : 'Live broadcast — funds will move on mainnet.'}
      submitLabel={dryRun ? 'Show op' : 'Broadcast transfer'}
      onSubmit={submit}
    >
      <Field label="To (Hive username)">
        <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="alice" />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Amount">
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
        </Field>
        <AiohaAssetSelect value={currency} onChange={setCurrency} />
      </div>
      <Field label="Memo (optional)">
        <Input value={memo} onChange={(e) => setMemo(e.target.value)} />
      </Field>
    </FormCard>
  )
}
