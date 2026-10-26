import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  HERO_CONTAINER,
  HeroAction,
  HeroActions,
  HeroEyebrow,
  HeroLead,
  HeroProof,
  HeroSection,
  HeroTitle,
} from '@/components/heroes/hero-primitives'
import { InfrastructureVisual } from '@/components/heroes/hero-visuals'

export type ServiceHeroLink = {
  label: string
  href: string
  hint?: string
  icon?: ReactNode
}

type ServiceHeroProps = {
  id?: string
  eyebrow: string
  title: ReactNode
  description: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
  proof?: string[]
  related?: ServiceHeroLink[]
  visual?: ReactNode
}

/**
 * Variante D · Hero para servicios TI.
 * Centrado en el problema que resuelve el servicio, con un mapa de infraestructura
 * o una mesa de ayuda como composición visual.
 */
export function ServiceHero({
  id,
  eyebrow,
  title,
  description,
  primary,
  secondary,
  proof,
  related,
  visual,
}: ServiceHeroProps) {
  return (
    <HeroSection id={id}>
      <div className={`${HERO_CONTAINER} pb-10 pt-9 sm:pb-12 sm:pt-11 lg:pb-14 lg:pt-12`}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-[620px]">
            <HeroEyebrow>{eyebrow}</HeroEyebrow>

            <HeroTitle size="lg">{title}</HeroTitle>

            <HeroLead>{description}</HeroLead>

            <HeroActions>
              <HeroAction href={primary.href}>{primary.label}</HeroAction>
              {secondary && (
                <HeroAction href={secondary.href} variant="secondary">
                  {secondary.label}
                </HeroAction>
              )}
            </HeroActions>

            {proof && proof.length > 0 && <HeroProof items={proof} />}
          </div>

          {visual ?? <InfrastructureVisual />}
        </div>

        {related && related.length > 0 && (
          <div className="hero-reveal hero-delay-5 mt-9 border-t border-[#E2E8F0] pt-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                Servicios relacionados
              </p>
              <p className="text-[10.5px] text-[#94A3B8]">
                Combínalos según el tamaño y la madurez de tu operación.
              </p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white/80 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-[#2563EB]/35 hover:bg-white hover:shadow-[0_12px_26px_-22px_rgba(15,23,42,0.4)]"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
                    {item.icon ?? <ArrowUpRight aria-hidden="true" className="size-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-bold text-[#0F172A]">
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="mt-0.5 block truncate text-[9px] text-[#64748B]">
                        {item.hint}
                      </span>
                    )}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-[#94A3B8] transition group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </HeroSection>
  )
}
