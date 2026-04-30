import { usePersistedState } from '../lib/settings'

export const useDryRun = () => usePersistedState<boolean>('dryRun', true)

export const DryRunToggle = () => {
  const [dryRun, setDryRun] = useDryRun()
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-100 select-none">
      <input
        type="checkbox"
        checked={dryRun}
        onChange={(e) => setDryRun(e.target.checked)}
        className="w-4 h-4 accent-[#f44444]"
      />
      Dry run (sign only, no broadcast)
    </label>
  )
}
