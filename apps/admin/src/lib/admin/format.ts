import type {
  AdminProduct,
  ClientSegment,
  ClientStatus,
  Currency,
  DeploymentEnvironment,
  InventoryMovement,
  InventoryMovementType,
  ProductAvailability,
  ProductStatus,
  QuoteLine,
  QuoteStatus,
  RequestChannel,
  RequestStatus,
  StockState,
  WebProjectStatus,
  WebProjectType,
} from './types'

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

export function getStockState(product: Pick<AdminProduct, 'stock' | 'minStock'>): StockState {
  if (product.stock <= 0) return 'out'
  if (product.stock <= product.minStock) return 'low'
  return 'ok'
}

export const stockLabels: Record<StockState, string> = {
  ok: 'Disponible',
  low: 'Stock bajo',
  out: 'Sin stock',
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

export function quoteTotals(
  items: Pick<QuoteLine, 'quantity' | 'unitPrice'>[],
  igvPercent: number
) {
  const total = items.reduce(
    (sum, item) => sum + Math.max(0, item.quantity) * Math.max(0, item.unitPrice),
    0
  )
  const rate = Math.min(100, Math.max(0, igvPercent)) / 100
  const net = rate > 0 ? total / (1 + rate) : total
  return {
    total: Math.round(total * 100) / 100,
    net: Math.round(net * 100) / 100,
    tax: Math.round((total - net) * 100) / 100,
  }
}

export function buildQuoteCode(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `COT-${stamp}-${random}`
}

export function buildRequestCode(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `SOL-${stamp}-${random}`
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
