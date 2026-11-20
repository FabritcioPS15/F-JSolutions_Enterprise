'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Code2,
  FolderKanban,
  Headset,
  Network,
} from 'lucide-react'
import {
  HiOutlineAcademicCap,
  HiOutlineCodeBracketSquare,
  HiOutlineComputerDesktop,
  HiOutlineCpuChip,
  HiOutlineServerStack,
  HiOutlineShieldCheck,
  HiOutlineWifi,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { HomeHero } from '@/components/heroes'
import { cn } from '@/lib/utils'

const businessLinks = [
  'Ventas corporativas',
  'Facturación electrónica',
  'Soporte postventa',
  'Garantías y devoluciones',
  'Despachos y entregas',
  'Medios de pago',
]

const enterpriseServices = [
  {
    title: 'Desarrollo de sistemas',
    copy: 'Aplicaciones a la medida y plataformas web',
    href: '/sistemas',
    icon: HiOutlineCodeBracketSquare,
  },
  {
    title: 'Soporte TI',
    copy: 'Atención técnica remota y en sitio',
    href: '/soporte-ti',
    icon: HiOutlineWrenchScrewdriver,
  },
  {
    title: 'Redes y conectividad',
    copy: 'Cableado estructurado y Wi-Fi corporativo',
    href: '/servicios',
    icon: HiOutlineWifi,
  },
  {
    title: 'Servidores y nube',
    copy: 'Infraestructura escalable y servidores dedicados',
    href: '/servicios',
    icon: HiOutlineServerStack,
  },
  {
    title: 'Ciberseguridad',
    copy: 'Protección de datos, firewalls y respaldos',
    href: '/servicios',
    icon: HiOutlineShieldCheck,
  },
  {
    title: 'Mantenimiento preventivo',
    copy: 'Diagnóstico periódico y optimización de hardware',
    href: '/soporte-ti',
    icon: HiOutlineCpuChip,
  },
  {
    title: 'Instalación y configuración',
    copy: 'Puesta en marcha de equipos y estaciones',
    href: '/soporte-ti',
    icon: HiOutlineComputerDesktop,
  },
  {
    title: 'Capacitación tecnológica',
    copy: 'Formación y buenas prácticas para tu equipo',
    href: '/soporte-ti',
    icon: HiOutlineAcademicCap,
  },
]


export function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-muted text-foreground">
      <EnhancedHeader />

      <HomeHero />

      {/* Accesos rápidos */}
      <section className="relative z-10 border-y border-border bg-muted py-6 sm:py-8 shadow-[inset_0_2px_4px_rgba(15,23,42,0.02)]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            <Reveal className="h-full">
              <Feature icon={<Headset />} title="Soporte TI" copy="Atención remota y en sitio" onClick={() => { window.location.href = '/soporte-ti' }} />
            </Reveal>
            <Reveal className="h-full" delay={70}>
              <Feature icon={<Network />} title="Infraestructura TI" copy="Redes, servidores y cableado" onClick={() => { window.location.href = '/infraestructura-ti' }} />
            </Reveal>
            <Reveal className="h-full" delay={140}>
              <Feature icon={<Code2 />} title="Desarrollo de sistemas" copy="Software a la medida" onClick={() => { window.location.href = '/sistemas' }} />
            </Reveal>
            <Reveal className="h-full" delay={210}>
              <Feature icon={<FolderKanban />} title="Proyectos y experiencia" copy="Casos de éxito y sectores" onClick={() => { window.location.href = '/proyectos' }} />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="servicios" className="border-y border-border bg-card scroll-mt-20 sm:scroll-mt-24 px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink sm:text-sm">Servicios para empresas</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">Soporte TI en cada etapa</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Implementamos, mantenemos y protegemos la operación tecnológica de tu empresa.</p>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {enterpriseServices.map((service, index) => (
              <Reveal key={service.title} className="h-full" delay={(index % 4) * 70}>
                <Info
                  href={service.href}
                  icon={service.icon}
                  title={service.title}
                  copy={service.copy}
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2 rounded-xl border border-blue-ink/25 bg-muted p-4">
            {businessLinks.map((link, index) => (
              <Reveal key={link} delay={index * 50}>
                <a href={link.includes('Soporte') ? '/soporte-ti' : '/cotizador-servicios'} className="inline-flex rounded-full border border-blue-ink/30 bg-card px-3 py-2 text-xs font-bold text-blue-ink transition duration-300 hover:-translate-y-0.5 hover:border-[#1465A6]/40 hover:bg-tint-blue hover:shadow-sm">{link}</a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal', shown && 'reveal-in', className)}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

function Feature({ icon, title, copy, onClick }: { icon: React.ReactNode; title: string; copy: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-full w-full items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4 text-left transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#2A82C4]/60 hover:shadow-[0_22px_45px_-24px_rgba(42,130,196,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A82C4]/45 focus-visible:ring-offset-2 active:translate-y-0 active:shadow-sm sm:gap-4 sm:p-5"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-tint-blue via-white to-tint-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-[#1769AA]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-tint-blue to-blue-ink/15 text-blue-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-110 group-hover:from-[#2A82C4] group-hover:to-[#1769AA] group-hover:text-white group-hover:shadow-[0_12px_24px_-10px_rgba(42,130,196,0.85)] sm:size-11">
        {icon}
      </span>
      <span className="relative flex-1">
        <span className="block font-heading text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-blue-ink sm:text-sm">{title}</span>
        <span className="mt-1 block text-[10px] text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground sm:text-xs">{copy}</span>
      </span>
      <span className="relative grid size-7 shrink-0 translate-x-1 place-items-center rounded-full border border-border bg-card text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:border-[#2A82C4]/30 group-hover:text-blue-ink group-hover:opacity-100">
        <ArrowRight className="size-3.5" />
      </span>
    </button>
  )
}

function Info({
  href,
  icon: Icon,
  title,
  copy,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  copy: string
}) {
  return (
    <a
      href={href}
      className="group flex h-full w-full items-center gap-3.5 rounded-2xl border border-border bg-muted p-4 transition-all duration-300 hover:border-[#2A82C4]/40 hover:bg-gradient-to-br hover:from-tint-blue hover:to-blue-ink/15 hover:shadow-md hover:shadow-[#2A82C4]/10 hover:-translate-y-0.5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-ink/15 to-[#bfe4f0] text-blue-ink transition-all duration-300 group-hover:scale-110 group-hover:from-[#2A82C4] group-hover:to-[#12568C] group-hover:text-white shadow-xs">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-xs sm:text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-[#2A82C4]">
          {title}
        </span>
        <span className="mt-1 block text-[10px] sm:text-xs leading-relaxed text-muted-foreground">
          {copy}
        </span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
    </a>
  )
}

