import { useEffect, useState } from 'react'

const PREFIX = 'aioha-playground:'

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const write = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // ignore quota errors
  }
}

const listeners = new Map<string, Set<(value: unknown) => void>>()

const notify = (key: string, value: unknown) => {
  const set = listeners.get(key)
  if (set) for (const fn of set) fn(value)
}

export const setSetting = <T,>(key: string, value: T) => {
  write(key, value)
  notify(key, value)
}

export const getSetting = <T,>(key: string, fallback: T): T => read(key, fallback)

export const usePersistedState = <T,>(key: string, fallback: T): [T, (v: T) => void] => {
  const [value, setValue] = useState<T>(() => read(key, fallback))
  useEffect(() => {
    let set = listeners.get(key)
    if (!set) {
      set = new Set()
      listeners.set(key, set)
    }
    const fn = (next: unknown) => setValue(next as T)
    set.add(fn)
    return () => {
      set!.delete(fn)
    }
  }, [key])
  const update = (v: T) => {
    setValue(v)
    write(key, v)
    notify(key, v)
  }
  return [value, update]
}
