'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Code2,
  Headset,
  Mail,
  MonitorCog,
  Network,
  Phone,
  Server,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import {
  InfrastructureVisual,
  QuoteHero,
  ServiceHero,
  SoftwareHero,
  SupportVisual,
} from '@/components/heroes'
import { getServicesByCategory } from '@/lib/services'

type ServicePageProps = { kind: 'cotizador' | 'soporte' | 'sistemas' | 'infraestructura' }

const content = {
  cotizador: {
    eyebrow: 'Cotización personalizada',
    title: 'La tecnología correcta empieza con una buena recomendación.',
    description:
      'Cuéntanos qué necesitas y recibe una propuesta clara para tu PC, oficina o empresa. Evaluamos tu caso, el uso real y el presupuesto antes de recomendarte.',
    icon: MonitorCog,
    cta: 'Solicitar cotización',
    options: [
      'PC para gaming, estudio o trabajo',
      'Servidores y almacenamiento para empresas',
      'Equipamiento completo para oficinas',
      'Componentes y periféricos compatibles',
    ],
  },
  soporte: {
    eyebrow: 'Soporte TI',
    title: 'Tu operación no puede detenerse.',
    description:
      'Resolvemos incidencias, mantenemos tus equipos y construimos una infraestructura tecnológica segura para que puedas enfocarte en tu negocio.',
    icon: Headset,
    cta: 'Hablar con un especialista',
    options: [
      'Soporte remoto y atención en sitio',
      'Redes, Wi-Fi y cableado estructurado',
      'Mantenimiento de PCs, laptops y servidores',
      'Seguridad, respaldos y continuidad operativa',
    ],
  },
  sistemas: {
    eyebrow: 'Desarrollo de sistemas',
    title: 'Convertimos tus procesos en soluciones digitales.',
    description:
      'Diseñamos y desarrollamos páginas web y sistemas a medida para automatizar tareas, ordenar información y hacer crecer tu negocio sin depender de hojas de cálculo.',
    icon: Code2,
    cta: 'Cuéntanos tu proyecto',
    options: [
      'Páginas web, landing pages y tiendas online',
      'Sistemas web y plataformas internas',
      'Automatización de procesos y reportes',
      'Integración de inventario, ventas y facturación',
      'Mantenimiento y evolución de software',
    ],
  },
  infraestructura: {
    eyebrow: 'Infraestructura TI',
    title: 'La base tecnológica de tu empresa, bien construida.',
    description:
      'Diseñamos e implementamos redes, cableado estructurado, servidores y equipamiento para que tu operación tenga conectividad estable, orden y capacidad de crecer.',
    icon: Network,
    cta: 'Diseñar mi infraestructura',
    options: [
      'Redes y Wi-Fi para oficinas',
      'Cableado estructurado certificado',
      'Servidores, NAS y almacenamiento',
      'Equipamiento tecnológico empresarial',
      'Diagnóstico y rediseño de infraestructura',
    ],
  },
} as const

