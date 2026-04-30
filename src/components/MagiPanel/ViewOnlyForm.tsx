import { Wallet } from '@aioha/magi'
import { magi } from '../../lib/magi'
import { logInfo } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { Field, FormCard, Input } from '../shared/FormCard'

const PRESETS: { label: string; did: string }[] = [
  { label: 'Hive · alice', did: 'hive:alice' },
  { label: 'EVM · 0x2540…200C', did: 'did:pkh:eip155:1:0x2540009A1027e5c6aa0274db4fEF2622aC2B200C' },
  { label: 'BTC · bc1q… (example)', did: 'did:pkh:bip122:000000000019d6689c085ae165831e93:bc1qsr9wpkn5x6yqs6qx9hcl5szl9flazx9p2thwqp' }
]

export const ViewOnlyForm = () => {
  const [did, setDid] = usePersistedState('magi.viewOnlyDid', PRESETS[0].did)
  return (
    <FormCard
      title="magi.setViewOnly"
      description="Read-only Magi wallet from a DID. Does not sign — useful for inspecting state."
      submitLabel="Set view-only"
      onSubmit={() => {
        magi.setViewOnly(did)
        magi.setWallet(Wallet.ViewOnly)
        logInfo('magi.setViewOnly', { did, user: magi.getUser(), wallet: magi.getWallet() })
      }}
    >
      <Field label="DID">
        <Input value={did} onChange={(e) => setDid(e.target.value)} spellCheck={false} />
      </Field>
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.did}
            type="button"
            onClick={() => setDid(p.did)}
            className="text-[10px] px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {p.label}
          </button>
        ))}
      </div>
    </FormCard>
  )
}
