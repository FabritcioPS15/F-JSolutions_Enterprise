import { env } from '../config/env'
import { AppError } from '../middleware/error-handler'
import type {
  AuthRepository,
  AuthTwoFactorMethod,
  AuthUserRecord,
  AuthUserStatus,
} from '../repositories/auth.repository'
import type { TwoFactorRepository } from '../repositories/two-factor.repository'
import { logger } from '../utils/logger'
import {
  signRefreshToken,
  signToken,
  signTwoFactorToken,
  verifyRefreshToken,
  verifyTwoFactorToken,
} from '../utils/jwt'
import { hashPassword, verifyPassword } from '../utils/password'
import {
  decryptTwoFactorSecret,
  encryptTwoFactorSecret,
  formatRecoveryCode,
  generateEmailCode,
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
  hashTwoFactorValue,
  maskEmail,
  safeEqual,
  totpQrDataUrl,
  verifyTotp,
} from '../utils/two-factor'

const DEFAULT_SIGNUP_ROLE = 'consulta'
const CHALLENGE_TTL_MS = 10 * 60 * 1000
const RESEND_COOLDOWN_MS = 30 * 1000
const MAX_CHALLENGE_ATTEMPTS = 5
const CHALLENGE_TTL_MINUTES = CHALLENGE_TTL_MS / (60 * 1000)

// Atajo exclusivo de desarrollo local: nunca se acepta en test ni producción.
const DEV_2FA_CODE = '000000'

// Hash válido de un valor aleatorio: mantiene un costo de bcrypt similar cuando
// el correo no existe y evita distinguir usuarios por tiempo de respuesta.
const DUMMY_PASSWORD_HASH = '$2a$12$KO7/iYfMJENt739JaSUgb.Hzj0pTwORqTRSblwMziLDZrFTMz31Am'

