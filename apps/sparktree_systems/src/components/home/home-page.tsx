import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Cable,
  Check,
  CheckCircle2,
  ClipboardList,
  Cloud,
  Compass,
  ExternalLink,
  Globe2,
  GraduationCap,
  HardDrive,
  Headset,
  Layers,
  Lock,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Wifi,
  Workflow,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { ExecutiveHero } from '@/components/home/executive-hero'
import { Reveal } from '@/components/home/reveal'
import { ProcessSequence } from '@/components/ui/process-sequence'
import { ECOSYSTEM_UNITS, GROUP_APP_URL } from '@/lib/ecosystem'
import { storeUrl } from '@/lib/store-url'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'

const capabilities = [
  {
    icon: Server,
    title: 'Infraestructura y servidores',
    copy: 'Servidores, almacenamiento, virtualización y nube dimensionados para la operación real de tu empresa.',
    items: ['Servidores y almacenamiento', 'Virtualización y entornos cloud'],
  },
  {
    icon: Network,
    title: 'Redes y conectividad',
    copy: 'Cableado estructurado, Wi-Fi corporativo y enlaces entre sedes con estándares de industria.',
    items: ['Cableado estructurado certificado', 'Wi-Fi y switches administrables'],
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad tecnológica',
    copy: 'Protección del perímetro, accesos controlados y respaldos verificables para la información del negocio.',
    items: ['Firewalls y protección de red', 'Copias de seguridad y recuperación'],
  },
  {
    icon: Workflow,
    title: 'Gestión y soporte',
    copy: 'Mesa de ayuda, mantenimiento preventivo y administración de equipos con responsables definidos.',
    items: ['Soporte remoto y presencial', 'Mantenimiento preventivo programado'],
  },
]

const solutionCategories = [
  {
    number: '01',
    icon: HardDrive,
    title: 'Infraestructura TI',
    description:
      'Diseñamos e implementamos la base tecnológica de tu empresa: servidores, redes, cableado y entornos virtualizados.',
    items: ['Servidores y almacenamiento', 'Redes y cableado estructurado', 'Cloud y virtualización', 'Implementación en sitio'],
    href: '/infraestructura-ti',
    cta: 'Explorar infraestructura',
    accent: 'from-[#1769AA] to-[#00B8D9]',
  },
  {
    number: '02',
    icon: Headset,
    title: 'Servicios y soporte TI',
    description:
      'Acompañamos la operación diaria con soporte técnico, mantenimiento y administración de tu parque tecnológico.',
    items: ['Soporte remoto y presencial', 'Mantenimiento preventivo', 'Gestión de equipos', 'Administración tecnológica'],
    href: '/servicios',
    cta: 'Ver servicios',
    accent: 'from-[#0F86B8] to-[#75D7E8]',
  },
  {
    number: '03',
    icon: Lock,
    title: 'Seguridad tecnológica',
    description:
      'Protegemos la red, los equipos y la información con controles de acceso, respaldos y buenas prácticas.',
    items: ['Protección de redes', 'Firewalls y accesos', 'Copias de seguridad', 'Seguridad de infraestructura'],
    href: '/servicios/soporte-empresarial',
    cta: 'Conocer seguridad',
    accent: 'from-[#102A43] to-[#1769AA]',
  },
  {
    number: '04',
    icon: Store,
    title: 'Equipamiento empresarial',
    description:
      'Equipamos a tu equipo con computadoras, periféricos y equipos de red con asesoría técnica y cotización corporativa.',
    items: ['Computadoras y laptops', 'Componentes y periféricos', 'Equipos de red', 'Cotizaciones corporativas'],
    href: '/servicios/equipamiento-tecnologico-empresarial',
    cta: 'Ver equipamiento',
    accent: 'from-[#0E7490] to-[#00B8D9]',
  },
]

