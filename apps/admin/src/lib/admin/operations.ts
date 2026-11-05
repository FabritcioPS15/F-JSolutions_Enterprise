import type {
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
  AttributeType,
  DeliveryMethod,
  Order,
  OrderStatus,
  PaymentStatus,
  SupplierStatus,
} from './types'

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Recién recibido',
  confirmed: 'Confirmado',
  processing: 'En preparación',
  shipped: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Anulado',
}

export const orderStatusClasses: Record<OrderStatus, string> = {
  pending: 'bg-slate-100 text-slate-700 ring-slate-200',
  confirmed: 'bg-sky-50 text-sky-700 ring-sky-200',
  processing: 'bg-amber-50 text-amber-700 ring-amber-200',
  shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Por cobrar',
  partial: 'Pago parcial',
  paid: 'Pagado',
}

export const deliveryMethodLabels: Record<DeliveryMethod, string> = {
  pickup: 'Recojo en tienda',
  courier: 'Courier',
  own: 'Reparto propio',
}

// Flujo logístico del pedido: `cancelled` es transversal y no forma parte.
export const deliveryFlow: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
]

export const openOrderStatuses: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
]

export function nextOrderStatus(status: OrderStatus): OrderStatus | null {
  const index = deliveryFlow.indexOf(status)
  if (index < 0 || index === deliveryFlow.length - 1) return null
  return deliveryFlow[index + 1]
}

export function orderUnits(order: Order) {
  const ordered = order.items.reduce((total, item) => total + Math.max(0, item.quantity), 0)
  const delivered = order.items.reduce(
    (total, item) => total + Math.max(0, Math.min(item.deliveredQuantity, item.quantity)),
    0
  )
  return { ordered, delivered, pending: Math.max(0, ordered - delivered) }
}

// Una fecha esperada ya vencida y sin entrega se muestra como entrega atrasada.
export function isDeliveryLate(order: Order, today = new Date()) {
  if (!order.expectedDeliveryAt || order.status === 'delivered' || order.status === 'cancelled') {
    return false
  }
  const expected = new Date(`${order.expectedDeliveryAt}T23:59:59.000Z`)
  return !Number.isNaN(expected.getTime()) && expected.getTime() < today.getTime()
}

export const supplierStatusLabels: Record<SupplierStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
}

export const attributeTypeLabels: Record<AttributeType, string> = {
  text: 'Texto',
  number: 'Número',
  select: 'Lista de opciones',
  boolean: 'Sí / No',
}

export const roleLabels: Record<AdminUserRole, string> = {
  superadmin: 'Superadministrador',
  admin: 'Administrador',
  ventas: 'Ventas',
  soporte: 'Soporte',
  consulta: 'Solo lectura',
}

export const userStatusLabels: Record<AdminUserStatus, string> = {
  active: 'Activo',
  invited: 'Invitado',
  disabled: 'Desactivado',
}

export const userStatusClasses: Record<AdminUserStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  invited: 'bg-sky-50 text-sky-700 ring-sky-200',
  disabled: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export function userInitials(user: Pick<AdminUser, 'name' | 'email'>) {
  const source = user.name.trim() || user.email
  const parts = source.split(/\s+/).filter(Boolean)
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
  return initials || source.slice(0, 2).toUpperCase()
}
