import { AuthService } from './auth.service'
import { EmailService } from './email.service'
import { prismaAuthRepository } from '../repositories/prisma-auth.repository'
import { prismaTwoFactorRepository } from '../repositories/prisma-two-factor.repository'

export const authService = new AuthService(
  prismaAuthRepository,
  prismaTwoFactorRepository,
  new EmailService()
)
