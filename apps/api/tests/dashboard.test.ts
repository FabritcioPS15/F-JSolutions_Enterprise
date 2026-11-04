import type {
  ClientMetrics,
  DashboardRange,
  DashboardRepository,
  ProductMetrics,
  QuoteRecord,
  RequestRecord,
} from '../src/repositories/dashboard.repository'
import { DashboardService } from '../src/services/dashboard.service'

const NOW = new Date('2026-11-04T12:00:00.000Z')

const PRODUCT_METRICS: ProductMetrics = {
  total: 10,
  published: 6,
  draft: 3,
  archived: 1,
  lowStock: 2,
  outOfStock: 1,
  unitsInStock: 42,
}

const CLIENT_METRICS: ClientMetrics = {
  total: 8,
  active: 7,
  newSince: 2,
}

function quote(overrides: Partial<QuoteRecord> & Pick<QuoteRecord, 'id' | 'createdAt'>): QuoteRecord {
  return {
    id: overrides.id,
    code: `COT-${overrides.id}`,
    clientId: null,
    clientName: 'Cliente',
    clientCompany: null,
    status: 'draft',
    currency: 'PEN',
    total: 0,
    createdAt: overrides.createdAt,
    decidedAt: null,
    items: [],
    ...overrides,
  }
}

function request(
  overrides: Partial<RequestRecord> & Pick<RequestRecord, 'id' | 'createdAt'>
): RequestRecord {
  return {
    id: overrides.id,
    code: `SOL-${overrides.id}`,
    name: 'Contacto',
    topic: 'Consulta',
    status: 'new',
    channel: 'web',
    createdAt: overrides.createdAt,
    repliedAt: null,
    resolvedAt: null,
    ...overrides,
  }
}

class FakeDashboardRepository implements DashboardRepository {
  quotes: QuoteRecord[] = []
  requests: RequestRecord[] = []
  clientSince: Date | null = null
  quoteRange: DashboardRange | undefined
  requestRange: DashboardRange | undefined

  async productMetrics() {
    return PRODUCT_METRICS
  }

  async clientMetrics(since: Date) {
    this.clientSince = since
    return CLIENT_METRICS
  }

