import {
  ClientStatus as PrismaClientStatus,
  Currency as PrismaCurrency,
  ProductStatus as PrismaProductStatus,
  QuoteStatus as PrismaQuoteStatus,
  RequestChannel as PrismaRequestChannel,
  RequestStatus as PrismaRequestStatus,
} from '@prisma/client'
import type { admin } from '@fj-solutions/contracts'
import { prisma } from '../config/database'
import type {
  ClientMetrics,
  DashboardRange,
  DashboardRepository,
  ProductMetrics,
  QuoteRecord,
  RequestRecord,
} from './dashboard.repository'

const quoteStatusToAdmin: Record<PrismaQuoteStatus, admin.QuoteStatus> = {
  DRAFT: 'draft',
  NEW: 'new',
  REVIEW: 'review',
  SENT: 'sent',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
}

const requestStatusToAdmin: Record<PrismaRequestStatus, admin.RequestStatus> = {
  NEW: 'new',
  REVIEW: 'review',
  ATTENDED: 'attended',
  DISCARDED: 'discarded',
}

const requestChannelToAdmin: Record<PrismaRequestChannel, admin.RequestChannel> = {
  WEB: 'web',
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  PHONE: 'phone',
}

function dateRange(range?: DashboardRange) {
  if (!range) return undefined
  return { gte: range.from, lte: range.to }
}

function toNumber(value: { toString(): string } | number) {
  return Number(value)
}

export class PrismaDashboardRepository implements DashboardRepository {
  async productMetrics(): Promise<ProductMetrics> {
    const [grouped, stockRows] = await Promise.all([
      prisma.product.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.product.findMany({
        where: { status: { not: PrismaProductStatus.ARCHIVED } },
        select: { stock: true, minStock: true },
      }),
    ])

    const counts: Record<PrismaProductStatus, number> = {
      DRAFT: 0,
      PUBLISHED: 0,
      ARCHIVED: 0,
    }
    for (const row of grouped) counts[row.status] = row._count._all

    return {
      total: counts.DRAFT + counts.PUBLISHED + counts.ARCHIVED,
      published: counts.PUBLISHED,
      draft: counts.DRAFT,
      archived: counts.ARCHIVED,
      lowStock: stockRows.filter((row) => row.stock > 0 && row.stock <= row.minStock).length,
      outOfStock: stockRows.filter((row) => row.stock <= 0).length,
      unitsInStock: stockRows.reduce((total, row) => total + Math.max(0, row.stock), 0),
    }
  }

  async clientMetrics(since: Date): Promise<ClientMetrics> {
    const [total, active, newSince] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { status: PrismaClientStatus.ACTIVE } }),
      prisma.client.count({ where: { createdAt: { gte: since } } }),
    ])
    return { total, active, newSince }
  }

  async listQuotes(range?: DashboardRange): Promise<QuoteRecord[]> {
    const createdAt = dateRange(range)
    const quotes = await prisma.quote.findMany({
      where: createdAt ? { createdAt } : undefined,
      select: {
        id: true,
        code: true,
        clientId: true,
        clientName: true,
        clientCompany: true,
        status: true,
        currency: true,
        total: true,
        createdAt: true,
        decidedAt: true,
        items: {
          select: {
            productId: true,
            name: true,
            sku: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return quotes.map((quote) => ({
      id: quote.id,
      code: quote.code,
      clientId: quote.clientId,
      clientName: quote.clientName,
      clientCompany: quote.clientCompany,
      status: quoteStatusToAdmin[quote.status],
      currency: quote.currency === PrismaCurrency.USD ? 'USD' : 'PEN',
      total: toNumber(quote.total),
      createdAt: quote.createdAt.toISOString(),
      decidedAt: quote.decidedAt ? quote.decidedAt.toISOString() : null,
      items: quote.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        subtotal: toNumber(item.subtotal),
      })),
    }))
  }

  async listRequests(range?: DashboardRange): Promise<RequestRecord[]> {
    const createdAt = dateRange(range)
    const requests = await prisma.serviceRequest.findMany({
      where: createdAt ? { createdAt } : undefined,
      select: {
        id: true,
        code: true,
        name: true,
        topic: true,
        status: true,
        channel: true,
        createdAt: true,
        repliedAt: true,
        resolvedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return requests.map((request) => ({
      id: request.id,
      code: request.code,
      name: request.name,
      topic: request.topic,
      status: requestStatusToAdmin[request.status],
      channel: requestChannelToAdmin[request.channel],
      createdAt: request.createdAt.toISOString(),
      repliedAt: request.repliedAt ? request.repliedAt.toISOString() : null,
      resolvedAt: request.resolvedAt ? request.resolvedAt.toISOString() : null,
    }))
  }
}

export const prismaDashboardRepository = new PrismaDashboardRepository()
