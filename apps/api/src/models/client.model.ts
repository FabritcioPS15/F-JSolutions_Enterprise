import { z } from 'zod'

const identifier = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[A-Za-z0-9_-]+$/, 'El identificador solo admite letras, números, guiones y guiones bajos.')

const optionalEmail = z.union([z.string().email().max(200), z.literal('')]).nullish()

const clientBody = z.object({
  id: identifier.optional(),
  name: z.string().min(2).max(200),
  company: z.string().max(200).optional(),
  documentType: z.enum(['dni', 'ruc']).nullish(),
  documentNumber: z.string().max(20).nullish(),
  email: optionalEmail,
  phone: z.string().max(50).nullish(),
  city: z.string().max(120).nullish(),
  address: z.string().max(300).nullish(),
  segment: z.enum(['empresa', 'persona']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  notes: z.string().max(5_000).nullish(),
})

export const createClientSchema = z.object({ body: clientBody })
export const updateClientSchema = z.object({ body: clientBody.partial() })

export const clientQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    q: z.string().max(160).optional(),
    status: z.enum(['active', 'inactive']).optional(),
    segment: z.enum(['empresa', 'persona']).optional(),
  }),
})

export const clientIdSchema = z.object({
  params: z.object({ id: z.string().min(1).max(120) }),
})
