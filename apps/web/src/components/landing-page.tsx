'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Laptop,
  SlidersHorizontal,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { CorporateHero } from '@/components/heroes'
import { ProductCard } from '@/components/cards/product-card'
import { categories } from '@/lib/catalog'
import { getFeaturedProducts } from '@/lib/product-feed'
import { cn } from '@/lib/utils'
import { useQuote } from '@/lib/use-quote'

const businessLinks = ['Ventas corporativas', 'Facturación electrónica', 'Soporte postventa', 'Garantías y devoluciones', 'Despachos y entregas', 'Medios de pago']
const serviceOptions = ['Desarrollo de sistemas', 'Soporte TI', 'Redes y conectividad', 'Servidores y nube', 'Ciberseguridad', 'Mantenimiento preventivo', 'Instalación y configuración', 'Capacitación tecnológica']

const quickStats = [
  { value: '10K+', label: 'Clientes satisfechos' },
  { value: '500+', label: 'Productos' },
  { value: '15+', label: 'Años de experiencia' },
  { value: '24/7', label: 'Soporte TI' },
]

export function LandingPage() {
  const quote = useQuote()
  const [category, setCategory] = useState('Todas')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [visiblePages, setVisiblePages] = useState(1)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryOpen(false)
      }
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [])

  useEffect(() => {
    setVisiblePages(1)
    trackRef.current?.scrollTo({ left: 0 })
  }, [category])

  const syncArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanScrollLeft(track.scrollLeft > 4)
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }, [])

  const featured = useMemo(
    () => getFeaturedProducts({ category, pages: visiblePages }),
    [category, visiblePages],
  )

  useEffect(() => {
    syncArrows()
    window.addEventListener('resize', syncArrows)
    return () => window.removeEventListener('resize', syncArrows)
  }, [featured.items.length, syncArrows])

  const handleTrackScroll = () => {
    const track = trackRef.current
    if (!track) return

    syncArrows()

    // Carga la siguiente tanda al acercarse al final del carrusel.
    if (featured.hasMore && track.scrollLeft + track.clientWidth >= track.scrollWidth - 160) {
      setVisiblePages((value) => value + 1)
    }
  }

  const scrollCarousel = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f8fafc] text-[#172033]">
      <EnhancedHeader quoteCount={quote.count} />

      <CorporateHero />

      {/* Accesos rápidos */}
      <section className="mx-auto max-w-[1280px] px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="h-full">
            <Feature icon={<Calculator />} title="Cotizador de PC" copy="Arma tu equipo ideal" onClick={() => { window.location.href = '/cotizacion' }} />
          </Reveal>
          <Reveal className="h-full" delay={70}>
            <Feature icon={<BarChart3 />} title="Comparar productos" copy="Elige con confianza" />
          </Reveal>
          <Reveal className="h-full" delay={140}>
            <Feature icon={<Laptop />} title="Asesoría especializada" copy="Te ayudamos a decidir" />
          </Reveal>
          <Reveal className="h-full" delay={210}>
            <Feature icon={<Globe />} title="Servicios TI" copy="Soporte para empresas" onClick={() => { window.location.href = '/servicios' }} />
          </Reveal>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="mx-auto max-w-[1280px] px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#e5eaf0] bg-white p-4 sm:p-5 shadow-sm sm:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Reveal key={stat.label} className="h-full" delay={index * 70}>
              <div className="text-center transition-transform duration-300 hover:scale-105">
                <p className="text-lg font-bold text-[#155eef] sm:text-xl lg:text-2xl">{stat.value}</p>
                <p className="mt-1 text-[10px] font-semibold text-[#64748b] sm:text-xs">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-[1280px] scroll-mt-20 sm:scroll-mt-24 px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        <Reveal className="relative z-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#155eef] sm:text-sm">Selección FJ Tech</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] sm:text-3xl lg:text-4xl">Productos destacados</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div ref={categoryRef} className="relative">
              <button type="button" onClick={() => setCategoryOpen((value) => !value)} aria-expanded={categoryOpen} aria-haspopup="listbox" className={`flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition ${category !== 'Todas' ? 'border-[#155eef]/30 bg-[#eef5ff] text-[#155eef]' : 'border-[#dbe2ea] bg-white text-[#172033] hover:border-[#155eef]/40 hover:text-[#155eef]'}`}>
                <SlidersHorizontal className="size-4" />
                {category === 'Todas' ? 'Categorías' : category}
                <ChevronDown className={`size-4 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryOpen && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-64 rounded-xl border border-[#e5eaf0] bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)] sm:left-auto sm:right-0">
                  <div className="max-h-72 overflow-y-auto">
                    <button type="button" onClick={() => { setCategory('Todas'); setCategoryOpen(false) }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${category === 'Todas' ? 'bg-[#eef5ff] text-[#155eef]' : 'text-[#172033] hover:bg-[#f8fafc]'}`}>
                      Todas las categorías
                      {category === 'Todas' && <Check className="size-4" />}
                    </button>
                    <div className="my-1 h-px bg-[#eef2f6]" />
                    {categories.map((item) => (
                      <button key={item} type="button" onClick={() => { setCategory(item); setCategoryOpen(false) }} className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${category === item ? 'bg-[#eef5ff] text-[#155eef]' : 'text-[#172033] hover:bg-[#f8fafc]'}`}>
                        {item}
                        {category === item && <Check className="size-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <a href="/productos" className="group inline-flex h-10 items-center gap-2 rounded-lg border border-[#dbe2ea] bg-white px-4 text-sm font-semibold text-[#172033] transition hover:border-[#155eef]/40 hover:text-[#155eef]">
              Ver catálogo completo <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <div className="flex items-center gap-1.5">
              <span className="mr-1 hidden text-xs font-semibold text-[#64748b] sm:inline">
                {featured.items.length} de {featured.total}
              </span>
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                disabled={!canScrollLeft}
                aria-label="Ver productos anteriores"
                className="grid size-10 place-items-center rounded-lg border border-[#dbe2ea] bg-white text-[#172033] transition hover:border-[#155eef]/40 hover:text-[#155eef] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                disabled={!canScrollRight}
                aria-label="Ver más productos"
                className="grid size-10 place-items-center rounded-lg border border-[#dbe2ea] bg-white text-[#172033] transition hover:border-[#155eef]/40 hover:text-[#155eef] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </Reveal>
        {featured.total === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[#dbe2ea] bg-white px-4 py-10 text-center">
            <p className="text-sm font-bold text-[#172033]">No hay productos en esta categoría</p>
            <p className="mt-1 text-xs text-[#64748b]">Prueba con otra categoría o revisa el catálogo completo.</p>
            <button
              type="button"
              onClick={() => setCategory('Todas')}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#155eef] px-4 text-sm font-semibold text-white transition hover:bg-[#0f4fd1]"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <Reveal className="mt-5">
            <div
              ref={trackRef}
              onScroll={handleTrackScroll}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {featured.items.map((product) => (
                <div
                  key={product.id}
                  className="w-[86%] shrink-0 snap-start sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-10.667px)] xl:w-[calc(25%-12px)]"
                >
                  <ProductCard product={product} onAddToQuote={quote.addItem} />
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </section>

      <section id="servicios" className="border-y border-[#e5eaf0] bg-white scroll-mt-20 sm:scroll-mt-24 px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#155eef] sm:text-sm">Servicios para empresas</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">Soporte TI en cada etapa</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748b]">Además de vender tecnología, ayudamos a implementar, mantener y proteger tu operación.</p>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceOptions.map((service, index) => (
              <Reveal key={service} className="h-full" delay={(index % 4) * 70}>
                <Info href={['/sistemas', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti'][index]} icon={['⌘', '◫', '◈', '✓', '◆', '◌', '＋', '◇'][index]} title={service} copy={['Atención remota y en sitio', 'Configuración y monitoreo', 'Protección para tu empresa', 'Asesoría para compras corporativas', 'Aplicaciones a la medida', 'Infraestructura escalable', 'Implementación profesional', 'Formación para tu equipo'][index]} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2 rounded-xl border border-[#dbeafe] bg-[#f8fbff] p-4">
            {businessLinks.map((link, index) => (
              <Reveal key={link} delay={index * 50}>
                <a href={link.includes('Soporte') ? '/soporte-ti' : '/cotizacion'} className="inline-flex rounded-full border border-[#cbdcfb] bg-white px-3 py-2 text-xs font-bold text-[#155eef] transition duration-300 hover:-translate-y-0.5 hover:border-[#155eef]/40 hover:bg-[#e8f0ff] hover:shadow-sm">{link}</a>
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
      className="group flex h-full w-full items-center gap-3 sm:gap-4 rounded-2xl border border-[#e5eaf0] bg-white p-4 sm:p-5 text-left transition-all duration-300 hover:border-[#3B82F6] hover:shadow-lg hover:shadow-[#3B82F6]/15 hover:-translate-y-1"
    >
      <span className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e8f0ff] to-[#dbeafe] text-[#155eef] transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#3B82F6] group-hover:to-[#2563EB] group-hover:text-white">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-heading text-xs sm:text-sm font-bold text-[#172033] transition-colors duration-300 group-hover:text-[#3B82F6]">{title}</span>
        <span className="mt-1 block text-[10px] sm:text-xs text-[#64748b]">{copy}</span>
      </span>
      <ArrowRight className="size-4 text-[#94a3b8] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
    </button>
  )
}

function Info({ href, icon, title, copy }: { href: string; icon: string; title: string; copy: string }) {
  return (
    <a
      href={href}
      className="group flex h-full w-full items-center gap-3 sm:gap-4 rounded-xl bg-[#f8fafc] p-3 sm:p-4 transition-all duration-300 hover:bg-gradient-to-br hover:from-[#eef5ff] hover:to-[#dbeafe] hover:shadow-md hover:shadow-[#3B82F6]/10 hover:-translate-y-0.5"
    >
      <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] font-bold text-[#155eef] transition-all duration-300 group-hover:scale-110 group-hover:from-[#3B82F6] group-hover:to-[#2563EB] group-hover:text-white">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-heading text-xs sm:text-sm font-bold text-[#172033] transition-colors duration-300 group-hover:text-[#3B82F6]">{title}</span>
        <span className="mt-1 block text-[10px] sm:text-xs text-[#64748b]">{copy}</span>
      </span>
      <ArrowRight className="size-4 text-[#94a3b8] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
    </a>
  )
}

