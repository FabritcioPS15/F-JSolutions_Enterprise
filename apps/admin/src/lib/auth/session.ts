import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import type { SessionUser } from './types'

export const ACCESS_COOKIE = 'fj_admin_access'
export const REFRESH_COOKIE = 'fj_admin_refresh'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

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

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await getAccessToken()
  if (!token) return null

  try {
    const response = await fetch(`${apiBaseUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    })

    if (!response.ok) return null

    const body = (await response.json().catch(() => null)) as
      | { success?: boolean; data?: SessionUser }
      | null

    return body?.success && body.data ? body.data : null
  } catch {
    return null
  }
}

export function applySessionCookies(response: NextResponse, tokens: AuthTokens) {
  const secure = process.env.NODE_ENV === 'production'

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

export function clearSessionCookies(response: NextResponse) {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE]) {
    response.cookies.set({
      name,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    })
  }
}
