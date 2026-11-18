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
        'grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-[11px] font-bold text-muted-foreground ring-1 ring-inset ring-border/80',
        className
      )}
      aria-hidden="true"
    >
      {initials(company?.trim() || name)}
    </span>
  )
}

const clientStyles: Record<ClientStatus, string> = {
  active: 'bg-emerald-500/10 text-success-ink ring-emerald-600/15',
  inactive: 'bg-muted text-muted-foreground ring-slate-500/15',
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
  draft: 'bg-muted text-muted-foreground ring-slate-500/15',
  new: 'bg-tint-brand text-brand-ink ring-[#2563EB]/15',
  review: 'bg-amber-500/10 text-warning-ink ring-amber-600/15',
  sent: 'bg-tint-brand text-brand-ink ring-[#2563EB]/15',
  approved: 'bg-emerald-500/10 text-success-ink ring-emerald-600/15',
  rejected: 'bg-red-500/10 text-danger-ink ring-red-600/15',
  expired: 'bg-slate-500/15 text-muted-foreground ring-slate-500/20',
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
          status === 'new' && 'bg-[#1D4ED8]',
          status === 'review' && 'bg-amber-500',
          status === 'sent' && 'bg-[#1D4ED8]',
          status === 'approved' && 'bg-emerald-500',
          status === 'rejected' && 'bg-red-500',
          status === 'expired' && 'bg-card/70'
        )}
      />
      {quoteStatusLabels[status]}
    </span>
  )
}

const requestStyles: Record<RequestStatus, string> = {
  new: 'bg-tint-brand text-brand-ink ring-[#2563EB]/15',
  review: 'bg-amber-500/10 text-warning-ink ring-amber-600/15',
  attended: 'bg-emerald-500/10 text-success-ink ring-emerald-600/15',
  discarded: 'bg-muted text-muted-foreground ring-slate-500/15',
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
          status === 'new' && 'bg-[#1D4ED8]',
          status === 'review' && 'bg-amber-500',
          status === 'attended' && 'bg-emerald-500',
          status === 'discarded' && 'bg-slate-400'
        )}
      />
      {requestStatusLabels[status]}
    </span>
  )
}
