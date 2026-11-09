import { createHmac, timingSafeEqual } from 'node:crypto'
import type { SessionUser } from './types'
import { authenticateManagedUser, managedSessionUser } from './user-store'

// La sesión local se firma en el servidor de Next y se guarda en una cookie
// HttpOnly. El token solo lleva el identificador del usuario; sus permisos se
// resuelven contra el almacén de usuarios en cada lectura.
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ?? 'fj-admin-local-session-secret-2026'

export const LOCAL_SESSION_MAX_AGE = 60 * 60 * 24 * 7

function sign(payload: string) {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function authenticateLocalUser(email: string, password: string) {
  return authenticateManagedUser(email, password)
}

export function createLocalSessionToken(userId: string) {
  const payload = Buffer.from(
    JSON.stringify({ sub: userId, exp: Date.now() + LOCAL_SESSION_MAX_AGE * 1000 })
  ).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export async function readLocalSession(token: string): Promise<SessionUser | null> {
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  if (!safeEqual(signature, sign(payload))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: unknown
      exp?: unknown
    }
    if (typeof data.sub !== 'string' || typeof data.exp !== 'number' || data.exp <= Date.now()) {
      return null
    }
    return await managedSessionUser(data.sub)
  } catch {
    return null
  }
}
