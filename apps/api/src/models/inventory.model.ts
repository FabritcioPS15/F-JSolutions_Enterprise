import { z } from 'zod'

const movementType = z.enum(['in', 'out', 'adjustment'])

export const inventoryQuerySchema = z.object({
  query: z.object({
    q: z.string().trim().max(160).optional(),
    type: movementType.optional(),
    productId: z.string().trim().max(120).optional(),
    limit: z.coerce.number().int().min(1).max(500).optional(),
  }),
})

export const inventoryMovementSchema = z.object({
  body: z.object({
    productId: z.string().trim().min(1).max(120),
    type: movementType,
    quantity: z.number().int(),
    reason: z.string().trim().max(160).optional(),
    note: z.string().trim().max(1_000).optional(),
  }),
})
