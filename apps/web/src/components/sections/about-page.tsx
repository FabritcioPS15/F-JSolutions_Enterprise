import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  ChevronDown,
  ClipboardList,
  Clock,
  Code2,
  Compass,
  GraduationCap,
  Headset,
  HeartHandshake,
  Laptop,
  Mail,
  MapPin,
  Network,
  Phone,
  Quote,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Target,
  Truck,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { EditorialHero } from '@/components/heroes'
import { HeroAction } from '@/components/heroes/hero-primitives'
import { EMPRESA } from '@/lib/constants'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'

const stats = [
  { value: '12+', label: 'Años de experiencia' },
  { value: '850+', label: 'Clientes atendidos' },
  { value: '2,400+', label: 'Equipos gestionados' },
  { value: '<24 h', label: 'Tiempo de respuesta' },
]

const values = [
  {
    icon: Target,
    title: 'Criterio antes que catálogo',
    copy: 'Entendemos la operación y el presupuesto antes de recomendar. No vendemos por vender.',
  },
  {
    icon: ShieldCheck,
    title: 'Claridad en cada etapa',
    copy: 'Alcance, plazos, costos y responsables por escrito. Sin sorpresas a mitad del proyecto.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento real',
    copy: 'Documentamos, capacitamos y seguimos presentes después de la entrega.',
  },
]

type Project = {
  sector: string
  icon: LucideIcon
  title: string
  context: string
  actions: string[]
  tags: string[]
}

const projects: Project[] = [
  {
    sector: 'Servicios profesionales',
    icon: Briefcase,
    title: 'Red corporativa para una sede administrativa',
    context:
      'La oficina dependía de Wi-Fi doméstico y cableado sin documentación. La conexión caía en las horas de mayor demanda.',
    actions: [
      'Diagnóstico de cobertura y puntos críticos',
      'Switches gestionados, VLAN y access points',
      'Documentación de la red y pruebas de estabilidad',
    ],
    tags: ['Redes', 'Wi-Fi', 'Cableado'],
  },
  {
    sector: 'Comercio y retail',
    icon: ShoppingBag,
    title: 'Mesa de ayuda para un equipo distribuido',
    context:
      'Las incidencias llegaban por WhatsApp y correo, sin un responsable claro ni tiempos de atención definidos.',
    actions: [
      'Canal único de tickets y prioridades',
      'Soporte remoto con visitas programadas',
      'Inventario e historial por equipo',
    ],
    tags: ['Soporte TI', 'SLA', 'Inventario'],
  },
  {
    sector: 'Distribución',
    icon: Truck,
    title: 'Sistema de inventario y ventas a medida',
    context:
      'El stock se controlaba en hojas de cálculo separadas y los cierres mensuales consumían días de trabajo.',
    actions: [
      'Sistema web con roles y permisos',
      'Integración de inventario, ventas y facturación',
      'Reportes operativos para gerencia',
    ],
    tags: ['Software', 'Integración', 'Reportes'],
  },
  {
    sector: 'Salud',
    icon: Stethoscope,
    title: 'Continuidad y respaldos para información crítica',
    context:
      'Los equipos contaban con respaldos, pero nunca se había probado una restauración completa.',
    actions: [
      'Política de respaldo por criticidad',
      'Pruebas de restauración documentadas',
      'Monitoreo de fallas y alertas tempranas',
    ],
    tags: ['Respaldos', 'Seguridad', 'Continuidad'],
  },
  {
    sector: 'Educación',
    icon: GraduationCap,
    title: 'Estandarización de equipos para una nueva sede',
    context:
      'La apertura exigía decenas de estaciones listas en una fecha fija, con configuraciones consistentes.',
    actions: [
      'Selección y suministro de equipos',
      'Imagen base y configuración inicial',
      'Despliegue por aula y acta de entrega',
    ],
    tags: ['Hardware', 'Despliegue', 'Configuración'],
  },
  {
    sector: 'Logística',
    icon: Workflow,
    title: 'Automatización de reportes operativos',
    context:
      'Los reportes se armaban manualmente cada semana y los errores se detectaban cuando ya afectaban la operación.',
    actions: [
      'Integración de fuentes de datos',
      'Panel de indicadores operativos',
      'Alertas y reportes programados',
    ],
    tags: ['Automatización', 'Datos', 'Panel'],
  },
]

