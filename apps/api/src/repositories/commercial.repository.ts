import type { admin } from '@fj-solutions/contracts'

export type ClientWriteInput = {
  id?: string
  name: string
  company?: string
  documentType?: 'dni' | 'ruc' | null
  documentNumber?: string | null
  email?: string | null
  phone?: string | null
  city?: string | null
  address?: string | null
  segment: admin.ClientSegment
  status: admin.ClientStatus
  notes?: string | null
}

export type ClientListFilters = {
  page: number
  limit: number
  q?: string
  status?: admin.ClientStatus
  segment?: admin.ClientSegment
}

export type ClientListResult = {
  data: admin.Client[]
  total: number
}

export type QuoteLineInput = {
  productId?: string | null
  name: string
  sku?: string | null
  quantity: number
  unitPrice: number
  subtotal: number
}

export type QuoteAmounts = {
  subtotal: number
  discountTotal: number
  taxRate: number
  taxAmount: number
  total: number
}

export type QuoteWriteInput = {
  id?: string
  code: string
  sequenceNumber?: number
  clientId?: string | null
  clientName: string
  clientCompany?: string | null
  clientEmail?: string | null
  clientPhone?: string | null
  clientDocumentType?: 'dni' | 'ruc' | null
  clientDocumentNumber?: string | null
  clientAddress?: string | null
  status: admin.QuoteStatus
  currency: admin.Currency
  amounts: QuoteAmounts
  items: QuoteLineInput[]
  notes?: string | null
  internalNotes?: string | null
  validUntil?: Date | null
  actorId?: string | null
}

export type QuoteListFilters = {
  page: number
  limit: number
  q?: string
  status?: admin.QuoteStatus
  clientId?: string
}

export type QuoteListResult = {
  data: admin.Quote[]
  total: number
}

export type QuoteSequence = {
  code: string
  sequenceNumber: number
}

export interface CommercialRepository {
  listClients(filters: ClientListFilters): Promise<ClientListResult>
  findClientById(id: string): Promise<admin.Client | null>
  findClientByEmail(email: string): Promise<admin.Client | null>
  findClientByDocument(
    documentType: 'dni' | 'ruc',
    documentNumber: string
  ): Promise<admin.Client | null>
  createClient(input: ClientWriteInput): Promise<admin.Client>
  updateClient(id: string, input: ClientWriteInput): Promise<admin.Client | null>
  deleteClient(id: string): Promise<boolean>

  listQuotes(filters: QuoteListFilters): Promise<QuoteListResult>
  findQuoteById(id: string): Promise<admin.Quote | null>
  createQuote(input: QuoteWriteInput): Promise<admin.Quote>
  updateQuote(id: string, input: QuoteWriteInput): Promise<admin.Quote | null>
  updateQuoteStatus(
    id: string,
    status: admin.QuoteStatus,
    actorId?: string | null
  ): Promise<admin.Quote | null>
  deleteQuote(id: string): Promise<boolean>
  nextQuoteSequence(): Promise<QuoteSequence>
  findExistingProductIds(ids: string[]): Promise<Set<string>>
}
