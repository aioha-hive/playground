import { magi } from '../../lib/magi'
import { logInfo } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { Field, FormCard, Input } from '../shared/FormCard'

const DEFAULT_API = 'https://vsc.techcoderx.com/api/v1/graphql'
const DEFAULT_NET = 'vsc-mainnet'

export const ApiNetSettings = () => {
  const [api, setApi] = usePersistedState('magi.api', DEFAULT_API)
  const [netId, setNetId] = usePersistedState('magi.netId', DEFAULT_NET)
  return (
    <FormCard
      title="Magi API & network"
      description="GraphQL endpoint and net ID. Defaults to mainnet."
      submitLabel="Apply"
      onSubmit={() => {
        magi.setApi(api)
        magi.setNetId(netId)
        logInfo('magi config applied', { api, netId })
      }}
    >
      <div className="grid md:grid-cols-2 gap-2">
        <Field label="GraphQL API URL">
          <Input value={api} onChange={(e) => setApi(e.target.value)} spellCheck={false} />
        </Field>
        <Field label="Net ID">
          <Input value={netId} onChange={(e) => setNetId(e.target.value)} spellCheck={false} />
        </Field>
      </div>
    </FormCard>
  )
}
