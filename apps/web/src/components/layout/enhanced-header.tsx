'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileText,
  Menu,
  MousePointer2,
  Search,
  UserRound,
  X,
  Phone,
  Mail,
  MessageSquare,
} from 'lucide-react'
import { mainNav, storeCategories, featuredBrands, itServicesMenu, infrastructureMenu, softwareDevMenu, companyMenu } from '@/lib/navigation'

// ─── Types ───────────────────────────────────────────────────────────────────────────────

type EnhancedHeaderProps = {
  quoteCount?: number
  onQuoteClick?: () => void
}

// ─── Hook: click outside ─────────────────────────────────────────────────────────────────

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

// ─── Componente: Icono mapeador ───────────────────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  Cpu: require('lucide-react').Cpu,
  Laptop: require('lucide-react').Laptop,
  Monitor: require('lucide-react').Monitor,
  MousePointer2: require('lucide-react').MousePointer2,
  HardDrive: require('lucide-react').HardDrive,
  Network: require('lucide-react').Network,
  Printer: require('lucide-react').Printer,
  Zap: require('lucide-react').Zap,
}

function getIcon(iconName: string) {
  return iconMap[iconName] || MousePointer2
}

// ─── Componente: Mobile Accordion ─────────────────────────────────────────────────────────────

