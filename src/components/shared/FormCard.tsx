import { FormEvent, ReactNode, useState } from 'react'

interface Props {
  title: string
  description?: string
  submitLabel?: string
  onSubmit: () => Promise<unknown> | unknown
  children: ReactNode
  disabled?: boolean
  disabledReason?: string
}

export const FormCard = ({ title, description, submitLabel = 'Run', onSubmit, children, disabled, disabledReason }: Props) => {
  const [busy, setBusy] = useState(false)

  const handle = async (e: FormEvent) => {
    e.preventDefault()
    if (busy || disabled) return
    setBusy(true)
    try {
      await onSubmit()
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={handle}
      className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-3"
    >
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="space-y-2">{children}</div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={busy || disabled}
          className="px-3 py-1.5 text-sm rounded bg-[#f44444] hover:bg-[#f55555] text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          {busy ? 'Running…' : submitLabel}
        </button>
        {disabled && disabledReason && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{disabledReason}</span>
        )}
      </div>
    </form>
  )
}

export const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
  <label className="block">
    <span className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{label}</span>
    {children}
    {hint && <span className="block text-[10px] text-gray-400 dark:text-gray-500 mt-1">{hint}</span>}
  </label>
)

export const inputClass =
  'w-full px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f44444]'

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
)

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`${inputClass} font-mono text-xs ${props.className ?? ''}`} />
)

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`${inputClass} ${props.className ?? ''}`}>
    {props.children}
  </select>
)
