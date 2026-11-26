import type { AdminData, AdminProduct, Order, Quote, ServiceRequest } from './types'
import {
  clientStatusLabels,
  getStockState,
  purchaseRequestStatusLabels,
  quoteStatusLabels,
  statusLabels,
  webProjectStatusLabels,
} from './format'
import { openOrderStatuses, orderStatusLabels } from './operations'

const pendingQuoteStatuses: Quote['status'][] = ['draft', 'new', 'review']

export function isPendingQuote(quote: Quote) {
  return pendingQuoteStatuses.includes(quote.status)
}

export function isLowStockProduct(product: AdminProduct) {
  if (product.status === 'archived') return false
  const state = getStockState(product)
  return state === 'low' || state === 'out'
}

export function isOpenOrder(order: Order) {
  return openOrderStatuses.includes(order.status)
}

export function isNewRequest(request: ServiceRequest) {
  return request.status === 'new'
}

export type AdminNotificationUnit = 'systems' | 'store' | 'studio' | 'sistema'
export type AdminNotificationTone = 'info' | 'success' | 'warning'

export type AdminNotificationInput = {
  dedupeKey: string
  title: string
  description: string
  href: string
  unit: AdminNotificationUnit
  tone: AdminNotificationTone
  createdAt?: string
}

export type AdminNotification = AdminNotificationInput & {
  id: string
  createdAt: string
  readAt?: string
}

export const ADMIN_NOTIFICATIONS_STORAGE_KEY = 'fj-admin-notifications-v1'

const notificationUnits: AdminNotificationUnit[] = ['systems', 'store', 'studio', 'sistema']
const notificationTones: AdminNotificationTone[] = ['info', 'success', 'warning']

export function parseAdminNotifications(raw: string | null): AdminNotification[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((value, index): AdminNotification | null => {
        if (!value || typeof value !== 'object') return null
        const item = value as Record<string, unknown>
        if (
          typeof item.id !== 'string' ||
          typeof item.dedupeKey !== 'string' ||
          typeof item.title !== 'string' ||
          typeof item.description !== 'string' ||
          typeof item.createdAt !== 'string'
        ) {
          return null
        }
        const unit = notificationUnits.includes(item.unit as AdminNotificationUnit)
          ? (item.unit as AdminNotificationUnit)
          : 'sistema'
        const tone = notificationTones.includes(item.tone as AdminNotificationTone)
          ? (item.tone as AdminNotificationTone)
          : 'info'
        return {
          id: item.id || `notificacion-${index}`,
          dedupeKey: item.dedupeKey,
          title: item.title,
          description: item.description,
          href:
            typeof item.href === 'string' && item.href.startsWith('/')
              ? item.href
              : '/notificaciones',
          unit,
          tone,
          createdAt: item.createdAt,
          readAt: typeof item.readAt === 'string' ? item.readAt : undefined,
        }
      })
      .filter((item): item is AdminNotification => item !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 80)
  } catch {
    return []
  }
}

type TrackedItem = {
  id: string
  updatedAt: string
  status?: string
  label: string
  subtitle?: string
}

type TrackedCollection = {
  key: string
  noun: string
  plural: string
  unit: AdminNotificationUnit
  href: string
  items: (data: AdminData) => TrackedItem[]
  statusLabels?: Record<string, string>
  statusTitles?: Record<string, string>
  createdTitle?: string
  updatedTitle?: string
  deletedTitle?: string
  successStatuses?: string[]
  warningStatuses?: string[]
}

function track<T extends { id: string; updatedAt: string; status?: string }>(
  items: T[],
  label: (item: T) => string,
  subtitle?: (item: T) => string
): TrackedItem[] {
  return items.map((item) => ({
    id: item.id,
    updatedAt: item.updatedAt,
    status: item.status,
    label: label(item),
    subtitle: subtitle?.(item),
  }))
}

