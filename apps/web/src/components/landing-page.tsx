'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Headphones,
  Laptop,
  Package,
  Shield,
  SlidersHorizontal,
  Star,
  Truck,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { ProductCard } from '@/components/cards/product-card'
import { categories, products } from '@/lib/catalog'
import { useQuote } from '@/lib/use-quote'

const businessLinks = ['Ventas corporativas', 'Facturación electrónica', 'Soporte postventa', 'Garantías y devoluciones', 'Despachos y entregas', 'Medios de pago']
const serviceOptions = ['Desarrollo de sistemas', 'Soporte TI', 'Redes y conectividad', 'Servidores y nube', 'Ciberseguridad', 'Mantenimiento preventivo', 'Instalación y configuración', 'Capacitación tecnológica']
const featuredProductIds = ['lenovo-ideapad-slim-3', 'asus-rtx-4060-8gb', 'monitor-lg-ultragear-24', 'redragon-kumara']

const trustBadges = [
  { icon: <Truck className="size-5" />, title: 'Envíos a todo el Perú', subtitle: '3-5 días hábiles' },
  { icon: <Shield className="size-5" />, title: 'Garantía extendida', subtitle: '1 año mínimo' },
  { icon: <Headphones className="size-5" />, title: 'Soporte técnico', subtitle: '24/7 disponible' },
  { icon: <Package className="size-5" />, title: 'Seguridad de pago', subtitle: '100% protegido' },
]

const quickStats = [
  { value: '10K+', label: 'Clientes satisfechos' },
  { value: '500+', label: 'Productos' },
  { value: '15+', label: 'Años de experiencia' },
  { value: '24/7', label: 'Soporte TI' },
]

const heroes = [
  {
    id: 1,
    badge: { icon: <Star className="size-4 fill-[#FFD700] text-[#FFD700]" />, text: 'Tecnología para todos' },
    title: 'Arma tu mundo.',
    highlight: 'Mejora tu juego.',
    description: 'Encuentra laptops, componentes y accesorios con asesoría real, precios competitivos y despacho a todo el Perú.',
    primaryButton: { text: 'Ver productos', href: '#productos' },
    secondaryButton: { text: 'Cotiza tu PC', action: 'quote' },
    gradient: 'from-[#102a56] via-[#1a3a7a] to-[#0d1f3d]',
    trustBadges: true,
  },
  {
    id: 2,
    badge: { icon: <Shield className="size-4 text-[#10B981]" />, text: 'Soporte TI profesional' },
    title: 'Infraestructura',
    highlight: 'sin límites.',
    description: 'Implementamos servidores, redes y sistemas para empresas que necesitan tecnología confiable y escalable.',
    primaryButton: { text: 'Ver servicios', href: '/servicios' },
    secondaryButton: { text: 'Contactar', href: '/contacto' },
    gradient: 'from-[#0f766e] via-[#115e59] to-[#0f5132]',
    trustBadges: false,
  },
  {
    id: 3,
    badge: { icon: <Calculator className="size-4 text-[#F59E0B]" />, text: 'Desarrollo a medida' },
    title: 'Sistemas que',
    highlight: 'impulsan tu negocio.',
    description: 'Creamos software personalizado, ERPs y aplicaciones web adaptadas a las necesidades específicas de tu empresa.',
    primaryButton: { text: 'Ver sistemas', href: '/sistemas' },
    secondaryButton: { text: 'Cotizar proyecto', href: '/cotizacion' },
    gradient: 'from-[#1e3a8a] via-[#1e40af] to-[#172554]',
    trustBadges: false,
  },
]

