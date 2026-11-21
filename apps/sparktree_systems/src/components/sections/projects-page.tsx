import Link from 'next/link'
import {
  ArrowRight,
  ClipboardList,
  FileCheck2,
  Layers,
  Lock,
  ShieldCheck,
  Target,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { EditorialHero } from '@/components/heroes'
import { HeroAction } from '@/components/heroes/hero-primitives'
import { Reveal } from '@/components/home/reveal'
import { ProcessSequence } from '@/components/ui/process-sequence'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'

const caseFields = [
  {
    icon: Target,
    title: 'Contexto',
    copy: 'Sector, tamaño de la operación y situación inicial, publicados solo con autorización del cliente.',
  },
  {
    icon: ClipboardList,
    title: 'Reto tecnológico',
    copy: 'El problema concreto que debía resolverse, sin generalidades ni promesas fuera del alcance.',
  },
  {
    icon: Layers,
    title: 'Solución implementada',
    copy: 'Qué se instaló, configuró o desarrolló, con tecnologías, plazos y responsables identificados.',
  },
  {
    icon: FileCheck2,
    title: 'Resultados verificables',
    copy: 'Indicadores medidos junto al cliente y documentados. Sin cifras estimadas ni resultados inventados.',
  },
]

const caseSlots = [
  {
    sector: 'Caso 01',
    title: 'Espacio reservado para el primer proyecto publicado',
  },
  {
    sector: 'Caso 02',
    title: 'Espacio reservado para el siguiente proyecto',
  },
  {
    sector: 'Caso 03',
    title: 'Espacio reservado para el siguiente proyecto',
  },
]

export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-card text-foreground selection:bg-[#1769AA]/15 selection:text-blue-ink">
      <EnhancedHeader />

      <main>
        <EditorialHero
          id="hero-proyectos"
          title={
            <>
              Proyectos y experiencia, <span className="text-blue-ink">documentados con rigor</span>
            </>
          }
          description="Publicamos un proyecto solo cuando el alcance es real, los resultados se pueden sustentar y el cliente autoriza su difusión. Mientras preparamos los primeros casos, aquí está el estándar con el que documentamos cada implementación."
          meta={[
            'Casos publicados con autorización',
            'Resultados verificables, sin estimaciones',
            'Documentación técnica por proyecto',
            'Nombres y logos según consentimiento',
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <HeroAction href="/contacto" variant="primary">
                Cuéntanos tu proyecto
              </HeroAction>
              <HeroAction href="/como-trabajamos" variant="secondary">
                Ver metodología
              </HeroAction>
            </div>
          }
        />

        {/* Estándar de documentación */}
        <section className="border-y border-border bg-muted py-16 sm:py-20" aria-labelledby="estandar-title">
          <div className={CONTAINER}>
            <Reveal className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">Estándar de publicación</p>
              <h2 id="estandar-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Qué incluirá cada caso
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Una ficha completa permite evaluar si la solución se parece a lo que tu empresa necesita. Por eso no
                publicamos fragmentos sueltos ni testimonios sin contexto.
              </p>
            </Reveal>

            <ProcessSequence layout="grid" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {caseFields.map((field, index) => {
                const Icon = field.icon
                return (
                  <div
                    key={field.title}
                    className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition duration-300 hover:border-[#1769AA]/35 hover:shadow-sm motion-reduce:transition-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="process-number font-heading text-xl font-extrabold text-muted-foreground/50">
                        0{index + 1}
                      </span>
                      <span className="grid size-8 place-items-center rounded-lg bg-tint-blue text-blue-ink">
                        <Icon className="size-4" />
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-sm font-bold text-foreground">{field.title}</h3>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">{field.copy}</p>
                  </div>
                )
              })}
            </ProcessSequence>

            <Reveal delay={80}>
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#1769AA]/20 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                    <Lock className="size-4" />
                  </span>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-bold text-foreground">Privacidad por defecto:</span> no mostramos nombres de
                    personas, logos ni cifras internas sin permiso escrito. La confidencialidad de tu operación es
                    parte del servicio.
                  </p>
                </div>
                <Link
                  href="/politica-de-privacidad"
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-blue-ink transition hover:text-[#0F86B8]"
                >
                  Política de privacidad
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Casos en preparación */}
        <section className="bg-card py-16 sm:py-20" aria-labelledby="casos-title">
          <div className={CONTAINER}>
            <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">Publicación progresiva</p>
                <h2 id="casos-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Casos en preparación
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Estos espacios se completarán con proyectos reales a medida que sus fichas sean validadas por el
                  cliente. No anticipamos contenido para llenar la página.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/70">
                <ShieldCheck className="size-3.5 text-[#0E7490]" />
                Contenido verificado
              </span>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {caseSlots.map((slot, index) => (
                <Reveal key={index} delay={index * 70} className="h-full">
                  <div className="flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-dashed border-[#1769AA]/30 bg-muted/60 p-5">
                    <div>
                      <span className="inline-flex rounded-full bg-tint-blue px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-blue-ink">
                        {slot.sector}
                      </span>
                      <p className="mt-4 font-heading text-sm font-bold leading-snug text-foreground/80">
                        {slot.title}
                      </p>
                    </div>
                    <div className="space-y-2" aria-hidden="true">
                      {['Contexto', 'Reto', 'Solución', 'Resultados'].map((field) => (
                        <div key={field} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-[#1769AA]/40" />
                          <span className="h-1.5 flex-1 rounded-full bg-[#1769AA]/10" />
                          <span className="w-14 text-[8px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                            {field}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0B2236] py-16 text-white sm:py-20" aria-labelledby="proyectos-cta-title">
          <div className={CONTAINER}>
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <h2 id="proyectos-cta-title" className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Tu proyecto puede ser el próximo caso documentado
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#B9CBDA]">
                    Cuéntanos el reto de tu empresa. Evaluamos el alcance, proponemos un plan y dejamos todo por
                    escrito antes de empezar.
                  </p>
                </div>
                <Link
                  href="/contacto"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1769AA] px-6 text-sm font-bold text-white transition hover:bg-[#12568C] sm:w-auto"
                >
                  Solicitar asesoría
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  )
}