const methodologySteps = [
  {
    icon: Compass,
    title: 'Diagnóstico',
    copy: 'Levantamos el estado real de la infraestructura y priorizamos lo que impacta la operación.',
  },
  {
    icon: ClipboardList,
    title: 'Planificación',
    copy: 'Definimos alcance, alternativas, plazos y costos antes de ejecutar cualquier cambio.',
  },
  {
    icon: Rocket,
    title: 'Implementación',
    copy: 'Ejecutamos por fases, con ventanas de bajo impacto y validaciones continuas.',
  },
  {
    icon: Layers,
    title: 'Administración',
    copy: 'Documentamos, capacitamos y dejamos la operación bajo control y con responsables claros.',
  },
  {
    icon: Headset,
    title: 'Soporte continuo',
    copy: 'Acompañamos con mesa de ayuda, mantenimiento y mejoras según la evolución del negocio.',
  },
]

const companyProfiles = [
  {
    icon: Building2,
    title: 'Pequeñas y medianas empresas',
    copy: 'Ordenamos la operación tecnológica con soluciones proporcionales a tu equipo y presupuesto.',
    focus: ['Soporte recurrente', 'Equipos y redes', 'Respaldos básicos'],
  },
  {
    icon: TrendingUp,
    title: 'Empresas en crecimiento',
    copy: 'Escalamos la infraestructura sin frenar la operación, con planes que acompañan cada etapa.',
    focus: ['Servidores y virtualización', 'Ciberseguridad', 'Software a medida'],
  },
  {
    icon: Server,
    title: 'Infraestructura establecida',
    copy: 'Optimizamos, aseguramos y administramos lo que ya existe, con documentación y SLA por escrito.',
    focus: ['Monitoreo y respaldos', 'Mantenimiento preventivo', 'Administración de TI'],
  },
]

const projectSlots = [
  { sector: 'Sector por confirmar', title: 'Caso en preparación' },
  { sector: 'Sector por confirmar', title: 'Caso en preparación' },
  { sector: 'Sector por confirmar', title: 'Caso en preparación' },
]

const ecosystemIcons = {
  server: Server,
  globe: Globe2,
  academic: GraduationCap,
  store: Store,
} as const

