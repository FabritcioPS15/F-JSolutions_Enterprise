import { z } from 'zod'

const identifier = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[A-Za-z0-9_-]+$/, 'El identificador solo admite letras, números, guiones y guiones bajos.')

const categoryBody = z.object({
  id: identifier.optional(),
  parentId: z.string().min(1).max(120).nullable().optional(),
  name: z.string().min(2).max(160),
  slug: z.string().max(160).optional(),
  description: z.string().max(1_000).optional(),
  imageUrl: z.string().max(2_000_000).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  sortOrder: z.number().int().min(0).max(10_000).optional(),
})

export const createCategorySchema = z.object({ body: categoryBody })
export const updateCategorySchema = z.object({ body: categoryBody.partial() })

export const categoryQuerySchema = z.object({
  query: z.object({
    scope: z.enum(['public', 'admin']).default('public'),
  }),
})

export const categoryIdSchema = z.object({
  params: z.object({ id: z.string().min(1).max(120) }),
})
