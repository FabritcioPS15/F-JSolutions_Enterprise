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
    nombre: z.string().min(2),
    email: z.string().email(),
    telefono: z.string().optional(),
    empresa: z.string().optional(),
    asunto: z.enum(['ventas', 'soporte', 'cotizacion', 'general']),
    mensaje: z.string().min(10).max(2000),
  }),
})