'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Calendar from 'react-calendar'
import { CalendarDays, ChevronDown } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/admin/format'
import { inputClass } from './ui'

type CalendarPanelPosition = {
  top: number
  left: number
  width: number
  maxHeight: number
  placement: 'top' | 'bottom'
}

function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function DatePicker({
  id,
  value,
  onChange,
  disabled,
  placeholder = 'Seleccionar fecha',
  className,
  allowClear = true,
  'aria-label': ariaLabel,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  allowClear?: boolean
  'aria-label'?: string
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<CalendarPanelPosition | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const selectedDate = useMemo(() => parseIsoDate(value), [value])
  const dateLabel = selectedDate ? formatDate(toIsoDate(selectedDate)) : null

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const gutter = 12
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const width = Math.min(320, Math.max(240, viewportWidth - gutter * 2))
    const left = Math.min(
      Math.max(gutter, rect.left),
      Math.max(gutter, viewportWidth - width - gutter)
    )
    const spaceBelow = viewportHeight - rect.bottom - gutter
    const spaceAbove = rect.top - gutter
    const placement: 'top' | 'bottom' =
      spaceBelow >= 360 || spaceBelow >= spaceAbove ? 'bottom' : 'top'
    const available = Math.max(0, (placement === 'bottom' ? spaceBelow : spaceAbove) - 4)
    const maxHeight = Math.max(220, Math.min(420, available || 220))

    setPosition({
      top: placement === 'top' ? Math.max(gutter, rect.top - 8) : rect.bottom + 8,
      left,
      width,
      maxHeight,
      placement,
    })
  }, [])

  useEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    const timer = window.setTimeout(() => panelRef.current?.focus(), 20)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  function close(focusTrigger = false) {
    setOpen(false)
    if (focusTrigger) {
      window.setTimeout(() => triggerRef.current?.focus(), 0)
    }
  }

  function commit(next: string) {
    onChange(next)
    close(true)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      event.stopPropagation()
      close(true)
      return
    }
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault()
      setOpen(true)
      return
    }
    if (open && event.key === 'Tab') {
      event.preventDefault()
      close(true)
    }
  }

  return (
    <div ref={rootRef} onKeyDown={handleKeyDown} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          inputClass,
          'relative flex cursor-pointer items-center justify-between gap-2 pl-9 pr-9 text-left',
          open && 'border-[#5B21B6] ring-4 ring-[#5B21B6]/10',
          className
        )}
      >
        <CalendarDays
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <span className={cn('min-w-0 truncate', !dateLabel && 'text-slate-400')}>
          {dateLabel ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            'pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label={ariaLabel ?? 'Seleccionar fecha'}
            tabIndex={-1}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              maxHeight: position.maxHeight,
            }}
            className={cn(
              'fj-calendar fixed z-[95] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl shadow-slate-900/10 outline-none scrollbar-light animate-in fade-in-0 zoom-in-95 duration-150',
              position.placement === 'top' && '-translate-y-full'
            )}
          >
            <Calendar
              value={selectedDate}
              onChange={(next) => {
                const raw = Array.isArray(next) ? next[0] : next
                if (!raw) return
                commit(toIsoDate(raw))
              }}
              locale="es-PE"
              next2Label={null}
              prev2Label={null}
              showNeighboringMonth={false}
            />
            <div className="sticky bottom-0 -mx-2.5 -mb-2.5 mt-2 flex items-center justify-between gap-2 rounded-b-2xl border-t border-slate-100 bg-white px-3 py-2">
              <button
                type="button"
                onClick={() => commit(toIsoDate(new Date()))}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#5B21B6] transition hover:bg-[#F5F3FF]"
              >
                Hoy
              </button>
              {allowClear && value ? (
                <button
                  type="button"
                  onClick={() => commit('')}
                  className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  Limpiar
                </button>
              ) : null}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
