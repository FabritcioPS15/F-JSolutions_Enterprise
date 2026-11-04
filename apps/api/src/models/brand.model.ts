import { z } from 'zod'

const identifier = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[A-Za-z0-9_-]+$/, 'El identificador solo admite letras, números, guiones y guiones bajos.')

const brandBody = z.object({
  id: identifier.optional(),
  name: z.string().min(1).max(160),
  slug: z.string().max(160).optional(),
  description: z.string().max(1_000).optional(),
  logoUrl: z.string().max(2_000_000).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  sortOrder: z.number().int().min(0).max(10_000).optional(),
})

export const createBrandSchema = z.object({ body: brandBody })
export const updateBrandSchema = z.object({ body: brandBody.partial() })

export const brandQuerySchema = z.object({
  query: z.object({
    scope: z.enum(['public', 'admin']).default('public'),
  }),
})

export const brandIdSchema = z.object({
  params: z.object({ id: z.string().min(1).max(120) }),
})