const trackedCollections: TrackedCollection[] = [
  {
    key: 'products',
    noun: 'Producto',
    plural: 'productos',
    unit: 'store',
    href: '/productos',
    items: (data) => track(data.products, (item) => item.name, (item) => item.sku),
    statusLabels: statusLabels,
    statusTitles: {
      active: 'Producto publicado',
      draft: 'Producto retirado de publicación',
      archived: 'Producto archivado',
    },
    successStatuses: ['active'],
    warningStatuses: ['archived'],
  },
  {
    key: 'clients',
    noun: 'Cliente',
    plural: 'clientes',
    unit: 'store',
    href: '/clientes',
    items: (data) => track(data.clients, (item) => item.name, (item) => item.company),
    statusLabels: clientStatusLabels,
    warningStatuses: ['inactive'],
  },
  {
    key: 'quotes',
    noun: 'Cotización',
    plural: 'cotizaciones',
    unit: 'store',
    href: '/cotizaciones',
    items: (data) => track(data.quotes, (item) => item.code, (item) => item.clientName),
    statusLabels: quoteStatusLabels,
    createdTitle: 'Cotización creada',
    updatedTitle: 'Cotización actualizada',
    deletedTitle: 'Cotización eliminada',
    statusTitles: {
      approved: 'Cotización aceptada',
      rejected: 'Cotización rechazada',
      sent: 'Cotización enviada',
      expired: 'Cotización vencida',
    },
    successStatuses: ['approved', 'sent'],
    warningStatuses: ['rejected', 'expired'],
  },
  {
    key: 'orders',
    noun: 'Pedido',
    plural: 'pedidos',
    unit: 'store',
    href: '/pedidos',
    items: (data) => track(data.orders, (item) => item.code || item.id, (item) => item.clientName),
    statusLabels: orderStatusLabels,
    statusTitles: {
      confirmed: 'Pedido confirmado',
      shipped: 'Pedido enviado',
      delivered: 'Pedido entregado',
      cancelled: 'Pedido cancelado',
    },
    successStatuses: ['delivered'],
    warningStatuses: ['cancelled'],
  },
  {
    key: 'requests',
    noun: 'Solicitud',
    plural: 'solicitudes',
    unit: 'systems',
    href: '/solicitudes',
    items: (data) => track(data.requests, (item) => item.code, (item) => item.name),
    createdTitle: 'Solicitud creada',
    updatedTitle: 'Solicitud actualizada',
    deletedTitle: 'Solicitud eliminada',
    statusTitles: {
      review: 'Solicitud en revisión',
      attended: 'Solicitud atendida',
      discarded: 'Solicitud descartada',
    },
    successStatuses: ['attended'],
    warningStatuses: ['discarded'],
  },
  {
    key: 'projects',
    noun: 'Proyecto',
    plural: 'proyectos',
    unit: 'studio',
    href: '/proyectos',
    items: (data) => track(data.webProjects, (item) => item.name, (item) => item.clientName),
    statusLabels: webProjectStatusLabels,
    statusTitles: {
      live: 'Proyecto publicado',
      paused: 'Proyecto pausado',
      archived: 'Proyecto archivado',
    },
    successStatuses: ['live'],
    warningStatuses: ['paused', 'archived'],
  },
  {
    key: 'suppliers',
    noun: 'Proveedor',
    plural: 'proveedores',
    unit: 'store',
    href: '/proveedores',
    items: (data) => track(data.suppliers, (item) => item.name),
    warningStatuses: ['inactive'],
  },
  {
    key: 'attributes',
    noun: 'Atributo',
    plural: 'atributos',
    unit: 'store',
    href: '/atributos',
    items: (data) => track(data.attributes, (item) => item.label),
    warningStatuses: ['inactive'],
  },
  {
    key: 'purchase-requests',
    noun: 'Solicitud de compra',
    plural: 'solicitudes de compra',
    unit: 'systems',
    href: '/inventario',
    items: (data) => track(data.purchaseRequests, (item) => item.code, (item) => item.requestedBy),
    createdTitle: 'Solicitud de compra creada',
    updatedTitle: 'Solicitud de compra actualizada',
    deletedTitle: 'Solicitud de compra eliminada',
    statusLabels: purchaseRequestStatusLabels,
    statusTitles: {
      approved: 'Solicitud de compra aprobada',
      rejected: 'Solicitud de compra rechazada',
      ordered: 'Solicitud de compra convertida en orden',
    },
    successStatuses: ['approved', 'ordered'],
    warningStatuses: ['rejected', 'cancelled'],
  },
]

