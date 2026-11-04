import { z } from 'zod'

const booleanish = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'boolean') return value
  const normalized = String(value).toLowerCase()
  if (normalized === 'true' || normalized === '1') return true
  if (normalized === 'false' || normalized === '0') return false
  return value
}, z.boolean().optional())

const identifier = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[A-Za-z0-9_-]+$/, 'El identificador solo admite letras, números, guiones y guiones bajos.')

const imageValue = z.string().max(2_000_000)

const productBody = z.object({
  id: identifier.optional(),
  slug: z.string().min(1).max(140).optional(),
  name: z.string().min(2).max(200),
  shortDescription: z.string().max(300).optional(),
  description: z.string().min(10).max(20_000),
  category: z.string().max(160).optional(),
  subcategory: z.string().max(160).optional(),
  subSubcategory: z.string().max(160).optional(),
  brand: z.string().min(1).max(160),
  model: z.string().max(160).optional(),
  sku: z.string().max(80).optional(),
  internalCode: z.string().max(80).optional(),
  price: z.number().min(0).max(99_999_999),
  cost: z.number().min(0).max(99_999_999).optional(),
  showPrice: z.boolean().optional(),
  commercialMessage: z.string().max(500).optional(),
  stock: z.number().int().min(0).max(1_000_000),
  minStock: z.number().int().min(0).max(1_000_000).optional(),
  availability: z.enum(['available', 'limited', 'consult']).optional(),
  status: z.enum(['active', 'draft', 'archived']).optional(),
  featured: z.boolean().optional(),
  specs: z.array(z.string().max(500)).max(100).optional(),
  image: imageValue.optional(),
  imageAlt: z.string().max(300).optional(),
  images: z.array(imageValue).max(20).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(400).optional(),
})

export const createProductSchema = z.object({ body: productBody })
export const updateProductSchema = z.object({ body: productBody.partial() })

export const productQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    q: z.string().max(160).optional(),
    category: z.string().max(160).optional(),
    brand: z.string().max(160).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    featured: booleanish,
    status: z.enum(['active', 'draft', 'archived']).optional(),
    sort: z.enum(['newest', 'price_asc', 'price_desc', 'name']).default('newest'),
    scope: z.enum(['public', 'admin']).default('public'),
  }),
})

export const productIdSchema = z.object({
  params: z.object({ id: z.string().min(1).max(120) }),
})

export const productSlugSchema = z.object({
  params: z.object({ slug: z.string().min(1).max(160) }),
})
