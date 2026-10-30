import type {
  AdminProduct,
  ClientSegment,
  ClientStatus,
  Currency,
  ProductAvailability,
  ProductStatus,
  QuoteLine,
  QuoteStatus,
  RequestChannel,
  RequestStatus,
  StockState,
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

export function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date)
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
  sent: 'Enviada',
  answered: 'Respondida',
  closed: 'Cerrada',
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

export function productsToCsv(products: AdminProduct[]): string {
  const headers = [
    'id',
    'nombre',
    'slug',
    'sku',
    'codigo_interno',
    'categoria',
    'subcategoria',
    'tipo',
    'marca',
    'precio',
    'costo',
    'mostrar_precio',
    'stock',
    'stock_minimo',
    'estado',
    'disponibilidad',
    'actualizado',
  ]

  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`

  const rows = products.map((product) =>
    [
      product.id,
      product.name,
      product.slug,
      product.sku,
      product.internalCode ?? '',
      product.category,
      product.subcategory ?? '',
      product.subSubcategory ?? '',
      product.brand,
      product.price,
      product.cost ?? '',
      product.showPrice ? 'Sí' : 'No',
      product.stock,
      product.minStock,
      statusLabels[product.status],
      availabilityLabels[product.availability],
      product.updatedAt,
    ]
      .map(escape)
      .join(',')
  )

  return `\uFEFF${headers.join(',')}\n${rows.join('\n')}`
}

export function storageSizeInKb(value: unknown): number {
  try {
    return Math.round(new Blob([JSON.stringify(value)]).size / 1024)
  } catch {
    return 0
  }
}
