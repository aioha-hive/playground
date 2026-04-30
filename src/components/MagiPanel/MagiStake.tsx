import { VscStakeType } from '@aioha/aioha'
import { magi } from '../../lib/magi'
import { logInfo, runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { useDryRun } from '../DryRunToggle'
import { Field, FormCard, Input, Select } from '../shared/FormCard'

const STAKE_LABEL: Record<VscStakeType, string> = {
  [VscStakeType.Consensus]: 'Consensus (HIVE)',
  [VscStakeType.HBD]: 'HBD savings'
}

export const MagiStake = () => {
  const [stakeType, setStakeType] = usePersistedState<VscStakeType>('magi.stake.type', VscStakeType.HBD)
  const [amount, setAmount] = usePersistedState('magi.stake.amount', '0.001')
  const [to, setTo] = usePersistedState('magi.stake.to', '')
  const [memo, setMemo] = usePersistedState('magi.stake.memo', '')
  const [action, setAction] = usePersistedState<'stake' | 'unstake'>('magi.stake.action', 'stake')
  const [dryRun] = useDryRun()

  const submit = async () => {
    const amt = parseFloat(amount)
    if (!Number.isFinite(amt) || amt <= 0) {
      logInfo('magi.' + action + ' skipped', { reason: 'amount must be > 0' })
      return
    }
    if (dryRun) {
      logInfo(`magi.${action} (dry run — not broadcast)`, { stakeType, amount: amt, to: to || undefined, memo })
      return
    }
    if (action === 'stake') {
      await runOp('magi.stake', () => magi.stake(stakeType, amt, to || undefined, memo || undefined))
    } else {
      await runOp('magi.unstake', () => magi.unstake(stakeType, amt, to || undefined, memo || undefined))
    }
  }

  return (
    <FormCard
      title="magi.stake / magi.unstake"
      description="Stake or unstake tokens on the Magi network."
      submitLabel={dryRun ? 'Show op' : action === 'stake' ? 'Sign & stake' : 'Sign & unstake'}
      onSubmit={submit}
    >
      <div className="grid grid-cols-2 gap-2">
        <Field label="Action">
          <Select value={action} onChange={(e) => setAction(e.target.value as 'stake' | 'unstake')}>
            <option value="stake">Stake</option>
            <option value="unstake">Unstake</option>
          </Select>
        </Field>
        <Field label="Stake type">
          <Select
            value={String(stakeType)}
            onChange={(e) => setStakeType(parseInt(e.target.value, 10) as VscStakeType)}
          >
            {(Object.values(VscStakeType).filter((v) => typeof v === 'number') as VscStakeType[]).map((v) => (
              <option key={v} value={v}>
                {STAKE_LABEL[v]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Amount">
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
      </Field>
      <Field label="To (optional, defaults to self)">
        <Input value={to} onChange={(e) => setTo(e.target.value)} />
      </Field>
      <Field label="Memo (optional)">
        <Input value={memo} onChange={(e) => setMemo(e.target.value)} />
      </Field>
    </FormCard>
  )
}
