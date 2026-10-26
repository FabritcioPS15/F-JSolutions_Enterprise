import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Code2, Database, GitBranch, LayoutDashboard, Workflow } from 'lucide-react'
import {
  HERO_CONTAINER,
  HeroAccent,
  HeroAction,
  HeroActions,
  HeroEyebrow,
  HeroLead,
  HeroProof,
  HeroSection,
  HeroTitle,
} from '@/components/heroes/hero-primitives'
import { SoftwareVisual } from '@/components/heroes/hero-visuals'

type SoftwareHeroProps = {
  id?: string
  eyebrow?: string
  title?: ReactNode
  description?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  proof?: string[]
}

const useCases = [
  { label: 'Sistemas de gestión', hint: 'ERP y operaciones', href: '/sistemas', icon: <LayoutDashboard aria-hidden="true" className="size-3.5" /> },
  { label: 'Automatización', hint: 'Menos tareas manuales', href: '/sistemas', icon: <Workflow aria-hidden="true" className="size-3.5" /> },
  { label: 'Integraciones y API', hint: 'Sistemas conectados', href: '/sistemas', icon: <GitBranch aria-hidden="true" className="size-3.5" /> },
  { label: 'Plataformas web', hint: 'Portales y aplicaciones', href: '/sistemas', icon: <Code2 aria-hidden="true" className="size-3.5" /> },
]

/**
 * Variante E · Hero para desarrollo de software.
 * La composición visual es una interfaz de producto real: panel, métricas y flujo.
 */
export function SoftwareHero({
  id,
  eyebrow = 'Desarrollo de software',
  title,
  description = 'Diseñamos sistemas web, automatizaciones e integraciones que ordenan tu información y eliminan tareas repetitivas. Procesos más simples, decisiones con datos y una plataforma que crece contigo.',
  primary = { label: 'Cuéntanos tu proyecto', href: '#solicitud' },
  secondary = { label: 'Ver servicios TI', href: '/servicios' },
  proof = [
    'Sistemas web y plataformas internas',
    'Automatización e integraciones',
    'Acompañamiento posterior',
  ],
}: SoftwareHeroProps) {
  return (
    <HeroSection id={id}>
      <div className={`${HERO_CONTAINER} pb-10 pt-9 sm:pb-12 sm:pt-11 lg:pb-14 lg:pt-12`}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-[620px]">
            <HeroEyebrow icon={<Database aria-hidden="true" className="size-3.5" />}>
              {eyebrow}
            </HeroEyebrow>

            <HeroTitle size="lg">
              {title ?? (
                <>
                  Software a medida para procesos que <HeroAccent>ya no escalan</HeroAccent>.
                </>
              )}
            </HeroTitle>

            <HeroLead>{description}</HeroLead>

            <HeroActions>
              <HeroAction href={primary.href}>{primary.label}</HeroAction>
              <HeroAction href={secondary.href} variant="secondary">
                {secondary.label}
              </HeroAction>
            </HeroActions>

            {proof.length > 0 && <HeroProof items={proof} />}
          </div>

          <SoftwareVisual />
        </div>

        <div className="hero-reveal hero-delay-5 mt-9 border-t border-[#E2E8F0] pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
            Qué podemos construir
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white/80 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-[#2563EB]/35 hover:bg-white hover:shadow-[0_12px_26px_-22px_rgba(15,23,42,0.4)]"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-bold text-[#0F172A]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[9px] text-[#64748B]">
                    {item.hint}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-[#94A3B8] transition group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </HeroSection>
  )
}
