import { useState } from 'react'

export const CopyButton = ({ value, label = 'Copy' }: { value: string; label?: string }) => {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 hover:text-[#f44444] dark:hover:text-[#f66666] transition"
    >
      {copied ? 'Copied' : label}
    </button>
  )
}
