import type { ReactNode } from 'react'
import { Database } from 'lucide-react'
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
      </div>
    </HeroSection>
  )
}
