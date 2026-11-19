import { NextRequest, NextResponse } from 'next/server'
import { isEmail } from '@fj-solutions/contracts/domain'

const API_URL = (process.env.HELPDESK_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/+$/, '')

type IncomingItem = {
  productId?: unknown
  productName?: unknown
  productSku?: unknown
  quantity?: unknown
}

type IncomingQuote = {
  contactName?: unknown
  contactEmail?: unknown
  contactPhone?: unknown
  companyName?: unknown
  documentType?: unknown
  documentNumber?: unknown
  contactPreference?: unknown
  generalNotes?: unknown
  items?: unknown
}

function text(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

export async function POST(request: NextRequest) {
  let payload: IncomingQuote

  try {
    payload = (await request.json()) as IncomingQuote
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 }
    )
  }

  const contactName = text(payload.contactName, 200)
  const contactEmail = text(payload.contactEmail, 200)
  const contactPhone = text(payload.contactPhone, 50)
  const companyName = text(payload.companyName, 200)
  const documentType =
    payload.documentType === 'dni' || payload.documentType === 'ruc'
      ? payload.documentType
      : undefined
  const documentNumber = text(payload.documentNumber, 20)
  const contactPreference =
    payload.contactPreference === 'email' ||
    payload.contactPreference === 'phone' ||
    payload.contactPreference === 'whatsapp'
      ? payload.contactPreference
      : undefined
  const generalNotes = text(payload.generalNotes, 10_000)

  if (contactName.length < 2) {
    return NextResponse.json(
      { success: false, message: 'Necesitamos tu nombre para preparar la cotización.' },
      { status: 400 }
    )
  }

  if (!isEmail(contactEmail)) {
    return NextResponse.json(
      { success: false, message: 'Ingresa un correo electrónico válido.' },
      { status: 400 }
    )
  }

  if (contactPhone.replace(/\D/g, '').length < 6) {
    return NextResponse.json(
      { success: false, message: 'Ingresa un teléfono de contacto válido.' },
      { status: 400 }
    )
  }

  const items = Array.isArray(payload.items) ? (payload.items as IncomingItem[]) : []
  const normalizedItems = items.flatMap((item) => {
    const name = text(item.productName, 300)
    const quantity = Math.trunc(Number(item.quantity) || 0)
    if (!name || quantity < 1) return []
    return [
      {
        productId: text(item.productId, 120) || undefined,
        name,
        sku: text(item.productSku, 80) || undefined,
        quantity: Math.min(quantity, 10_000),
      },
    ]
  })

  if (normalizedItems.length === 0) {
    return NextResponse.json(
      { success: false, message: 'Agrega al menos un producto a la cotización.' },
      { status: 400 }
    )
  }

  const hasDocument = Boolean(documentType && documentNumber)

  try {
    const response = await fetch(`${API_URL}/quotes/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactName,
        contactEmail,
        contactPhone,
        companyName: companyName || undefined,
        documentType: hasDocument ? documentType : undefined,
        documentNumber: hasDocument ? documentNumber : undefined,
        contactPreference,
        generalNotes: generalNotes || undefined,
        items: normalizedItems,
      }),
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    })

    const data = (await response.json().catch(() => null)) as
      | {
          success?: boolean
          message?: string
          data?: { id?: string; code?: string; createdAt?: string }
        }
      | null

    if (!response.ok || !data?.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.message ??
            'No pudimos registrar tu solicitud en este momento. Inténtalo nuevamente.',
        },
        { status: response.status === 422 ? 400 : 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: data.message ?? 'Solicitud de cotización registrada.',
      data: {
        id: data.data?.id,
        code: data.data?.code,
        createdAt: data.data?.createdAt,
      },
    })
  } catch (error) {
    console.error('No se pudo conectar con la API de cotizaciones:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          'El servicio de cotizaciones no está disponible. Escríbenos directamente a ventas@fjsolutions.pe.',
      },
      { status: 502 }
    )
  }
}
