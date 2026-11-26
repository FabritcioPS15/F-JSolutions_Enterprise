'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock,
  Cpu,
  FileText,
  Gamepad2,
  HardDrive,
  Headphones,
  House,
  Keyboard,
  Laptop,
  LayoutGrid,
  Mail,
  MapPin,
  MemoryStick,
  Menu,
  Monitor,
  Network,
  Package,
  Phone,
  Plug,
  Printer,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { COMPANY, ECOSYSTEM_NAV, GROUP_URL, STORE_NAV, corporateUrl } from '@/lib/store-nav'
import { useQuote } from '@/lib/use-quote'

type StoreCategory = {
  value: string
  label: string
  count?: number
  subcategories?: { label: string; types: string[] }[]
}

type StoreHeaderProps = {
  categories: StoreCategory[]
  brands: string[]
}

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return
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

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'pc y servidores': Server,
  'laptops y portatiles': Laptop,
  laptops: Laptop,
  'componentes de pc': Cpu,
  componentes: Cpu,
  monitores: Monitor,
  'redes y conectividad': Network,
  redes: Network,
  almacenamiento: HardDrive,
  perifericos: Keyboard,
  'impresoras y escaneres': Printer,
  accesorios: Package,
  'audio y video': Headphones,
  'cables y energia': Plug,
  gaming: Gamepad2,
  'hogar inteligente': House,
  memoria: MemoryStick,
  seguridad: ShieldCheck,
  software: AppWindow,
  telefonia: Smartphone,
}

function categoryIcon(label: string) {
  const key = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  return CATEGORY_ICONS[key] ?? Package
}

