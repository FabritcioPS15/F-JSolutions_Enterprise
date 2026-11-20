'use client'

import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  CheckCircle2,
  Code2,
  Headset,
  Loader2,
  MessageCircle,
  Minus,
  Network,
  Phone,
  Plus,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import {
  HERO_BODY,
  HERO_CONTAINER,
  HeroAccent,
  HeroEyebrow,
  HeroLead,
  HeroProof,
  HeroSection,
  HeroTitle,
} from '@/components/heroes/hero-primitives'
import { EMPRESA } from '@/lib/constants'
import type { ServiceCategory } from '@/lib/services'
import {
  createScopeFor,
  estimateServiceQuote,
  formatEstimate,
  getServiceQuoteConfig,
  type QuoteBilling,
  type QuoteCoverage,
  type QuoteScope,
  type QuoteUrgency,
} from '@/lib/service-quote'
import { cn } from '@/lib/utils'

export type QuoteServiceOption = {
  slug: string
  title: string
  category: ServiceCategory
  summary: string
}

type Step = 1 | 2 | 3
type ContactPreference = 'email' | 'phone' | 'whatsapp'
type DocumentType = '' | 'dni' | 'ruc'

type ContactForm = {
  name: string
  company: string
  email: string
  phone: string
  documentType: DocumentType
  documentNumber: string
  preference: ContactPreference
}

type FormErrors = Partial<Record<'name' | 'email' | 'phone' | 'consent' | 'form', string>>

type SubmitResult = {
  code?: string
  min: number
  max: number
  billing: QuoteBilling
  serviceTitle: string
  preference: ContactPreference
  email: string
}

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const STEP_LABELS: Record<Step, string> = {
  1: 'Servicio',
  2: 'Alcance',
  3: 'Datos',
}

const CATEGORY_META: Record<ServiceCategory, { icon: LucideIcon; blurb: string }> = {
  'Soporte TI': { icon: Headset, blurb: 'Atención, mantenimiento y continuidad' },
  'Infraestructura TI': { icon: Network, blurb: 'Redes, cableado y equipamiento' },
  'Desarrollo de software': { icon: Code2, blurb: 'Sistemas web, integraciones y automatización' },
}

const CATEGORY_ORDER: ServiceCategory[] = [
  'Soporte TI',
  'Infraestructura TI',
  'Desarrollo de software',
]

const COVERAGE_OPTIONS: Array<{ value: QuoteCoverage; label: string; hint: string }> = [
  { value: 'remoto', label: 'Remoto', hint: 'Atención a distancia' },
  { value: 'programado', label: 'En sitio programado', hint: 'Visitas coordinadas' },
  { value: 'extendido', label: 'Extendido 24/7', hint: 'Cobertura ampliada' },
]

const URGENCY_OPTIONS: Array<{ value: QuoteUrgency; label: string; hint: string }> = [
  { value: 'normal', label: 'Normal', hint: 'Según agenda del proyecto' },
  { value: 'prioritario', label: 'Prioritario', hint: 'Atención acelerada' },
]

