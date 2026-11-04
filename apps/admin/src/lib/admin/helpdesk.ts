import type {
  Quote,
  RequestChannel,
  RequestStatus,
  ServiceRequest,
  ServiceRequestReply,
} from './types'

export type HelpdeskStatus = 'NEW' | 'REVIEW' | 'ATTENDED' | 'DISCARDED'
export type HelpdeskChannel = 'WEB' | 'EMAIL' | 'WHATSAPP' | 'PHONE'

export type ApiHelpdeskTicket = {
  id: string
  code: string
  nombre: string
  email: string
  telefono: string
  empresa: string
  asunto: string
  mensaje: string
  status: HelpdeskStatus
  channel: HelpdeskChannel
  notes: string
  quoteCode?: string
  quoteId?: string
  clientId?: string
  repliedAt?: string
  lastReply?: ServiceRequestReply
  createdAt: string
  updatedAt: string
}

export type TicketInput = {
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  asunto: string
  mensaje: string
  channel?: HelpdeskChannel
  notes?: string
}

export type TicketPatch = {
  status?: HelpdeskStatus
  channel?: HelpdeskChannel
  notes?: string
  quoteCode?: string
}

export type TicketReplyResult = {
  ticket: ApiHelpdeskTicket
  delivered: boolean
  reason?: string
}

const statusFromApi: Record<HelpdeskStatus, RequestStatus> = {
  NEW: 'new',
  REVIEW: 'review',
  ATTENDED: 'attended',
  DISCARDED: 'discarded',
}

const channelFromApi: Record<HelpdeskChannel, RequestChannel> = {
  WEB: 'web',
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  PHONE: 'phone',
}

const statusToApi: Record<RequestStatus, HelpdeskStatus> = {
  new: 'NEW',
  review: 'REVIEW',
  attended: 'ATTENDED',
  discarded: 'DISCARDED',
}

const channelToApi: Record<RequestChannel, HelpdeskChannel> = {
  web: 'WEB',
  email: 'EMAIL',
  whatsapp: 'WHATSAPP',
  phone: 'PHONE',
}

export function toApiStatus(status: RequestStatus): HelpdeskStatus {
  return statusToApi[status]
}

export function toApiChannel(channel: RequestChannel): HelpdeskChannel {
  return channelToApi[channel]
}

export function mapTicket(ticket: ApiHelpdeskTicket, quotes: Quote[] = []): ServiceRequest {
  const quote = ticket.quoteCode
    ? quotes.find((item) => item.code === ticket.quoteCode)
    : undefined

  return {
    id: ticket.id,
    code: ticket.code,
    name: ticket.nombre,
    company: ticket.empresa,
    email: ticket.email,
    phone: ticket.telefono,
    topic: ticket.asunto,
    message: ticket.mensaje,
    channel: channelFromApi[ticket.channel] ?? 'web',
    status: statusFromApi[ticket.status] ?? 'new',
    clientId: ticket.clientId ?? quote?.clientId,
    quoteId: ticket.quoteId ?? quote?.id,
    quoteCode: ticket.quoteCode,
    repliedAt: ticket.repliedAt,
    lastReply: ticket.lastReply,
    notes: ticket.notes,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
      cache: 'no-store',
    })
  } catch {
    throw new Error('No se pudo conectar con la mesa de ayuda. Revisa que la API esté activa.')
  }

  const body = (await response.json().catch(() => null)) as
    | { success?: boolean; data?: T; message?: string }
    | null

  if (!response.ok || !body?.success) {
    throw new Error(body?.message ?? 'La mesa de ayuda no pudo completar la operación.')
  }

  return body.data as T
}

export function fetchTickets() {
  return request<ApiHelpdeskTicket[]>('/api/helpdesk')
}

export function createTicket(input: TicketInput) {
  return request<ApiHelpdeskTicket>('/api/helpdesk', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateTicket(id: string, patch: TicketPatch) {
  return request<ApiHelpdeskTicket>(`/api/helpdesk/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export function deleteTicket(id: string) {
  return request<null>(`/api/helpdesk/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function sendTicketReply(
  id: string,
  input: { subject: string; message: string }
) {
  return request<TicketReplyResult>(
    `/api/helpdesk/${encodeURIComponent(id)}/reply`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  )
}
