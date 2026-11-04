import type {
  CreateTicketInput,
  HelpdeskRepository,
  HelpdeskTicket,
  LinkedClient,
  LinkedQuote,
  TicketSequence,
  UpdateTicketInput,
} from '../src/repositories/helpdesk.repository'
import { HelpdeskService } from '../src/services/helpdesk.service'

type Activity = { ticketId: string; type: string; note: string }

class FakeHelpdeskRepository implements HelpdeskRepository {
  tickets: HelpdeskTicket[] = []
  activities: Activity[] = []
  clients: Array<LinkedClient & { email: string }> = [
    { id: 'cliente-1', email: 'maria@empresa.pe' },
  ]
  quotes: Array<LinkedQuote & { code: string }> = [
    { id: 'cot-1', code: 'COT-00001', clientId: 'cliente-1' },
  ]
  sequence = 0

  async list() {
    return [...this.tickets]
  }

  async findById(id: string) {
    return this.tickets.find((ticket) => ticket.id === id) ?? null
  }

  async create(
    input: CreateTicketInput,
    sequence: TicketSequence,
    clientId?: string | null
  ): Promise<HelpdeskTicket> {
    const now = '2026-03-04T10:00:00.000Z'
    const ticket: HelpdeskTicket = {
      id: `solicitud-${this.tickets.length + 1}`,
      code: sequence.code,
      nombre: input.nombre,
      email: input.email,
      telefono: input.telefono ?? '',
      empresa: input.empresa ?? '',
      asunto: input.asunto,
      mensaje: input.mensaje,
      status: 'NEW',
      channel: input.channel ?? 'WEB',
      notes: input.notes ?? '',
      clientId: clientId ?? undefined,
      createdAt: now,
      updatedAt: now,
    }
    this.tickets.push(ticket)
    this.activities.push({
      ticketId: ticket.id,
      type: 'CREATED',
      note: 'Solicitud registrada desde el canal web.',
    })
    return ticket
  }

  async update(
    id: string,
    input: UpdateTicketInput,
    changes: {
      clientId?: string | null
      quoteId?: string | null
      statusChanged: boolean
      notesChanged: boolean
    }
  ): Promise<HelpdeskTicket | null> {
    const index = this.tickets.findIndex((ticket) => ticket.id === id)
    if (index === -1) return null
    const previous = this.tickets[index]
    const ticket: HelpdeskTicket = { ...previous }

    if (input.status) ticket.status = input.status
    if (input.channel) ticket.channel = input.channel
    if (input.notes !== undefined) ticket.notes = input.notes.trim()

    if (changes.statusChanged && input.status) {
      this.activities.push({
        ticketId: id,
        type: 'STATUS',
        note: `Cambio de estado: ${previous.status} → ${input.status}`,
      })
    }
    if (changes.notesChanged && input.notes !== undefined) {
      this.activities.push({ ticketId: id, type: 'NOTE', note: input.notes.trim() })
    }

    if (changes.quoteId !== undefined) {
      const quote = changes.quoteId
        ? this.quotes.find((item) => item.id === changes.quoteId)
        : undefined
      ticket.quoteId = quote?.id
      ticket.quoteCode = quote?.code
    }
    if (changes.clientId !== undefined) {
      ticket.clientId = changes.clientId ?? undefined
    }

    ticket.updatedAt = '2026-03-04T11:00:00.000Z'
    this.tickets[index] = ticket
    return ticket
  }

  async registerReply(
    id: string,
    reply: { subject: string; message: string; delivered: boolean }
  ): Promise<HelpdeskTicket | null> {
    const index = this.tickets.findIndex((ticket) => ticket.id === id)
    if (index === -1) return null
    const at = '2026-03-05T09:00:00.000Z'
    const ticket: HelpdeskTicket = {
      ...this.tickets[index],
      lastReply: { ...reply, at },
      updatedAt: at,
    }
    if (reply.delivered) {
      ticket.status = 'ATTENDED'
      ticket.repliedAt = at
    }
    this.activities.push({ ticketId: id, type: 'REPLY', note: JSON.stringify(reply) })
    this.tickets[index] = ticket
    return ticket
  }

  async remove(id: string) {
    const exists = this.tickets.some((ticket) => ticket.id === id)
    if (!exists) return false
    this.tickets = this.tickets.filter((ticket) => ticket.id !== id)
    return true
  }

  async nextTicketSequence(): Promise<TicketSequence> {
    this.sequence += 1
    return { code: `SOL-${String(this.sequence).padStart(5, '0')}`, sequenceNumber: this.sequence }
  }

  async findClientByEmail(email: string): Promise<LinkedClient | null> {
    const target = email.trim().toLowerCase()
    const client = this.clients.find((item) => item.email.toLowerCase() === target)
    return client ? { id: client.id } : null
  }

  async findQuoteByCode(code: string): Promise<LinkedQuote | null> {
    const quote = this.quotes.find((item) => item.code === code.trim())
    return quote ? { id: quote.id, clientId: quote.clientId } : null
  }
}

