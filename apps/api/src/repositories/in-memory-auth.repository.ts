import { randomUUID } from 'node:crypto'
import {
  allPermissionKeys,
  permissionCatalog,
  viewOnlyKeys,
} from '@fj-solutions/contracts/permissions'
import { hashPassword } from '../utils/password'
import type {
  AuthRepository,
  AuthRoleRecord,
  AuthUserRecord,
  CreateAuthUserInput,
  TwoFactorUpdate,
} from './auth.repository'

// Coincide con SEED_ADMIN_EMAIL y con el bloque "Acceso de desarrollo" del
// login del panel, para que el botón "Usar credenciales" funcione sin base de datos.
export const DEMO_EMAIL = 'admin@fjsolutions.com.pe'
export const DEMO_PASSWORD = 'Admin12345!'

// El catálogo de permisos vive en contracts/permissions y es el mismo que usa la
// matriz del panel. Aquí solo se declaran los módulos que aún no tienen pantalla
// pero sí existen en el seed de Prisma (MODULES en prisma/seed.ts).
const EXTRA_PERMISSION_MODULES = [
  { key: 'tasks', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'media', actions: ['view', 'upload', 'delete'] },
  { key: 'notifications', actions: ['view', 'manage'] },
] as const

const fixturePermissionModules = [
  ...permissionCatalog,
  ...EXTRA_PERMISSION_MODULES.map((module) => ({
    key: module.key,
    actions: [...module.actions],
  })),
]

const ALL_PERMISSION_KEYS = allPermissionKeys(fixturePermissionModules)
const VIEW_ONLY_PERMISSION_KEYS = viewOnlyKeys(fixturePermissionModules)

function demoUser(overrides: {
  id: string
  name: string
  email: string
  role: AuthRoleRecord
  permissions: string[]
  phone?: string | null
  company?: string | null
}): AuthUserRecord {
  const createdAt = new Date('2026-01-05T08:00:00.000Z')
  return {
    id: overrides.id,
    name: overrides.name,
    email: overrides.email,
    passwordHash: '',
    phone: overrides.phone ?? null,
    company: overrides.company ?? null,
    status: 'ACTIVE',
    lastLoginAt: null,
    createdAt,
    updatedAt: createdAt,
    twoFactorEnabled: false,
    twoFactorMethod: null,
    twoFactorSecret: null,
    twoFactorPendingSecret: null,
    twoFactorConfirmedAt: null,
    twoFactorLastStep: null,
    role: overrides.role,
    permissions: overrides.permissions,
  }
}

export class InMemoryAuthRepository implements AuthRepository {
  private readonly roles = new Map<string, AuthRoleRecord>()
  private readonly users = new Map<string, AuthUserRecord>()
  private readonly usersByEmail = new Map<string, string>()
  private loading: Promise<void> | undefined

  constructor() {
    for (const [key, name] of [
      ['superadmin', 'Superadministrador'],
      ['admin', 'Administrador'],
      ['ventas', 'Ventas'],
      ['soporte', 'Soporte'],
      ['consulta', 'Consulta'],
    ] as const) {
      this.roles.set(key, { id: randomUUID(), key, name })
    }
  }

  // El hash se calcula una sola vez bajo demanda: el costo de bcrypt no debe
  // correrse en el import del módulo.
  private async ensureLoaded(): Promise<void> {
    this.loading ??= (async () => {
      const passwordHash = await hashPassword(DEMO_PASSWORD)

      const accounts = [
        demoUser({
          id: 'demo-superadmin',
          name: 'Administrador Demo',
          email: DEMO_EMAIL,
          role: this.roles.get('superadmin')!,
          permissions: ALL_PERMISSION_KEYS,
          company: 'F&J Systems',
          phone: '+51 900 000 000',
        }),
        demoUser({
          id: 'demo-consulta',
          name: 'Consulta Demo',
          email: 'consulta@fjsolutions.com.pe',
          role: this.roles.get('consulta')!,
          permissions: VIEW_ONLY_PERMISSION_KEYS,
        }),
      ]

      for (const account of accounts) {
        account.passwordHash = passwordHash
        this.users.set(account.id, account)
        this.usersByEmail.set(account.email, account.id)
      }
    })()

    return this.loading
  }

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    await this.ensureLoaded()
    const id = this.usersByEmail.get(email.toLowerCase())
    return id ? this.users.get(id) ?? null : null
  }

  async findById(id: string): Promise<AuthUserRecord | null> {
    await this.ensureLoaded()
    return this.users.get(id) ?? null
  }

  async findRoleByKey(key: string): Promise<AuthRoleRecord | null> {
    await this.ensureLoaded()
    return this.roles.get(key) ?? null
  }

  async createUser(input: CreateAuthUserInput): Promise<AuthUserRecord> {
    await this.ensureLoaded()
    const email = input.email.toLowerCase()
    if (this.usersByEmail.has(email)) {
      throw Object.assign(new Error('Unique constraint on email'), { code: 'P2002' })
    }

    const role = [...this.roles.values()].find((item) => item.id === input.roleId)
    const user = demoUser({
      id: randomUUID(),
      name: input.name,
      email,
      role: role ?? this.roles.get('consulta')!,
      permissions: role?.key === 'superadmin' ? ALL_PERMISSION_KEYS : VIEW_ONLY_PERMISSION_KEYS,
      phone: input.phone ?? null,
      company: input.company ?? null,
    })
    user.passwordHash = input.passwordHash

    this.users.set(user.id, user)
    this.usersByEmail.set(email, user.id)
    return user
  }

  async touchLastLogin(id: string): Promise<void> {
    await this.ensureLoaded()
    const user = this.users.get(id)
    if (!user) return
    user.lastLoginAt = new Date()
    user.updatedAt = user.lastLoginAt
  }

  async updateTwoFactor(id: string, data: TwoFactorUpdate): Promise<void> {
    await this.ensureLoaded()
    const user = this.users.get(id)
    if (!user) return

    if (data.enabled !== undefined) user.twoFactorEnabled = data.enabled
    if (data.method !== undefined) user.twoFactorMethod = data.method
    if (data.secret !== undefined) user.twoFactorSecret = data.secret
    if (data.pendingSecret !== undefined) user.twoFactorPendingSecret = data.pendingSecret
    if (data.confirmedAt !== undefined) user.twoFactorConfirmedAt = data.confirmedAt
    if (data.lastStep !== undefined) user.twoFactorLastStep = data.lastStep
    user.updatedAt = new Date()
  }
}
