import Link from 'next/link'
import { Headset, Laptop, Server } from 'lucide-react'
import {
  HERO_CONTAINER,
  HeroAction,
  HeroActions,
  HeroLead,
  HeroSection,
  HeroTitle,
} from '@/components/heroes/hero-primitives'

const capabilities = [
  {
    icon: Laptop,
    label: 'Equipos y licencias',
    hint: 'Catálogo corporativo',
    href: '/productos',
  },
  {
    icon: Server,
    label: 'Infraestructura y redes',
    hint: 'Implementación y monitoreo',
    href: '/servicios',
  },
  {
    icon: Headset,
    label: 'Soporte especializado',
    hint: 'Remoto y en sitio',
    href: '/soporte-ti',
  },
]

/**
 * Variante B · Hero de impacto.
 * Composición centrada sobre fondo oscuro, sin visual lateral, con accesos
 * directos a las tres líneas de servicio.
 */
export function SpotlightHero() {
  return (
    <HeroSection id="inicio" fill overlay={false} className="bg-[#070B18]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.3),transparent_62%)]" />
        <div className="absolute -left-40 top-1/4 size-[420px] rounded-full bg-[#7C3AED]/20 blur-[120px]" />
        <div className="absolute -right-28 -top-24 size-[360px] rounded-full bg-[#06B6D4]/10 blur-[110px]" />
        <div className="hero-grid absolute inset-0 opacity-[0.14]" />
      </div>

      <div className={`${HERO_CONTAINER} flex flex-1 items-center py-[clamp(1.75rem,4vh,3.5rem)]`}>
        <div className="mx-auto w-full max-w-[920px] text-center">
          <span className="hero-reveal inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#C4B5FD] backdrop-blur">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#A78BFA] shadow-[0_0_0_3px_rgba(167,139,250,0.25)]"
            />
            Socio tecnológico para empresas
          </span>

          <HeroTitle size="xl" className="mx-auto max-w-[24ch] text-white">
            Infraestructura, software y soporte que{' '}
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
              trabajan juntos
            </span>
            .
          </HeroTitle>

          <HeroLead className="mx-auto text-[#CBD5E1]">
            Un solo socio para comprar, implementar y mantener tu tecnología. Desde equipos
            corporativos hasta redes, servidores y soporte del día a día.
          </HeroLead>

          <HeroActions className="justify-center">
            <HeroAction href="/cotizacion">Solicitar cotización</HeroAction>
            <HeroAction href="/servicios" variant="secondary">
              Explorar soluciones
            </HeroAction>
          </HeroActions>

          <div className="hero-reveal hero-delay-4 mt-9 grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-left backdrop-blur">
            {capabilities.map((capability) => {
              const Icon = capability.icon

              return (
                <Link
                  key={capability.label}
                  href={capability.href}
                  className="group flex flex-col items-start gap-2 p-3 transition hover:bg-white/[0.06] sm:flex-row sm:items-center sm:gap-3 sm:p-4"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-[#C4B5FD] transition group-hover:bg-[#2563EB] group-hover:text-white">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold leading-4 text-white sm:text-xs">
                      {capability.label}
                    </span>
                    <span className="mt-0.5 hidden text-[10px] leading-4 text-[#94A3B8] sm:block">
                      {capability.hint}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </HeroSection>
  )
}
