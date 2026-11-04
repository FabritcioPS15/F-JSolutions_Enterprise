import type { admin } from '@fj-solutions/contracts'

export type DashboardRange = {
  from: Date
  to: Date
}

export type ProductMetrics = {
  total: number
  published: number
  draft: number
  archived: number
  lowStock: number
  outOfStock: number
  unitsInStock: number
}

export type ClientMetrics = {
  total: number
  active: number
  newSince: number
}

export type QuoteItemRecord = {
  productId: string | null
  name: string
  sku: string | null
  quantity: number
  subtotal: number
}

export type QuoteRecord = {
  id: string
  code: string
  clientId: string | null
  clientName: string
  clientCompany: string | null
  status: admin.QuoteStatus
  currency: admin.Currency
  total: number
  createdAt: string
  decidedAt: string | null
  items: QuoteItemRecord[]
}

export type RequestRecord = {
  id: string
  code: string
  name: string
  topic: string
  status: admin.RequestStatus
  channel: admin.RequestChannel
  createdAt: string
  repliedAt: string | null
  resolvedAt: string | null
}

export interface DashboardRepository {
  productMetrics(): Promise<ProductMetrics>
  clientMetrics(since: Date): Promise<ClientMetrics>
  listQuotes(range?: DashboardRange): Promise<QuoteRecord[]>
  listRequests(range?: DashboardRange): Promise<RequestRecord[]>
}
