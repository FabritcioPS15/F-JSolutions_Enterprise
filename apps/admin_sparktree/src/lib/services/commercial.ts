import type { Client, Quote, QuoteLine, QuoteStatus } from '@fj-solutions/contracts/admin'

type Envelope<T> = {
  success: boolean
  data?: T
  message?: string
  pagination?: { page: number; limit: number; total: number; totalPages: number }
}

export class CommercialApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'CommercialApiError'
  }
}

export type CommercialSnapshot = {
  clients: Client[]
  quotes: Quote[]
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function requestEnvelope<T>(path: string, init?: RequestInit): Promise<Envelope<T>> {
  const response = await fetch(`/api/commercial/${path}`, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  const payload = (await response.json().catch(() => ({
    success: false,
    message: 'La API devolvió una respuesta no válida.',
  }))) as Envelope<T>

  if (!response.ok || payload.success === false) {
    throw new CommercialApiError(
      payload.message ?? 'No se pudo completar la operación comercial.',
      response.status
    )
  }

  return payload
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const payload = await requestEnvelope<T>(path, init)
  return payload.data as T
}

async function fetchAll<T>(resource: 'clients' | 'quotes'): Promise<T[]> {
  const items: T[] = []
  let page = 1

  while (page <= 50) {
    const result = await requestEnvelope<T[]>(
      `${resource}?limit=100&page=${page}`
    )
    items.push(...(result.data ?? []))
    const totalPages = result.pagination?.totalPages ?? 1
    if (page >= totalPages) break
    page += 1
  }

  return items
}

export async function fetchCommercialSnapshot(): Promise<CommercialSnapshot> {
  const [clients, quotes] = await Promise.all([
    fetchAll<Client>('clients'),
    fetchAll<Quote>('quotes'),
  ])
  return { clients, quotes }
}

function clientPayload(client: Client) {
  const documentType = client.documentType ?? null
  const documentNumber = client.documentNumber?.trim() || null
  const hasDocument = Boolean(documentType && documentNumber)
  return {
    id: client.id,
    name: client.name,
    company: client.company,
    documentType: hasDocument ? documentType : null,
    documentNumber: hasDocument ? documentNumber : null,
    email: client.email,
    phone: client.phone,
    city: client.city,
    address: client.address,
    segment: client.segment,
    status: client.status,
    notes: client.notes,
  }
}

export async function saveClient(client: Client): Promise<Client> {
  const body = JSON.stringify(clientPayload(client))
  try {
    return await request<Client>(`clients/${encodeURIComponent(client.id)}`, {
      method: 'PUT',
      body,
    })
  } catch (error) {
    if (!(error instanceof CommercialApiError) || error.status !== 404) throw error
  }

  return request<Client>('clients', { method: 'POST', body })
}

export async function deleteClientNode(id: string) {
  try {
    await request(`clients/${encodeURIComponent(id)}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof CommercialApiError && error.status === 404) return
    throw error
  }
}

function quoteLinePayload(line: QuoteLine) {
  return {
    id: line.id,
    // Solo se vinculan productos con id UUID; los ids estáticos del respaldo local
    // no existen en la base de datos y romperían la clave foránea.
    productId: line.productId && UUID_PATTERN.test(line.productId) ? line.productId : null,
    name: line.name,
    sku: line.sku ?? null,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
  }
}

function quotePayload(quote: Quote, client?: Client) {
  const documentType = client?.documentType ?? null
  const documentNumber = client?.documentNumber?.trim() || null
  const hasDocument = Boolean(documentType && documentNumber)
  return {
    id: quote.id,
    clientId: quote.clientId || null,
    clientName: quote.clientName,
    clientCompany: quote.clientCompany,
    clientEmail: quote.clientEmail,
    clientPhone: quote.clientPhone,
    clientDocumentType: hasDocument ? documentType : null,
    clientDocumentNumber: hasDocument ? documentNumber : null,
    clientAddress: client?.address || null,
    status: quote.status,
    items: quote.items.map(quoteLinePayload),
    notes: quote.notes,
    validUntil: quote.validUntil || null,
  }
}

export async function saveQuote(quote: Quote, client?: Client): Promise<Quote> {
  const body = JSON.stringify(quotePayload(quote, client))
  try {
    return await request<Quote>(`quotes/${encodeURIComponent(quote.id)}`, {
      method: 'PUT',
      body,
    })
  } catch (error) {
    if (!(error instanceof CommercialApiError) || error.status !== 404) throw error
  }

  return request<Quote>('quotes', { method: 'POST', body })
}

export async function updateQuoteStatusNode(id: string, status: QuoteStatus): Promise<Quote> {
  return request<Quote>(`quotes/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function deleteQuoteNode(id: string) {
  try {
    await request(`quotes/${encodeURIComponent(id)}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof CommercialApiError && error.status === 404) return
    throw error
  }
}
