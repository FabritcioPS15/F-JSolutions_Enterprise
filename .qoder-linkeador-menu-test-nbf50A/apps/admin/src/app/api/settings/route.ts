import { NextRequest, NextResponse } from 'next/server'
import { guardPermission } from '@/lib/auth/guard'
import { apiBaseUrl, getAccessToken } from '@/lib/auth/session'

async function forward(request: NextRequest) {
  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'No autorizado: inicia sesión de nuevo.' },
      { status: 401 }
    )
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD'
  const body = hasBody ? await request.text() : undefined

  // Ver la tienda es settings.view; guardarla es settings.update.
  const guard = await guardPermission('settings', hasBody ? 'update' : 'view')
  if (!guard.ok) return guard.response

  try {
    const response = await fetch(`${apiBaseUrl()}/settings`, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })

    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') ?? 'application/json',
      },
    })
  } catch (error) {
    const message =
      error instanceof Error && error.name === 'TimeoutError'
        ? 'La API de configuración tardó demasiado en responder.'
        : 'No se pudo conectar con la API de configuración.'
    return NextResponse.json({ success: false, message }, { status: 502 })
  }
}

export const GET = forward
export const PUT = forward
