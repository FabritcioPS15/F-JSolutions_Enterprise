import {
  ClientSegment as PrismaClientSegment,
  ClientStatus as PrismaClientStatus,
  Currency as PrismaCurrency,
  DocumentType as PrismaDocumentType,
  Prisma,
  QuoteStatus as PrismaQuoteStatus,
} from '@prisma/client'
import type { admin } from '@fj-solutions/contracts'
import { prisma } from '../config/database'
import type {
  ClientListFilters,
  ClientListResult,
  ClientWriteInput,
  CommercialRepository,
  QuoteListFilters,
  QuoteListResult,
  QuoteSequence,
  QuoteWriteInput,
} from './commercial.repository'

const quoteInclude = {
  items: { orderBy: { position: 'asc' } },
} satisfies Prisma.QuoteInclude

type PrismaQuoteWithItems = Prisma.QuoteGetPayload<{ include: typeof quoteInclude }>

const statusToAdmin: Record<PrismaQuoteStatus, admin.QuoteStatus> = {
  DRAFT: 'draft',
  NEW: 'new',
  REVIEW: 'review',
  SENT: 'sent',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
}

const statusToPrisma: Record<admin.QuoteStatus, PrismaQuoteStatus> = {
  draft: PrismaQuoteStatus.DRAFT,
  new: PrismaQuoteStatus.NEW,
  review: PrismaQuoteStatus.REVIEW,
  sent: PrismaQuoteStatus.SENT,
  approved: PrismaQuoteStatus.APPROVED,
  rejected: PrismaQuoteStatus.REJECTED,
  expired: PrismaQuoteStatus.EXPIRED,
}

const decidedStatuses = new Set<PrismaQuoteStatus>([
  PrismaQuoteStatus.APPROVED,
  PrismaQuoteStatus.REJECTED,
  PrismaQuoteStatus.EXPIRED,
])

const sentStatuses = new Set<PrismaQuoteStatus>([
  PrismaQuoteStatus.SENT,
  PrismaQuoteStatus.APPROVED,
  PrismaQuoteStatus.REJECTED,
  PrismaQuoteStatus.EXPIRED,
])

function toAdminDocumentType(
  documentType: PrismaDocumentType | null
): 'dni' | 'ruc' | undefined {
  if (documentType === PrismaDocumentType.DNI) return 'dni'
  if (documentType === PrismaDocumentType.RUC) return 'ruc'
  return undefined
}

function toPrismaDocumentType(
  documentType: 'dni' | 'ruc' | null | undefined
): PrismaDocumentType | null {
  if (documentType === 'dni') return PrismaDocumentType.DNI
  if (documentType === 'ruc') return PrismaDocumentType.RUC
  return null
}

function toAdminClient(client: {
  id: string
  name: string
  company: string | null
  documentType: PrismaDocumentType | null
  documentNumber: string | null
  email: string | null
  phone: string | null
  city: string | null
  address: string | null
  segment: PrismaClientSegment
  status: PrismaClientStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}): admin.Client {
  return {
    id: client.id,
    name: client.name,
    company: client.company ?? '',
    documentType: toAdminDocumentType(client.documentType),
    documentNumber: client.documentNumber ?? undefined,
    email: client.email ?? '',
    phone: client.phone ?? '',
    city: client.city ?? '',
    address: client.address ?? '',
    segment: client.segment === PrismaClientSegment.PERSON ? 'persona' : 'empresa',
    status: client.status === PrismaClientStatus.INACTIVE ? 'inactive' : 'active',
    notes: client.notes ?? '',
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  }
}

function clientData(input: ClientWriteInput) {
  const documentType = toPrismaDocumentType(input.documentType)
  return {
    name: input.name,
    company: input.company?.trim() || null,
    documentType,
    documentNumber: documentType ? input.documentNumber?.trim() || null : null,
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
    city: input.city?.trim() || null,
    address: input.address?.trim() || null,
    segment:
      input.segment === 'persona'
        ? PrismaClientSegment.PERSON
        : PrismaClientSegment.COMPANY,
    status:
      input.status === 'inactive'
        ? PrismaClientStatus.INACTIVE
        : PrismaClientStatus.ACTIVE,
    notes: input.notes?.trim() || null,
  }
}

