import { aioha } from '../../lib/aioha'
import { logInfo, runOp } from '../../lib/log'
import { usePersistedState } from '../../lib/settings'
import { useDryRun } from '../DryRunToggle'
import { useAioha } from '@aioha/providers/react'
import { Field, FormCard, Input } from '../shared/FormCard'

export const VoteForm = () => {
  const [author, setAuthor] = usePersistedState('vote.author', '')
  const [permlink, setPermlink] = usePersistedState('vote.permlink', '')
  const [weight, setWeight] = usePersistedState('vote.weight', '10000')
  const [dryRun] = useDryRun()
  const { user } = useAioha()

  const submit = async () => {
    const w = parseInt(weight, 10)
    if (!Number.isFinite(w)) {
      logInfo('aioha.vote skipped', { reason: 'weight must be an integer in [-10000, 10000]' })
      return
    }
    if (dryRun) {
      logInfo('aioha.vote (dry run — not broadcast)', {
        operation: ['vote', { voter: user, author, permlink, weight: w }]
      })
      return
    }
    await runOp('aioha.vote', () => aioha.vote(author, permlink, w))
  }

  return (
    <FormCard
      title="aioha.vote"
      description="Vote weight is in basis points (10000 = 100%). Negative for downvote."
      submitLabel={dryRun ? 'Show op' : 'Broadcast vote'}
      onSubmit={submit}
    >
      <div className="grid grid-cols-2 gap-2">
        <Field label="Author">
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </Field>
        <Field label="Permlink">
          <Input value={permlink} onChange={(e) => setPermlink(e.target.value)} />
        </Field>
      </div>
      <Field label="Weight (-10000 to 10000)">
        <Input value={weight} onChange={(e) => setWeight(e.target.value)} inputMode="numeric" />
      </Field>
    </FormCard>
  )
}
