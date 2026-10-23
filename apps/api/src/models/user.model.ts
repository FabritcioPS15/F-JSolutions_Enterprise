import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Must contain uppercase, lowercase and number'
    ),
    phone: z.string().optional(),
    company: z.string().optional(),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
})

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
  }),
})