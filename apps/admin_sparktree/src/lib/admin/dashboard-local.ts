import type {
  AdminData,
  Currency,
  CurrencyAmount,
  DashboardQuote,
  DashboardRequest,
  DashboardSummary,
  QuoteStatus,
  QuoteStatusCounts,
  RequestStatus,
  RequestStatusCounts,
} from '@fj-solutions/contracts/admin'
import { quoteTotals } from './format'

const QUOTE_STATUSES: QuoteStatus[] = [
  'draft',
  'new',
  'review',
  'sent',
  'approved',
  'rejected',
  'expired',
]

const REQUEST_STATUSES: RequestStatus[] = ['new', 'review', 'attended', 'discarded']

const CURRENCIES: Currency[] = ['PEN', 'USD']

const OPEN_QUOTE_STATUSES = new Set<QuoteStatus>(['draft', 'new', 'review', 'sent'])

type LocalSummarySource = Pick<
  AdminData,
  'products' | 'clients' | 'quotes' | 'requests' | 'settings'
>

type AmountEntry = {
  currency: Currency
  amount: number
}

function round2(value: number) {
  return Math.round(value * 100) / 100
}

function percentage(part: number, total: number) {
  return total > 0 ? round2((part / total) * 100) : 0
}

function startOfMonthUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function byCreatedAtDesc(a: { createdAt: string }, b: { createdAt: string }) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

function quoteCounts(statuses: QuoteStatus[]): QuoteStatusCounts {
  return statuses.reduce(
    (counts, status) => ({ ...counts, [status]: 0 }),
    {} as QuoteStatusCounts
  )
}

function requestCounts(statuses: RequestStatus[]): RequestStatusCounts {
  return statuses.reduce(
    (counts, status) => ({ ...counts, [status]: 0 }),
    {} as RequestStatusCounts
  )
}

function currencyAmounts(entries: AmountEntry[]): CurrencyAmount[] {
  return CURRENCIES.map((currency) => {
    const subset = entries.filter((entry) => entry.currency === currency)
    return {
      currency,
      count: subset.length,
      total: round2(subset.reduce((total, entry) => total + entry.amount, 0)),
    }
  })
}

function averageHours(
  records: Array<{ start: string; end: string | null }>
): number | null {
  const durations = records.flatMap(({ start, end }) => {
    if (!end) return []
    const hours = (new Date(end).getTime() - new Date(start).getTime()) / 3_600_000
    return hours >= 0 ? [hours] : []
  })
  if (durations.length === 0) return null
  return round2(durations.reduce((total, hours) => total + hours, 0) / durations.length)
}

// Equivalente local de DashboardService.getSummary (apps/api). Las reglas de
// conteo son las mismas para que el panel no cambie de números al conectar la
// base de datos. El respaldo local no guarda `resolvedAt`, así que la resolución
// promedio se reporta como no disponible.
export function buildLocalDashboardSummary(
  source: LocalSummarySource,
  now = new Date()
): DashboardSummary {
  const { products, clients, quotes, requests, settings } = source
  const monthStart = startOfMonthUTC(now)
  const currency = settings.currency

  const inStock = products.filter((product) => product.status !== 'archived')
  const quoteAmounts = quotes.map((quote) => ({
    currency,
    amount: quoteTotals(quote.items, settings.igv).total,
  }))

  const byStatus = quoteCounts(QUOTE_STATUSES)
  for (const quote of quotes) byStatus[quote.status] += 1

  const byRequestStatus = requestCounts(REQUEST_STATUSES)
  for (const request of requests) byRequestStatus[request.status] += 1

  const decided = byStatus.approved + byStatus.rejected + byStatus.expired
  const orderedQuotes = [...quotes].sort(byCreatedAtDesc)
  const orderedRequests = [...requests].sort(byCreatedAtDesc)

  return {
    generatedAt: now.toISOString(),
    catalog: {
      total: products.length,
      published: products.filter((product) => product.status === 'active').length,
      draft: products.filter((product) => product.status === 'draft').length,
      archived: products.filter((product) => product.status === 'archived').length,
      lowStock: inStock.filter((product) => product.stock > 0 && product.stock <= product.minStock)
        .length,
      outOfStock: inStock.filter((product) => product.stock <= 0).length,
      unitsInStock: inStock.reduce((total, product) => total + Math.max(0, product.stock), 0),
    },
    clients: {
      total: clients.length,
      active: clients.filter((client) => client.status === 'active').length,
      newThisMonth: clients.filter((client) => new Date(client.createdAt) >= monthStart).length,
    },
    quotes: {
      total: quotes.length,
      open: quotes.filter((quote) => OPEN_QUOTE_STATUSES.has(quote.status)).length,
      thisMonth: quotes.filter((quote) => new Date(quote.createdAt) >= monthStart).length,
      decided,
      approved: byStatus.approved,
      conversionRate: percentage(byStatus.approved, decided),
      byStatus,
      amounts: currencyAmounts(quoteAmounts),
    },
    requests: {
      total: requests.length,
      open: byRequestStatus.new + byRequestStatus.review,
      thisMonth: requests.filter((request) => new Date(request.createdAt) >= monthStart).length,
      answered: requests.filter((request) => request.repliedAt).length,
      avgFirstResponseHours: averageHours(
        requests.map((request) => ({ start: request.createdAt, end: request.repliedAt ?? null }))
      ),
      avgResolutionHours: null,
      byStatus: byRequestStatus,
    },
    recentQuotes: orderedQuotes.slice(0, 5).map((quote): DashboardQuote => {
      return {
        id: quote.id,
        code: quote.code,
        clientName: quote.clientName,
        clientCompany: quote.clientCompany ?? '',
        status: quote.status,
        currency,
        total: quoteTotals(quote.items, settings.igv).total,
        createdAt: quote.createdAt,
      }
    }),
    recentRequests: orderedRequests.slice(0, 5).map(
      (request): DashboardRequest => ({
        id: request.id,
        code: request.code,
        name: request.name,
        topic: request.topic,
        status: request.status,
        channel: request.channel,
        createdAt: request.createdAt,
      })
    ),
  }
}
