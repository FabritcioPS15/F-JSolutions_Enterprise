// Reglas de dominio compartidas entre la web pública, el panel admin y la API.
// Son la fuente canónica de validaciones y cálculos que antes estaban duplicados
// en cada app; cualquier cambio aquí debe reflejarse en los schemas zod de
// `apps/api/src/models/*.model.ts`, que siguen siendo la autoridad en el backend.

export type DomainDocumentType = 'dni' | 'ruc'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export const PASSWORD_HINT = 'Mínimo 8 caracteres, con mayúscula, minúscula y número.'

export function passwordProblem(password: string): string | null {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'La contraseña debe incluir mayúscula, minúscula y número.'
  }
  return null
}

// DNI peruano: 8 dígitos. RUC: 11 dígitos.
export function isValidDocument(type: DomainDocumentType, value: string): boolean {
  const digits = onlyDigits(value)
  return type === 'dni' ? digits.length === 8 : digits.length === 11
}

export function isValidRuc(value: string): boolean {
  return onlyDigits(value).length === 11
}

function dateStamp(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}

function randomSuffix(): string {
  // padStart garantiza 4 caracteres: Math.random().toString(36) a veces recorta
  // el sufijo y produce códigos de longitud variable.
  return Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, '0')
}

export function buildQuoteCode(date = new Date()): string {
  return `COT-${dateStamp(date)}-${randomSuffix()}`
}

export function buildRequestCode(date = new Date()): string {
  return `SOL-${dateStamp(date)}-${randomSuffix()}`
}

export type PricedLine = {
  quantity: number
  unitPrice: number
}

export type LineTotals = {
  total: number
  net: number
  tax: number
}

// Los importes se almacenan con IGV incluido, por eso la base se obtiene
// dividiendo y el impuesto es la diferencia.
export function lineTotal(line: PricedLine): number {
  return Math.max(0, line.quantity) * Math.max(0, line.unitPrice)
}

export function quoteTotals(items: PricedLine[], igvPercent: number): LineTotals {
  const total = items.reduce((sum, item) => sum + lineTotal(item), 0)
  const rate = Math.min(100, Math.max(0, igvPercent)) / 100
  const net = rate > 0 ? total / (1 + rate) : total
  return {
    total: Math.round(total * 100) / 100,
    net: Math.round(net * 100) / 100,
    tax: Math.round((total - net) * 100) / 100,
  }
}
