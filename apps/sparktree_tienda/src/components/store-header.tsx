'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock,
  FileText,
  LayoutGrid,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  UserRound,
  X,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { COMPANY, ECOSYSTEM_NAV, GROUP_URL, STORE_NAV, corporateUrl } from '@/lib/store-nav'
import { useQuote } from '@/lib/use-quote'

type StoreCategory = { value: string; label: string }

type StoreHeaderProps = {
  categories: StoreCategory[]
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

function CategoryPanel({
  categories,
  onClose,
}: {
  categories: StoreCategory[]
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-label="Categorías de productos"
      className="absolute left-0 top-[calc(100%+8px)] z-50 w-[640px] rounded-2xl border border-border bg-card shadow-[0_8px_40px_rgba(15,23,42,0.10)]"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Categorías de productos
        </p>
        <Link
          href="/productos"
          onClick={onClose}
          className="flex items-center gap-1 text-[13px] font-semibold text-blue-ink transition hover:text-brand-ink"
        >
          Ver todo <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-px p-3 sm:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.value}
            href={`/productos?categoria=${encodeURIComponent(category.value)}`}
            onClick={onClose}
            className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted hover:text-blue-ink"
          >
            <span className="truncate">{category.label}</span>
            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
      <div className="border-t border-border px-5 py-3">
        <Link
          href="/productos"
          onClick={onClose}
          className="flex items-center gap-2 text-[13px] font-semibold text-blue-ink transition hover:text-brand-ink"
        >
          Ver toda la tienda
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}

export function StoreHeader({ categories }: StoreHeaderProps) {
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
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 brightness-0 dark:brightness-100 sm:h-11"
            />
            <span className="hidden flex-col leading-tight xl:flex">
              <span className="font-heading text-sm font-bold text-foreground">TIENDA OFICIAL</span>
              <span className="text-[10px] font-medium text-muted-foreground">
                SparkTree Store · Hardware &amp; equipamiento TI
              </span>
            </span>
          </Link>

          <div ref={categoriesRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => {
                setCategoriesOpen((value) => !value)
                setEcosystemOpen(false)
              }}
              aria-expanded={categoriesOpen}
              aria-haspopup="dialog"
              className={`flex h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-[14px] font-semibold transition-all ${
                categoriesOpen
                  ? 'border-[#2563EB]/30 bg-tint-blue text-blue-ink'
                  : 'border-border bg-card text-foreground hover:border-[#2563EB]/30 hover:bg-muted hover:text-blue-ink'
              }`}
            >
              <LayoutGrid className="size-4" />
              Categorías
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {categoriesOpen && (
              <CategoryPanel categories={categories} onClose={() => setCategoriesOpen(false)} />
            )}
          </div>

          <form onSubmit={submitSearch} className="relative flex min-w-0 flex-1">
            <span className="sr-only">Buscar productos</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca laptops, monitores, componentes..."
              className="h-10 w-full rounded-xl border border-border bg-muted pl-10 pr-24 text-[14px] text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#2563EB] focus:bg-card focus:ring-2 focus:ring-[#2563EB]/15"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 hidden h-7 items-center rounded-lg bg-[#2563EB] px-3.5 text-xs font-bold text-white transition hover:bg-[#1D4ED8] sm:flex"
            >
              Buscar
            </button>
          </form>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <ThemeToggle />
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
              <div ref={ecosystemRef} className="relative">
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
                    className="absolute left-0 top-full z-50 w-[340px] rounded-2xl border border-border bg-card p-2 shadow-[0_8px_40px_rgba(15,23,42,0.10)]"
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
