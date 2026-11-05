import type { admin } from '@fj-solutions/contracts'
import {
  isValidDocument,
  lineTotal,
  onlyDigits,
  quoteTotals,
} from '@fj-solutions/contracts/domain'
import { AppError } from '../middleware/error-handler'
import { prismaCommercialRepository } from '../repositories/prisma-commercial.repository'
import type {
  ClientListFilters,
  ClientWriteInput,
  CommercialRepository,
  QuoteListFilters,
  QuoteLineInput,
  QuoteWriteInput,
} from '../repositories/commercial.repository'

export type ClientPayload = {
  id?: string
  name?: string
  company?: string
  documentType?: 'dni' | 'ruc' | null
  documentNumber?: string | null
  email?: string | null
  phone?: string | null
  city?: string | null
  address?: string | null
  segment?: admin.ClientSegment
  status?: admin.ClientStatus
  notes?: string | null
}

export type QuoteItemPayload = {
  id?: string
  productId?: string | null
  name: string
  sku?: string | null
  quantity: number
  unitPrice: number
}

export type QuotePayload = {
  id?: string
  clientId?: string | null
  clientName?: string
  clientCompany?: string | null
  clientEmail?: string | null
  clientPhone?: string | null
  clientDocumentType?: 'dni' | 'ruc' | null
  clientDocumentNumber?: string | null
  clientAddress?: string | null
  status?: admin.QuoteStatus
  currency?: admin.Currency
  taxRate?: number
  items?: QuoteItemPayload[]
  notes?: string | null
  validUntil?: string | null
}

export type PublicQuoteItemPayload = {
  productId?: string
  name: string
  sku?: string
  quantity: number
}

