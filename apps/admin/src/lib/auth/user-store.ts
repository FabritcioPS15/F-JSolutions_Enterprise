import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { isEmail } from '@fj-solutions/contracts/domain'
import { roleLabels } from '@/lib/admin/operations'
import { rolePermissions } from '@/lib/admin/permissions'
import type { AdminUserRole, AdminUserStatus } from '@/lib/admin/types'
import {
  SEEDED_ADMIN_ID,
  localAdminEmail,
  localAdminName,
  verifySeededPassword,
} from './local-admin'
import { passwordProblem } from './password'
import type { ManagedUser, SessionUser } from './types'

// Almacén local de cuentas: solo se guardan hashes scrypt, nunca contraseñas en
// claro. La cuenta base del superadministrador vive en variables de entorno.
type StoredUser = ManagedUser & { passwordHash: string | null }

type StoreFile = {
  version: 1
  users: StoredUser[]
}

export type ManagedUserInput = {
  name: string
  email: string
  phone: string
  role: AdminUserRole
  status: AdminUserStatus
  twoFactorEnabled: boolean
  password?: string
}

export class ManagedUserError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

const STORE_DIR = path.join(process.cwd(), '.data')
const STORE_PATH = path.join(STORE_DIR, 'admin-users.json')
const ROLES: AdminUserRole[] = ['superadmin', 'admin', 'ventas', 'soporte', 'consulta']
const STATUSES: AdminUserStatus[] = ['active', 'invited', 'disabled']

let queue: Promise<unknown> = Promise.resolve()

function withStore<T>(task: (store: StoreFile) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const store = await readStore()
    const result = await task(store)
    await writeStore(store)
    return result
  })
  queue = run.catch(() => undefined)
  return run
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Partial<StoreFile>
    if (!Array.isArray(parsed.users)) throw new Error('formato inválido')
    const store: StoreFile = { version: 1, users: parsed.users }
    ensureSeeded(store)
    return store
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const store: StoreFile = { version: 1, users: [] }
      ensureSeeded(store)
      return store
    }
    throw new ManagedUserError('No se pudo leer el almacén local de usuarios.', 500)
  }
}

async function writeStore(store: StoreFile) {
  await mkdir(STORE_DIR, { recursive: true })
  const temp = `${STORE_PATH}.${process.pid}.tmp`
  await writeFile(temp, JSON.stringify(store, null, 2), 'utf8')
  await rename(temp, STORE_PATH)
}

function ensureSeeded(store: StoreFile) {
  const email = localAdminEmail()
  const name = localAdminName()
  const current = store.users.find((user) => user.id === SEEDED_ADMIN_ID)
  const now = new Date().toISOString()

  if (!current) {
    store.users.unshift({
      id: SEEDED_ADMIN_ID,
      name,
      email,
      phone: '',
      role: 'superadmin',
      status: 'active',
      twoFactorEnabled: false,
      seeded: true,
      passwordHash: null,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    })
    return
  }

  current.seeded = true
  current.role = 'superadmin'
  current.status = 'active'
  if (current.email !== email) current.email = email
  if (current.name !== name) current.name = name
}

