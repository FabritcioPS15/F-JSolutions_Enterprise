'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  ChevronDown,
  Laptop,
  SlidersHorizontal,
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

export function LandingPage() {
  const quote = useQuote()
  const [category, setCategory] = useState('Todas')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
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

      <section id="inicio" className="mx-auto grid max-w-[1280px] gap-4 px-4 pb-5 pt-5 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="relative min-h-[350px] overflow-hidden rounded-2xl bg-[#102a56] p-7 text-white sm:p-12">
          <div className="relative z-10 max-w-xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7dd3fc]">Tecnología para todos</p>
            <h1 className="text-4xl font-bold tracking-[-0.06em] sm:text-6xl">Arma tu mundo.<br /><span className="text-[#62b0ff]">Mejora tu juego.</span></h1>
            <p className="mt-5 max-w-md text-base leading-7 text-blue-100">Encuentra laptops, componentes y accesorios con asesoría real, precios competitivos y despacho a todo el Perú.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#productos" className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#ff6b35] px-6 text-sm font-bold text-white transition hover:bg-[#e85a26]">Ver productos <ArrowRight className="size-4" /></a>
              <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10" onClick={() => setShowQuote(true)}>Cotiza tu PC <Calculator data-icon="inline-end" /></Button>
            </div>
          </div>
          <div className="absolute -right-16 -top-20 size-80 rounded-full bg-[#155eef]/40 blur-3xl" />
          <div className="absolute -bottom-24 right-8 size-72 rounded-full border-[32px] border-[#39b8ff]/20" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <Feature icon={<Calculator />} title="Cotizador de PC" copy="Arma tu equipo ideal" onClick={() => { window.location.href = '/cotizacion' }} />
          <Feature icon={<BarChart3 />} title="Comparar productos" copy="Elige con confianza" />
          <Feature icon={<Laptop />} title="Asesoría especializada" copy="Te ayudamos a decidir" />
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
      <footer className="bg-[#102a56] px-4 py-10 text-blue-100 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-heading text-lg font-bold text-white">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#155eef] text-xs">FJ</span> FJ TECH
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6">Tu partner para comprar tecnología y construir el equipo que necesitas.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
            <a href="#productos">Catálogo</a>
            <a href="#cuenta">Mi cuenta</a>
            <a href="#contacto">Contacto</a>
            <a href="#garantia">Garantías</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

function Feature({ icon, title, copy, onClick }: { icon: React.ReactNode; title: string; copy: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-4 rounded-2xl border border-[#e5eaf0] bg-white p-5 text-left transition hover:border-[#9dbaf5] hover:shadow-sm">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f0ff] text-[#155eef]">{icon}</span>
      <span>
        <span className="block font-heading text-sm font-bold">{title}</span>
        <span className="mt-1 block text-xs text-[#64748b]">{copy}</span>
      </span>
    </button>
  )
}

function Info({ href, icon, title, copy }: { href: string; icon: string; title: string; copy: string }) {
  return (
    <a href={href} className="flex items-center gap-4 rounded-xl bg-[#f8fafc] p-4 transition hover:bg-[#eef5ff] hover:shadow-sm">
      <span className="flex size-10 items-center justify-center rounded-full bg-[#dbeafe] font-bold text-[#155eef]">{icon}</span>
      <span>
        <span className="block font-heading text-sm font-bold">{title}</span>
        <span className="mt-1 block text-xs text-[#64748b]">{copy}</span>
      </span>
    </a>
  )
}

function QuoteModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={onClose}>
      <div onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#155eef]">Cotizador inteligente</p>
            <h2 className="mt-2 text-2xl font-bold">Arma tu PC ideal</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar cotizador"><X /></button>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#64748b]">Cuéntanos para qué usarás tu equipo y un asesor preparará una configuración recomendada.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Uso principal
            <select className="mt-2 h-11 w-full rounded-lg border border-[#dbe2ea] bg-white px-3 font-normal">
              <option>Gaming</option>
              <option>Trabajo y oficina</option>
              <option>Diseño y edición</option>
              <option>Estudio</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Nivel de inversión
            <select className="mt-2 h-11 w-full rounded-lg border border-[#dbe2ea] bg-white px-3 font-normal">
              <option>Inicial</option>
              <option>Intermedio</option>
              <option>Alto rendimiento</option>
            </select>
          </label>
        </div>
        <Button onClick={onClose} className="mt-6 h-12 w-full bg-[#ff6b35] font-bold">Solicitar recomendación <ArrowRight data-icon="inline-end" /></Button>
      </div>
    </div>
  )
}
