import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const DEV_JWT_SECRET = 'dev-jwt-secret-change-me-0123456789abcdef'
const DEV_JWT_REFRESH_SECRET = 'dev-jwt-refresh-secret-change-me-0123456789'
const DEV_ADMIN_KEY = 'dev-helpdesk-key-change-me'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default('/api/v1'),
  DATABASE_URL: z.string().default(''),
  JWT_SECRET: z.string().min(32).default(DEV_JWT_SECRET),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32).default(DEV_JWT_REFRESH_SECRET),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('F&J Systems <no-reply@fjsolutions.pe>'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  ADMIN_API_KEY: z.string().min(16).default(DEV_ADMIN_KEY),
  HELPDESK_DATA_DIR: z.string().default('./data'),
  MAX_FILE_SIZE_MB: z.coerce.number().default(5),
  UPLOAD_PATH: z.string().default('./uploads'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
export const DEV_DEFAULTS = {
  jwtSecret: DEV_JWT_SECRET,
  jwtRefreshSecret: DEV_JWT_REFRESH_SECRET,
  adminKey: DEV_ADMIN_KEY,
}
