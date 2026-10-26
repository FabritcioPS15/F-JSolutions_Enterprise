import type { ReactNode } from 'react'
import { ClipboardList, FileText, MessageSquare } from 'lucide-react'
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
  proof?: string[]
  showSteps?: boolean
}

const defaultProof = [
  'Respuesta en menos de 24 h hábiles',
  'Sin compromiso de compra',
  'Asesoría directa',
]

const steps = [
  { icon: ClipboardList, title: 'Reúne tus productos', copy: 'Agrega equipos o describe el servicio.' },
  { icon: MessageSquare, title: 'Cuéntanos tu caso', copy: 'Uso, cantidades y fecha requerida.' },
  { icon: FileText, title: 'Recibe tu propuesta', copy: 'Alternativas, disponibilidad y plazos.' },
]

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
  proof = defaultProof,
  showSteps = false,
}: QuoteHeroProps) {
  return (
    <HeroSection id={id}>
      <div className={`${HERO_CONTAINER} pb-10 pt-9 sm:pb-12 sm:pt-11 lg:pb-14 lg:pt-12`}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-[620px]">
            <HeroEyebrow icon={<FileText aria-hidden="true" className="size-3.5" />}>
              {eyebrow}
            </HeroEyebrow>

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

            <HeroProof items={proof} />

            {showSteps && (
              <div className="hero-reveal hero-delay-5 mt-8 grid gap-2 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-xl border border-[#E2E8F0] bg-white/80 p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 place-items-center rounded-md bg-[#EFF6FF] text-[#2563EB]">
                        <step.icon aria-hidden="true" className="size-3" />
                      </span>
                      <span className="font-mono text-[8.5px] font-bold text-[#94A3B8]">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-2 text-[10.5px] font-bold text-[#0F172A]">{step.title}</p>
                    <p className="mt-0.5 text-[9px] leading-4 text-[#64748B]">{step.copy}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <QuoteSummaryVisual />
        </div>
      </div>
    </HeroSection>
  )
}
