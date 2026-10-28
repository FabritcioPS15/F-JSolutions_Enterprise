'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  GraduationCap,
  HardDrive,
  HeartHandshake,
  Layers,
  Network,
  Phone,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
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

type ProjectSector = 'todos' | 'servicios' | 'retail' | 'distribucion' | 'salud' | 'educacion' | 'logistica'

interface CaseStudy {
  id: string
  sectorId: ProjectSector
  sectorLabel: string
  icon: LucideIcon
  title: string
  clientType: string
  context: string
  challenge: string
  solution: string[]
  results: { label: string; metric: string }[]
  technologies: string[]
  duration: string
  quote?: {
    text: string
    author: string
    role: string
  }
}

const caseStudies: CaseStudy[] = [
  {
    id: 'red-corporativa-sede',
    sectorId: 'servicios',
    sectorLabel: 'Servicios Profesionales',
    icon: Briefcase,
    title: 'Modernización de red y conectividad corporativa para sede de 65 colaboradores',
    clientType: 'Firma de consultoría legal y contable',
    context: 'La sede dependía de equipamiento doméstico heterogéneo y cableado estructurado sin etiquetar ni certificar, sufriendo caídas diarias en horas pico.',
    challenge: 'Garantizar disponibilidad del 99.8% sin interrumpir las operaciones del bufete durante la jornada laboral.',
    solution: [
      'Auditoría y levantamiento de topología existente con certificación de puntos',
      'Despliegue de switches administrables Gigabit PoE+ y segmentación por VLANs (Voz, Datos, Visitas)',
      'Instalación de Access Points Wi-Fi 6 empresariales con cobertura unificada (Roaming rápido)',
      'Organización integral de rack de comunicaciones y rotulación de patch panels con documentación digital',
    ],
    results: [
      { label: 'Disponibilidad de red', metric: '99.95%' },
      { label: 'Caídas en horas pico', metric: '0 incidencias' },
      { label: 'Velocidad de transferencia LAN', metric: '10x más rápida' },
    ],
    technologies: ['VLANs', 'Wi-Fi 6', 'PoE+ Switches', 'Cableado Cat6A', 'Firewall Hardware'],
    duration: '3 semanas',
    quote: {
      text: 'F&J Systems ordenó nuestro caos de red en un fin de semana. No tuvimos ni una hora de corte en horario laboral.',
      author: 'Carlos Meneses',
      role: 'Gerente de Administración y Finanzas',
    },
  },
  {
    id: 'mesa-ayuda-remota',
    sectorId: 'retail',
    sectorLabel: 'Comercio y Retail',
    icon: ShoppingBag,
    title: 'Mesa de ayuda unificada y mantenimiento preventivo para cadena con 8 puntos de venta',
    clientType: 'Cadena de tiendas de conveniencia y tecnología',
    context: 'Las incidencias operativas en cajas y terminales se reportaban por chat informal, provocando demoras de hasta 48 horas en la atención de fallas.',
    challenge: 'Centralizar los requerimientos en un único canal con SLA garantizado inferior a 2 horas para cajas de cobro.',
    solution: [
      'Implementación de sistema de tickets con asignación automática por criticidad',
      'Soporte remoto con monitorización de telemetría y salud de discos en tiempo real',
      'Mantenimiento preventivo bimensual en sitio fuera del horario comercial',
      'Estandarización de imágenes de sistema en terminales POS para restauración veloz en <20 min',
    ],
    results: [
      { label: 'Tiempo medio de respuesta', metric: '<35 min' },
      { label: 'Reducción de paradas en caja', metric: '-82%' },
      { label: 'Equipos bajo inventario activo', metric: '100%' },
    ],
    technologies: ['Helpdesk SLA', 'Monitoreo RMM', 'POS Imaging', 'Soporte 24/7', 'Inventario QR'],
    duration: 'Servicio continuo (3+ años)',
    quote: {
      text: 'Tener a un equipo responsable que responde en minutos cuando se traba una caja es indispensable para no perder ventas.',
      author: 'Milagros Valencia',
      role: 'Jefa de Operaciones Retail',
    },
  },
  {
    id: 'sistema-inventario-distribucion',
    sectorId: 'distribucion',
    sectorLabel: 'Distribución y Comercio',
    icon: Truck,
    title: 'Plataforma web de gestión de inventarios multisede, ventas y facturación electrónica',
    clientType: 'Distribuidora mayorista de repuestos industriales',
    context: 'El control de stock se llevaba en múltiples hojas de Excel desincronizadas, lo que originaba desfases de stock y retrasos en los despachos.',
    challenge: 'Migrar a una plataforma web segura en la nube con actualización inmediata entre almacén central y dos locales de despacho.',
    solution: [
      'Desarrollo de aplicación web modular (React + Node.js) con interfaz intuitiva y roles diferenciados',
      'Módulo de transferencias entre sedes con control de números de serie y guías de remisión',
      'Integración con web services de SUNAT para emisión directa de comprobantes de pago',
      'Dashboard analítico para gerencia con alertas automáticas de reposición de inventario',
    ],
    results: [
      { label: 'Tiempo en cierres de mes', metric: 'De 4 días a 2 horas' },
      { label: 'Precisión de inventario físico vs sistema', metric: '99.4%' },
      { label: 'Tiempo promedio de facturación', metric: '-65%' },
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'API Facturación SUNAT', 'AWS Cloud'],
    duration: '4 meses de desarrollo + soporte',
    quote: {
      text: 'El sistema diseñado por F&J Systems eliminó los errores en despachos y nos dio visión exacta de la mercadería.',
      author: 'Ricardo Alvarado',
      role: 'Director General',
    },
  },
  {
    id: 'respaldos-seguridad-clinica',
    sectorId: 'salud',
    sectorLabel: 'Salud y Clínicas',
    icon: Stethoscope,
    title: 'Estrategia de respaldo 3-2-1, seguridad y plan de continuidad para historias clínicas',
    clientType: 'Centro médico de diagnóstico por imágenes',
    context: 'Disponían de copias locales en discos externos sin pruebas de restauración programadas ni cifrado de datos conforme a normativas de salud.',
    challenge: 'Asegurar la inmutabilidad de imágenes médicas DICOM y disponibilidad inmediata ante eventuales contingencias o ciberataques.',
    solution: [
      'Diseño e implementación de arquitectura de respaldos 3-2-1 (Copia local en NAS RAID + Nube inmutable cifrada)',
      'Automatización de pruebas periódicas de restauración con simulación de contingencia',
      'Segmentación de servidores PACS/RIS con políticas estrictas de firewall y acceso Zero Trust',
      'Capacitación al personal administrativo en prevención de phishing y seguridad digital',
    ],
    results: [
      { label: 'RPO (Pérdida máxima de datos)', metric: '<15 min' },
      { label: 'RTO (Tiempo de recuperación)', metric: '<1.5 horas' },
      { label: 'Cifrado de extremo a extremo', metric: 'AES-256' },
    ],
    technologies: ['NAS Synology RAID', 'Backup Inmutable S3', 'AES-256', 'Veeam Backup', 'Zero Trust'],
    duration: '4 semanas',
    quote: {
      text: 'La tranquilidad de saber que las historias clínicas y estudios de nuestros pacientes están 100% blindados no tiene precio.',
      author: 'Dra. Patricia Huamán',
      role: 'Directora Médica',
    },
  },
  {
    id: 'suministro-despliegue-colegio',
    sectorId: 'educacion',
    sectorLabel: 'Educación y Academias',
    icon: GraduationCap,
    title: 'Suministro corporativo, configuración de imagen base y despliegue de 80 equipos para campus',
    clientType: 'Institución educativa privada',
    context: 'La apertura del nuevo ciclo lectivo requería equipar dos laboratorios de cómputo y estaciones docentes en un plazo improrrogable de 10 días.',
    challenge: 'Suministrar hardware de alto rendimiento asegurando consistencia de software, congelamiento de disco y garantía in-situ.',
    solution: [
      'Asesoría técnica y adquisición por volumen con mejores condiciones comerciales y garantía directa',
      'Creación y validación de imagen de sistema con paquetería educativa y software de bloqueo por reinicio',
      'Despliegue masivo por red en 48 horas con rotulación física de activos y vinculación en Active Directory',
      'Acta formal de entrega técnica con inventario detallado de números de serie y periféricos',
    ],
    results: [
      { label: 'Estaciones desplegadas a tiempo', metric: '80 / 80 equipos' },
      { label: 'Tiempo de despliegue por equipo', metric: '6 min (PXE)' },
      { label: 'Satisfacción del personal docente', metric: '100%' },
    ],
    technologies: ['PXE Network Boot', 'Sysprep Windows 11', 'Deep Freeze', 'Active Directory', 'HP & Lenovo'],
    duration: '10 días calendario',
    quote: {
      text: 'Cumplieron con la entrega antes del inicio de clases y dejaron todo listo para que los alumnos entraran a usar las computadoras.',
      author: 'Ing. Raúl Cárdenas',
      role: 'Coordinador de Tecnologías Educativas',
    },
  },
  {
    id: 'automatizacion-reportes-logistica',
    sectorId: 'logistica',
    sectorLabel: 'Logística y Almacén',
    icon: Workflow,
    title: 'Automatización de indicadores de trazabilidad y panel de control logístico en tiempo real',
    clientType: 'Operador logístico de transporte de carga',
    context: 'Cada semana un equipo de tres personas compilaba manualmente guías y tiempos de entrega, perdiendo visibilidad de demoras en rutas críticas.',
    challenge: 'Conectar hojas de ruta GPS con el sistema de despacho para obtener KPIs en tiempo real sin recargar de trabajo a los coordinadores.',
    solution: [
      'Desarrollo de pipeline de datos automatizado que sincroniza tracking satelital con órdenes de entrega',
      'Dashboard interactivo con alertas inmediatas sobre vehículos detenidos o rutas desviadas',
      'Envío automático de notificaciones vía WhatsApp y correo a clientes finales con estado de pedido',
      'Exportación en un clic de indicadores operativos para reuniones semanales de directorio',
    ],
    results: [
      { label: 'Ahorro de horas hombre semanales', metric: '18 horas' },
      { label: 'Detección temprana de demoras', metric: 'Inmediata (<5 min)' },
      { label: 'Mejora en satisfacción de clientes', metric: '+34%' },
    ],
    technologies: ['Python ETL', 'PostgreSQL', 'Metabase Dashboard', 'WhatsApp Business API', 'Webhooks'],
    duration: '5 semanas',
  },
]

