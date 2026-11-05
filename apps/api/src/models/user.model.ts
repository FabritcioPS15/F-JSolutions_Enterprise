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
    roleKey: z
      .string()
      .regex(/^[a-z][a-z0-9-]*$/, 'El rol solo admite minúsculas, números y guiones')
      .optional(),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
})

const twoFactorCodeSchema = z.string().regex(/^\d{6}$/, 'El código debe tener 6 dígitos')

export const twoFactorVerifySchema = z.object({
  body: z
    .object({
      challengeToken: z.string().min(10),
      code: twoFactorCodeSchema.optional(),
      recoveryCode: z.string().min(8).max(20).optional(),
    })
    .refine((body) => Boolean(body.code || body.recoveryCode), {
      message: 'Ingresa el código de verificación o un código de recuperación',
    }),
})

export const twoFactorResendSchema = z.object({
  body: z.object({
    challengeToken: z.string().min(10),
  }),
})

export const twoFactorSetupSchema = z.object({
  body: z.object({
    method: z.enum(['TOTP', 'EMAIL']),
  }),
})

export const twoFactorEnableSchema = z.object({
  body: z.object({
    code: twoFactorCodeSchema,
  }),
})

export const twoFactorPasswordSchema = z.object({
  body: z.object({
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