type DataChange = {
  kind: 'created' | 'updated' | 'deleted'
  item: TrackedItem
  previous?: TrackedItem
}

function collectionChanges(
  previous: TrackedItem[],
  current: TrackedItem[]
): DataChange[] {
  const previousById = new Map(previous.map((item) => [item.id, item]))
  const currentById = new Map(current.map((item) => [item.id, item]))
  const changes: DataChange[] = []

  for (const item of current) {
    const before = previousById.get(item.id)
    if (!before) {
      changes.push({ kind: 'created', item })
      continue
    }
    if (before.updatedAt !== item.updatedAt || before.status !== item.status) {
      changes.push({ kind: 'updated', item, previous: before })
    }
  }

  for (const item of previous) {
    if (!currentById.has(item.id)) changes.push({ kind: 'deleted', item })
  }

  return changes
}

function changeTone(collection: TrackedCollection, change: DataChange): AdminNotificationTone {
  if (change.kind === 'deleted' || collection.warningStatuses?.includes(change.item.status ?? '')) {
    return 'warning'
  }
  if (change.kind === 'created' || collection.successStatuses?.includes(change.item.status ?? '')) {
    return 'success'
  }
  return 'info'
}

function changeTitle(collection: TrackedCollection, change: DataChange) {
  if (change.kind === 'created') {
    return collection.createdTitle ?? `${collection.noun} creado`
  }
  if (change.kind === 'deleted') {
    return collection.deletedTitle ?? `${collection.noun} eliminado`
  }
  if (change.previous?.status !== change.item.status && change.item.status) {
    return collection.statusTitles?.[change.item.status] ?? `Estado de ${collection.noun.toLowerCase()} actualizado`
  }
  return collection.updatedTitle ?? `${collection.noun} actualizado`
}

function changeDescription(collection: TrackedCollection, change: DataChange) {
  const status = change.item.status
    ? collection.statusLabels?.[change.item.status] ?? change.item.status
    : undefined
  return [change.item.label, change.item.subtitle, status].filter(Boolean).join(' · ')
}

export function buildDataChangeNotifications(
  previous: AdminData,
  current: AdminData
): AdminNotificationInput[] {
  const notifications: AdminNotificationInput[] = []

  for (const collection of trackedCollections) {
    const changes = collectionChanges(collection.items(previous), collection.items(current))
    if (changes.length === 0) continue

    if (changes.length > 3) {
      const tone = changes.some((change) => changeTone(collection, change) === 'warning')
        ? 'warning'
        : 'info'
      notifications.push({
        dedupeKey: `${collection.key}:bulk:${changes
          .map((change) => `${change.item.id}:${change.item.updatedAt}:${change.kind}`)
          .join('|')}`,
        title: `${changes.length} ${collection.plural} con cambios`,
        description: changes.slice(0, 3).map((change) => change.item.label).join(', '),
        href: collection.href,
        unit: collection.unit,
        tone,
      })
      continue
    }

    for (const change of changes) {
      notifications.push({
        dedupeKey: `${collection.key}:${change.item.id}:${change.kind}:${change.item.updatedAt}:${change.item.status ?? ''}`,
        title: changeTitle(collection, change),
        description: changeDescription(collection, change),
        href: collection.href,
        unit: collection.unit,
        tone: changeTone(collection, change),
      })
    }
  }

  if (JSON.stringify(previous.settings) !== JSON.stringify(current.settings)) {
    notifications.push({
      dedupeKey: `settings:${JSON.stringify(current.settings)}`,
      title: 'Configuración actualizada',
      description: 'Los ajustes generales del panel cambiaron.',
      href: '/configuracion',
      unit: 'sistema',
      tone: 'info',
    })
  }

  return notifications
}
