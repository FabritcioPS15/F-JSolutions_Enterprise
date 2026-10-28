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
  eyebrow?: string
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
  visual,
}: ServiceHeroProps) {
  return (
    <HeroSection id={id}>
      <div className={`${HERO_CONTAINER} pb-10 pt-9 sm:pb-12 sm:pt-11 lg:pb-14 lg:pt-12`}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12 xl:gap-16">
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

            {proof && proof.length > 0 && <HeroProof items={proof} />}
          </div>

          {visual ?? <InfrastructureVisual />}
        </div>
      </div>
    </HeroSection>
  )
}
