import { NextResponse } from 'next/server'

const API_URL = (process.env.HELPDESK_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/+$/, '')
const ADMIN_KEY = process.env.HELPDESK_ADMIN_KEY ?? 'dev-helpdesk-key-change-me'

export async function proxyHelpdesk(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('x-admin-key', ADMIN_KEY)
  if (init.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }

  try {
    const response = await fetch(`${API_URL}/helpdesk${path}`, {
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
