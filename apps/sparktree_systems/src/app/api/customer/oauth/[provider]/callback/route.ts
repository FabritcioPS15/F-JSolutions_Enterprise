import { loginWithProvider } from '@fj-solutions/contracts/customer-accounts'
import { NextRequest, NextResponse } from 'next/server'
import {
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_PATH,
  exchangeCode,
  type OAuthProvider,
} from '@/lib/customer/oauth'
import { safeNextPath } from '@/lib/customer/http'
import { applyCustomerSessionCookie } from '@/lib/customer/session'

type StoredState = { state: string; provider: OAuthProvider; next: string }

function asProvider(value: string): OAuthProvider | null {
  return value === 'google' || value === 'facebook' ? value : null
}

function cleanup(response: NextResponse) {
  response.cookies.set({
    name: OAUTH_STATE_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: OAUTH_STATE_PATH,
    maxAge: 0,
  })
  return response
}

function fail(origin: string, motivo: string, provider?: string) {
  const target = new URL('/login', origin)
  target.searchParams.set('oauth', 'error')
  target.searchParams.set('motivo', motivo)
  if (provider) target.searchParams.set('proveedor', provider)
  return cleanup(NextResponse.redirect(target, 303))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const provider = asProvider((await params).provider)
  const url = new URL(request.url)
  const origin = url.origin

  if (!provider) return fail(origin, 'proveedor')

  if (url.searchParams.get('error')) return fail(origin, 'cancelado', provider)

  const code = url.searchParams.get('code') ?? ''
  const state = url.searchParams.get('state') ?? ''
  if (!code || !state) return fail(origin, 'estado', provider)

  const rawCookie = request.cookies.get(OAUTH_STATE_COOKIE)?.value
  let stored: StoredState | null = null
  try {
    stored = rawCookie
      ? (JSON.parse(Buffer.from(rawCookie, 'base64url').toString('utf8')) as StoredState)
      : null
  } catch {
    stored = null
  }

  if (!stored || stored.state !== state || stored.provider !== provider) {
    return fail(origin, 'estado', provider)
  }

  try {
    const profile = await exchangeCode(provider, code, origin)
    const { account } = await loginWithProvider(profile)

    const response = NextResponse.redirect(new URL(safeNextPath(stored.next), origin), 303)
    applyCustomerSessionCookie(response, account.id)
    return cleanup(response)
  } catch (error) {
    const status = (error as { status?: number }).status
    if (status === 403) return fail(origin, 'bloqueada', provider)
    if (status === 422) return fail(origin, 'sin-correo', provider)
    console.error('[customer-oauth] Falló el acceso con el proveedor:', error)
    return fail(origin, 'fallo', provider)
  }
}
