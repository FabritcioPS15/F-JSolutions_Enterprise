import { z } from 'zod'

const serviceSlug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'El slug solo admite minúsculas, números y guiones simples.'
  )

const serviceCategory = z.enum([
  'Soporte TI',
  'Infraestructura TI',
  'Desarrollo de software',
])

const serviceStatus = z.enum(['draft', 'published', 'archived'])

const serviceHeroImage = z.object({
  src: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(1).max(300),
})

const serviceInclude = z.object({
  title: z.string().trim().min(1).max(160),
  copy: z.string().trim().min(1).max(800),
})

const serviceFaq = z.object({
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(2_000),
})

const serviceOfferingFields = {
  slug: serviceSlug,
  title: z.string().trim().min(2).max(200),
  category: serviceCategory,
  summary: z.string().trim().min(10).max(400),
  intro: z.string().trim().min(10).max(5_000),
  heroImage: serviceHeroImage.nullish(),
  includes: z.array(serviceInclude).max(20),
  faq: z.array(serviceFaq).max(20),
  related: z.array(serviceSlug).max(12),
  position: z.coerce.number().int().min(0).max(9_999),
}

export const createServiceOfferingSchema = z.object({
  body: z.object({
    ...serviceOfferingFields,
    status: serviceStatus.default('draft'),
  }),
})

export const updateServiceOfferingSchema = z.object({
  body: z.object({
    ...serviceOfferingFields,
    status: serviceStatus.optional(),
  }),
})

export const serviceOfferingStatusSchema = z.object({
  body: z.object({ status: serviceStatus }),
})

export const serviceOfferingQuerySchema = z.object({
  query: z.object({
    q: z.string().max(160).optional(),
    status: serviceStatus.optional(),
    category: serviceCategory.optional(),
  }),
})

export const publicServiceOfferingQuerySchema = z.object({
  query: z.object({
    category: serviceCategory.optional(),
  }),
})

export const serviceOfferingIdSchema = z.object({
  params: z.object({ id: z.string().min(1).max(120) }),
})

export const publicServiceOfferingSlugSchema = z.object({
  params: z.object({ slug: serviceSlug }),
})
