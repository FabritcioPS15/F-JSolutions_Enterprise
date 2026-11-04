import type {
  DashboardSummary,
  HelpdeskReport,
  SalesReport,
} from '@fj-solutions/contracts/admin'

type Envelope<T> = {
  success: boolean
  data?: T
  message?: string
}

export class DashboardApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'DashboardApiError'
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`/api/dashboard/${path}`, {
    credentials: 'same-origin',
    cache: 'no-store',
  })

  const payload = (await response.json().catch(() => ({
    success: false,
    message: 'La API devolvió una respuesta no válida.',
  }))) as Envelope<T>

  if (!response.ok || payload.success === false) {
    throw new DashboardApiError(
      payload.message ?? 'No se pudieron cargar los indicadores.',
      response.status
    )
  }

  return payload.data as T
}

function query(params: { from?: string; to?: string }) {
  const search = new URLSearchParams()
  if (params.from) search.set('from', params.from)
  if (params.to) search.set('to', params.to)
  const value = search.toString()
  return value ? `?${value}` : ''
}

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>('summary')
}

export function fetchSalesReport(params: { from?: string; to?: string } = {}) {
  return request<SalesReport>(`reports/sales${query(params)}`)
}

export function fetchHelpdeskReport(params: { from?: string; to?: string } = {}) {
  return request<HelpdeskReport>(`reports/helpdesk${query(params)}`)
}
