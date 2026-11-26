'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Bell,
  BookOpenCheck,
  Check,
  CheckCheck,
  CheckCircle2,
  FileText,
  History,
  Inbox,
  Package,
  PackageCheck,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import {
  EmptyState,
  LoadingState,
  PageHeader,
  SectionCard,
  btnSecondary,
} from '@/components/admin/ui'
import { formatDate, getStockState, quoteStatusLabels, stockLabels } from '@/lib/admin/format'
import { moduleForPathname } from '@/lib/admin/access'
import {
  isLowStockProduct,
  isNewRequest,
  isOpenOrder,
  isPendingQuote,
  type AdminNotification,
} from '@/lib/admin/notifications'
import { orderStatusLabels } from '@/lib/admin/operations'
import { cn } from '@/lib/utils'
import type { Complaint } from '@fj-solutions/contracts/complaints-book'

type FeedEntry = {
  id: string
  title: string
  subtitle: string
  meta: string
}

type NotificationArea = 'ventas' | 'clientes' | 'atencion' | 'catalogo'

type FeedSection = {
  key: string
  area: NotificationArea
  title: string
  description: string
  href: string
  icon: LucideIcon
  tone: 'brand' | 'amber'
  count: number
  entries: FeedEntry[]
  loading?: boolean
}

const areas: { key: NotificationArea; label: string }[] = [
  { key: 'ventas', label: 'Ventas' },
  { key: 'clientes', label: 'Clientes' },
  { key: 'atencion', label: 'Atención al cliente' },
  { key: 'catalogo', label: 'Catálogo' },
]

const allAreas = areas.map((area) => area.key)

const LIMIT = 5

const toneStyles = {
  brand: 'bg-tint-brand text-brand-ink ring-[#5946A6]/20',
  amber: 'bg-amber-500/10 text-warning-ink ring-amber-500/25',
} as const

const activityToneStyles = {
  info: 'bg-tint-brand text-brand-ink ring-[#5946A6]/20',
  success: 'bg-emerald-500/10 text-success-ink ring-emerald-500/25',
  warning: 'bg-amber-500/10 text-warning-ink ring-amber-500/25',
} as const

const unitLabels: Record<AdminNotification['unit'], string> = {
  systems: 'SparkTree Systems',
  store: 'SparkTree Store',
  studio: 'SparkTree Studio',
  sistema: 'Sistema',
}

function ActivityIcon({ tone }: { tone: AdminNotification['tone'] }) {
  const Icon = tone === 'warning' ? AlertTriangle : tone === 'success' ? CheckCircle2 : Bell
  return <Icon className="size-4" aria-hidden="true" />
}

function byNewest(a: string, b: string) {
  return new Date(b).getTime() - new Date(a).getTime()
}