function MobileAccordion({ label, isOpen, onToggle, children }: { label: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#F1F5F9]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 sm:px-4 py-3 text-sm font-semibold text-[#0F172A]"
      >
        {label}
        <ChevronDown
          className={`size-4 text-[#64748B] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="border-t border-[#F1F5F9] bg-[#F8FAFC]">{children}</div>}
    </div>
  )
}

// ─── Componente: Tienda en el menú móvil ──────────────────────────────────────────────────

function MobileStoreMenu({ onClose }: { onClose: () => void }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <div className="space-y-0.5 py-2 pl-2 pr-1">
      {storeCategories.map((category) => {
        const Icon = getIcon(category.icon)
        const isOpen = openCategory === category.id

        return (
          <div key={category.id}>
            <button
              type="button"
              onClick={() => setOpenCategory(isOpen ? null : category.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold text-[#0F172A] transition-colors hover:bg-white"
            >
              <Icon className="size-4 shrink-0 text-[#64748B]" />
              <span className="flex-1">{category.label}</span>
              <ChevronDown
                className={`size-4 shrink-0 text-[#94A3B8] transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="mb-1 ml-3 border-l border-[#E2E8F0] pl-3">
                <Link
                  href={category.items[0]?.href || '/productos'}
                  onClick={onClose}
                  className="block rounded-md px-2 py-1.5 text-xs font-bold text-[#2563EB]"
                >
                  Ver todo en {category.label}
                </Link>

                {category.items.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block rounded-md px-2 py-1.5 text-xs font-medium text-[#475569] transition-colors hover:text-[#2563EB]"
                    >
                      {item.label}
                    </Link>

                    {item.subItems && item.subItems.length > 0 && (
                      <div className="flex flex-wrap gap-1 px-2 pb-1.5">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={onClose}
                            className="rounded-full border border-[#E2E8F0] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#64748B] transition-colors hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <Link
        href="/productos"
        onClick={onClose}
        className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#2563EB] transition-colors hover:bg-[#EFF6FF]"
      >
        <ArrowRight className="size-4" />
        Ver todos los productos
      </Link>
    </div>
  )
}

// ─── Componente: Mega Menú de Tienda ───────────────────────────────────────────────────────

function StoreMegaMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState(storeCategories[0].id)
  useOnClickOutside(ref, onClose)

  const active = storeCategories.find((category) => category.id === activeCategory) ?? storeCategories[0]

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Categorías de productos"
      className="absolute left-0 top-[calc(100%+4px)] z-[60] w-[980px] max-w-[calc(100vw-10rem)] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex">
        {/* Categorías principales */}
        <div className="w-[264px] shrink-0 border-r border-[#F1F5F9] p-4">
          <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
            Categorías
          </h3>
          <div className="space-y-0.5">
            {storeCategories.map((category) => {
              const Icon = getIcon(category.icon)
              const isActive = activeCategory === category.id

              return (
                <Link
                  key={category.id}
                  href={category.items[0]?.href || '/productos'}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onFocus={() => setActiveCategory(category.id)}
                  onClick={onClose}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
                    isActive ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      isActive
                        ? 'border-[#2563EB]/20 bg-white text-[#2563EB]'
                        : 'border-[#E2E8F0] bg-white text-[#64748B] group-hover:border-[#2563EB]/20 group-hover:text-[#2563EB]'
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-sm font-semibold ${
                      isActive ? 'text-[#2563EB]' : 'text-[#0F172A] group-hover:text-[#2563EB]'
                    }`}
                  >
                    {category.label}
                  </span>
                  <ChevronRight
                    className={`size-3.5 shrink-0 transition-colors ${
                      isActive ? 'text-[#2563EB]' : 'text-[#94A3B8] group-hover:text-[#2563EB]'
                    }`}
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Subcategorías de la categoría activa */}
        <div className="min-w-0 flex-1 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
              {active.label}
            </h3>
            <Link
              href={active.items[0]?.href || '/productos'}
              onClick={onClose}
              className="text-[11px] font-bold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
            >
              Ver categoría
            </Link>
          </div>

          <div className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {active.items.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block text-sm font-semibold text-[#0F172A] transition-colors hover:text-[#2563EB]"
                >
                  {item.label}
                </Link>
                {item.subItems && item.subItems.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.label}>
                        <Link
                          href={subItem.href}
                          onClick={onClose}
                          className="block rounded-md px-2 py-1 text-xs text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Marcas destacadas */}
        <div className="w-[190px] shrink-0 border-l border-[#F1F5F9] p-4">
          <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
            Marcas
          </h3>
          <div className="space-y-0.5">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                onClick={onClose}
                className="block rounded-md px-2 py-1.5 text-xs font-medium text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
              >
                {brand.name}
              </Link>
            ))}
          </div>

          <div className="mt-3 border-t border-[#F1F5F9] pt-3">
            <Link
              href="/productos"
              onClick={onClose}
              className="flex items-center gap-1.5 px-2 text-xs font-bold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
            >
              Ver todo
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Componente: Menú Desplegable Compacto ───────────────────────────────────────────────

function CompactDropdown({ items, onClose }: { items: Array<{ label: string; href: string; desc?: string }>; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, onClose)

  return (
    <div
      ref={ref}
      role="dialog"
      className="absolute left-0 top-[calc(100%+4px)] z-[60] w-80 rounded-xl border border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-2">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            onClick={onClose}
            className="block rounded-lg px-4 py-3 text-sm text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors"
          >
            <span className="font-semibold">{item.label}</span>
            {item.desc && <span className="block text-xs text-[#64748B] mt-0.5">{item.desc}</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Componente: Enhanced Header ─────────────────────────────────────────────────────────

export function EnhancedHeader({ quoteCount = 0, onQuoteClick }: EnhancedHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const storeRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const infrastructureRef = useRef<HTMLDivElement>(null)
  const softwareRef = useRef<HTMLDivElement>(null)
  const companyRef = useRef<HTMLDivElement>(null)

  const closeAll = () => setOpenDropdown(null)

  useOnClickOutside(storeRef, () => { if (openDropdown === 'store') closeAll() })
  useOnClickOutside(servicesRef, () => { if (openDropdown === 'services') closeAll() })
  useOnClickOutside(infrastructureRef, () => { if (openDropdown === 'infrastructure') closeAll() })
  useOnClickOutside(softwareRef, () => { if (openDropdown === 'software') closeAll() })
  useOnClickOutside(companyRef, () => { if (openDropdown === 'company') closeAll() })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeAll(); setMenuOpen(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll de la página mientras el menú móvil está abierto.
  useEffect(() => {
    if (!menuOpen) return

    const { body, documentElement } = document
    const previousBodyOverflow = body.style.overflow
    const previousBodyPaddingRight = body.style.paddingRight
    const previousHtmlOverflow = documentElement.style.overflow
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth

    documentElement.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      documentElement.style.overflow = previousHtmlOverflow
      body.style.overflow = previousBodyOverflow
      body.style.paddingRight = previousBodyPaddingRight
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
    closeAll()
  }, [pathname])

  const goToQuote = () => {
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
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key))

  return (
    <>
    <header className="sticky top-0 z-40 w-full bg-white">
      {/* Primera franja: Logo, enlaces corporativos, buscador, acciones */}
      <div className="border-b border-[#F1F5F9]">
        <div className="mx-auto max-w-[1400px] px-3 py-2.5 sm:px-4 sm:py-3 lg:px-8 lg:py-3">
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 sm:gap-3"
              aria-label="FJ Solutions · Inicio"
              onClick={() => { setMenuOpen(false); closeAll() }}
            >
              <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] font-heading text-sm font-bold tracking-tight text-white shadow-md shadow-[#2563EB]/20">
                FJ
              </span>
              <span className="hidden font-heading text-lg sm:text-xl font-bold tracking-[-0.04em] text-[#0F172A] sm:block lg:text-2xl">
                FJ <span className="text-[#2563EB]">Solutions</span>
              </span>
            </Link>

            {/* Buscador */}
            <form onSubmit={submitSearch} className="relative hidden min-w-0 flex-1 md:block lg:max-w-2xl">
              <span className="sr-only">Buscar productos</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos, marcas o soluciones..."
                className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-24 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/15"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-8 rounded-lg bg-[#2563EB] px-4 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Buscar
              </button>
            </form>

            {/* Acciones del usuario */}
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/mi-cuenta"
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#2563EB] lg:flex"
              >
                <UserRound className="size-4" />
                Mi cuenta
              </Link>

              <button
                type="button"
                onClick={goToQuote}
                className="relative flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                aria-label={`Abrir cotización, ${quoteCount} productos`}
              >
                <FileText className="size-4 sm:size-5" />
                <span className="hidden sm:inline md:inline">Mi cotización</span>
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
                className="grid size-9 sm:size-10 place-items-center rounded-lg border border-[#E2E8F0] text-[#475569] transition hover:border-[#2563EB]/30 hover:bg-[#F8FAFC] hover:text-[#2563EB] lg:hidden"
              >
                {menuOpen ? <X className="size-4 sm:size-5" /> : <Menu className="size-4 sm:size-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda franja: Navegación principal */}
      <div
        className={`transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)]' : 'shadow-none'
          }`}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:block">
            <nav className="flex items-center gap-1 py-3" aria-label="Navegación principal">
            {mainNav.map((link, index) => {
              const active = isActive(link.href)
              const dropdownKey = link.label.toLowerCase().replace(/ /g, '-')
              const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
                tienda: storeRef,
                'servicios-ti': servicesRef,
                'infraestructura-ti': infrastructureRef,
                'desarrollo-de-software': softwareRef,
                empresa: companyRef,
              }
              const itemsMap: Record<string, Array<{ label: string; href: string; desc?: string }>> = {
                'servicios-ti': itServicesMenu,
                'infraestructura-ti': infrastructureMenu,
                'desarrollo-de-software': softwareDevMenu,
                empresa: companyMenu,
              }

              return (
                <div key={index} className="relative" ref={refMap[dropdownKey]}>
                  {link.hasMegaMenu ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggle('store')}
                        aria-expanded={openDropdown === 'store'}
                        aria-haspopup="dialog"
                        className={`flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors ${active
                            ? 'text-[#2563EB]'
                            : 'text-[#475569] hover:text-[#2563EB]'
                          }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`size-3.5 transition-transform duration-200 ${openDropdown === 'store' ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openDropdown === 'store' && <StoreMegaMenu onClose={closeAll} />}
                    </>
                  ) : link.hasMenu ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggle(dropdownKey)}
                        aria-expanded={openDropdown === dropdownKey}
                        aria-haspopup="dialog"
                        className={`flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors ${active
                            ? 'text-[#2563EB]'
                            : 'text-[#475569] hover:text-[#2563EB]'
                          }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`size-3.5 transition-transform duration-200 ${openDropdown === dropdownKey ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openDropdown === dropdownKey && (
                        <CompactDropdown items={itemsMap[dropdownKey] || []} onClose={closeAll} />
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`flex h-10 items-center rounded-lg px-3 text-sm font-semibold transition-colors ${active
                          ? 'text-[#2563EB]'
                          : 'text-[#475569] hover:text-[#2563EB]'
                        }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              )
            })}

            {/* CTA: Solicitar asesoría */}
            <div className="ml-auto">
              <Link
                href="/contacto"
                className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
              >
                <MessageSquare className="size-4" />
                <span className="hidden sm:inline">Solicitar asesoría</span>
              </Link>
            </div>
          </nav>
          </div>
        </div>
      </div>

    </header>

    {/* Menú móvil */}
    {menuOpen && (
      <>
        {/* Backdrop oscuro */}
        <div
          className="fixed inset-0 z-[100] bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer lateral */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-sm flex-col bg-white shadow-2xl lg:hidden"
        >
          {/* Cabecera fija */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#F1F5F9] px-4 py-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="FJ Solutions · Inicio"
              onClick={() => { setMenuOpen(false); closeAll() }}
            >
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] font-heading text-sm font-bold tracking-tight text-white">
                FJ
              </span>
              <span className="font-heading text-xl font-bold tracking-[-0.04em] text-[#0F172A]">
                FJ <span className="text-[#2563EB]">Solutions</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#E2E8F0] text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
              aria-label="Cerrar menú"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Contenido desplazable */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
            {/* Buscador móvil */}
            <form onSubmit={submitSearch} className="mb-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/15"
                />
              </div>
            </form>

            {/* Navegación principal móvil */}
            <nav className="space-y-1" aria-label="Navegación móvil">
              {mainNav.map((link, index) => {
                const active = isActive(link.href)
                const dropdownKey = link.label.toLowerCase().replace(/ /g, '-')

                return (
                  <div key={index}>
                    {link.hasMegaMenu ? (
                      <MobileAccordion
                        label={link.label}
                        isOpen={openDropdown === 'store'}
                        onToggle={() => toggle('store')}
                      >
                        <MobileStoreMenu onClose={() => { closeAll(); setMenuOpen(false) }} />
                      </MobileAccordion>
                    ) : link.hasMenu ? (
                      <MobileAccordion
                        label={link.label}
                        isOpen={openDropdown === dropdownKey}
                        onToggle={() => toggle(dropdownKey)}
                      >
                        <div className="space-y-1 pl-4 py-2">
                          {(dropdownKey === 'servicios-ti' ? itServicesMenu :
                            dropdownKey === 'infraestructura-ti' ? infrastructureMenu :
                              dropdownKey === 'desarrollo-de-software' ? softwareDevMenu :
                                dropdownKey === 'empresa' ? companyMenu : []).map((item, index) => (
                                  <Link
                                    key={`${item.href}-${index}`}
                                    href={item.href}
                                    onClick={() => { closeAll(); setMenuOpen(false) }}
                                    className="block rounded-lg px-3 py-2 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors"
                                  >
                                    <span className="font-semibold">{item.label}</span>
                                    {item.desc ? <span className="block text-xs text-[#64748B] mt-0.5">{item.desc}</span> : null}
                                  </Link>
                                ))}
                        </div>
                      </MobileAccordion>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between rounded-lg px-3 sm:px-4 py-3 text-sm font-semibold transition-colors ${active
                            ? 'bg-[#EFF6FF] text-[#2563EB]'
                            : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                          }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Acciones rápidas móvil */}
            <div className="mt-6 pt-6 border-t border-[#F1F5F9] space-y-3">
              <Link
                href="/mi-cuenta"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 sm:px-4 py-3 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors"
              >
                <UserRound className="size-5" />
                Mi cuenta
              </Link>
              <button
                type="button"
                onClick={() => { goToQuote(); setMenuOpen(false) }}
                className="flex items-center justify-between rounded-lg px-3 sm:px-4 py-3 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors w-full"
              >
                <div className="flex items-center gap-3">
                  <FileText className="size-5" />
                  Mi cotización
                </div>
                {quoteCount > 0 && (
                  <span className="grid size-6 place-items-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                    {quoteCount}
                  </span>
                )}
              </button>
              <Link
                href="/contacto"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 sm:px-4 py-3 text-sm font-semibold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
              >
                <MessageSquare className="size-5" />
                Solicitar asesoría
              </Link>
            </div>

            {/* Contacto móvil */}
            <div className="mt-6 pt-6 border-t border-[#F1F5F9]">
              <div className="space-y-2 text-sm text-[#64748B]">
                <a href="tel:+51999888777" className="flex items-center gap-2 hover:text-[#2563EB] transition-colors">
                  <Phone className="size-4" />
                  +51 999 888 777
                </a>
                <a href="mailto:ventas@fjsolutions.pe" className="flex items-center gap-2 hover:text-[#2563EB] transition-colors">
                  <Mail className="size-4" />
                  ventas@fjsolutions.pe
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  )
}
