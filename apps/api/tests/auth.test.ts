import request from 'supertest'
import app from '../src/app'
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
import { verifyRefreshToken, verifyToken } from '../src/utils/jwt'
import { hashPassword } from '../src/utils/password'

const adminRole: AuthRoleRecord = { id: 'role-admin', key: 'admin', name: 'Administrador' }
const consultaRole: AuthRoleRecord = { id: 'role-consulta', key: 'consulta', name: 'Consulta' }

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
    permissions: ['dashboard.view', 'products.view'],
    twoFactorEnabled: false,
    twoFactorMethod: null,
    twoFactorSecret: null,
    twoFactorPendingSecret: null,
    twoFactorConfirmedAt: null,
    twoFactorLastStep: null,
    ...overrides,
  }
}

function asSession(outcome: LoginOutcome | null) {
  if (!outcome || outcome.kind !== 'session') {
    throw new Error('Se esperaba una sesión completa')
  }
  return outcome.session
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

class FakeAuthRepository implements AuthRepository {
  users: AuthUserRecord[] = []
  roles: AuthRoleRecord[] = [adminRole, consultaRole]
  touchedLogin: string | null = null
  createdInputs: CreateAuthUserInput[] = []
  twoFactorUpdates: Array<{ id: string; data: TwoFactorUpdate }> = []

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email.toLowerCase()) ?? null
  }

  async findById(id: string) {
    return this.users.find((user) => user.id === id) ?? null
  }

  async findRoleByKey(key: string) {
    return this.roles.find((role) => role.key === key) ?? null
  }

  async createUser(input: CreateAuthUserInput) {
    this.createdInputs.push(input)
    const role = this.roles.find((item) => item.id === input.roleId)
    if (!role) throw new Error('Rol inexistente en el repositorio falso')

    const user = makeUser({
      id: `user-${this.users.length + 1}`,
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      phone: input.phone ?? null,
      company: input.company ?? null,
      role,
      permissions: [],
    })

    this.users.push(user)
    return user
  }

  async touchLastLogin(id: string) {
    this.touchedLogin = id
  }

  async updateTwoFactor(id: string, data: TwoFactorUpdate) {
    this.twoFactorUpdates.push({ id, data })
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

describe('AuthService', () => {
  let repository: FakeAuthRepository
  let service: AuthService
  let twoFactorRepository: FakeTwoFactorRepository

  beforeEach(() => {
    repository = new FakeAuthRepository()
    twoFactorRepository = new FakeTwoFactorRepository()
    service = new AuthService(repository, twoFactorRepository, {
      sendTwoFactorCode: async () => true,
    })
  })

  it('inicia sesión con credenciales válidas y firma tokens con el rol actual', async () => {
    const passwordHash = await hashPassword('Secret123!')
    repository.users = [makeUser({ passwordHash })]

    const session = asSession(await service.login('  ANA@fjsolutions.pe ', 'Secret123!'))

    expect(session.user.email).toBe('ana@fjsolutions.pe')
    expect(session.user.role).toBe('admin')
    expect(session.user.permissions).toEqual(['dashboard.view', 'products.view'])
    expect(session.tokens.accessToken).toBeTruthy()
    expect(session.tokens.refreshToken).toBeTruthy()
    expect(verifyToken(session.tokens.accessToken).sub).toBe('user-1')
    expect(verifyRefreshToken(session.tokens.refreshToken).role).toBe('admin')
    expect(repository.touchedLogin).toBe('user-1')
  })

  it('rechaza una contraseña incorrecta', async () => {
    const passwordHash = await hashPassword('Secret123!')
    repository.users = [makeUser({ passwordHash })]

    await expect(service.login('ana@fjsolutions.pe', 'Wrong123!')).resolves.toBeNull()
    expect(repository.touchedLogin).toBeNull()
  })

  it('rechaza un correo desconocido sin revelar si la cuenta existe', async () => {
    await expect(service.login('nadie@fjsolutions.pe', 'Secret123!')).resolves.toBeNull()
  })

  it('rechaza una cuenta inactiva aunque la contraseña sea correcta', async () => {
    const passwordHash = await hashPassword('Secret123!')
    repository.users = [makeUser({ passwordHash, status: 'INACTIVE' })]

    await expect(service.login('ana@fjsolutions.pe', 'Secret123!')).resolves.toBeNull()
  })

  it('no devuelve sesión para usuarios inactivos al verificar el token', async () => {
    repository.users = [makeUser({ status: 'SUSPENDED' })]

    await expect(service.getSessionUser('user-1')).resolves.toBeNull()
    await expect(service.getSessionUser('user-inexistente')).resolves.toBeNull()
  })

  it('renueva tokens con un refresh válido y rechaza uno inválido', async () => {
    repository.users = [makeUser({ passwordHash: await hashPassword('Secret123!') })]

    const session = asSession(await service.login('ana@fjsolutions.pe', 'Secret123!'))
    const refreshed = await service.refresh(session.tokens.refreshToken)

    expect(refreshed.user.id).toBe('user-1')
    expect(verifyToken(refreshed.tokens.accessToken).sub).toBe('user-1')

    await expect(service.refresh('token-invalido')).rejects.toMatchObject({ statusCode: 401 })
  })

  it('registra con el rol consulta por defecto y nunca guarda la contraseña en claro', async () => {
    const session = await service.register({
      name: 'Carlos Ruiz',
      email: 'Carlos@FJSolutions.pe',
      password: 'Clave12345',
    })

    expect(repository.createdInputs).toHaveLength(1)
    expect(repository.createdInputs[0].roleId).toBe(consultaRole.id)
    expect(repository.createdInputs[0].email).toBe('carlos@fjsolutions.pe')
    expect(repository.createdInputs[0].passwordHash).not.toBe('Clave12345')
    expect(session.user.role).toBe('consulta')
  })

  it('rechaza registrar un correo ya existente', async () => {
    repository.users = [makeUser()]

    await expect(
      service.register({
        name: 'Otra Persona',
        email: 'ana@fjsolutions.pe',
        password: 'Clave12345',
      }),
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it('rechaza un rol inexistente al registrar', async () => {
    await expect(
      service.register({
        name: 'Carlos Ruiz',
        email: 'carlos@fjsolutions.pe',
        password: 'Clave12345',
        roleKey: 'inexistente',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

describe('Auth API guards', () => {
  it('GET /api/v1/auth/me sin token responde 401', async () => {
    const response = await request(app).get('/api/v1/auth/me')
    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
  })

  it('POST /api/v1/auth/register sin sesión responde 401', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      name: 'Intruso',
      email: 'intruso@fjsolutions.pe',
      password: 'Clave12345',
    })

    expect(response.status).toBe(401)
  })

  it('POST /api/v1/auth/login con cuerpo inválido responde 422', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'no-es-un-correo' })

    expect(response.status).toBe(422)
  })

  it('GET /api/v1/helpdesk sin sesión responde 401', async () => {
    const response = await request(app).get('/api/v1/helpdesk')
    expect(response.status).toBe(401)
  })
})