function toPublic(user: StoredUser): ManagedUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    twoFactorEnabled: user.twoFactorEnabled,
    seeded: user.seeded,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt$${salt}$${hash}`
}

function verifyPassword(password: string, stored: string | null) {
  if (!stored) return false
  const [scheme, salt, hash] = stored.split('$')
  if (scheme !== 'scrypt' || !salt || !hash) return false
  const expected = Buffer.from(hash, 'hex')
  const actual = scryptSync(password, salt, expected.length)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

function validate(input: ManagedUserInput, requirePassword: boolean) {
  const name = input.name?.trim() ?? ''
  const email = input.email?.trim().toLowerCase() ?? ''
  const phone = input.phone?.trim() ?? ''

  if (name.length < 3) throw new ManagedUserError('Escribe el nombre completo del usuario.')
  if (!isEmail(email)) throw new ManagedUserError('Escribe un correo válido.')
  if (!ROLES.includes(input.role)) throw new ManagedUserError('El rol seleccionado no es válido.')
  if (!STATUSES.includes(input.status)) {
    throw new ManagedUserError('El estado seleccionado no es válido.')
  }

  let passwordHash: string | undefined
  if (requirePassword || input.password) {
    const problem = passwordProblem(input.password ?? '')
    if (problem) throw new ManagedUserError(problem)
    passwordHash = hashPassword(input.password as string)
  }

  return {
    name,
    email,
    phone,
    role: input.role,
    status: input.status,
    twoFactorEnabled: Boolean(input.twoFactorEnabled),
    passwordHash,
  }
}

function assertUniqueEmail(store: StoreFile, email: string, ignoreId?: string) {
  const duplicate = store.users.some((user) => user.email === email && user.id !== ignoreId)
  if (duplicate) throw new ManagedUserError('Ya existe un usuario con este correo.', 409)
}

export function listManagedUsers() {
  return withStore((store) => store.users.map(toPublic))
}

export function createManagedUser(input: ManagedUserInput) {
  return withStore((store) => {
    const data = validate(input, true)
    assertUniqueEmail(store, data.email)
    const now = new Date().toISOString()
    const user: StoredUser = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      twoFactorEnabled: data.twoFactorEnabled,
      seeded: false,
      passwordHash: data.passwordHash as string,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    }
    store.users.push(user)
    return toPublic(user)
  })
}

export function updateManagedUser(id: string, patch: Partial<ManagedUserInput>) {
  return withStore((store) => {
    const user = store.users.find((item) => item.id === id)
    if (!user) throw new ManagedUserError('El usuario no existe.', 404)
    if (user.seeded) {
      throw new ManagedUserError(
        'La cuenta base del superadministrador se configura con variables de entorno.',
        400,
      )
    }

    const data = validate(
      {
        name: patch.name ?? user.name,
        email: patch.email ?? user.email,
        phone: patch.phone ?? user.phone,
        role: patch.role ?? user.role,
        status: patch.status ?? user.status,
        twoFactorEnabled: patch.twoFactorEnabled ?? user.twoFactorEnabled,
        password: patch.password,
      },
      false,
    )

    assertUniqueEmail(store, data.email, id)
    user.name = data.name
    user.email = data.email
    user.phone = data.phone
    user.role = data.role
    user.status = data.status
    user.twoFactorEnabled = data.twoFactorEnabled
    if (data.passwordHash) user.passwordHash = data.passwordHash
    user.updatedAt = new Date().toISOString()
    return toPublic(user)
  })
}

export function deleteManagedUser(id: string) {
  return withStore((store) => {
    const index = store.users.findIndex((user) => user.id === id)
    if (index === -1) throw new ManagedUserError('El usuario no existe.', 404)
    if (store.users[index].seeded) {
      throw new ManagedUserError('La cuenta base del superadministrador no se puede eliminar.')
    }
    store.users.splice(index, 1)
  })
}

export type LocalAuthResult =
  | { ok: true; userId: string }
  | { ok: false; reason: 'invalid' | 'disabled' }

export function authenticateManagedUser(
  email: string,
  password: string
): Promise<LocalAuthResult> {
  const normalized = email.trim().toLowerCase()
  return withStore<LocalAuthResult>((store) => {
    if (normalized === localAdminEmail()) {
      return verifySeededPassword(password)
        ? { ok: true, userId: SEEDED_ADMIN_ID }
        : { ok: false, reason: 'invalid' }
    }
    const user = store.users.find((item) => !item.seeded && item.email === normalized)
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { ok: false, reason: 'invalid' }
    }
    if (user.status === 'disabled') return { ok: false, reason: 'disabled' }
    return { ok: true, userId: user.id }
  })
}

export function touchManagedUserLogin(id: string) {
  return withStore((store) => {
    const user = store.users.find((item) => item.id === id)
    if (!user) return
    const now = new Date().toISOString()
    user.lastLoginAt = now
    user.updatedAt = now
    // La invitación queda aceptada en cuanto la persona ingresa por primera vez.
    if (user.status === 'invited') user.status = 'active'
  })
}

export function managedSessionUser(id: string): Promise<SessionUser | null> {
  return withStore((store) => {
    const user = store.users.find((item) => item.id === id)
    if (!user || user.status === 'disabled') return null
    const role = ROLES.includes(user.role) ? user.role : 'consulta'
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
      roleName: roleLabels[role],
      permissions: rolePermissions[role],
      phone: user.phone || null,
      company: 'F&J Systems S.A.C.',
      status: 'ACTIVE',
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  })
}