export function LandingPage() {
  const quote = useQuote()
  const [category, setCategory] = useState('Todas')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [currentHero, setCurrentHero] = useState(0)
  const categoryRef = useRef<HTMLDivElement>(null)

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
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const featuredProducts = useMemo(
    () => products.filter((p) => featuredProductIds.includes(p.id)),
    [],
  )

  const filteredProducts = useMemo(
    () => featuredProducts.filter((product) => category === 'Todas' || product.category === category),
    [category],
  )

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f8fafc] text-[#172033]">
      <EnhancedHeader quoteCount={quote.count} />

      <section id="inicio" className="mx-auto max-w-[1280px] px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: '380px' }}>
          {/* Carousel */}
          <div className="relative h-[380px]">
            {heroes.map((hero, index) => (
              <div
                key={hero.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentHero ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
              >
                <div className={`relative h-full overflow-hidden rounded-2xl bg-gradient-to-br ${hero.gradient} p-7 text-white sm:p-12 shadow-2xl`}>
                  {/* Decorative elements */}
                  <div className="absolute -right-16 -top-20 size-96 rounded-full bg-gradient-to-br from-white/20 to-white/10 blur-3xl animate-pulse" />
                  <div className="absolute -bottom-32 right-12 size-80 rounded-full border-[40px] border-white/10 animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="absolute top-1/2 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />

                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                      {hero.badge.icon}
                      <span className="text-xs font-semibold text-white/90">{hero.badge.text}</span>
                    </div>
                    <h1 className="mt-6 text-4xl font-bold tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                      {hero.title}<br />
                      <span className="bg-gradient-to-r from-white/90 via-white/80 to-white/70 bg-clip-text text-transparent">
                        {hero.highlight}
                      </span>
                    </h1>
                    <p className="mt-5 max-w-md text-base leading-7 text-white/80">
                      {hero.description}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={hero.primaryButton.href}
                        className="group inline-flex h-12 items-center gap-2 rounded-lg bg-gradient-to-r from-[#ff6b35] to-[#e85a26] px-6 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#ff6b35]/40 hover:-translate-y-0.5"
                      >
                        {hero.primaryButton.text}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                      {hero.secondaryButton.action === 'quote' ? (
                        <Button
                          variant="outline"
                          className="border-white/30 bg-transparent text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                          onClick={() => setShowQuote(true)}
                        >
                          {hero.secondaryButton.text}
                          <Calculator data-icon="inline-end" />
                        </Button>
                      ) : (
                        <a
                          href={hero.secondaryButton.href}
                          className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/30 bg-transparent px-6 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                        >
                          {hero.secondaryButton.text}
                        </a>
                      )}
                    </div>

                    {/* Trust badges - only for first hero */}
                    {hero.trustBadges && (
                      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {trustBadges.map((badge) => (
                          <div key={badge.title} className="flex items-center gap-2 rounded-lg bg-white/5 p-2.5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                            <span className="flex shrink-0 items-center justify-center rounded-md bg-white/20 text-white/90">
                              {badge.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold text-white/90">{badge.title}</p>
                              <p className="text-[9px] text-white/70">{badge.subtitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setCurrentHero((prev) => (prev - 1 + heroes.length) % heroes.length)}
              className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/30 hover:scale-110"
              aria-label="Hero anterior"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center gap-2">
              {heroes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHero(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentHero ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Ir a hero ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentHero((prev) => (prev + 1) % heroes.length)}
              className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/30 hover:scale-110"
              aria-label="Siguiente hero"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Feature icon={<Calculator />} title="Cotizador de PC" copy="Arma tu equipo ideal" onClick={() => { window.location.href = '/cotizacion' }} />
          <Feature icon={<BarChart3 />} title="Comparar productos" copy="Elige con confianza" />
          <Feature icon={<Laptop />} title="Asesoría especializada" copy="Te ayudamos a decidir" />
          <Feature icon={<Globe />} title="Servicios TI" copy="Soporte para empresas" onClick={() => { window.location.href = '/servicios' }} />
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="mx-auto max-w-[1280px] px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#e5eaf0] bg-white p-5 shadow-sm sm:grid-cols-4">
          {quickStats.map((stat) => (
            <div key={stat.label} className="text-center transition-transform duration-300 hover:scale-105">
              <p className="text-xl font-bold text-[#155eef] sm:text-2xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-[#64748b]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#155eef]">Selección FJ Tech</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Productos destacados</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div ref={categoryRef} className="relative">
              <button type="button" onClick={() => setCategoryOpen((value) => !value)} aria-expanded={categoryOpen} aria-haspopup="listbox" className={`flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition ${category !== 'Todas' ? 'border-[#155eef]/30 bg-[#eef5ff] text-[#155eef]' : 'border-[#dbe2ea] bg-white text-[#172033] hover:border-[#155eef]/40 hover:text-[#155eef]'}`}>
                <SlidersHorizontal className="size-4" />
                {category === 'Todas' ? 'Categorías' : category}
                <ChevronDown className={`size-4 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-64 rounded-xl border border-[#e5eaf0] bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)]">
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
            <a href="/productos" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dbe2ea] bg-white px-4 text-sm font-semibold text-[#172033] transition hover:border-[#155eef]/40 hover:text-[#155eef]">
              Ver catálogo completo <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToQuote={quote.addItem} />
          ))}
        </div>
      </section>

      <section id="servicios" className="border-y border-[#e5eaf0] bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#155eef]">Servicios para empresas</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em]">Soporte TI en cada etapa</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748b]">Además de vender tecnología, ayudamos a implementar, mantener y proteger tu operación.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceOptions.map((service, index) => (
              <Info key={service} href={['/sistemas', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti'][index]} icon={['⌘', '◫', '◈', '✓', '◆', '◌', '＋', '◇'][index]} title={service} copy={['Atención remota y en sitio', 'Configuración y monitoreo', 'Protección para tu empresa', 'Asesoría para compras corporativas', 'Aplicaciones a la medida', 'Infraestructura escalable', 'Implementación profesional', 'Formación para tu equipo'][index]} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2 rounded-xl border border-[#dbeafe] bg-[#f8fbff] p-4">
            {businessLinks.map((link) => (
              <a key={link} href={link.includes('Soporte') ? '/soporte-ti' : '/cotizacion'} className="rounded-full border border-[#cbdcfb] bg-white px-3 py-2 text-xs font-bold text-[#155eef] hover:bg-[#e8f0ff]">{link}</a>
            ))}
          </div>
        </div>
      </section>

      {showQuote && <QuoteModal onClose={() => setShowQuote(false)} />}
    </main>
  )
}

function Feature({ icon, title, copy, onClick }: { icon: React.ReactNode; title: string; copy: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-[#e5eaf0] bg-white p-5 text-left transition-all duration-300 hover:border-[#3B82F6] hover:shadow-lg hover:shadow-[#3B82F6]/15 hover:-translate-y-1"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e8f0ff] to-[#dbeafe] text-[#155eef] transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#3B82F6] group-hover:to-[#2563EB] group-hover:text-white">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-heading text-sm font-bold text-[#172033] transition-colors duration-300 group-hover:text-[#3B82F6]">{title}</span>
        <span className="mt-1 block text-xs text-[#64748b]">{copy}</span>
      </span>
      <ArrowRight className="size-4 text-[#94a3b8] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
    </button>
  )
}

function Info({ href, icon, title, copy }: { href: string; icon: string; title: string; copy: string }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-xl bg-[#f8fafc] p-4 transition-all duration-300 hover:bg-gradient-to-br hover:from-[#eef5ff] hover:to-[#dbeafe] hover:shadow-md hover:shadow-[#3B82F6]/10 hover:-translate-y-0.5"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] font-bold text-[#155eef] transition-all duration-300 group-hover:scale-110 group-hover:from-[#3B82F6] group-hover:to-[#2563EB] group-hover:text-white">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-heading text-sm font-bold text-[#172033] transition-colors duration-300 group-hover:text-[#3B82F6]">{title}</span>
        <span className="mt-1 block text-xs text-[#64748b]">{copy}</span>
      </span>
      <ArrowRight className="size-4 text-[#94a3b8] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
    </a>
  )
}

function QuoteModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 sm:p-8 animate-in fade-in zoom-in-95"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#dbeafe] px-3 py-1">
              <Calculator className="size-4 text-[#155eef]" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#155eef]">Cotizador inteligente</p>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#172033]">Arma tu PC ideal</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar cotizador"
            className="rounded-lg p-2 text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#172033]"
          >
            <X />
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#64748b]">
          Cuéntanos para qué usarás tu equipo y un asesor preparará una configuración recomendada.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[#172033]">
            Uso principal
            <select className="mt-2 h-11 w-full rounded-lg border border-[#dbe2ea] bg-white px-3 font-normal text-[#172033] transition-colors focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20">
              <option>Gaming</option>
              <option>Trabajo y oficina</option>
              <option>Diseño y edición</option>
              <option>Estudio</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[#172033]">
            Nivel de inversión
            <select className="mt-2 h-11 w-full rounded-lg border border-[#dbe2ea] bg-white px-3 font-normal text-[#172033] transition-colors focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20">
              <option>Inicial</option>
              <option>Intermedio</option>
              <option>Alto rendimiento</option>
            </select>
          </label>
        </div>
        <Button
          onClick={onClose}
          className="mt-6 h-12 w-full bg-gradient-to-r from-[#ff6b35] to-[#e85a26] font-bold text-white shadow-lg shadow-[#ff6b35]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff6b35]/40 hover:-translate-y-0.5"
        >
          Solicitar recomendación
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
