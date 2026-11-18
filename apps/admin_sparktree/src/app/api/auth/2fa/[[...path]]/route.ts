import { NextRequest, NextResponse } from 'next/server'
import { isCrossOrigin } from '@/lib/auth/bff'
import { apiBaseUrl, getAccessToken } from '@/lib/auth/session'

const ALLOWED_ACTIONS = new Set(['status', 'setup', 'enable', 'disable', 'recovery-codes'])

function targetUrl(request: NextRequest) {
  const action = request.nextUrl.pathname
    .replace(/^\/api\/auth\/2fa\/?/, '')
    .replace(/\/+$/, '')

  if (!ALLOWED_ACTIONS.has(action)) return null
  return `${apiBaseUrl()}/auth/2fa/${action}`
}

async function forward(request: NextRequest) {
  if (isCrossOrigin(request)) {
    return NextResponse.json(
      { success: false, message: 'Origen no autorizado.' },
      { status: 403 },
    )
  }

  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'No autorizado: inicia sesión de nuevo.' },
      { status: 401 },
    )
  }

  const target = targetUrl(request)
  if (!target) {
    return NextResponse.json(
      { success: false, message: 'Acción de seguridad no válida.' },
      { status: 400 },
    )
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD'
  const body = hasBody ? await request.text() : undefined

  try {
    const response = await fetch(target, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
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
        ? 'La API de seguridad tardó demasiado en responder.'
        : 'No se pudo conectar con la API de seguridad.'
    return NextResponse.json({ success: false, message }, { status: 502 })
  }
}

export const GET = forward
export const POST = forward
