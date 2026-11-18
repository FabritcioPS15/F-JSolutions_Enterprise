import type {
  AdminProduct,
  ClientSegment,
  ClientStatus,
  Currency,
  DeploymentEnvironment,
  InventoryMovement,
  InventoryMovementType,
  MovementSourceType,
  Order,
  ProductAvailability,
  ProductStatus,
  PurchaseOrderStatus,
  PurchaseRequestStatus,
  QuoteLine,
  QuoteStatus,
  RequestChannel,
  RequestStatus,
  StockCountStatus,
  StockPosition,
  StockState,
  WebProjectStatus,
  WebProjectType,
} from './types'

// Códigos de documento, totales con IGV y correlativos de cotización/solicitud
// viven en los contratos compartidos para que web, panel y API calculen igual.
export { buildQuoteCode, buildRequestCode, quoteTotals } from '@fj-solutions/contracts/domain'

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function formatCurrency(value: number, currency: Currency = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE').format(value)
}

// Formato manual (UTC) para que servidor y navegador produzcan exactamente el
// mismo texto: Intl usa espacios especiales en "a. m." que difieren entre ICU.
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic']

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return `${pad(date.getUTCDate())} ${MONTHS_SHORT[date.getUTCMonth()]}. ${date.getUTCFullYear()}`
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const hours = date.getUTCHours()
  const meridiem = hours < 12 ? 'a. m.' : 'p. m.'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${formatDate(value)}, ${pad(hour12)}:${pad(date.getUTCMinutes())} ${meridiem}`
}

export function getStockState(
  product: Pick<AdminProduct, 'stock' | 'minStock'> & Partial<AdminProduct>
): StockState {
  if (product.stock <= 0) return 'out'
  if (product.stock <= product.minStock) return 'low'
  if (product.maxStock !== undefined && product.stock > product.maxStock) return 'over'
  return 'ok'
}

export const stockLabels: Record<StockState, string> = {
  ok: 'Disponible',
  low: 'Stock bajo',
  out: 'Sin stock',
  over: 'Sobre-stock',
}

const OPEN_ORDER_STATUSES = ['pending', 'confirmed', 'processing'] as const

/** Posición de stock derivada: nunca persistimos estos saldos para no duplicar la fuente. */
export function buildStockPositions(input: {
  products: AdminProduct[]
  orders: Order[]
  movements: InventoryMovement[]
  referenceAt?: string
}): StockPosition[] {
  const now = input.referenceAt ? new Date(input.referenceAt).getTime() : Date.now()
  const windowStart = now - 30 * 86_400_000

  const committedByProduct = new Map<string, number>()
  input.orders
    .filter((order) => (OPEN_ORDER_STATUSES as readonly string[]).includes(order.status))
    .forEach((order) => {
      order.items.forEach((item) => {
        if (!item.productId) return
        const pending = item.quantity - item.deliveredQuantity
        if (pending <= 0) return
        committedByProduct.set(
          item.productId,
          (committedByProduct.get(item.productId) ?? 0) + pending
        )
      })
    })

  const demandByProduct = new Map<string, number>()
  input.movements.forEach((movement) => {
    if (movement.type !== 'out') return
    const at = new Date(movement.createdAt).getTime()
    if (Number.isNaN(at) || at < windowStart || at > now) return
    demandByProduct.set(
      movement.productId,
      (demandByProduct.get(movement.productId) ?? 0) + movement.quantity
    )
  })

  return input.products.map((product) => {
    const committed = committedByProduct.get(product.id) ?? 0
    const available = Math.max(product.stock - committed, 0)
    const unitCost = product.cost ?? 0
    const demand30d = demandByProduct.get(product.id) ?? 0
    const dailyDemand = demand30d / 30
    const maxStock = product.maxStock
    const needsReplenishment = product.status !== 'archived' && available <= product.minStock
    const target = maxStock ?? product.minStock * 4
    return {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      locationId: product.locationId,
      onHand: product.stock,
      committed,
      available,
      minStock: product.minStock,
      maxStock,
      state: getStockState(product),
      unitCost,
      valuationCost: product.stock * unitCost,
      valuationRetail: product.stock * product.price,
      demand30d,
      daysOfCover: dailyDemand > 0 ? Math.floor(available / dailyDemand) : null,
      turnover30d: product.stock > 0 ? Number((demand30d / product.stock).toFixed(2)) : null,
      suggestedOrderQuantity: needsReplenishment
        ? Math.max(Math.ceil(target - available), Math.ceil(dailyDemand * 15), 1)
        : 0,
    }
  })
}

export const inventoryMovementLabels: Record<InventoryMovementType, string> = {
  in: 'Entrada',
  out: 'Salida',
  adjustment: 'Ajuste',
}

export const inventoryMovementDescriptions: Record<InventoryMovementType, string> = {
  in: 'Suma unidades al stock disponible.',
  out: 'Descuenta unidades del stock disponible.',
  adjustment: 'Fija el stock real tras un conteo o corrección.',
}

export const movementSourceLabels: Record<MovementSourceType, string> = {
  manual: 'Manual',
  purchase_receipt: 'Recepción de compra',
  stock_count: 'Conteo físico',
  transfer: 'Transferencia',
  order: 'Pedido',
  quote: 'Cotización',
}

export const purchaseRequestStatusLabels: Record<PurchaseRequestStatus, string> = {
  draft: 'Borrador',
  pending: 'Por aprobar',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  ordered: 'Convertida en orden',
  cancelled: 'Anulada',
}

export const purchaseOrderStatusLabels: Record<PurchaseOrderStatus, string> = {
  draft: 'Borrador',
  sent: 'Enviada al proveedor',
  partial: 'Recepción parcial',
  received: 'Recibida',
  cancelled: 'Anulada',
}

export const stockCountStatusLabels: Record<StockCountStatus, string> = {
  open: 'En curso',
  posted: 'Contabilizada',
  cancelled: 'Anulada',
}

export const inventoryReasons: Record<InventoryMovementType, string[]> = {
  in: [
    'Compra a proveedor',
    'Devolución de cliente',
    'Reposición de stock',
    'Transferencia entre almacenes',
    'Otro',
  ],
  out: [
    'Venta',
    'Uso interno',
    'Garantía o RMA',
    'Merma o daño',
    'Transferencia entre almacenes',
    'Otro',
  ],
  adjustment: ['Conteo físico', 'Corrección de error', 'Carga inicial', 'Otro'],
}

export function movementDelta(
  movement: Pick<InventoryMovement, 'previousStock' | 'resultingStock'>
): number {
  return movement.resultingStock - movement.previousStock
}

export const webProjectTypeLabels: Record<WebProjectType, string> = {
  landing: 'Landing page',
  website: 'Página web',
  webapp: 'Sistema web',
  ecommerce: 'E-commerce',
  maintenance: 'Mantenimiento',
  software: 'Software a medida',
}

export const webProjectStatusLabels: Record<WebProjectStatus, string> = {
  planning: 'Planificación',
  development: 'En desarrollo',
  staging: 'En staging',
  live: 'En producción',
  paused: 'Pausado',
  archived: 'Archivado',
}

export const deploymentEnvironmentLabels: Record<DeploymentEnvironment, string> = {
  production: 'Producción',
  staging: 'Staging',
  preview: 'Preview',
}

export function daysBetweenDates(today: string, target: string): number | null {
  if (!today || !target) return null
  const start = new Date(`${today.slice(0, 10)}T00:00:00Z`)
  const end = new Date(`${target.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
  return Math.round((end.getTime() - start.getTime()) / 86_400_000)
}

