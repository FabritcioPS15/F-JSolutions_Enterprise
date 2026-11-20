import { NextRequest, NextResponse } from 'next/server'
import { isEmail } from '@fj-solutions/contracts/domain'
import type { ServiceCategory } from '@/lib/services'
import {
  buildQuoteItems,
  buildQuoteNotes,
  createScopeFor,
  estimateServiceQuote,
  getServiceQuoteConfig,
  type QuoteScope,
} from '@/lib/service-quote'

const API_URL = (process.env.HELPDESK_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/+$/, '')

const categories: ServiceCategory[] = [
  'Soporte TI',
  'Infraestructura TI',
  'Desarrollo de software',
]

type IncomingPayload = {
  service?: { slug?: unknown; title?: unknown; category?: unknown }
  scope?: Record<string, unknown>
  contact?: {
    name?: unknown
    company?: unknown
    email?: unknown
    phone?: unknown
    documentType?: unknown
    documentNumber?: unknown
    preference?: unknown
  }
  comments?: unknown
}

function text(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function integer(value: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, Math.trunc(parsed)))
}

export async function POST(request: NextRequest) {
  let payload: IncomingPayload

  try {
    payload = (await request.json()) as IncomingPayload
  } catch {
    return NextResponse.json(
      { success: false, message: 'La solicitud no tiene un formato válido.' },
      { status: 400 },
    )
  }

  const serviceSlug = text(payload.service?.slug, 120)
  const serviceTitle = text(payload.service?.title, 200)
  const serviceCategory = categories.includes(payload.service?.category as ServiceCategory)
    ? (payload.service?.category as ServiceCategory)
    : undefined

  if (!/^[a-z0-9-]{2,120}$/.test(serviceSlug) || serviceTitle.length < 2) {
    return NextResponse.json(
      { success: false, message: 'Selecciona el servicio que quieres cotizar.' },
      { status: 400 },
    )
  }

  const config = getServiceQuoteConfig(serviceSlug, serviceCategory)
  const defaults = createScopeFor(config)
  const rawScope = payload.scope ?? {}

  const coverage = rawScope.coverage
  const urgency = rawScope.urgency

  const scope: QuoteScope = {
    devices: integer(rawScope.devices, defaults.devices, 0, 1000),
    sites: integer(rawScope.sites, defaults.sites, 1, 100),
    points: integer(rawScope.points, defaults.points, 0, 2000),
    modules: integer(rawScope.modules, defaults.modules, 0, 100),
    users: integer(rawScope.users, defaults.users, 0, 5000),
    integrations: integer(rawScope.integrations, defaults.integrations, 0, 50),
    coverage:
      coverage === 'programado' || coverage === 'extendido' ? coverage : 'remoto',
    mobileApp: rawScope.mobileApp === true,
    dataMigration: rawScope.dataMigration === true,
    urgency: urgency === 'prioritario' ? 'prioritario' : 'normal',
  }

  const estimate = estimateServiceQuote(config, scope)

  const name = text(payload.contact?.name, 200)
  const company = text(payload.contact?.company, 200)
  const email = text(payload.contact?.email, 200)
  const phone = text(payload.contact?.phone, 50)
  const documentType =
    payload.contact?.documentType === 'dni' || payload.contact?.documentType === 'ruc'
      ? payload.contact.documentType
      : undefined
  const documentNumber = text(payload.contact?.documentNumber, 20)
  const preference = payload.contact?.preference
  const contactPreference =
    preference === 'email' || preference === 'phone' || preference === 'whatsapp'
      ? preference
      : undefined
  const comments = text(payload.comments, 2000)

  if (name.length < 2) {
    return NextResponse.json(
      { success: false, message: 'Necesitamos tu nombre para preparar la cotización.' },
      { status: 400 },
    )
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { success: false, message: 'Ingresa un correo electrónico válido.' },
      { status: 400 },
    )
  }

  if (phone.replace(/\D/g, '').length < 6) {
    return NextResponse.json(
      { success: false, message: 'Ingresa un teléfono de contacto válido.' },
      { status: 400 },
    )
  }

  const hasDocument = Boolean(documentType && documentNumber)
  const category = serviceCategory ?? 'Desarrollo de software'

  try {
    const response = await fetch(`${API_URL}/quotes/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactName: name,
        contactEmail: email,
        contactPhone: phone,
        companyName: company || undefined,
        documentType: hasDocument ? documentType : undefined,
        documentNumber: hasDocument ? documentNumber : undefined,
        contactPreference,
        generalNotes: buildQuoteNotes({
          title: serviceTitle,
          category,
          estimate,
          scope,
          comments: comments || undefined,
          contactPreference,
        }),
        items: buildQuoteItems(serviceTitle, estimate),
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
            'No pudimos registrar tu cotización en este momento. Inténtalo nuevamente.',
        },
        { status: response.status === 422 ? 400 : 502 },
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
      estimate: {
        min: estimate.min,
        max: estimate.max,
        billing: estimate.billing,
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
      { status: 502 },
    )
  }
}
