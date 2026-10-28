import type { ReactNode } from 'react'
import { FileText } from 'lucide-react'
import {
  HERO_CONTAINER,
  HeroAccent,
  HeroAction,
  HeroActions,
  HeroEyebrow,
  HeroLead,
  HeroSection,
  HeroTitle,
} from '@/components/heroes/hero-primitives'
import { QuoteSummaryVisual } from '@/components/heroes/hero-visuals'

type QuoteHeroProps = {
  id?: string
  eyebrow?: string
  title?: ReactNode
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

/**
 * Variante C · Hero para cotizaciones.
 * Prioriza claridad y confianza, sin simular un proceso de compra online.
 */
export function QuoteHero({
  id,
  eyebrow = 'Cotización asistida',
  title,
  description = 'Reúne equipos, servicios o infraestructura en una sola solicitud. Revisamos tu caso y te enviamos una propuesta clara con alternativas, disponibilidad y tiempos de entrega.',
  primaryLabel = 'Comenzar cotización',
  primaryHref = '#cotizacion-formulario',
  secondaryLabel = 'Hablar con un asesor',
  secondaryHref = '/contacto',
}: QuoteHeroProps) {
  return (
    <HeroSection id={id}>
      <div className={`${HERO_CONTAINER} pb-10 pt-9 sm:pb-12 sm:pt-11 lg:pb-14 lg:pt-12`}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-[620px]">
            <HeroTitle size="lg">
              {title ?? (
                <>
                  Cotiza lo que necesitas, <HeroAccent>sin complicaciones</HeroAccent>.
                </>
              )}
            </HeroTitle>

            <HeroLead>{description}</HeroLead>

            <HeroActions>
              <HeroAction href={primaryHref}>{primaryLabel}</HeroAction>
              <HeroAction href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </HeroAction>
            </HeroActions>
          </div>

          <QuoteSummaryVisual />
        </div>
      </div>
    </HeroSection>
  )
}
