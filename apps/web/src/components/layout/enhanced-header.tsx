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

// ─── Componente: Submenú de Tercer Nivel ─────────────────────────────────────────────────────────

function ThirdLevelSubmenu({ items, onClose }: { items: Array<{ label: string; href: string }>; onClose: () => void }) {
  return (
    <div
      role="dialog"
      className="absolute left-full top-0 ml-1 z-[80] w-44 rounded-lg border border-[#E2E8F0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.1)] animate-in fade-in slide-in-from-left-2 duration-150"
    >
      <div className="p-1.5">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            onClick={onClose}
            className="block rounded-md px-3 py-2 text-xs font-medium text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Componente: Submenú de Categoría ─────────────────────────────────────────────────────────

function CategorySubmenu({ items, onClose }: { items: Array<{ label: string; href: string; subItems?: Array<{ label: string; href: string }> }>; onClose: () => void }) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  return (
    <div
      role="dialog"
      className="absolute left-full top-0 ml-1 z-[70] w-56 rounded-lg border border-[#E2E8F0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.1)] animate-in fade-in slide-in-from-left-2 duration-150"
    >
      <div className="p-1.5">
        {items.map((item, index) => {
          const hasSubmenu = item.subItems && item.subItems.length > 0
          const isOpen = activeSubmenu === item.label

          return (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setActiveSubmenu(item.label)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              {hasSubmenu ? (
                <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors cursor-pointer group">
                  <Link href={item.href} onClick={onClose} className="flex-1 font-semibold">
                    {item.label}
                  </Link>
                  <ChevronRight className="size-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors shrink-0" />
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-md px-3 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
                >
                  {item.label}
                </Link>
              )}
              {hasSubmenu && isOpen && (
                <ThirdLevelSubmenu
                  items={item.subItems || []}
                  onClose={() => { setActiveSubmenu(null); onClose() }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Componente: Mega Menú de Tienda ───────────────────────────────────────────────────────

function StoreMegaMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  useOnClickOutside(ref, onClose)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Categorías de productos"
      className="absolute left-0 top-[calc(100%+4px)] z-[60] w-[920px] rounded-xl border border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex">
        {/* Categorías principales */}
        <div className="flex-1 border-r border-[#F1F5F9] p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
            Categorías
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {storeCategories.map((category) => {
              const Icon = getIcon(category.icon)
              const isActive = activeCategory === category.id

              return (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors cursor-pointer ${
                    isActive ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                  }`}>
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isActive
                        ? 'border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB]'
                        : 'border-[#E2E8F0] bg-white text-[#64748B] group-hover:border-[#2563EB]/20 group-hover:bg-[#EFF6FF] group-hover:text-[#2563EB]'
                    }`}>
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-semibold leading-snug ${
                        isActive ? 'text-[#2563EB]' : 'text-[#0F172A] group-hover:text-[#2563EB]'
                      }`}>
                        {category.label}
                      </span>
                      <span className="block text-xs text-[#64748B]">
                        {category.items.length} subcategorías
                      </span>
                    </span>
                    <ChevronRight className={`size-3.5 transition-colors shrink-0 ${
                      isActive ? 'text-[#2563EB]' : 'text-[#94A3B8] group-hover:text-[#2563EB]'
                    }`} />
                  </div>
                  {isActive && (
                    <CategorySubmenu
                      items={category.items}
                      onClose={() => { setActiveCategory(null); onClose() }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar: Marcas destacadas */}
        <div className="w-56 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
            Marcas destacadas
          </h3>
          <div className="space-y-1">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors"
              >
                {brand.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
            <Link
              href="/productos"
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              Ver todos los productos
              <ArrowRight className="size-4" />
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
            <form onSubmit={submitSearch} className="relative flex-1 max-w-md hidden md:block">
              <span className="sr-only">Buscar productos</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos, marcas o soluciones..."
                className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-24 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/15"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-7 rounded-lg bg-[#2563EB] px-3.5 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Buscar
              </button>
            </form>

            {/* Acciones del usuario */}
            <div className="flex items-center gap-1.5 sm:gap-2">
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

      {/* Menú móvil */}
      {menuOpen && (
        <>
          {/* Backdrop oscuro */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer lateral */}
          <div className="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[110] overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="px-4 py-6">
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="size-5" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-6"
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
                        <div className="space-y-1 pl-4 py-2">
                          {storeCategories.map((category) => {
                            const Icon = getIcon(category.icon)
                            return (
                              <Link
                                key={category.id}
                                href={category.items[0]?.href || '/productos'}
                                onClick={() => { closeAll(); setMenuOpen(false) }}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors"
                              >
                                <Icon className="size-4 text-[#64748B]" />
                                <span>{category.label}</span>
                              </Link>
                            )
                          })}
                          <Link
                            href="/productos"
                            onClick={() => { closeAll(); setMenuOpen(false) }}
                            className="flex items-center gap-2 mt-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                          >
                            <ArrowRight className="size-4" />
                            Ver todos los productos
                          </Link>
                        </div>
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
    </header>
  )
}