const PREFERENCE_OPTIONS: Array<{ value: ContactPreference; label: string }> = [
  { value: 'email', label: 'Correo electrónico' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Llamada telefónica' },
]

const inputClass =
  'mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#1769AA] focus:ring-2 focus:ring-[#1769AA]/15'

const primaryButtonClass =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1769AA] px-5 text-sm font-bold text-white shadow-[0_12px_28px_-14px_rgba(23,105,170,0.75)] transition hover:bg-[#12568C] disabled:cursor-not-allowed disabled:opacity-50'

const secondaryButtonClass =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:border-[#1769AA]/45 hover:text-blue-ink'

export function ServiceQuotePage({
  services,
  initialSlug,
}: {
  services: QuoteServiceOption[]
  initialSlug?: string
}) {
  const initialService = initialSlug
    ? services.find((service) => service.slug === initialSlug) ?? null
    : null

  const [step, setStep] = useState<Step>(initialService ? 2 : 1)
  const [category, setCategory] = useState<ServiceCategory | null>(
    initialService?.category ?? null,
  )
  const [slug, setSlug] = useState<string | null>(initialService?.slug ?? null)
  const [scope, setScope] = useState<QuoteScope>(() =>
    createScopeFor(
      getServiceQuoteConfig(
        initialService?.slug ?? '',
        initialService?.category ?? 'Desarrollo de software',
      ),
    ),
  )
  const [comments, setComments] = useState('')
  const [contact, setContact] = useState<ContactForm>({
    name: '',
    company: '',
    email: '',
    phone: '',
    documentType: '',
    documentNumber: '',
    preference: 'email',
  })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)

  const builderRef = useRef<HTMLDivElement>(null)

  const selectedService = useMemo(
    () => services.find((service) => service.slug === slug) ?? null,
    [services, slug],
  )

  const selectedCategory = selectedService?.category ?? category ?? undefined

  const config = useMemo(
    () => getServiceQuoteConfig(slug ?? '', selectedCategory),
    [slug, selectedCategory],
  )

  const estimate = useMemo(
    () => (slug && selectedService ? estimateServiceQuote(config, scope) : null),
    [slug, selectedService, config, scope],
  )

  const filteredServices = useMemo(
    () => (category ? services.filter((service) => service.category === category) : []),
    [services, category],
  )

  useEffect(() => {
    if (step === 2 && !slug) setStep(1)
  }, [step, slug])

  const goToStep = (next: Step) => {
    setStep(next)
    const element = builderRef.current
    if (element && element.getBoundingClientRect().top < 0) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const selectCategory = (next: ServiceCategory) => {
    setCategory(next)
    if (!selectedService || selectedService.category !== next) {
      setSlug(null)
    }
  }

  const selectService = (service: QuoteServiceOption) => {
    setSlug(service.slug)
    setCategory(service.category)
    setScope(createScopeFor(getServiceQuoteConfig(service.slug, service.category)))
  }

  const updateScope = (patch: Partial<QuoteScope>) => {
    setScope((current) => ({ ...current, ...patch }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedService || !estimate) return

    const nextErrors: FormErrors = {}
    if (contact.name.trim().length < 2) nextErrors.name = 'Ingresa tu nombre.'
    if (!EMAIL_PATTERN.test(contact.email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido.'
    }
    if (contact.phone.replace(/\D/g, '').length < 6) {
      nextErrors.phone = 'Ingresa un teléfono de contacto válido.'
    }
    if (!consent) nextErrors.consent = 'Necesitamos tu autorización para contactarte.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/cotizador-servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: {
            slug: selectedService.slug,
            title: selectedService.title,
            category: selectedService.category,
          },
          scope,
          contact: {
            name: contact.name,
            company: contact.company,
            email: contact.email,
            phone: contact.phone,
            documentType: contact.documentType || undefined,
            documentNumber: contact.documentType ? contact.documentNumber : undefined,
            preference: contact.preference,
          },
          comments,
        }),
      })

      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean
            message?: string
            data?: { code?: string }
            estimate?: { min?: number; max?: number; billing?: QuoteBilling }
          }
        | null

      if (!response.ok || !data?.success) {
        setErrors({
          form:
            data?.message ??
            'No pudimos registrar tu cotización en este momento. Inténtalo nuevamente.',
        })
        return
      }

      setResult({
        code: data.data?.code,
        min: data.estimate?.min ?? estimate.min,
        max: data.estimate?.max ?? estimate.max,
        billing: data.estimate?.billing ?? estimate.billing,
        serviceTitle: selectedService.title,
        preference: contact.preference,
        email: contact.email,
      })
      goToStep(3)
    } catch {
      setErrors({
        form: 'No pudimos conectar con el servicio de cotizaciones. Inténtalo nuevamente en unos minutos.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappHref = `https://wa.me/${EMPRESA.redesSociales.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola, acabo de solicitar la cotización${result?.code ? ` ${result.code}` : ''} de ${
      result?.serviceTitle ?? 'un servicio'
    }. Quisiera coordinar los detalles.`,
  )}`

  return (
    <main className="min-h-screen bg-card text-foreground">
      <EnhancedHeader />
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Servicios', href: '/servicios' },
          { label: 'Cotización', current: true },
        ]}
      />

      <HeroSection id="cotizacion-servicios">
        <div className={`${HERO_CONTAINER} ${HERO_BODY}`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <HeroEyebrow icon={<Calculator aria-hidden="true" className="size-3" />}>
                Cotizador de servicios
              </HeroEyebrow>
              <HeroTitle size="lg">
                Cotiza tu proyecto con <HeroAccent>un rango claro</HeroAccent>.
              </HeroTitle>
              <HeroLead>
                Selecciona el servicio, define el alcance y recibe una estimación referencial al
                instante. El precio final puede variar según los requerimientos del cliente y el
                diagnóstico técnico.
              </HeroLead>
              <HeroProof
                items={[
                  'Soporte, infraestructura y software',
                  'Rango según el alcance real',
                  'Respuesta en menos de 24 horas hábiles',
                ]}
              />
            </div>

            <div className="hero-reveal hero-delay-2 rounded-2xl border border-border bg-card p-5 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.55)] sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Cómo funciona
              </p>
              <ol className="mt-3 space-y-3">
                {[
                  { title: 'Elige el servicio', copy: 'Soporte TI, infraestructura o software a medida.' },
                  { title: 'Define el alcance', copy: 'Equipos, sedes, módulos, usuarios e integraciones.' },
                  { title: 'Recibe tu propuesta', copy: 'Revisamos el caso y enviamos el precio final.' },
                ].map((item, index) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-tint-blue text-[11px] font-bold text-blue-ink">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{item.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-xl bg-muted px-3 py-2.5 text-[11px] leading-4 text-muted-foreground">
                La estimación es referencial y no constituye una oferta final. No incluye IGV.
              </p>
            </div>
          </div>
        </div>
      </HeroSection>

      <section
        id="cotizador-formulario"
        ref={builderRef}
        className="scroll-mt-[calc(var(--site-header-height)+1rem)] border-t border-border bg-muted py-10 sm:py-12 lg:py-14"
      >
        <div className={CONTAINER}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
            <div className="min-w-0">
              <ol className="flex items-center gap-2" aria-label="Pasos de la cotización">
                {([1, 2, 3] as Step[]).map((value, index) => {
                  const isCurrent = step === value && !result
                  const isDone = Boolean(result) || step > value
                  const reachable = value === 1 || (value === 2 && Boolean(slug)) || (value === 3 && Boolean(slug))
                  return (
                    <li
                      key={value}
                      className={cn('flex items-center gap-2', index === 2 ? '' : 'flex-1')}
                    >
                      <button
                        type="button"
                        onClick={() => reachable && goToStep(value)}
                        disabled={!reachable}
                        aria-current={isCurrent ? 'step' : undefined}
                        className={cn(
                          'flex items-center gap-2 rounded-full px-1 py-1 text-[11px] font-bold transition sm:px-1.5',
                          reachable ? 'cursor-pointer' : 'cursor-default',
                        )}
                      >
                        <span
                          className={cn(
                            'grid size-6 shrink-0 place-items-center rounded-full border text-[11px]',
                            isCurrent
                              ? 'border-[#1769AA] bg-[#1769AA] text-white'
                              : isDone
                                ? 'border-[#1769AA]/30 bg-tint-blue text-blue-ink'
                                : 'border-border bg-card text-muted-foreground',
                          )}
                        >
                          {isDone ? <Check aria-hidden="true" className="size-3" strokeWidth={3} /> : value}
                        </span>
                        <span className={isCurrent ? 'text-foreground' : 'text-muted-foreground'}>
                          {STEP_LABELS[value]}
                        </span>
                      </button>
                      {index < 2 && <span aria-hidden="true" className="h-px flex-1 bg-border" />}
                    </li>
                  )
                })}
              </ol>

              <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.4)] sm:p-6 lg:p-7">
                {result ? (
                  <div>
                    <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 aria-hidden="true" className="size-6" />
                    </span>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
                      Solicitud registrada
                    </p>
                    <h2 className="mt-2 font-heading text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
                      Recibimos tu cotización.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      Un especialista revisará el alcance de{' '}
                      <span className="font-semibold text-foreground">{result.serviceTitle}</span> y
                      te contactará en menos de 24 horas hábiles. Si necesitas avanzar antes, escríbenos
                      por WhatsApp mencionando tu código.
                    </p>

                    <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-border bg-muted p-3.5">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Código
                        </dt>
                        <dd className="mt-1 text-sm font-bold text-foreground">
                          {result.code ?? 'Por asignar'}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-[#1769AA]/25 bg-tint-blue p-3.5">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-ink">
                          Estimación
                        </dt>
                        <dd className="mt-1 text-sm font-bold text-foreground">
                          {formatEstimate(result.min, result.max, result.billing)}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-border bg-muted p-3.5">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Contacto
                        </dt>
                        <dd className="mt-1 break-all text-sm font-bold text-foreground">
                          {result.preference === 'email'
                            ? result.email
                            : result.preference === 'whatsapp'
                              ? 'WhatsApp'
                              : 'Llamada telefónica'}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-[#0B2236] transition hover:bg-[#1FBE5B]"
                      >
                        <MessageCircle aria-hidden="true" className="size-4" />
                        Continuar por WhatsApp
                      </a>
                      <a href={`tel:${EMPRESA.telefono.replace(/\s/g, '')}`} className={secondaryButtonClass}>
                        <Phone aria-hidden="true" className="size-4" />
                        {EMPRESA.telefono}
                      </a>
                      <Link href="/servicios" className={secondaryButtonClass}>
                        Ver más servicios
                      </Link>
                    </div>
                  </div>
                ) : step === 1 ? (
                  <div>
                    <h2 className="font-heading text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
                      ¿Qué necesitas cotizar?
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      Elige una categoría y luego el servicio concreto.
                    </p>

                    <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                      {CATEGORY_ORDER.map((value) => {
                        const meta = CATEGORY_META[value]
                        const Icon = meta.icon
                        const active = category === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => selectCategory(value)}
                            aria-pressed={active}
                            className={cn(
                              'rounded-xl border p-3.5 text-left transition',
                              active
                                ? 'border-[#1769AA] bg-tint-blue shadow-[0_0_0_1px_#1769AA]'
                                : 'border-border bg-card hover:border-[#1769AA]/45 hover:bg-muted/60',
                            )}
                          >
                            <span
                              className={cn(
                                'grid size-8 place-items-center rounded-lg',
                                active ? 'bg-[#1769AA] text-white' : 'bg-tint-blue text-blue-ink',
                              )}
                            >
                              <Icon aria-hidden="true" className="size-4" />
                            </span>
                            <span className="mt-2.5 block text-xs font-bold text-foreground">{value}</span>
                            <span className="mt-0.5 block text-[10.5px] leading-4 text-muted-foreground">
                              {meta.blurb}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {category ? (
                      <div className="mt-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Servicios disponibles
                        </p>
                        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                          {filteredServices.map((service) => {
                            const active = slug === service.slug
                            return (
                              <button
                                key={service.slug}
                                type="button"
                                onClick={() => selectService(service)}
                                aria-pressed={active}
                                className={cn(
                                  'flex h-full flex-col rounded-xl border p-4 text-left transition',
                                  active
                                    ? 'border-[#1769AA] bg-tint-blue/70 shadow-[0_0_0_1px_#1769AA]'
                                    : 'border-border bg-card hover:border-[#1769AA]/45 hover:bg-muted/60',
                                )}
                              >
                                <span className="flex items-start justify-between gap-3">
                                  <span className="text-sm font-bold leading-5 text-foreground">
                                    {service.title}
                                  </span>
                                  <span
                                    className={cn(
                                      'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border',
                                      active
                                        ? 'border-[#1769AA] bg-[#1769AA] text-white'
                                        : 'border-border bg-card',
                                    )}
                                  >
                                    {active && <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />}
                                  </span>
                                </span>
                                <span className="mt-1.5 line-clamp-2 text-[11.5px] leading-5 text-muted-foreground">
                                  {service.summary}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-6 rounded-xl border border-dashed border-border bg-muted/60 px-4 py-3 text-[11.5px] leading-5 text-muted-foreground">
                        Selecciona una categoría para ver los servicios que puedes cotizar.
                      </p>
                    )}

                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Link href="/servicios" className={secondaryButtonClass}>
                        Ver servicios
                      </Link>
                      <button
                        type="button"
                        onClick={() => goToStep(2)}
                        disabled={!slug}
                        className={primaryButtonClass}
                      >
                        Continuar al alcance
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : step === 2 ? (
                  <div>
                    <h2 className="font-heading text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
                      Define el alcance
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      Con estos datos calculamos un rango referencial. No necesitas tener todo
                      definido: el diagnóstico afina el precio final.
                    </p>

                    <div className="mt-5 rounded-xl border border-[#1769AA]/20 bg-tint-blue/60 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-ink">
                        Servicio seleccionado
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-foreground">{selectedService?.title}</p>
                    </div>

                    <div className="mt-5 space-y-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {config.perDevice && (
                          <QuantityField
                            label={config.deviceLabel ?? 'Equipos'}
                            hint="Cantidad estimada de equipos involucrados."
                            value={scope.devices}
                            min={1}
                            max={1000}
                            onChange={(devices) => updateScope({ devices })}
                          />
                        )}
                        {config.perPoint && (
                          <QuantityField
                            label={config.pointLabel ?? 'Puntos'}
                            hint="Puntos de red a instalar o intervenir."
                            value={scope.points}
                            min={1}
                            max={2000}
                            onChange={(points) => updateScope({ points })}
                          />
                        )}
                        {config.perSite && (
                          <QuantityField
                            label="Sedes involucradas"
                            hint="Oficinas, locales o almacenes."
                            value={scope.sites}
                            min={1}
                            max={100}
                            onChange={(sites) => updateScope({ sites })}
                          />
                        )}
                        {config.perModule && (
                          <QuantityField
                            label={config.moduleLabel ?? 'Módulos'}
                            hint="Funcionalidades o entregables principales."
                            value={scope.modules}
                            min={1}
                            max={100}
                            onChange={(modules) => updateScope({ modules })}
                          />
                        )}
                        {config.perUserBlock && (
                          <QuantityField
                            label="Usuarios"
                            hint="Personas que usarán la solución."
                            value={scope.users}
                            min={1}
                            max={5000}
                            onChange={(users) => updateScope({ users })}
                          />
                        )}
                        {config.perIntegration && (
                          <QuantityField
                            label="Integraciones"
                            hint="Sistemas o API a conectar."
                            value={scope.integrations}
                            min={0}
                            max={50}
                            onChange={(integrations) => updateScope({ integrations })}
                          />
                        )}
                      </div>

                      {config.coverage && (
                        <Segmented
                          label="Modalidad de soporte"
                          value={scope.coverage}
                          options={COVERAGE_OPTIONS}
                          onChange={(coverage) => updateScope({ coverage })}
                          columns={3}
                        />
                      )}

                      {(config.mobileApp || config.dataMigration) && (
                        <div>
                          <p className="text-xs font-bold text-foreground">Complementos</p>
                          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                            {config.mobileApp && (
                              <ToggleCard
                                title="App móvil"
                                copy="Versión móvil de la solución, sujeta a evaluación."
                                checked={scope.mobileApp}
                                onChange={(mobileApp) => updateScope({ mobileApp })}
                              />
                            )}
                            {config.dataMigration && (
                              <ToggleCard
                                title="Migración de datos"
                                copy="Traslado y limpieza de información existente."
                                checked={scope.dataMigration}
                                onChange={(dataMigration) => updateScope({ dataMigration })}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {(config.urgencyFixed || config.urgencyPercent) && (
                        <Segmented
                          label="Prioridad del proyecto"
                          value={scope.urgency}
                          options={URGENCY_OPTIONS}
                          onChange={(urgency) => updateScope({ urgency })}
                          columns={2}
                        />
                      )}

                      <label className="block text-xs font-bold text-foreground">
                        Detalles adicionales
                        <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
                        <textarea
                          value={comments}
                          onChange={(event) => setComments(event.target.value)}
                          maxLength={2000}
                          rows={3}
                          placeholder="Cuéntanos qué necesitas lograr, plazos o condiciones especiales..."
                          className="mt-1.5 w-full resize-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-normal text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#1769AA] focus:ring-2 focus:ring-[#1769AA]/15"
                        />
                      </label>
                    </div>

                    {estimate && (
                      <div className="mt-5 rounded-xl border border-[#1769AA]/25 bg-tint-blue p-4 lg:hidden">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-ink">
                          Estimación referencial
                        </p>
                        <p className="mt-1 text-xl font-bold tracking-[-0.02em] text-blue-ink">
                          {formatEstimate(estimate.min, estimate.max, estimate.billing)}
                        </p>
                        <p className="mt-1 text-[10.5px] leading-4 text-muted-foreground">
                          Puede variar según los requerimientos del cliente. No incluye IGV.
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <button type="button" onClick={() => goToStep(1)} className={secondaryButtonClass}>
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Cambiar servicio
                      </button>
                      <button type="button" onClick={() => goToStep(3)} className={primaryButtonClass}>
                        Continuar a mis datos
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <h2 className="font-heading text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
                      Tus datos de contacto
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      Usamos estos datos solo para preparar y enviar tu propuesta.
                    </p>

                    {errors.form && (
                      <p
                        role="alert"
                        className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold leading-5 text-red-700"
                      >
                        {errors.form}
                      </p>
                    )}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <label className="block text-xs font-bold text-foreground">
                        Nombre y apellido *
                        <input
                          value={contact.name}
                          onChange={(event) => setContact({ ...contact, name: event.target.value })}
                          autoComplete="name"
                          className={inputClass}
                          placeholder="Tu nombre"
                        />
                        {errors.name && (
                          <span className="mt-1 block text-[11px] font-semibold text-red-600">{errors.name}</span>
                        )}
                      </label>
                      <label className="block text-xs font-bold text-foreground">
                        Empresa
                        <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
                        <input
                          value={contact.company}
                          onChange={(event) => setContact({ ...contact, company: event.target.value })}
                          autoComplete="organization"
                          className={inputClass}
                          placeholder="Razón social"
                        />
                      </label>
                      <label className="block text-xs font-bold text-foreground">
                        Correo electrónico *
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(event) => setContact({ ...contact, email: event.target.value })}
                          autoComplete="email"
                          className={inputClass}
                          placeholder="nombre@empresa.pe"
                        />
                        {errors.email && (
                          <span className="mt-1 block text-[11px] font-semibold text-red-600">{errors.email}</span>
                        )}
                      </label>
                      <label className="block text-xs font-bold text-foreground">
                        Teléfono o WhatsApp *
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                          autoComplete="tel"
                          className={inputClass}
                          placeholder="+51 999 999 999"
                        />
                        {errors.phone && (
                          <span className="mt-1 block text-[11px] font-semibold text-red-600">{errors.phone}</span>
                        )}
                      </label>
                      <label className="block text-xs font-bold text-foreground">
                        ¿Cómo prefieres que te contactemos?
                        <select
                          value={contact.preference}
                          onChange={(event) =>
                            setContact({ ...contact, preference: event.target.value as ContactPreference })
                          }
                          className={inputClass}
                        >
                          {PREFERENCE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-2">
                        <label className="block text-xs font-bold text-foreground">
                          Documento
                          <select
                            value={contact.documentType}
                            onChange={(event) =>
                              setContact({ ...contact, documentType: event.target.value as DocumentType })
                            }
                            className={inputClass}
                          >
                            <option value="">Ninguno</option>
                            <option value="dni">DNI</option>
                            <option value="ruc">RUC</option>
                          </select>
                        </label>
                        <label className="block text-xs font-bold text-foreground">
                          Número
                          <input
                            value={contact.documentNumber}
                            onChange={(event) =>
                              setContact({ ...contact, documentNumber: event.target.value })
                            }
                            disabled={!contact.documentType}
                            maxLength={20}
                            inputMode="numeric"
                            className={cn(inputClass, 'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70')}
                            placeholder="Opcional"
                          />
                        </label>
                      </div>
                    </div>

                    <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-muted/60 p-3.5">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-0.5 size-4 shrink-0 accent-[#1769AA]"
                      />
                      <span className="text-[11.5px] leading-5 text-muted-foreground">
                        Autorizo a {EMPRESA.nombre} a contactarme por el medio elegido para atender
                        esta cotización.
                      </span>
                    </label>
                    {errors.consent && (
                      <span className="mt-1 block text-[11px] font-semibold text-red-600">{errors.consent}</span>
                    )}

                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <button type="button" onClick={() => goToStep(2)} className={secondaryButtonClass}>
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Volver al alcance
                      </button>
                      <button type="submit" disabled={submitting} className={primaryButtonClass}>
                        {submitting ? (
                          <>
                            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                            Enviando…
                          </>
                        ) : (
                          <>
                            Solicitar mi cotización
                            <ArrowRight aria-hidden="true" className="size-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="mt-3 text-[10.5px] leading-4 text-muted-foreground">
                      Tu estimación actual:{' '}
                      <span className="font-bold text-foreground">
                        {estimate ? formatEstimate(estimate.min, estimate.max, estimate.billing) : '—'}
                      </span>
                      . El precio final puede variar según los requerimientos del cliente.
                    </p>
                  </form>
                )}
              </div>
            </div>

            <aside className="lg:sticky lg:top-[calc(var(--site-header-height)+1rem)]">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-lg bg-tint-blue text-blue-ink">
                    <Calculator aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Tu cotización
                    </p>
                    <p className="text-xs font-bold text-foreground">Estimación referencial</p>
                  </div>
                </div>

                {selectedService ? (
                  <>
                    <p className="mt-4 text-sm font-bold leading-5 text-foreground">
                      {selectedService.title}
                    </p>
                    <span className="mt-1.5 inline-flex rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                      {selectedService.category}
                    </span>

                    {estimate && (
                      <>
                        <dl className="mt-4 space-y-1.5">
                          {estimate.lines.map((line) => (
                            <div key={line.label} className="flex items-baseline justify-between gap-3">
                              <dt className="text-[11.5px] text-muted-foreground">{line.label}</dt>
                              <dd className="text-[11.5px] font-semibold text-foreground">{line.value}</dd>
                            </div>
                          ))}
                        </dl>

                        <div className="mt-4 rounded-xl border border-[#1769AA]/25 bg-tint-blue p-3.5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-ink">
                            Rango estimado{estimate.billing === 'mensual' ? ' mensual' : ''}
                          </p>
                          <p aria-live="polite" className="mt-1 text-xl font-bold tracking-[-0.02em] text-blue-ink">
                            {formatEstimate(estimate.min, estimate.max, estimate.billing)}
                          </p>
                          <p className="mt-1.5 text-[10.5px] leading-4 text-muted-foreground">
                            Puede variar según los requerimientos del cliente y el diagnóstico. No
                            incluye IGV.
                          </p>
                        </div>
                      </>
                    )}

                    {config.note && (
                      <p className="mt-3 text-[10.5px] leading-4 text-muted-foreground">{config.note}</p>
                    )}
                  </>
                ) : (
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    Elige un servicio y define el alcance para ver tu rango estimado.
                  </p>
                )}

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-[11px] font-bold text-foreground">¿Prefieres hablarlo?</p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    <a
                      href={`tel:${EMPRESA.telefono.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-2 text-[11.5px] font-semibold text-muted-foreground transition hover:text-blue-ink"
                    >
                      <Phone aria-hidden="true" className="size-3.5 text-blue-ink" />
                      {EMPRESA.telefono}
                    </a>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[11.5px] font-semibold text-muted-foreground transition hover:text-blue-ink"
                    >
                      <MessageCircle aria-hidden="true" className="size-3.5 text-blue-ink" />
                      WhatsApp directo
                    </a>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <ShieldCheck aria-hidden="true" className="size-3.5 text-emerald-600" />
                    Datos usados solo para esta cotización
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

function QuantityField({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    const parsed = digits ? Math.min(max, Math.max(min, Number(digits))) : min
    onChange(parsed)
    setDraft(String(parsed))
  }

  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <p className="text-xs font-bold text-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-[10.5px] leading-4 text-muted-foreground">{hint}</p>}
      <div className="mt-2.5 flex h-9 items-center">
        <div className="flex h-full items-center overflow-hidden rounded-lg border border-border bg-muted">
          <button
            type="button"
            aria-label={`Reducir ${label}`}
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            className="grid h-full w-8 place-items-center text-muted-foreground transition hover:bg-card hover:text-blue-ink disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="size-3.5" />
          </button>
          <input
            value={draft}
            onChange={(event) => {
              const raw = event.target.value.replace(/\D/g, '').slice(0, 5)
              setDraft(raw)
              const parsed = Number(raw)
              if (raw && parsed >= min && parsed <= max) onChange(parsed)
            }}
            onBlur={() => commit(draft)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                commit(draft)
              }
            }}
            inputMode="numeric"
            aria-label={label}
            className="h-full w-12 border-x border-border bg-card text-center text-sm font-bold text-foreground outline-none focus:border-[#1769AA]"
          />
          <button
            type="button"
            aria-label={`Aumentar ${label}`}
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            className="grid h-full w-8 place-items-center text-muted-foreground transition hover:bg-card hover:text-blue-ink disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  columns,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string; hint?: string }>
  onChange: (value: T) => void
  columns: 2 | 3
}) {
  return (
    <div>
      <p className="text-xs font-bold text-foreground">{label}</p>
      <div className={cn('mt-2 grid gap-2', columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-left transition',
                active
                  ? 'border-[#1769AA] bg-tint-blue shadow-[0_0_0_1px_#1769AA]'
                  : 'border-border bg-card hover:border-[#1769AA]/45',
              )}
            >
              <span className={cn('block text-xs font-bold', active ? 'text-blue-ink' : 'text-foreground')}>
                {option.label}
              </span>
              {option.hint && (
                <span className="mt-0.5 block text-[10.5px] leading-4 text-muted-foreground">{option.hint}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ToggleCard({
  title,
  copy,
  checked,
  onChange,
}: {
  title: string
  copy: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2.5 rounded-xl border p-3.5 transition',
        checked ? 'border-[#1769AA] bg-tint-blue' : 'border-border bg-card hover:border-[#1769AA]/40',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-[#1769AA]"
      />
      <span>
        <span className="block text-xs font-bold text-foreground">{title}</span>
        <span className="mt-0.5 block text-[10.5px] leading-4 text-muted-foreground">{copy}</span>
      </span>
    </label>
  )
}
