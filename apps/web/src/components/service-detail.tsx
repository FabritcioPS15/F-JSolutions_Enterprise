import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
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
import { FaqAccordion } from '@/components/ui/faq-accordion'
import { EMPRESA } from '@/lib/constants'
import {
  getService,
  getServicePath,
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

const quickFacts: Record<ServiceCategory, { label: string; value: string }[]> = {
  'Soporte TI': [
    { label: 'Cobertura', value: 'Remota a todo el Perú' },
    { label: 'Atención', value: 'Remota y en sitio' },
    { label: 'Diagnóstico', value: 'Sin costo' },
  ],
  'Infraestructura TI': [
    { label: 'Cobertura', value: 'Lima y proyectos a nivel nacional' },
    { label: 'Modalidad', value: 'En sitio y remota' },
    { label: 'Inicio', value: 'Diagnóstico sin costo' },
  ],
  'Desarrollo de software': [
    { label: 'Cobertura', value: 'Proyectos en todo el Perú' },
    { label: 'Modalidad', value: 'Remota y en sitio' },
    { label: 'Inicio', value: 'Diagnóstico sin costo' },
  ],
}

type ServiceDetailProps = {
  service: ServiceDefinition
  categoryCrumb: { label: string; href: string }
}

export function ServiceDetail({ service, categoryCrumb }: ServiceDetailProps) {
  const facts = quickFacts[service.category]
  const related = service.related
    .map((relatedSlug) => getService(relatedSlug))
    .filter((item) => item !== undefined)
  const path = getServicePath(service.slug)
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
    <main className="min-h-screen bg-white text-[#0F172A]">
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
      <nav aria-label="Ruta de navegación" className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <ol className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-1.5 px-4 py-3 text-[11px] text-[#475569] sm:px-6 lg:px-8">
          <li>
            <Link href="/" className="transition hover:text-[#2563EB]">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3 text-[#94A3B8]" />
          </li>
          <li>
            <Link href={categoryCrumb.href} className="transition hover:text-[#2563EB]">
              {categoryCrumb.label}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3 text-[#94A3B8]" />
          </li>
          <li aria-current="page" className="font-semibold text-[#0F172A]">
            {service.title}
          </li>
        </ol>
      </nav>

      {/* ─── Hero del servicio ─── */}
      {service.heroImage ? (
        <section className="relative overflow-hidden bg-[#050B1F]">
          <Image
            src={service.heroImage.src}
            alt={service.heroImage.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover object-center lg:object-right"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#050B1F]/70" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#050B1F] via-[#050B1F]/85 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#050B1F] via-transparent to-transparent"
          />

          <div className="relative mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl">
                {service.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-[#CBD5E1]">{service.intro}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/cotizacion"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  Solicitar cotización <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 text-sm font-bold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10"
                >
                  Hablar con un especialista
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-[#94A3B8]">
                Respuesta a solicitudes en menos de 24 horas hábiles.
              </p>
            </div>

            <dl className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                >
                  <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-[#CBD5E1] backdrop-blur transition hover:bg-white/10 hover:text-white"
              >
                <Phone className="size-4 text-[#60A5FA]" /> {EMPRESA.telefono}
              </a>
              <a
                href={`mailto:${EMPRESA.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-[#CBD5E1] backdrop-blur transition hover:bg-white/10 hover:text-white"
              >
                <Mail className="size-4 text-[#60A5FA]" /> {EMPRESA.email}
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]">
        <div className="pointer-events-none absolute -right-32 -top-24 size-96 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-[-0.045em] text-[#0F172A] sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#475569]">{service.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/cotizacion"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Solicitar cotización <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                Hablar con un especialista
              </Link>
            </div>
            <p className="mt-4 text-[11px] text-[#64748B]">
              Respuesta a solicitudes en menos de 24 horas hábiles.
            </p>
          </div>

          <aside className="rounded-3xl border border-[#E2E8F0] bg-white/90 p-6 shadow-xl shadow-[#0F172A]/5 backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
              Datos del servicio
            </p>
            <dl className="mt-4 space-y-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-start justify-between gap-4 border-b border-[#F1F5F9] pb-3 last:border-0 last:pb-0">
                  <dt className="text-xs font-semibold text-[#64748B]">{fact.label}</dt>
                  <dd className="text-right text-xs font-bold text-[#0F172A]">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 space-y-2">
              <a
                href={phoneHref}
                className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-3 py-2.5 text-xs font-semibold text-[#0F172A] transition hover:bg-[#EFF6FF]"
              >
                <Phone className="size-4 text-[#2563EB]" /> {EMPRESA.telefono}
              </a>
              <a
                href={`mailto:${EMPRESA.email}`}
                className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-3 py-2.5 text-xs font-semibold text-[#0F172A] transition hover:bg-[#EFF6FF]"
              >
                <Mail className="size-4 text-[#2563EB]" /> {EMPRESA.email}
              </a>
            </div>
          </aside>
        </div>
        </section>
      )}

      {/* ─── Qué incluye ─── */}
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
              Qué incluye
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
              Todo lo que cubre este servicio
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#475569]">
              El alcance final se ajusta a tu empresa después del diagnóstico, sin sumar servicios
              que no necesitas.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.includes.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition hover:border-[#2563EB]/30 hover:bg-white hover:shadow-lg hover:shadow-black/5"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                  <Check className="size-4" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-[#0F172A]">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-[#475569]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Cómo trabajamos ─── */}
      <section className="border-b border-[#E2E8F0] bg-[#F7F9FC]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
                Cómo trabajamos
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
                Un proceso claro, sin sorpresas
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#475569]">
              Cada etapa tiene responsables, entregables y fechas. Tú siempre sabes en qué punto
              está tu servicio.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-[#E2E8F0] bg-white p-6"
              >
                <span className="text-4xl font-extrabold text-[#CBD5E1]">{item.step}</span>
                <span className="absolute right-5 top-5 grid size-9 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <item.icon className="size-4" />
                </span>
                <h3 className="mt-2 text-sm font-bold text-[#0F172A]">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#475569]">{item.copy}</p>
                {index < process.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[#94A3B8] lg:block">
                    <ArrowRight className="size-5" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Preguntas frecuentes ─── */}
      <section id="faq" className="scroll-mt-24 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
              Preguntas frecuentes
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
              Antes de empezar
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#475569]">
              Las dudas más comunes sobre {service.title.toLowerCase()}. Si la tuya no está aquí,
              escríbenos y la respondemos.
            </p>
            <Link
              href="/contacto"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]"
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
        <section className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
                  Servicios relacionados
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
                  Suele combinarse con
                </h2>
              </div>
              <Link
                href={categoryCrumb.href}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]"
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
                    href={getServicePath(item.slug)}
                    className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#2563EB]/30 hover:shadow-lg hover:shadow-black/5"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-[#0F172A]">{item.title}</h3>
                    <p className="mt-2 flex-1 text-xs leading-5 text-[#475569]">{item.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
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
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-[#2563EB]/20 bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC] px-6 py-10 shadow-sm sm:px-10 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#2563EB]/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-[#22D3EE]/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#334155]">
                Hablemos de tu proyecto
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                ¿Necesitas {service.title.toLowerCase()} en tu empresa?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#334155]">
                Cuéntanos tu caso y recibe una propuesta con alcance claro, tiempos y costos. El
                diagnóstico inicial no tiene costo.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/cotizacion"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  Solicitar cotización <ArrowRight className="size-4" />
                </Link>
                <a
                  href={phoneHref}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                >
                  <Phone className="size-4" /> {EMPRESA.telefono}
                </a>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9] p-5">
              <a
                href={`mailto:${EMPRESA.email}`}
                className="flex items-center gap-3 text-sm font-semibold"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-white">
                  <Mail className="size-4 text-[#2563EB]" />
                </span>
                {EMPRESA.email}
              </a>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className="grid size-9 place-items-center rounded-lg bg-white">
                  <Headset className="size-4 text-[#2563EB]" />
                </span>
                {EMPRESA.horario}
              </div>
              <div className="mt-1 rounded-lg bg-white px-3 py-2 text-[11px] text-[#334155]">
                Atendemos empresas de todos los tamaños, en Lima y a nivel nacional.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
