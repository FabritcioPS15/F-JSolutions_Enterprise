import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  HERO_BODY,
  HERO_CONTAINER,
  HERO_VIEWPORT_BODY,
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
    <HeroSection viewport>
      <div className={`${HERO_CONTAINER} ${HERO_BODY} ${HERO_VIEWPORT_BODY}`}>
        <Link
          href={backHref}
          className="hero-reveal inline-flex items-center gap-1.5 rounded-md text-[11px] font-semibold text-muted-foreground transition hover:text-blue-ink"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {backLabel}
        </Link>

        <div className="mt-5 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.9fr)] lg:gap-12 xl:gap-16">
          <div className="min-w-0 max-w-[620px]">
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

          <div className="hidden min-w-0 sm:block">{visual}</div>
        </div>
      </div>
    </HeroSection>
  )
}
