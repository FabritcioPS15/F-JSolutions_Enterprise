import { z } from 'zod'

const identifier = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[A-Za-z0-9_-]+$/, 'El identificador solo admite letras, números, guiones y guiones bajos.')

const quoteStatus = z.enum([
  'draft',
  'new',
  'review',
  'sent',
  'approved',
  'rejected',
  'expired',
])

const optionalEmail = z.union([z.string().email().max(200), z.literal('')]).optional()

const quoteItemBody = z.object({
  id: z.string().max(120).optional(),
  productId: z.string().max(120).nullish(),
  name: z.string().min(1).max(300),
  sku: z.string().max(80).nullish(),
  quantity: z.number().int().min(1).max(1_000_000),
  unitPrice: z.number().min(0).max(99_999_999),
})

const quoteBody = z.object({
  id: identifier.optional(),
  clientId: z.string().max(120).nullish(),
  clientName: z.string().min(2).max(200),
  clientCompany: z.string().max(200).optional(),
  clientEmail: optionalEmail,
  clientPhone: z.string().max(50).optional(),
  clientDocumentType: z.enum(['dni', 'ruc']).nullish(),
  clientDocumentNumber: z.string().max(20).nullish(),
  clientAddress: z.string().max(300).nullish(),
  status: quoteStatus.optional(),
  currency: z.enum(['PEN', 'USD']).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  items: z.array(quoteItemBody).max(200).optional(),
  notes: z.string().max(10_000).nullish(),
  validUntil: z.string().max(40).nullish(),
})

export const createQuoteSchema = z.object({ body: quoteBody })
export const updateQuoteSchema = z.object({ body: quoteBody.partial() })

export const quoteStatusSchema = z.object({
  body: z.object({ status: quoteStatus }),
})

export const quoteQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    q: z.string().max(160).optional(),
    status: quoteStatus.optional(),
    clientId: z.string().max(120).optional(),
  }),
})

export const quoteIdSchema = z.object({
  params: z.object({ id: z.string().min(1).max(120) }),
})

const publicQuoteItem = z.object({
  productId: z.string().max(120).optional(),
  name: z.string().min(1).max(300),
  sku: z.string().max(80).optional(),
  quantity: z.number().int().min(1).max(10_000),
})

export const publicQuoteSchema = z.object({
  body: z.object({
    contactName: z.string().min(2).max(200),
    contactEmail: z.string().email().max(200),
    contactPhone: z.string().min(6).max(50),
    companyName: z.string().max(200).optional(),
    documentType: z.enum(['dni', 'ruc']).optional(),
    documentNumber: z.string().max(20).optional(),
    contactPreference: z.enum(['email', 'phone', 'whatsapp']).optional(),
    generalNotes: z.string().max(10_000).optional(),
    items: z.array(publicQuoteItem).min(1).max(100),
  }),
})