export function HomePage() {
  return (
    <div className="min-h-screen bg-card text-foreground">
      <EnhancedHeader />

      <main>
        <ExecutiveHero />

        {/* 2. Capacidades tecnológicas */}
        <section className="border-b border-border bg-card py-16 sm:py-20" aria-labelledby="capacidades-title">
          <div className={CONTAINER}>
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">Capacidades tecnológicas</p>
                <h2
                  id="capacidades-title"
                  className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2.15rem]"
                >
                  Una operación completa, no piezas sueltas
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Conectamos infraestructura, soporte y seguridad para que la tecnología de tu empresa funcione como
                  un solo sistema.
                </p>
                <Link
                  href="/servicios"
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-ink transition hover:text-[#0F86B8]"
                >
                  Ver todos los servicios
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>

              <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                {capabilities.map((capability, index) => {
                  const Icon = capability.icon
                  return (
                    <Reveal key={capability.title} delay={index * 80}>
                      <div className="flex h-full flex-col border-t-2 border-[#1769AA]/20 pt-4 transition-colors duration-300 hover:border-[#1769AA]/60">
                        <span className="grid size-10 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                          <Icon className="size-5" />
                        </span>
                        <h3 className="mt-3 font-heading text-base font-bold text-foreground">{capability.title}</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{capability.copy}</p>
                        <ul className="mt-3 space-y-1.5">
                          {capability.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-[11.5px] font-medium text-foreground/80">
                              <Check className="mt-0.5 size-3 shrink-0 text-[#0E7490]" strokeWidth={3} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Nuestras soluciones */}
        <span id="servicios" className="block scroll-mt-24" aria-hidden="true" />
        <section id="soluciones" className="scroll-mt-24 border-b border-border bg-muted py-16 sm:py-20" aria-labelledby="soluciones-title">
          <div className={CONTAINER}>
            <Reveal className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">Nuestras soluciones</p>
              <h2 id="soluciones-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Cuatro frentes para sostener y hacer crecer tu operación
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Cada categoría agrupa servicios concretos. Elige por dónde empezar o conversemos para priorizar juntos.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {solutionCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <Reveal key={category.title} delay={index * 70} className="h-full">
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-[#1769AA]/40 hover:shadow-[0_28px_60px_-38px_rgba(23,105,170,0.55)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${category.accent}`}
                      />
                      <div className="flex items-start justify-between gap-4">
                        <span className="grid size-11 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                          <Icon className="size-5" />
                        </span>
                        <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-muted-foreground/70">
                          {category.number}
                        </span>
                      </div>
                      <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{category.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{category.description}</p>
                      <ul className="mt-4 grid flex-1 gap-2 sm:grid-cols-2">
                        {category.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-[11.5px] font-medium text-foreground/80">
                            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#0E7490]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
                        <Link
                          href={category.href}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-ink transition hover:text-[#0F86B8]"
                        >
                          {category.cta}
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                        {category.number === '04' && (
                          <a
                            href={storeUrl('/productos')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-blue-ink"
                          >
                            Ver tienda
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* 4. Infraestructura tecnológica */}
        <section className="relative isolate overflow-hidden bg-[#0A1C2E] py-16 text-white sm:py-24" aria-labelledby="infraestructura-title">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_80%_0%,#12466F_0%,#0A1C2E_60%)]" />
            <div className="absolute -bottom-32 left-1/4 size-[420px] rounded-full bg-[#00B8D9]/10 blur-[120px]" />
          </div>
          <div className={CONTAINER}>
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#75D7E8]">Infraestructura tecnológica</p>
                <h2 id="infraestructura-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Diseñada como un sistema, no como equipos aislados
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#B9CBDA]">
                  Servidores, red, seguridad y respaldo se planifican juntos para evitar puntos ciegos. Así, cada
                  componente cumple una función dentro de la operación y no se convierte en un gasto aislado.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Diseño previo con topología y dimensionamiento',
                    'Documentación técnica entregada a la empresa',
                    'Continuidad operativa durante la implementación',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#D7E3EC]">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#00B8D9]/15 text-[#75D7E8]">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/infraestructura-ti"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1769AA] px-5 text-sm font-bold text-white transition hover:bg-[#12568C]"
                  >
                    Conocer infraestructura TI
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/como-trabajamos"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/18 bg-white/[0.05] px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Ver metodología
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-5 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)] backdrop-blur sm:p-6">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#1769AA] to-[#0F86B8]">
                        <Sparkles className="size-4" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">Operación conectada</p>
                        <p className="text-[10px] text-[#8FA6BA]">Componentes que trabajan en conjunto</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#5EEAD4]">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2DD4BF]" />
                      Integrado
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {[
                      { icon: Server, label: 'Servidores' },
                      { icon: HardDrive, label: 'Almacenamiento' },
                      { icon: Wifi, label: 'Redes' },
                      { icon: ShieldCheck, label: 'Seguridad' },
                      { icon: Cloud, label: 'Nube' },
                      { icon: Cable, label: 'Cableado' },
                      { icon: Headset, label: 'Soporte' },
                      { icon: Lock, label: 'Accesos' },
                      { icon: Users, label: 'Usuarios' },
                    ].map((node) => (
                      <div
                        key={node.label}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B2236]/70 px-2.5 py-2.5 transition hover:border-[#00B8D9]/35 hover:bg-[#0E2C46]"
                      >
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#00B8D9]/12 text-[#75D7E8]">
                          <node.icon className="size-3.5" />
                        </span>
                        <span className="truncate text-[10.5px] font-semibold text-white">{node.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-[#0B2236]/70 px-3.5 py-3">
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="font-bold uppercase tracking-[0.12em] text-[#8FA6BA]">Continuidad</span>
                      <span className="text-[#5EEAD4]">Monitoreo · Respaldo · Soporte</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#1769AA] via-[#00B8D9] to-[#75D7E8]" />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 5. Metodología */}
        <section className="border-b border-border bg-card py-16 sm:py-20" aria-labelledby="metodologia-title">
          <div className={CONTAINER}>
            <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">Nuestra metodología</p>
                <h2 id="metodologia-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Un método claro, de principio a fin
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Cada etapa deja entregables verificables. Sabes qué sigue, quién lo ejecuta y cómo se valida.
                </p>
              </div>
              <Link
                href="/como-trabajamos"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-blue-ink transition hover:text-[#0F86B8]"
              >
                Ver proceso completo
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            <ProcessSequence layout="grid" className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {methodologySteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.title}
                    className="relative h-full overflow-hidden rounded-2xl border border-border bg-muted p-5 transition duration-300 hover:border-[#1769AA]/35 hover:bg-card hover:shadow-sm motion-reduce:transition-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="process-number font-heading text-2xl font-extrabold text-muted-foreground/50">
                        0{index + 1}
                      </span>
                      <span className="grid size-8 place-items-center rounded-lg bg-tint-blue text-blue-ink">
                        <Icon className="size-4" />
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-sm font-bold text-foreground">{step.title}</h3>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">{step.copy}</p>
                  </div>
                )
              })}
            </ProcessSequence>
          </div>
        </section>

        {/* 6. Soluciones para empresas */}
        <section className="border-b border-border bg-muted py-16 sm:py-20" aria-labelledby="empresas-title">
          <div className={CONTAINER}>
            <Reveal className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">Soluciones para empresas</p>
              <h2 id="empresas-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Cada empresa tiene un punto de partida distinto
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Adaptamos el alcance al tamaño y la madurez de tu operación, sin sobredimensionar la inversión.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {companyProfiles.map((profile, index) => {
                const Icon = profile.icon
                return (
                  <Reveal key={profile.title} delay={index * 80} className="h-full">
                    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition duration-300 hover:border-[#1769AA]/35 hover:shadow-md motion-reduce:transition-none">
                      <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-tint-blue to-[#E0F3F9] text-blue-ink">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mt-4 font-heading text-base font-bold text-foreground">{profile.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{profile.copy}</p>
                      <div className="mt-5 flex-1 border-t border-border pt-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/70">Enfoque</p>
                        <ul className="mt-2.5 space-y-2">
                          {profile.focus.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-[11.5px] font-medium text-foreground/80">
                              <Check className="mt-0.5 size-3 shrink-0 text-[#0E7490]" strokeWidth={3} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Link
                        href="/contacto"
                        className="group mt-6 inline-flex items-center gap-2 text-xs font-bold text-blue-ink transition hover:text-[#0F86B8]"
                      >
                        Conversar sobre mi empresa
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* 7. Proyectos y experiencia */}
        <section className="border-b border-border bg-card py-16 sm:py-20" aria-labelledby="proyectos-title">
          <div className={CONTAINER}>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">Proyectos y experiencia</p>
                <h2 id="proyectos-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Experiencia documentada, con autorización del cliente
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Publicamos un caso solo cuando el cliente lo autoriza y los resultados se pueden sustentar. Mientras
                  tanto, esta sección queda preparada para incorporar proyectos reales con su contexto completo.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/proyectos"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0B2236] px-5 text-sm font-bold text-white transition hover:bg-[#1769AA]"
                  >
                    Ver página de proyectos
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/contacto"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition hover:border-[#1769AA]/40 hover:text-blue-ink"
                  >
                    Contar mi proyecto
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="grid gap-3 sm:grid-cols-3">
                  {projectSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex min-h-[168px] flex-col justify-between rounded-2xl border border-dashed border-[#1769AA]/30 bg-muted/70 p-4"
                    >
                      <div>
                        <span className="inline-flex rounded-full bg-tint-blue px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-blue-ink">
                          Espacio reservado
                        </span>
                        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                          {slot.sector}
                        </p>
                        <p className="mt-1 font-heading text-sm font-bold text-foreground/80">{slot.title}</p>
                      </div>
                      <div className="space-y-1.5" aria-hidden="true">
                        {['Reto', 'Solución', 'Resultados'].map((field) => (
                          <div key={field} className="flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-[#1769AA]/40" />
                            <span className="h-1.5 flex-1 rounded-full bg-[#1769AA]/10" />
                            <span className="w-8 text-[8px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                              {field}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-[10px] text-muted-foreground sm:text-left">
                  Sin nombres, cifras ni resultados hasta contar con respaldo y autorización.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 8. Ecosistema SparkTree */}
        <section id="ecosistema" className="scroll-mt-24 border-b border-border bg-muted py-16 sm:py-20" aria-labelledby="ecosistema-title">
          <div className={CONTAINER}>
            <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">Ecosistema SparkTree</p>
                <h2 id="ecosistema-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Cuatro unidades, una misma forma de trabajar
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Systems se conecta con las demás unidades del ecosistema para cubrir tecnología, software, formación
                  y equipamiento.
                </p>
              </div>
              <a
                href={GROUP_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-blue-ink transition hover:text-[#0F86B8]"
              >
                Conocer el ecosistema
                <ExternalLink className="size-3.5" />
              </a>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ECOSYSTEM_UNITS.map((unit, index) => {
                const Icon = ecosystemIcons[unit.icon]
                const isExternal = unit.href.startsWith('http')
                const isHere = unit.slug === 'systems'
                const content = (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="grid size-11 place-items-center rounded-xl text-white"
                        style={{ backgroundColor: unit.accent }}
                      >
                        <Icon className="size-5" />
                      </span>
                      {isHere ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1769AA]/25 bg-tint-blue px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-blue-ink">
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-[#1769AA]" />
                          Estás aquí
                        </span>
                      ) : (
                        <span className="grid size-7 place-items-center rounded-full border border-border bg-card text-muted-foreground transition group-hover:border-[#1769AA]/40 group-hover:text-blue-ink">
                          {isExternal ? <ExternalLink className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-heading text-sm font-bold text-foreground">{unit.name}</h3>
                    <p className="mt-1 text-[10.5px] font-semibold text-blue-ink">{unit.tagline}</p>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">{unit.description}</p>
                  </>
                )

                return (
                  <Reveal key={unit.slug} delay={index * 70} className="h-full">
                    {isExternal ? (
                      <a
                        href={unit.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-[#1769AA]/35 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        href={unit.href}
                        aria-current={isHere ? 'page' : undefined}
                        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-[#1769AA]/35 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        {content}
                      </Link>
                    )}
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* 9. CTA final */}
        <section className="relative isolate overflow-hidden bg-[#0A1C2E] py-16 text-white sm:py-20" aria-labelledby="cta-final-title">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_15%_0%,#12466F_0%,#0A1C2E_65%)]" />
            <div className="absolute -right-24 -bottom-24 size-[360px] rounded-full bg-[#00B8D9]/12 blur-[110px]" />
          </div>
          <div className={CONTAINER}>
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <h2 id="cta-final-title" className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Tu empresa merece una infraestructura tecnológica preparada para crecer.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#B9CBDA] sm:text-base">
                    Conversemos sobre las necesidades tecnológicas de tu negocio y encontremos la solución adecuada.
                  </p>
                </div>
                <Link
                  href="/contacto"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1769AA] to-[#0F86B8] px-6 text-sm font-bold text-white shadow-[0_18px_38px_-18px_rgba(0,184,217,0.65)] transition duration-300 hover:-translate-y-0.5 hover:from-[#12568C] hover:to-[#00A9C7] motion-reduce:transition-none sm:w-auto"
                >
                  Solicitar asesoría
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  )
}
