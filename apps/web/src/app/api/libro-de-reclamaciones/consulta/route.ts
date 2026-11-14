import { NextRequest, NextResponse } from 'next/server'
import { isEmail } from '@fj-solutions/contracts/domain'
import { lookupComplaint } from '@fj-solutions/contracts/complaints-book'

export const dynamic = 'force-dynamic'

const MAX_REQUESTS = 20
const WINDOW_MS = 10 * 60 * 1000

const attempts = new Map<string, { count: number; resetAt: number }>()

function rateLimited(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'local'
  const now = Date.now()
  const record = attempts.get(ip)
  if (!record || record.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  record.count += 1
  return record.count > MAX_REQUESTS
}

export async function POST(request: NextRequest) {
  if (rateLimited(request)) {
    return NextResponse.json(
      { success: false, message: 'Demasiadas consultas. Espera unos minutos e inténtalo de nuevo.' },
      { status: 429 }
    )
  }

  let payload: { code?: unknown; email?: unknown }

  try {
    payload = (await request.json()) as { code?: unknown; email?: unknown }
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 }
    )
  }

  const code = typeof payload.code === 'string' ? payload.code.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''

  if (code.length < 6) {
    return NextResponse.json(
      { success: false, message: 'Ingresa el código de tu constancia.' },
      { status: 400 }
    )
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { success: false, message: 'Ingresa el correo con el que registraste el reclamo.' },
      { status: 400 }
    )
  }

  try {
    const complaint = await lookupComplaint(code, email)
    if (!complaint) {
      return NextResponse.json(
        {
          success: false,
          message: 'No encontramos un reclamo con ese código y correo. Revisa los datos de tu constancia.',
        },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: complaint })
  } catch (error) {
    console.error('[complaints-book] No se pudo consultar el reclamo:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'No pudimos consultar tu reclamo en este momento. Inténtalo nuevamente.',
      },
      { status: 500 }
    )
  }
}
