import { generateSecret, generateSync } from 'otplib'
import { AppError } from '../src/middleware/error-handler'
import type {
  AuthRepository,
  AuthRoleRecord,
  AuthUserRecord,
  CreateAuthUserInput,
  TwoFactorUpdate,
} from '../src/repositories/auth.repository'
import type {
  CreateChallengeInput,
  TwoFactorChallengeRecord,
  TwoFactorRecoveryCodeRecord,
  TwoFactorRepository,
} from '../src/repositories/two-factor.repository'
import { AuthService, type LoginOutcome } from '../src/services/auth.service'
import { verifyToken } from '../src/utils/jwt'
import { hashPassword } from '../src/utils/password'
import {
  encryptTwoFactorSecret,
  formatRecoveryCode,
  generateRecoveryCodes,
  hashRecoveryCode,
  maskEmail,
} from '../src/utils/two-factor'

const adminRole: AuthRoleRecord = { id: 'role-admin', key: 'admin', name: 'Administrador' }

function makeUser(overrides: Partial<AuthUserRecord> = {}): AuthUserRecord {
  return {
    id: 'user-1',
    name: 'Ana Torres',
    email: 'ana@fjsolutions.pe',
    passwordHash: '',
    phone: null,
    company: 'F&J Systems',
    status: 'ACTIVE',
    lastLoginAt: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    role: adminRole,
    permissions: ['dashboard.view'],
    twoFactorEnabled: false,
    twoFactorMethod: null,
    twoFactorSecret: null,
    twoFactorPendingSecret: null,
    twoFactorConfirmedAt: null,
    twoFactorLastStep: null,
    ...overrides,
  }
}

class FakeAuthRepository implements AuthRepository {
  users: AuthUserRecord[] = []
  touchedLogin: string | null = null

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email.toLowerCase()) ?? null
  }

  async findById(id: string) {
    return this.users.find((user) => user.id === id) ?? null
  }

  async findRoleByKey(key: string) {
    return key === adminRole.key ? adminRole : null
  }

  async createUser(input: CreateAuthUserInput) {
    const user = makeUser({
      id: `user-${this.users.length + 1}`,
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
    })
    this.users.push(user)
    return user
  }

  async touchLastLogin(id: string) {
    this.touchedLogin = id
  }

  async updateTwoFactor(id: string, data: TwoFactorUpdate) {
    const user = this.users.find((item) => item.id === id)
    if (!user) return

    if (data.enabled !== undefined) user.twoFactorEnabled = data.enabled
    if (data.method !== undefined) user.twoFactorMethod = data.method
    if (data.secret !== undefined) user.twoFactorSecret = data.secret
    if (data.pendingSecret !== undefined) user.twoFactorPendingSecret = data.pendingSecret
    if (data.confirmedAt !== undefined) user.twoFactorConfirmedAt = data.confirmedAt
    if (data.lastStep !== undefined) user.twoFactorLastStep = data.lastStep
  }
}

class FakeTwoFactorRepository implements TwoFactorRepository {
  challenges: TwoFactorChallengeRecord[] = []
  recoveryCodes: TwoFactorRecoveryCodeRecord[] = []

  async createChallenge(input: CreateChallengeInput) {
    const challenge: TwoFactorChallengeRecord = {
      id: `challenge-${this.challenges.length + 1}`,
      ...input,
      attempts: 0,
      consumedAt: null,
      createdAt: new Date(),
    }
    this.challenges.push(challenge)
    return challenge
  }

  async findLatestChallenge(userId: string, method: 'TOTP' | 'EMAIL') {
    return (
      [...this.challenges]
        .reverse()
        .find((item) => item.userId === userId && item.method === method && !item.consumedAt) ??
      null
    )
  }

  async incrementChallengeAttempts(id: string) {
    const challenge = this.challenges.find((item) => item.id === id)
    if (challenge) challenge.attempts += 1
  }

  async consumeChallenge(id: string) {
    const challenge = this.challenges.find((item) => item.id === id)
    if (challenge) challenge.consumedAt = new Date()
  }