function seedTicket(repository: FakeHelpdeskRepository) {
  return repository.create(
    {
      nombre: 'María López',
      email: 'maria@empresa.pe',
      empresa: 'Empresa Andina',
      asunto: 'Cotización de laptops',
      mensaje: 'Necesitamos 10 equipos para nuestra sede de Lima.',
    },
    { code: 'SOL-00001', sequenceNumber: 1 },
    'cliente-1'
  )
}

describe('HelpdeskService — registro', () => {
  it('crea la solicitud con correlativo SOL y vincula al cliente por correo', async () => {
    const repository = new FakeHelpdeskRepository()
    const service = new HelpdeskService(repository)

    const ticket = await service.create({
      nombre: '  María López ',
      email: ' MARIA@empresa.pe ',
      empresa: 'Empresa Andina',
      asunto: ' Cotización de laptops ',
      mensaje: ' Necesitamos 10 equipos para nuestra sede de Lima. ',
    })

    expect(ticket.code).toBe('SOL-00001')
    expect(ticket.status).toBe('NEW')
    expect(ticket.clientId).toBe('cliente-1')
    expect(ticket.nombre).toBe('María López')
    expect(ticket.email).toBe('maria@empresa.pe')
    expect(repository.activities).toEqual([
      expect.objectContaining({ type: 'CREATED', ticketId: ticket.id }),
    ])
  })

  it('rechaza contactos inválidos antes de tocar el repositorio', async () => {
    const repository = new FakeHelpdeskRepository()
    const service = new HelpdeskService(repository)

    await expect(
      service.create({
        nombre: 'M',
        email: 'maria@empresa.pe',
        asunto: 'Consulta',
        mensaje: 'Mensaje suficientemente largo.',
      })
    ).rejects.toMatchObject({ statusCode: 400 })

    await expect(
      service.create({
        nombre: 'María López',
        email: 'sin-correo',
        asunto: 'Consulta',
        mensaje: 'Mensaje suficientemente largo.',
      })
    ).rejects.toMatchObject({ statusCode: 400 })

    await expect(
      service.create({
        nombre: 'María López',
        email: 'maria@empresa.pe',
        asunto: 'Consulta',
        mensaje: 'Corto',
      })
    ).rejects.toMatchObject({ statusCode: 400 })

    expect(repository.tickets).toHaveLength(0)
    expect(repository.sequence).toBe(0)
  })
})

describe('HelpdeskService — seguimiento', () => {
  it('vincula la cotización por código y registra estado y nota interna', async () => {
    const repository = new FakeHelpdeskRepository()
    const ticket = await seedTicket(repository)
    const service = new HelpdeskService(repository)

    const updated = await service.update(ticket.id, {
      status: 'REVIEW',
      quoteCode: 'COT-00001',
      notes: 'Cliente con compra recurrente.',
    })

    expect(updated?.status).toBe('REVIEW')
    expect(updated?.quoteCode).toBe('COT-00001')
    expect(updated?.quoteId).toBe('cot-1')
    expect(updated?.clientId).toBe('cliente-1')
    expect(repository.activities.map((activity) => activity.type)).toEqual([
      'CREATED',
      'STATUS',
      'NOTE',
    ])
  })

  it('rechaza cotizaciones inexistentes y libera el vínculo con código vacío', async () => {
    const repository = new FakeHelpdeskRepository()
    const ticket = await seedTicket(repository)
    const service = new HelpdeskService(repository)

    await expect(
      service.update(ticket.id, { quoteCode: 'COT-99999' })
    ).rejects.toMatchObject({ statusCode: 400 })

    await service.update(ticket.id, { quoteCode: 'COT-00001' })
    const released = await service.update(ticket.id, { quoteCode: '' })

    expect(released?.quoteCode).toBeUndefined()
    expect(released?.quoteId).toBeUndefined()
    expect(released?.clientId).toBe('cliente-1')
  })

  it('registra la respuesta y marca la solicitud como atendida solo si se entregó', async () => {
    const repository = new FakeHelpdeskRepository()
    const ticket = await seedTicket(repository)
    const service = new HelpdeskService(repository)

    const undelivered = await service.registerReply(ticket.id, {
      subject: 'Revisión',
      message: 'Estamos preparando tu propuesta.',
      delivered: false,
    })
    expect(undelivered?.status).toBe('NEW')
    expect(undelivered?.lastReply?.delivered).toBe(false)

    const delivered = await service.registerReply(ticket.id, {
      subject: 'Propuesta enviada',
      message: 'Adjuntamos la cotización solicitada.',
      delivered: true,
    })
    expect(delivered?.status).toBe('ATTENDED')
    expect(delivered?.repliedAt).toBe('2026-03-05T09:00:00.000Z')
    expect(delivered?.lastReply).toMatchObject({
      subject: 'Propuesta enviada',
      delivered: true,
    })
    expect(
      repository.activities.filter((activity) => activity.type === 'REPLY')
    ).toHaveLength(2)
  })

  it('elimina solicitudes existentes y devuelve null en las inexistentes', async () => {
    const repository = new FakeHelpdeskRepository()
    const ticket = await seedTicket(repository)
    const service = new HelpdeskService(repository)

    expect(await service.remove('solicitud-fantasma')).toBe(false)
    expect(await service.remove(ticket.id)).toBe(true)
    expect(await service.list()).toHaveLength(0)
  })
})
