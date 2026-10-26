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
import { QuoteHero, ServiceHero, SoftwareHero, SupportVisual } from '@/components/heroes'

type ServicePageProps = { kind: 'cotizador' | 'soporte' | 'sistemas' }

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
      'Diseñamos y desarrollamos sistemas a medida para automatizar tareas, ordenar información y hacer crecer tu negocio sin depender de hojas de cálculo.',
    icon: Code2,
    cta: 'Cuéntanos tu proyecto',
    options: [
      'Sistemas web y plataformas internas',
      'Automatización de procesos y reportes',
      'Integración de inventario, ventas y facturación',
      'Mantenimiento y evolución de software',
    ],
  },
} as const

export function ServicePage({ kind }: ServicePageProps) {
  const item = content[kind]
  const Icon = item.icon

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
            { label: 'Soporte remoto', hint: 'Atención inmediata', href: '#solicitud', icon: <Headset className="size-3.5" /> },
            { label: 'Mantenimiento', hint: 'Preventivo y correctivo', href: '#solicitud', icon: <Wrench className="size-3.5" /> },
            { label: 'Redes y Wi-Fi', hint: 'Conectividad estable', href: '/servicios#servicios', icon: <Network className="size-3.5" /> },
            { label: 'Respaldos', hint: 'Continuidad operativa', href: '/servicios#servicios', icon: <ShieldCheck className="size-3.5" /> },
          ]}
          visual={<SupportVisual />}
        />
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
          showSteps
        />
      )}

      <section
        id="solicitud"
        className="mx-auto max-w-[1180px] scroll-mt-32 px-4 pb-14 pt-4 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
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
