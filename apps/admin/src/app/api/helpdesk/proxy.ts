import { NextResponse } from 'next/server'
import { apiBaseUrl, getAccessToken } from '@/lib/auth/session'

export async function proxyHelpdesk(path: string, init: RequestInit = {}) {
  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'La sesión no es válida. Inicia sesión nuevamente.' },
      { status: 401 },
    )
  }

  const headers = new Headers(init.headers)
  headers.set('authorization', `Bearer ${token}`)
  if (init.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }

  try {
    const response = await fetch(`${apiBaseUrl()}/helpdesk${path}`, {
      ...init,
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    const data = (await response.json().catch(() => null)) ?? {
      success: false,
      message: 'La API devolvió una respuesta no válida.',
    }
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          'No se pudo conectar con la API de la mesa de ayuda. Verifica que el servicio esté activo.',
      },
      { status: 502 },
    )
  }
}
