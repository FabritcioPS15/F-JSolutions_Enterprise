import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Code2,
  Headset,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  MonitorCog,
  Phone,
  Send,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { EditorialHero } from '@/components/heroes'
import { HeroAction } from '@/components/heroes/hero-primitives'
import { ContactForm } from '@/components/forms/contact-form'
import { EMPRESA } from '@/lib/constants'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'

const expectations = [
  {
    title: 'Una respuesta de una persona',
    copy: 'Tu consulta la lee alguien del equipo técnico, no un formulario automático.',
  },
  {
    title: 'Una recomendación concreta',
    copy: 'Te decimos qué haríamos en tu caso, con qué alcance y qué necesitamos de ti.',
  },
  {
    title: 'Honestidad sobre el siguiente paso',
    copy: 'Si no somos la mejor opción para tu necesidad, te lo decimos antes de cotizar.',
  },
]

const channels = [
  {
    icon: MonitorCog,
    title: 'Necesito equipos',
    copy: 'Laptops, servidores, monitores o implementación de una oficina completa.',
    href: '/cotizacion',
    cta: 'Ir al cotizador',
  },
  {
    icon: Headset,
    title: 'Necesito soporte',
    copy: 'Una incidencia, mantenimiento preventivo o un plan de soporte recurrente.',
    href: '/soporte-ti',
    cta: 'Ver soporte TI',
  },
  {
    icon: Code2,
    title: 'Necesito un sistema',
    copy: 'Automatizar un proceso, ordenar información o construir una plataforma interna.',
    href: '/sistemas',
    cta: 'Ver desarrollo',
  },
  {
    icon: HelpCircle,
    title: 'Tengo una duda',
    copy: 'Revisa cómo trabajamos, qué incluye un proyecto y las preguntas más comunes.',
    href: '/preguntas-frecuentes',
    cta: 'Ver preguntas frecuentes',
  },
]