  async consumeOpenChallenges(userId: string, method: 'TOTP' | 'EMAIL') {
    for (const challenge of this.challenges) {
      if (challenge.userId === userId && challenge.method === method && !challenge.consumedAt) {
        challenge.consumedAt = new Date()
      }
    }
  }

  async replaceRecoveryCodes(userId: string, codeHashes: string[]) {
    this.recoveryCodes = this.recoveryCodes.filter((item) => item.userId !== userId)
    this.recoveryCodes.push(
      ...codeHashes.map((codeHash, index) => ({
        id: `recovery-${index + 1}`,
        userId,
        codeHash,
        usedAt: null,
      }))
    )
  }

  async findRecoveryCode(userId: string, codeHash: string) {
    return (
      this.recoveryCodes.find(
        (item) => item.userId === userId && item.codeHash === codeHash && !item.usedAt
      ) ?? null
    )
  }

  async consumeRecoveryCode(id: string) {
    const record = this.recoveryCodes.find((item) => item.id === id)
    if (record) record.usedAt = new Date()
  }

  async countAvailableRecoveryCodes(userId: string) {
    return this.recoveryCodes.filter((item) => item.userId === userId && !item.usedAt).length
  }
}

class FakeMailer {
  sent: Array<{ to: string; code: string }> = []
  delivered = true

  async sendTwoFactorCode(input: { to: string; name: string; code: string; expiresInMinutes: number }) {
    this.sent.push({ to: input.to, code: input.code })
    return this.delivered
  }
}

function asChallenge(outcome: LoginOutcome | null) {
  if (!outcome || outcome.kind !== '2fa') throw new Error('Se esperaba un desafío 2FA')
  return outcome.challenge
}

