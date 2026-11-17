'use client'

import { useEffect, useState } from 'react'
import { Globe, LifeBuoy, Package, ShieldCheck } from 'lucide-react'

const PHRASES = [
  { icon: Package, text: 'controlar el inventario' },
  { icon: Globe, text: 'gestionar los proyectos web' },
  { icon: LifeBuoy, text: 'atender la mesa de ayuda' },
  { icon: ShieldCheck, text: 'administrar roles y permisos' },
]

const TYPE_MS = 55
const DELETE_MS = 28
const HOLD_MS = 2000

export function LoginTypewriter() {
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

    const full = PHRASES[index].text

    if (!deleting && chars === full.length) {
      const timer = window.setTimeout(() => setDeleting(true), HOLD_MS)
      return () => window.clearTimeout(timer)
    }

    if (deleting && chars === 0) {
      setDeleting(false)
      setIndex((value) => (value + 1) % PHRASES.length)
      return
    }

    const timer = window.setTimeout(
      () => setChars((value) => value + (deleting ? -1 : 1)),
      deleting ? DELETE_MS : TYPE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [chars, deleting, index, reduced])

  const phrase = PHRASES[reduced ? 0 : index]
  const Icon = phrase.icon
  const typed = reduced ? PHRASES[0].text : phrase.text.slice(0, chars)

  return (
    <div className="mt-5 flex items-center gap-3">
      <span
        key={phrase.text}
        className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#22D3EE]/20 bg-[#22D3EE]/10 text-[#A5F3FC] animate-in fade-in zoom-in-75 duration-300"
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="text-[14px] font-medium tracking-tight text-white/80" aria-hidden="true">
        <span className="text-white/45">Tu panel para </span>
        {typed}
        {!reduced && (
          <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] bg-[#22D3EE] animate-pulse" />
        )}
      </p>
      <span className="sr-only">
        Tu panel para controlar el inventario, gestionar los proyectos web, atender la mesa de
        ayuda y administrar roles y permisos.
      </span>
    </div>
  )
}
