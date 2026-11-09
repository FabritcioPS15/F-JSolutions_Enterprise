// Cuentas de clientes de la tienda (server-only).
//
// La tienda las crea y el panel las administra leyendo el mismo archivo, igual
// que el almacén de usuarios del panel: hashes scrypt, escritura serializada y
// reemplazo atómico. El archivo vive fuera de las apps para que ambas lo vean:
// `<repo>/.data/customer-accounts.json` (configurable con FJ_DATA_DIR).

import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { isEmail, passwordProblem } from './domain'

export type CustomerProvider = 'password' | 'google' | 'facebook'
export type CustomerAccountStatus = 'pending' | 'active' | 'blocked'

export type CustomerAccount = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  documentType: 'dni' | 'ruc' | null
  documentNumber: string
  passwordHash: string | null
  googleId: string | null
  facebookId: string | null
  status: CustomerAccountStatus
  emailVerifiedAt: string | null
  verificationTokenHash: string | null
  verificationExpiresAt: string | null
  verificationSentAt: string | null
  marketingConsent: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

export type CustomerAccountPublic = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  documentType: 'dni' | 'ruc' | null
  documentNumber: string
  status: CustomerAccountStatus
  methods: CustomerProvider[]
  emailVerifiedAt: string | null
  verificationSentAt: string | null
  verificationPending: boolean
  marketingConsent: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

export type CustomerSessionUser = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  documentType: 'dni' | 'ruc' | null
  documentNumber: string
  status: 'active'
  emailVerified: boolean
  createdAt: string
}

export type VerificationEmail = {
  accountId: string
  to: string
  name: string
  subject: string
  text: string
  link: string
}

export type OutboxEmail = {
  id: string
  accountId: string
  to: string
  subject: string
  text: string
  link: string
  createdAt: string
  delivery: 'outbox' | 'smtp'
  error?: string
}

export class CustomerAccountError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

type StoreFile = {
  version: 1
  accounts: CustomerAccount[]
}

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000
const OUTBOX_LIMIT = 200

let queue: Promise<unknown> = Promise.resolve()

export function customerDataDir() {
  return process.env.FJ_DATA_DIR ?? path.join(process.cwd(), '..', '..', '.data')
}

export function customerStorePath() {
  return path.join(customerDataDir(), 'customer-accounts.json')
}

export function customerOutboxDir() {
  return path.join(customerDataDir(), 'outbox')
}

export function storeBaseUrl() {
  const base =
    process.env.CUSTOMER_APP_URL ?? process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3000'
  return base.replace(/\/+$/, '')
}

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
    const raw = await readFile(customerStorePath(), 'utf8')
    const parsed = JSON.parse(raw) as Partial<StoreFile>
    if (!Array.isArray(parsed.accounts)) throw new Error('formato inválido')
    return { version: 1, accounts: parsed.accounts }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { version: 1, accounts: [] }
    }
    throw new CustomerAccountError('No se pudo leer el registro de cuentas web.', 500)
  }
}

