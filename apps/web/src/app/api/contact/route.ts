import { NextRequest, NextResponse } from 'next/server'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const API_URL = (process.env.HELPDESK_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/+$/, '')

const topicLabels: Record<string, string> = {
  cotizacion: 'Cotización de equipos',
  soporte: 'Soporte TI',
  software: 'Proyecto de software',
  infraestructura: 'Redes e infraestructura',
  otro: 'Otro tema',
}

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

  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: name,
        email,
        empresa: company || undefined,
        telefono: phone || undefined,
        asunto: topicLabels[topic] ?? topic ?? 'Consulta general',
        mensaje: message,
        channel: 'WEB',
      }),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })

    const data = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null

    if (!response.ok || !data?.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.message ??
            'No pudimos registrar tu consulta en este momento. Inténtalo nuevamente.',
        },
        { status: response.status === 422 ? 400 : 502 },
      )
    }

    return NextResponse.json({
      success: true,
      message: data.message ?? 'Mensaje recibido correctamente.',
    })
  } catch (error) {
    console.error('No se pudo conectar con la API de mesa de ayuda:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          'El servicio de consultas no está disponible. Escríbenos directamente a ventas@fjsolutions.pe.',
      },
      { status: 502 },
    )
  }
}
