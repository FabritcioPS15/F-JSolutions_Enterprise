import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardCheck,
  Code2,
  Handshake,
  Headset,
  Mail,
  Network,
  Phone,
  Rocket,
  Target,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { AddToQuoteButton } from '@/components/quote/add-to-quote-button'
import { HERO_BODY, HERO_TITLE_SIZE } from '@/components/heroes/hero-primitives'
import { FaqAccordion } from '@/components/ui/faq-accordion'
import { ProcessSequence } from '@/components/ui/process-sequence'
import { EMPRESA } from '@/lib/constants'
import {
  getServicePathFor,
  type ServiceCategory,
  type ServiceDefinition,
} from '@/lib/services'
import { SITE_NAME, SITE_URL } from '@/lib/site'

const process = [
  {
    icon: ClipboardCheck,
    step: '01',
    title: 'Diagnóstico',
    copy: 'Revisamos tu situación actual, equipos y procesos para priorizar lo que realmente necesita atención.',
  },
  {
    icon: Target,
    step: '02',
    title: 'Propuesta',
    copy: 'Definimos alcance, plazos y presupuesto en una propuesta clara, sin costos escondidos.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Implementación',
    copy: 'Ejecutamos el servicio con orden, documentamos cada cambio y validamos los entregables contigo.',
  },
  {
    icon: Handshake,
    step: '04',
    title: 'Acompañamiento',
    copy: 'Damos seguimiento y recomendaciones para que la solución siga funcionando en el tiempo.',
  },
]

const categoryIcons: Record<ServiceCategory, typeof Headset> = {
  'Soporte TI': Headset,
  'Infraestructura TI': Network,
  'Desarrollo de software': Code2,
}


type ServiceDetailProps = {
  service: ServiceDefinition
  categoryCrumb: { label: string; href: string }
  relatedServices?: ServiceDefinition[]
}

