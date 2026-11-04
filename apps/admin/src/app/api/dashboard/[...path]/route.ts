import { NextRequest, NextResponse } from 'next/server'
import { apiBaseUrl, getAccessToken } from '@/lib/auth/session'

const ALLOWED_SEGMENT = /^[A-Za-z0-9._-]+$/
const REPORT_RESOURCES = new Set(['sales', 'helpdesk'])

function buildTargetUrl(request: NextRequest) {
  const segments = request.nextUrl.pathname.replace(/^\/api\/dashboard\/?/, '').split('/')
  const valid =
    segments.length > 0 &&
    segments.every((segment) => ALLOWED_SEGMENT.test(segment)) &&
    (segments[0] === 'summary' ||
      (segments[0] === 'reports' && segments.length === 2 && REPORT_RESOURCES.has(segments[1])))

  if (!valid) return null

  const base = apiBaseUrl()
  const search = request.nextUrl.search || ''
  return `${base}/dashboard/${segments.join('/')}${search}`
}

export async function GET(request: NextRequest) {
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
      { success: false, message: 'Ruta de reportes no válida.' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(target, {
      headers: { Authorization: `Bearer ${token}` },
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
        ? 'La API de reportes tardó demasiado en responder.'
        : 'No se pudo conectar con la API de reportes.'
    return NextResponse.json({ success: false, message }, { status: 502 })
  }
}
