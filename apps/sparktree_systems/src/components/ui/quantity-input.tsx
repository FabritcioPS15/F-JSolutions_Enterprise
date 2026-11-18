'use client'

import { useEffect, useState } from 'react'

type QuantityInputProps = {
  value: number
  onChange: (value: number) => void
  ariaLabel: string
  min?: number
  max?: number
  disabled?: boolean
  className?: string
}

export function QuantityInput({
  value,
  onChange,
  ariaLabel,
  min = 1,
  max = 99999,
  disabled = false,
  className = '',
}: QuantityInputProps) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = () => {
    const parsed = Number.parseInt(draft, 10)

    if (Number.isNaN(parsed)) {
      setDraft(String(value))
      return
    }

    const next = Math.min(max, Math.max(min, parsed))
    setDraft(String(next))

    if (next !== value) onChange(next)
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={draft}
      disabled={disabled}
      aria-label={ariaLabel}
      onFocus={(event) => event.currentTarget.select()}
      onChange={(event) => setDraft(event.target.value.replace(/\D/g, '').slice(0, 5))}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
      }}
      className={`bg-transparent text-center outline-none disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    />
  )
}