async function writeStore(store: StoreFile) {
  const dir = customerDataDir()
  await mkdir(dir, { recursive: true })
  const target = customerStorePath()
  const temp = `${target}.${process.pid}.tmp`
  await writeFile(temp, JSON.stringify(store, null, 2), 'utf8')
  await rename(temp, target)
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

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function methodsOf(account: CustomerAccount): CustomerProvider[] {
  const methods: CustomerProvider[] = []
  if (account.passwordHash) methods.push('password')
  if (account.googleId) methods.push('google')
  if (account.facebookId) methods.push('facebook')
  return methods
}

function toPublic(account: CustomerAccount): CustomerAccountPublic {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    company: account.company,
    documentType: account.documentType,
    documentNumber: account.documentNumber,
    status: account.status,
    methods: methodsOf(account),
    emailVerifiedAt: account.emailVerifiedAt,
    verificationSentAt: account.verificationSentAt,
    verificationPending: !account.emailVerifiedAt,
    marketingConsent: account.marketingConsent,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    lastLoginAt: account.lastLoginAt,
  }
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function validateProfile(input: { name: string; email: string; phone?: string }) {
  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  if (name.length < 3) throw new CustomerAccountError('Escribe tu nombre completo.')
  if (!isEmail(email)) throw new CustomerAccountError('Escribe un correo válido.')
  return { name, email, phone: (input.phone ?? '').trim() }
}

function issueToken(account: CustomerAccount, store: StoreFile) {
  const token = randomBytes(32).toString('base64url')
  const now = new Date()
  account.verificationTokenHash = hashToken(token)
  account.verificationExpiresAt = new Date(now.getTime() + VERIFICATION_TTL_MS).toISOString()
  account.verificationSentAt = now.toISOString()
  account.updatedAt = now.toISOString()
  const index = store.accounts.findIndex((item) => item.id === account.id)
  if (index >= 0) store.accounts[index] = account
  return token
}

function verificationEmail(account: CustomerAccount, token: string): VerificationEmail {
  const link = `${storeBaseUrl()}/api/customer/verify?token=${encodeURIComponent(token)}`
  return {
    accountId: account.id,
    to: account.email,
    name: account.name,
    subject: 'Confirma tu cuenta de F&J Systems',
    text: [
      `Hola ${account.name},`,
      '',
      'Recibimos tu registro en la tienda de F&J Systems. Confirma tu correo para activar la cuenta:',
      link,
      '',
      'El enlace vence en 24 horas. Si no creaste esta cuenta, puedes ignorar este mensaje.',
    ].join('\n'),
    link,
  }
}

// ─── Consultas ───────────────────────────────────────────────────────────────

export function listCustomerAccounts(): Promise<CustomerAccountPublic[]> {
  return withStore((store) =>
    store.accounts
      .map(toPublic)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  )
}

export function getCustomerAccount(id: string): Promise<CustomerAccountPublic | null> {
  return withStore((store) => {
    const account = store.accounts.find((item) => item.id === id)
    return account ? toPublic(account) : null
  })
}

export function customerSessionUser(id: string): Promise<CustomerSessionUser | null> {
  return withStore((store) => {
    const account = store.accounts.find((item) => item.id === id)
    if (!account || account.status !== 'active' || !account.emailVerifiedAt) return null
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      phone: account.phone,
      company: account.company,
      documentType: account.documentType,
      documentNumber: account.documentNumber,
      status: 'active' as const,
      emailVerified: true,
      createdAt: account.createdAt,
    }
  })
}

// ─── Alta y verificación ─────────────────────────────────────────────────────

export type RegisterCustomerInput = {
  name: string
  email: string
  phone?: string
  company?: string
  documentType?: 'dni' | 'ruc' | null
  documentNumber?: string
  password: string
  marketingConsent?: boolean
}

export function registerCustomerAccount(
  input: RegisterCustomerInput
): Promise<{ account: CustomerAccountPublic; email: VerificationEmail }> {
  const { name, email, phone } = validateProfile(input)
  const problem = passwordProblem(input.password)
  if (problem) throw new CustomerAccountError(problem)

  return withStore((store) => {
    const existing = store.accounts.find((item) => item.email === email)
    if (existing) {
      if (existing.status === 'blocked') {
        throw new CustomerAccountError(
          'Esta cuenta está bloqueada. Escríbenos para revisar tu caso.',
          403
        )
      }
      if (existing.emailVerifiedAt) {
        throw new CustomerAccountError(
          'Ese correo ya tiene una cuenta. Inicia sesión o recupera tu acceso.',
          409
        )
      }
      // Regeneramos el enlace, pero no tocamos la contraseña: solo el dueño del
      // correo puede confirmar la cuenta.
      const token = issueToken(existing, store)
      return { account: toPublic(existing), email: verificationEmail(existing, token) }
    }

    const now = new Date().toISOString()
    const account: CustomerAccount = {
      id: randomUUID(),
      name,
      email,
      phone,
      company: (input.company ?? '').trim(),
      documentType: input.documentType ?? null,
      documentNumber: (input.documentNumber ?? '').trim(),
      passwordHash: hashPassword(input.password),
      googleId: null,
      facebookId: null,
      status: 'pending',
      emailVerifiedAt: null,
      verificationTokenHash: null,
      verificationExpiresAt: null,
      verificationSentAt: null,
      marketingConsent: Boolean(input.marketingConsent),
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    }
    store.accounts.push(account)
    const token = issueToken(account, store)
    return { account: toPublic(account), email: verificationEmail(account, token) }
  })
}