function toAdminQuote(quote: PrismaQuoteWithItems): admin.Quote {
  return {
    id: quote.id,
    code: quote.code,
    clientId: quote.clientId ?? undefined,
    clientName: quote.clientName,
    clientCompany: quote.clientCompany ?? '',
    clientEmail: quote.clientEmail ?? '',
    clientPhone: quote.clientPhone ?? '',
    status: statusToAdmin[quote.status],
    items: quote.items.map((item) => ({
      id: item.id,
      productId: item.productId ?? undefined,
      name: item.name,
      sku: item.sku ?? undefined,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),
    notes: quote.notes ?? '',
    validUntil: quote.validUntil ? quote.validUntil.toISOString().slice(0, 10) : '',
    createdAt: quote.createdAt.toISOString(),
    updatedAt: quote.updatedAt.toISOString(),
  }
}

function quoteScalarData(input: QuoteWriteInput) {
  return {
    clientId: input.clientId ?? null,
    clientName: input.clientName,
    clientCompany: input.clientCompany?.trim() || null,
    clientEmail: input.clientEmail?.trim() || null,
    clientPhone: input.clientPhone?.trim() || null,
    clientDocumentType: toPrismaDocumentType(input.clientDocumentType),
    clientDocumentNumber: input.clientDocumentType
      ? input.clientDocumentNumber?.trim() || null
      : null,
    clientAddress: input.clientAddress?.trim() || null,
    currency:
      input.currency === 'USD' ? PrismaCurrency.USD : PrismaCurrency.PEN,
    subtotal: new Prisma.Decimal(input.amounts.subtotal),
    discountTotal: new Prisma.Decimal(input.amounts.discountTotal),
    taxRate: new Prisma.Decimal(input.amounts.taxRate),
    taxAmount: new Prisma.Decimal(input.amounts.taxAmount),
    total: new Prisma.Decimal(input.amounts.total),
    notes: input.notes?.trim() || null,
    internalNotes: input.internalNotes?.trim() || null,
    validUntil: input.validUntil ?? null,
  }
}

function quoteItemsData(input: QuoteWriteInput) {
  return input.items.map((item, position) => ({
    productId: item.productId ?? null,
    name: item.name,
    sku: item.sku?.trim() || null,
    unitPrice: new Prisma.Decimal(item.unitPrice),
    quantity: item.quantity,
    subtotal: new Prisma.Decimal(item.subtotal),
    position,
  }))
}

function statusTimestamps(
  status: PrismaQuoteStatus,
  current?: { sentAt: Date | null; decidedAt: Date | null }
) {
  const now = new Date()
  return {
    sentAt: current?.sentAt ?? (sentStatuses.has(status) ? now : null),
    decidedAt: current?.decidedAt ?? (decidedStatuses.has(status) ? now : null),
  }
}

export class PrismaCommercialRepository implements CommercialRepository {
  async listClients(filters: ClientListFilters): Promise<ClientListResult> {
    const where: Prisma.ClientWhereInput = {}

    if (filters.status) {
      where.status =
        filters.status === 'inactive'
          ? PrismaClientStatus.INACTIVE
          : PrismaClientStatus.ACTIVE
    }
    if (filters.segment) {
      where.segment =
        filters.segment === 'persona'
          ? PrismaClientSegment.PERSON
          : PrismaClientSegment.COMPANY
    }
    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { company: { contains: filters.q, mode: 'insensitive' } },
        { email: { contains: filters.q, mode: 'insensitive' } },
        { phone: { contains: filters.q, mode: 'insensitive' } },
        { documentNumber: { contains: filters.q, mode: 'insensitive' } },
      ]
    }

    const [total, clients] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
    ])

    return { data: clients.map(toAdminClient), total }
  }

  async findClientById(id: string): Promise<admin.Client | null> {
    const client = await prisma.client.findUnique({ where: { id } })
    return client ? toAdminClient(client) : null
  }

  async findClientByEmail(email: string): Promise<admin.Client | null> {
    const client = await prisma.client.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' } },
      orderBy: { updatedAt: 'desc' },
    })
    return client ? toAdminClient(client) : null
  }

  async findClientByDocument(
    documentType: 'dni' | 'ruc',
    documentNumber: string
  ): Promise<admin.Client | null> {
    const client = await prisma.client.findFirst({
      where: {
        documentType: toPrismaDocumentType(documentType),
        documentNumber: documentNumber.trim(),
      },
    })
    return client ? toAdminClient(client) : null
  }

  async createClient(input: ClientWriteInput): Promise<admin.Client> {
    const client = await prisma.client.create({
      data: {
        ...(input.id ? { id: input.id } : {}),
        ...clientData(input),
      },
    })
    return toAdminClient(client)
  }

  async updateClient(id: string, input: ClientWriteInput): Promise<admin.Client | null> {
    const current = await prisma.client.findUnique({ where: { id }, select: { id: true } })
    if (!current) return null

    const client = await prisma.$transaction(async (tx) => {
      const updated = await tx.client.update({
        where: { id },
        data: clientData(input),
      })

      await tx.quote.updateMany({
        where: { clientId: id },
        data: {
          clientName: updated.name,
          clientCompany: updated.company,
          clientEmail: updated.email,
          clientPhone: updated.phone,
          clientDocumentType: updated.documentType,
          clientDocumentNumber: updated.documentNumber,
          clientAddress: updated.address,
        },
      })

      return updated
    })

    return toAdminClient(client)
  }

  async deleteClient(id: string): Promise<boolean> {
    const current = await prisma.client.findUnique({ where: { id }, select: { id: true } })
    if (!current) return false
    await prisma.client.delete({ where: { id } })
    return true
  }

  async listQuotes(filters: QuoteListFilters): Promise<QuoteListResult> {
    const where: Prisma.QuoteWhereInput = {}

    if (filters.status) where.status = statusToPrisma[filters.status]
    if (filters.clientId) where.clientId = filters.clientId
    if (filters.q) {
      where.OR = [
        { code: { contains: filters.q, mode: 'insensitive' } },
        { clientName: { contains: filters.q, mode: 'insensitive' } },
        { clientCompany: { contains: filters.q, mode: 'insensitive' } },
        { clientEmail: { contains: filters.q, mode: 'insensitive' } },
        { items: { some: { name: { contains: filters.q, mode: 'insensitive' } } } },
      ]
    }

    const [total, quotes] = await Promise.all([
      prisma.quote.count({ where }),
      prisma.quote.findMany({
        where,
        include: quoteInclude,
        orderBy: { updatedAt: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
    ])

    return { data: quotes.map(toAdminQuote), total }
  }

  async findQuoteById(id: string): Promise<admin.Quote | null> {
    const quote = await prisma.quote.findUnique({ where: { id }, include: quoteInclude })
    return quote ? toAdminQuote(quote) : null
  }

  async createQuote(input: QuoteWriteInput): Promise<admin.Quote> {
    const status = statusToPrisma[input.status]
    const timestamps = statusTimestamps(status)
    const now = new Date()

    const quote = await prisma.$transaction(async (tx) => {
      return tx.quote.create({
        data: {
          ...(input.id ? { id: input.id } : {}),
          code: input.code,
          sequenceNumber: input.sequenceNumber ?? null,
          ...quoteScalarData(input),
          status,
          issuedAt: status === PrismaQuoteStatus.DRAFT ? null : now,
          ...timestamps,
          items: { create: quoteItemsData(input) },
          history: {
            create: {
              toStatus: status,
              note: 'Cotización creada',
              changedById: input.actorId ?? null,
            },
          },
        },
        include: quoteInclude,
      })
    })

    return toAdminQuote(quote)
  }

  async updateQuote(id: string, input: QuoteWriteInput): Promise<admin.Quote | null> {
    const current = await prisma.quote.findUnique({
      where: { id },
      select: { id: true, status: true, sentAt: true, decidedAt: true },
    })
    if (!current) return null

    const status = statusToPrisma[input.status]
    const statusChanged = current.status !== status
    const timestamps = statusTimestamps(status, current)

    const quote = await prisma.$transaction(async (tx) => {
      return tx.quote.update({
        where: { id },
        data: {
          ...quoteScalarData(input),
          status,
          ...timestamps,
          items: { deleteMany: {}, create: quoteItemsData(input) },
          ...(statusChanged
            ? {
                history: {
                  create: {
                    fromStatus: current.status,
                    toStatus: status,
                    note: 'Estado actualizado desde el panel',
                    changedById: input.actorId ?? null,
                  },
                },
              }
            : {}),
        },
        include: quoteInclude,
      })
    })

    return toAdminQuote(quote)
  }

  async updateQuoteStatus(
    id: string,
    status: admin.QuoteStatus,
    actorId?: string | null
  ): Promise<admin.Quote | null> {
    const current = await prisma.quote.findUnique({
      where: { id },
      select: { id: true, status: true, sentAt: true, decidedAt: true, issuedAt: true },
    })
    if (!current) return null

    const next = statusToPrisma[status]
    if (current.status === next) {
      const quote = await prisma.quote.findUnique({ where: { id }, include: quoteInclude })
      return quote ? toAdminQuote(quote) : null
    }

    const timestamps = statusTimestamps(next, current)
    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status: next,
        ...timestamps,
        ...(current.issuedAt === null && next !== PrismaQuoteStatus.DRAFT
          ? { issuedAt: new Date() }
          : {}),
        history: {
          create: {
            fromStatus: current.status,
            toStatus: next,
            note: 'Estado actualizado desde el panel',
            changedById: actorId ?? null,
          },
        },
      },
      include: quoteInclude,
    })

    return toAdminQuote(quote)
  }

  async deleteQuote(id: string): Promise<boolean> {
    const current = await prisma.quote.findUnique({ where: { id }, select: { id: true } })
    if (!current) return false
    await prisma.quote.delete({ where: { id } })
    return true
  }

  async nextQuoteSequence(): Promise<QuoteSequence> {
    return prisma.$transaction(
      async (tx) => {
        const existing = await tx.documentSequence.findUnique({ where: { key: 'quote' } })
        const sequence =
          existing ??
          (await tx.documentSequence.create({
            data: { key: 'quote', prefix: 'COT', nextNumber: 1, padding: 5 },
          }))

        const number = sequence.nextNumber
        await tx.documentSequence.update({
          where: { key: 'quote' },
          data: { nextNumber: number + 1 },
        })

        return {
          code: `${sequence.prefix}-${String(number).padStart(sequence.padding, '0')}`,
          sequenceNumber: number,
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )
  }

  async findExistingProductIds(ids: string[]): Promise<Set<string>> {
    if (ids.length === 0) return new Set()
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    })
    return new Set(products.map((product) => product.id))
  }
}

export const prismaCommercialRepository = new PrismaCommercialRepository()
