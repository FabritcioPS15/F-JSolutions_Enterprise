import { z } from 'zod'

const isoDay = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD.')

export const reportRangeSchema = z.object({
  query: z.object({
    from: isoDay.optional(),
    to: isoDay.optional(),
  }),
})
