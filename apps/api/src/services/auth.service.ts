import { AppError } from '../middleware/error-handler'
import type {
  AuthRepository,
  AuthUserRecord,
  AuthUserStatus,
} from '../repositories/auth.repository'
import { signRefreshToken, signToken, verifyRefreshToken } from '../utils/jwt'
import { hashPassword, verifyPassword } from '../utils/password'

const DEFAULT_SIGNUP_ROLE = 'consulta'

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

export type RegisterInput = {
  name: string
  email: string
  password: string
  phone?: string
  company?: string
  roleKey?: string
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

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

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

  async login(email: string, password: string): Promise<AuthSession | null> {
    const user = await this.repository.findByEmail(email.trim().toLowerCase())
    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH
    const matches = await verifyPassword(password, passwordHash)

    if (!user || !matches || user.status !== 'ACTIVE') return null

    const now = new Date()
    await this.repository.touchLastLogin(user.id)
    return this.buildSession({ ...user, lastLoginAt: now })
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
