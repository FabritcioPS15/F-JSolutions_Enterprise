import { CustomerAccountError } from '@fj-solutions/contracts/customer-accounts'
import { NextRequest, NextResponse } from 'next/server'

// Utilidades compartidas por las rutas de la tienda: mismo origen, lectura de
// JSON y traducción de errores del registro de cuentas a respuestas HTTP.

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    return new URL(origin).host === request.headers.get('host')
  } catch {
    return false
  }
}

export async function readJson(request: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const data = (await request.json()) as unknown
    return data && typeof data === 'object' ? (data as Record<string, unknown>) : null
  } catch {
    return null
  }
}

export function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function failure(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

export function handleAccountError(error: unknown) {
  if (error instanceof CustomerAccountError) {
    return failure(error.message, error.status)
  }
  console.error('[customer-accounts] Error inesperado:', error)
  return failure('No pudimos completar la operación. Inténtalo nuevamente.', 500)
}

export function clientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'desconocida'
  return request.headers.get('x-real-ip') ?? 'desconocida'
}

export function safeNextPath(value: unknown, fallback = '/mi-cuenta') {
  const candidate = typeof value === 'string' ? value : ''
  if (!candidate.startsWith('/') || candidate.startsWith('//')) return fallback
  return candidate
}
