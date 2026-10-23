'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Heart,
  Laptop,
  ShoppingCart,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/site-header'

type Product = { name: string; category: string; badge?: string; image: string }

const categories = ['PC y Servidores', 'Laptops', 'Componentes', 'Impresoras', 'Monitores', 'Periféricos', 'Almacenamiento', 'Redes', 'Accesorios', 'Telefonía', 'Audio y Video', 'Gaming', 'Software', 'Cables y Energía', 'Hogar inteligente']
const businessLinks = ['Ventas corporativas', 'Facturación electrónica', 'Soporte postventa', 'Garantías y devoluciones', 'Despachos y entregas', 'Medios de pago']
const serviceOptions = ['Desarrollo de sistemas', 'Soporte TI', 'Redes y conectividad', 'Servidores y nube', 'Ciberseguridad', 'Mantenimiento preventivo', 'Instalación y configuración', 'Capacitación tecnológica']
const products: Product[] = [
  { name: 'Laptop Lenovo IdeaPad Slim 3 15.6"', category: 'Laptops', badge: 'Destacado', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80' },
  { name: 'Tarjeta gráfica ASUS RTX 4060 8GB', category: 'Componentes', badge: 'Más vendido', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=700&q=80' },
  { name: 'Monitor LG UltraGear 24" 180Hz', category: 'Monitores', badge: 'Destacado', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&q=80' },
  { name: 'Teclado mecánico Redragon Kumara', category: 'Periféricos', badge: 'Recomendado', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&q=80' },
]

export function LandingPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [cartCount, setCartCount] = useState(0)
  const [showCart, setShowCart] = useState(false)
  const [showQuote, setShowQuote] = useState(false)

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'Todas' || product.category === category
    return matchesQuery && matchesCategory
  }), [query, category])

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f8fafc] text-[#172033]">
      <SiteHeader cartCount={cartCount} onCartClick={() => setShowCart(true)} />

      <section id="inicio" className="mx-auto grid max-w-[1280px] gap-4 px-4 pb-5 pt-5 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="relative min-h-[350px] overflow-hidden rounded-2xl bg-[#102a56] p-7 text-white sm:p-12"><div className="relative z-10 max-w-xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7dd3fc]">Tecnología para todos</p><h1 className="text-4xl font-black tracking-[-0.06em] sm:text-6xl">Arma tu mundo.<br /><span className="text-[#62b0ff]">Mejora tu juego.</span></h1><p className="mt-5 max-w-md text-base leading-7 text-blue-100">Encuentra laptops, componentes y accesorios con asesoría real, precios competitivos y despacho a todo el Perú.</p><div className="mt-7 flex flex-wrap gap-3"><Button className="bg-[#ff6b35] font-bold hover:bg-[#e85a26]" render={<a href="#productos" />}>Ver productos <ArrowRight data-icon="inline-end" /></Button><Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10" onClick={() => setShowQuote(true)}>Cotiza tu PC <Calculator data-icon="inline-end" /></Button></div></div><div className="absolute -right-16 -top-20 size-80 rounded-full bg-[#155eef]/40 blur-3xl" /><div className="absolute -bottom-24 right-8 size-72 rounded-full border-[32px] border-[#39b8ff]/20" /></div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"><Feature icon={<Calculator />} title="Cotizador de PC" copy="Arma tu equipo ideal" onClick={() => { window.location.href = '/cotizador' }} /><Feature icon={<BarChart3 />} title="Comparar productos" copy="Elige con confianza" /><Feature icon={<Laptop />} title="Asesoría especializada" copy="Te ayudamos a decidir" /></div>
      </section>

      <section id="productos" className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#155eef]">Selección FJ Tech</p><h2 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Productos destacados</h2></div><a href="#productos" className="flex items-center gap-2 text-sm font-bold text-[#155eef]">Ver todo <ArrowRight data-icon="inline-end" /></a></div><div className="mt-7 flex gap-2 overflow-x-auto pb-2"><FilterButton active={category === 'Todas'} onClick={() => setCategory('Todas')}>Todas</FilterButton>{categories.map((item) => <FilterButton key={item} active={category === item} onClick={() => setCategory(item)}>{item}</FilterButton>)}</div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">{filteredProducts.map((product) => <ProductCard key={product.name} product={product} onAdd={() => setCartCount((count) => count + 1)} />)}</div>{filteredProducts.length === 0 && <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-white p-10 text-center text-[#64748b]">No encontramos productos para tu búsqueda.</div>}</section>

      <section id="servicios" className="border-y border-[#e5eaf0] bg-white px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1280px]"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#155eef]">Servicios para empresas</p><h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">Soporte TI en cada etapa</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748b]">Además de vender tecnología, ayudamos a implementar, mantener y proteger tu operación.</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{serviceOptions.map((service, index) => <Info key={service} href={['/sistemas', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti', '/soporte-ti'][index]} icon={['⌘', '◫', '◈', '✓', '◆', '◌', '＋', '◇'][index]} title={service} copy={['Atención remota y en sitio', 'Configuración y monitoreo', 'Protección para tu empresa', 'Asesoría para compras corporativas', 'Aplicaciones a la medida', 'Infraestructura escalable', 'Implementación profesional', 'Formación para tu equipo'][index]} />)}</div><div className="mt-8 flex flex-wrap gap-2 rounded-xl border border-[#dbeafe] bg-[#f8fbff] p-4">{businessLinks.map((link) => <a key={link} href={link.includes('Soporte') ? '/soporte-ti' : '/cotizador'} className="rounded-full border border-[#cbdcfb] bg-white px-3 py-2 text-xs font-bold text-[#155eef] hover:bg-[#e8f0ff]">{link}</a>)}</div></div></section>

      {showCart && <CartPanel count={cartCount} onClose={() => setShowCart(false)} />}
      {showQuote && <QuoteModal onClose={() => setShowQuote(false)} />}
      <footer className="bg-[#102a56] px-4 py-10 text-blue-100 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-[1280px] flex-col gap-8 sm:flex-row sm:justify-between"><div><div className="flex items-center gap-2 text-lg font-extrabold text-white"><span className="flex size-9 items-center justify-center rounded-lg bg-[#155eef] text-xs">FJ</span> FJ TECH</div><p className="mt-3 max-w-xs text-sm leading-6">Tu partner para comprar tecnología y construir el equipo que necesitas.</p></div><div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm"><a href="#productos">Catálogo</a><a href="#cuenta">Mi cuenta</a><a href="#contacto">Contacto</a><a href="#garantia">Garantías</a></div></div></footer>
    </main>
  )
}