export function ServicePage({ kind }: ServicePageProps) {
  const item = content[kind]
  const Icon = item.icon
  const softwareServices = getServicesByCategory('Desarrollo de software')
  const infrastructureServices = getServicesByCategory('Infraestructura TI')

  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <EnhancedHeader />

      {kind === 'sistemas' && (
        <SoftwareHero
          title={
            <>
              Convertimos tus procesos en{' '}
              <span className="text-[#2563EB]">soluciones digitales</span>.
            </>
          }
          description={item.description}
          primary={{ label: 'Cuéntanos tu proyecto', href: '#solicitud' }}
          secondary={{ label: 'Ver servicios TI', href: '/servicios' }}
        />
      )}

      {kind === 'sistemas' && (
        <section className="border-b border-[#E5EAF0] bg-white">
          <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5B21B6]">
                Servicios de desarrollo
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                ¿Qué sistema necesitas construir?
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#475569]">
                Cada servicio tiene su propio alcance y forma de trabajo. Elige uno para ver qué
                incluye y cómo lo implementamos.
              </p>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {softwareServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/sistemas/${service.slug}`}
                  className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition hover:border-[#2563EB]/30 hover:bg-white hover:shadow-lg hover:shadow-black/5"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-white text-[#2563EB] shadow-sm transition group-hover:bg-[#2563EB] group-hover:text-white">
                    <Code2 className="size-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-[#0F172A]">{service.title}</h3>
                  <p className="mt-1.5 flex-1 text-xs leading-5 text-[#475569]">{service.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
                    Conocer el servicio <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {kind === 'soporte' && (
        <ServiceHero
          eyebrow={item.eyebrow}
          title={
            <>
              Tu operación <span className="text-[#2563EB]">no puede detenerse</span>.
            </>
          }
          description={item.description}
          primary={{ label: 'Hablar con un especialista', href: '#solicitud' }}
          secondary={{ label: 'Ver planes y cobertura', href: '/servicios' }}
          proof={['Soporte remoto y en sitio', 'Mantenimiento preventivo', 'Respuesta según SLA']}
          related={[
            { label: 'Soporte técnico', hint: 'Remoto y en sitio', href: '/servicios/soporte-tecnico', icon: <Headset className="size-3.5" /> },
            { label: 'Mantenimiento', hint: 'Preventivo y correctivo', href: '/servicios/mantenimiento-de-equipos', icon: <Wrench className="size-3.5" /> },
            { label: 'Redes y Wi-Fi', hint: 'Conectividad estable', href: '/servicios/redes-y-conectividad', icon: <Network className="size-3.5" /> },
            { label: 'Respaldos', hint: 'Continuidad operativa', href: '/servicios/implementacion-de-infraestructura', icon: <ShieldCheck className="size-3.5" /> },
          ]}
          visual={<SupportVisual />}
        />
      )}

      {kind === 'infraestructura' && (
        <>
          <ServiceHero
            eyebrow={item.eyebrow}
            title={
              <>
                Infraestructura TI que <span className="text-[#2563EB]">sostiene tu operación</span>.
              </>
            }
            description={item.description}
            primary={{ label: 'Diseñar mi infraestructura', href: '#solicitud' }}
            secondary={{ label: 'Ver soporte TI', href: '/soporte-ti' }}
            proof={['Redes y cableado estructurado', 'Servidores y almacenamiento', 'Instalación en sitio']}
            visual={<InfrastructureVisual />}
          />

          <section className="border-b border-[#E5EAF0] bg-white">
            <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
              <div className="max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5B21B6]">
                  Servicios de infraestructura
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                  ¿Qué infraestructura necesitas implementar?
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#475569]">
                  Cada servicio tiene su propio alcance y forma de trabajo. Elige uno para ver qué
                  incluye y cómo lo implementamos.
                </p>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {infrastructureServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/servicios/${service.slug}`}
                    className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition hover:border-[#2563EB]/30 hover:bg-white hover:shadow-lg hover:shadow-black/5"
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-white text-[#2563EB] shadow-sm transition group-hover:bg-[#2563EB] group-hover:text-white">
                      <Network className="size-4" />
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-[#0F172A]">{service.title}</h3>
                    <p className="mt-1.5 flex-1 text-xs leading-5 text-[#475569]">{service.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
                      Conocer el servicio <ArrowRight className="size-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {kind === 'cotizador' && (
        <QuoteHero
          eyebrow={item.eyebrow}
          title={
            <>
              Tu próxima configuración, <span className="text-[#2563EB]">bien pensada</span>.
            </>
          }
          description={item.description}
          primaryLabel="Solicitar cotización"
          primaryHref="#solicitud"
          secondaryLabel="Ver productos"
          secondaryHref="/productos"
        />
      )}

      <section
        id="solicitud"
        className="mx-auto max-w-[1180px] scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-28 px-4 pb-14 pt-4 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5B21B6]">
              Cuéntanos tu necesidad
            </p>
            <h2 className="mt-2 max-w-lg text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
              ¿En qué podemos ayudarte?
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#475569]">
              Selecciona un punto de partida y un asesor se pondrá en contacto contigo para revisar
              el alcance, las alternativas y el siguiente paso.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                { icon: ShieldCheck, title: 'Asesoría real', copy: 'Te orientamos según tu contexto y presupuesto.' },
                { icon: Server, title: 'Soluciones escalables', copy: 'Pensadas para crecer contigo.' },
                { icon: Wrench, title: 'Acompañamiento', copy: 'Seguimos contigo después de la entrega.' },
              ].map((benefit) => (
                <li key={benefit.title} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <benefit.icon aria-hidden="true" className="size-4" />
                  </span>
                  <span>
                    <span className="block font-heading text-sm font-bold text-[#0F172A]">{benefit.title}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-[#64748B]">{benefit.copy}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="tel:+51999888777"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 text-xs font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
              >
                <Phone aria-hidden="true" className="size-3.5" /> +51 999 888 777
              </a>
              <a
                href="mailto:ventas@fjsolutions.pe"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 text-xs font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
              >
                <Mail aria-hidden="true" className="size-3.5" /> ventas@fjsolutions.pe
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-[#0F172A]">{item.cta}</p>
                <p className="text-[11px] text-[#64748B]">Respuesta en menos de 24 horas hábiles.</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              {item.options.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 text-xs font-semibold text-[#334155] transition hover:border-[#9DBBF5] hover:bg-[#FBFDFF]"
                >
                  <input type="checkbox" className="size-4 accent-[#2563EB]" />
                  {option}
                </label>
              ))}
            </div>

            <label className="mt-4 block text-xs font-semibold text-[#0F172A]">
              Cuéntanos brevemente
              <span className="ml-1 font-normal text-[#94A3B8]">(opcional)</span>
              <textarea
                className="mt-2 min-h-24 w-full resize-none rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm font-normal outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                placeholder="Describe tu necesidad, cantidades o fecha requerida..."
              />
            </label>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/cotizacion"
                className="group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Continuar en el cotizador
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
              >
                <Check aria-hidden="true" className="size-4" />
                Hablar con un asesor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5EAF0] bg-[#F8FAFC]">
        <div className="mx-auto grid max-w-[1180px] gap-6 px-4 py-9 sm:grid-cols-3 sm:px-6">
          {[
            { icon: ShieldCheck, title: 'Asesoría real', copy: 'Te orientamos según tu contexto.' },
            { icon: Server, title: 'Soluciones escalables', copy: 'Pensadas para crecer contigo.' },
            { icon: Wrench, title: 'Acompañamiento', copy: 'Seguimos contigo después de la entrega.' },
          ].map((trust) => (
            <div key={trust.title} className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                <trust.icon aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="font-heading text-sm font-bold">{trust.title}</p>
                <p className="mt-1 text-sm text-[#64748B]">{trust.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
