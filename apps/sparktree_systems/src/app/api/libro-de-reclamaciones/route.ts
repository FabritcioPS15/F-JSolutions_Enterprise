import { NextRequest, NextResponse } from 'next/server'
import {
  ComplaintError,
  complaintDeadlineDays,
  createComplaint,
  type CreateComplaintInput,
} from '@fj-solutions/contracts/complaints-book'

export const dynamic = 'force-dynamic'

const MAX_REQUESTS = 6
const WINDOW_MS = 10 * 60 * 1000

const attempts = new Map<string, { count: number; resetAt: number }>()

function tooManyRequests(request: NextRequest) {
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
  if (tooManyRequests(request)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Recibimos varios intentos desde tu conexión. Espera unos minutos e inténtalo de nuevo.',
      },
      { status: 429 }
    )
  }

  let payload: Partial<CreateComplaintInput>

  try {
    payload = (await request.json()) as Partial<CreateComplaintInput>
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 }
    )
  }

  try {
    const complaint = await createComplaint(payload as CreateComplaintInput)
    return NextResponse.json(
      {
        success: true,
        message: 'Reclamo registrado correctamente.',
        data: {
          code: complaint.code,
          createdAt: complaint.createdAt,
          dueAt: complaint.dueAt,
          deadlineDays: complaintDeadlineDays(),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ComplaintError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status })
    }
    console.error('[complaints-book] No se pudo registrar el reclamo:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'No pudimos registrar tu reclamo en este momento. Inténtalo nuevamente.',
      },
      { status: 500 }
    )
  }
}
