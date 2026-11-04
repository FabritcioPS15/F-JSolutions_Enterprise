import type { admin } from '@fj-solutions/contracts'
import { AppError } from '../middleware/error-handler'
import { prismaDashboardRepository } from '../repositories/prisma-dashboard.repository'
import type {
  DashboardRange,
  DashboardRepository,
  QuoteRecord,
  RequestRecord,
} from '../repositories/dashboard.repository'

const QUOTE_STATUSES: admin.QuoteStatus[] = [
  'draft',
  'new',
  'review',
  'sent',
  'approved',
  'rejected',
  'expired',
]

const REQUEST_STATUSES: admin.RequestStatus[] = ['new', 'review', 'attended', 'discarded']

const REQUEST_CHANNELS: admin.RequestChannel[] = ['web', 'email', 'whatsapp', 'phone']

const CURRENCIES: admin.Currency[] = ['PEN', 'USD']

const OPEN_QUOTE_STATUSES = new Set<admin.QuoteStatus>([
  'draft',
  'new',
  'review',
  'sent',
])

const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'set',
  'oct',
  'nov',
  'dic',
]

type AmountEntry = {
  currency: admin.Currency
  amount: number
}

type DateRangeResult = {
  range: DashboardRange
  output: admin.ReportRange
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

function startOfDayUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function parseDay(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new AppError('La fecha indicada no es válida. Usa el formato AAAA-MM-DD.', 400)
  }
  return date
}

function resolveReportRange(
  fromInput: string | undefined,
  toInput: string | undefined,
  defaultDays: number,
  now: Date
): DateRangeResult {
  const to = toInput ? parseDay(toInput) : startOfDayUTC(now)
  to.setUTCHours(23, 59, 59, 999)

  const from = fromInput
    ? parseDay(fromInput)
    : new Date(
        Date.UTC(
          to.getUTCFullYear(),
          to.getUTCMonth(),
          to.getUTCDate() - (defaultDays - 1)
        )
      )

  if (from.getTime() > to.getTime()) {
    throw new AppError('La fecha inicial no puede ser posterior a la fecha final.', 400)
  }

  const days =
    Math.round(
      (Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()) -
        Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())) /
        86_400_000
    ) + 1

  return {
    range: { from, to },
    output: {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
      days,
    },
  }
}

function emptyQuoteCounts(): admin.QuoteStatusCounts {
  return QUOTE_STATUSES.reduce(
    (counts, status) => ({ ...counts, [status]: 0 }),
    {} as admin.QuoteStatusCounts
  )
}

function emptyRequestCounts(): admin.RequestStatusCounts {
  return REQUEST_STATUSES.reduce(
    (counts, status) => ({ ...counts, [status]: 0 }),
    {} as admin.RequestStatusCounts
  )
}

function emptyChannelCounts(): admin.RequestChannelCounts {
  return REQUEST_CHANNELS.reduce(
    (counts, channel) => ({ ...counts, [channel]: 0 }),
    {} as admin.RequestChannelCounts
  )
}

function quoteCounts(quotes: QuoteRecord[]): admin.QuoteStatusCounts {
  const counts = emptyQuoteCounts()
  for (const quote of quotes) counts[quote.status] += 1
  return counts
}

function requestCounts(requests: RequestRecord[]): admin.RequestStatusCounts {
  const counts = emptyRequestCounts()
  for (const request of requests) counts[request.status] += 1
  return counts
}

function channelCounts(requests: RequestRecord[]): admin.RequestChannelCounts {
  const counts = emptyChannelCounts()
  for (const request of requests) counts[request.channel] += 1
  return counts
}

function currencyAmounts(entries: AmountEntry[]): admin.CurrencyAmount[] {
  return CURRENCIES.map((currency) => {
    const subset = entries.filter((entry) => entry.currency === currency)
    return {
      currency,
      count: subset.length,
      total: round2(subset.reduce((total, entry) => total + entry.amount, 0)),
    }
  })
}

function quoteAmounts(quotes: QuoteRecord[]) {
  return currencyAmounts(
    quotes.map((quote) => ({ currency: quote.currency, amount: quote.total }))
  )
}

