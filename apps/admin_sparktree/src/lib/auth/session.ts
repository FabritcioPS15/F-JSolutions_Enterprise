import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'
import { LOCAL_SESSION_MAX_AGE, readLocalSession } from './local-auth'
import type { SessionUser } from './types'

export const ACCESS_COOKIE = 'fj_admin_access'
export const REFRESH_COOKIE = 'fj_admin_refresh'
export const TWO_FACTOR_COOKIE = 'fj_admin_2fa'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7
const TWO_FACTOR_MAX_AGE = 60 * 10

type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export function apiBaseUrl() {
  const base =
    process.env.API_INTERNAL_URL ??
    process.env.HELPDESK_API_URL ??
    'http://localhost:4000/api/v1'

  return base.replace(/\/+$/, '')
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null
}

export async function getTwoFactorToken() {
  return (await cookies()).get(TWO_FACTOR_COOKIE)?.value ?? null
}

export function applyTwoFactorCookie(response: NextResponse, challengeToken: string) {
  response.cookies.set({
    name: TWO_FACTOR_COOKIE,
    value: challengeToken,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TWO_FACTOR_MAX_AGE,
  })
}

export function clearTwoFactorCookie(response: NextResponse, secure?: boolean) {
  response.cookies.set({
    name: TWO_FACTOR_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: secure ?? process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await getAccessToken()
  if (!token) return null

  // Sesión local: se valida la firma de la cookie sin consultar la API.
  return readLocalSession(token)
}

// La cookie Secure solo se acepta por HTTPS; en despliegues con NODE_ENV=production
// servidos por HTTP el navegador la descarta y la sesión nunca queda iniciada.
export function isSecureRequest(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-proto')
  if (forwarded) return forwarded.split(',')[0].trim() === 'https'
  return request.nextUrl.protocol === 'https:'
}

export function applyLocalSessionCookie(
  response: NextResponse,
  token: string,
  options: { secure?: boolean } = {},
) {
  const secure = options.secure ?? process.env.NODE_ENV === 'production'
  clearTwoFactorCookie(response, secure)

  response.cookies.set({
    name: ACCESS_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: LOCAL_SESSION_MAX_AGE,
  })
}

export function applySessionCookies(response: NextResponse, tokens: AuthTokens) {
  const secure = process.env.NODE_ENV === 'production'

  clearTwoFactorCookie(response)

  response.cookies.set({
    name: ACCESS_COOKIE,
    value: tokens.accessToken,
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  response.cookies.set({
    name: REFRESH_COOKIE,
    value: tokens.refreshToken,
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export function clearSessionCookies(response: NextResponse, secure?: boolean) {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, TWO_FACTOR_COOKIE]) {
    response.cookies.set({
      name,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: secure ?? process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    })
  }
}
