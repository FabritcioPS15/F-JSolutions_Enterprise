import type { AdminProduct, Order, Quote, ServiceRequest } from './types'
import { getStockState } from './format'
import { openOrderStatuses } from './operations'

const pendingQuoteStatuses: Quote['status'][] = ['draft', 'new', 'review']

export function isPendingQuote(quote: Quote) {
  return pendingQuoteStatuses.includes(quote.status)
}

export function isLowStockProduct(product: AdminProduct) {
  if (product.status === 'archived') return false
  const state = getStockState(product)
  return state === 'low' || state === 'out'
}

export function isOpenOrder(order: Order) {
  return openOrderStatuses.includes(order.status)
}

export function isNewRequest(request: ServiceRequest) {
  return request.status === 'new'
}
