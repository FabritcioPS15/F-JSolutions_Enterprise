import { NextRequest, NextResponse } from 'next/server'
import { isCrossOrigin, readText } from '@/lib/auth/bff'
import { apiBaseUrl, applySessionCookies, getTwoFactorToken } from '@/lib/auth/session'
import type { SessionUser } from '@/lib/auth/types'

type ApiVerifyResponse = {
  success?: boolean
  message?: string
  data?: {
    user?: SessionUser
    tokens?: {
      accessToken: string
      refreshToken: string
    }
  }
}

export async function POST(request: NextRequest) {
  if (isCrossOrigin(request)) {
    return NextResponse.json(
      { success: false, message: 'Origen no autorizado.' },
      { status: 403 },
    )
  }

  let payload: { code?: unknown; recoveryCode?: unknown }
  try {
    payload = (await request.json()) as { code?: unknown; recoveryCode?: unknown }
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 },
    )
  }

  const code = readText(payload.code, 6)
  const recoveryCode = readText(payload.recoveryCode, 20)
  const hasCode = /^\d{6}$/.test(code)
  const hasRecoveryCode = /^[A-Za-z0-9-]{8,20}$/.test(recoveryCode)

  if (!hasCode && !hasRecoveryCode) {
    return NextResponse.json(
      { success: false, message: 'Ingresa un código de 6 dígitos o un código de recuperación.' },
      { status: 400 },
    )
  }

  const challengeToken = await getTwoFactorToken()
  if (!challengeToken) {
    return NextResponse.json(
      { success: false, message: 'La verificación expiró. Inicia sesión nuevamente.' },
      { status: 401 },
    )
  }

  try {
    const response = await fetch(`${apiBaseUrl()}/auth/2fa/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        hasCode ? { challengeToken, code } : { challengeToken, recoveryCode }
      ),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })

    const body = (await response.json().catch(() => null)) as ApiVerifyResponse | null

    if (!response.ok || !body?.success || !body.data?.tokens || !body.data.user) {
      const status =
        response.status === 401
          ? 401
          : response.status === 429
            ? 429
            : response.status === 400 || response.status === 422
              ? 400
              : 502
      return NextResponse.json(
        {
          success: false,
          message:
            status === 401
              ? 'El código es incorrecto o expiró. Inténtalo nuevamente.'
              : body?.message ?? 'No se pudo completar la verificación en dos pasos.',
        },
        { status },
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
