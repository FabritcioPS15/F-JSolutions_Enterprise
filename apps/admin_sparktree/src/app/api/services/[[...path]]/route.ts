import { NextRequest, NextResponse } from 'next/server'
import { actionForMethod } from '@/lib/admin/access'
import { guardPermission } from '@/lib/auth/guard'
import { apiBaseUrl, getAccessToken } from '@/lib/auth/session'

const ALLOWED_SEGMENT = /^[A-Za-z0-9._-]+$/

function buildTargetUrl(request: NextRequest) {
  const segments = request.nextUrl.pathname
    .replace(/^\/api\/services\/?/, '')
    .split('/')
    .filter(Boolean)
  if (segments.some((segment) => !ALLOWED_SEGMENT.test(segment))) {
    return null
  }
  const base = apiBaseUrl()
  const search = request.nextUrl.search || ''
  return `${base}/services${segments.length ? `/${segments.join('/')}` : ''}${search}`
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
      { success: false, message: 'Ruta de servicios no válida.' },
      { status: 400 }
    )
  }

  const method = request.method
  const hasBody = method !== 'GET' && method !== 'HEAD'
  const body = hasBody ? await request.text() : undefined

  // Publicar o despublicar un servicio lo decide la API; el proxy solo aplica el
  // permiso grueso del verbo.
  const guard = await guardPermission('services', actionForMethod(method))
  if (!guard.ok) return guard.response

  try {
    const response = await fetch(target, {
      method,
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
        ? 'La API de servicios tardó demasiado en responder.'
        : 'No se pudo conectar con la API de servicios.'
    return NextResponse.json({ success: false, message }, { status: 502 })
  }
}

export const GET = forward
export const POST = forward
export const PUT = forward
export const PATCH = forward
export const DELETE = forward
