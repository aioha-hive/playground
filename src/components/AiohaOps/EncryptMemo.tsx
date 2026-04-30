import { KeyTypes } from '@aioha/aioha'
import { aioha } from '../../lib/aioha'
import { runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { Field, FormCard, Input } from '../shared/FormCard'

export const EncryptMemo = () => {
  const [plain, setPlain] = usePersistedState('memo.plain', 'Encrypted hello')
  const [recipient, setRecipient] = usePersistedState('memo.recipient', '')
  const [encrypted, setEncrypted] = usePersistedState('memo.encrypted', '')

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <FormCard
        title="aioha.encryptMemo"
        description="Encrypts using your memo key for the recipient."
        submitLabel="Encrypt"
        onSubmit={() => runOp('aioha.encryptMemo', () => aioha.encryptMemo(plain, KeyTypes.Memo, recipient))}
      >
        <Field label="Plaintext">
          <Input value={plain} onChange={(e) => setPlain(e.target.value)} />
        </Field>
        <Field label="Recipient (Hive username)">
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="alice" />
        </Field>
      </FormCard>
      <FormCard
        title="aioha.decryptMemo"
        description="Decrypts a #-prefixed encrypted memo."
        submitLabel="Decrypt"
        onSubmit={() => runOp('aioha.decryptMemo', () => aioha.decryptMemo(encrypted, KeyTypes.Memo))}
      >
        <Field label="Encrypted memo (starts with #)">
          <Input value={encrypted} onChange={(e) => setEncrypted(e.target.value)} placeholder="#ABCdef..." />
        </Field>
      </FormCard>
    </div>
  )
}
