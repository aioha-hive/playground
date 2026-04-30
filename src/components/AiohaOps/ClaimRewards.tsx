import { aioha } from '../../lib/aioha'
import { logInfo, runOp } from '../../lib/log'
import { useDryRun } from '../DryRunToggle'
import { FormCard } from '../shared/FormCard'

export const ClaimRewards = () => {
  const [dryRun] = useDryRun()
  return (
    <FormCard
      title="aioha.claimRewards"
      description="Claims any pending HIVE / HBD / HP rewards on the active account."
      submitLabel={dryRun ? 'Show intent' : 'Broadcast claim'}
      onSubmit={async () => {
        if (dryRun) {
          logInfo('aioha.claimRewards (dry run — not broadcast)', {
            note: 'reward amounts will be fetched live and a claim_reward_balance op broadcast'
          })
          return
        }
        await runOp('aioha.claimRewards', () => aioha.claimRewards())
      }}
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">No parameters.</p>
    </FormCard>
  )
}
