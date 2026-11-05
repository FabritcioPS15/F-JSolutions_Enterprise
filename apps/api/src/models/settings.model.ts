import { z } from 'zod'

const settingsFields = {
  storeName: z.string().trim().min(1).max(160).optional(),
  legalName: z.string().trim().max(200).optional(),
  ruc: z
    .string()
    .trim()
    .refine((value) => !value || /^\d{11}$/.test(value), 'El RUC debe tener 11 dígitos')
    .optional(),
  email: z.string().trim().email().max(200).optional(),
  phone: z.string().trim().max(60).optional(),
  address: z.string().trim().max(500).optional(),
  currency: z.enum(['PEN', 'USD']).optional(),
  igv: z.number().min(0).max(100).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
}

export const updateSettingsSchema = z.object({
  body: z.object(settingsFields),
})
