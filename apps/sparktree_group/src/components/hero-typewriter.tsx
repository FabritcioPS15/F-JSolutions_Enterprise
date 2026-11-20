'use client'

import { useEffect, useState } from 'react'

export type TypewriterItem = {
  word: string
  accent: string
}

const TYPE_MS = 70
const DELETE_MS = 32
const HOLD_MS = 1900
// Mezcla el acento con blanco para que se lea bien sobre el fondo forest oscuro.
const ACCENT_MIX = 80

export function HeroTypewriter({ items }: { items: TypewriterItem[] }) {
  const [index, setIndex] = useState(0)
  const [chars, setChars] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (reduced) return

    const full = items[index].word

    if (!deleting && chars === full.length) {
      const timer = window.setTimeout(() => setDeleting(true), HOLD_MS)
      return () => window.clearTimeout(timer)
    }

    if (deleting && chars === 0) {
      setDeleting(false)
      setIndex((value) => (value + 1) % items.length)
      return
    }

    const timer = window.setTimeout(
      () => setChars((value) => value + (deleting ? -1 : 1)),
      deleting ? DELETE_MS : TYPE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [chars, deleting, index, reduced, items])

  const current = items[reduced ? 0 : index]
  const typed = reduced ? current.word : current.word.slice(0, chars)
  const accent = `color-mix(in srgb, ${current.accent} ${ACCENT_MIX}%, white)`

  return (
    <div className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-forest-200/80">
        Unidades de negocio
      </span>
      <p
        className="inline-flex min-h-7 items-baseline font-display text-lg font-semibold sm:min-h-8 sm:text-xl"
        style={{ color: accent, textShadow: `0 0 30px ${current.accent}59` }}
        aria-hidden="true"
      >
        {typed}
        {!reduced && (
          <span
            className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-pulse"
            style={{ backgroundColor: current.accent }}
          />
        )}
      </p>
      <span className="sr-only">
        Unidades de negocio: {items.map((item) => item.word).join(', ')}.
      </span>
    </div>
  )
}
