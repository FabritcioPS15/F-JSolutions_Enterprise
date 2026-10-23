'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ArrowRight,
  Cable,
  ChevronDown,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  Gamepad2,
  HardDrive,
  Headset,
  HeadphonesIcon,
  Home,
  LayoutGrid,
  Laptop,
  Mail,
  MapPin,
  Menu,
  Monitor,
  MousePointer2,
  Network,
  Package,
  Phone,
  Printer,
  Search,
  Server,
  Shield,
  ShoppingCart,
  Smartphone,
  UserRound,
  Volume2,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type SiteHeaderProps = {
  quoteCount?: number
  onQuoteClick?: () => void
}

// â”€â”€â”€ Static data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Servicios', href: '/servicios', hasMenu: true },
  { label: 'Soporte TI', href: '/soporte-ti' },
  { label: 'Sistemas', href: '/sistemas', hasMenu: true },
  { label: 'Cotizador', href: '/cotizacion' },
  { label: 'Contacto', href: '/#contacto' },
]

const categoryItems: { label: string; icon: React.ElementType; desc: string }[] = [
  { label: 'PC y Servidores', icon: Server, desc: 'Equipos de escritorio y servidores' },
  { label: 'Laptops', icon: Laptop, desc: 'Portátiles para trabajo y estudio' },
  { label: 'Componentes', icon: Cpu, desc: 'CPU, RAM, GPU y placas madre' },
  { label: 'Monitores', icon: Monitor, desc: 'Pantallas 4K, IPS y gaming' },
  { label: 'Periféricos', icon: MousePointer2, desc: 'Teclados, ratones y webcams' },
  { label: 'Almacenamiento', icon: HardDrive, desc: 'SSD, HDD y unidades NVMe' },
  { label: 'Redes', icon: Network, desc: 'Routers, switches y access points' },
  { label: 'Impresoras', icon: Printer, desc: 'Láser, inyección y multifuncionales' },
  { label: 'Audio y Video', icon: Volume2, desc: 'Audífonos, parlantes y cámaras' },
  { label: 'Gaming', icon: Gamepad2, desc: 'Periféricos y equipos gamer' },
  { label: 'Accesorios', icon: Package, desc: 'Bolsos, stands y protectores' },
  { label: 'Telefonía', icon: Smartphone, desc: 'Smartphones y tablets' },
  { label: 'Software', icon: Code2, desc: 'Licencias y soluciones digitales' },
  { label: 'Cables y Energía', icon: Cable, desc: 'UPS, regletas y cableado' },
  { label: 'Hogar inteligente', icon: Home, desc: 'Domótica y dispositivos IoT' },
]

const serviciosMenu = [
  { label: 'Soporte TI', href: '/soporte-ti', icon: Headset, desc: 'Mesa de ayuda y soporte técnico remoto' },
  { label: 'Infraestructura', href: '/servicios', icon: Server, desc: 'Redes, servidores y centros de datos' },
  { label: 'Ciberseguridad', href: '/servicios', icon: Shield, desc: 'Protección, auditorías y cumplimiento' },
  { label: 'Cloud & Backups', href: '/servicios', icon: Cloud, desc: 'Migración a la nube y respaldo de datos' },
  { label: 'Asesoría gratuita', href: '/servicios', icon: HeadphonesIcon, desc: 'Consulta sin costo con nuestro equipo', highlight: true },
]

const sistemasMenu = [
  { label: 'ERP Empresarial', href: '/sistemas', icon: Database, desc: 'Gestión integral de recursos empresariales' },
  { label: 'Desarrollo a medida', href: '/sistemas', icon: Code2, desc: 'Software personalizado para tu negocio' },
  { label: 'Integraciones API', href: '/sistemas', icon: Network, desc: 'Conexión de sistemas y automatización' },
  { label: 'Mantenimiento', href: '/sistemas', icon: Wrench, desc: 'Soporte y evolución de sistemas en producción' },
]