export type VerifyResult =
  | { ok: true; account: CustomerAccountPublic }
  | { ok: false; reason: 'invalid' | 'expired' }

export function verifyCustomerEmail(token: string): Promise<VerifyResult> {
  const tokenHash = hashToken(token)
  return withStore((store) => {
    const account = store.accounts.find((item) => item.verificationTokenHash === tokenHash)
    if (!account) return { ok: false, reason: 'invalid' }
    if (!account.verificationExpiresAt || new Date(account.verificationExpiresAt) < new Date()) {
      return { ok: false, reason: 'expired' }
    }
    const now = new Date().toISOString()
    account.emailVerifiedAt = now
    account.status = 'active'
    account.verificationTokenHash = null
    account.verificationExpiresAt = null
    account.updatedAt = now
    return { ok: true, account: toPublic(account) }
  })
}

export function resendCustomerVerification(
  id: string
): Promise<{ account: CustomerAccountPublic; email: VerificationEmail }> {
  return withStore((store) => {
    const account = store.accounts.find((item) => item.id === id)
    if (!account) throw new CustomerAccountError('La cuenta no existe.', 404)
    if (account.emailVerifiedAt) {
      throw new CustomerAccountError('Ese correo ya está confirmado.', 409)
    }
    if (account.status === 'blocked') {
      throw new CustomerAccountError('La cuenta está bloqueada.', 403)
    }
    const token = issueToken(account, store)
    return { account: toPublic(account), email: verificationEmail(account, token) }
  })
}

export function resendCustomerVerificationByEmail(
  email: string
): Promise<VerificationEmail | null> {
  const normalized = normalizeEmail(email)
  return withStore((store) => {
    const account = store.accounts.find((item) => item.email === normalized)
    if (!account || account.emailVerifiedAt || account.status === 'blocked') return null
    const token = issueToken(account, store)
    return verificationEmail(account, token)
  })
}

// ─── Acceso ──────────────────────────────────────────────────────────────────

export type CustomerAuthResult =
  | { ok: true; account: CustomerAccountPublic }
  | { ok: false; reason: 'invalid' | 'unverified' | 'blocked' }

export function authenticateCustomer(
  email: string,
  password: string
): Promise<CustomerAuthResult> {
  const normalized = normalizeEmail(email)
  return withStore((store) => {
    const account = store.accounts.find((item) => item.email === normalized)
    if (!account || !verifyPassword(password, account.passwordHash)) {
      return { ok: false, reason: 'invalid' }
    }
    if (account.status === 'blocked') return { ok: false, reason: 'blocked' }
    if (!account.emailVerifiedAt) return { ok: false, reason: 'unverified' }
    const now = new Date().toISOString()
    account.lastLoginAt = now
    account.updatedAt = now
    return { ok: true, account: toPublic(account) }
  })
}

export type ProviderProfile = {
  provider: 'google' | 'facebook'
  providerId: string
  email: string
  name: string
}

