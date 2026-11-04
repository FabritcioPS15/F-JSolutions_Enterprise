import { AppError } from '../middleware/error-handler'
import { prismaHelpdeskRepository } from '../repositories/prisma-helpdesk.repository'
import type {
  CreateTicketInput,
  HelpdeskRepository,
  UpdateTicketInput,
} from '../repositories/helpdesk.repository'

export type {
  CreateTicketInput,
  HelpdeskChannel,
  HelpdeskReply,
  HelpdeskStatus,
  HelpdeskTicket,
  UpdateTicketInput,
} from '../repositories/helpdesk.repository'

export class HelpdeskService {
  constructor(
    private readonly repository: HelpdeskRepository = prismaHelpdeskRepository
  ) {}

  async list() {
    return this.repository.list()
  }

  async findById(id: string) {
    return this.repository.findById(id)
  }

  async create(input: CreateTicketInput) {
    const nombre = input.nombre?.trim() ?? ''
    const email = input.email?.trim().toLowerCase() ?? ''
    const asunto = input.asunto?.trim() ?? ''
    const mensaje = input.mensaje?.trim() ?? ''

    if (nombre.length < 2) throw new AppError('El nombre del contacto es obligatorio.', 400)
    if (!email.includes('@')) throw new AppError('El correo del contacto no es válido.', 400)
    if (asunto.length < 2) throw new AppError('El asunto es obligatorio.', 400)
    if (mensaje.length < 10) throw new AppError('El mensaje es demasiado corto.', 400)

    const client = await this.repository.findClientByEmail(email)
    const sequence = await this.repository.nextTicketSequence()

    return this.repository.create(
      {
        ...input,
        nombre,
        email,
        asunto,
        mensaje,
      },
      sequence,
      client?.id ?? null
    )
  }

  async update(id: string, input: UpdateTicketInput) {
    const current = await this.repository.findById(id)
    if (!current) return null

    const changes = {
      statusChanged: Boolean(input.status && input.status !== current.status),
      notesChanged: input.notes !== undefined && input.notes.trim() !== current.notes,
      quoteId: undefined as string | null | undefined,
      clientId: undefined as string | null | undefined,
    }

    if (input.quoteCode !== undefined) {
      const code = input.quoteCode.trim()
      if (!code) {
        changes.quoteId = null
      } else {
        const quote = await this.repository.findQuoteByCode(code)
        if (!quote) throw new AppError('La cotización indicada no existe.', 400)
        changes.quoteId = quote.id
        changes.clientId = quote.clientId ?? current.clientId ?? null
      }
    }

    return this.repository.update(id, input, changes)
  }

  async registerReply(
    id: string,
    reply: { subject: string; message: string; delivered: boolean }
  ) {
    const current = await this.repository.findById(id)
    if (!current) return null
    return this.repository.registerReply(id, reply)
  }

  async remove(id: string) {
    return this.repository.remove(id)
  }
}

export const helpdeskService = new HelpdeskService()