function CategoryMegaMenu({
  categories,
  brands,
  onClose,
}: {
  categories: StoreCategory[]
  brands: string[]
  onClose: () => void
}) {
  const [activeValue, setActiveValue] = useState(
    () =>
      (categories.find((category) => category.subcategories?.length) ?? categories[0])?.value ?? ''
  )
  const active = categories.find((category) => category.value === activeValue) ?? categories[0]
  const activeHref = active ? `/productos?categoria=${encodeURIComponent(active.value)}` : '/productos'

  return (
    <div
      role="dialog"
      aria-label="Mega menú de categorías"
      className="mega-menu-panel absolute left-0 top-[calc(100%+10px)] z-50 flex max-h-[calc(100dvh-190px)] w-[min(1080px,calc(100vw-4rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_64px_-28px_rgba(15,23,42,0.35)]"
    >
      <div className="grid min-h-0 flex-1 grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-y-auto border-r border-border bg-muted/60 p-2.5 [scrollbar-width:thin]">
          <p className="px-2 pb-2 pt-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Categorías
          </p>
          <div className="grid grid-cols-2 gap-0.5">
            {categories.map((category) => {
              const Icon = categoryIcon(category.label)
              const isActive = category.value === active?.value
              return (
                <Link
                  key={category.value}
                  href={`/productos?categoria=${encodeURIComponent(category.value)}`}
                  onMouseEnter={() => setActiveValue(category.value)}
                  onFocus={() => setActiveValue(category.value)}
                  onClick={onClose}
                  title={category.label}
                  className={`group flex items-center gap-2 rounded-xl px-2.5 py-2 text-[12.5px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-card text-blue-ink shadow-sm ring-1 ring-[#2563EB]/15'
                      : 'text-foreground hover:bg-card/70 hover:text-blue-ink'
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-tint-blue text-blue-ink'
                        : 'bg-card text-muted-foreground group-hover:text-blue-ink'
                    }`}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">{category.label}</span>
                  <span className="text-[10.5px] font-medium text-muted-foreground">
                    {category.count ?? 0}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-y-auto p-5 [scrollbar-width:thin]">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-ink">
                Explorar
              </p>
              <h3 className="mt-1 font-heading text-lg font-black text-foreground">
                {active?.label}
              </h3>
            </div>
            <Link
              href={activeHref}
              onClick={onClose}
              className="mt-1 inline-flex shrink-0 items-center gap-1 text-xs font-bold text-blue-ink transition hover:text-brand-ink"
            >
              Ver categoría <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {active?.subcategories?.length ? (
            <div className="mt-4 grid flex-1 content-start grid-cols-2 gap-x-6 gap-y-4">
              {active.subcategories.map((sub) => (
                <div key={sub.label} className="min-w-0">
                  <Link
                    href={`${activeHref}&subcategoria=${encodeURIComponent(sub.label)}`}
                    onClick={onClose}
                    className="text-[12.5px] font-bold text-foreground transition hover:text-blue-ink"
                  >
                    {sub.label}
                  </Link>
                  {sub.types.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-x-2.5 gap-y-0.5">
                      {sub.types.map((type) => (
                        <Link
                          key={type}
                          href={`${activeHref}&subcategoria=${encodeURIComponent(sub.label)}&tipo=${encodeURIComponent(type)}`}
                          onClick={onClose}
                          className="text-[11px] text-muted-foreground transition hover:text-blue-ink"
                        >
                          {type}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 flex-1 text-xs text-muted-foreground">
              Explora los productos disponibles en esta categoría.
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-[#172554] px-4 py-3">
            <div>
              <p className="text-[13px] font-bold text-white">Compra corporativa</p>
              <p className="text-[11px] text-blue-100/75">
                Cotiza varios equipos en una sola solicitud.
              </p>
            </div>
            <Link
              href="/cotizacion"
              onClick={onClose}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#F59E0B] px-3 text-[11.5px] font-bold text-[#172554] transition hover:bg-[#D97706]"
            >
              Cotizar <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border bg-muted/40 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Marcas
          </span>
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/productos?marca=${encodeURIComponent(brand)}`}
              onClick={onClose}
              className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink"
            >
              {brand}
            </Link>
          ))}
        </div>
        <Link
          href="/productos"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-ink transition hover:text-brand-ink"
        >
          Ver toda la tienda <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}

export function StoreHeader({ categories, brands }: StoreHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const quote = useQuote()
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [ecosystemOpen, setEcosystemOpen] = useState(false)
  const [topBarClosed, setTopBarClosed] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const [query, setQuery] = useState('')
  const categoriesRef = useRef<HTMLDivElement>(null)
  const ecosystemRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(categoriesRef, () => setCategoriesOpen(false))
  useOnClickOutside(ecosystemRef, () => setEcosystemOpen(false))

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setCategoriesOpen(false)
      setEcosystemOpen(false)
      setMenuOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('fj-store-topbar')
    if (saved === 'true') setTopBarClosed(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('fj-store-topbar', String(topBarClosed))
  }, [topBarClosed])

  useEffect(() => {
    setMenuOpen(false)
    setCategoriesOpen(false)
    setEcosystemOpen(false)
    setMobileCategoriesOpen(false)
  }, [pathname])

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const term = query.trim()
    setMenuOpen(false)
    router.push(term ? `/productos?q=${encodeURIComponent(term)}` : '/productos')
  }

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  if (pathname === '/login' || pathname === '/registro') return null

  return (
    <header className="sticky top-0 z-50">
      <div
        data-surface="dark"
        className={`overflow-hidden bg-[#172554] text-muted-foreground/60 transition-[max-height,opacity] duration-200 ease-out ${
          topBarClosed ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-[11.5px] font-medium sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href={COMPANY.phoneHref} className="flex items-center gap-1.5 transition hover:text-white">
              <Phone className="size-3.5 text-[#93C5FD]" /> {COMPANY.phone}
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="flex items-center gap-1.5 transition hover:text-white"
            >
              <Mail className="size-3.5 text-[#93C5FD]" /> {COMPANY.email}
            </a>
            <span className="hidden items-center gap-1.5 sm:flex">
              <MapPin className="size-3.5 text-[#93C5FD]" /> {COMPANY.location}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 md:flex">
              <Clock className="size-3.5 text-[#93C5FD]" /> {COMPANY.hours}
            </span>
            <a href={GROUP_URL} className="transition hover:text-white">
              SparkTree Group
            </a>
            <a href={corporateUrl('/soporte-ti')} className="transition hover:text-white">
              Mesa de ayuda
            </a>
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

      <div className="border-b border-border bg-card/90 backdrop-blur-xl shadow-[0_12px_32px_-20px_rgba(15,23,42,0.35)]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3.5 sm:px-6 lg:gap-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="SparkTree Store · Inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/sparktree-horizontal.png"
              alt="SparkTree Store"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 brightness-0 sm:h-11"
            />
            <span className="hidden flex-col leading-tight xl:flex">
              <span className="font-heading text-sm font-bold text-foreground">TIENDA OFICIAL</span>
              <span className="text-[10px] font-medium text-muted-foreground">
                SparkTree Store · Hardware &amp; equipamiento TI
              </span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="relative flex min-w-0 flex-1">
            <span className="sr-only">Buscar productos</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca laptops, monitores, componentes..."
              className="h-10 w-full rounded-xl border border-border bg-muted pl-10 pr-3 text-[14px] text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#2563EB] focus:bg-card focus:ring-2 focus:ring-[#2563EB]/15 sm:pr-24"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 hidden h-7 items-center rounded-lg bg-[#2563EB] px-3.5 text-xs font-bold text-white transition hover:bg-[#1D4ED8] sm:flex"
            >
              Buscar
            </button>
          </form>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <Link
              href="/mi-cuenta"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-blue-ink xl:flex"
            >
              <UserRound className="size-4" />
              Mi cuenta
            </Link>
            <Link
              href="/cotizacion"
              aria-label={
                quote.count > 0 ? `Mi cotización (${quote.count} productos)` : 'Mi cotización'
              }
              className="relative hidden items-center gap-2 rounded-lg bg-[#2563EB] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] sm:flex"
            >
              <FileText className="size-4" />
              Cotizar
              {quote.count > 0 && (
                <span className="grid min-w-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-bold text-[#2563EB]">
                  {quote.count}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition hover:border-[#2563EB]/30 hover:bg-muted hover:text-blue-ink lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-border lg:block" aria-label="Navegación principal">
          <div className="mx-auto flex max-w-[1280px] items-center gap-1 px-8">
            <div ref={categoriesRef} className="relative shrink-0 py-2">
              <button
                type="button"
                onClick={() => {
                  setCategoriesOpen((value) => !value)
                  setEcosystemOpen(false)
                }}
                aria-expanded={categoriesOpen}
                aria-haspopup="dialog"
                className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-bold transition-all ${
                  categoriesOpen
                    ? 'border-[#2563EB]/30 bg-tint-blue text-blue-ink'
                    : 'border-border bg-muted text-foreground hover:border-[#2563EB]/30 hover:text-blue-ink'
                }`}
              >
                <LayoutGrid className="size-4" />
                Categorías
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {categoriesOpen && (
                <CategoryMegaMenu
                  categories={categories}
                  brands={brands}
                  onClose={() => setCategoriesOpen(false)}
                />
              )}
            </div>
            <span aria-hidden="true" className="mx-2 h-5 w-px shrink-0 bg-border" />
            {STORE_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 px-3 py-4 text-[14px] font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'border-[#2563EB] text-blue-ink'
                    : 'border-transparent text-muted-foreground hover:text-blue-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {ECOSYSTEM_NAV.length > 0 && (
              <div ref={ecosystemRef} className="relative ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEcosystemOpen((value) => !value)
                    setCategoriesOpen(false)
                  }}
                  aria-expanded={ecosystemOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-4 text-[14px] font-semibold transition-colors ${
                    ecosystemOpen
                      ? 'border-[#2563EB] text-blue-ink'
                      : 'border-transparent text-muted-foreground hover:text-blue-ink'
                  }`}
                >
                  Ecosistema SparkTree
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${ecosystemOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {ecosystemOpen && (
                  <div
                    role="menu"
                    aria-label="Otras empresas del grupo"
                    className="absolute right-0 top-[calc(100%+8px)] z-50 w-[340px] rounded-2xl border border-border bg-card p-2 shadow-[0_8px_40px_rgba(15,23,42,0.10)]"
                  >
                    {ECOSYSTEM_NAV.map((unit) => (
                      <a
                        key={unit.name}
                        href={unit.href}
                        role="menuitem"
                        className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-muted"
                      >
                        <span
                          className="mt-1.5 size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: unit.accent }}
                        />
                        <span className="min-w-0">
                          <span className="flex items-center gap-1 text-sm font-semibold text-foreground transition-colors group-hover:text-blue-ink">
                            {unit.name}
                            <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </span>
                          <span className="block text-xs text-muted-foreground">{unit.tagline}</span>
                        </span>
                      </a>
                    ))}
                    <a
                      href={GROUP_URL}
                      role="menuitem"
                      className="mt-1 flex items-center justify-between rounded-xl border-t border-border px-3 pb-1.5 pt-3 text-sm font-semibold text-blue-ink transition hover:text-brand-ink"
                    >
                      Ver SparkTree Group
                      <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div className="max-h-[calc(100vh-140px)] overflow-y-auto border-b border-border bg-card px-4 pb-6 pt-4 shadow-xl lg:hidden">
          <form onSubmit={submitSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar productos..."
              className="h-11 w-full rounded-xl border border-border bg-muted pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#2563EB]"
            />
          </form>

          <div className="mb-3 grid gap-1">
            {STORE_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'bg-tint-blue text-blue-ink'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mb-3 grid gap-1 border-t border-border pt-3">
            <p className="px-2 pb-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Ecosistema SparkTree
            </p>
            {ECOSYSTEM_NAV.map((unit) => (
              <a
                key={unit.name}
                href={unit.href}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <span className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: unit.accent }} />
                  {unit.name}
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
            ))}
            <a
              href={GROUP_URL}
              className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-ink transition hover:bg-muted"
            >
              Ver SparkTree Group
              <ArrowRight className="size-3.5" />
            </a>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setMobileCategoriesOpen((value) => !value)}
              aria-expanded={mobileCategoriesOpen}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
            >
              Todas las categorías
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${mobileCategoriesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileCategoriesOpen && (
              <div className="grid grid-cols-2 gap-0.5 border-t border-border bg-muted px-3 py-2">
                {categories.map((category) => (
                  <Link
                    key={category.value}
                    href={`/productos?categoria=${encodeURIComponent(category.value)}`}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-card hover:text-blue-ink"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3 grid gap-1 border-t border-border pt-3 text-sm">
            <Link
              href="/mi-cuenta"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-semibold text-foreground transition hover:bg-muted"
            >
              <UserRound className="size-4 text-blue-ink" /> Mi cuenta
            </Link>
            <Link
              href="/cotizacion"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between gap-2.5 rounded-xl px-4 py-2.5 font-semibold text-foreground transition hover:bg-muted"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="size-4 text-blue-ink" /> Mi cotización
              </span>
              {quote.count > 0 && (
                <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-[11px] font-bold text-white">
                  {quote.count}
                </span>
              )}
            </Link>
          </div>

          <div className="mt-4 grid gap-2.5 border-t border-border pt-4 text-sm">
            <a href={COMPANY.phoneHref} className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4 text-blue-ink" /> {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4 text-blue-ink" /> {COMPANY.email}
            </a>
            <Link
              href="/cotizacion"
              onClick={() => setMenuOpen(false)}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              <FileText className="size-4" /> Solicitar cotización
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
