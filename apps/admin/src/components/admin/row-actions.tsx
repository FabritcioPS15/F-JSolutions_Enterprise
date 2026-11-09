'use client'

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Loader2, MoreHorizontal, type LucideIcon } from 'lucide-react'
import { iconButton } from '@/components/admin/ui'
import { cn } from '@/lib/utils'

export type RowAction = {
  key: string
  label: string
  icon?: LucideIcon
  tone?: 'default' | 'danger'
  disabled?: boolean
  href?: string
  external?: boolean
  onSelect?: () => void
}

type Position = { top: number; left: number }

const GAP = 6
const EDGE = 8

function itemClass(tone: RowAction['tone'], disabled?: boolean) {
  return cn(
    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6]/25',
    tone === 'danger'
      ? 'text-rose-600 hover:bg-rose-50 focus-visible:bg-rose-50'
      : 'text-slate-700 hover:bg-slate-50 focus-visible:bg-slate-50',
    disabled && 'pointer-events-none opacity-40'
  )
}

function iconClass(tone: RowAction['tone']) {
  return cn('size-4 shrink-0', tone === 'danger' ? 'text-rose-500' : 'text-slate-400')
}

export function RowActions({
  label,
  title,
  items,
  busy,
  className,
}: {
  label: string
  title?: string
  items: RowAction[]
  busy?: boolean
  className?: string
}) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<Position | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  const close = useCallback((focusTrigger = false) => {
    setOpen(false)
    setPos(null)
    if (focusTrigger) {
      window.setTimeout(() => triggerRef.current?.focus(), 0)
    }
  }, [])

  // El menú se monta en un portal con posición fija: las tablas viven dentro de
  // contenedores con scroll horizontal y un desplegable absoluto quedaría cortado.
  useLayoutEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (!trigger || !panel) return

    const rect = trigger.getBoundingClientRect()
    const height = panel.offsetHeight
    const width = panel.offsetWidth
    const below = window.innerHeight - rect.bottom - EDGE
    const above = rect.top - EDGE
    const placeBelow = below >= height || below >= above

    setPos({
      top: placeBelow ? rect.bottom + GAP : Math.max(EDGE, rect.top - height - GAP),
      left: Math.min(Math.max(EDGE, rect.right - width), window.innerWidth - width - EDGE),
    })
    panel
      .querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')
      ?.focus({ preventScroll: true })
  }, [open, items.length])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      close()
    }
    function handleScroll(event: Event) {
      if (panelRef.current?.contains(event.target as Node)) return
      close()
    }
    function handleResize() {
      close()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [open, close])

  function moveFocus(step: 1 | -1) {
    const nodes = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []
    )
    if (nodes.length === 0) return
    const index = nodes.indexOf(document.activeElement as HTMLElement)
    const next = index === -1 ? (step === 1 ? 0 : nodes.length - 1) : (index + step + nodes.length) % nodes.length
    nodes[next]?.focus()
  }

  function handlePanelKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveFocus(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveFocus(-1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      moveFocus(1)
    } else if (event.key === 'End') {
      event.preventDefault()
      moveFocus(-1)
    } else if (event.key === 'Tab') {
      close()
    }
  }

  function run(item: RowAction) {
    if (item.disabled) return
    close()
    item.onSelect?.()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title="Acciones"
        disabled={busy}
        className={cn(
          iconButton,
          open && 'bg-slate-100 text-slate-700',
          busy && 'pointer-events-none',
          className
        )}
        onClick={() => (open ? close(true) : setOpen(true))}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin text-slate-400" aria-hidden="true" />
        ) : (
          <MoreHorizontal className="size-4" aria-hidden="true" />
        )}
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            aria-label={label}
            onKeyDown={handlePanelKeyDown}
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              visibility: pos ? 'visible' : 'hidden',
            }}
            className="fixed z-[95] w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10 animate-in fade-in-0 zoom-in-95 duration-150"
          >
            {title && (
              <p className="truncate px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {title}
              </p>
            )}
            {items.map((item, index) => {
              const Icon = item.icon
              const content = (
                <>
                  {Icon && <Icon className={iconClass(item.tone)} aria-hidden="true" />}
                  <span className="truncate">{item.label}</span>
                </>
              )
              const divider =
                item.tone === 'danger' && index > 0 ? (
                  <div
                    key={`${item.key}-divider`}
                    role="separator"
                    className="my-1 h-px bg-slate-100"
                  />
                ) : null

              if (item.href) {
                const shared = {
                  role: 'menuitem' as const,
                  className: itemClass(item.tone, item.disabled),
                  tabIndex: item.disabled ? -1 : 0,
                  onClick: () => close(),
                }
                return (
                  <Fragment key={item.key}>
                    {divider}
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noreferrer" {...shared}>
                        {content}
                      </a>
                    ) : (
                      <Link href={item.href} {...shared}>
                        {content}
                      </Link>
                    )}
                  </Fragment>
                )
              }

              return (
                <Fragment key={item.key}>
                  {divider}
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    className={itemClass(item.tone, item.disabled)}
                    onClick={() => run(item)}
                  >
                    {content}
                  </button>
                </Fragment>
              )
            })}
          </div>,
          document.body
        )}
    </>
  )
}
