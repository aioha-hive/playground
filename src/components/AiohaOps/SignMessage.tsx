import { KeyTypes } from '@aioha/aioha'
import { aioha } from '../../lib/aioha'
import { runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { Field, FormCard, Input } from '../shared/FormCard'
import { KeyTypeSelect } from '../shared/KeyTypeSelect'

export const SignMessage = () => {
  const [message, setMessage] = usePersistedState('signMsg.message', 'Hello from Aioha Playground')
  const [keyType, setKeyType] = usePersistedState<KeyTypes>('signMsg.keyType', KeyTypes.Posting)
  return (
    <FormCard
      title="aioha.signMessage"
      description="Sign an arbitrary string with the connected key."
      onSubmit={() => runOp('aioha.signMessage', () => aioha.signMessage(message, keyType))}
    >
      <Field label="Message">
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
      </Field>
      <KeyTypeSelect value={keyType} onChange={setKeyType} exclude={[KeyTypes.Memo]} />
    </FormCard>
  )
}