export type PublicQuotePayload = {
  contactName: string
  contactEmail: string
  contactPhone: string
  companyName?: string
  documentType?: 'dni' | 'ruc'
  documentNumber?: string
  contactPreference?: 'email' | 'phone' | 'whatsapp'
  generalNotes?: string
  items: PublicQuoteItemPayload[]
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const CONTACT_PREFERENCES: Record<string, string> = {
  email: 'correo electrónico',
  phone: 'llamada telefónica',
  whatsapp: 'WhatsApp',
}

function round2(value: number) {
  return Math.round(value * 100) / 100
}

function text(value: string | null | undefined) {
  return value?.trim() ?? ''
}

function normalizeDocument(
  documentType: 'dni' | 'ruc' | null | undefined,
  documentNumber: string | null | undefined
): { documentType: 'dni' | 'ruc' | null; documentNumber: string | null } {
  const type = documentType === 'dni' || documentType === 'ruc' ? documentType : null
  const number = documentNumber?.trim() || null
  if ((type && !number) || (!type && number)) {
    throw new AppError('Indica el tipo y el número de documento, o deja ambos vacíos.', 400)
  }
  if (type && number) {
    const digits = onlyDigits(number)
    if (!isValidDocument(type, digits)) {
      throw new AppError(
        type === 'ruc'
          ? 'El RUC debe tener 11 dígitos.'
          : 'El DNI debe tener 8 dígitos.',
        400
      )
    }
    return { documentType: type, documentNumber: digits }
  }
  return { documentType: null, documentNumber: null }
}

export function parseQuoteDate(value: string | null | undefined): Date | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T00:00:00.000Z` : trimmed
  )
  if (Number.isNaN(date.getTime())) {
    throw new AppError('La fecha de vigencia no es válida.', 400)
  }
  return date
}

function sanitizeItems(items: QuoteItemPayload[] | undefined): QuoteLineInput[] {
  return (items ?? []).map((item) => {
    const name = item.name.trim()
    if (!name) throw new AppError('Cada línea necesita un nombre de producto.', 400)
    const quantity = Math.max(1, Math.trunc(Number(item.quantity) || 1))
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0)
    return {
      productId: item.productId?.trim() || null,
      name,
      sku: item.sku?.trim() || null,
      quantity,
      unitPrice,
      subtotal: round2(lineTotal({ quantity, unitPrice })),
    }
  })
}

// El importe guardado lleva IGV incluido, igual que el cálculo del panel:
// quoteTotals despeja la base imponible y el impuesto a partir del total.
export function computeQuoteAmounts(items: Array<{ subtotal: number }>, taxRate = 18) {
  const rate = Math.min(100, Math.max(0, Number(taxRate) || 0))
  const { total, net, tax } = quoteTotals(
    items.map((item) => ({ quantity: 1, unitPrice: item.subtotal })),
    rate
  )
  return {
    subtotal: net,
    discountTotal: 0,
    taxRate: rate,
    taxAmount: tax,
    total,
  }
}

function requiresItems(status: admin.QuoteStatus) {
  return status !== 'draft' && status !== 'new'
}

function clientSnapshot(
  payload: QuotePayload,
  fallback?: {
    clientName: string
    clientCompany: string
    clientEmail: string
    clientPhone: string
  }
) {
  return {
    clientName: text(payload.clientName) || fallback?.clientName || '',
    clientCompany:
      payload.clientCompany !== undefined
        ? text(payload.clientCompany)
        : fallback?.clientCompany ?? '',
    clientEmail:
      payload.clientEmail !== undefined ? text(payload.clientEmail) : fallback?.clientEmail ?? '',
    clientPhone:
      payload.clientPhone !== undefined ? text(payload.clientPhone) : fallback?.clientPhone ?? '',
    clientDocumentType: payload.clientDocumentType ?? null,
    clientDocumentNumber: payload.clientDocumentNumber?.trim() || null,
    clientAddress: payload.clientAddress?.trim() || null,
  }
}

export class CommercialService {
  constructor(
    private readonly repository: CommercialRepository = prismaCommercialRepository
  ) {}

  async listClients(filters: ClientListFilters) {
    return this.repository.listClients(filters)
  }

  async getClient(id: string) {
    const client = await this.repository.findClientById(id)
    if (!client) throw new AppError('Cliente no encontrado.', 404)
    return client
  }

  async createClient(payload: ClientPayload): Promise<admin.Client> {
    const name = text(payload.name)
    if (name.length < 2) throw new AppError('El nombre del cliente es obligatorio.', 400)

    const document = normalizeDocument(payload.documentType, payload.documentNumber)
    if (document.documentType && document.documentNumber) {
      const existing = await this.repository.findClientByDocument(
        document.documentType,
        document.documentNumber
      )
      if (existing && existing.id !== payload.id) {
        throw new AppError('Ya existe un cliente con ese documento.', 409)
      }
    }

    return this.repository.createClient({
      id: payload.id,
      name,
      company: text(payload.company),
      documentType: document.documentType,
      documentNumber: document.documentNumber,
      email: text(payload.email),
      phone: text(payload.phone),
      city: text(payload.city),
      address: text(payload.address),
      segment: payload.segment === 'persona' ? 'persona' : 'empresa',
      status: payload.status === 'inactive' ? 'inactive' : 'active',
      notes: text(payload.notes),
    })
  }

  async updateClient(id: string, payload: ClientPayload): Promise<admin.Client> {
    const current = await this.repository.findClientById(id)
    if (!current) throw new AppError('Cliente no encontrado.', 404)

    const document = normalizeDocument(
      payload.documentType !== undefined ? payload.documentType : current.documentType,
      payload.documentNumber !== undefined ? payload.documentNumber : current.documentNumber
    )
    if (document.documentType && document.documentNumber) {
      const existing = await this.repository.findClientByDocument(
        document.documentType,
        document.documentNumber
      )
      if (existing && existing.id !== id) {
        throw new AppError('Ya existe un cliente con ese documento.', 409)
      }
    }

    const input: ClientWriteInput = {
      name:
        payload.name !== undefined && text(payload.name).length > 0
          ? text(payload.name)
          : current.name,
      company: payload.company !== undefined ? text(payload.company) : current.company,
      documentType: document.documentType,
      documentNumber: document.documentNumber,
      email: payload.email !== undefined ? text(payload.email) : current.email,
      phone: payload.phone !== undefined ? text(payload.phone) : current.phone,
      city: payload.city !== undefined ? text(payload.city) : current.city,
      address: payload.address !== undefined ? text(payload.address) : current.address,
      segment: payload.segment ?? current.segment,
      status: payload.status ?? current.status,
      notes: payload.notes !== undefined ? text(payload.notes) : current.notes,
    }

    const updated = await this.repository.updateClient(id, input)
    if (!updated) throw new AppError('Cliente no encontrado.', 404)
    return updated
  }

  async deleteClient(id: string) {
    const deleted = await this.repository.deleteClient(id)
    if (!deleted) throw new AppError('Cliente no encontrado.', 404)
  }

  async listQuotes(filters: QuoteListFilters) {
    return this.repository.listQuotes(filters)
  }

  async getQuote(id: string) {
    const quote = await this.repository.findQuoteById(id)
    if (!quote) throw new AppError('Cotización no encontrada.', 404)
    return quote
  }

  async createQuote(payload: QuotePayload, actorId?: string | null): Promise<admin.Quote> {
    const status = payload.status ?? 'draft'
    const client = await this.resolveClient(payload.clientId)
    const snapshot = clientSnapshot(
      payload,
      client
        ? {
            clientName: client.name,
            clientCompany: client.company,
            clientEmail: client.email,
            clientPhone: client.phone,
          }
        : undefined
    )
    if (snapshot.clientName.length < 2) {
      throw new AppError('Indica el nombre del contacto de la cotización.', 400)
    }

    const items = sanitizeItems(payload.items)
    if (requiresItems(status) && items.length === 0) {
      throw new AppError('Agrega al menos un producto antes de enviar la cotización.', 400)
    }

    const { code, sequenceNumber } = await this.repository.nextQuoteSequence()
    const input: QuoteWriteInput = {
      id: payload.id,
      code,
      sequenceNumber,
      clientId: client?.id ?? null,
      ...snapshot,
      clientDocumentType: snapshot.clientDocumentType ?? client?.documentType ?? null,
      clientDocumentNumber: snapshot.clientDocumentNumber ?? client?.documentNumber ?? null,
      clientAddress: snapshot.clientAddress ?? client?.address ?? null,
      status,
      currency: payload.currency ?? 'PEN',
      amounts: computeQuoteAmounts(items, payload.taxRate),
      items,
      notes: text(payload.notes),
      validUntil: parseQuoteDate(payload.validUntil),
      actorId: actorId ?? null,
    }

    return this.repository.createQuote(input)
  }

  async updateQuote(
    id: string,
    payload: QuotePayload,
    actorId?: string | null
  ): Promise<admin.Quote> {
    const current = await this.repository.findQuoteById(id)
    if (!current) throw new AppError('Cotización no encontrada.', 404)

    const client =
      payload.clientId !== undefined
        ? await this.resolveClient(payload.clientId)
        : current.clientId
          ? await this.repository.findClientById(current.clientId)
          : null

    const status = payload.status ?? current.status
    const items = payload.items
      ? sanitizeItems(payload.items)
      : sanitizeItems(
          current.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          }))
        )
    if (requiresItems(status) && items.length === 0) {
      throw new AppError('Agrega al menos un producto antes de enviar la cotización.', 400)
    }

    const snapshot = clientSnapshot(
      payload,
      client
        ? {
            clientName: client.name,
            clientCompany: client.company,
            clientEmail: client.email,
            clientPhone: client.phone,
          }
        : current
    )
    const input: QuoteWriteInput = {
      code: current.code,
      clientId: client?.id ?? null,
      ...snapshot,
      clientDocumentType: snapshot.clientDocumentType ?? client?.documentType ?? null,
      clientDocumentNumber: snapshot.clientDocumentNumber ?? client?.documentNumber ?? null,
      clientAddress: snapshot.clientAddress ?? client?.address ?? null,
      status,
      currency: payload.currency ?? 'PEN',
      amounts: computeQuoteAmounts(items, payload.taxRate),
      items,
      notes: payload.notes !== undefined ? text(payload.notes) : current.notes,
      validUntil:
        payload.validUntil !== undefined
          ? parseQuoteDate(payload.validUntil)
          : parseQuoteDate(current.validUntil),
      actorId: actorId ?? null,
    }

    const updated = await this.repository.updateQuote(id, input)
    if (!updated) throw new AppError('Cotización no encontrada.', 404)
    return updated
  }

  async updateQuoteStatus(
    id: string,
    status: admin.QuoteStatus,
    actorId?: string | null
  ): Promise<admin.Quote> {
    const updated = await this.repository.updateQuoteStatus(id, status, actorId)
    if (!updated) throw new AppError('Cotización no encontrada.', 404)
    return updated
  }

  async deleteQuote(id: string) {
    const deleted = await this.repository.deleteQuote(id)
    if (!deleted) throw new AppError('Cotización no encontrada.', 404)
  }

  async createPublicQuote(payload: PublicQuotePayload): Promise<admin.Quote> {
    const document = normalizeDocument(payload.documentType, payload.documentNumber)
    const email = payload.contactEmail.trim().toLowerCase()

    let client =
      document.documentType && document.documentNumber
        ? await this.repository.findClientByDocument(
            document.documentType,
            document.documentNumber
          )
        : null
    client ??= email ? await this.repository.findClientByEmail(email) : null

    if (!client) {
      client = await this.repository.createClient({
        name: payload.contactName.trim(),
        company: text(payload.companyName),
        documentType: document.documentType,
        documentNumber: document.documentNumber,
        email,
        phone: payload.contactPhone.trim(),
        city: '',
        address: '',
        segment: text(payload.companyName) ? 'empresa' : 'persona',
        status: 'active',
        notes: 'Cliente registrado desde una solicitud web de cotización.',
      })
    }

    const requestedIds = Array.from(
      new Set(
        payload.items
          .map((item) => item.productId?.trim() ?? '')
          .filter((id) => UUID_PATTERN.test(id))
      )
    )
    const existingProductIds = await this.repository.findExistingProductIds(requestedIds)

    const items = sanitizeItems(
      payload.items.map((item) => ({
        productId: item.productId && existingProductIds.has(item.productId) ? item.productId : null,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: 0,
      }))
    )

    const preference = payload.contactPreference
      ? CONTACT_PREFERENCES[payload.contactPreference] ?? payload.contactPreference
      : null
    const { code, sequenceNumber } = await this.repository.nextQuoteSequence()

    return this.repository.createQuote({
      code,
      sequenceNumber,
      clientId: client.id,
      clientName: payload.contactName.trim(),
      clientCompany: payload.companyName?.trim() || null,
      clientEmail: email,
      clientPhone: payload.contactPhone.trim(),
      clientDocumentType: document.documentType,
      clientDocumentNumber: document.documentNumber,
      clientAddress: client.address || null,
      status: 'new',
      currency: 'PEN',
      amounts: computeQuoteAmounts(items, 18),
      items,
      notes: payload.generalNotes?.trim() || null,
      internalNotes: preference
        ? `Solicitud web. Preferencia de contacto: ${preference}.`
        : 'Solicitud web.',
      validUntil: null,
      actorId: null,
    })
  }

  private async resolveClient(clientId: string | null | undefined) {
    const id = clientId?.trim()
    if (!id) return null
    const client = await this.repository.findClientById(id)
    if (!client) throw new AppError('El cliente seleccionado no existe.', 400)
    return client
  }
}

export const commercialService = new CommercialService()
