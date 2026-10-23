import { z } from 'zod'

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(200),
    description: z.string().min(10),
    price: z.number().positive(),
    oldPrice: z.number().positive().optional(),
    stock: z.number().int().min(0),
    category: z.string(),
    brand: z.string(),
    images: z.array(z.string().url()).min(1),
    specs: z.record(z.string()).optional(),
    badge: z.string().optional(),
  }),
})

export const updateProductSchema = createProductSchema.deepPartial()

export const productQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(24),
    q: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    oferta: z.coerce.boolean().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).default('newest'),
  }),
})