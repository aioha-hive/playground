import { Asset } from '@aioha/magi'
import { useMagi } from '../../lib/magiProvider'
import { magi } from '../../lib/magi'
import { logInfo, runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { useDryRun } from '../DryRunToggle'
import { Field, FormCard, Input } from '../shared/FormCard'
import { MagiAssetSelect } from '../shared/AssetSelect'

export const MagiTransfer = () => {
  const [to, setTo] = usePersistedState('magi.transfer.to', '')
  const [amount, setAmount] = usePersistedState('magi.transfer.amount', '0.001')
  const [asset, setAsset] = usePersistedState<Asset>('magi.transfer.asset', Asset.hbd)
  const [memo, setMemo] = usePersistedState('magi.transfer.memo', '')
  const [dryRun] = useDryRun()
  const { user, wallet } = useMagi()

  const submit = async () => {
    const amt = parseFloat(amount)
    if (!Number.isFinite(amt) || amt <= 0) {
      logInfo('magi.transfer skipped', { reason: 'amount must be > 0' })
      return
    }
    if (dryRun) {
      logInfo('magi.transfer (dry run — not signed/broadcast)', {
        from: user,
        wallet,
        operation: { type: 'transfer', payload: { to, amount: amt, asset, memo } }
      })
      return
    }
    await runOp('magi.transfer', () => magi.transfer(to, amt, asset, memo))
  }

  return (
    <FormCard
      title="magi.transfer"
      description="Transfer tokens to another Magi account. Wallet routing follows the active wallet."
      submitLabel={dryRun ? 'Show op' : 'Sign & broadcast'}
      onSubmit={submit}
    >
      <Field label="To (DID or hive:username)">
        <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="hive:alice or did:pkh:eip155:1:0x…" />
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