const process = [
  {
    step: '01',
    icon: Compass,
    title: 'Diagnóstico',
    copy: 'Escuchamos a tu equipo, revisamos equipos, red y procesos, y priorizamos riesgos reales.',
    deliverable: 'Hallazgos y prioridades',
  },
  {
    step: '02',
    icon: ClipboardList,
    title: 'Propuesta',
    copy: 'Traducimos el diagnóstico en alcance, alternativas, plazos y costos comprensibles.',
    deliverable: 'Propuesta técnica y comercial',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Implementación',
    copy: 'Ejecutamos por etapas, con responsables definidos y validación en cada entregable.',
    deliverable: 'Cronograma y documentación',
  },
  {
    step: '04',
    icon: HeartHandshake,
    title: 'Acompañamiento',
    copy: 'Medimos el resultado, damos soporte y ajustamos lo necesario para que la solución dure.',
    deliverable: 'Reporte de cierre y continuidad',
  },
]

const commitments = [
  {
    icon: Users,
    title: 'Un responsable con nombre',
    copy: 'Sabes con quién hablar durante todo el proyecto.',
  },
  {
    icon: ClipboardList,
    title: 'Documentación entregada',
    copy: 'Lo implementado queda explicado y registrado.',
  },
  {
    icon: ShieldCheck,
    title: 'Decisiones sin presión',
    copy: 'Si algo no hace falta, te lo decimos antes de cotizarlo.',
  },
]

const capabilities = [
  {
    icon: Network,
    title: 'Infraestructura y soporte',
    copy: 'Redes, servidores, respaldos, monitoreo y mesa de ayuda para tu operación diaria.',
    points: ['Soporte remoto y en sitio', 'Redes y conectividad', 'Respaldos y continuidad'],
    href: '/servicios',
    cta: 'Ver servicios TI',
  },
  {
    icon: Code2,
    title: 'Software a medida',
    copy: 'Sistemas web, automatización e integraciones para ordenar procesos y centralizar información.',
    points: ['Sistemas internos', 'Automatización de procesos', 'Integración con facturación'],
    href: '/sistemas',
    cta: 'Ver desarrollo de software',
  },
  {
    icon: Laptop,
    title: 'Suministro tecnológico',
    copy: 'Equipos corporativos con asesoría técnica, configuración inicial y despliegue por sede.',
    points: ['Laptops y desktops', 'Componentes y periféricos', 'Compras por volumen'],
    href: '/productos',
    cta: 'Explorar catálogo',
  },
]

const faqs = [
  {
    q: '¿Cómo empieza un proyecto con F&J Systems?',
    a: 'Agendamos una conversación de diagnóstico sin costo. Revisamos tu necesidad, el estado actual de tu operación y las prioridades reales. Con esa información preparamos una propuesta con alcance, etapas, entregables y costos.',
  },
  {
    q: '¿Atienden empresas fuera de Lima?',
    a: 'Sí. El soporte remoto cubre todo el Perú y coordinamos visitas en sitio para proyectos de implementación, redes, mantenimiento y despliegue de equipos según el alcance acordado.',
  },
  {
    q: '¿Pueden gestionar equipos que no compraron con ustedes?',
    a: 'Sí. El soporte es independiente del origen del equipo. Podemos inventariar, mantener y monitorear los equipos que ya tienes, incluso si fueron adquiridos a otro proveedor.',
  },
  {
    q: '¿Cómo se define el precio de un proyecto?',
    a: 'Depende del alcance, la cantidad de equipos o sedes, la criticidad de la operación y los tiempos requeridos. Siempre entregamos una propuesta clara antes de iniciar, con lo incluido y lo que no está incluido.',
  },
  {
    q: '¿Qué ocurre después de la entrega?',
    a: 'Entregamos documentación de lo implementado y coordinamos el acompañamiento según el tipo de proyecto. Puede incluir soporte puntual, un plan mensual, monitoreo o una etapa de evolución del software.',
  },
  {
    q: '¿Cómo protegen la información de nuestra empresa?',
    a: 'Aplicamos accesos mínimos, acuerdos de confidencialidad, respaldos y buenas prácticas de seguridad. En proyectos de software trabajamos con ambientes de prueba y validación antes de tocar producción.',
  },
  {
    q: '¿Trabajan con empresas pequeñas?',
    a: 'Sí. Adaptamos el alcance al tamaño y la madurez tecnológica de cada empresa. No todos necesitan una implementación grande: a veces el mejor primer paso es ordenar inventario, respaldos o conectividad.',
  },
]

