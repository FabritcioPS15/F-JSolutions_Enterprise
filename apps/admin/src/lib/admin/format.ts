import type { AdminProduct, Currency, ProductAvailability, ProductStatus, StockState } from './types'

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
