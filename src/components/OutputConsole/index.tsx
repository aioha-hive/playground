import { useState } from 'react'
import { LogLevel, clearLogs, useLogs } from '../../lib/log'
import { LogEntry } from './LogEntry'

const FILTERS: { value: LogLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'info', label: 'Info' },
  { value: 'event', label: 'Events' },
  { value: 'error', label: 'Errors' }
]

export const OutputConsole = () => {
  const [filter, setFilter] = useState<LogLevel | 'all'>('all')
  const all = useLogs()
  const entries = filter === 'all' ? all : all.filter((e) => e.level === filter)
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col min-h-[400px] xl:min-h-0 xl:flex-1">
      <header className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 flex-wrap">
        <h2 className="font-semibold text-sm">Output console</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">{entries.length} entries</span>
        <div className="flex-1" />
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`text-[10px] px-2 py-1 rounded border transition ${
                filter === f.value
                  ? 'bg-[#f44444] text-white border-[#f44444]'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={clearLogs}
          className="text-[10px] px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Clear
        </button>
      </header>
      <div className="p-3 overflow-y-auto flex-1 min-h-0 space-y-2">
        {entries.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic px-2 py-4">
            No entries yet. Run an operation to see results, errors, and events here.
          </p>
        ) : (
          entries.map((e) => <LogEntry key={e.id} entry={e} />)
        )}
      </div>
    </section>
  )
}