export function NotificationsView() {
  const {
    hydrated,
    can,
    quotes,
    orders,
    requests,
    products,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAdmin()
  const [complaints, setComplaints] = useState<Complaint[] | null>(null)
  const [selectedAreas, setSelectedAreas] = useState<NotificationArea[]>(allAreas)

  const canViewComplaints = can('complaints')
  const visibleNotifications = notifications.filter((notification) => {
    const module = moduleForPathname(notification.href.split('?')[0] ?? notification.href)
    return module ? can(module) : true
  })
  const unreadCount = visibleNotifications.filter((notification) => !notification.readAt).length

  useEffect(() => {
    if (!canViewComplaints) return
    let active = true
    async function load() {
      try {
        const response = await fetch('/api/admin/complaints', { cache: 'no-store' })
        if (!response.ok) return
        const payload = (await response.json()) as { data?: { complaints?: Complaint[] } }
        if (active && Array.isArray(payload.data?.complaints)) {
          setComplaints(payload.data.complaints)
        }
      } catch {
        // Sin API disponible se mantienen los avisos locales del panel.
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [canViewComplaints])

  const pendingComplaints = useMemo(
    () =>
      (complaints ?? [])
        .filter((item) => item.status === 'pending')
        .sort((a, b) => byNewest(a.createdAt, b.createdAt)),
    [complaints]
  )

  const sections: FeedSection[] = useMemo(() => {
    const all: FeedSection[] = [
      {
        key: 'quotes',
        area: 'ventas',
        title: 'Cotizaciones por atender',
        description: 'Borradores y enviadas que esperan respuesta.',
        href: '/cotizaciones',
        icon: FileText,
        tone: 'brand',
        count: quotes.filter(isPendingQuote).length,
        entries: [...quotes]
          .filter(isPendingQuote)
          .sort((a, b) => byNewest(a.updatedAt, b.updatedAt))
          .slice(0, LIMIT)
          .map((quote) => ({
            id: quote.id,
            title: `${quote.code} · ${quote.clientName}`,
            subtitle: quote.clientCompany || quote.clientEmail,
            meta: quoteStatusLabels[quote.status],
          })),
      },
      {
        key: 'orders',
        area: 'clientes',
        title: 'Pedidos en ruta',
        description: 'Pedidos pendientes, confirmados, en preparación o enviados.',
        href: '/pedidos',
        icon: PackageCheck,
        tone: 'brand',
        count: orders.filter(isOpenOrder).length,
        entries: [...orders]
          .filter(isOpenOrder)
          .sort((a, b) => byNewest(a.createdAt, b.createdAt))
          .slice(0, LIMIT)
          .map((order) => ({
            id: order.id,
            title: `${order.code} · ${order.clientName}`,
            subtitle: order.expectedDeliveryAt
              ? `Entrega estimada: ${formatDate(order.expectedDeliveryAt)}`
              : order.deliveryAddress,
            meta: orderStatusLabels[order.status],
          })),
      },
      {
        key: 'requests',
        area: 'atencion',
        title: 'Consultas nuevas',
        description: 'Mensajes de la mesa de ayuda sin revisar.',
        href: '/solicitudes',
        icon: Inbox,
        tone: 'brand',
        count: requests.filter(isNewRequest).length,
        entries: [...requests]
          .filter(isNewRequest)
          .sort((a, b) => byNewest(a.createdAt, b.createdAt))
          .slice(0, LIMIT)
          .map((request) => ({
            id: request.id,
            title: `${request.code} · ${request.name}`,
            subtitle: request.topic,
            meta: 'Nueva',
          })),
      },
      {
        key: 'complaints',
        area: 'atencion',
        title: 'Reclamaciones pendientes',
        description: 'Reclamos del libro que aún no se atienden.',
        href: '/reclamaciones',
        icon: BookOpenCheck,
        tone: 'amber',
        count: pendingComplaints.length,
        loading: canViewComplaints && complaints === null,
        entries: pendingComplaints.slice(0, LIMIT).map((complaint) => ({
          id: complaint.id,
          title: `${complaint.code} · ${complaint.consumer.name}`,
          subtitle: complaint.item.description,
          meta: `Vence ${formatDate(complaint.dueAt)}`,
        })),
      },
      {
        key: 'products',
        area: 'catalogo',
        title: 'Productos por reponer',
        description: 'Agotados o por debajo del stock mínimo.',
        href: '/productos?stock=low',
        icon: Package,
        tone: 'amber',
        count: products.filter(isLowStockProduct).length,
        entries: [...products]
          .filter(isLowStockProduct)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, LIMIT)
          .map((product) => ({
            id: product.id,
            title: product.name,
            subtitle: `${product.sku} · ${product.stock} de ${product.minStock} uds. mínimas`,
            meta: stockLabels[getStockState(product)],
          })),
      },
    ]

    return all.filter((section) => can(section.key))
  }, [can, quotes, orders, requests, complaints, pendingComplaints, products, canViewComplaints])

  if (!hydrated) return <LoadingState label="Cargando notificaciones…" />

  const visibleAreas = areas.filter((area) =>
    sections.some((section) => section.area === area.key)
  )
  const allSelected =
    visibleAreas.length > 0 && visibleAreas.every((area) => selectedAreas.includes(area.key))
  const filteredSections = sections.filter((section) => selectedAreas.includes(section.area))
  const total = filteredSections.reduce((sum, section) => sum + section.count, 0)
  const otherPending = sections
    .filter((section) => !selectedAreas.includes(section.area))
    .reduce((sum, section) => sum + section.count, 0)

  function toggleArea(area: NotificationArea) {
    setSelectedAreas((prev) => {
      if (prev.length === allAreas.length) return [area]
      if (prev.includes(area)) {
        const next = prev.filter((item) => item !== area)
        return next.length > 0 ? next : [...allAreas]
      }
      return allAreas.filter((item) => item === area || prev.includes(item))
    })
  }

  function chipClass(active: boolean) {
    return cn(
      'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold transition',
      active
        ? 'border-[#5946A6]/30 bg-tint-brand text-brand-ink shadow-xs'
        : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="General"
        title="Notificaciones"
        description="Avisos pendientes, cambios recientes e incidencias de sincronización del panel."
        actions={
          unreadCount > 0 ? (
            <button type="button" className={btnSecondary} onClick={markAllNotificationsRead}>
              <CheckCheck className="size-4" aria-hidden="true" />
              Marcar todas como leídas
            </button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar notificaciones por área">
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Filtrar
        </span>
        <button
          type="button"
          onClick={() => setSelectedAreas([...allAreas])}
          aria-pressed={allSelected}
          className={chipClass(allSelected)}
        >
          {allSelected && <Check className="size-3.5" aria-hidden="true" />}
          General
        </button>
        {visibleAreas.map((area) => {
          const active = !allSelected && selectedAreas.includes(area.key)
          return (
            <button
              key={area.key}
              type="button"
              onClick={() => toggleArea(area.key)}
              aria-pressed={active}
              className={chipClass(active)}
            >
              {active && <Check className="size-3.5" aria-hidden="true" />}
              {area.label}
            </button>
          )
        })}
      </div>

      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border px-5 py-4',
          total > 0
            ? 'border-[#5946A6]/20 bg-gradient-to-r from-tint-brand to-card'
            : 'border-emerald-500/25 bg-emerald-500/10'
        )}
      >
        <span
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-xl text-white shadow-xs',
            total > 0 ? 'bg-[#5946A6]' : 'bg-emerald-600'
          )}
        >
          {total > 0 ? (
            <Bell className="size-5" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="size-5" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">
            {total > 0
              ? `${total} ${total === 1 ? 'asunto pendiente' : 'asuntos pendientes'}`
              : allSelected
                ? 'Todo al día'
                : 'Sin pendientes en la selección'}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {total > 0
              ? 'Atiende cada módulo desde su enlace para que los avisos desaparezcan.'
              : allSelected
                ? 'No hay cotizaciones, pedidos, consultas, reclamos ni productos pendientes.'
                : otherPending > 0
                  ? `Hay ${otherPending} ${otherPending === 1 ? 'aviso' : 'avisos'} en las áreas que no están seleccionadas.`
                  : 'No hay avisos pendientes en el panel.'}
          </p>
        </div>
      </div>

      {visibleNotifications.length > 0 && (
        <SectionCard
          title="Actividad reciente"
          description="Historial de altas, ediciones, cambios de estado e incidencias del sistema."
          icon={History}
          action={
            unreadCount > 0 ? (
              <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-[10.5px] font-semibold text-rose-600 ring-1 ring-inset ring-rose-500/20">
                {unreadCount} sin leer
              </span>
            ) : undefined
          }
          bodyClassName="p-2"
        >
          <ul className="divide-y divide-border/70">
            {visibleNotifications.slice(0, 30).map((notification) => (
              <li key={notification.id} className={cn(!notification.readAt && 'bg-muted/35')}>
                <div className="flex items-start gap-3 rounded-xl px-3 py-3">
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
                      activityToneStyles[notification.tone]
                    )}
                  >
                    <ActivityIcon tone={notification.tone} />
                  </span>
                  <Link
                    href={notification.href}
                    onClick={() => markNotificationRead(notification.id)}
                    className="min-w-0 flex-1 group"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      {!notification.readAt && (
                        <span className="size-1.5 shrink-0 rounded-full bg-rose-500" aria-label="Sin leer" />
                      )}
                      <span className="text-xs font-semibold text-foreground transition group-hover:text-[#5946A6]">
                        {notification.title}
                      </span>
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">
                      {notification.description}
                    </span>
                    <span className="mt-1.5 block text-[9.5px] text-muted-foreground/80">
                      {unitLabels[notification.unit]} · {formatDate(notification.createdAt)}
                    </span>
                  </Link>
                  {!notification.readAt && (
                    <button
                      type="button"
                      onClick={() => markNotificationRead(notification.id)}
                      className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      aria-label={`Marcar “${notification.title}” como leída`}
                      title="Marcar como leída"
                    >
                      <Check className="size-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {visibleNotifications.length > 30 && (
            <p className="px-3 py-2 text-[10.5px] text-muted-foreground">
              Mostrando los 30 avisos más recientes de {visibleNotifications.length}.
            </p>
          )}
        </SectionCard>
      )}

      {total === 0 ? (
        allSelected ? (
          <EmptyState
            icon={CheckCircle2}
            title="Sin notificaciones pendientes"
            description="Los nuevos avisos de cotizaciones, pedidos, consultas, reclamos y stock aparecerán aquí."
          />
        ) : (
          <EmptyState
            icon={CheckCircle2}
            title="Sin pendientes en esta selección"
            description="Selecciona otras áreas o vuelve a General para ver todos los avisos del panel."
            action={
              <button
                type="button"
                onClick={() => setSelectedAreas([...allAreas])}
                className={btnSecondary}
              >
                Ver general
              </button>
            }
          />
        )
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredSections.map((section) => {
            const Icon = section.icon
            return (
              <SectionCard
                key={section.key}
                title={section.title}
                description={section.description}
                icon={Icon}
                action={
                  <Link
                    href={section.href}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-foreground/80 shadow-xs transition hover:border-[#5946A6]/40 hover:text-[#5946A6]"
                  >
                    Ver módulo
                  </Link>
                }
                bodyClassName="p-2"
              >
                {section.loading ? (
                  <p className="px-3 py-4 text-xs text-muted-foreground">Cargando reclamos…</p>
                ) : section.entries.length === 0 ? (
                  <p className="px-3 py-4 text-xs text-muted-foreground">Sin pendientes por ahora.</p>
                ) : (
                  <ul className="space-y-0.5">
                    {section.entries.map((entry) => (
                      <li key={entry.id}>
                        <Link
                          href={section.href}
                          className="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 transition hover:bg-muted"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-semibold text-foreground">
                              {entry.title}
                            </span>
                            <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground">
                              {entry.subtitle}
                            </span>
                          </span>
                          <span
                            className={cn(
                              'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
                              section.tone === 'amber'
                                ? 'bg-amber-500/10 text-warning-ink ring-amber-500/25'
                                : 'bg-muted text-muted-foreground ring-border'
                            )}
                          >
                            {entry.meta}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {section.count > LIMIT && (
                  <Link
                    href={section.href}
                    className="mt-1 block rounded-xl px-3 py-2 text-[11px] font-semibold text-[#5946A6] transition hover:bg-muted"
                  >
                    +{section.count - LIMIT} más en el módulo
                  </Link>
                )}
              </SectionCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
