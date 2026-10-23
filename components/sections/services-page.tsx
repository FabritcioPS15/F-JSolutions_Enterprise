import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  ClipboardCheck,
  Cloud,
  Code2,
  Gauge,
  GraduationCap,
  Handshake,
  Headset,
  Laptop,
  Mail,
  Network,
  Phone,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

type ServiceItem = {
  icon: LucideIcon
  title: string
  description: string
  points: string[]
  href: string
}

const serviceList: ServiceItem[] = [
  {
    icon: Headset,
    title: 'Soporte TI gestionado',
    description:
      'Una mesa de ayuda para todo tu equipo, con atención remota y visitas en sitio cuando la situación lo requiere.',
    points: ['Mesa de ayuda y tickets', 'Soporte remoto y en sitio', 'Tiempos de respuesta (SLA)'],
    href: '/soporte-ti',
  },
  {
    icon: Network,
    title: 'Redes y conectividad',
    description:
      'Diseñamos e implementamos redes estables, seguras y listas para soportar el crecimiento de tu operación.',
    points: ['Wi-Fi empresarial', 'Cableado estructurado', 'Switches y routers gestionados'],
    href: '/servicios#contacto',
  },
  {
    icon: Server,
    title: 'Servidores y nube',
    description:
      'Infraestructura on-premise o en la nube, dimensionada según la carga real de tus sistemas.',
    points: ['Servidores físicos y virtuales', 'Migración a la nube', 'Monitoreo de disponibilidad'],
    href: '/servicios#contacto',
  },
  {
    icon: ShieldCheck,
    title: 'Ciberseguridad',
    description:
      'Protegemos la información de tu empresa con controles prácticos, respaldos y buenas prácticas.',
    points: ['Protección de endpoints', 'Correo y accesos seguros', 'Políticas de respaldo'],
    href: '/servicios#contacto',
  },
  {
    icon: Code2,
    title: 'Desarrollo de software',
    description:
      'Sistemas web y aplicaciones a medida para automatizar procesos y centralizar tu información.',
    points: ['Sistemas web internos', 'Integración con facturación', 'Automatización de reportes'],
    href: '/sistemas',
  },
  {
    icon: Laptop,
    title: 'Suministro de hardware',
    description:
      'Equipos corporativos con asesoría técnica, configuración inicial y garantía respaldada por marca.',
    points: ['Laptops y desktops', 'Monitores e impresoras', 'Compras por volumen'],
    href: '/productos',
  },
  {
    icon: Wrench,
    title: 'Mantenimiento preventivo',
    description:
      'Planes programados para reducir fallas, extender la vida útil de los equipos y evitar paradas.',
    points: ['Limpieza y revisión', 'Actualización de software', 'Reporte de estado'],
    href: '/servicios#contacto',
  },
  {
    icon: Cloud,
    title: 'Respaldo y continuidad',
    description:
      'Estrategias de backup y recuperación para que un incidente no detenga tu negocio.',
    points: ['Respaldos automáticos', 'Recuperación ante desastres', 'Pruebas de restauración'],
    href: '/servicios#contacto',
  },
  {
    icon: GraduationCap,
    title: 'Capacitación tecnológica',
    description:
      'Formación práctica para que tu equipo use las herramientas con seguridad y aproveche su potencial.',
    points: ['Office y herramientas cloud', 'Buenas prácticas de seguridad', 'Talleres a medida'],
    href: '/servicios#contacto',
  },
]

const process = [
  {
    icon: ClipboardCheck,
    step: '01',
    title: 'Diagnóstico',
    copy: 'Revisamos tu situación actual, equipos, red y procesos para identificar prioridades reales.',
  },
  {
    icon: Target,
    step: '02',
    title: 'Propuesta',
    copy: 'Definimos alcance, plazos y presupuesto. Te entregamos una propuesta clara, sin sorpresas.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Implementación',
    copy: 'Ejecutamos con orden, documentamos el cambio y validamos cada entregable contigo.',
  },
  {
    icon: Handshake,
    step: '04',
    title: 'Acompañamiento',
    copy: 'Continuamos con soporte, monitoreo y mejoras para que la solución siga funcionando.',
  },
]

