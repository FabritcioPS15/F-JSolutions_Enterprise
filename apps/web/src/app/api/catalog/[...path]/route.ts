import { NextRequest, NextResponse } from 'next/server'

const API_URL = (
  process.env.API_INTERNAL_URL ??
  process.env.HELPDESK_API_URL ??
  'http://localhost:4000/api/v1'
).replace(/\/+$/, '')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params

  if (path[0] !== 'products') {
    return NextResponse.json(
      { success: false, message: 'Recurso no encontrado.' },
      { status: 404 }
    )
  }

  const search = new URL(request.url).searchParams
  search.delete('scope')
  search.delete('status')
  const query = search.toString()

  try {
    const response = await fetch(
      `${API_URL}/${path.map(encodeURIComponent).join('/')}${query ? `?${query}` : ''}`,
      {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(8_000),
      }
    )

    const body = await response.json().catch(() => null)
    return NextResponse.json(
      body ?? { success: false, message: 'La API devolvió una respuesta no válida.' },
      { status: response.status }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: 'El catálogo no está disponible en este momento.' },
      { status: 502 }
    )
  }
}