export const availabilityLabels: Record<ProductAvailability, string> = {
  available: 'Disponible',
  limited: 'Stock limitado',
  consult: 'A pedido',
}

export const availabilityDescriptions: Record<ProductAvailability, string> = {
  available: 'Entrega inmediata',
  limited: 'Unidades limitadas',
  consult: 'A pedido corporativo',
}

export const statusLabels: Record<ProductStatus, string> = {
  active: 'Publicado',
  draft: 'Borrador',
  archived: 'Archivado',
}

export const statusDescriptions: Record<ProductStatus, string> = {
  active: 'Visible en la tienda y disponible para cotizar.',
  draft: 'Oculto al público mientras terminas de editarlo.',
  archived: 'Fuera del catálogo activo. Puedes restaurarlo cuando quieras.',
}

export const clientStatusLabels: Record<ClientStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
}

export const clientSegmentLabels: Record<ClientSegment, string> = {
  empresa: 'Empresa',
  persona: 'Persona',
}

export const quoteStatusLabels: Record<QuoteStatus, string> = {
  draft: 'Borrador',
  new: 'Nueva',
  review: 'En revisión',
  sent: 'Enviada',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  expired: 'Vencida',
}

export const requestStatusLabels: Record<RequestStatus, string> = {
  new: 'Nueva',
  review: 'En revisión',
  attended: 'Atendida',
  discarded: 'Descartada',
}

export const requestChannelLabels: Record<RequestChannel, string> = {
  web: 'Formulario web',
  email: 'Correo',
  whatsapp: 'WhatsApp',
  phone: 'Teléfono',
}

export function quoteItemCount(items: Pick<QuoteLine, 'quantity'>[]): number {
  return items.reduce((total, item) => total + (Number.isFinite(item.quantity) ? item.quantity : 0), 0)
}

export function initials(value: string): string {
  const words = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return '—'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export function getMargin(product: Pick<AdminProduct, 'price' | 'cost'>): number | null {
  if (!product.cost || product.price <= 0) return null
  return ((product.price - product.cost) / product.price) * 100
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function storageSizeInKb(value: unknown): number {
  try {
    return Math.round(new Blob([JSON.stringify(value)]).size / 1024)
  } catch {
    return 0
  }
}