const plans = [
  {
    name: 'Esencial',
    price: 'S/ 390',
    copy: 'Para equipos pequeños que necesitan orden y soporte confiable.',
    features: [
      'Hasta 10 equipos',
      'Soporte remoto 8Ã—5',
      'Mesa de ayuda por correo',
      'Monitoreo básico',
      'Respaldo en la nube',
    ],
    highlighted: false,
  },
  {
    name: 'Empresarial',
    price: 'S/ 890',
    copy: 'El equilibrio ideal entre cobertura, respuesta y prevención.',
    features: [
      'Hasta 30 equipos',
      'Remoto + visitas en sitio',
      'SLA de respuesta en 4 h',
      'Monitoreo 24/7',
      'Ciberseguridad gestionada',
      'Respaldo y recuperación',
    ],
    highlighted: true,
  },
  {
    name: 'Corporativo',
    price: 'A medida',
    copy: 'Para operaciones grandes con múltiples sedes y requerimientos específicos.',
    features: [
      'Equipos ilimitados',
      'Gestor de cuenta dedicado',
      'Auditorías y consultoría',
      'Continuidad operativa',
      'SLA personalizado',
      'Capacitación para el equipo',
    ],
    highlighted: false,
  },
]

const industries = [
  { icon: Building2, title: 'Comercio y retail', copy: 'Puntos de venta, inventario y redes por sede.' },
  { icon: GraduationCap, title: 'Educación', copy: 'Aulas digitales, equipamiento y soporte docente.' },
  { icon: ShieldCheck, title: 'Salud y clínicas', copy: 'Equipos confiables y respaldo de información.' },
  { icon: Wrench, title: 'Construcción', copy: 'Conectividad en obra y equipos de campo.' },
  { icon: Network, title: 'Logística', copy: 'Trazabilidad, almacenes y comunicación estable.' },
  { icon: Users, title: 'Estudios profesionales', copy: 'Estaciones de trabajo y software a medida.' },
]

const stats = [
  { value: '12+', label: 'Años de experiencia' },
  { value: '850+', label: 'Clientes atendidos' },
  { value: '2,400+', label: 'Equipos gestionados' },
  { value: '98%', label: 'Satisfacción' },
]

const faqs = [
  {
    q: '¿Cómo empieza un proyecto con FJ Tech?',
    a: 'Agendamos una conversación de diagnóstico sin costo. Revisamos tu necesidad, alcance y presupuesto, y en pocos días recibes una propuesta con etapas, entregables y costos.',
  },
  {
    q: '¿Puedo contratar soporte sin comprar equipos?',
    a: 'Sí. Los planes de soporte son independientes de la compra de hardware. Podemos gestionar los equipos que ya tienes, incluso si fueron adquiridos en otro proveedor.',
  },
  {
    q: '¿Trabajan con empresas fuera de Lima?',
    a: 'Sí. El soporte remoto cubre todo el Perú y coordinamos visitas en sitio para proyectos de implementación, redes y mantenimiento según el alcance acordado.',
  },
  {
    q: '¿Qué incluye el mantenimiento preventivo?',
    a: 'Incluye revisión de hardware, limpieza, actualizaciones, verificación de respaldos y un reporte del estado de cada equipo, con recomendaciones de mejora.',
  },
  {
    q: '¿En cuánto tiempo implementan una red o un servidor?',
    a: 'Depende del tamaño y la complejidad. Una red de oficina pequeña puede tomar entre 2 y 5 días; servidores o proyectos multisitio se planifican por etapas con fechas claras.',
  },
  {
    q: '¿Ofrecen facturación electrónica y crédito corporativo?',
    a: 'Sí. Emitimos facturas electrónicas y evaluamos condiciones de pago para empresas con historial comercial. Las condiciones se detallan en la propuesta.',
  },
]

