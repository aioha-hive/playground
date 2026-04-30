import { KeyTypes } from '@aioha/aioha'
import { aioha } from '../../lib/aioha'
import { logInfo, runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { useDryRun } from '../DryRunToggle'
import { Field, FormCard, Select } from '../shared/FormCard'
import { JsonField } from '../shared/JsonField'
import { KeyTypeSelect } from '../shared/KeyTypeSelect'

const DEFAULT_OPS = `[
  ["custom_json", {
    "required_auths": [],
    "required_posting_auths": ["__YOUR_ACCOUNT__"],
    "id": "aioha-playground-test",
    "json": "{\\"hello\\":\\"world\\"}"
  }]
]`

type Mode = 'broadcast' | 'broadcastHF26'

export const OpBuilder = () => {
  const [opsJson, setOpsJson] = usePersistedState('opb.ops', DEFAULT_OPS)
  const [mode, setMode] = usePersistedState<Mode>('opb.mode', 'broadcast')
  const [keyType, setKeyType] = usePersistedState<KeyTypes>('opb.keyType', KeyTypes.Posting)
  const [dryRun] = useDryRun()

  const submit = async () => {
    let ops: unknown
    try {
      ops = JSON.parse(opsJson)
    } catch (err) {
      logInfo('opBuilder skipped', { reason: 'invalid JSON', err: String(err) })
      return
    }
    if (!Array.isArray(ops)) {
      logInfo('opBuilder skipped', { reason: 'expected an array of operations' })
      return
    }
    if (dryRun) {
      logInfo('opBuilder (dry run — not broadcast)', { mode, keyType, operations: ops })
      return
    }
    if (mode === 'broadcast') {
      await runOp('aioha.signAndBroadcastTx', () => aioha.signAndBroadcastTx(ops as never[], keyType))
    } else {
      await runOp('aioha.signAndBroadcastTxHF26', () => aioha.signAndBroadcastTxHF26(ops as never[], keyType))
    }
  }

  return (
    <FormCard
      title="aioha.signAndBroadcastTx · op builder"
      description="Paste a raw operations array. The legacy form takes [opName, payload] tuples; HF26 takes { type, value } objects."
      submitLabel={dryRun ? 'Show ops' : 'Broadcast'}
      onSubmit={submit}
    >
      <div className="grid md:grid-cols-2 gap-2">
        <Field label="Mode">
          <Select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="broadcast">signAndBroadcastTx (legacy)</option>
            <option value="broadcastHF26">signAndBroadcastTxHF26</option>
          </Select>
        </Field>
        <KeyTypeSelect value={keyType} onChange={setKeyType} exclude={[KeyTypes.Memo]} />
      </div>
      <JsonField label="Operations array" value={opsJson} onChange={setOpsJson} rows={10} />
    </FormCard>
  )
}
