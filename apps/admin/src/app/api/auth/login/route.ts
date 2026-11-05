import { NextRequest, NextResponse } from 'next/server'
import { apiBaseUrl, applySessionCookies, applyTwoFactorCookie } from '@/lib/auth/session'
import type { SessionUser } from '@/lib/auth/types'

type ApiLoginResponse = {
  success?: boolean
  message?: string
  data?: {
    user?: SessionUser
    tokens?: {
      accessToken: string
      refreshToken: string
    }
    twoFactorRequired?: boolean
    method?: 'TOTP' | 'EMAIL'
    challengeToken?: string
    expiresAt?: string
    email?: string
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isCrossOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  try {
    return new URL(origin).host !== request.headers.get('host')
  } catch {
    return true
  }
}

export async function POST(request: NextRequest) {
  if (isCrossOrigin(request)) {
    return NextResponse.json(
      { success: false, message: 'Origen no autorizado.' },
      { status: 403 },
    )
  }

  let payload: { email?: unknown; password?: unknown }

  try {
    payload = (await request.json()) as { email?: unknown; password?: unknown }
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 },
    )
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().slice(0, 160) : ''
  const password = typeof payload.password === 'string' ? payload.password : ''

  if (!EMAIL_PATTERN.test(email) || password.length === 0) {
    return NextResponse.json(
      { success: false, message: 'Ingresa tu correo y contraseña.' },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(`${apiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })

    const body = (await response.json().catch(() => null)) as ApiLoginResponse | null

    if (!response.ok || !body?.success || !body.data) {
      const status = response.status === 401 ? 401 : response.status === 503 ? 503 : 502
      return NextResponse.json(
        {
          success: false,
          message:
            status === 401
              ? 'Credenciales incorrectas.'
              : body?.message ?? 'No se pudo iniciar sesión en este momento.',
        },
        { status },
      )
    }

    if (body.data.twoFactorRequired) {
      const method = body.data.method
      if (!body.data.challengeToken || (method !== 'TOTP' && method !== 'EMAIL')) {
        return NextResponse.json(
          { success: false, message: 'La API devolvió un desafío de verificación inválido.' },
          { status: 502 },
        )
      }

      const result = NextResponse.json({
        success: true,
        data: {
          requiresTwoFactor: true,
          method,
          email: body.data.email ?? '',
          expiresAt: body.data.expiresAt ?? null,
        },
      })

      applyTwoFactorCookie(result, body.data.challengeToken)
      return result
    }

    if (!body.data.tokens || !body.data.user) {
      return NextResponse.json(
        { success: false, message: 'No se pudo iniciar sesión en este momento.' },
        { status: 502 },
      )
    }

    const result = NextResponse.json({
      success: true,
      data: { user: body.data.user },
    })

    applySessionCookies(result, body.data.tokens)
    return result
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          'El servicio de autenticación no está disponible. Verifica que la API y la base de datos estén activas.',
      },
      { status: 503 },
    )
  }
}
