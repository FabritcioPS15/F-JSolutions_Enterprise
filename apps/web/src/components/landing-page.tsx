'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  ChevronDown,
  Globe,
  Laptop,
  SlidersHorizontal,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { CorporateHero } from '@/components/heroes'
import { ProductCard } from '@/components/cards/product-card'
import { categories, products } from '@/lib/catalog'
import { useQuote } from '@/lib/use-quote'

const businessLinks = ['Ventas corporativas', 'Facturación electrónica', 'Soporte postventa', 'Garantías y devoluciones', 'Despachos y entregas', 'Medios de pago']
const serviceOptions = ['Desarrollo de sistemas', 'Soporte TI', 'Redes y conectividad', 'Servidores y nube', 'Ciberseguridad', 'Mantenimiento preventivo', 'Instalación y configuración', 'Capacitación tecnológica']
const featuredProductIds = ['lenovo-ideapad-slim-3', 'asus-rtx-4060-8gb', 'monitor-lg-ultragear-24', 'redragon-kumara']

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

      <CorporateHero />

      {/* Accesos rápidos */}
      <section className="mx-auto max-w-[1280px] px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={<Calculator />} title="Cotizador de PC" copy="Arma tu equipo ideal" onClick={() => { window.location.href = '/cotizacion' }} />
          <Feature icon={<BarChart3 />} title="Comparar productos" copy="Elige con confianza" />
          <Feature icon={<Laptop />} title="Asesoría especializada" copy="Te ayudamos a decidir" />
          <Feature icon={<Globe />} title="Servicios TI" copy="Soporte para empresas" onClick={() => { window.location.href = '/servicios' }} />
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="mx-auto max-w-[1280px] px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#e5eaf0] bg-white p-4 sm:p-5 shadow-sm sm:grid-cols-4">
          {quickStats.map((stat) => (
            <div key={stat.label} className="text-center transition-transform duration-300 hover:scale-105">
              <p className="text-lg font-bold text-[#155eef] sm:text-xl lg:text-2xl">{stat.value}</p>
              <p className="mt-1 text-[10px] font-semibold text-[#64748b] sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-[1280px] scroll-mt-20 sm:scroll-mt-24 px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToQuote={quote.addItem} />
          ))}
        </div>
      </section>

      <section id="servicios" className="border-y border-[#e5eaf0] bg-white scroll-mt-20 sm:scroll-mt-24 px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#155eef] sm:text-sm">Servicios para empresas</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">Soporte TI en cada etapa</h2>
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
    </main>
  )
}

function Feature({ icon, title, copy, onClick }: { icon: React.ReactNode; title: string; copy: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 sm:gap-4 rounded-2xl border border-[#e5eaf0] bg-white p-4 sm:p-5 text-left transition-all duration-300 hover:border-[#3B82F6] hover:shadow-lg hover:shadow-[#3B82F6]/15 hover:-translate-y-1"
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
      className="group flex items-center gap-3 sm:gap-4 rounded-xl bg-[#f8fafc] p-3 sm:p-4 transition-all duration-300 hover:bg-gradient-to-br hover:from-[#eef5ff] hover:to-[#dbeafe] hover:shadow-md hover:shadow-[#3B82F6]/10 hover:-translate-y-0.5"
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

