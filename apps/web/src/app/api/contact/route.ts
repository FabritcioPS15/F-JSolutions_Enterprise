import { NextRequest, NextResponse } from 'next/server'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactPayload = {
  name?: unknown
  company?: unknown
  email?: unknown
  phone?: unknown
  topic?: unknown
  message?: unknown
}

function asTrimmedString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

export async function POST(request: NextRequest) {
  let payload: ContactPayload

  try {
    payload = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 },
    )
  }

  const name = asTrimmedString(payload.name, 120)
  const email = asTrimmedString(payload.email, 160)
  const company = asTrimmedString(payload.company, 160)
  const phone = asTrimmedString(payload.phone, 40)
  const topic = asTrimmedString(payload.topic, 60)
  const message = asTrimmedString(payload.message, 4000)

  if (name.length < 2) {
    return NextResponse.json(
      { success: false, message: 'Necesitamos tu nombre para responder.' },
      { status: 400 },
    )
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { success: false, message: 'Ingresa un correo electrónico válido.' },
      { status: 400 },
    )
  }

  if (message.length < 10) {
    return NextResponse.json(
      { success: false, message: 'Cuéntanos un poco más sobre tu necesidad.' },
      { status: 400 },
    )
  }

  // TODO: Reemplazar el log por el envío real (Resend, Nodemailer, CRM, etc.)
  // y persistir la solicitud cuando exista la integración correspondiente.
  console.log('Contacto recibido:', {
    name,
    company,
    email,
    phone,
    topic: topic || 'sin-tema',
    message,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({
    success: true,
    message: 'Mensaje recibido correctamente.',
  })
}
