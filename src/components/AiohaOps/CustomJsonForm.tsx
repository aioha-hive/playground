import { KeyTypes } from '@aioha/aioha'
import { aioha } from '../../lib/aioha'
import { logInfo, runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { useDryRun } from '../DryRunToggle'
import { useAioha } from '@aioha/providers/react'
import { Field, FormCard, Input } from '../shared/FormCard'
import { JsonField } from '../shared/JsonField'
import { KeyTypeSelect } from '../shared/KeyTypeSelect'

export const CustomJsonForm = () => {
  const [keyType, setKeyType] = usePersistedState<KeyTypes>('cj.keyType', KeyTypes.Posting)
  const [id, setId] = usePersistedState('cj.id', 'aioha-playground-test')
  const [json, setJson] = usePersistedState('cj.json', '{\n  "hello": "world"\n}')
  const [title, setTitle] = usePersistedState('cj.title', '')
  const [dryRun] = useDryRun()
  const { user } = useAioha()

  const submit = async () => {
    let parsed: object
    try {
      parsed = JSON.parse(json)
    } catch (err) {
      logInfo('aioha.customJSON skipped', { reason: 'invalid JSON', err: String(err) })
      return
    }
    if (dryRun) {
      logInfo('aioha.customJSON (dry run — not broadcast)', {
        operation: ['custom_json', {
          required_auths: keyType === KeyTypes.Active ? [user] : [],
          required_posting_auths: keyType === KeyTypes.Posting ? [user] : [],
          id,
          json: JSON.stringify(parsed)
        }]
      })
      return
    }
    await runOp('aioha.customJSON', () => aioha.customJSON(keyType, id, parsed, title || undefined))
  }

  return (
    <FormCard
      title="aioha.customJSON"
      description="Broadcast an arbitrary custom_json operation."
      submitLabel={dryRun ? 'Show op' : 'Broadcast custom_json'}
      onSubmit={submit}
    >
      <div className="grid md:grid-cols-2 gap-2">
        <KeyTypeSelect value={keyType} onChange={setKeyType} exclude={[KeyTypes.Memo, KeyTypes.Owner]} />
        <Field label="Display title (PeakVault, optional)">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
      </div>
      <Field label="ID (custom_json id)">
        <Input value={id} onChange={(e) => setId(e.target.value)} />
      </Field>
      <JsonField label="JSON payload" value={json} onChange={setJson} rows={6} />
    </FormCard>
  )
}
