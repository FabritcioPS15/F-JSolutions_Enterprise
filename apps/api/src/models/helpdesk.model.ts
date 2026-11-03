import { z } from 'zod'

export const helpdeskStatusSchema = z.enum(['NEW', 'REVIEW', 'ATTENDED', 'DISCARDED'])
export const helpdeskChannelSchema = z.enum(['WEB', 'EMAIL', 'WHATSAPP', 'PHONE'])

export const createHelpdeskSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(160),
    telefono: z.string().trim().max(40).optional(),
    empresa: z.string().trim().max(160).optional(),
    asunto: z.string().trim().min(2).max(120),
    mensaje: z.string().trim().min(10).max(4000),
    channel: helpdeskChannelSchema.optional(),
    notes: z.string().trim().max(2000).optional(),
  }),
})

export const updateHelpdeskSchema = z.object({
  body: z
    .object({
      status: helpdeskStatusSchema.optional(),
      channel: helpdeskChannelSchema.optional(),
      notes: z.string().max(2000).optional(),
      quoteCode: z.string().trim().max(60).optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'Indica al menos un campo para actualizar.',
    }),
})

export const replyHelpdeskSchema = z.object({
  body: z.object({
    subject: z.string().trim().min(2).max(160),
    message: z.string().trim().min(2).max(5000),
  }),
})