// â”€â”€â”€ Hook: click outside â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// â”€â”€â”€ Category panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CategoryPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-label="Categorías de productos"
      className="absolute left-0 top-[calc(100%+8px)] z-50 w-[700px] rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_8px_40px_rgba(15,23,42,0.10)]"
    >
      <div className="flex items-center justify-between border-b border-[#F1F5F9] px-5 py-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
          Categorías de productos
        </p>
        <Link
          href="/productos"
          onClick={onClose}
          className="flex items-center gap-1 text-[13px] font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
        >
          Ver todo <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-px p-3">
        {categoryItems.map(({ label, icon: Icon, desc }) => (
          <Link
            key={label}
            href={`/productos?categoria=${encodeURIComponent(label)}`}
            onClick={onClose}
            className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F8FAFC]"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition-colors group-hover:border-[#2563EB]/20 group-hover:bg-[#EFF6FF] group-hover:text-[#2563EB]">
              <Icon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold leading-snug text-[#0F172A] group-hover:text-[#2563EB]">
                {label}
              </span>
              <span className="block truncate text-[11.5px] leading-snug text-[#64748B]">
                {desc}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className="border-t border-[#F1F5F9] px-5 py-3">
        <Link
          href="/productos?oferta=1"
          onClick={onClose}
          className="flex items-center gap-2 text-[13px] font-semibold text-[#0891B2] transition hover:text-[#0E7490]"
        >
          <Zap className="size-4 fill-current" />
          Ver ofertas del día
        </Link>
      </div>
    </div>
  )
}

// â”€â”€â”€ Nav dropdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type MenuItem = { label: string; href: string; icon: React.ElementType; desc: string; highlight?: boolean }

function NavDropdown({ items, onClose }: { items: MenuItem[]; onClose: () => void }) {
  return (
    <div
      role="dialog"
      className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-72 -translate-x-1/2 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_8px_40px_rgba(15,23,42,0.10)]"
    >
      <div className="p-2">
        {items.map(({ label, href, icon: Icon, desc, highlight }) => (
          <Link
            key={label}
            href={href}
            onClick={onClose}
            className={`group flex items-start gap-3 rounded-xl px-3.5 py-3 transition-colors ${
              highlight ? 'bg-[#EFF6FF] hover:bg-[#DBEAFE]' : 'hover:bg-[#F8FAFC]'
            }`}
          >
            <span
              className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                highlight
                  ? 'border-[#2563EB]/20 bg-white text-[#2563EB]'
                  : 'border-[#E2E8F0] bg-white text-[#64748B] group-hover:border-[#2563EB]/20 group-hover:bg-[#EFF6FF] group-hover:text-[#2563EB]'
              }`}
            >
              <Icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`block text-[13px] font-semibold leading-snug ${
                  highlight ? 'text-[#2563EB]' : 'text-[#0F172A] group-hover:text-[#2563EB]'
                }`}
              >
                {label}
              </span>
              <span className="block text-[11.5px] leading-snug text-[#64748B]">{desc}</span>
            </span>
            <ArrowRight
              className={`ml-auto mt-1.5 size-3.5 shrink-0 text-[#94A3B8] transition-opacity ${
                highlight ? 'opacity-100 text-[#2563EB]' : 'opacity-0 group-hover:opacity-100'
              }`}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

// â”€â”€â”€ Mobile accordion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MobileAccordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-[#F1F5F9]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#0F172A]"
      >
        {label}
        <ChevronDown
          className={`size-4 text-[#64748B] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="border-t border-[#F1F5F9] bg-[#F8FAFC] px-3 py-2">{children}</div>}
    </div>
  )
}

// â”€â”€â”€ SiteHeader â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function SiteHeader({ quoteCount = 0, onQuoteClick }: SiteHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [topBarClosed, setTopBarClosed] = useState(false)

  const categoriesRef = useRef<HTMLDivElement>(null)
  const serviciosRef = useRef<HTMLDivElement>(null)
  const sistemasRef = useRef<HTMLDivElement>(null)

  const closeAll = () => setOpenDropdown(null)

  useOnClickOutside(categoriesRef, () => { if (openDropdown === 'categories') closeAll() })
  useOnClickOutside(serviciosRef, () => { if (openDropdown === 'servicios') closeAll() })
  useOnClickOutside(sistemasRef, () => { if (openDropdown === 'sistemas') closeAll() })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeAll(); setMenuOpen(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Cargar preferencia del top bar
  useEffect(() => {
    const saved = localStorage.getItem('topBarClosed')
    if (saved === 'true') {
      setTopBarClosed(true)
    }
  }, [])

  // Guardar preferencia cuando cambia
  useEffect(() => {
    localStorage.setItem('topBarClosed', topBarClosed.toString())
  }, [topBarClosed])

  useEffect(() => {
    setMenuOpen(false)
    closeAll()
  }, [pathname])

  const goToCart = () => {
    if (onQuoteClick) { onQuoteClick(); return }
    router.push('/cotizacion')
  }

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const term = query.trim()
    setMenuOpen(false)
    router.push(term ? `/productos?q=${encodeURIComponent(term)}` : '/productos')
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key))

  return (
    <header className="sticky top-0 z-50">

      {/* Top bar */}
      <div
        className={`overflow-hidden bg-[#0B1B33] text-[#CBD5E1] transition-[max-height,opacity] duration-200 ease-out ${
          topBarClosed ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-[11.5px] font-medium sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href="tel:+51999888777" className="flex items-center gap-1.5 transition hover:text-white">
              <Phone className="size-3.5 text-[#60A5FA]" /> +51 999 888 777
            </a>
            <a href="mailto:ventas@fjsolutions.pe" className="flex items-center gap-1.5 transition hover:text-white">
              <Mail className="size-3.5 text-[#60A5FA]" /> ventas@fjsolutions.pe
            </a>
            <span className="hidden items-center gap-1.5 sm:flex">
              <MapPin className="size-3.5 text-[#60A5FA]" /> Lima, Perú
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 md:flex">
              <Clock className="size-3.5 text-[#60A5FA]" /> Lun–Sáb · 9:00 a 18:00
            </span>
            <Link href="/cotizacion" className="transition hover:text-white">Ventas corporativas</Link>
            <Link href="/soporte-ti" className="transition hover:text-white">Mesa de ayuda</Link>
            <button
              type="button"
              onClick={() => setTopBarClosed(true)}
              className="flex items-center gap-1 transition hover:text-white"
              aria-label="Cerrar barra superior"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`border-b border-[#E2E8F0] bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${
          topBarClosed ? 'shadow-[0_12px_32px_-16px_rgba(15,23,42,0.35)]' : 'shadow-none'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1280px] items-center gap-3 px-4 transition-[padding] duration-300 sm:px-6 lg:gap-6 lg:px-8 ${
            topBarClosed ? 'py-2.5' : 'py-4 lg:py-5'
          }`}
        >

          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="FJ Tech · Inicio"
            onClick={() => { setMenuOpen(false); closeAll() }}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] font-heading text-sm font-bold tracking-tight text-white shadow-md shadow-[#2563EB]/20">
              FJ
            </span>
            <span className="hidden font-heading text-xl font-bold tracking-[-0.04em] text-[#0F172A] sm:block lg:text-2xl">
              FJ <span className="text-[#2563EB]">TECH</span>
            </span>
          </Link>

          {/* Categories dropdown trigger */}
          <div ref={categoriesRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => toggle('categories')}
              aria-expanded={openDropdown === 'categories'}
              aria-haspopup="dialog"
              className={`flex h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-[14px] font-semibold transition-all ${
                openDropdown === 'categories'
                  ? 'border-[#2563EB]/30 bg-[#EFF6FF] text-[#2563EB]'
                  : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#2563EB]/30 hover:bg-[#F8FAFC] hover:text-[#2563EB]'
              }`}
            >
              <LayoutGrid className="size-4" />
              Categorías
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${openDropdown === 'categories' ? 'rotate-180' : ''}`}
              />
            </button>
            {openDropdown === 'categories' && <CategoryPanel onClose={closeAll} />}
          </div>

          {/* Search */}
          <form onSubmit={submitSearch} className="relative flex min-w-0 flex-1">
            <span className="sr-only">Buscar productos</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca laptops, monitores, componentes..."
              className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-24 text-[14px] text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/15"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 hidden h-7 items-center rounded-lg bg-[#2563EB] px-3.5 text-xs font-bold text-white transition hover:bg-[#1D4ED8] sm:flex"
            >
              Buscar
            </button>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {topBarClosed && (
              <button
                type="button"
                onClick={() => setTopBarClosed(false)}
                className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#2563EB] lg:flex"
                aria-label="Mostrar barra superior"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Barra superior
              </button>
            )}
            <Link
              href="/cotizador"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#2563EB] xl:flex"
            >
              <UserRound className="size-4" />
              Mi cuenta
            </Link>
            <button
              type="button"
              onClick={goToCart}
              className="relative flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
              aria-label={`Abrir cotización, ${quoteCount} productos`}
            >
              <ShoppingCart className="size-5" />
              <span className="hidden md:inline">Cotización</span>
              {quoteCount > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#2563EB] text-[10px] font-bold text-white">
                  {quoteCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-xl border border-[#E2E8F0] text-[#475569] transition hover:border-[#2563EB]/30 hover:bg-[#F8FAFC] hover:text-[#2563EB] lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden border-t border-[#F1F5F9] lg:block" aria-label="Navegación principal">
          <div className="mx-auto flex max-w-[1280px] items-center gap-1 px-8">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              const dropKey =
                link.label === 'Servicios' ? 'servicios' :
                link.label === 'Sistemas' ? 'sistemas' : null

              if (!dropKey) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`border-b-2 px-3 py-4 text-[14px] font-semibold transition-colors ${
                      active
                        ? 'border-[#2563EB] text-[#2563EB]'
                        : 'border-transparent text-[#475569] hover:text-[#2563EB]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              }

              const isOpen = openDropdown === dropKey
              const ref = dropKey === 'servicios' ? serviciosRef : sistemasRef
              const items = dropKey === 'servicios' ? serviciosMenu : sistemasMenu

              return (
                <div key={link.href} ref={ref} className="relative">
                  <button
                    type="button"
                    onClick={() => toggle(dropKey)}
                    aria-expanded={isOpen}
                    aria-haspopup="dialog"
                    className={`flex items-center gap-1 border-b-2 px-3 py-4 text-[14px] font-semibold transition-colors ${
                      active || isOpen
                        ? 'border-[#2563EB] text-[#2563EB]'
                        : 'border-transparent text-[#475569] hover:text-[#2563EB]'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && <NavDropdown items={items} onClose={closeAll} />}
                </div>
              )
            })}

            <Link
              href="/productos?oferta=1"
              className="ml-1 flex items-center gap-1.5 py-4 text-[14px] font-bold text-[#0891B2] transition hover:text-[#0E7490]"
            >
              <Zap className="size-4 fill-current" /> Ofertas del día
            </Link>

            <Link
              href="/servicios"
              className="ml-auto flex items-center gap-2 border-l border-[#E2E8F0] py-4 pl-6 text-[14px] font-bold text-[#0F172A] transition hover:text-[#2563EB]"
            >
              <Headset className="size-4 text-[#2563EB]" />
              Asesoría gratuita
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="max-h-[calc(100vh-140px)] overflow-y-auto border-b border-[#E2E8F0] bg-white px-4 pb-6 pt-4 shadow-xl lg:hidden">
          <form onSubmit={submitSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-4 text-sm outline-none focus:border-[#2563EB]"
            />
          </form>

          <div className="mb-3 grid gap-1">
            {navLinks.filter((l) => !l.hasMenu).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mb-1.5">
            <MobileAccordion label="Servicios">
              <div className="grid gap-0.5 pt-1">
                {serviciosMenu.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#0F172A] transition hover:bg-white"
                  >
                    <Icon className="size-4 text-[#2563EB]" />
                    {label}
                  </Link>
                ))}
              </div>
            </MobileAccordion>
          </div>

          <div className="mb-3">
            <MobileAccordion label="Sistemas">
              <div className="grid gap-0.5 pt-1">
                {sistemasMenu.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#0F172A] transition hover:bg-white"
                  >
                    <Icon className="size-4 text-[#2563EB]" />
                    {label}
                  </Link>
                ))}
              </div>
            </MobileAccordion>
          </div>

          <MobileAccordion label="Todas las categorías">
            <div className="grid grid-cols-2 gap-0.5 pt-1">
              {categoryItems.map(({ label, icon: Icon }) => (
                <Link
                  key={label}
                  href={`/productos?categoria=${encodeURIComponent(label)}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-[#475569] transition hover:bg-white hover:text-[#2563EB]"
                >
                  <Icon className="size-3.5 shrink-0 text-[#2563EB]" />
                  {label}
                </Link>
              ))}
            </div>
          </MobileAccordion>

          <div className="mt-4 grid gap-2.5 border-t border-[#F1F5F9] pt-4 text-sm">
            <a href="tel:+51999888777" className="flex items-center gap-2 text-[#475569]">
              <Phone className="size-4 text-[#2563EB]" /> +51 999 888 777
            </a>
            <a href="mailto:ventas@fjsolutions.pe" className="flex items-center gap-2 text-[#475569]">
              <Mail className="size-4 text-[#2563EB]" /> ventas@fjsolutions.pe
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