export function loginWithProvider(profile: ProviderProfile): Promise<{
  account: CustomerAccountPublic
  email: VerificationEmail | null
}> {
  const email = normalizeEmail(profile.email)
  if (!isEmail(email)) {
    throw new CustomerAccountError(
      `Tu cuenta de ${profile.provider === 'google' ? 'Google' : 'Facebook'} no comparte un correo válido.`,
      422
    )
  }

  return withStore((store) => {
    const idField = profile.provider === 'google' ? 'googleId' : 'facebookId'
    const now = new Date().toISOString()

    let account = store.accounts.find((item) => item[idField] === profile.providerId)
    if (!account) account = store.accounts.find((item) => item.email === email)

    if (account) {
      if (account.status === 'blocked') {
        throw new CustomerAccountError('Esta cuenta está bloqueada. Escríbenos para revisar tu caso.', 403)
      }
      account[idField] = profile.providerId
      account.emailVerifiedAt = account.emailVerifiedAt ?? now
      account.status = 'active'
      if (!account.name && profile.name) account.name = profile.name
      account.lastLoginAt = now
      account.updatedAt = now
      return { account: toPublic(account), email: null }
    }

    account = {
      id: randomUUID(),
      name: profile.name.trim() || email.split('@')[0],
      email,
      phone: '',
      company: '',
      documentType: null,
      documentNumber: '',
      passwordHash: null,
      googleId: profile.provider === 'google' ? profile.providerId : null,
      facebookId: profile.provider === 'facebook' ? profile.providerId : null,
      status: 'active',
      emailVerifiedAt: now,
      verificationTokenHash: null,
      verificationExpiresAt: null,
      verificationSentAt: null,
      marketingConsent: false,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    }
    store.accounts.push(account)
    return { account: toPublic(account), email: null }
  })
}

// ─── Administración desde el panel ───────────────────────────────────────────

export function setCustomerStatus(
  id: string,
  status: Exclude<CustomerAccountStatus, 'pending'>
): Promise<CustomerAccountPublic> {
  return withStore((store) => {
    const account = store.accounts.find((item) => item.id === id)
    if (!account) throw new CustomerAccountError('La cuenta no existe.', 404)
    if (status === 'active' && !account.emailVerifiedAt) {
      throw new CustomerAccountError(
        'Confirma el correo antes de activar la cuenta o usa "Verificar manualmente".',
        409
      )
    }
    account.status = status
    account.updatedAt = new Date().toISOString()
    return toPublic(account)
  })
}

export function verifyCustomerManually(id: string): Promise<CustomerAccountPublic> {
  return withStore((store) => {
    const account = store.accounts.find((item) => item.id === id)
    if (!account) throw new CustomerAccountError('La cuenta no existe.', 404)
    const now = new Date().toISOString()
    account.emailVerifiedAt = account.emailVerifiedAt ?? now
    account.status = 'active'
    account.verificationTokenHash = null
    account.verificationExpiresAt = null
    account.updatedAt = now
    return toPublic(account)
  })
}

// ─── Bandeja de salida local ─────────────────────────────────────────────────

function outboxFileName() {
  return `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}.json`
}

export async function recordOutboxEmail(
  email: VerificationEmail,
  delivery: 'outbox' | 'smtp',
  error?: string
): Promise<OutboxEmail> {
  const dir = customerOutboxDir()
  await mkdir(dir, { recursive: true })
  const record: OutboxEmail = {
    id: randomUUID(),
    accountId: email.accountId,
    to: email.to,
    subject: email.subject,
    text: email.text,
    link: email.link,
    createdAt: new Date().toISOString(),
    delivery,
    ...(error ? { error } : {}),
  }
  await writeFile(path.join(dir, outboxFileName()), JSON.stringify(record, null, 2), 'utf8')
  await pruneOutbox(dir)
  return record
}

async function pruneOutbox(dir: string) {
  try {
    const files = (await readdir(dir)).filter((file) => file.endsWith('.json')).sort()
    for (const file of files.slice(0, Math.max(0, files.length - OUTBOX_LIMIT))) {
      await unlink(path.join(dir, file))
    }
  } catch {
    // La bandeja es solo una ayuda local; un fallo aquí no bloquea el registro.
  }
}

export async function listOutboxEmails(limit = 50): Promise<OutboxEmail[]> {
  try {
    const files = (await readdir(customerOutboxDir()))
      .filter((file) => file.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, limit)
    const records = await Promise.all(
      files.map(async (file) => {
        try {
          const raw = await readFile(path.join(customerOutboxDir(), file), 'utf8')
          if (!raw.trim()) return null
          return JSON.parse(raw) as OutboxEmail
        } catch {
          return null
        }
      })
    )
    return records.filter((record): record is OutboxEmail => record !== null)
  } catch {
    return []
  }
}
