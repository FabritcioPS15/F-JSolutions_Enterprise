import { NextRequest, NextResponse } from 'next/server'
import { isCrossOrigin } from '@/lib/auth/bff'
import { apiBaseUrl, getTwoFactorToken } from '@/lib/auth/session'

type ApiResendResponse = {
  success?: boolean
  message?: string
  data?: {
    email?: string
    expiresAt?: string
    delivered?: boolean
  }
}

export async function POST(request: NextRequest) {
  if (isCrossOrigin(request)) {
    return NextResponse.json(
      { success: false, message: 'Origen no autorizado.' },
      { status: 403 },
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
    const response = await fetch(`${apiBaseUrl()}/auth/2fa/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeToken }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })

    const body = (await response.json().catch(() => null)) as ApiResendResponse | null

    if (!response.ok || !body?.success) {
      const status =
        response.status === 401 ? 401 : response.status === 429 ? 429 : 502
      return NextResponse.json(
        {
          success: false,
          message:
            status === 429
              ? 'Espera unos segundos antes de solicitar otro código.'
              : body?.message ?? 'No se pudo reenviar el código.',
        },
        { status },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        email: body.data?.email ?? '',
        expiresAt: body.data?.expiresAt ?? null,
        delivered: Boolean(body.data?.delivered),
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'No se pudo conectar con el servicio de autenticación.' },
      { status: 503 },
    )
  }
}
