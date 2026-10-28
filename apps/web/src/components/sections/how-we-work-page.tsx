'use client'

import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Compass,
  FileCheck2,
  FileText,
  HeartHandshake,
  HelpCircle,
  Laptop,
  MessageSquare,
  Network,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Wrench,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { EditorialHero } from '@/components/heroes'
import { HeroAction } from '@/components/heroes/hero-primitives'
import { EMPRESA } from '@/lib/constants'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'

const steps = [
  {
    step: '01',
    badge: 'Fase 1',
    icon: Compass,
    title: 'Diagnóstico técnico y levantamiento',
    summary: 'Escuchamos a tu equipo y analizamos el estado real de la infraestructura sin costo inicial.',
    description:
      'Nos reunimos para entender los dolores operativos, revisamos equipos, cableado, switches, servidores o bases de datos, y priorizamos las vulnerabilidades o cuellos de botella que impactan el negocio.',
    deliverables: [
      'Informe de hallazgos y estado situacional',
      'Matriz de riesgos y prioridades técnicas',
      'Estimación preliminar de viabilidad',
    ],
    timeframe: '24 a 48 horas',
  },
  {
    step: '02',
    badge: 'Fase 2',
    icon: ClipboardList,
    title: 'Propuesta de alcance y arquitectura',
    summary: 'Traducimos el diagnóstico en un plan con alternativas, plazos y costos cerrados.',
    description:
      'Diseñamos la solución tecnológica adecuada a tu presupuesto. Detallamos exactamente qué incluye el proyecto, qué no incluye, marcas recomendadas, cronograma por entregables y el modelo de garantía.',
    deliverables: [
      'Propuesta técnica y comercial detallada',
      'Cronograma con fechas de inicio y cierre',
      'Especificaciones de hardware o stack de software',
    ],
    timeframe: '2 a 4 días hábiles',
  },
  {
    step: '03',
    badge: 'Fase 3',
    icon: Rocket,
    title: 'Implementación y despliegue por fases',
    summary: 'Ejecutamos con mínimas interrupciones operativas y validaciones continuas.',
    description:
      'Coordinamos los trabajos críticos fuera de horario o en ventanas de bajo tráfico. Nuestro equipo instala, cablea, configura o desarrolla siguiendo estándares de industria y protocolos de seguridad.',
    deliverables: [
      'Instalación física / despliegue en staging',
      'Pruebas de estrés y conectividad',
      'Actualizaciones periódicas de avance al cliente',
    ],
    timeframe: 'Según alcance acordado',
  },
  {
    step: '04',
    badge: 'Fase 4',
    icon: FileCheck2,
    title: 'Validación, actas y documentación',
    summary: 'No cerramos el proyecto hasta que todo esté probado y documentado por escrito.',
    description:
      'Realizamos pruebas conjuntas con el personal usuario. Entregamos topologías de red, inventario de credenciales seguras, manuales de usuario y firmamos el acta formal de conformidad técnica.',
    deliverables: [
      'Documentación técnica y diagramas de topología',
      'Capacitación al equipo usuario o responsable',
      'Acta de conformidad y entrega de garantías',
    ],
    timeframe: 'Al término de la fase 3',
  },
  {
    step: '05',
    badge: 'Fase 5',
    icon: HeartHandshake,
    title: 'Acompañamiento y soporte continuo',
    summary: 'Seguimos a tu lado para asegurar la durabilidad y evolución de la solución.',
    description:
      'Monitoreamos el funcionamiento en los primeros días post-entrega y ofrecemos planes mensuales de mesa de ayuda, mantenimiento preventivo y mejoras evolutivas para que tu operación nunca se detenga.',
    deliverables: [
      'Garantía directa de 12 a 36 meses en equipos',
      'Canal prioritario de soporte y mesa de ayuda',
      'Informes mensuales de disponibilidad (SLA)',
    ],
    timeframe: 'Continuo / según plan',
  },
]

const pillars = [
  {
    icon: Users,
    title: 'Un responsable técnico con nombre y apellido',
    copy: 'Sabes con quién estás hablando en cada momento. Un líder de proyecto asignado coordina las tareas y te mantiene informado sin tecnicismos innecesarios.',
  },
  {
    icon: FileText,
    title: 'Documentación integral entregada al cliente',
    copy: 'Todo lo que instalamos o programamos queda registrado: diagramas de red, claves maestras, inventario y manuales. Tu empresa es siempre dueña de su información.',
  },
  {
    icon: ShieldCheck,
    title: 'Presupuestos transparentes sin sorpresas',
    copy: 'Definimos el alcance antes de iniciar. Si un elemento no es necesario para tu empresa, te lo decimos con honestidad antes de cotizarlo.',
  },
  {
    icon: Clock,
    title: 'Tiempos de respuesta (SLA) por escrito',
    copy: 'Compromisos de atención garantizados según el nivel de severidad: desde incidencias críticas en menos de 2 horas hasta visitas técnicas programadas.',
  },
]

