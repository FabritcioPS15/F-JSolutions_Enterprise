import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { env } from '../config/env'
import { logger } from '../utils/logger'

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

const STATUSES: HelpdeskStatus[] = ['NEW', 'REVIEW', 'ATTENDED', 'DISCARDED']
const CHANNELS: HelpdeskChannel[] = ['WEB', 'EMAIL', 'WHATSAPP', 'PHONE']

const dataDir = path.resolve(process.cwd(), env.HELPDESK_DATA_DIR)
const dataFile = path.join(dataDir, 'helpdesk.json')

function buildCode(date = new Date(), taken = new Set<string>()): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '')
  let code = ''
  do {
    const random = Math.random().toString(36).slice(2, 6).toUpperCase()
    code = `SOL-${stamp}-${random}`
  } while (taken.has(code))
  return code
}

function normalizeTicket(raw: Record<string, unknown>): HelpdeskTicket {
  const status = STATUSES.includes(raw.status as HelpdeskStatus)
    ? (raw.status as HelpdeskStatus)
    : 'NEW'
  const channel = CHANNELS.includes(raw.channel as HelpdeskChannel)
    ? (raw.channel as HelpdeskChannel)
    : 'WEB'

  return {
    id: String(raw.id ?? randomUUID()),
    code: String(raw.code ?? buildCode()),
    nombre: String(raw.nombre ?? 'Contacto'),
    email: String(raw.email ?? ''),
    telefono: String(raw.telefono ?? ''),
    empresa: String(raw.empresa ?? ''),
    asunto: String(raw.asunto ?? 'Consulta'),
    mensaje: String(raw.mensaje ?? ''),
    status,
    channel,
    notes: String(raw.notes ?? ''),
    quoteCode: raw.quoteCode ? String(raw.quoteCode) : undefined,
    repliedAt: raw.repliedAt ? String(raw.repliedAt) : undefined,
    lastReply:
      raw.lastReply && typeof raw.lastReply === 'object'
        ? {
            subject: String((raw.lastReply as Record<string, unknown>).subject ?? ''),
            message: String((raw.lastReply as Record<string, unknown>).message ?? ''),
            delivered: Boolean((raw.lastReply as Record<string, unknown>).delivered),
            at: String((raw.lastReply as Record<string, unknown>).at ?? new Date().toISOString()),
          }
        : undefined,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  }
}

class HelpdeskService {
  private tickets: HelpdeskTicket[] | null = null
  private writeChain: Promise<void> = Promise.resolve()

  private async load(): Promise<HelpdeskTicket[]> {
    if (this.tickets) return this.tickets
    try {
      const raw = await readFile(dataFile, 'utf8')
      const parsed = JSON.parse(raw) as unknown
      this.tickets = Array.isArray(parsed)
        ? parsed.map((item) => normalizeTicket(item as Record<string, unknown>))
        : []
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        logger.error('No se pudo leer el almacén de mesa de ayuda:', error)
        throw error
      }
      this.tickets = []
    }
    return this.tickets
  }

  private persist(tickets: HelpdeskTicket[]): Promise<void> {
    this.writeChain = this.writeChain.then(async () => {
      await mkdir(dataDir, { recursive: true })
      await writeFile(dataFile, JSON.stringify(tickets, null, 2), 'utf8')
    })
    return this.writeChain
  }

  async list(): Promise<HelpdeskTicket[]> {
    const tickets = await this.load()
    return [...tickets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  async findById(id: string): Promise<HelpdeskTicket | null> {
    const tickets = await this.load()
    return tickets.find((ticket) => ticket.id === id) ?? null
  }

  async create(input: CreateTicketInput): Promise<HelpdeskTicket> {
    const tickets = await this.load()
    const now = new Date().toISOString()
    const ticket: HelpdeskTicket = {
      id: randomUUID(),
      code: buildCode(new Date(), new Set(tickets.map((item) => item.code))),
      nombre: input.nombre.trim(),
      email: input.email.trim(),
      telefono: input.telefono?.trim() ?? '',
      empresa: input.empresa?.trim() ?? '',
      asunto: input.asunto.trim(),
      mensaje: input.mensaje.trim(),
      status: 'NEW',
      channel: input.channel ?? 'WEB',
      notes: input.notes?.trim() ?? '',
      createdAt: now,
      updatedAt: now,
    }
    this.tickets = [ticket, ...tickets]
    await this.persist(this.tickets)
    return ticket
  }

  async update(id: string, input: UpdateTicketInput): Promise<HelpdeskTicket | null> {
    const tickets = await this.load()
    const current = tickets.find((ticket) => ticket.id === id)
    if (!current) return null

    const next: HelpdeskTicket = {
      ...current,
      ...(input.status ? { status: input.status } : {}),
      ...(input.channel ? { channel: input.channel } : {}),
      ...(input.notes !== undefined ? { notes: input.notes.trim() } : {}),
      ...(input.quoteCode !== undefined ? { quoteCode: input.quoteCode.trim() || undefined } : {}),
      updatedAt: new Date().toISOString(),
    }

    this.tickets = tickets.map((ticket) => (ticket.id === id ? next : ticket))
    await this.persist(this.tickets)
    return next
  }

  async registerReply(
    id: string,
    reply: { subject: string; message: string; delivered: boolean }
  ): Promise<HelpdeskTicket | null> {
    const tickets = await this.load()
    const current = tickets.find((ticket) => ticket.id === id)
    if (!current) return null

    const now = new Date().toISOString()
    const next: HelpdeskTicket = {
      ...current,
      status: reply.delivered ? 'ATTENDED' : current.status,
      repliedAt: reply.delivered ? now : current.repliedAt,
      lastReply: { ...reply, at: now },
      updatedAt: now,
    }

    this.tickets = tickets.map((ticket) => (ticket.id === id ? next : ticket))
    await this.persist(this.tickets)
    return next
  }

  async remove(id: string): Promise<boolean> {
    const tickets = await this.load()
    const next = tickets.filter((ticket) => ticket.id !== id)
    if (next.length === tickets.length) return false
    this.tickets = next
    await this.persist(next)
    return true
  }
}

export const helpdeskService = new HelpdeskService()
