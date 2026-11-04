import {
  Prisma,
  RequestChannel as PrismaRequestChannel,
  RequestStatus as PrismaRequestStatus,
} from '@prisma/client'
import { prisma } from '../config/database'
import type {
  CreateTicketInput,
  HelpdeskChannel,
  HelpdeskReply,
  HelpdeskRepository,
  HelpdeskStatus,
  HelpdeskTicket,
  LinkedClient,
  LinkedQuote,
  TicketSequence,
  UpdateTicketInput,
} from './helpdesk.repository'

const ticketInclude = {
  quote: { select: { id: true, code: true, clientId: true } },
  activities: {
    where: { type: 'REPLY' },
    orderBy: { createdAt: 'desc' as const },
    take: 1,
  },
} satisfies Prisma.ServiceRequestInclude

type PrismaTicket = Prisma.ServiceRequestGetPayload<{ include: typeof ticketInclude }>

const channelToApi: Record<PrismaRequestChannel, HelpdeskChannel> = {
  WEB: 'WEB',
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
  PHONE: 'PHONE',
}

const channelToPrisma: Record<HelpdeskChannel, PrismaRequestChannel> = {
  WEB: PrismaRequestChannel.WEB,
  EMAIL: PrismaRequestChannel.EMAIL,
  WHATSAPP: PrismaRequestChannel.WHATSAPP,
  PHONE: PrismaRequestChannel.PHONE,
}

const statusToPrisma: Record<HelpdeskStatus, PrismaRequestStatus> = {
  NEW: PrismaRequestStatus.NEW,
  REVIEW: PrismaRequestStatus.REVIEW,
  ATTENDED: PrismaRequestStatus.ATTENDED,
  DISCARDED: PrismaRequestStatus.DISCARDED,
}

const statusToApi: Record<PrismaRequestStatus, HelpdeskStatus> = {
  NEW: 'NEW',
  REVIEW: 'REVIEW',
  ATTENDED: 'ATTENDED',
  DISCARDED: 'DISCARDED',
}

function replyToNote(reply: { subject: string; message: string; delivered: boolean }) {
  // La actividad REPLY guarda el asunto, el mensaje y la entrega en un único campo note.
  return JSON.stringify(reply)
}

function parseReplyNote(note: string, at: Date): HelpdeskReply | undefined {
  try {
    const parsed = JSON.parse(note) as Record<string, unknown>
    return {
      subject: String(parsed.subject ?? ''),
      message: String(parsed.message ?? ''),
      delivered: Boolean(parsed.delivered),
      at: at.toISOString(),
    }
  } catch {
    return undefined
  }
}

function toTicket(ticket: PrismaTicket): HelpdeskTicket {
  const lastActivity = ticket.activities[0]
  const lastReply = lastActivity
    ? parseReplyNote(lastActivity.note, lastActivity.createdAt)
    : undefined

  return {
    id: ticket.id,
    code: ticket.code,
    nombre: ticket.name,
    email: ticket.email,
    telefono: ticket.phone ?? '',
    empresa: ticket.company ?? '',
    asunto: ticket.topic,
    mensaje: ticket.message,
    status: statusToApi[ticket.status],
    channel: channelToApi[ticket.channel],
    notes: ticket.notes ?? '',
    quoteCode: ticket.quote?.code,
    quoteId: ticket.quote?.id,
    clientId: ticket.clientId ?? ticket.quote?.clientId ?? undefined,
    repliedAt: ticket.repliedAt?.toISOString(),
    lastReply,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  }
}

class PrismaHelpdeskRepository implements HelpdeskRepository {
  async list(): Promise<HelpdeskTicket[]> {
    const tickets = await prisma.serviceRequest.findMany({
      include: ticketInclude,
      orderBy: { createdAt: 'desc' },
    })
    return tickets.map(toTicket)
  }

  async findById(id: string): Promise<HelpdeskTicket | null> {
    const ticket = await prisma.serviceRequest.findUnique({
      where: { id },
      include: ticketInclude,
    })
    return ticket ? toTicket(ticket) : null
  }

