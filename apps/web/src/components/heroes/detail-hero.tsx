import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  HERO_CONTAINER,
  HeroAction,
  HeroActions,
  HeroEyebrow,
  HeroLead,
  HeroSection,
  HeroTitle,
} from '@/components/heroes/hero-primitives'

type DetailHeroProps = {
  eyebrow: string
  title: ReactNode
  description: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
  visual: ReactNode
  backHref?: string
  backLabel?: string
}

/**
 * Variante F · Hero para páginas de detalle de servicio.
 * Prioriza el mensaje y deja que la composición visual explique el alcance.
 */
export function DetailHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  visual,
  backHref = '/servicios',
  backLabel = 'Volver a servicios',
}: DetailHeroProps) {
  return (
    <HeroSection>
      <div className={`${HERO_CONTAINER} pb-10 pt-7 sm:pb-12 sm:pt-9 lg:pb-14 lg:pt-10`}>
        <Link
          href={backHref}
          className="hero-reveal inline-flex items-center gap-1.5 rounded-md text-[11px] font-semibold text-[#64748B] transition hover:text-[#2563EB]"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {backLabel}
        </Link>

        <div className="mt-5 grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.9fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-[620px]">
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
          </div>

          {visual}
        </div>
      </div>
    </HeroSection>
  )
}
