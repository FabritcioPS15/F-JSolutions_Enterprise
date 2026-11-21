import { NextRequest, NextResponse } from 'next/server'
import { isEmail } from '@fj-solutions/contracts/domain'
import type { ServiceCategory } from '@/lib/services'
import {
  buildGroupQuoteItems,
  buildGroupQuoteNotes,
  createScopeFor,
  estimateQuoteGroup,
  getServiceQuoteConfig,
  type QuoteKind,
  type QuoteScope,
  type QuoteSelection,
} from '@/lib/service-quote'

const API_URL = (process.env.HELPDESK_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/+$/, '')
const MAX_SERVICES = 8

const categories: ServiceCategory[] = [
  'Soporte TI',
  'Infraestructura TI',
  'Desarrollo de software',
]

const kindCategory: Record<QuoteKind, ServiceCategory> = {
  soporte: 'Soporte TI',
  infraestructura: 'Infraestructura TI',
  software: 'Desarrollo de software',
}

type IncomingService = {
  slug?: unknown
  title?: unknown
  category?: unknown
  scope?: Record<string, unknown>
}

type IncomingPayload = {
  services?: IncomingService[]
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

function sanitizeScope(rawScope: Record<string, unknown> | undefined, config: ReturnType<typeof getServiceQuoteConfig>): QuoteScope {
  const defaults = createScopeFor(config)
  const raw = rawScope && typeof rawScope === 'object' ? rawScope : {}

  return {
    devices: integer(raw.devices, defaults.devices, 0, 1000),
    sites: integer(raw.sites, defaults.sites, 1, 100),
    points: integer(raw.points, defaults.points, 0, 2000),
    modules: integer(raw.modules, defaults.modules, 0, 100),
    users: integer(raw.users, defaults.users, 0, 5000),
    integrations: integer(raw.integrations, defaults.integrations, 0, 50),
    coverage: raw.coverage === 'programado' || raw.coverage === 'extendido' ? raw.coverage : 'remoto',
    mobileApp: raw.mobileApp === true,
    dataMigration: raw.dataMigration === true,
    urgency: raw.urgency === 'prioritario' ? 'prioritario' : 'normal',
  }
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

  const incoming = Array.isArray(payload.services) ? payload.services : []

  if (incoming.length === 0) {
    return NextResponse.json(
      { success: false, message: 'Selecciona al menos un servicio para cotizar.' },
      { status: 400 },
    )
  }

  if (incoming.length > MAX_SERVICES) {
    return NextResponse.json(
      { success: false, message: `Puedes cotizar hasta ${MAX_SERVICES} servicios a la vez.` },
      { status: 400 },
    )
  }

  const seen = new Set<string>()
  const selections: QuoteSelection[] = []

  for (const item of incoming) {
    const slug = text(item?.slug, 120)
    const title = text(item?.title, 200)

    if (!/^[a-z0-9-]{2,120}$/.test(slug) || title.length < 2 || seen.has(slug)) {
      return NextResponse.json(
        { success: false, message: 'Revisa los servicios seleccionados e inténtalo nuevamente.' },
        { status: 400 },
      )
    }

    seen.add(slug)
    const config = getServiceQuoteConfig(
      slug,
      categories.includes(item?.category as ServiceCategory)
        ? (item.category as ServiceCategory)
        : undefined,
    )
    const category = categories.includes(item?.category as ServiceCategory)
      ? (item.category as ServiceCategory)
      : kindCategory[config.kind]

    selections.push({
      title,
      category,
      config,
      scope: sanitizeScope(item?.scope, config),
    })
  }

  const group = estimateQuoteGroup(selections)

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
        generalNotes: buildGroupQuoteNotes({
          group,
          comments: comments || undefined,
          contactPreference,
        }),
        items: buildGroupQuoteItems(group),
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
        project: group.project,
        monthly: group.monthly,
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