const sectors = [
  { id: 'todos', label: 'Todos los sectores' },
  { id: 'servicios', label: 'Servicios Profesionales' },
  { id: 'retail', label: 'Comercio y Retail' },
  { id: 'distribucion', label: 'Distribución' },
  { id: 'salud', label: 'Salud' },
  { id: 'educacion', label: 'Educación' },
  { id: 'logistica', label: 'Logística' },
]

export function ProjectsPage() {
  const [selectedSector, setSelectedSector] = useState<ProjectSector>('todos')
  const [searchFilter, setSearchFilter] = useState('')

  const filteredStudies = useMemo(() => {
    return caseStudies.filter((study) => {
      const matchesSector = selectedSector === 'todos' || study.sectorId === selectedSector
      const matchesSearch =
        searchFilter.trim() === '' ||
        study.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        study.clientType.toLowerCase().includes(searchFilter.toLowerCase()) ||
        study.technologies.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase())) ||
        study.context.toLowerCase().includes(searchFilter.toLowerCase())
      return matchesSector && matchesSearch
    })
  }, [selectedSector, searchFilter])

  return (
    <div className="min-h-screen bg-white text-[#0F172A] selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      <EnhancedHeader />

      <main>
        {/* Hero Editorial */}
        <EditorialHero
          id="hero-proyectos"
          title={
            <>
              Experiencia comprobada en{' '}
              <span className="text-[#2563EB]">infraestructura, software y soporte TI</span>
            </>
          }
          description="Conoce cómo acompañamos a empresas, instituciones y comercios a resolver retos técnicos reales con metodologías claras, plazos cumplidos y resultados medibles."
          meta={[
            '12+ años en el mercado',
            '850+ clientes corporativos',
            'SLA 99.8% garantizado',
            'Atención en Lima y provincias',
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <HeroAction href="/contacto" variant="primary">
                Conversar sobre tu proyecto
                <ArrowRight className="size-4" />
              </HeroAction>
              <HeroAction href="/como-trabajamos" variant="secondary">
                Ver cómo trabajamos
              </HeroAction>
            </div>
          }
        />

        {/* Indicadores clave */}
        <section className="border-y border-[#E2E8F0] bg-[#F8FAFC] py-10" aria-label="Cifras clave">
          <div className={CONTAINER}>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="border-l-2 border-[#2563EB] pl-4">
                <p className="font-heading text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">850+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Empresas atendidas</p>
              </div>
              <div className="border-l-2 border-[#2563EB] pl-4">
                <p className="font-heading text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">2,400+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Equipos gestionados</p>
              </div>
              <div className="border-l-2 border-[#2563EB] pl-4">
                <p className="font-heading text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">&lt;35 min</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Tiempo promedio respuesta</p>
              </div>
              <div className="border-l-2 border-[#2563EB] pl-4">
                <p className="font-heading text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">99.8%</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Uptime promedio en redes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros y buscador */}
        <section className="pt-12 sm:pt-16 pb-6" aria-label="Filtro de proyectos">
          <div className={CONTAINER}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">Portafolio de soluciones</p>
                <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                  Casos de estudio por sector
                </h2>
              </div>

              {/* Buscador interactivo */}
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Buscar por tecnología, reto..."
                  className="h-10 w-full rounded-xl border border-[#CBD5E1] bg-white pl-10 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                />
              </div>
            </div>

            {/* Selector por chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {sectors.map((sector) => {
                const active = selectedSector === sector.id
                return (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => setSelectedSector(sector.id as ProjectSector)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {sector.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Lista de Casos de Estudio */}
        <section className="pb-16 sm:pb-24" aria-label="Listado de casos de estudio">
          <div className={CONTAINER}>
            {filteredStudies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] py-16 text-center">
                <Search className="mx-auto size-8 text-[#94A3B8]" />
                <h3 className="mt-3 text-base font-semibold text-[#0F172A]">No encontramos proyectos con ese criterio</h3>
                <p className="mt-1 text-sm text-[#64748B]">Intenta ajustar el filtro de sector o limpiar el término de búsqueda.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSector('todos')
                    setSearchFilter('')
                  }}
                  className="mt-4 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1D4ED8]"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                {filteredStudies.map((study) => {
                  const Icon = study.icon
                  return (
                    <article
                      key={study.id}
                      className="group flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition duration-200 hover:border-[#2563EB]/40 hover:shadow-md sm:p-8"
                    >
                      <div>
                        {/* Top header */}
                        <div className="flex items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
                          <div className="flex items-center gap-2.5">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                              <Icon className="size-4" />
                            </span>
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                                {study.sectorLabel}
                              </span>
                              <p className="text-xs text-[#64748B]">{study.clientType}</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-medium text-[#475569]">
                            <Clock className="size-3" />
                            {study.duration}
                          </span>
                        </div>

                        {/* Title & Context */}
                        <h3 className="mt-5 font-heading text-lg font-bold leading-snug text-[#0F172A] sm:text-xl">
                          {study.title}
                        </h3>

                        <div className="mt-3 rounded-lg bg-[#F8FAFC] p-3 text-xs leading-relaxed text-[#475569]">
                          <strong className="font-semibold text-[#0F172A]">Contexto inicial: </strong>
                          {study.context}
                        </div>

                        {/* Actions implemented */}
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                            Solución técnica implementada:
                          </p>
                          <ul className="space-y-1.5 text-xs text-[#475569]">
                            {study.solution.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#2563EB]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Metrics banner */}
                        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF]/50 p-3">
                          {study.results.map((res, idx) => (
                            <div key={idx} className="text-center">
                              <p className="font-heading text-sm font-bold text-[#2563EB] sm:text-base">{res.metric}</p>
                              <p className="mt-0.5 text-[10px] font-medium text-[#475569] leading-tight">{res.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Client quote if available */}
                        {study.quote && (
                          <div className="mt-4 border-l-2 border-[#2563EB] pl-3 py-1 text-xs italic text-[#475569]">
                            &ldquo;{study.quote.text}&rdquo;
                            <span className="block mt-1 font-semibold not-italic text-[#0F172A]">
                              — {study.quote.author}, <span className="font-normal text-[#64748B]">{study.quote.role}</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom tags & footer */}
                      <div className="mt-6 border-t border-[#F1F5F9] pt-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            {study.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-[#E2E8F0] bg-white px-2 py-0.5 text-[10px] font-medium text-[#64748B]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <Link
                            href="/contacto"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] transition hover:text-[#1D4ED8]"
                          >
                            Consultar similar
                            <ArrowRight className="size-3" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Banner de llamada a la acción */}
        <section className="border-t border-[#E2E8F0] bg-[#0F172A] py-16 text-white" aria-label="Contacto de proyectos">
          <div className={CONTAINER}>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#38BDF8]">
                  ¿Tienes un proyecto en mente?
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Evaluemos la infraestructura o software de tu empresa
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#94A3B8]">
                  Agenda una sesión de diagnóstico inicial sin costo con un especialista técnico de F&J Systems.
                  Revisamos tus requerimientos y te entregamos una propuesta clara con alcance y presupuesto cerrado.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  Solicitar diagnóstico
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={`https://wa.me/${EMPRESA.telefono.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <Phone className="size-4" />
                  Escribir al WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