describe('Autenticación en dos pasos', () => {
  let repository: FakeAuthRepository
  let twoFactorRepository: FakeTwoFactorRepository
  let mailer: FakeMailer
  let service: AuthService
  let user: AuthUserRecord

  beforeEach(async () => {
    repository = new FakeAuthRepository()
    twoFactorRepository = new FakeTwoFactorRepository()
    mailer = new FakeMailer()
    service = new AuthService(repository, twoFactorRepository, mailer)
    user = makeUser({ passwordHash: await hashPassword('Secret123!') })
    repository.users = [user]
  })

  it('pide el código TOTP antes de entregar tokens y evita reutilizar el mismo código', async () => {
    const secret = generateSecret()
    user.twoFactorEnabled = true
    user.twoFactorMethod = 'TOTP'
    user.twoFactorSecret = encryptTwoFactorSecret(secret)

    const challenge = asChallenge(await service.login('ana@fjsolutions.pe', 'Secret123!'))

    expect(challenge.method).toBe('TOTP')
    expect(challenge.email).toBe('an**@fjsolutions.pe')
    expect(repository.touchedLogin).toBeNull()

    const code = generateSync({ secret })
    const session = await service.verifyTwoFactor({
      challengeToken: challenge.challengeToken,
      code,
    })

    expect(repository.touchedLogin).toBe('user-1')
    expect(verifyToken(session.tokens.accessToken).sub).toBe('user-1')

    await expect(
      service.verifyTwoFactor({ challengeToken: challenge.challengeToken, code })
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it('rechaza un código TOTP incorrecto', async () => {
    const secret = generateSecret()
    user.twoFactorEnabled = true
    user.twoFactorMethod = 'TOTP'
    user.twoFactorSecret = encryptTwoFactorSecret(secret)

    const challenge = asChallenge(await service.login('ana@fjsolutions.pe', 'Secret123!'))
    const valid = generateSync({ secret })
    const invalid = valid === '000000' ? '111111' : '000000'

    await expect(
      service.verifyTwoFactor({ challengeToken: challenge.challengeToken, code: invalid })
    ).rejects.toMatchObject({ statusCode: 401 })
    expect(repository.touchedLogin).toBeNull()
  })

  it('envía y valida el código por correo, limitando intentos fallidos', async () => {
    user.twoFactorEnabled = true
    user.twoFactorMethod = 'EMAIL'

    const challenge = asChallenge(await service.login('ana@fjsolutions.pe', 'Secret123!'))

    expect(challenge.method).toBe('EMAIL')
    expect(challenge.email).toBe(maskEmail('ana@fjsolutions.pe'))
    expect(mailer.sent).toHaveLength(1)

    const code = mailer.sent[0].code
    const wrong = code === '000000' ? '111111' : '000000'

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(
        service.verifyTwoFactor({ challengeToken: challenge.challengeToken, code: wrong })
      ).rejects.toBeInstanceOf(AppError)
    }

    await expect(
      service.verifyTwoFactor({ challengeToken: challenge.challengeToken, code })
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it('acepta un código de recuperación una sola vez', async () => {
    user.twoFactorEnabled = true
    user.twoFactorMethod = 'EMAIL'
    const recoveryCode = generateRecoveryCodes()[0]
    await twoFactorRepository.replaceRecoveryCodes(user.id, [hashRecoveryCode(recoveryCode)])

    const challenge = asChallenge(await service.login('ana@fjsolutions.pe', 'Secret123!'))

    const session = await service.verifyTwoFactor({
      challengeToken: challenge.challengeToken,
      recoveryCode: formatRecoveryCode(recoveryCode),
    })
    expect(session.user.id).toBe('user-1')

    await expect(
      service.verifyTwoFactor({
        challengeToken: challenge.challengeToken,
        recoveryCode: formatRecoveryCode(recoveryCode),
      })
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it('configura TOTP, genera códigos de recuperación y permite desactivar con contraseña', async () => {
    const setup = await service.beginTwoFactorSetup(user.id, 'TOTP')

    expect(setup.secret).toBeTruthy()
    expect(setup.qrDataUrl).toMatch(/^data:image\/png;base64,/)
    expect(user.twoFactorPendingSecret).toBeTruthy()
    expect(user.twoFactorEnabled).toBe(false)

    const code = generateSync({ secret: setup.secret! })
    const enabled = await service.enableTwoFactor(user.id, code)

    expect(enabled.recoveryCodes).toHaveLength(10)
    expect(user.twoFactorEnabled).toBe(true)
    expect(user.twoFactorMethod).toBe('TOTP')
    expect(user.twoFactorPendingSecret).toBeNull()
    expect(await twoFactorRepository.countAvailableRecoveryCodes(user.id)).toBe(10)

    const status = await service.getTwoFactorStatus(user.id)
    expect(status).toMatchObject({
      enabled: true,
      method: 'TOTP',
      recoveryCodesRemaining: 10,
    })

    await expect(service.disableTwoFactor(user.id, 'Incorrecta123!')).rejects.toMatchObject({
      statusCode: 401,
    })

    const disabled = await service.disableTwoFactor(user.id, 'Secret123!')
    expect(disabled.enabled).toBe(false)
    expect(user.twoFactorSecret).toBeNull()
    expect(await twoFactorRepository.countAvailableRecoveryCodes(user.id)).toBe(0)
  })

  it('reenvía el código por correo solo después del enfriamiento', async () => {
    user.twoFactorEnabled = true
    user.twoFactorMethod = 'EMAIL'

    const challenge = asChallenge(await service.login('ana@fjsolutions.pe', 'Secret123!'))
    await expect(service.resendEmailChallenge(challenge.challengeToken)).rejects.toMatchObject({
      statusCode: 429,
    })

    const latest = await twoFactorRepository.findLatestChallenge(user.id, 'EMAIL')
    latest!.createdAt = new Date(Date.now() - 31_000)

    const resent = await service.resendEmailChallenge(challenge.challengeToken)
    expect(resent.delivered).toBe(true)
    expect(mailer.sent).toHaveLength(2)
    expect(mailer.sent[1].code).not.toBe(mailer.sent[0].code)

    const session = await service.verifyTwoFactor({
      challengeToken: challenge.challengeToken,
      code: mailer.sent[1].code,
    })
    expect(session.user.id).toBe('user-1')
  })

  it('no emite tokens con un token de desafío manipulado', async () => {
    user.twoFactorEnabled = true
    user.twoFactorMethod = 'TOTP'
    user.twoFactorSecret = encryptTwoFactorSecret(generateSecret())

    await expect(
      service.verifyTwoFactor({ challengeToken: 'token-invalido', code: '123456' })
    ).rejects.toMatchObject({ statusCode: 401 })
  })
})
