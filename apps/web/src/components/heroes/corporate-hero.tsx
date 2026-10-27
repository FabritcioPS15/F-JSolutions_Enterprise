import { MapPin } from 'lucide-react'
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
import { OpsConsoleVisual } from '@/components/heroes/hero-visuals'

/**
 * Variante A · Hero corporativo principal.
 * Usado en la portada para presentar F&J Systems y su propuesta integral.
 */
export function CorporateHero() {
  return (
    <HeroSection id="inicio">
      <div className={`${HERO_CONTAINER} pb-8 pt-6 sm:pb-10 sm:pt-9 lg:pb-16 lg:pt-14`}>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-12 xl:gap-16">
          <div className="order-1 max-w-[620px] lg:order-1">
            <HeroTitle size="lg">
              Tecnología que <HeroAccent>mueve</HeroAccent> tu operación.
            </HeroTitle>

            <HeroLead>
              Diseñamos, implementamos y damos soporte a la infraestructura, el software y los
              equipos que tu empresa necesita. Un solo socio tecnológico, desde la primera
              cotización hasta el soporte del día a día.
            </HeroLead>

            <HeroActions>
              <HeroAction href="/cotizacion">Solicitar cotización</HeroAction>
              <HeroAction href="/servicios" variant="secondary">
                Explorar soluciones
              </HeroAction>
            </HeroActions>

            <HeroProof
              items={[
                'Atención en Lima y todo el Perú',
                'Diagnóstico sin costo',
                'Soporte remoto y en sitio',
              ]}
            />
          </div>

          <div className="order-2 lg:order-2">
            <OpsConsoleVisual />
          </div>
        </div>
      </div>
    </HeroSection>
  )
}
