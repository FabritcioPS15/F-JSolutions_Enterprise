export { cn } from '../utils'

// Formatear precio en soles peruanos
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(price)
}

// Calcular porcentaje de descuento
export function calcDiscount(price: number, oldPrice: number): number {
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}

// Truncar texto
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

// Generar slug a partir de un texto
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}