export function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <EnhancedHeader />

      <EditorialHero
        title={
          <>
            Conversemos sobre lo que tu empresa{' '}
            <span className="text-[#2563EB]">necesita</span>.
          </>
        }
        description="Cuéntanos qué está pasando, qué quieres implementar o qué decisión técnica necesitas tomar. Te respondemos con un siguiente paso concreto, no con un discurso de ventas."
        actions={
          <>
            <HeroAction href="#formulario">Escribir un mensaje</HeroAction>
            <HeroAction href="/cotizacion" variant="secondary">
              Solicitar cotización
            </HeroAction>
          </>
        }
        aside={<ContactCard />}
      />

      {/* Formulario */}
      <section id="formulario" className="scroll-mt-32 bg-white">
        <div className={`${CONTAINER} py-12 sm:py-14 lg:py-16`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Formulario de contacto
              </p>
              <h2 className="mt-3 max-w-[18ch] font-heading text-[clamp(1.8rem,1.1rem+2.2vw,2.85rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0F172A]">
                Primero escuchamos. Después proponemos.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#475569]">
                No necesitas tener todo definido. Si no sabes qué solución elegir, describe el
                problema y te ayudamos a ordenar las alternativas.
              </p>

              <ul className="mt-6 space-y-4">
                {expectations.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                      <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-[#64748B]">{item.copy}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
                  Canales directos
                </p>
                <div className="mt-3 space-y-2.5">
                  <a
                    href={`tel:${EMPRESA.telefono.replace(/\s/g, '')}`}
                    className="group flex items-center gap-2.5 text-xs font-semibold text-[#334155] transition hover:text-[#2563EB]"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                      <Phone aria-hidden="true" className="size-3.5" />
                    </span>
                    {EMPRESA.telefono}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="ml-auto size-3.5 text-[#94A3B8] transition group-hover:text-[#2563EB]"
                    />
                  </a>
                  <a
                    href={EMPRESA.redesSociales.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2.5 text-xs font-semibold text-[#334155] transition hover:text-[#2563EB]"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                      <MessageCircle aria-hidden="true" className="size-3.5" />
                    </span>
                    WhatsApp comercial
                    <ArrowUpRight
                      aria-hidden="true"
                      className="ml-auto size-3.5 text-[#94A3B8] transition group-hover:text-[#2563EB]"
                    />
                  </a>
                  <a
                    href={`mailto:${EMPRESA.email}`}
                    className="group flex items-center gap-2.5 text-xs font-semibold text-[#334155] transition hover:text-[#2563EB]"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                      <Mail aria-hidden="true" className="size-3.5" />
                    </span>
                    {EMPRESA.email}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="ml-auto size-3.5 text-[#94A3B8] transition group-hover:text-[#2563EB]"
                    />
                  </a>
                </div>
              </div>

              <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-[#64748B]">
                <Send aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#2563EB]" />
                <span>
                  ¿Ya sabes qué equipos necesitas? Usa el{' '}
                  <Link href="/cotizacion" className="font-bold text-[#2563EB] hover:text-[#1D4ED8]">
                    cotizador
                  </Link>{' '}
                  para enviar una lista detallada.
                </span>
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Canales según necesidad */}
      <section className="border-y border-[#E2E8F0] bg-[#F7F9FC]">
        <div className={`${CONTAINER} py-12 sm:py-14 lg:py-16`}>
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              Elige el canal correcto
            </p>
            <h2 className="mt-3 font-heading text-[clamp(1.7rem,1.1rem+2vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0F172A]">
              Podemos empezar por donde tú estés.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#475569]">
              No todas las consultas necesitan el mismo camino. Estos accesos te llevan directo a lo
              que necesitas.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <Link
                key={channel.title}
                href={channel.href}
                className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#2563EB]/30 hover:shadow-[0_22px_46px_-36px_rgba(15,23,42,0.45)]"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
                  <channel.icon aria-hidden="true" className="size-4.5" />
                </span>
                <h3 className="mt-3.5 font-heading text-sm font-bold text-[#0F172A]">
                  {channel.title}
                </h3>
                <p className="mt-2 flex-1 text-xs leading-5 text-[#64748B]">{channel.copy}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB]">
                  {channel.cta}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="bg-white">
        <div className={`${CONTAINER} py-10 sm:py-12`}>
          <div className="flex flex-col gap-4 rounded-2xl border border-[#DBEAFE] bg-[#F8FBFF] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                <Clock aria-hidden="true" className="size-4.5" />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-[#0F172A]">
                  ¿Necesitas una respuesta inmediata?
                </p>
                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                  Llámanos de lunes a sábado, de 9:00 a 18:00. Para consultas fuera de horario,
                  escríbenos y respondemos el siguiente día hábil.
                </p>
              </div>
            </div>
            <a
              href={`tel:${EMPRESA.telefono.replace(/\s/g, '')}`}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              <Phone aria-hidden="true" className="size-4" />
              Llamar ahora
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

function ContactCard() {
  return (
    <div className="hero-float-soft relative overflow-hidden rounded-[26px] border border-[#E2E8F0] bg-white/95 p-5 shadow-[0_36px_90px_-48px_rgba(15,23,42,0.5)] backdrop-blur">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,#F5F9FF_0%,rgba(255,255,255,0)_100%)]"
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-white shadow-[0_12px_24px_-12px_rgba(37,99,235,0.7)]">
            <MessageCircle aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold tracking-[-0.02em] text-[#0F172A]">
              Contacto directo
            </p>
            <p className="mt-0.5 text-[10px] text-[#64748B]">Ventas, soporte y proyectos</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <a
            href={`tel:${EMPRESA.telefono.replace(/\s/g, '')}`}
            className="group flex items-center gap-3 rounded-xl border border-[#EEF2F7] bg-white px-3 py-2.5 transition hover:border-[#2563EB]/30 hover:bg-[#FBFDFF]"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <Phone aria-hidden="true" className="size-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                Teléfono
              </span>
              <span className="block text-[11px] font-bold text-[#0F172A]">{EMPRESA.telefono}</span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 shrink-0 text-[#94A3B8] transition group-hover:text-[#2563EB]"
            />
          </a>

          <a
            href={`mailto:${EMPRESA.email}`}
            className="group flex items-center gap-3 rounded-xl border border-[#EEF2F7] bg-white px-3 py-2.5 transition hover:border-[#2563EB]/30 hover:bg-[#FBFDFF]"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <Mail aria-hidden="true" className="size-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                Correo
              </span>
              <span className="block truncate text-[11px] font-bold text-[#0F172A]">
                {EMPRESA.email}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 shrink-0 text-[#94A3B8] transition group-hover:text-[#2563EB]"
            />
          </a>

          <div className="flex items-center gap-3 rounded-xl border border-[#EEF2F7] bg-white px-3 py-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <MapPin aria-hidden="true" className="size-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                Oficina
              </span>
              <span className="block truncate text-[11px] font-bold text-[#0F172A]">
                Av. Javier Prado Este, Lima
              </span>
            </span>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-[#DBEAFE] bg-[#F8FBFF] p-3.5">
          <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#1D4ED8]">
            Tiempo de respuesta
          </p>
          <p className="mt-1.5 text-[12px] font-semibold leading-5 text-[#0F172A]">
            Menos de 24 horas hábiles.
          </p>
          <p className="mt-1 text-[9.5px] leading-4 text-[#64748B]">
            Si tu caso es urgente, llámanos directamente.
          </p>
        </div>
      </div>
    </div>
  )
}
