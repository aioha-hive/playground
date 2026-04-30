import { KeyTypes } from '@aioha/aioha'
import type { KeyTypes as MagiKeyTypes } from '@aioha/magi'
import { magi } from '../../lib/magi'
import { logInfo, runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { useDryRun } from '../DryRunToggle'
import { Field, FormCard, Input } from '../shared/FormCard'
import { JsonField } from '../shared/JsonField'
import { KeyTypeSelect } from '../shared/KeyTypeSelect'

export const MagiContractCall = () => {
  const [contractId, setContractId] = usePersistedState('magi.call.contractId', 'vsc1BX9RbKJYAqSSZZzrGeBWyBZkG3ojTVPRoo')
  const [action, setAction] = usePersistedState('magi.call.action', 'dumpEnv')
  const [payload, setPayload] = usePersistedState('magi.call.payload', '""')
  const [rcLimit, setRcLimit] = usePersistedState('magi.call.rcLimit', '300')
  const [intents, setIntents] = usePersistedState('magi.call.intents', '[]')
  const [keyType, setKeyType] = usePersistedState<KeyTypes>('magi.call.keyType', KeyTypes.Posting)
  const [dryRun] = useDryRun()

  const submit = async () => {
    let parsedPayload: unknown
    let parsedIntents: unknown
    try {
      parsedPayload = JSON.parse(payload)
    } catch {
      logInfo('magi.call skipped', { reason: 'invalid payload JSON' })
      return
    }
    try {
      parsedIntents = JSON.parse(intents)
    } catch {
      logInfo('magi.call skipped', { reason: 'invalid intents JSON' })
      return
    }
    if (!Array.isArray(parsedIntents)) {
      logInfo('magi.call skipped', { reason: 'intents must be an array' })
      return
    }
    const rc = parseInt(rcLimit, 10)
    if (!Number.isFinite(rc) || rc <= 0) {
      logInfo('magi.call skipped', { reason: 'rcLimit must be a positive integer' })
      return
    }
    const callPayload = typeof parsedPayload === 'string' ? parsedPayload : JSON.stringify(parsedPayload)
    if (dryRun) {
      logInfo('magi.call (dry run — not broadcast)', {
        operation: { type: 'call', payload: { contract_id: contractId, action, payload: callPayload, rc_limit: rc, intents: parsedIntents } },
        keyType
      })
      return
    }
    await runOp('magi.call', () =>
      magi.call(contractId, action, callPayload, rc, parsedIntents as never[], keyType as unknown as MagiKeyTypes)
    )
  }

  return (
    <FormCard
      title="magi.call"
      description="Invoke a contract action on the Magi network."
      submitLabel={dryRun ? 'Show op' : 'Sign & broadcast call'}
      onSubmit={submit}
    >
      <div className="grid md:grid-cols-2 gap-2">
        <Field label="Contract ID">
          <Input value={contractId} onChange={(e) => setContractId(e.target.value)} spellCheck={false} />
        </Field>
        <Field label="Action">
          <Input value={action} onChange={(e) => setAction(e.target.value)} />
        </Field>
      </div>
      <JsonField label="Payload (JSON or string literal)" value={payload} onChange={setPayload} rows={4} />
      <div className="grid md:grid-cols-2 gap-2">
        <Field label="RC limit">
          <Input value={rcLimit} onChange={(e) => setRcLimit(e.target.value)} inputMode="numeric" />
        </Field>
        <KeyTypeSelect value={keyType} onChange={setKeyType} exclude={[KeyTypes.Memo, KeyTypes.Owner]} />
      </div>
      <JsonField label="Intents (array)" value={intents} onChange={setIntents} rows={3} />
    </FormCard>
  )
}