  async create(
    input: CreateTicketInput,
    sequence: TicketSequence,
    clientId?: string | null
  ): Promise<HelpdeskTicket> {
    const ticket = await prisma.serviceRequest.create({
      data: {
        code: sequence.code,
        name: input.nombre.trim(),
        email: input.email.trim(),
        phone: input.telefono?.trim() || null,
        company: input.empresa?.trim() || null,
        topic: input.asunto.trim(),
        message: input.mensaje.trim(),
        channel: channelToPrisma[input.channel ?? 'WEB'],
        status: PrismaRequestStatus.NEW,
        notes: input.notes?.trim() || null,
        clientId: clientId ?? null,
        activities: {
          create: {
            type: 'CREATED',
            note: 'Solicitud registrada desde el canal web.',
          },
        },
      },
      include: ticketInclude,
    })
    return toTicket(ticket)
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
    const current = await prisma.serviceRequest.findUnique({ where: { id } })
    if (!current) return null

    const status = input.status ? statusToPrisma[input.status] : current.status
    const data: Prisma.ServiceRequestUpdateInput = {}

    if (input.status) data.status = status
    if (input.channel) data.channel = channelToPrisma[input.channel]
    if (input.notes !== undefined) data.notes = input.notes.trim() || null
    if (changes.quoteId !== undefined) {
      data.quote = changes.quoteId ? { connect: { id: changes.quoteId } } : { disconnect: true }
    }
    if (changes.clientId !== undefined) {
      data.client = changes.clientId ? { connect: { id: changes.clientId } } : { disconnect: true }
    }
    if (input.status === 'ATTENDED') data.resolvedAt = new Date()
    if (input.status && input.status !== 'ATTENDED') data.resolvedAt = null

    const activities: Prisma.ServiceRequestActivityCreateWithoutRequestInput[] = []
    if (changes.statusChanged && input.status) {
      activities.push({
        type: 'STATUS',
        note: `Cambio de estado: ${current.status} → ${input.status}`,
      })
    }
    if (changes.notesChanged && input.notes !== undefined) {
      activities.push({
        type: 'NOTE',
        note: input.notes.trim() || 'Nota interna eliminada.',
      })
    }

    const ticket = await prisma.serviceRequest.update({
      where: { id },
      data: {
        ...data,
        ...(activities.length > 0 ? { activities: { create: activities } } : {}),
      },
      include: ticketInclude,
    })
    return toTicket(ticket)
  }

  async registerReply(
    id: string,
    reply: { subject: string; message: string; delivered: boolean }
  ): Promise<HelpdeskTicket | null> {
    const current = await prisma.serviceRequest.findUnique({ where: { id } })
    if (!current) return null

    const now = new Date()
    const ticket = await prisma.serviceRequest.update({
      where: { id },
      data: {
        ...(reply.delivered
          ? { status: PrismaRequestStatus.ATTENDED, repliedAt: now, resolvedAt: now }
          : {}),
        activities: {
          create: {
            type: 'REPLY',
            note: replyToNote(reply),
          },
        },
      },
      include: ticketInclude,
    })
    return toTicket(ticket)
  }

  async remove(id: string): Promise<boolean> {
    const result = await prisma.serviceRequest.deleteMany({ where: { id } })
    return result.count > 0
  }

  async nextTicketSequence(): Promise<TicketSequence> {
    return prisma.$transaction(
      async (tx) => {
        const existing = await tx.documentSequence.findUnique({
          where: { key: 'service-request' },
        })
        const sequence =
          existing ??
          (await tx.documentSequence.create({
            data: { key: 'service-request', prefix: 'SOL', nextNumber: 1, padding: 5 },
          }))

        const number = sequence.nextNumber
        await tx.documentSequence.update({
          where: { key: 'service-request' },
          data: { nextNumber: number + 1 },
        })

        return {
          code: `${sequence.prefix}-${String(number).padStart(sequence.padding, '0')}`,
          sequenceNumber: number,
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )
  }

  async findClientByEmail(email: string): Promise<LinkedClient | null> {
    const target = email.trim()
    if (!target) return null
    const client = await prisma.client.findFirst({
      where: { email: { equals: target, mode: 'insensitive' } },
      select: { id: true },
    })
    return client
  }

  async findQuoteByCode(code: string): Promise<LinkedQuote | null> {
    const target = code.trim()
    if (!target) return null
    const quote = await prisma.quote.findUnique({
      where: { code: target },
      select: { id: true, clientId: true },
    })
    return quote
  }
}

export const prismaHelpdeskRepository = new PrismaHelpdeskRepository()
