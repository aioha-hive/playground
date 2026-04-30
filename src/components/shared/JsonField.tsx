import { Field, Textarea } from './FormCard'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  hint?: string
}

export const JsonField = ({ label, value, onChange, rows = 6, hint }: Props) => {
  let parseError: string | null = null
  if (value.trim()) {
    try {
      JSON.parse(value)
    } catch (err) {
      parseError = err instanceof Error ? err.message : 'invalid JSON'
    }
  }
  const format = () => {
    try {
      onChange(JSON.stringify(JSON.parse(value), null, 2))
    } catch {
      // ignore
    }
  }
  return (
    <Field label={label} hint={hint}>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} spellCheck={false} />
      <div className="flex items-center justify-between mt-1">
        <span className={`text-[10px] ${parseError ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
          {parseError ? `JSON error: ${parseError}` : 'valid JSON'}
        </span>
        <button
          type="button"
          onClick={format}
          disabled={!!parseError || !value.trim()}
          className="text-[10px] underline text-[#f44444] dark:text-[#f66666] disabled:opacity-40 disabled:no-underline"
        >
          format
        </button>
      </div>
    </Field>
  )
}
