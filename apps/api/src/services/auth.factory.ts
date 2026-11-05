import { env } from '../config/env'
import { InMemoryAuthRepository, DEMO_EMAIL, DEMO_PASSWORD } from '../repositories/in-memory-auth.repository'
import { InMemoryTwoFactorRepository } from '../repositories/in-memory-two-factor.repository'
import { prismaAuthRepository } from '../repositories/prisma-auth.repository'
import { prismaTwoFactorRepository } from '../repositories/prisma-two-factor.repository'
import { logger } from '../utils/logger'
import { AuthService } from './auth.service'
import { EmailService } from './email.service'

// Solo en desarrollo y sin DATABASE_URL: producción y las pruebas conservan los
// repositorios de Prisma, así que este modo no puede activarse fuera de local.
export const usingInMemoryAuth = env.NODE_ENV === 'development' && env.DATABASE_URL.length === 0

const authRepository = usingInMemoryAuth ? new InMemoryAuthRepository() : prismaAuthRepository
const twoFactorRepository = usingInMemoryAuth
  ? new InMemoryTwoFactorRepository()
  : prismaTwoFactorRepository

export const authService = new AuthService(authRepository, twoFactorRepository, new EmailService())

if (usingInMemoryAuth) {
  logger.warn(
    `[auth] Modo demo sin base de datos: inicia sesión con ${DEMO_EMAIL} / ${DEMO_PASSWORD}. Cuentas y sesiones no persisten entre reinicios.`
  )
}