  async listQuotes(range?: DashboardRange) {
    this.quoteRange = range
    return this.quotes
      .filter(
        (item) =>
          !range ||
          (new Date(item.createdAt) >= range.from && new Date(item.createdAt) <= range.to)
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async listRequests(range?: DashboardRange) {
    this.requestRange = range
    return this.requests
      .filter(
        (item) =>
          !range ||
          (new Date(item.createdAt) >= range.from && new Date(item.createdAt) <= range.to)
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

function seededRepository() {
  const repository = new FakeDashboardRepository()
  repository.quotes = [
    quote({
      id: 'q1',
      clientId: 'c1',
      clientName: 'Acme',
      clientCompany: 'Acme SAC',
      status: 'approved',
      currency: 'PEN',
      total: 1180,
      createdAt: '2026-10-15T10:00:00.000Z',
      decidedAt: '2026-10-16T10:00:00.000Z',
      items: [
        { productId: 'p1', name: 'Laptop', sku: 'LP-1', quantity: 2, subtotal: 1180 },
      ],
    }),
    quote({
      id: 'q2',
      clientId: 'c2',
      clientName: 'Beta',
      clientCompany: 'Beta SAC',
      status: 'approved',
      currency: 'USD',
      total: 500,
      createdAt: '2026-11-02T10:00:00.000Z',
      decidedAt: '2026-11-02T12:00:00.000Z',
      items: [
        { productId: 'p1', name: 'Laptop', sku: 'LP-1', quantity: 1, subtotal: 500 },
      ],
    }),
    quote({
      id: 'q3',
      clientName: 'Carlos',
      status: 'rejected',
      currency: 'PEN',
      total: 200,
      createdAt: '2026-11-03T10:00:00.000Z',
      decidedAt: '2026-11-03T15:00:00.000Z',
      items: [
        { productId: 'p2', name: 'Mouse', sku: 'MS-1', quantity: 4, subtotal: 200 },
      ],
    }),
    quote({
      id: 'q4',
      clientId: 'c1',
      clientName: 'Acme',
      clientCompany: 'Acme SAC',
      status: 'sent',
      currency: 'PEN',
      total: 300,
      createdAt: '2026-11-04T10:00:00.000Z',
      items: [
        { productId: 'p2', name: 'Mouse', sku: 'MS-1', quantity: 1, subtotal: 300 },
      ],
    }),
    quote({
      id: 'q5',
      clientName: 'Ana',
      status: 'draft',
      currency: 'PEN',
      total: 0,
      createdAt: '2026-11-01T10:00:00.000Z',
    }),
  ]

  repository.requests = [
    request({
      id: 'r1',
      createdAt: '2026-11-01T09:00:00.000Z',
      status: 'new',
      channel: 'web',
    }),
    request({
      id: 'r2',
      createdAt: '2026-11-02T09:00:00.000Z',
      status: 'review',
      channel: 'email',
      repliedAt: '2026-11-02T11:00:00.000Z',
    }),
    request({
      id: 'r3',
      createdAt: '2026-11-03T09:00:00.000Z',
      status: 'attended',
      channel: 'whatsapp',
      repliedAt: '2026-11-03T10:00:00.000Z',
      resolvedAt: '2026-11-03T14:00:00.000Z',
    }),
    request({
      id: 'r4',
      createdAt: '2026-10-01T09:00:00.000Z',
      status: 'discarded',
      channel: 'phone',
    }),
  ]

  return repository
}

describe('DashboardService — resumen', () => {
  it('calcula métricas de catálogo, clientes, cotizaciones y solicitudes', async () => {
    const repository = seededRepository()
    const service = new DashboardService(repository)
    const summary = await service.getSummary(NOW)

    expect(repository.clientSince?.toISOString()).toBe('2026-11-01T00:00:00.000Z')

    expect(summary.catalog).toEqual(PRODUCT_METRICS)
    expect(summary.clients).toEqual({ total: 8, active: 7, newThisMonth: 2 })

    expect(summary.quotes.total).toBe(5)
    expect(summary.quotes.open).toBe(2)
    expect(summary.quotes.thisMonth).toBe(4)
    expect(summary.quotes.decided).toBe(3)
    expect(summary.quotes.approved).toBe(2)
    expect(summary.quotes.conversionRate).toBe(66.67)
    expect(summary.quotes.byStatus).toEqual({
      draft: 1,
      new: 0,
      review: 0,
      sent: 1,
      approved: 2,
      rejected: 1,
      expired: 0,
    })
    expect(summary.quotes.amounts).toEqual([
      { currency: 'PEN', count: 4, total: 1680 },
      { currency: 'USD', count: 1, total: 500 },
    ])

    expect(summary.requests.total).toBe(4)
    expect(summary.requests.open).toBe(2)
    expect(summary.requests.thisMonth).toBe(3)
    expect(summary.requests.answered).toBe(2)
    expect(summary.requests.avgFirstResponseHours).toBe(1.5)
    expect(summary.requests.avgResolutionHours).toBe(5)
    expect(summary.requests.byStatus).toEqual({
      new: 1,
      review: 1,
      attended: 1,
      discarded: 1,
    })

    expect(summary.recentQuotes.map((item) => item.id)).toEqual([
      'q4',
      'q3',
      'q2',
      'q5',
      'q1',
    ])
    expect(summary.recentRequests.map((item) => item.id)).toEqual([
      'r3',
      'r2',
      'r1',
      'r4',
    ])
  })

  it('devuelve ceros cuando no hay datos', async () => {
    const service = new DashboardService(new FakeDashboardRepository())
    const summary = await service.getSummary(NOW)

    expect(summary.quotes.total).toBe(0)
    expect(summary.quotes.conversionRate).toBe(0)
    expect(summary.requests.avgFirstResponseHours).toBeNull()
    expect(summary.recentQuotes).toEqual([])
  })
})

describe('DashboardService — reporte de ventas', () => {
  it('agrega totales, meses, clientes y productos del rango', async () => {
    const repository = seededRepository()
    const service = new DashboardService(repository)
    const report = await service.getSalesReport('2026-10-01', '2026-11-30', NOW)

    expect(repository.quoteRange?.from.toISOString()).toBe('2026-10-01T00:00:00.000Z')
    expect(repository.quoteRange?.to.toISOString()).toBe('2026-11-30T23:59:59.999Z')

    expect(report.range).toEqual({ from: '2026-10-01', to: '2026-11-30', days: 61 })
    expect(report.totals.quotes).toBe(5)
    expect(report.totals.approved).toBe(2)
    expect(report.totals.rejected).toBe(1)
    expect(report.totals.open).toBe(2)
    expect(report.totals.decided).toBe(3)
    expect(report.totals.conversionRate).toBe(66.67)
    expect(report.totals.amounts).toEqual([
      { currency: 'PEN', count: 4, total: 1680 },
      { currency: 'USD', count: 1, total: 500 },
    ])
    expect(report.totals.averageTicket).toEqual([
      { currency: 'PEN', count: 1, total: 1180 },
      { currency: 'USD', count: 1, total: 500 },
    ])

    expect(report.monthly).toEqual([
      {
        month: '2026-10',
        label: 'oct 2026',
        quotes: 1,
        approved: 1,
        amounts: [
          { currency: 'PEN', count: 1, total: 1180 },
          { currency: 'USD', count: 0, total: 0 },
        ],
      },
      {
        month: '2026-11',
        label: 'nov 2026',
        quotes: 4,
        approved: 1,
        amounts: [
          { currency: 'PEN', count: 3, total: 500 },
          { currency: 'USD', count: 1, total: 500 },
        ],
      },
    ])

    expect(report.topClients.map((item) => item.name)).toEqual([
      'Acme',
      'Beta',
      'Ana',
      'Carlos',
    ])
    expect(report.topClients[0].quotes).toBe(2)
    expect(report.topClients[0].approved).toBe(1)

    expect(report.topProducts.map((item) => item.name)).toEqual(['Mouse', 'Laptop'])
    expect(report.topProducts[0].quantity).toBe(5)
    expect(report.topProducts[0].quotes).toBe(2)
    expect(report.topProducts[1].amounts).toEqual([
      { currency: 'PEN', count: 1, total: 1180 },
      { currency: 'USD', count: 1, total: 500 },
    ])
  })

  it('usa los últimos 30 días por defecto', async () => {
    const repository = seededRepository()
    const service = new DashboardService(repository)
    const report = await service.getSalesReport(undefined, undefined, NOW)

    expect(repository.quoteRange?.from.toISOString()).toBe('2026-10-06T00:00:00.000Z')
    expect(report.range).toEqual({ from: '2026-10-06', to: '2026-11-04', days: 30 })
  })

  it('rechaza un rango invertido', async () => {
    const service = new DashboardService(new FakeDashboardRepository())
    await expect(
      service.getSalesReport('2026-11-10', '2026-11-01', NOW)
    ).rejects.toThrow('La fecha inicial no puede ser posterior a la fecha final.')
  })
})

describe('DashboardService — reporte de mesa de ayuda', () => {
  it('agrega estados, canales y tiempos del rango', async () => {
    const repository = seededRepository()
    const service = new DashboardService(repository)
    const report = await service.getHelpdeskReport('2026-11-01', '2026-11-04', NOW)

    expect(repository.requestRange?.from.toISOString()).toBe('2026-11-01T00:00:00.000Z')
    expect(report.range).toEqual({ from: '2026-11-01', to: '2026-11-04', days: 4 })
    expect(report.totals).toEqual({
      requests: 3,
      attended: 1,
      pending: 2,
      discarded: 0,
      attendedRate: 33.33,
      avgFirstResponseHours: 1.5,
      avgResolutionHours: 5,
    })
    expect(report.byStatus).toEqual({
      new: 1,
      review: 1,
      attended: 1,
      discarded: 0,
    })
    expect(report.byChannel).toEqual({
      web: 1,
      email: 1,
      whatsapp: 1,
      phone: 0,
    })
    expect(report.monthly).toEqual([
      { month: '2026-11', label: 'nov 2026', requests: 3, attended: 1 },
    ])
  })
})
