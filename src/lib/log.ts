import { useEffect, useState } from 'react'

export type LogLevel = 'info' | 'error' | 'event'

export interface LogEntry {
  id: number
  ts: number
  level: LogLevel
  label: string
  data?: unknown
}

let nextId = 1
let entries: LogEntry[] = []
const listeners = new Set<(entries: LogEntry[]) => void>()

const emit = () => {
  for (const fn of listeners) fn(entries)
}

export const log = (level: LogLevel, label: string, data?: unknown) => {
  const entry: LogEntry = { id: nextId++, ts: Date.now(), level, label, data }
  entries = [entry, ...entries].slice(0, 500)
  emit()
}

export const logInfo = (label: string, data?: unknown) => log('info', label, data)
export const logError = (label: string, data?: unknown) => log('error', label, serializeError(data))
export const logEvent = (label: string, data?: unknown) => log('event', label, data)

export const clearLogs = () => {
  entries = []
  emit()
}

export const useLogs = (filter?: LogLevel) => {
  const [snap, setSnap] = useState<LogEntry[]>(entries)
  useEffect(() => {
    const fn = (next: LogEntry[]) => setSnap(next)
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [])
  return filter ? snap.filter((e) => e.level === filter) : snap
}

const serializeError = (err: unknown): unknown => {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack }
  }
  return err
}

export const runOp = async <T,>(label: string, fn: () => Promise<T>): Promise<T | undefined> => {
  try {
    const result = await fn()
    logInfo(label, result)
    return result
  } catch (err) {
    logError(label + ' failed', err)
    return undefined
  }
}