export type SafeAuthUser = {
  id: string
  name: string
  email: string
  role: string
  roleName: string
  permissions: string[]
  phone: string | null
  company: string | null
  status: AuthUserStatus
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type AuthSession = {
  user: SafeAuthUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export type TwoFactorChallenge = {
  method: AuthTwoFactorMethod
  challengeToken: string
  expiresAt: Date
  email: string
}

export type LoginOutcome =
  | { kind: 'session'; session: AuthSession }
  | { kind: '2fa'; challenge: TwoFactorChallenge }

export type RegisterInput = {
  name: string
  email: string
  password: string
  phone?: string
  company?: string
  roleKey?: string
}

export type TwoFactorStatus = {
  enabled: boolean
  method: AuthTwoFactorMethod | null
  confirmedAt: Date | null
  recoveryCodesRemaining: number
}

export type TwoFactorSetupResult = {
  method: AuthTwoFactorMethod
  email?: string
  qrDataUrl?: string
  secret?: string
  expiresAt?: Date
  delivered?: boolean
}

export type VerifyTwoFactorInput = {
  challengeToken: string
  code?: string
  recoveryCode?: string
}

export interface TwoFactorMailer {
  sendTwoFactorCode(input: {
    to: string
    name: string
    code: string
    expiresInMinutes: number
  }): Promise<boolean>
}

function toSafeUser(user: AuthUserRecord): SafeAuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.key,
    roleName: user.role.name,
    permissions: user.permissions,
    phone: user.phone,
    company: user.company,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002'
}

function invalidCodeError() {
  return new AppError('El código es incorrecto o expiró. Inténtalo nuevamente.', 401)
}

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly twoFactorRepository: TwoFactorRepository,
    private readonly mailer: TwoFactorMailer
  ) {}

  private buildSession(user: AuthUserRecord): AuthSession {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.key,
    }

    return {
      user: toSafeUser(user),
      tokens: {
        accessToken: signToken(payload),
        refreshToken: signRefreshToken(payload),
      },
    }
  }

  private async completeLogin(user: AuthUserRecord): Promise<AuthSession> {
    const now = new Date()
    await this.repository.touchLastLogin(user.id)
    await this.twoFactorRepository.consumeOpenChallenges(user.id, 'EMAIL')
    return this.buildSession({ ...user, lastLoginAt: now })
  }

  async login(email: string, password: string): Promise<LoginOutcome | null> {
    const user = await this.repository.findByEmail(email.trim().toLowerCase())
    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH
    const matches = await verifyPassword(password, passwordHash)

    if (!user || !matches || user.status !== 'ACTIVE') return null

    if (user.twoFactorEnabled && user.twoFactorMethod) {
      return { kind: '2fa', challenge: await this.startChallenge(user, user.twoFactorMethod) }
    }

    return { kind: 'session', session: await this.completeLogin(user) }
  }

  private async startChallenge(
    user: AuthUserRecord,
    method: AuthTwoFactorMethod
  ): Promise<TwoFactorChallenge> {
    const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS)
    const challengeToken = signTwoFactorToken({ sub: user.id, method })

    if (method === 'EMAIL') {
      const code = generateEmailCode()
      await this.issueEmailChallenge(user, code, expiresAt)
      await this.deliverEmailCode(user, code)
    }

    return {
      method,
      challengeToken,
      expiresAt,
      email: maskEmail(user.email),
    }
  }

  private async issueEmailChallenge(user: AuthUserRecord, code: string, expiresAt: Date) {
    await this.twoFactorRepository.consumeOpenChallenges(user.id, 'EMAIL')
    await this.twoFactorRepository.createChallenge({
      userId: user.id,
      method: 'EMAIL',
      codeHash: hashTwoFactorValue(`email:${code}`),
      expiresAt,
    })
  }

  private async deliverEmailCode(user: AuthUserRecord, code: string): Promise<boolean> {
    if (env.NODE_ENV !== 'production') {
      logger.info(`[2FA] Código de verificación para ${user.email}: ${code}`)
    }

    return this.mailer.sendTwoFactorCode({
      to: user.email,
      name: user.name,
      code,
      expiresInMinutes: CHALLENGE_TTL_MINUTES,
    })
  }

  async verifyTwoFactor(input: VerifyTwoFactorInput): Promise<AuthSession> {
    const payload = this.readChallengeToken(input.challengeToken)
    const user = await this.repository.findById(payload.sub)

    if (
      !user ||
      user.status !== 'ACTIVE' ||
      !user.twoFactorEnabled ||
      user.twoFactorMethod !== payload.method
    ) {
      throw new AppError('La verificación ya no es válida. Inicia sesión nuevamente.', 401)
    }

    if (input.recoveryCode) {
      await this.consumeRecoveryCode(user, input.recoveryCode)
      return this.completeLogin(user)
    }

    if (!input.code) {
      throw new AppError('Ingresa el código de verificación.', 400)
    }

    if (env.NODE_ENV === 'development' && input.code.trim() === DEV_2FA_CODE) {
      logger.warn(`[2FA] Código de desarrollo aceptado para ${user.id}`)
      return this.completeLogin(user)
    }

    if (payload.method === 'TOTP') {
      await this.verifyTotpChallenge(user, input.code)
    } else {
      await this.verifyEmailChallenge(user, input.code)
    }

    return this.completeLogin(user)
  }

  private readChallengeToken(token: string) {
    try {
      return verifyTwoFactorToken(token)
    } catch {
      throw new AppError('La verificación expiró. Inicia sesión nuevamente.', 401)
    }
  }

  private async verifyTotpChallenge(user: AuthUserRecord, code: string) {
    if (!user.twoFactorSecret) throw invalidCodeError()

    let secret: string
    try {
      secret = decryptTwoFactorSecret(user.twoFactorSecret)
    } catch {
      logger.error(`[2FA] No se pudo descifrar el secreto TOTP de ${user.id}`)
      throw invalidCodeError()
    }

    const result = verifyTotp(code, secret, user.twoFactorLastStep ?? undefined)
    if (!result.valid || result.timeStep === undefined) throw invalidCodeError()

    await this.repository.updateTwoFactor(user.id, { lastStep: result.timeStep })
  }

  private async verifyEmailChallenge(user: AuthUserRecord, code: string) {
    const challenge = await this.twoFactorRepository.findLatestChallenge(user.id, 'EMAIL')

    if (
      !challenge ||
      challenge.consumedAt ||
      challenge.expiresAt.getTime() <= Date.now() ||
      challenge.attempts >= MAX_CHALLENGE_ATTEMPTS
    ) {
      throw new AppError('El código expiró. Solicita uno nuevo.', 401)
    }

    const matches = safeEqual(challenge.codeHash, hashTwoFactorValue(`email:${code}`))
    if (!matches) {
      await this.twoFactorRepository.incrementChallengeAttempts(challenge.id)
      throw invalidCodeError()
    }

    await this.twoFactorRepository.consumeChallenge(challenge.id)
  }

  private async consumeRecoveryCode(user: AuthUserRecord, recoveryCode: string) {
    const record = await this.twoFactorRepository.findRecoveryCode(
      user.id,
      hashRecoveryCode(recoveryCode)
    )

    if (!record || record.usedAt) throw invalidCodeError()
    await this.twoFactorRepository.consumeRecoveryCode(record.id)
  }

  async resendEmailChallenge(
    challengeToken: string
  ): Promise<{ email: string; expiresAt: Date; delivered: boolean }> {
    const payload = this.readChallengeToken(challengeToken)

    if (payload.method !== 'EMAIL') {
      throw new AppError('Este método de verificación no envía códigos por correo.', 400)
    }

    const user = await this.repository.findById(payload.sub)
    if (!user || user.status !== 'ACTIVE' || !user.twoFactorEnabled || user.twoFactorMethod !== 'EMAIL') {
      throw new AppError('La verificación ya no es válida. Inicia sesión nuevamente.', 401)
    }

    const latest = await this.twoFactorRepository.findLatestChallenge(user.id, 'EMAIL')
    if (latest && Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS) {
      throw new AppError('Espera unos segundos antes de solicitar otro código.', 429)
    }

    const code = generateEmailCode()
    const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS)
    await this.issueEmailChallenge(user, code, expiresAt)
    const delivered = await this.deliverEmailCode(user, code)

    return { email: maskEmail(user.email), expiresAt, delivered }
  }

  async getTwoFactorStatus(userId: string): Promise<TwoFactorStatus> {
    const user = await this.repository.findById(userId)
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('La cuenta no está disponible.', 401)
    }

    const remaining = user.twoFactorEnabled
      ? await this.twoFactorRepository.countAvailableRecoveryCodes(user.id)
      : 0

    return {
      enabled: user.twoFactorEnabled,
      method: user.twoFactorMethod,
      confirmedAt: user.twoFactorConfirmedAt,
      recoveryCodesRemaining: remaining,
    }
  }

  async beginTwoFactorSetup(
    userId: string,
    method: AuthTwoFactorMethod
  ): Promise<TwoFactorSetupResult> {
    const user = await this.repository.findById(userId)
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('La cuenta no está disponible.', 401)
    }

    if (user.twoFactorEnabled) {
      throw new AppError('La verificación en dos pasos ya está activa.', 409)
    }

    if (method === 'TOTP') {
      const secret = generateTotpSecret()
      await this.repository.updateTwoFactor(user.id, {
        enabled: false,
        method: 'TOTP',
        secret: null,
        pendingSecret: encryptTwoFactorSecret(secret),
        confirmedAt: null,
        lastStep: null,
      })
      await this.twoFactorRepository.consumeOpenChallenges(user.id, 'EMAIL')

      return {
        method: 'TOTP',
        secret,
        qrDataUrl: await totpQrDataUrl(user.email, secret),
      }
    }

    const code = generateEmailCode()
    const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS)
    await this.repository.updateTwoFactor(user.id, {
      enabled: false,
      method: 'EMAIL',
      secret: null,
      pendingSecret: null,
      confirmedAt: null,
      lastStep: null,
    })
    await this.issueEmailChallenge(user, code, expiresAt)
    const delivered = await this.deliverEmailCode(user, code)

    return {
      method: 'EMAIL',
      email: maskEmail(user.email),
      expiresAt,
      delivered,
    }
  }

  async enableTwoFactor(userId: string, code: string): Promise<{ recoveryCodes: string[] }> {
    const user = await this.repository.findById(userId)
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('La cuenta no está disponible.', 401)
    }

    if (user.twoFactorEnabled) {
      throw new AppError('La verificación en dos pasos ya está activa.', 409)
    }

    if (!user.twoFactorMethod) {
      throw new AppError('Inicia la configuración antes de confirmar el código.', 400)
    }

    let lastStep: number | null = null

    if (user.twoFactorMethod === 'TOTP') {
      if (!user.twoFactorPendingSecret) {
        throw new AppError('Inicia la configuración antes de confirmar el código.', 400)
      }

      let secret: string
      try {
        secret = decryptTwoFactorSecret(user.twoFactorPendingSecret)
      } catch {
        logger.error(`[2FA] No se pudo descifrar el secreto pendiente de ${user.id}`)
        throw invalidCodeError()
      }

      const result = verifyTotp(code, secret)
      if (!result.valid) throw invalidCodeError()
      lastStep = result.timeStep ?? null
      await this.repository.updateTwoFactor(user.id, {
        enabled: true,
        method: 'TOTP',
        secret: user.twoFactorPendingSecret,
        pendingSecret: null,
        confirmedAt: new Date(),
        lastStep,
      })
    } else {
      await this.verifyEmailChallenge(user, code)
      await this.repository.updateTwoFactor(user.id, {
        enabled: true,
        method: 'EMAIL',
        secret: null,
        pendingSecret: null,
        confirmedAt: new Date(),
        lastStep: null,
      })
    }

    const recoveryCodes = generateRecoveryCodes()
    await this.twoFactorRepository.replaceRecoveryCodes(
      user.id,
      recoveryCodes.map((item) => hashRecoveryCode(item))
    )

    return { recoveryCodes: recoveryCodes.map(formatRecoveryCode) }
  }

  private async confirmPassword(user: AuthUserRecord, password: string) {
    const matches = await verifyPassword(password, user.passwordHash)
    if (!matches) throw new AppError('La contraseña no es correcta.', 401)
  }

  async disableTwoFactor(userId: string, password: string): Promise<TwoFactorStatus> {
    const user = await this.repository.findById(userId)
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('La cuenta no está disponible.', 401)
    }

    await this.confirmPassword(user, password)

    if (!user.twoFactorEnabled) {
      throw new AppError('La verificación en dos pasos no está activa.', 400)
    }

    await this.repository.updateTwoFactor(user.id, {
      enabled: false,
      method: null,
      secret: null,
      pendingSecret: null,
      confirmedAt: null,
      lastStep: null,
    })
    await this.twoFactorRepository.replaceRecoveryCodes(user.id, [])
    await this.twoFactorRepository.consumeOpenChallenges(user.id, 'TOTP')
    await this.twoFactorRepository.consumeOpenChallenges(user.id, 'EMAIL')

    return {
      enabled: false,
      method: null,
      confirmedAt: null,
      recoveryCodesRemaining: 0,
    }
  }

  async regenerateRecoveryCodes(
    userId: string,
    password: string
  ): Promise<{ recoveryCodes: string[] }> {
    const user = await this.repository.findById(userId)
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('La cuenta no está disponible.', 401)
    }

    await this.confirmPassword(user, password)

    if (!user.twoFactorEnabled) {
      throw new AppError('Activa la verificación en dos pasos primero.', 400)
    }

    const recoveryCodes = generateRecoveryCodes()
    await this.twoFactorRepository.replaceRecoveryCodes(
      user.id,
      recoveryCodes.map((item) => hashRecoveryCode(item))
    )

    return { recoveryCodes: recoveryCodes.map(formatRecoveryCode) }
  }

  async register(input: RegisterInput): Promise<AuthSession> {
    const email = input.email.trim().toLowerCase()
    const existing = await this.repository.findByEmail(email)

    if (existing) {
      throw new AppError('El correo electrónico ya se encuentra registrado.', 409)
    }

    const roleKey = input.roleKey?.trim() || DEFAULT_SIGNUP_ROLE
    const role = await this.repository.findRoleByKey(roleKey)
    if (!role) {
      throw input.roleKey
        ? new AppError('El rol indicado no existe.', 400)
        : new AppError('El registro no está disponible en este momento.', 503)
    }

    const passwordHash = await hashPassword(input.password)

    try {
      const user = await this.repository.createUser({
        name: input.name.trim(),
        email,
        passwordHash,
        phone: input.phone ?? null,
        company: input.company ?? null,
        roleId: role.id,
      })
      return this.buildSession(user)
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError('El correo electrónico ya se encuentra registrado.', 409)
      }
      throw error
    }
  }

  async refresh(refreshToken: string): Promise<AuthSession> {
    let payload: ReturnType<typeof verifyRefreshToken>

    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      throw new AppError('La sesión expiró. Inicia sesión nuevamente.', 401)
    }

    const user = await this.repository.findById(payload.sub)
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('La sesión ya no es válida.', 401)
    }

    return this.buildSession(user)
  }

  async getSessionUser(userId: string): Promise<SafeAuthUser | null> {
    const user = await this.repository.findById(userId)
    if (!user || user.status !== 'ACTIVE') return null
    return toSafeUser(user)
  }
}
