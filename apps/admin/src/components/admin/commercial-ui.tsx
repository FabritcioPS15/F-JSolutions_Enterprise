'use client'

import { cn } from '@/lib/utils'
import {
  clientStatusLabels,
  initials,
  quoteStatusLabels,
  requestStatusLabels,
} from '@/lib/admin/format'
import type { ClientStatus, QuoteStatus, RequestStatus } from '@/lib/admin/types'

export function ClientAvatar({
  name,
  company,
  className,
}: {
  name: string
  company?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-[11px] font-bold text-slate-600 ring-1 ring-inset ring-slate-200/80',
        className
      )}
      aria-hidden="true"
    >
      {initials(company?.trim() || name)}
    </span>
  )
}

const clientStyles: Record<ClientStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  inactive: 'bg-slate-100 text-slate-600 ring-slate-500/15',
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        clientStyles[status]
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
        )}
      />
      {clientStatusLabels[status]}
    </span>
  )
}

const quoteStyles: Record<QuoteStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 ring-slate-500/15',
  sent: 'bg-blue-50 text-blue-700 ring-blue-600/15',
  answered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  closed: 'bg-slate-900 text-white ring-slate-900/10',
}

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        quoteStyles[status]
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'draft' && 'bg-slate-400',
          status === 'sent' && 'bg-blue-500',
          status === 'answered' && 'bg-emerald-500',
          status === 'closed' && 'bg-white/70'
        )}
      />
      {quoteStatusLabels[status]}
    </span>
  )
}

const requestStyles: Record<RequestStatus, string> = {
  new: 'bg-blue-50 text-blue-700 ring-blue-600/15',
  review: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  attended: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  discarded: 'bg-slate-100 text-slate-500 ring-slate-500/15',
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        requestStyles[status]
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'new' && 'bg-blue-500',
          status === 'review' && 'bg-amber-500',
          status === 'attended' && 'bg-emerald-500',
          status === 'discarded' && 'bg-slate-400'
        )}
      />
      {requestStatusLabels[status]}
    </span>
  )
}
