'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'
import {
  Check,
  ChevronDown,
  Loader2,
  Search,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStockState, statusLabels, stockLabels } from '@/lib/admin/format'
import type { ProductStatus, StockState } from '@/lib/admin/types'

export const inputClass =
  'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

export const textareaClass =
  'min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'

export const btnPrimary =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 disabled:pointer-events-none disabled:opacity-50'

export const btnSecondary =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/30 disabled:pointer-events-none disabled:opacity-50'

export const btnGhost =
  'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'

export const btnDanger =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/25 disabled:pointer-events-none disabled:opacity-50'

export const iconButton =
  'inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30'

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  href,
}: {
  label: string
  value: string
  helper?: string
  icon: LucideIcon
  href?: string
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-heading text-[26px] font-bold leading-none tracking-tight text-slate-900">
        {value}
      </p>
      {helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}
    </>
  )

  const className =
    'group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition'

  if (href) {
    return (
      <Link
        href={href}
        className={cn(className, 'hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md')}
      >
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}

export function SectionCard({
  id,
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
  bodyClassName,
}: {
  id?: string
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-32 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs',
        className
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-100">
              <Icon className="size-[18px]" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="font-heading text-[15px] font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className={cn('p-5 sm:p-6', bodyClassName)}>{children}</div>
    </section>
  )
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-xs font-semibold text-slate-700"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-[11px] leading-relaxed text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}

export function Select({
  icon: Icon,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { icon?: LucideIcon }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      )}
      <select
        className={cn(
          inputClass,
          'cursor-pointer appearance-none pr-9',
          Icon && 'pl-9',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

export type FilterOption = {
  value: string
  label: string
  count?: number
  icon?: LucideIcon
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  searchable = false,
  searchPlaceholder = 'Buscar opción…',
  align = 'left',
  className,
  ariaLabel,
  emptyLabel = 'Sin opciones',
}: {
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  icon?: LucideIcon
  searchable?: boolean
  searchPlaceholder?: string
  align?: 'left' | 'right'
  className?: string
  ariaLabel?: string
  emptyLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase()
    if (!searchable || !needle) return options
    return options.filter((option) => option.label.toLowerCase().includes(needle))
  }, [options, searchable, term])

  const selected = options.find((option) => option.value === value)
  const isActive = options.length > 0 && value !== options[0].value

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) {
      setTerm('')
      return
    }
    const index = options.findIndex((option) => option.value === value)
    setHighlight(index >= 0 ? index : 0)
    const timer = window.setTimeout(() => {
      if (searchable) searchRef.current?.focus()
      else panelRef.current?.focus()
    }, 20)
    return () => window.clearTimeout(timer)
  }, [open])

  function scrollOptionIntoView(index: number) {
    window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>(`[data-option-index="${index}"]`)
        ?.scrollIntoView({ block: 'nearest' })
    }, 0)
  }

  function close(focusTrigger = false) {
    setOpen(false)
    if (focusTrigger) {
      window.setTimeout(() => triggerRef.current?.focus(), 0)
    }
  }

  function choose(option: FilterOption) {
    onChange(option.value)
    close(true)
  }

  function moveHighlight(delta: number) {
    if (filtered.length === 0) return
    const next = Math.max(0, Math.min(filtered.length - 1, highlight + delta))
    setHighlight(next)
    scrollOptionIntoView(next)
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const typing = document.activeElement === searchRef.current
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        setOpen(true)
      }
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveHighlight(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveHighlight(-1)
    } else if (event.key === 'Home' && !typing) {
      event.preventDefault()
      setHighlight(0)
      scrollOptionIntoView(0)
    } else if (event.key === 'End' && !typing) {
      event.preventDefault()
      const last = filtered.length - 1
      if (last >= 0) {
        setHighlight(last)
        scrollOptionIntoView(last)
      }
    } else if (event.key === 'Enter') {
      const option = filtered[highlight]
      if (option) {
        event.preventDefault()
        choose(option)
      }
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} onKeyDown={handleKeyDown} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? label}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm shadow-xs transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15',
          isActive
            ? 'border-blue-300 bg-blue-50/70 text-blue-700'
            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50',
          open && 'border-blue-500 ring-4 ring-blue-500/10'
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          {Icon && (
            <Icon
              className={cn(
                'size-4 shrink-0',
                isActive || open ? 'text-blue-600' : 'text-slate-400'
              )}
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              'shrink-0 text-xs font-medium',
              isActive || open ? 'text-blue-600/80' : 'text-slate-500'
            )}
          >
            {label}:
          </span>
          <span className="truncate font-semibold">{selected?.label ?? value}</span>
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 transition-transform duration-200',
            isActive || open ? 'text-blue-600' : 'text-slate-400',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel ?? label}
          className={cn(
            'absolute top-full z-50 mt-2 min-w-[15rem] max-w-[19rem] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 outline-none animate-in fade-in-0 zoom-in-95 duration-150',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {searchable && (
            <div className="border-b border-slate-100 p-1 pb-2">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  ref={searchRef}
                  value={term}
                  onChange={(event) => {
                    setTerm(event.target.value)
                    setHighlight(0)
                  }}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto overscroll-contain py-0.5 scrollbar-light">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-slate-400">{emptyLabel}</p>
            ) : (
              filtered.map((option, index) => {
                const isSelected = option.value === value
                const OptionIcon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-option-index={index}
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => choose(option)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
                      isSelected
                        ? 'bg-blue-50 font-semibold text-blue-700'
                        : index === highlight
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-700'
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {OptionIcon && (
                        <OptionIcon
                          className={cn(
                            'size-4 shrink-0',
                            isSelected ? 'text-blue-600' : 'text-slate-400'
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{option.label}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {typeof option.count === 'number' && (
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                            isSelected
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-500'
                          )}
                        >
                          {option.count}
                        </span>
                      )}
                      {isSelected && <Check className="size-4 text-blue-600" aria-hidden="true" />}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const statusStyles: Record<ProductStatus, { chip: string; dot: string }> = {
  active: {
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
    dot: 'bg-emerald-500',
  },
  draft: {
    chip: 'bg-slate-100 text-slate-600 ring-slate-500/15',
    dot: 'bg-slate-400',
  },
  archived: {
    chip: 'bg-amber-50 text-amber-700 ring-amber-600/15',
    dot: 'bg-amber-500',
  },
}

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        statusStyles[status].chip
      )}
    >
      <span className={cn('size-1.5 rounded-full', statusStyles[status].dot)} />
      {statusLabels[status]}
    </span>
  )
}

const stockStyles: Record<StockState, string> = {
  ok: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  low: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  out: 'bg-red-50 text-red-700 ring-red-600/15',
}

const stockDots: Record<StockState, string> = {
  ok: 'bg-emerald-500',
  low: 'bg-amber-500',
  out: 'bg-red-500',
}

export function StockBadge({
  stock,
  minStock,
  compact = false,
}: {
  stock: number
  minStock: number
  compact?: boolean
}) {
  const state = getStockState({ stock, minStock })
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        stockStyles[state]
      )}
      title={`${stockLabels[state]} · mínimo ${minStock}`}
    >
      <span className={cn('size-1.5 rounded-full', stockDots[state])} />
      {state === 'out' ? 'Sin stock' : `${stock} uds.`}
      {state === 'low' && !compact && ' · bajo'}
    </span>
  )
}

export function StatusToggle({
  active,
  onToggle,
  label,
}: {
  active: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20',
        active ? 'bg-emerald-500' : 'bg-slate-300'
      )}
    >
      <span
        className={cn(
          'inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform',
          active ? 'translate-x-[18px]' : 'translate-x-[3px]'
        )}
      />
    </button>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-white text-slate-400 shadow-xs ring-1 ring-slate-200">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-heading text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function LoadingState({ label = 'Cargando catálogo…' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="size-6 animate-spin" aria-hidden="true" />
      <p className="text-xs font-medium">{label}</p>
    </div>
  )
}
