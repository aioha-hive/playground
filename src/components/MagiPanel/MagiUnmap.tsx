import { Asset } from '@aioha/magi'
import { useMagi } from '../../lib/magiProvider'
import { magi } from '../../lib/magi'
import { logInfo, runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { useDryRun } from '../DryRunToggle'
import { Field, FormCard, Input } from '../shared/FormCard'
import { MagiAssetSelect } from '../shared/AssetSelect'

export const MagiUnmap = () => {
  const [to, setTo] = usePersistedState('magi.unmap.to', '')
  const [amount, setAmount] = usePersistedState('magi.unmap.amount', '0.001')
  const [asset, setAsset] = usePersistedState<Asset>('magi.unmap.asset', Asset.hbd)
  const [memo, setMemo] = usePersistedState('magi.unmap.memo', '')
  const [dryRun] = useDryRun()
  const { user } = useMagi()

  const submit = async () => {
    const amt = parseFloat(amount)
    if (!Number.isFinite(amt) || amt <= 0) {
      logInfo('magi.unmap skipped', { reason: 'amount must be > 0' })
      return
    }
    if (dryRun) {
      logInfo('magi.unmap (dry run — not broadcast)', {
        from: user,
        operation: { type: 'withdraw', payload: { to, amount: amt, asset, memo } }
      })
      return
    }
    await runOp('magi.unmap', () => magi.unmap(to, amt, asset, memo))
  }

  return (
    <FormCard
      title="magi.unmap"
      description="Withdraw tokens from Magi back to a Hive account."
      submitLabel={dryRun ? 'Show op' : 'Sign & broadcast'}
      onSubmit={submit}
    >
      <Field label="To (Hive username)">
        <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="alice" />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Amount">
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
        </Field>
        <MagiAssetSelect value={asset} onChange={setAsset} />
      </div>
      <Field label="Memo (optional)">
        <Input value={memo} onChange={(e) => setMemo(e.target.value)} />
      </Field>
    </FormCard>
  )
}