function averageTicket(quotes: QuoteRecord[]): admin.CurrencyAmount[] {
  return CURRENCIES.map((currency) => {
    const approved = quotes.filter(
      (quote) => quote.currency === currency && quote.status === 'approved'
    )
    const total = approved.reduce((sum, quote) => sum + quote.total, 0)
    return {
      currency,
      count: approved.length,
      total: approved.length > 0 ? round2(total / approved.length) : 0,
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

function monthKeys(range: DashboardRange): string[] {
  const keys: string[] = []
  const cursor = new Date(Date.UTC(range.from.getUTCFullYear(), range.from.getUTCMonth(), 1))
  const end = new Date(Date.UTC(range.to.getUTCFullYear(), range.to.getUTCMonth(), 1))

  while (cursor.getTime() <= end.getTime() && keys.length < 60) {
    keys.push(cursor.toISOString().slice(0, 7))
    cursor.setUTCMonth(cursor.getUTCMonth() + 1)
  }

  return keys
}

function monthLabel(key: string) {
  const [year, month] = key.split('-').map(Number)
  return `${MONTHS_SHORT[month - 1]} ${year}`
}

function toDashboardQuote(quote: QuoteRecord): admin.DashboardQuote {
  return {
    id: quote.id,
    code: quote.code,
    clientName: quote.clientName,
    clientCompany: quote.clientCompany ?? '',
    status: quote.status,
    currency: quote.currency,
    total: quote.total,
    createdAt: quote.createdAt,
  }
}

function toDashboardRequest(request: RequestRecord): admin.DashboardRequest {
  return {
    id: request.id,
    code: request.code,
    name: request.name,
    topic: request.topic,
    status: request.status,
    channel: request.channel,
    createdAt: request.createdAt,
  }
}

function topClients(quotes: QuoteRecord[]): admin.SalesReportClient[] {
  const groups = new Map<
    string,
    {
      clientId: string | null
      name: string
      company: string
      quotes: number
      approved: number
      entries: AmountEntry[]
    }
  >()

  for (const quote of quotes) {
    const key =
      quote.clientId ?? `${quote.clientName}|${quote.clientCompany ?? ''}`.toLowerCase()
    const group = groups.get(key) ?? {
      clientId: quote.clientId,
      name: quote.clientName || 'Sin nombre',
      company: quote.clientCompany ?? '',
      quotes: 0,
      approved: 0,
      entries: [],
    }
    group.quotes += 1
    if (quote.status === 'approved') group.approved += 1
    group.entries.push({ currency: quote.currency, amount: quote.total })
    groups.set(key, group)
  }

  return [...groups.entries()]
    .map(([key, group]) => ({
      key,
      clientId: group.clientId ?? undefined,
      name: group.name,
      company: group.company,
      quotes: group.quotes,
      approved: group.approved,
      amounts: currencyAmounts(group.entries),
    }))
    .sort(
      (a, b) =>
        b.approved - a.approved ||
        b.quotes - a.quotes ||
        a.name.localeCompare(b.name)
    )
    .slice(0, 8)
}

function topProducts(quotes: QuoteRecord[]): admin.SalesReportProduct[] {
  const groups = new Map<
    string,
    {
      productId: string | null
      name: string
      sku: string | null
      quantity: number
      quoteIds: Set<string>
      entries: AmountEntry[]
    }
  >()

  for (const quote of quotes) {
    for (const item of quote.items) {
      const key = item.productId ?? `${item.name}|${item.sku ?? ''}`.toLowerCase()
      const group = groups.get(key) ?? {
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        quantity: 0,
        quoteIds: new Set<string>(),
        entries: [],
      }
      group.quantity += item.quantity
      group.quoteIds.add(quote.id)
      group.entries.push({ currency: quote.currency, amount: item.subtotal })
      groups.set(key, group)
    }
  }

  return [...groups.entries()]
    .map(([key, group]) => ({
      key,
      productId: group.productId ?? undefined,
      name: group.name,
      sku: group.sku ?? undefined,
      quantity: group.quantity,
      quotes: group.quoteIds.size,
      amounts: currencyAmounts(group.entries),
    }))
    .sort(
      (a, b) =>
        b.quantity - a.quantity ||
        b.quotes - a.quotes ||
        a.name.localeCompare(b.name)
    )
    .slice(0, 8)
}

export class DashboardService {
  constructor(
    private readonly repository: DashboardRepository = prismaDashboardRepository
  ) {}

  async getSummary(now = new Date()): Promise<admin.DashboardSummary> {
    const monthStart = startOfMonthUTC(now)
    const [catalog, clients, quotes, requests] = await Promise.all([
      this.repository.productMetrics(),
      this.repository.clientMetrics(monthStart),
      this.repository.listQuotes(),
      this.repository.listRequests(),
    ])

    const byStatus = quoteCounts(quotes)
    const byRequestStatus = requestCounts(requests)
    const decided = byStatus.approved + byStatus.rejected + byStatus.expired

    return {
      generatedAt: now.toISOString(),
      catalog,
      clients: {
        total: clients.total,
        active: clients.active,
        newThisMonth: clients.newSince,
      },
      quotes: {
        total: quotes.length,
        open: quotes.filter((quote) => OPEN_QUOTE_STATUSES.has(quote.status)).length,
        thisMonth: quotes.filter((quote) => new Date(quote.createdAt) >= monthStart).length,
        decided,
        approved: byStatus.approved,
        conversionRate: percentage(byStatus.approved, decided),
        byStatus,
        amounts: quoteAmounts(quotes),
      },
      requests: {
        total: requests.length,
        open: byRequestStatus.new + byRequestStatus.review,
        thisMonth: requests.filter((request) => new Date(request.createdAt) >= monthStart)
          .length,
        answered: requests.filter((request) => request.repliedAt).length,
        avgFirstResponseHours: averageHours(
          requests.map((request) => ({
            start: request.createdAt,
            end: request.repliedAt,
          }))
        ),
        avgResolutionHours: averageHours(
          requests.map((request) => ({
            start: request.createdAt,
            end: request.resolvedAt,
          }))
        ),
        byStatus: byRequestStatus,
      },
      recentQuotes: quotes.slice(0, 5).map(toDashboardQuote),
      recentRequests: requests.slice(0, 5).map(toDashboardRequest),
    }
  }

  async getSalesReport(
    from?: string,
    to?: string,
    now = new Date()
  ): Promise<admin.SalesReport> {
    const { range, output } = resolveReportRange(from, to, 30, now)
    const quotes = await this.repository.listQuotes(range)
    const byStatus = quoteCounts(quotes)
    const decided = byStatus.approved + byStatus.rejected + byStatus.expired

    return {
      generatedAt: now.toISOString(),
      range: output,
      totals: {
        quotes: quotes.length,
        approved: byStatus.approved,
        rejected: byStatus.rejected,
        expired: byStatus.expired,
        open: quotes.filter((quote) => OPEN_QUOTE_STATUSES.has(quote.status)).length,
        decided,
        conversionRate: percentage(byStatus.approved, decided),
        averageTicket: averageTicket(quotes),
        amounts: quoteAmounts(quotes),
      },
      byStatus,
      monthly: monthKeys(range).map((month) => {
        const monthQuotes = quotes.filter((quote) => quote.createdAt.slice(0, 7) === month)
        return {
          month,
          label: monthLabel(month),
          quotes: monthQuotes.length,
          approved: monthQuotes.filter((quote) => quote.status === 'approved').length,
          amounts: quoteAmounts(monthQuotes),
        }
      }),
      topClients: topClients(quotes),
      topProducts: topProducts(quotes),
    }
  }

  async getHelpdeskReport(
    from?: string,
    to?: string,
    now = new Date()
  ): Promise<admin.HelpdeskReport> {
    const { range, output } = resolveReportRange(from, to, 30, now)
    const requests = await this.repository.listRequests(range)
    const byStatus = requestCounts(requests)

    return {
      generatedAt: now.toISOString(),
      range: output,
      totals: {
        requests: requests.length,
        attended: byStatus.attended,
        pending: byStatus.new + byStatus.review,
        discarded: byStatus.discarded,
        attendedRate: percentage(byStatus.attended, requests.length),
        avgFirstResponseHours: averageHours(
          requests.map((request) => ({
            start: request.createdAt,
            end: request.repliedAt,
          }))
        ),
        avgResolutionHours: averageHours(
          requests.map((request) => ({
            start: request.createdAt,
            end: request.resolvedAt,
          }))
        ),
      },
      byStatus,
      byChannel: channelCounts(requests),
      monthly: monthKeys(range).map((month) => {
        const monthRequests = requests.filter(
          (request) => request.createdAt.slice(0, 7) === month
        )
        return {
          month,
          label: monthLabel(month),
          requests: monthRequests.length,
          attended: monthRequests.filter((request) => request.status === 'attended').length,
        }
      }),
    }
  }
}

export const dashboardService = new DashboardService()