export function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <EnhancedHeader />

      <EditorialHero
        eyebrow="Sobre F&J Systems"
        title={
          <>
            Entendemos tu operación antes de proponer{' '}
            <span className="text-[#2563EB]">tecnología</span>.
          </>
        }
        description="Somos un equipo de infraestructura, soporte y desarrollo de software en Lima. Trabajamos con empresas que necesitan decisiones técnicas claras, implementaciones ordenadas y un aliado que siga ahí después de la entrega."
        meta={['Lima, Perú', 'Atención remota y en sitio', 'Empresas y equipos de trabajo']}
        actions={
          <>
            <HeroAction href="/contacto">Hablemos de tu proyecto</HeroAction>
            <HeroAction href="/proyectos" variant="secondary">
              Ver proyectos y experiencia
            </HeroAction>
          </>
        }
        aside={<CompanyCard />}
      />

      {/* Indicadores */}
      <section aria-label="Indicadores de experiencia" className="bg-white">
        <div className={`${CONTAINER} pb-2 pt-4 sm:pt-6`}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#E2E8F0] shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)] sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white px-3 py-5 text-center sm:px-4 sm:py-6">
                <p className="font-heading text-2xl font-bold tracking-[-0.04em] text-[#0F172A] sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#64748B] sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiénes somos */}
      <section id="historia" className="scroll-mt-32 bg-white">
        <div className={`${CONTAINER} py-14 sm:py-16 lg:py-20`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Quiénes somos
              </p>
              <h2 className="mt-3 max-w-[22ch] font-heading text-[clamp(1.8rem,1.1rem+2.2vw,2.85rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0F172A]">
                Un socio técnico, <span className="text-[#2563EB]">no solo un proveedor</span>.
              </h2>

              <div className="mt-5 max-w-[62ch] space-y-4 text-sm leading-7 text-[#475569] sm:text-[15px]">
                <p>
                  F&J Systems nació resolviendo necesidades concretas: equipos que fallaban, redes
                  que no alcanzaban y procesos que dependían de hojas de cálculo. Con los años, ese
                  trabajo se convirtió en una práctica integral de infraestructura, soporte y
                  desarrollo.
                </p>
                <p>
                  Hoy acompañamos a empresas de distintos tamaños en Lima y el Perú. No llegamos con
                  una solución cerrada: primero entendemos cómo trabaja tu equipo, qué está en riesgo
                  y qué necesita crecer.
                </p>
                <p className="border-l-2 border-[#BFDBFE] pl-4 font-medium text-[#334155]">
                  Nuestra medida es simple: que la tecnología funcione sin convertirse en un problema
                  adicional.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {['Lima, Perú', 'Atención a nivel nacional', 'Facturación electrónica'].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#475569]"
                  >
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#22D3EE]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group flex gap-3.5 rounded-2xl border border-[#E2E8F0] bg-white p-4 transition duration-300 hover:border-[#2563EB]/35 hover:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.4)]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB] transition duration-300 group-hover:bg-[#2563EB] group-hover:text-white">
                    <value.icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-[#0F172A]">{value.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">{value.copy}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-[#DBEAFE] bg-[#F8FBFF] p-5">
                <Quote aria-hidden="true" className="size-5 text-[#2563EB]" />
                <p className="mt-2 font-heading text-base font-semibold leading-6 tracking-[-0.02em] text-[#0F172A]">
                  “La tecnología debe resolver, no complicar.”
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                  Principio de trabajo F&amp;J
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proyectos y experiencia */}
      <section id="proyectos" className="scroll-mt-32 border-y border-[#E2E8F0] bg-[#F7F9FC]">
        <div className={`${CONTAINER} py-14 sm:py-16 lg:py-20`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Proyectos y experiencia
              </p>
              <h2 className="mt-3 font-heading text-[clamp(1.8rem,1.1rem+2.2vw,2.85rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0F172A]">
                Casos donde la tecnología tenía que funcionar.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#475569]">
                Cada proyecto empieza con un problema concreto. Estos son algunos de los frentes que
                hemos resuelto para empresas de distintos sectores.
              </p>
            </div>
            <Link
              href="/proyectos"
              className="group inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              Ver casos de éxito completos
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#2563EB]/30 hover:shadow-[0_24px_50px_-38px_rgba(15,23,42,0.5)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#1D4ED8]">
                    <project.icon aria-hidden="true" className="size-3" />
                    {project.sector}
                  </span>
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-3 font-heading text-[15px] font-bold leading-5 tracking-[-0.02em] text-[#0F172A]">
                  {project.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#475569]">{project.context}</p>

                <div className="mt-4 flex-1 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                    Qué hicimos
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {project.actions.map((action) => (
                      <li key={action} className="flex items-start gap-2 text-[11px] leading-4 text-[#475569]">
                        <span className="mt-0.5 grid size-3.5 shrink-0 place-items-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
                          <Check aria-hidden="true" className="size-2" strokeWidth={3} />
                        </span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[#E2E8F0] bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#64748B]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 flex items-start gap-2 text-[10.5px] leading-4 text-[#64748B]">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#2563EB]" />
            Casos representativos de proyectos ejecutados por nuestro equipo. Por confidencialidad,
            no publicamos nombres de clientes ni cifras internas.
          </p>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section id="metodologia" className="scroll-mt-32 bg-white">
        <div className={`${CONTAINER} py-14 sm:py-16 lg:py-20`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Cómo trabajamos
              </p>
              <h2 className="mt-3 font-heading text-[clamp(1.8rem,1.1rem+2.2vw,2.85rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0F172A]">
                Un proceso claro, de la primera conversación al soporte.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#475569]">
                No improvisamos sobre tu operación. Cada etapa tiene un objetivo, un responsable y un
                entregable concreto.
              </p>
            </div>
            <Link
              href="/como-trabajamos"
              className="group inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:text-[#1D4ED8]"
            >
              Conocer metodología y garantías
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <div
                key={item.step}
                className="group relative flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 transition duration-300 hover:border-[#2563EB]/30 hover:shadow-[0_22px_46px_-36px_rgba(15,23,42,0.45)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#94A3B8]">
                    {item.step}
                  </span>
                  <span className="grid size-9 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB] transition duration-300 group-hover:bg-[#2563EB] group-hover:text-white">
                    <item.icon aria-hidden="true" className="size-4" />
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-sm font-bold text-[#0F172A]">{item.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-5 text-[#475569]">{item.copy}</p>
                <div className="mt-4 border-t border-[#EEF2F7] pt-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                    Entregable
                  </p>
                  <p className="mt-1 text-[11px] font-semibold leading-4 text-[#334155]">
                    {item.deliverable}
                  </p>
                </div>

                {index < process.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full border border-[#E2E8F0] bg-white text-[#2563EB] shadow-sm lg:grid"
                  >
                    <ArrowRight className="size-3" />
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl border border-[#DBEAFE] bg-[#F8FBFF] p-4 sm:grid-cols-3 sm:p-5">
            {commitments.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                  <item.icon aria-hidden="true" className="size-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-[#0F172A]">{item.title}</p>
                  <p className="mt-0.5 text-[10.5px] leading-4 text-[#64748B]">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capacidades */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className={`${CONTAINER} py-14 sm:py-16 lg:py-20`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Equipo y capacidades
              </p>
              <h2 className="mt-3 font-heading text-[clamp(1.8rem,1.1rem+2.2vw,2.85rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0F172A]">
                Un solo equipo para toda la cadena tecnológica.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#475569]">
                Podemos entrar por un equipo, una red o un sistema. Lo importante es que la solución
                completa tenga sentido.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 self-start rounded-full border border-[#DBEAFE] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1D4ED8]">
              <Sparkles aria-hidden="true" className="size-3.5" />
              Diagnóstico sin costo
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {capabilities.map((capability) => (
              <div
                key={capability.title}
                className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 transition duration-300 hover:border-[#2563EB]/30 hover:shadow-[0_22px_46px_-36px_rgba(15,23,42,0.45)]"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-[#EFF6FF] text-[#2563EB] transition duration-300 group-hover:bg-[#2563EB] group-hover:text-white">
                  <capability.icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-sm font-bold text-[#0F172A]">
                  {capability.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#475569]">{capability.copy}</p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {capability.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-[11px] text-[#64748B]">
                      <Check aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[#2563EB]" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={capability.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB] transition hover:text-[#1D4ED8]"
                >
                  {capability.cta}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section id="faq" className="scroll-mt-32 border-y border-[#E2E8F0] bg-white">
        <div className={`${CONTAINER} py-14 sm:py-16 lg:py-20`}>
          <div className="grid gap-9 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Preguntas frecuentes
              </p>
              <h2 className="mt-3 max-w-[18ch] font-heading text-[clamp(1.8rem,1.1rem+2.2vw,2.85rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0F172A]">
                Lo que suelen preguntarnos antes de empezar.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#475569]">
                Si tu caso no aparece aquí, escríbenos. Respondemos con una orientación concreta, no
                con una plantilla.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link
                  href="/preguntas-frecuentes"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  Ver centro de preguntas frecuentes
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:text-[#1D4ED8]"
                >
                  Consultar al equipo
                </Link>
              </div>

              <div className="mt-8 hidden items-center gap-3 rounded-2xl border border-[#EEF2F7] bg-[#F8FAFC] p-4 lg:flex">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                  <Headset aria-hidden="true" className="size-4.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-[#0F172A]">Atención directa</p>
                  <p className="mt-0.5 text-[10.5px] text-[#64748B]">
                    Lun-Sáb · 9:00 a 18:00
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 transition open:border-[#2563EB]/30 open:shadow-[0_18px_40px_-34px_rgba(15,23,42,0.4)]"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-bold text-[#0F172A] [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 font-mono text-[10px] text-[#94A3B8]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {faq.q}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[#64748B] transition group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 pl-8 text-sm leading-6 text-[#475569]">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="scroll-mt-32 bg-white">
        <div className={`${CONTAINER} py-12 sm:py-14 lg:py-16`}>
          <div className="relative overflow-hidden rounded-[28px] border border-[#2563EB]/15 bg-[linear-gradient(135deg,#F5F9FF_0%,#FFFFFF_48%,#F8FAFC_100%)] p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.5)] sm:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-[#2563EB]/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-[#22D3EE]/15 blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                  Hablemos
                </p>
                <h2 className="mt-3 max-w-[20ch] font-heading text-[clamp(1.9rem,1.15rem+2.4vw,3rem)] font-bold leading-[1.06] tracking-[-0.045em] text-[#0F172A]">
                  Tu próxima decisión tecnológica empieza con una conversación.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#475569]">
                  Cuéntanos qué está pasando o qué quieres implementar. Te respondemos con un
                  siguiente paso concreto y sin compromiso.
                </p>
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/contacto"
                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-[0_12px_28px_-14px_rgba(37,99,235,0.75)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8] sm:w-auto"
                  >
                    Escribir al equipo
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                  <a
                    href={`tel:${EMPRESA.telefono.replace(/\s/g, '')}`}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#DBE2EA] bg-white px-5 text-sm font-bold text-[#0F172A] transition hover:-translate-y-0.5 hover:border-[#2563EB]/45 hover:text-[#1D4ED8] sm:w-auto"
                  >
                    <Phone aria-hidden="true" className="size-4" />
                    {EMPRESA.telefono}
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white/90 p-4 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.45)] backdrop-blur sm:p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
                  Canales directos
                </p>
                <div className="mt-3 space-y-2">
                  <ContactChannel
                    icon={Phone}
                    label="Ventas y proyectos"
                    value={EMPRESA.telefono}
                    href={`tel:${EMPRESA.telefono.replace(/\s/g, '')}`}
                  />
                  <ContactChannel
                    icon={Mail}
                    label="Correo comercial"
                    value={EMPRESA.email}
                    href={`mailto:${EMPRESA.email}`}
                  />
                  <ContactChannel
                    icon={MapPin}
                    label="Oficina"
                    value="Av. Javier Prado Este, Lima"
                    href="/contacto"
                  />
                </div>
                <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#F8FAFC] p-3">
                  <Clock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#2563EB]" />
                  <div>
                    <p className="text-[10.5px] font-semibold text-[#334155]">{EMPRESA.horario}</p>
                    <p className="mt-0.5 text-[9.5px] leading-4 text-[#64748B]">
                      Respuesta en menos de 24 horas hábiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function CompanyCard() {
  const items = [
    { icon: Network, title: 'Infraestructura', detail: 'Redes y servidores' },
    { icon: Headset, title: 'Soporte', detail: 'Remoto y en sitio' },
    { icon: Code2, title: 'Software', detail: 'Sistemas a medida' },
    { icon: Laptop, title: 'Hardware', detail: 'Equipos corporativos' },
  ]

  return (
    <div className="relative">
      <div className="hero-float-soft relative overflow-hidden rounded-[26px] border border-[#E2E8F0] bg-white/95 p-5 shadow-[0_36px_90px_-48px_rgba(15,23,42,0.5)] backdrop-blur">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,#F5F9FF_0%,rgba(255,255,255,0)_100%)]"
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] font-heading text-sm font-bold tracking-tight text-white shadow-[0_12px_24px_-12px_rgba(37,99,235,0.7)]">
              FJ
            </span>
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold tracking-[-0.02em] text-[#0F172A]">
                F&amp;J Solutions
              </p>
              <p className="mt-0.5 truncate text-[10px] text-[#64748B]">
                Tecnología empresarial · Lima, Perú
              </p>
            </div>
            <span className="ml-auto shrink-0 rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#1D4ED8]">
              B2B
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {items.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-2.5"
              >
                <span className="grid size-7 place-items-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                  <item.icon aria-hidden="true" className="size-3.5" />
                </span>
                <p className="mt-2 text-[10px] font-bold leading-4 text-[#0F172A]">{item.title}</p>
                <p className="truncate text-[8.5px] text-[#64748B]">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-[#DBEAFE] bg-[#F8FBFF] p-3.5">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#1D4ED8]">
              Nuestro enfoque
            </p>
            <p className="mt-1.5 text-[12px] font-semibold leading-5 text-[#0F172A]">
              Entender la operación antes de proponer tecnología.
            </p>
            <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#DBEAFE] bg-white px-2 py-1 text-[9px] font-bold text-[#1D4ED8]">
              <Sparkles aria-hidden="true" className="size-2.5" />
              Diagnóstico sin costo
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-[9.5px]">
            <span className="inline-flex items-center gap-1.5 text-[#64748B]">
              <MapPin aria-hidden="true" className="size-3" />
              Lima, Perú
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#1D4ED8]">
              <Clock aria-hidden="true" className="size-3" />
              Lun-Sáb
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactChannel({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon
  label: string
  value: string
  href: string
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-[#EEF2F7] bg-white px-3 py-2.5 transition hover:border-[#2563EB]/30 hover:bg-[#FBFDFF]"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
        <Icon aria-hidden="true" className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
          {label}
        </span>
        <span className="block truncate text-[11px] font-bold text-[#0F172A]">{value}</span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 shrink-0 text-[#94A3B8] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
      />
    </a>
  )
}
