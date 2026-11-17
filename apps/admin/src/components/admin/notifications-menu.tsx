'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  BookOpenCheck,
  CheckCircle2,
  FileText,
  Inbox,
  Package,
  PackageCheck,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CanFunction } from '@/lib/admin/access'

type NotificationCounts = {
  quotes: number
  products: number
  orders: number
  requests: number
  complaints?: number
}

type NotificationItem = {
  key: string
  href: string
  label: string
  description: string
  count: number
  icon: LucideIcon
  tone: 'brand' | 'amber'
}

const toneStyles = {
  brand: 'bg-tint-brand text-brand-ink ring-[#2563EB]/20',
  amber: 'bg-amber-500/10 text-warning-ink ring-amber-500/25',
} as const

const countStyles = {
  brand: 'bg-[#2563EB]/10 text-[#2563EB]',
  amber: 'bg-amber-500/15 text-warning-ink',
} as const

export function NotificationsMenu({
  counts,
  can,
  onRefresh,
}: {
  counts: NotificationCounts
  can: CanFunction
  onRefresh?: () => void
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    onRefresh?.()
    function handlePointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onRefresh])

  const allItems: NotificationItem[] = [
    {
      key: 'quotes',
      href: '/cotizaciones',
      label: 'Cotizaciones por atender',
      description: 'Borradores y enviadas sin respuesta.',
      count: counts.quotes,
      icon: FileText,
      tone: 'brand',
    },
    {
      key: 'orders',
      href: '/pedidos',
      label: 'Pedidos en ruta',
      description: 'Entregas pendientes o en curso.',
      count: counts.orders,
      icon: PackageCheck,
      tone: 'brand',
    },
    {
      key: 'requests',
      href: '/solicitudes',
      label: 'Consultas nuevas',
      description: 'Mensajes sin revisar en la mesa de ayuda.',
      count: counts.requests,
      icon: Inbox,
      tone: 'brand',
    },
    {
      key: 'complaints',
      href: '/reclamaciones',
      label: 'Reclamaciones pendientes',
      description: 'Reclamos del libro sin atender.',
      count: counts.complaints ?? 0,
      icon: BookOpenCheck,
      tone: 'amber',
    },
    {
      key: 'products',
      href: '/productos?stock=low',
      label: 'Productos por reponer',
      description: 'Agotados o por debajo del stock mínimo.',
      count: counts.products,
      icon: Package,
      tone: 'amber',
    },
  ]

  const items = allItems.filter((item) => can(item.key))
  const pending = items.filter((item) => item.count > 0)
  const total = pending.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={total > 0 ? `Notificaciones: ${total} pendientes` : 'Notificaciones'}
        className="relative grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-xs transition hover:bg-muted"
      >
        <Bell className="size-4" aria-hidden="true" />
        {total > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#2563EB] px-1 text-[9px] font-bold leading-none text-white ring-2 ring-card">
            {total > 99 ? '99+' : total}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-slate-900/10"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-xs font-bold text-foreground">Notificaciones</p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                {total > 0 ? `${total} ${total === 1 ? 'asunto pendiente' : 'asuntos pendientes'}` : 'Todo al día'}
              </p>
            </div>
            <span className="grid size-8 place-items-center rounded-xl bg-tint-brand text-brand-ink ring-1 ring-inset ring-[#2563EB]/20">
              <Bell className="size-4" aria-hidden="true" />
            </span>
          </div>

          <div className="max-h-[360px] overflow-y-auto p-1.5">
            {pending.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-emerald-500/10 text-success-ink ring-1 ring-inset ring-emerald-500/25">
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                </span>
                <p className="text-xs font-semibold text-foreground">Sin notificaciones pendientes</p>
                <p className="max-w-[220px] text-[10.5px] text-muted-foreground">
                  Los nuevos avisos de cotizaciones, pedidos, consultas, reclamos y stock aparecerán aquí.
                </p>
              </div>
            ) : (
              pending.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    role="menuitem"
                    className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition hover:bg-muted"
                  >
                    <span
                      className={cn(
                        'grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
                        toneStyles[item.tone]
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-semibold text-foreground">{item.label}</span>
                        <span
                          className={cn(
                            'shrink-0 rounded-full px-1.5 py-0.5 text-[10.5px] font-bold',
                            countStyles[item.tone]
                          )}
                        >
                          {item.count}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[10.5px] text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                )
              })
            )}
          </div>

          <div className="border-t border-border p-1.5">
            <Link
              href="/notificaciones"
              role="menuitem"
              className="flex items-center justify-center rounded-xl px-3 py-2 text-[11px] font-semibold text-[#2563EB] transition hover:bg-muted"
            >
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