function Feature({ icon, title, copy, onClick }: { icon: React.ReactNode; title: string; copy: string; onClick?: () => void }) { return <button onClick={onClick} className="flex items-center gap-4 rounded-2xl border border-[#e5eaf0] bg-white p-5 text-left transition hover:border-[#9dbaf5] hover:shadow-sm"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f0ff] text-[#155eef]">{icon}</span><span><span className="block text-sm font-extrabold">{title}</span><span className="mt-1 block text-xs text-[#64748b]">{copy}</span></span></button> }
function FilterButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? 'border-[#155eef] bg-[#155eef] text-white' : 'border-[#dbe2ea] bg-white text-[#475569] hover:border-[#155eef]'}`}>{children}</button> }
function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) { return <article className="group relative overflow-hidden rounded-xl border border-[#e5eaf0] bg-white p-3 transition hover:-translate-y-1 hover:shadow-lg sm:p-4"><div className="relative aspect-square overflow-hidden rounded-lg bg-[#f1f5f9]"><img src={product.image} alt={product.name} className="size-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-105" />{product.badge && <span className="absolute left-2 top-2 rounded-md bg-[#ff6b35] px-2 py-1 text-[10px] font-bold text-white">{product.badge}</span>}<button aria-label={`Agregar ${product.name} a favoritos`} className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-[#64748b] hover:text-[#ef4444]"><Heart /></button></div><p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#155eef]">{product.category}</p><h3 className="mt-1 min-h-10 text-sm font-bold leading-5 text-[#172033]">{product.name}</h3><div className="mt-3 flex min-h-6 items-center"><span className="text-xs font-semibold text-[#64748b]">Consulta disponibilidad y cotización</span></div><Button onClick={onAdd} className="mt-3 h-10 w-full bg-[#155eef] text-xs font-bold hover:bg-[#104bc5]">Solicitar cotización</Button></article> }
function Info({ href, icon, title, copy }: { href: string; icon: string; title: string; copy: string }) { return <a href={href} className="flex items-center gap-4 rounded-xl bg-[#f8fafc] p-4 transition hover:bg-[#eef5ff] hover:shadow-sm"><span className="flex size-10 items-center justify-center rounded-full bg-[#dbeafe] font-bold text-[#155eef]">{icon}</span><span><span className="block text-sm font-bold">{title}</span><span className="mt-1 block text-xs text-[#64748b]">{copy}</span></span></a> }
function CartPanel({ count, onClose }: { count: number; onClose: () => void }) { return <div className="fixed inset-0 z-50 bg-slate-950/30" onClick={onClose}><aside onClick={(event) => event.stopPropagation()} className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Tu carrito</h2><button onClick={onClose} aria-label="Cerrar carrito"><X /></button></div><div className="flex flex-1 flex-col items-center justify-center text-center"><ShoppingCart className="text-[#155eef]" /><p className="mt-4 font-bold">{count ? `${count} producto(s) agregado(s)` : 'Tu carrito está vacío'}</p><p className="mt-2 text-sm text-[#64748b]">Agrega productos para continuar con tu compra.</p></div><Button className="h-12 w-full bg-[#155eef]" disabled={!count}>Ir a pagar</Button></aside></div> }
function QuoteModal({ onClose }: { onClose: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={onClose}><div onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-sm font-bold uppercase tracking-wider text-[#155eef]">Cotizador inteligente</p><h2 className="mt-2 text-2xl font-black">Arma tu PC ideal</h2></div><button onClick={onClose} aria-label="Cerrar cotizador"><X /></button></div><p className="mt-3 text-sm leading-6 text-[#64748b]">Cuéntanos para qué usarás tu equipo y un asesor preparará una configuración recomendada.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Uso principal<select className="mt-2 h-11 w-full rounded-lg border border-[#dbe2ea] bg-white px-3 font-normal"><option>Gaming</option><option>Trabajo y oficina</option><option>Diseño y edici��n</option><option>Estudio</option></select></label><label className="text-sm font-semibold">Nivel de inversión<select className="mt-2 h-11 w-full rounded-lg border border-[#dbe2ea] bg-white px-3 font-normal"><option>Inicial</option><option>Intermedio</option><option>Alto rendimiento</option></select></label></div><Button onClick={onClose} className="mt-6 h-12 w-full bg-[#ff6b35] font-bold">Solicitar recomendación <ArrowRight data-icon="inline-end" /></Button></div></div> }
