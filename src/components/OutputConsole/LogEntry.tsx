import { useState } from 'react'
import { LogEntry as Entry } from '../../lib/log'
import { CopyButton } from '../shared/CopyButton'

const LEVEL_STYLE: Record<Entry['level'], string> = {
  info: 'border-indigo-200 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-900/20',
  error: 'border-red-200 dark:border-red-700 bg-red-50/40 dark:bg-red-900/20',
  event: 'border-emerald-200 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-900/20'
}

const LEVEL_LABEL: Record<Entry['level'], string> = {
  info: 'INFO',
  error: 'ERROR',
  event: 'EVENT'
}

export const LogEntry = ({ entry }: { entry: Entry }) => {
  const [open, setOpen] = useState(true)
  const json = entry.data === undefined ? '' : safeStringify(entry.data)
  return (
    <div className={`rounded border ${LEVEL_STYLE[entry.level]} px-3 py-2`}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
        <span className="font-semibold">{LEVEL_LABEL[entry.level]}</span>
        <span>{new Date(entry.ts).toLocaleTimeString()}</span>
        <span className="flex-1" />
        {json && <CopyButton value={json} />}
        {json && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="hover:text-[#f44444] dark:hover:text-[#f66666]"
          >
            {open ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      <div className="text-sm font-medium mt-1 break-words">{entry.label}</div>
      {open && json && (
        <pre className="mt-2 text-[11px] font-mono text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words max-h-64 overflow-auto">
          {json}
        </pre>
      )}
    </div>
  )
}

const safeStringify = (data: unknown): string => {
  try {
    return JSON.stringify(data, replacer, 2)
  } catch {
    return String(data)
  }
}

const replacer = (_key: string, value: unknown) => {
  if (typeof value === 'bigint') return value.toString() + 'n'
  if (typeof value === 'function') return '[Function]'
  return value
}
