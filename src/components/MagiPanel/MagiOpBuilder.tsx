import { KeyTypes } from '@aioha/aioha'
import type { KeyTypes as MagiKeyTypes } from '@aioha/magi'
import { magi } from '../../lib/magi'
import { logInfo, runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { useDryRun } from '../DryRunToggle'
import { FormCard } from '../shared/FormCard'
import { JsonField } from '../shared/JsonField'
import { KeyTypeSelect } from '../shared/KeyTypeSelect'

const DEFAULT_OPS = `[
  {
    "type": "call",
    "payload": {
      "contract_id": "vsc1BX9RbKJYAqSSZZzrGeBWyBZkG3ojTVPRoo",
      "action": "dumpEnv",
      "payload": "",
      "rc_limit": 300,
      "intents": []
    }
  }
]`

export const MagiOpBuilder = () => {
  const [ops, setOps] = usePersistedState('magi.opb.ops', DEFAULT_OPS)
  const [keyType, setKeyType] = usePersistedState<KeyTypes>('magi.opb.keyType', KeyTypes.Posting)
  const [dryRun] = useDryRun()

  const submit = async () => {
    let parsed: unknown
    try {
      parsed = JSON.parse(ops)
    } catch {
      logInfo('magi.signAndBroadcastTx skipped', { reason: 'invalid JSON' })
      return
    }
    if (!Array.isArray(parsed)) {
      logInfo('magi.signAndBroadcastTx skipped', { reason: 'expected an array' })
      return
    }
    if (dryRun) {
      logInfo('magi.signAndBroadcastTx (dry run — not broadcast)', { keyType, operations: parsed })
      return
    }
    await runOp('magi.signAndBroadcastTx', () =>
      magi.signAndBroadcastTx(parsed as never[], keyType as unknown as MagiKeyTypes)
    )
  }

  return (
    <FormCard
      title="magi.signAndBroadcastTx · op builder"
      description="Paste a MagiOperation[] payload. Operations are { type, payload } objects."
      submitLabel={dryRun ? 'Show ops' : 'Broadcast'}
      onSubmit={submit}
    >
      <KeyTypeSelect value={keyType} onChange={setKeyType} exclude={[KeyTypes.Memo, KeyTypes.Owner]} />
      <JsonField label="Operations array" value={ops} onChange={setOps} rows={12} />
    </FormCard>
  )
}
