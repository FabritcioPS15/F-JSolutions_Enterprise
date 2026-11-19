import { randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import {
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_PATH,
  buildAuthorizeUrl,
  isProviderConfigured,
  type OAuthProvider,
} from '@/lib/customer/oauth'
import { safeNextPath } from '@/lib/customer/http'

function asProvider(value: string): OAuthProvider | null {
  return value === 'google' || value === 'facebook' ? value : null
}

// Inicia el flujo OAuth: guarda el state en una cookie HttpOnly y envía al
// proveedor. Ningún dato de la cuenta se toma del navegador al volver.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const provider = asProvider((await params).provider)
  const origin = new URL(request.url).origin

  if (!provider) {
    return NextResponse.redirect(new URL('/login?oauth=error&motivo=proveedor', origin), 303)
  }
  if (!isProviderConfigured(provider)) {
    return NextResponse.redirect(
      new URL(`/login?oauth=error&motivo=sin-configurar&proveedor=${provider}`, origin),
      303
    )
  }

  const { searchParams } = new URL(request.url)
  const next = safeNextPath(searchParams.get('next'))
  const state = randomBytes(24).toString('base64url')

  const response = NextResponse.redirect(
    buildAuthorizeUrl(provider, origin, state),
    303
  )
  response.cookies.set({
    name: OAUTH_STATE_COOKIE,
    value: Buffer.from(JSON.stringify({ state, provider, next })).toString('base64url'),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: OAUTH_STATE_PATH,
    maxAge: 10 * 60,
  })
  return response
}
