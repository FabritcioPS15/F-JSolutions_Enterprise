import type { QuoteItem } from '@/lib/quote'

// Validaciones y correlativos canónicos compartidos con el panel y la API.
export { buildQuoteCode, isEmail, isValidDocument, onlyDigits } from '@fj-solutions/contracts/domain'

// ─── Perfil de la cuenta (se guarda en el navegador) ──────────────────────────

export type ContactPreference = 'email' | 'phone' | 'whatsapp'

export type DocumentType = 'dni' | 'ruc'

export type AccountProfile = {
  name: string
  email: string
  phone: string
  company: string
  documentType: DocumentType
  documentNumber: string
  contactPreference: ContactPreference
  createdAt?: string
  updatedAt?: string
}

// ─── Cotizaciones guardadas en el historial ───────────────────────────────────

export type SavedQuoteStatus = 'enviada' | 'revisada' | 'respondida'

export type SavedQuote = {
  id: string
  code: string
  createdAt: string
  status: SavedQuoteStatus
  items: QuoteItem[]
  itemCount: number
  contactName: string
  contactEmail: string
  contactPhone: string
  companyName?: string
  documentType?: DocumentType
  documentNumber?: string
  contactPreference: ContactPreference
  generalNotes?: string
}

export const EMPTY_PROFILE: AccountProfile = {
  name: '',
  email: '',
  phone: '',
  company: '',
  documentType: 'ruc',
  documentNumber: '',
  contactPreference: 'email',
}

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  dni: 'DNI',
  ruc: 'RUC',
}

export const DOCUMENT_HINTS: Record<DocumentType, string> = {
  dni: '8 dígitos',
  ruc: '11 dígitos',
}

export function documentLabel(type: DocumentType | null | undefined): string {
  return type ? DOCUMENT_LABELS[type] : 'Documento'
}

export function isProfileComplete(profile: AccountProfile | null | undefined): boolean {
  return Boolean(profile?.name?.trim() && profile?.email?.trim())
}

export function formatQuoteDate(value: string): string {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}