export function ServicesPage() {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-[#22D3EE]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1280px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#2563EB]">
              <Sparkles className="size-3.5" /> Servicios TI para empresas
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.055em] text-[#0F172A] sm:text-6xl">
              La base tecnológica
              <br />
              <span className="text-[#2563EB]">de tu operación.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#475569]">
              Soporte técnico, mantenimiento, redes e infraestructura para mantener tus equipos y
              sistemas funcionando, con atención cercana.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#contacto"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold text-white shadow-lg shadow-[#2563EB]/20 transition hover:bg-[#1D4ED8]"
              >
                Solicitar asesoría <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/soporte-ti"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-6 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                Ver soporte TI <Headset className="size-4" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-[#475569]">
              <span className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-[#2563EB]" /> Diagnóstico sin costo
              </span>
              <span className="flex items-center gap-2">
                <Zap className="size-4 text-[#2563EB]" /> Atención personalizada
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#2563EB]" /> Soporte remoto y en sitio
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-extrabold text-[#0F172A]">Nuestro enfoque de trabajo</p>
                <span className="rounded-full bg-[#22D3EE]/10 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#0E7490]">
                  Con seguimiento
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {process.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                      <item.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">
                        <span className="mr-2 text-[10px] font-extrabold text-[#475569]">
                          {item.step}
                        </span>
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#475569]">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                  <Gauge className="size-4 text-[#2563EB]" /> Monitoreo de infraestructura
                </div>
                <span className="text-sm font-extrabold text-[#0E7490]">Según plan</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-2 hidden rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-lg sm:block">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-lg bg-[#22D3EE]/10 text-[#2563EB]">
                  <Headset className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">Atención directa</p>
                  <p className="text-[10px] text-[#475569]">Con un especialista</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="border-y border-[#E2E8F0] bg-[#F7F9FC]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
              Nuestros servicios
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
              Todo lo que tu operación necesita
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#475569]">
              Elige un servicio puntual o combínalos en un plan integral. Nos adaptamos al tamaño y
              la madurez tecnológica de tu empresa.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceList.map((service) => (
              <article
                key={service.title}
                className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#2563EB]/30 hover:shadow-lg hover:shadow-black/5"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
                  <service.icon className="size-6" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-[#0F172A]">{service.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#475569]">{service.description}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs text-[#475569]">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-[#0E7490]" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8]"
                >
                  Saber más <ArrowUpRight className="size-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
                Cómo trabajamos
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
                Un proceso claro, sin sorpresas
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#475569]">
              Cada proyecto tiene responsables, entregables y fechas. Tú siempre sabes en qué etapa
              estamos.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6"
              >
                <span className="text-4xl font-extrabold text-[#334155]">{item.step}</span>
                <span className="absolute right-5 top-5 grid size-9 place-items-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                  <item.icon className="size-4" />
                </span>
                <h3 className="mt-2 text-sm font-extrabold text-[#0F172A]">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#475569]">{item.copy}</p>
                {index < process.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[#475569] lg:block">
                    <ArrowRight className="size-5" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-[#F7F9FC]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
              Planes de soporte
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
              Elige el nivel de acompañamiento
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#475569]">
              Precios referenciales mensuales. Ajustamos el plan según la cantidad de equipos,
              sedes y criticidad de tu operación.
            </p>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-3 lg:items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-6 sm:p-7 ${
                  plan.highlighted
                    ? 'border-[#2563EB] bg-white shadow-2xl shadow-[#2563EB]/20 lg:-mt-3 lg:pb-10'
                    : 'border-[#E2E8F0] bg-white'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2563EB] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    Recomendado
                  </span>
                )}
                <p
                  className={`text-sm font-extrabold uppercase tracking-wide ${
                    plan.highlighted ? 'text-[#0E7490]' : 'text-[#2563EB]'
                  }`}
                >
                  {plan.name}
                </p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-mono text-4xl font-semibold tracking-tight">{plan.price}</span>
                  {plan.price.startsWith('S/') && (
                    <span
                      className={`pb-1 text-xs font-semibold ${
                        plan.highlighted ? 'text-[#475569]' : 'text-[#475569]'
                      }`}
                    >
                      /mes
                    </span>
                  )}
                </div>
                <p
                  className={`mt-2 text-xs leading-5 ${
                    plan.highlighted ? 'text-[#475569]' : 'text-[#475569]'
                  }`}
                >
                  {plan.copy}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs">
                      <span
                        className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full ${
                          plan.highlighted
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-[#22D3EE]/10 text-[#0E7490]'
                        }`}
                      >
                        <Check className="size-2.5" />
                      </span>
                      <span className={plan.highlighted ? 'text-[#0F172A]' : 'text-[#475569]'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cotizador"
                  className={`mt-6 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
                    plan.highlighted
                      ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                      : 'border border-[#E2E8F0] text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB]'
                  }`}
                >
                  Solicitar propuesta <ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-[#475569]">
            * Los precios no incluyen IGV. El alcance final se define luego del diagnóstico.
          </p>
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
              Industrias
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
              Entendemos tu contexto
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#475569]">
              No aplicamos la misma receta a todos. Adaptamos equipos, redes y soporte a la
              realidad de cada sector.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#2563EB]/30 bg-[#2563EB]/5 p-4">
              <span className="grid size-10 place-items-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                <TrendingUp className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">Tecnología alineada al negocio</p>
                <p className="text-xs text-[#475569]">
                  Priorizamos lo que impacta en productividad y continuidad.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {industries.map((industry) => (
              <div
                key={industry.title}
                className="flex gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#F8FAFC] text-[#2563EB]">
                  <industry.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">{industry.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#475569]">{industry.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-y border-[#E2E8F0] bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
              Preguntas frecuentes
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
              Antes de empezar
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#475569]">
              Estas son las dudas más comunes de empresas que nos contactan por primera vez.
            </p>
            <Link
              href="#contacto"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]"
            >
              Hacer otra consulta <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-[#E2E8F0] bg-white px-5 py-4 transition open:border-[#2563EB]/30 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#0F172A] [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronDown className="size-4 shrink-0 text-[#475569] transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#475569]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-[#2563EB]/20 bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC] px-6 py-10 shadow-sm sm:px-10 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#2563EB]/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-[#22D3EE]/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#334155]">
                Hablemos de tu proyecto
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
                Cuéntanos qué necesitas y armamos una propuesta.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#334155]">
                Diagnóstico sin costo, alcance claro y acompañamiento desde la primera reunión.
                Atendemos empresas de todos los tamaños.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/cotizador"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#22D3EE] px-5 text-sm font-bold text-[#0B1120] transition hover:bg-[#67E8F9]"
                >
                  Solicitar cotización <ArrowRight className="size-4" />
                </Link>
                <a
                  href="tel:+51999888777"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                >
                  <Phone className="size-4" /> +51 999 888 777
                </a>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9] p-5 backdrop-blur">
              <a href="tel:+51999888777" className="flex items-center gap-3 text-sm font-semibold">
                <span className="grid size-9 place-items-center rounded-lg bg-[#E2E8F0]">
                  <Phone className="size-4" />
                </span>
                +51 999 888 777
              </a>
              <a
                href="mailto:ventas@fjsolutions.pe"
                className="flex items-center gap-3 text-sm font-semibold"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-[#E2E8F0]">
                  <Mail className="size-4" />
                </span>
                ventas@fjsolutions.pe
              </a>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className="grid size-9 place-items-center rounded-lg bg-[#E2E8F0]">
                  <Headset className="size-4" />
                </span>
                Atención de lunes a sábado
              </div>
              <div className="mt-1 rounded-lg bg-white px-3 py-2 text-[11px] text-[#334155]">
                Respondemos solicitudes en menos de 24 horas hábiles.
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