const engagementModels = [
  {
    title: 'Proyectos Llave en Mano',
    badge: 'Cerrado',
    desc: 'Ideal para implementaciones puntuales: cableado estructurado, instalación de servidores, migraciones o desarrollo de sistemas a medida.',
    features: [
      'Presupuesto y plazo cerrado por contrato',
      'Cronograma con hitos de pago contra entregables',
      'Garantía técnica post-lanzamiento incluida',
      'Acta formal de entrega y documentación',
    ],
    ctaText: 'Cotizar proyecto',
    ctaHref: '/contacto',
  },
  {
    title: 'Planes Mensuales de Soporte TI',
    badge: 'Continuo',
    desc: 'Tu departamento de tecnología externalizado. Mantenimiento de equipos, soporte remoto, visitas en sitio y seguridad para tu equipo.',
    features: [
      'Mesa de ayuda con canal de tickets y WhatsApp',
      'Visitas presenciales preventivas y correctivas',
      'Monitoreo activo de servidores y respaldos',
      'Tarifa fija mensual predecible por usuario o sede',
    ],
    ctaText: 'Ver planes de soporte',
    ctaHref: '/soporte-ti',
  },
  {
    title: 'Suministro y Equipamiento Corporativo',
    badge: 'Volumen',
    desc: 'Venta de laptops, estaciones de trabajo, servidores e insumos con configuración inicial, imagen empresarial y despacho a oficina.',
    features: [
      'Equipos con garantía oficial de marca (HP, Lenovo, Dell)',
      'Configuración inicial de software incluida',
      'Facturación empresarial con crédito corporativo',
      'Atención en Lima y envíos a nivel nacional',
    ],
    ctaText: 'Explorar catálogo',
    ctaHref: '/productos',
  },
]

export function HowWeWorkPage() {
  return (
    <div className="min-h-screen bg-white text-[#0F172A] selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      <EnhancedHeader />

      <main>
        {/* Hero Editorial */}
        <EditorialHero
          id="hero-como-trabajamos"
          title={
            <>
              Procesos claros, <span className="text-[#2563EB]">entregas a tiempo</span> y sin sorpresas
            </>
          }
          description="Desde la primera llamada de diagnóstico hasta el soporte continuo, seguimos una metodología estructurada que garantiza transparencia, calidad técnica y control de costos."
          meta={[
            'Diagnóstico inicial sin costo',
            'Alcance y plazos por escrito',
            'Documentación completa entregada',
            'Soporte técnico continuo',
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <HeroAction href="/contacto" variant="primary">
                Iniciar conversación
                <ArrowRight className="size-4" />
              </HeroAction>
              <HeroAction href="/proyectos" variant="secondary">
                Ver casos de éxito
              </HeroAction>
            </div>
          }
        />

        {/* Pilares de trabajo */}
        <section className="border-y border-[#E2E8F0] bg-[#F8FAFC] py-14 sm:py-20" aria-label="Nuestros pilares">
          <div className={CONTAINER}>
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">Garantía de calidad</p>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                Principios que guían cada proyecto
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">
                Creemos que la tecnología debe generar tranquilidad y rendimiento, no complicaciones adicionales.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition duration-200 hover:border-[#2563EB]/30 hover:shadow-sm"
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-heading text-base font-bold text-[#0F172A]">{pillar.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#64748B]">{pillar.copy}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Paso a paso del proceso */}
        <section className="py-16 sm:py-24" aria-label="Etapas del proceso">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">Paso a paso</p>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                De la necesidad a la solución implementada
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">
                Cada etapa tiene objetivos medibles, un responsable a cargo y entregables formales para tu tranquilidad.
              </p>
            </div>

            <div className="mt-14 space-y-6">
              {steps.map((s, idx) => {
                const Icon = s.icon
                return (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition duration-200 hover:border-[#2563EB]/40 hover:shadow-md sm:p-8"
                  >
                    <div className="grid gap-6 lg:grid-cols-[100px_1fr_320px] lg:items-center">
                      {/* Step number and badge */}
                      <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-1">
                        <span className="font-heading text-4xl font-extrabold text-[#2563EB] sm:text-5xl">
                          {s.step}
                        </span>
                        <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB]">
                          {s.badge}
                        </span>
                      </div>

                      {/* Main description */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#2563EB]">
                            <Icon className="size-4" />
                          </span>
                          <h3 className="font-heading text-lg font-bold text-[#0F172A] sm:text-xl">{s.title}</h3>
                        </div>
                        <p className="mt-2 text-sm font-medium text-[#2563EB]">{s.summary}</p>
                        <p className="mt-2 text-xs leading-relaxed text-[#64748B]">{s.description}</p>
                      </div>

                      {/* Deliverables box */}
                      <div className="rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-4">
                        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                          <span>Entregables clave</span>
                          <span className="text-[#2563EB] font-semibold lowercase">{s.timeframe}</span>
                        </div>
                        <ul className="mt-2.5 space-y-2 text-xs text-[#475569]">
                          {s.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#2563EB]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Modelos de contratación */}
        <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] py-16 sm:py-24" aria-label="Modelos de servicio">
          <div className={CONTAINER}>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">Modalidades flexibles</p>
              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                ¿Cómo podemos colaborar juntos?
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">
                Nos adaptamos al tamaño de tu empresa y la naturaleza de tus requerimientos tecnológicos.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {engagementModels.map((model, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition duration-200 hover:border-[#2563EB]/40 sm:p-8"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[11px] font-bold text-[#2563EB]">
                        {model.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-bold text-[#0F172A]">{model.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#64748B]">{model.desc}</p>

                    <div className="mt-6 border-t border-[#F1F5F9] pt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Incluye:</p>
                      <ul className="mt-3 space-y-2 text-xs text-[#475569]">
                        {model.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#2563EB]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={model.ctaHref}
                    className="mt-8 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] text-xs font-bold text-white transition hover:bg-[#2563EB]"
                  >
                    {model.ctaText}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banner CTA */}
        <section className="bg-[#0F172A] py-16 text-white" aria-label="Comenzar proyecto">
          <div className={CONTAINER}>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#38BDF8]">
                  Empieza con total claridad
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Agenda una sesión de diagnóstico sin compromiso
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#94A3B8]">
                  Cuéntanos tu requerimiento o reto actual. Te responderemos en menos de 24 horas para coordinar
                  una llamada técnica o visita en sitio.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  Solicitar reunión
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/preguntas-frecuentes"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <HelpCircle className="size-4" />
                  Preguntas frecuentes
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
