'use client'

import Link from 'next/link'
import type { ReactNode, SelectHTMLAttributes } from 'react'
import {
  ChevronDown,
  Loader2,
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
