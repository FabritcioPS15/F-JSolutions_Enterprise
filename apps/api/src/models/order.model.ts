import { z } from 'zod'

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
})

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerPhone: z.string().min(9),
    items: z.array(orderItemSchema).min(1),
    notes: z.string().max(500).optional(),
  }),
})

export const cotizacionSchema = z.object({
  body: z.object({
    empresa: z.string().min(2),
    contacto: z.string().min(2),
    email: z.string().email(),
    telefono: z.string().min(9),
    mensaje: z.string().max(1000).optional(),
    items: z.array(orderItemSchema).optional(),
  }),
})

export const contactSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(160),
    telefono: z.string().trim().max(40).optional(),
    empresa: z.string().trim().max(160).optional(),
    asunto: z.string().trim().min(2).max(120),
    mensaje: z.string().trim().min(10).max(4000),
    channel: z.enum(['WEB', 'EMAIL', 'WHATSAPP', 'PHONE']).optional(),
  }),
})