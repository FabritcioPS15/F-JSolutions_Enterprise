'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AlertTriangle,
  Bell,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Inbox,
  Package,
  PackageCheck,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { moduleForPathname, type CanFunction } from '@/lib/admin/access'
import { formatDate } from '@/lib/admin/format'
import type { AdminNotification } from '@/lib/admin/notifications'

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
  brand: 'bg-tint-brand text-brand-ink ring-[#5946A6]/20',
  amber: 'bg-amber-500/10 text-warning-ink ring-amber-500/25',
} as const

const countBadgeClass = 'grid size-[19px] shrink-0 place-items-center rounded-full bg-rose-500 text-[10px] font-bold leading-none text-white aspect-square shadow-xs'

const activityToneStyles = {
  info: 'bg-tint-brand text-brand-ink ring-[#5946A6]/20',
  success: 'bg-emerald-500/10 text-success-ink ring-emerald-500/25',
  warning: 'bg-amber-500/10 text-warning-ink ring-amber-500/25',
} as const

const unitLabels: Record<AdminNotification['unit'], string> = {
  systems: 'Systems',
  store: 'Store',
  studio: 'Studio',
  sistema: 'Sistema',
}

function ActivityIcon({ tone }: { tone: AdminNotification['tone'] }) {
  const Icon = tone === 'warning' ? AlertTriangle : tone === 'success' ? CheckCircle2 : Bell
  return <Icon className="size-4" aria-hidden="true" />
}

export function NotificationsMenu({
  counts,
  can,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onRefresh,
}: {
  counts: NotificationCounts
  can: CanFunction
  notifications: AdminNotification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
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
  const visibleNotifications = notifications.filter((notification) => {
    const module = moduleForPathname(notification.href.split('?')[0] ?? notification.href)
    return module ? can(module) : true
  })
  const unreadCount = visibleNotifications.filter((notification) => !notification.readAt).length
  const badgeCount = total + unreadCount

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={
          badgeCount > 0
            ? `Notificaciones: ${badgeCount} pendientes o sin leer`
            : 'Notificaciones'
        }
        className="relative grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-xs transition hover:bg-muted"
      >
        <Bell className="size-4" aria-hidden="true" />
        {badgeCount > 0 && (
          <span className="absolute -right-1 -top-1 grid size-[19px] shrink-0 place-items-center rounded-full bg-rose-500 text-[9.5px] font-bold leading-none text-white ring-2 ring-card aspect-square shadow-xs">
            {badgeCount > 99 ? '99+' : badgeCount}
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
                {total > 0
                  ? `${total} ${total === 1 ? 'asunto pendiente' : 'asuntos pendientes'}`
                  : 'Todo al día'}
                {unreadCount > 0 ? ` · ${unreadCount} sin leer` : ''}
              </p>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10.5px] font-semibold text-[#5946A6] transition hover:bg-muted"
              >
                <Check className="size-3.5" aria-hidden="true" />
                Marcar leídas
              </button>
            ) : (
              <span className="grid size-8 place-items-center rounded-xl bg-rose-500/10 text-rose-500 ring-1 ring-inset ring-rose-500/20">
                <Bell className="size-4" aria-hidden="true" />
              </span>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto p-1.5">
            {pending.length === 0 && visibleNotifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-emerald-500/10 text-success-ink ring-1 ring-inset ring-emerald-500/25">
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                </span>
                <p className="text-xs font-semibold text-foreground">Sin notificaciones pendientes</p>
                <p className="max-w-[240px] text-[10.5px] text-muted-foreground">
                  Los avisos de operación, cambios e incidencias aparecerán aquí.
                </p>
              </div>
            ) : (
              <>
                {pending.length > 0 && (
                  <>
                    <p className="px-2.5 pb-1 pt-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      Pendientes
                    </p>
                    {pending.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setOpen(false)}
                          className="group flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition hover:bg-muted"
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
                              <span className={countBadgeClass}>
                                {item.count > 99 ? '99+' : item.count}
                              </span>
                            </span>
                            <span className="mt-0.5 block text-[10.5px] text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                          <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
                        </Link>
                      )
                    })}
                  </>
                )}

                {visibleNotifications.length > 0 && (
                  <>
                    <p className="px-2.5 pb-1 pt-3 text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      Actividad reciente
                    </p>
                    {visibleNotifications.slice(0, 6).map((notification) => (
                      <Link
                        key={notification.id}
                        href={notification.href}
                        role="menuitem"
                        onClick={() => {
                          onMarkRead(notification.id)
                          setOpen(false)
                        }}
                        className={cn(
                          'group flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition hover:bg-muted',
                          !notification.readAt && 'bg-muted/45'
                        )}
                      >
                        <span
                          className={cn(
                            'grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
                            activityToneStyles[notification.tone]
                          )}
                        >
                          <ActivityIcon tone={notification.tone} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            {!notification.readAt && (
                              <span className="size-1.5 shrink-0 rounded-full bg-rose-500" aria-label="Sin leer" />
                            )}
                            <span className="truncate text-xs font-semibold text-foreground">
                              {notification.title}
                            </span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-[10.5px] leading-relaxed text-muted-foreground">
                            {notification.description}
                          </span>
                          <span className="mt-1 block text-[9.5px] text-muted-foreground/80">
                            {unitLabels[notification.unit]} · {formatDate(notification.createdAt)}
                          </span>
                        </span>
                        <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
                      </Link>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          <div className="border-t border-border p-1.5">
            <Link
              href="/notificaciones"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-xl px-3 py-2 text-[11px] font-semibold text-[#5946A6] transition hover:bg-muted"
            >
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
