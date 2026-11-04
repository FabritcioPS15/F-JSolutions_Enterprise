import request from 'supertest'
import app from '../src/app'
import { AppError } from '../src/middleware/error-handler'
import type {
  AuthRepository,
  AuthRoleRecord,
  AuthUserRecord,
  CreateAuthUserInput,
} from '../src/repositories/auth.repository'
import { AuthService } from '../src/services/auth.service'
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
    ...overrides,
  }
}

class FakeAuthRepository implements AuthRepository {
  users: AuthUserRecord[] = []
  roles: AuthRoleRecord[] = [adminRole, consultaRole]
  touchedLogin: string | null = null
  createdInputs: CreateAuthUserInput[] = []

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
}

describe('AuthService', () => {
  let repository: FakeAuthRepository
  let service: AuthService

  beforeEach(() => {
    repository = new FakeAuthRepository()
    service = new AuthService(repository)
  })

  it('inicia sesión con credenciales válidas y firma tokens con el rol actual', async () => {
    const passwordHash = await hashPassword('Secret123!')
    repository.users = [makeUser({ passwordHash })]

    const session = await service.login('  ANA@fjsolutions.pe ', 'Secret123!')

    expect(session).not.toBeNull()
    expect(session?.user.email).toBe('ana@fjsolutions.pe')
    expect(session?.user.role).toBe('admin')
    expect(session?.user.permissions).toEqual(['dashboard.view', 'products.view'])
    expect(session?.tokens.accessToken).toBeTruthy()
    expect(session?.tokens.refreshToken).toBeTruthy()
    expect(verifyToken(session!.tokens.accessToken).sub).toBe('user-1')
    expect(verifyRefreshToken(session!.tokens.refreshToken).role).toBe('admin')
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

    const session = await service.login('ana@fjsolutions.pe', 'Secret123!')
    const refreshed = await service.refresh(session!.tokens.refreshToken)

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