export function ServiceDetail({
  service,
  categoryCrumb,
  relatedServices,
}: ServiceDetailProps) {
  const related = relatedServices ?? []
  const path = getServicePathFor(service)
  const phoneHref = `tel:${EMPRESA.telefono.replace(/\s/g, '')}`

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: `${SITE_URL}${path}`,
    category: service.category,
    areaServed: { '@type': 'Country', name: 'Perú' },
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      telephone: EMPRESA.telefono,
      email: EMPRESA.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lima',
        addressCountry: 'PE',
      },
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryCrumb.label,
        item: `${SITE_URL}${categoryCrumb.href}`,
      },
      { '@type': 'ListItem', position: 3, name: service.title, item: `${SITE_URL}${path}` },
    ],
  }

  return (
    <main className="min-h-screen bg-card text-foreground">
      <EnhancedHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* ─── Migas de pan ─── */}
      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: categoryCrumb.label, href: categoryCrumb.href },
          { label: service.title, current: true },
        ]}
      />

      {/* ─── Hero del servicio ─── */}
      {service.heroImage ? (
        <section className="hero-viewport-detail relative flex items-center overflow-hidden bg-[#08192A]">
          <Image
            src={service.heroImage.src}
            alt={service.heroImage.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover object-center lg:object-right"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#08192A]/70" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#08192A] via-[#08192A]/85 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#08192A] via-transparent to-transparent"
          />

          <div className={`relative w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 ${HERO_BODY}`}>
            <div className="max-w-2xl">
              <h1
                className={`font-heading font-bold tracking-[-0.04em] text-white ${HERO_TITLE_SIZE.lg} leading-[1.08] sm:leading-[1.04]`}
              >
                {service.title}
              </h1>
              <p className="mt-4 max-w-[54ch] text-[0.95rem] leading-relaxed text-muted-foreground/60 sm:mt-5 sm:text-base">
                {service.intro}
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap">
                <AddToQuoteButton
                  slug={service.slug}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1769AA] px-5 text-sm font-bold text-white transition hover:bg-[#12568C] sm:w-auto"
                />
                <Link
                  href="/contacto"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 text-sm font-bold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10 sm:w-auto"
                >
                  Hablar con un especialista
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Respuesta a solicitudes en menos de 24 horas hábiles.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-muted-foreground/60 backdrop-blur transition hover:bg-white/10 hover:text-white"
              >
                <Phone className="size-4 text-[#75D7E8]" /> {EMPRESA.telefono}
              </a>
              <a
                href={`mailto:${EMPRESA.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-muted-foreground/60 backdrop-blur transition hover:bg-white/10 hover:text-white"
              >
                <Mail className="size-4 text-[#75D7E8]" /> {EMPRESA.email}
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="hero-viewport-detail relative flex items-center overflow-hidden border-b border-border bg-gradient-to-br from-muted via-white to-brand-soft">
          <div className="pointer-events-none absolute -right-32 -top-24 size-96 rounded-full bg-[#1769AA]/10 blur-3xl" />
          <div className={`relative mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 ${HERO_BODY}`}>
            <div className="min-w-0">
              <h1
                className={`max-w-2xl font-heading font-bold tracking-[-0.04em] text-foreground ${HERO_TITLE_SIZE.lg} leading-[1.08] sm:leading-[1.04]`}
              >
                {service.title}
              </h1>
              <p className="mt-4 max-w-[54ch] text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
                {service.intro}
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap">
                <AddToQuoteButton
                  slug={service.slug}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1769AA] px-5 text-sm font-bold text-white transition hover:bg-[#12568C] sm:w-auto"
                />
                <Link
                  href="/contacto"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground transition hover:border-[#1769AA] hover:text-blue-ink sm:w-auto"
                >
                  Hablar con un especialista
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Respuesta a solicitudes en menos de 24 horas hábiles.
              </p>
            </div>

            <aside className="min-w-0 rounded-3xl border border-border bg-card/90 p-6 shadow-xl shadow-[#0B2236]/5 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Datos del servicio
              </p>
              <div className="mt-5 space-y-2">
                <a
                  href={phoneHref}
                  className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-xs font-semibold text-foreground transition hover:bg-tint-blue"
                >
                  <Phone className="size-4 text-blue-ink" /> {EMPRESA.telefono}
                </a>
                <a
                  href={`mailto:${EMPRESA.email}`}
                  className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-xs font-semibold text-foreground transition hover:bg-tint-blue"
                >
                  <Mail className="size-4 text-blue-ink" /> {EMPRESA.email}
                </a>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* ─── Qué incluye ─── */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-ink">
              Qué incluye
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
              Todo lo que cubre este servicio
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              El alcance final se ajusta a tu empresa después del diagnóstico, sin sumar servicios
              que no necesitas.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.includes.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-muted p-5 transition hover:border-[#1769AA]/30 hover:bg-card hover:shadow-lg hover:shadow-black/5"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-card text-blue-ink shadow-sm">
                  <Check className="size-4" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Cómo trabajamos ─── */}
      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-ink">
                Cómo trabajamos
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
                Un proceso claro, sin sorpresas
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Cada etapa tiene responsables, entregables y fechas. Tú siempre sabes en qué punto
              está tu servicio.
            </p>
          </div>

          <ProcessSequence className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-border bg-card p-6"
              >
                <span className="process-number text-4xl font-extrabold text-muted-foreground/60">{item.step}</span>
                <span className="absolute right-5 top-5 grid size-9 place-items-center rounded-lg bg-tint-blue text-blue-ink">
                  <item.icon className="size-4" />
                </span>
                <h3 className="mt-2 text-sm font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.copy}</p>
                {index < process.length - 1 && (
                  <span className="process-arrow absolute -right-3 top-1/2 hidden -translate-y-1/2 text-muted-foreground lg:block">
                    <ArrowRight className="size-5" />
                  </span>
                )}
              </div>
            ))}
          </ProcessSequence>
        </div>
      </section>

      {/* ─── Preguntas frecuentes ─── */}
      <section id="faq" className="scroll-mt-24 border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-ink">
              Preguntas frecuentes
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
              Antes de empezar
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Las dudas más comunes sobre {service.title.toLowerCase()}. Si la tuya no está aquí,
              escríbenos y la respondemos.
            </p>
            <Link
              href="/contacto"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-ink hover:text-blue-ink"
            >
              Hacer otra consulta <ArrowRight className="size-4" />
            </Link>
          </div>
          <FaqAccordion
            items={service.faq.map((item) => ({ question: item.question, answer: item.answer }))}
          />
        </div>
      </section>

      {/* ─── Servicios relacionados ─── */}
      {related.length > 0 && (
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-ink">
                  Servicios relacionados
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
                  Suele combinarse con
                </h2>
              </div>
              <Link
                href={categoryCrumb.href}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-ink hover:text-blue-ink"
              >
                Ver todos los servicios <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => {
                const Icon = categoryIcons[item.category]
                return (
                  <Link
                    key={item.slug}
                    href={getServicePathFor(item)}
                    className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-[#1769AA]/30 hover:shadow-lg hover:shadow-black/5"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-tint-blue text-blue-ink transition group-hover:bg-[#1769AA] group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 flex-1 text-xs leading-5 text-muted-foreground">{item.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-ink">
                      Conocer el servicio <ArrowUpRight className="size-3.5" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA final ─── */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-[#1769AA]/25 bg-gradient-to-br from-tint-blue via-white to-brand-soft px-6 py-10 shadow-sm sm:px-10 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#1769AA]/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-[#1769AA]/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/85">
                Hablemos de tu proyecto
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                ¿Necesitas {service.title.toLowerCase()} en tu empresa?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/85">
                Cuéntanos tu caso y recibe una propuesta con alcance claro, tiempos y costos. El
                diagnóstico inicial no tiene costo.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <AddToQuoteButton
                  slug={service.slug}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1769AA] px-5 text-sm font-bold text-white transition hover:bg-[#12568C]"
                />
                <a
                  href={phoneHref}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-input bg-card px-5 text-sm font-bold text-foreground transition hover:border-[#1769AA] hover:text-blue-ink"
                >
                  <Phone className="size-4" /> {EMPRESA.telefono}
                </a>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-border bg-muted p-5">
              <a
                href={`mailto:${EMPRESA.email}`}
                className="flex items-center gap-3 text-sm font-semibold"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-card">
                  <Mail className="size-4 text-blue-ink" />
                </span>
                {EMPRESA.email}
              </a>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className="grid size-9 place-items-center rounded-lg bg-card">
                  <Headset className="size-4 text-blue-ink" />
                </span>
                {EMPRESA.horario}
              </div>
              <div className="mt-1 rounded-lg bg-card px-3 py-2 text-[11px] text-foreground/85">
                Atendemos empresas de todos los tamaños, en Lima y a nivel nacional.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
