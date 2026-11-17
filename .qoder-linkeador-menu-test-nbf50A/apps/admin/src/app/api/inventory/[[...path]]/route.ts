import { NextRequest, NextResponse } from 'next/server'
import { guardPermission } from '@/lib/auth/guard'
import { apiBaseUrl, getAccessToken } from '@/lib/auth/session'

const ALLOWED_SEGMENT = /^[A-Za-z0-9._-]+$/

function buildTargetUrl(request: NextRequest) {
  const segments = request.nextUrl.pathname
    .replace(/^\/api\/inventory\/?/, '')
    .split('/')
    .filter(Boolean)
  if (segments.some((segment) => !ALLOWED_SEGMENT.test(segment))) {
    return null
  }
  const search = request.nextUrl.search || ''
  return `${apiBaseUrl()}/inventory${segments.length ? `/${segments.join('/')}` : ''}${search}`
}

async function forward(request: NextRequest) {
  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'No autorizado: inicia sesión de nuevo.' },
      { status: 401 }
    )
  }

  const target = buildTargetUrl(request)
  if (!target) {
    return NextResponse.json(
      { success: false, message: 'Ruta de inventario no válida.' },
      { status: 400 }
    )
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD'
  const body = hasBody ? await request.text() : undefined

  // Leer existencias es inventory.view; registrar movimientos y ajustes exige
  // inventory.manage. La API repite el check, el proxy solo corta antes.
  const guard = await guardPermission('inventory', hasBody ? 'manage' : 'view')
  if (!guard.ok) return guard.response

  try {
    const response = await fetch(target, {
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
        ? 'La API de inventario tardó demasiado en responder.'
        : 'No se pudo conectar con la API de inventario.'
    return NextResponse.json({ success: false, message }, { status: 502 })
  }
}

export const GET = forward
export const POST = forward
