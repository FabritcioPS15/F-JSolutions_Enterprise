export type HelpdeskStatus = 'NEW' | 'REVIEW' | 'ATTENDED' | 'DISCARDED'
export type HelpdeskChannel = 'WEB' | 'EMAIL' | 'WHATSAPP' | 'PHONE'

export type HelpdeskReply = {
  subject: string
  message: string
  delivered: boolean
  at: string
}

export type HelpdeskTicket = {
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
  lastReply?: HelpdeskReply
  createdAt: string
  updatedAt: string
}

export type CreateTicketInput = {
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  asunto: string
  mensaje: string
  channel?: HelpdeskChannel
  notes?: string
}

export type UpdateTicketInput = {
  status?: HelpdeskStatus
  channel?: HelpdeskChannel
  notes?: string
  quoteCode?: string
}

export type TicketSequence = {
  code: string
  sequenceNumber: number
}

export type LinkedClient = {
  id: string
}

export type LinkedQuote = {
  id: string
  clientId: string | null
}

export interface HelpdeskRepository {
  list(): Promise<HelpdeskTicket[]>
  findById(id: string): Promise<HelpdeskTicket | null>
  create(
    input: CreateTicketInput,
    sequence: TicketSequence,
    clientId?: string | null
  ): Promise<HelpdeskTicket>
  update(
    id: string,
    input: UpdateTicketInput,
    changes: {
      clientId?: string | null
      quoteId?: string | null
      statusChanged: boolean
      notesChanged: boolean
    }
  ): Promise<HelpdeskTicket | null>
  registerReply(
    id: string,
    reply: { subject: string; message: string; delivered: boolean }
  ): Promise<HelpdeskTicket | null>
  remove(id: string): Promise<boolean>
  nextTicketSequence(): Promise<TicketSequence>
  findClientByEmail(email: string): Promise<LinkedClient | null>
  findQuoteByCode(code: string): Promise<LinkedQuote | null>
}
