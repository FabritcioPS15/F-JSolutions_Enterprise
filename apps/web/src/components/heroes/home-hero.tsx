'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import {
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Headset,
  Laptop,
  Layers,
  Pause,
  Play,
  Router,
  Server,
  Truck,
} from 'lucide-react'
import {
  HERO_CONTAINER,
  HeroAccent,
  HeroAction,
  HeroActions,
  HeroPanel,
  HeroProof,
  HeroSection,
  HeroTitle,
} from '@/components/heroes/hero-primitives'
import {
  OpsConsoleVisual,
  SoftwareVisual,
  SupportVisual,
} from '@/components/heroes/hero-visuals'
import { CorporateHero } from '@/components/heroes/corporate-hero'
import { SpotlightHero } from '@/components/heroes/spotlight-hero'
import { cn } from '@/lib/utils'

/* ─── Visual especializada para el slide de Equipamiento & Hardware ─────── */

function EquipmentVisual() {
  const hardwareItems = [
    {
      icon: Laptop,
      category: 'Laptops Corporativas',
      title: 'Equipos de alta productividad',
      detail: 'Lenovo ThinkPad · Dell Latitude · HP ProBook',
      badge: 'Garantía 3 años',
      status: 'Disponible',
    },
    {
      icon: Server,
      category: 'Servidores & Nube',
      title: 'Infraestructura de almacenamiento',
      detail: 'Servidores en torre y rack · Xeon · Arreglos RAID',
      badge: 'Configuración lista',
      status: 'A medida',
    },
    {
      icon: Router,
      category: 'Redes & Conectividad',
      title: 'Switches, APs y Routers Gigabit',
      detail: 'Cisco · Ubiquiti UniFi · TP-Link Omada',
      badge: 'Soporte PoE+',
      status: 'En stock',
    },
  ]

  return (
    <div className="relative pt-4">
      <HeroPanel className="hero-float-soft">
        {/* Cabecera del panel */}
        <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F7] px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0F172A] text-white">
              <Boxes aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[#0F172A]">
                Suministro y Hardware
              </p>
              <p className="truncate text-[9.5px] text-[#64748B]">
                Equipamiento corporativo con garantía oficial
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#15803D]">
            Stock y despacho
          </span>
        </div>

        {/* Contenido con items destacados */}
        <div className="p-4 sm:p-5">
          <div className="space-y-2.5">
            {hardwareItems.map((item) => (
              <div
                key={item.category}
                className="flex items-center gap-3 rounded-xl border border-[#EEF2F7] bg-white p-2.5 transition-colors hover:border-[#2563EB]/30 hover:bg-[#F8FAFC]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <item.icon aria-hidden="true" className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[10.5px] font-bold text-[#0F172A]">
                      {item.category}
                    </p>
                    <span className="hidden rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[7.5px] font-semibold text-[#475569] sm:inline">
                      {item.badge}
                    </span>
                  </div>
                  <p className="truncate text-[9px] text-[#64748B]">{item.detail}</p>
                </div>
                <span className="shrink-0 rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[8px] font-bold text-[#1D4ED8]">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Bloque inferior de métricas de suministro */}
          <div className="mt-3.5 grid grid-cols-3 gap-2">
            {[
              { value: '100%', label: 'Garantía de marca' },
              { value: '24-48 h', label: 'Entrega en Lima' },
              { value: 'RUC 20', label: 'Factura oficial' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] px-2.5 py-2 text-center"
              >
                <p className="font-heading text-xs font-bold text-[#0F172A] sm:text-sm">
                  {stat.value}
                </p>
                <p className="mt-0.5 truncate text-[8px] font-medium text-[#64748B]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Aviso de asesoría */}
          <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] px-3 py-2 text-[8.5px]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#475569]">
              <Truck aria-hidden="true" className="size-3.5 text-[#2563EB]" />
              Envíos y coordinación a provincias
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-[#15803D]">
              <CheckCircle2 aria-hidden="true" className="size-3" />
              Asesoría técnica
            </span>
          </div>
        </div>
      </HeroPanel>
    </div>
  )
}

/* ─── Configuración de los Heros del carrusel ────────────────────────────── */

export type HeroSlide = {
  id: string
  tabLabel: string
  title: ReactNode
  description: string
  primaryAction: {
    label: string
    href: string
  }
  secondaryAction: {
    label: string
    href: string
  }
  proofItems: string[]
  visual: ReactNode
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'infraestructura',
    tabLabel: 'Infraestructura TI',
    title: (
      <>
        Tecnología que <HeroAccent>mueve</HeroAccent> tu operación.
      </>
    ),
    description:
      'Diseñamos, implementamos y damos soporte a la infraestructura, servidores, redes y centros de datos que tu empresa necesita para operar con máxima seguridad, alta disponibilidad y sin interrupciones.',
    primaryAction: {
      label: 'Solicitar cotización',
      href: '/cotizacion',
    },
    secondaryAction: {
      label: 'Explorar soluciones',
      href: '/servicios',
    },
    proofItems: [
      'Atención en Lima y todo el Perú',
      'Diagnóstico técnico sin costo',
      'SLA 99.8% garantizado',
    ],
    visual: <OpsConsoleVisual />,
  },
  {
    id: 'equipos',
    tabLabel: 'Equipos & Catálogo',
    title: (
      <>
        Equipos y tecnología para <HeroAccent>cada área</HeroAccent> de tu empresa.
      </>
    ),
    description:
      'Laptops corporativas, computadoras de alto rendimiento, servidores y periféricos de las marcas líderes mundiales. Compra inteligente con garantía directa, factura electrónica y asesoría especializada.',
    primaryAction: {
      label: 'Ver catálogo de productos',
      href: '/productos',
    },
    secondaryAction: {
      label: 'Cotizar equipamiento',
      href: '/cotizador',
    },
    proofItems: [
      'Marcas autorizadas y originales',
      'Garantía directa de fabricante',
      'Despachos coordinados a nivel nacional',
    ],
    visual: <EquipmentVisual />,
  },
  {
    id: 'soporte',
    tabLabel: 'Soporte Técnico',
    title: (
      <>
        Tu operación tecnológica <HeroAccent>no puede detenerse</HeroAccent>.
      </>
    ),
    description:
      'Resolvemos incidencias críticas, mantenemos tus estaciones de trabajo protegidas y blindamos tu conectividad. Atención remota inmediata y técnicos en sitio según acuerdos de nivel de servicio (SLA).',
    primaryAction: {
      label: 'Hablar con un especialista',
      href: '/soporte-ti',
    },
    secondaryAction: {
      label: 'Ver planes de soporte',
      href: '/servicios',
    },
    proofItems: [
      'Soporte remoto y en sitio',
      'Mantenimiento preventivo programado',
      'Respuesta ágil según SLA',
    ],
    visual: <SupportVisual />,
  },
  {
    id: 'software',
    tabLabel: 'Software a Medida',
    title: (
      <>
        Software a medida para procesos que <HeroAccent>ya no escalan</HeroAccent>.
      </>
    ),
    description:
      'Convertimos tus procesos manuales y hojas de cálculo en plataformas digitales escalables. Sistemas web, integraciones con facturación e inventario y automatizaciones diseñadas para la realidad de tu empresa.',
    primaryAction: {
      label: 'Cuéntanos tu proyecto',
      href: '/sistemas',
    },
    secondaryAction: {
      label: 'Ver casos de éxito',
      href: '/proyectos',
    },
    proofItems: [
      'Sistemas web y plataformas internas',
      'Automatización de procesos repetitivos',
      'Acompañamiento y soporte post-entrega',
    ],
    visual: <SoftwareVisual />,
  },
]

const SLIDE_DURATION_MS = 7000

/* ─── Componente Principal Multi-Hero ────────────────────────────────────── */

export function HomeHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  // Referencias para control táctil (swipe)
  const touchStartXRef = useRef<number | null>(null)
  const touchEndXRef = useRef<number | null>(null)

  const activeSlide = HERO_SLIDES[activeIndex]

  const goToSlide = useCallback((index: number) => {
    setActiveIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length)
    setProgress(0)
  }, [])

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex + 1)
  }, [activeIndex, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(activeIndex - 1)
  }, [activeIndex, goToSlide])

  // Temporizador de avance automático con barra de progreso fluida
  useEffect(() => {
    if (isPaused) return

    const intervalTime = 50 // ms
    const increment = (intervalTime / SLIDE_DURATION_MS) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToSlide(activeIndex + 1)
          return 0
        }
        return prev + increment
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [activeIndex, isPaused, goToSlide])

  // Navegación por teclado (Flechas izquierda / derecha)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Soporte para gestos táctiles (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return
    const diff = touchStartXRef.current - touchEndXRef.current
    const threshold = 50 // px

    if (diff > threshold) {
      nextSlide()
    } else if (diff < -threshold) {
      prevSlide()
    }

    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  return (
    <HeroSection
      id="inicio"
      fill
      className="group relative select-none"
    >
      <div
        className="flex flex-1 flex-col justify-between"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Contenido Activo del Hero (con transición suave) ── */}
        <div
          key={activeSlide.id}
          id={`panel-${activeSlide.id}`}
          role="region"
          aria-roledescription="diapositiva"
          aria-label={activeSlide.tabLabel}
          className={`${HERO_CONTAINER} flex flex-1 items-center py-[clamp(1.75rem,4vh,3.75rem)] animate-in fade-in-50 duration-300`}
        >
          <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-12 xl:gap-16">
            {/* Columna Izquierda: Información, Título y Acciones */}
            <div className="order-2 max-w-[620px] lg:order-1">
              <HeroTitle size="lg">{activeSlide.title}</HeroTitle>

              <p className="hero-reveal hero-delay-1 mt-4 text-[clamp(0.98rem,0.92rem+0.35vw,1.15rem)] font-normal leading-[1.65] text-[#475569]">
                {activeSlide.description}
              </p>

              <HeroActions>
                <HeroAction href={activeSlide.primaryAction.href}>
                  {activeSlide.primaryAction.label}
                </HeroAction>
                <HeroAction href={activeSlide.secondaryAction.href} variant="secondary">
                  {activeSlide.secondaryAction.label}
                </HeroAction>
              </HeroActions>

              <HeroProof items={activeSlide.proofItems} />
            </div>

            {/* Columna Derecha: Visual Interactiva */}
            <div className="order-1 lg:order-2">
              {activeSlide.visual}
            </div>
          </div>
        </div>

        {/* ── Controles y Contador de Diapositivas DENTRO del Hero (Rediseñado) ── */}
        <div className="relative pb-5 pt-1 sm:pb-7">
          <div className={`${HERO_CONTAINER}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF2F7] pt-4">
              {/* Indicadores interactivos de diapositivas con barra de progreso */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {HERO_SLIDES.map((slide, index) => {
                    const isActive = index === activeIndex
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir a diapositiva ${index + 1}: ${slide.tabLabel}`}
                        className={cn(
                          'group relative h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40',
                          isActive
                            ? 'w-10 sm:w-16 overflow-hidden bg-[#DBEAFE] ring-1 ring-[#2563EB]/30'
                            : 'w-2.5 bg-[#CBD5E1] hover:bg-[#94A3B8]',
                        )}
                      >
                        {isActive && (
                          <span
                            className="block h-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] transition-all duration-75"
                            style={{ width: `${progress}%` }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
                <span className="text-xs font-bold text-[#0F172A] pl-1 sm:text-[13px]">
                  {activeSlide.tabLabel}
                </span>
              </div>

              {/* Módulo de Control y Contador Numérico Transparente (Sin Fondo) */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPaused((prev) => !prev)}
                  className="group grid size-8 place-items-center rounded-lg bg-transparent text-[#64748B] transition-colors hover:bg-slate-200/60 hover:text-[#0F172A]"
                  aria-label={isPaused ? 'Reanudar pase automático' : 'Pausar pase automático'}
                  title={isPaused ? 'Reanudar pase automático' : 'Pausar pase automático'}
                >
                  {isPaused ? (
                    <Play className="size-3.5 fill-current text-[#2563EB]" />
                  ) : (
                    <Pause className="size-3.5 fill-current" />
                  )}
                </button>

                <div className="flex items-center gap-0.5 bg-transparent">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="grid size-8 place-items-center rounded-lg bg-transparent text-[#64748B] transition-colors hover:bg-slate-200/60 hover:text-[#0F172A]"
                    aria-label="Diapositiva anterior"
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  {/* Contador numérico transparente sin fondo */}
                  <div className="flex items-center gap-1 px-1.5 py-0.5 select-none font-mono">
                    <span className="text-[13px] font-bold text-[#1D4ED8]">
                      {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold text-[#94A3B8]">/</span>
                    <span className="text-xs font-semibold text-[#64748B]">
                      {String(HERO_SLIDES.length).padStart(2, '0')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="grid size-8 place-items-center rounded-lg bg-transparent text-[#64748B] transition-colors hover:bg-slate-200/60 hover:text-[#0F172A]"
                    aria-label="Diapositiva siguiente"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroSection>
  )
}

/**
 * Variantes del hero de portada.
 * Mantiene compatibilidad con la arquitectura del monorepo.
 */
export const homeHeroVariants = {
  corporate: CorporateHero,
  spotlight: SpotlightHero,
  multi: HomeHeroCarousel,
} satisfies Record<string, ComponentType>

export type HomeHeroVariant = keyof typeof homeHeroVariants

export const ACTIVE_HOME_HERO: HomeHeroVariant = 'multi'

type HomeHeroProps = {
  variant?: HomeHeroVariant
}

export function HomeHero({ variant = ACTIVE_HOME_HERO }: HomeHeroProps) {
  if (variant === 'multi') {
    return (
      <div className="home-hero-shell">
        <HomeHeroCarousel />
      </div>
    )
  }

  const Hero = homeHeroVariants[variant]

  return (
    <div className="home-hero-shell">
      <Hero />
    </div>
  )
}
