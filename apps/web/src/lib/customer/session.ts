import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import {
  customerSessionUser,
  type CustomerSessionUser,
} from '@fj-solutions/contracts/customer-accounts'

// Sesión de la tienda: cookie HttpOnly firmada con el id de la cuenta. Los
// permisos y el estado se resuelven contra el registro de cuentas en cada
// lectura, así que bloquear una cuenta corta el acceso al instante.
const SESSION_SECRET =
  process.env.CUSTOMER_SESSION_SECRET ??
  process.env.ADMIN_SESSION_SECRET ??
  'fj-customer-local-session-2026'

export const CUSTOMER_COOKIE = 'fj_customer_session'
export const CUSTOMER_SESSION_MAX_AGE = 60 * 60 * 24 * 7

function sign(payload: string) {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function createCustomerSessionToken(accountId: string) {
  const payload = Buffer.from(
    JSON.stringify({ sub: accountId, exp: Date.now() + CUSTOMER_SESSION_MAX_AGE * 1000 })
  ).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export async function getCustomerSession(): Promise<CustomerSessionUser | null> {
  const token = (await cookies()).get(CUSTOMER_COOKIE)?.value
  if (!token) return null

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
    return await customerSessionUser(data.sub)
  } catch {
    return null
  }
}

export function applyCustomerSessionCookie(response: NextResponse, accountId: string) {
  response.cookies.set({
    name: CUSTOMER_COOKIE,
    value: createCustomerSessionToken(accountId),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: CUSTOMER_SESSION_MAX_AGE,
  })
}

export function clearCustomerSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: CUSTOMER_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}
