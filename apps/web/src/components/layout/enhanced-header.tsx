'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Building2,
  Cable,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock,
  Code2,
  Compass,
  Cpu,
  FileText,
  FolderKanban,
  Globe,
  HardDrive,
  Headset,
  Laptop,
  LayoutTemplate,
  Lightbulb,
  Loader2,
  Mail,
  Menu,
  Monitor,
  MousePointer2,
  Network,
  Package,
  Phone,
  Plug,
  Printer,
  Route,
  Scale,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  UserRound,
  Workflow,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { FaTeamspeak } from 'react-icons/fa6'
import { categories as catalogCategories } from '@/lib/catalog'
import {
  popularSearches,
  quickSearchLinks,
  searchSiteGrouped,
  type SiteSearchType,
} from '@/lib/site-search'
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
  Building2,
  Boxes,
  Cable,
  CircleHelp,
  Compass,
  Cpu,
  FolderKanban,
  Globe,
  HardDrive,
  Headset,
  Laptop,
  LayoutTemplate,
  Lightbulb,
  Mail,
  Monitor,
  MousePointer2,
  Network,
  Package,
  Plug,
  Printer,
  Route,
  Server,
  ShieldCheck,
  Store,
  Workflow,
  Wrench,
  Zap,
}

function getIcon(iconName: string) {
  return iconMap[iconName] || MousePointer2
}

const sectionIcons: Record<string, React.ElementType> = {
  store: Store,
  'servicios-ti': Headset,
  'infraestructura-ti': Network,
  'desarrollo-de-software': Code2,
  empresa: Compass,
}

// ─── Componente: Mobile Accordion ─────────────────────────────────────────────────────────────

function MobileAccordion({
  label,
  isOpen,
  onToggle,
  children,
  badge,
  active,
  icon: Icon,
  count,
}: {
  label: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  badge?: string
  active?: boolean
  icon?: React.ElementType
  count?: number
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-[#2563EB]/45 bg-white shadow-[0_18px_40px_-32px_rgba(37,99,235,0.65)]'
          : active
          ? 'border-[#2563EB]/30 bg-[#EFF6FF]/25'
          : 'border-[#E2E8F0] bg-white'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
      >
        {Icon && (
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-xl border transition-colors duration-300 ${
              isOpen
                ? 'border-[#2563EB] bg-[#2563EB] text-white'
                : active
                ? 'border-[#2563EB]/25 bg-[#EFF6FF] text-[#2563EB]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
            }`}
          >
            <Icon className="size-4" />
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span
              className={`truncate text-sm font-semibold transition-colors duration-200 ${
                isOpen || active ? 'text-[#2563EB]' : 'text-[#0F172A]'
              }`}
            >
              {label}
            </span>
            {active && !isOpen && <span className="size-1.5 shrink-0 rounded-full bg-[#2563EB]" />}
            {badge && (
              <span className="shrink-0 rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#2563EB]">
                {badge}
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-[#94A3B8]">
            {isOpen ? 'Toca para cerrar' : `${count ?? 0} opciones`}
          </span>
        </span>

        <span
          className={`grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
            isOpen
              ? 'rotate-180 border-[#2563EB] bg-[#2563EB] text-white'
              : 'border-[#E2E8F0] bg-white text-[#64748B]'
          }`}
        >
          <ChevronDown className="size-3.5" />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        inert={!isOpen}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#F1F5F9] bg-[#F8FAFC]/70 p-2.5">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Componente: Tienda en el menú móvil ──────────────────────────────────────────────────

function MobileStoreMenu({ onClose }: { onClose: () => void }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const toggleCategory = (categoryId: string) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId))
  }

  return (
    <div className="space-y-1">
      {storeCategories.map((category) => {
        const Icon = getIcon(category.icon)
        const isOpen = openCategory === category.id

        return (
          <div
            key={category.id}
            className={`rounded-xl transition-colors ${
              isOpen ? 'border border-[#E2E8F0] bg-white shadow-xs' : 'hover:bg-white/80'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleCategory(category.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left text-sm font-semibold text-[#0F172A]"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                  isOpen
                    ? 'border-[#2563EB]/25 bg-[#EFF6FF] text-[#2563EB]'
                    : 'border-[#E2E8F0] bg-white text-[#64748B]'
                }`}
              >
                <Icon className="size-3.5" />
              </span>
              <span className={`flex-1 truncate ${isOpen ? 'text-[#2563EB]' : ''}`}>
                {category.label}
              </span>
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                  isOpen
                    ? 'rotate-180 border-[#2563EB] bg-[#2563EB] text-white'
                    : 'border-[#E2E8F0] bg-white text-[#64748B]'
                }`}
              >
                <ChevronDown className="size-3" />
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
              inert={!isOpen}
            >
              <div className="overflow-hidden">
                <div className="border-t border-[#F1F5F9] px-3 pb-3 pt-2">
                  <Link
                    href={category.items[0]?.href || '/productos'}
                    onClick={onClose}
                    className="mb-2 flex items-center justify-between rounded-md bg-[#EFF6FF] px-2.5 py-1.5 text-xs font-bold text-[#2563EB] transition-colors hover:bg-[#DBEAFE]"
                  >
                    <span>Ver todo en {category.label}</span>
                    <ArrowRight className="size-3" />
                  </Link>

                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div key={item.label} className="space-y-1">
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block rounded-md px-1.5 py-1 text-xs font-medium text-[#334155] transition-colors hover:text-[#2563EB]"
                        >
                          {item.label}
                        </Link>

                        {item.subItems && item.subItems.length > 0 && (
                          <div className="flex flex-wrap gap-1 pl-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                onClick={onClose}
                                className="rounded-full border border-[#E2E8F0] bg-white px-2 py-0.5 text-[10px] font-medium text-[#64748B] transition-colors hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Marcas destacadas en Tienda Móvil */}
      <div className="pt-1.5">
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-2.5">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            Marcas destacadas
          </p>
          <div className="flex flex-wrap gap-1">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                onClick={onClose}
                className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1 text-[11px] font-semibold text-[#334155] transition-colors hover:border-[#2563EB]/40 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/productos"
        onClick={onClose}
        className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#1D4ED8]"
      >
        <span>Ver todos los productos</span>
        <ArrowRight className="size-3.5" />
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

function CompactDropdown({ items, onClose }: { items: Array<{ label: string; href: string; desc?: string; variant?: 'general' }>; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  useOnClickOutside(ref, onClose)

  const isItemActive = (href: string) => {
    const [path, hash] = href.split('#')
    if (!pathname || hash) return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div
      ref={ref}
      role="dialog"
      className="absolute left-0 top-[calc(100%+4px)] z-[60] w-80 rounded-xl border border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-2">
        {items.map((item, index) => {
          const active = isItemActive(item.href)
          const isGeneral = item.variant === 'general'
          return (
            <div key={index} className={isGeneral ? 'mt-2 border-t border-[#F1F5F9] pt-2' : undefined}>
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                  isGeneral
                    ? active
                      ? 'bg-[#4C1D95] text-white ring-2 ring-[#5B21B6]/25'
                      : 'bg-[#5B21B6] text-white shadow-[0_8px_20px_-12px_rgba(91,33,182,0.8)] hover:bg-[#4C1D95]'
                    : active
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className={isGeneral ? 'font-bold' : 'font-semibold'}>{item.label}</span>
                  {item.desc && !isGeneral && (
                    <span
                      className={`mt-0.5 block text-xs ${
                        active ? 'text-[#1D4ED8]' : 'text-[#64748B]'
                      }`}
                    >
                      {item.desc}
                    </span>
                  )}
                </span>
                {isGeneral ? (
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                ) : (
                  active && (
                    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                  )
                )}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ActiveIndicator() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-3 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]"
    />
  )
}

// ─── Componente: Search Autocomplete ─────────────────────────────────────────────────────

const RECENT_SEARCHES_KEY = 'fj-recent-searches'
const MAX_RECENT = 5

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecentSearch(term: string) {
  if (typeof window === 'undefined') return
  const recent = getRecentSearches().filter((s) => s !== term)
  recent.unshift(term)
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)))
}

function removeRecentSearch(term: string) {
  if (typeof window === 'undefined') return
  const recent = getRecentSearches().filter((s) => s !== term)
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent))
}

type DropdownType = SiteSearchType | 'recent'

type DropdownItem = {
  id: string
  group: string
  type: DropdownType
  label: string
  sublabel?: string
  href: string
  image?: string
}

const groupIcons: Record<string, React.ElementType> = {
  Recientes: Clock,
  Explorar: Compass,
  Productos: Package,
  Categorías: Tag,
  'Desarrollo de software': Code2,
  Servicios: Wrench,
  Secciones: FileText,
  Legal: Scale,
}

const typeIcons: Record<DropdownType, React.ElementType> = {
  product: Package,
  system: Code2,
  service: Wrench,
  category: Tag,
  page: FileText,
  legal: Scale,
  recent: Clock,
}

function SearchAutocomplete({
  query,
  setQuery,
  onSubmit,
  onNavigate,
  variant = 'desktop',
}: {
  query: string
  setQuery: (q: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onNavigate?: () => void
  variant?: 'desktop' | 'mobile'
}) {
  const router = useRouter()
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Compute suggestions
  const suggestions = useMemo((): DropdownItem[] => {
    const trimmed = query.trim()

    if (!trimmed) {
      // Recent searches + popular categories + quick access to main sections
      const recents: DropdownItem[] = recentSearches.map((term) => ({
        id: `recent-${term}`,
        group: 'Recientes',
        type: 'recent' as const,
        label: term,
        href: `/buscar?q=${encodeURIComponent(term)}`,
      }))

      const popularCategories: DropdownItem[] = catalogCategories.slice(0, 4).map((category) => ({
        id: `quick-category-${category}`,
        group: 'Categorías',
        type: 'category' as const,
        label: category,
        sublabel: 'Categoría del catálogo',
        href: `/productos?categoria=${encodeURIComponent(category)}`,
      }))

      const quickLinks: DropdownItem[] = quickSearchLinks.map((link) => ({
        id: `quick-${link.href}`,
        group: 'Explorar',
        type: 'page' as const,
        label: link.label,
        sublabel: link.description,
        href: link.href,
      }))

      return [...recents, ...popularCategories, ...quickLinks]
    }

    return searchSiteGrouped(trimmed, { perType: 2, maxGroups: 5 }).flatMap((group) =>
      group.items.map((item) => ({
        id: item.id,
        group: group.label,
        type: item.type,
        label: item.title,
        sublabel: item.description,
        href: item.href,
        image: item.image,
      })),
    )
  }, [query, recentSearches])

  const showDropdown = focused && (suggestions.length > 0 || query.trim().length > 0)

  // Reset index when suggestions change
  useEffect(() => {
    setActiveIndex(-1)
  }, [suggestions])

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  const navigate = useCallback(
    (result: DropdownItem) => {
      if (query.trim()) {
        saveRecentSearch(query.trim())
        setRecentSearches(getRecentSearches())
      }
      setFocused(false)
      onNavigate?.()
      router.push(result.href)
    },
    [query, router, onNavigate],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
          break
        case 'Enter':
          if (activeIndex >= 0 && suggestions[activeIndex]) {
            e.preventDefault()
            navigate(suggestions[activeIndex])
          }
          break
        case 'Escape':
          setFocused(false)
          inputRef.current?.blur()
          break
      }
    },
    [showDropdown, activeIndex, suggestions, navigate],
  )

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const items = listRef.current.querySelectorAll('[data-search-item]')
    items[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (query.trim()) {
      saveRecentSearch(query.trim())
      setRecentSearches(getRecentSearches())
    }
    setFocused(false)
    onSubmit(e)
  }

  const handleDeleteRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    removeRecentSearch(term)
    setRecentSearches(getRecentSearches())
  }

  const isDesktop = variant === 'desktop'
  const listboxId = `search-suggestions-${variant}`
  const optionId = (index: number) => `search-item-${variant}-${index}`

  return (
    <div ref={containerRef} className={isDesktop ? 'relative hidden w-full max-w-2xl md:block' : 'relative mb-4'}>
      <form onSubmit={handleSubmit}>
        <span className="sr-only">Buscar en todo el sitio</span>
        <Search
          className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 transition-colors ${
            focused ? 'text-[#2563EB]' : 'text-[#94A3B8]'
          } ${isDesktop ? 'left-3.5' : 'left-3'}`}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos, servicios o soluciones..."
          autoComplete="off"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
          className={`w-full rounded-lg border bg-[#F8FAFC] text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/15 ${
            isDesktop
              ? 'h-11 border-[#E2E8F0] pl-10 pr-28'
              : 'h-11 rounded-xl border-[#E2E8F0] pl-9 pr-[5.75rem] shadow-xs'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Limpiar búsqueda"
            className={`absolute top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#E2E8F0] hover:text-[#475569] ${
              isDesktop ? 'right-20' : 'right-[4.4rem]'
            }`}
          >
            <X className="size-3.5" />
          </button>
        )}
        <button
          type="submit"
          className={`absolute font-bold text-white transition hover:bg-[#1D4ED8] ${
            isDesktop
              ? 'right-1.5 top-1.5 h-8 rounded-lg bg-[#2563EB] px-4 text-xs'
              : 'right-1.5 top-1 h-9 rounded-lg bg-[#2563EB] px-3 text-xs'
          }`}
        >
          Buscar
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          ref={listRef}
          className={`overflow-y-auto overscroll-contain rounded-xl border border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in slide-in-from-top-2 duration-150 ${
            isDesktop
              ? 'absolute left-0 right-0 top-full z-[80] mt-1.5 max-h-[420px]'
              : 'relative z-10 mt-2 max-h-[min(52vh,420px)] shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)]'
          }`}
        >
          {/* Section label */}
          {query.trim() && (
            <div className="flex items-center gap-1.5 border-b border-[#F1F5F9] px-3.5 pb-1.5 pt-3">
              <Sparkles className="size-3 text-[#2563EB]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">Sugerencias</span>
              <span className="ml-auto rounded-full bg-[#EFF6FF] px-1.5 py-0.5 text-[9px] font-bold text-[#2563EB]">
                {suggestions.length}
              </span>
            </div>
          )}

          {query.trim() && suggestions.length === 0 && (
            <div className="px-3.5 pb-3.5 pt-2.5">
              <p className="text-sm font-semibold text-[#0F172A]">
                Sin resultados para &quot;{query.trim()}&quot;
              </p>
              <p className="mt-1 text-xs text-[#64748B]">Prueba con alguna de estas búsquedas:</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-1.5">
            {suggestions.map((result, index) => {
              const GroupIcon = groupIcons[result.group] ?? Search
              const TypeIcon = typeIcons[result.type]
              const showGroupLabel = index === 0 || suggestions[index - 1].group !== result.group

              return (
                <div key={result.id}>
                  {showGroupLabel && (
                    <div className="flex items-center gap-1.5 px-3 pb-1 pt-2.5">
                      <GroupIcon className="size-3 text-[#94A3B8]" aria-hidden="true" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                        {result.group}
                      </span>
                    </div>
                  )}

                  <div
                    id={optionId(index)}
                    data-search-item
                    role="option"
                    tabIndex={-1}
                    aria-selected={activeIndex === index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => navigate(result)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      activeIndex === index ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {/* Icon / image */}
                    {result.type === 'product' && result.image ? (
                      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                        <img
                          src={result.image}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${
                          result.type === 'category' || result.type === 'system'
                            ? 'border-[#DBEAFE] bg-[#EFF6FF] text-[#2563EB]'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
                        }`}
                      >
                        <TypeIcon className="size-3.5" aria-hidden="true" />
                      </div>
                    )}

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${
                        activeIndex === index ? 'text-[#2563EB]' : 'text-[#0F172A]'
                      }`}>
                        {result.label}
                      </p>
                      {result.sublabel && (
                        <p className="mt-0.5 truncate text-[11px] text-[#94A3B8]">
                          {result.sublabel}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {result.type === 'recent' ? (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteRecent(result.label, e)}
                        className="shrink-0 rounded-md p-1 text-[#CBD5E1] transition-colors hover:bg-red-50 hover:text-red-400"
                        aria-label={`Eliminar "${result.label}" de recientes`}
                      >
                        <X className="size-3" />
                      </button>
                    ) : (
                      <ArrowUpRight className={`size-3.5 shrink-0 ${
                        activeIndex === index ? 'text-[#2563EB]' : 'text-[#CBD5E1]'
                      }`} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          {query.trim() && (
            <div className="border-t border-[#F1F5F9] px-3.5 py-2.5">
              <button
                type="button"
                onClick={() => {
                  saveRecentSearch(query.trim())
                  setRecentSearches(getRecentSearches())
                  setFocused(false)
                  onNavigate?.()
                  router.push(`/buscar?q=${encodeURIComponent(query.trim())}`)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#2563EB] transition-colors hover:bg-[#EFF6FF]"
              >
                <Search className="size-3.5" />
                Ver todos los resultados para &quot;{query.trim()}&quot;
                <ArrowRight className="ml-auto size-3.5" />
              </button>
            </div>
          )}

          {/* Keyboard hint */}
          <div className="hidden items-center gap-3 border-t border-[#F1F5F9] px-3.5 py-2 md:flex">
            <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
              <kbd className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 py-0.5 font-mono text-[9px]">↑↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
              <kbd className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 py-0.5 font-mono text-[9px]">Enter</kbd>
              seleccionar
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
              <kbd className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 py-0.5 font-mono text-[9px]">Esc</kbd>
              cerrar
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Componente: Enhanced Header ─────────────────────────────────────────────────────────

export function EnhancedHeader({ quoteCount = 0, onQuoteClick }: EnhancedHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const storeRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const infrastructureRef = useRef<HTMLDivElement>(null)
  const softwareRef = useRef<HTMLDivElement>(null)
  const companyRef = useRef<HTMLDivElement>(null)
  const mobileNavIntent = useRef(false)
  const mobileMenuPushed = useRef(false)
  const mobileMenuOpenedHref = useRef('')

  const closeAll = () => setOpenDropdown(null)

  useOnClickOutside(storeRef, () => { if (openDropdown === 'store') closeAll() })
  useOnClickOutside(servicesRef, () => { if (openDropdown === 'servicios-ti') closeAll() })
  useOnClickOutside(infrastructureRef, () => { if (openDropdown === 'infraestructura-ti') closeAll() })
  useOnClickOutside(softwareRef, () => { if (openDropdown === 'desarrollo-de-software') closeAll() })
  useOnClickOutside(companyRef, () => { if (openDropdown === 'empresa') closeAll() })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAll()
        setMenuOpen(false)
        setOpenMobileSection(null)
      }
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
    setOpenMobileSection(null)
  }, [pathname])

  // El botón "Atrás" del navegador cierra el menú móvil antes de abandonar la página.
  useEffect(() => {
    if (!menuOpen || typeof window === 'undefined') return

    mobileMenuOpenedHref.current = window.location.href
    window.history.pushState({ ...(window.history.state ?? {}), __fjMobileMenu: true }, '')
    mobileMenuPushed.current = true

    const handlePopState = () => {
      mobileMenuPushed.current = false
      setMenuOpen(false)
      setOpenMobileSection(null)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      const shouldRestore =
        mobileMenuPushed.current &&
        !mobileNavIntent.current &&
        window.history.state?.__fjMobileMenu === true &&
        window.location.href === mobileMenuOpenedHref.current
      mobileMenuPushed.current = false
      if (shouldRestore) window.history.back()
    }
  }, [menuOpen])

  const goToQuote = () => {
    if (onQuoteClick) { onQuoteClick(); return }
    router.push('/cotizacion')
  }

  const closeMobileMenu = () => {
    setMenuOpen(false)
    setOpenMobileSection(null)
  }

  const markMobileNavigation = () => {
    mobileNavIntent.current = true
    setMenuOpen(false)
    setOpenMobileSection(null)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      window.setTimeout(() => {
        mobileNavIntent.current = false
      }, 700)
    }
  }

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const term = query.trim()
    if (menuOpen) markMobileNavigation()
    router.push(term ? `/buscar?q=${encodeURIComponent(term)}` : '/productos')
  }

  const isPathActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isActive = (item: { href: string; activeExact?: string[]; activeMatch?: string[] }) =>
    (item.activeExact ?? []).some((path) => pathname === path) ||
    (item.activeMatch ?? [item.href]).some(isPathActive)

  const isAccountActive = isPathActive('/mi-cuenta')
  const isQuotePageActive = isPathActive('/cotizacion')

  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key))
  const toggleMobile = (key: string) => setOpenMobileSection((prev) => (prev === key ? null : key))

  return (
    <>
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${
        scrolled
          ? 'border-b border-slate-200/90 shadow-md shadow-slate-900/5'
          : 'border-b border-[#F1F5F9]'
      }`}
    >
      {/* Primera franja: Logo, enlaces corporativos, buscador, acciones */}
      <div>
        <div className="mx-auto max-w-[1400px] px-3 py-2.5 sm:px-4 sm:py-3 lg:px-8 lg:py-3">
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 sm:gap-3 group"
              aria-label="F&J Systems · Inicio"
              onClick={() => { setMenuOpen(false); closeAll() }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logos/logo.png"
                alt="F&J Systems"
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            {/* Buscador con autocompletado */}
            <div className="hidden min-w-0 flex-1 justify-center md:flex">
              <SearchAutocomplete
                query={query}
                setQuery={setQuery}
                onSubmit={submitSearch}
                onNavigate={closeAll}
                variant="desktop"
              />
            </div>

            {/* Acciones del usuario */}
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/mi-cuenta"
                aria-current={isAccountActive ? 'page' : undefined}
                className={`hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition lg:flex ${
                  isAccountActive
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                }`}
              >
                <UserRound className="size-4" />
                Mi cuenta
              </Link>

              <button
                type="button"
                onClick={goToQuote}
                aria-current={isQuotePageActive ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-2 text-sm font-semibold transition ${
                  isQuotePageActive
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                }`}
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
                onClick={() => (menuOpen ? closeMobileMenu() : setMenuOpen(true))}
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
      <div>
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:block">
            <nav className="flex items-center gap-1 py-3" aria-label="Navegación principal">
            {mainNav.map((link, index) => {
              const active = isActive(link)
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
                        aria-current={active ? 'page' : undefined}
                        className={`relative flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors ${active
                            ? 'text-[#2563EB]'
                            : 'text-[#475569] hover:text-[#2563EB]'
                          }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`size-3.5 transition-transform duration-200 ${openDropdown === 'store' ? 'rotate-180' : ''}`}
                        />
                        {active && <ActiveIndicator />}
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
                        aria-current={active ? 'page' : undefined}
                        className={`relative flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors ${active
                            ? 'text-[#2563EB]'
                            : 'text-[#475569] hover:text-[#2563EB]'
                          }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`size-3.5 transition-transform duration-200 ${openDropdown === dropdownKey ? 'rotate-180' : ''}`}
                        />
                        {active && <ActiveIndicator />}
                      </button>
                      {openDropdown === dropdownKey && (
                        <CompactDropdown items={itemsMap[dropdownKey] || []} onClose={closeAll} />
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex h-10 items-center rounded-lg px-3 text-sm font-semibold transition-colors ${active
                          ? 'text-[#2563EB]'
                          : 'text-[#475569] hover:text-[#2563EB]'
                        }`}
                    >
                      {link.label}
                      {active && <ActiveIndicator />}
                    </Link>
                  )}
                </div>
              )
            })}

            {/* CTA: Solicitar asesoría */}
            <div className="ml-auto">
              <Link
                href="/contacto"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#6D28D9] px-4 py-2 text-sm font-semibold text-white transition hover:from-[#1D4ED8] hover:to-[#5B21B6]"
              >
                <FaTeamspeak aria-hidden="true" className="size-4" />
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
        {/* Backdrop oscuro con blur y fade suave */}
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Drawer lateral con animación fluida */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-[340px] sm:max-w-sm flex-col bg-white shadow-2xl transition-transform animate-in slide-in-from-right duration-250 lg:hidden"
        >
          {/* Cabecera fija */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#F1F5F9] px-4 py-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group"
              aria-label="F&J Systems · Inicio"
              onClick={() => {
                markMobileNavigation()
                closeAll()
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logos/logo.png"
                alt="F&J Systems"
                className="h-11 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#E2E8F0] text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
              aria-label="Cerrar menú"
            >
              <X className="size-4 sm:size-5" />
            </button>
          </div>

          {/* Contenido desplazable */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-4">
            {/* Buscador móvil con autocompletado */}
            <SearchAutocomplete
              query={query}
              setQuery={setQuery}
              onSubmit={submitSearch}
              onNavigate={markMobileNavigation}
              variant="mobile"
            />

            {/* Navegación principal móvil */}
            <nav className="space-y-1.5" aria-label="Navegación móvil">
              {mainNav.map((link, index) => {
                const active = isActive(link)
                const dropdownKey = link.label.toLowerCase().replace(/ /g, '-')
                const isSectionOpen = openMobileSection === dropdownKey

                const getSubmenu = () => {
                  switch (dropdownKey) {
                    case 'servicios-ti':
                      return itServicesMenu
                    case 'infraestructura-ti':
                      return infrastructureMenu
                    case 'desarrollo-de-software':
                      return softwareDevMenu
                    case 'empresa':
                      return companyMenu
                    default:
                      return []
                  }
                }

                return (
                  <div key={index}>
                    {link.hasMegaMenu ? (
                      <MobileAccordion
                        label={link.label}
                        isOpen={openMobileSection === 'store'}
                        onToggle={() => toggleMobile('store')}
                        active={active}
                        badge="Catálogo"
                        icon={Store}
                        count={storeCategories.length}
                      >
                        <MobileStoreMenu onClose={markMobileNavigation} />
                      </MobileAccordion>
                    ) : link.hasMenu ? (
                      <MobileAccordion
                        label={link.label}
                        isOpen={isSectionOpen}
                        onToggle={() => toggleMobile(dropdownKey)}
                        active={active}
                        icon={sectionIcons[dropdownKey]}
                        count={getSubmenu().filter((item) => item.variant !== 'general').length}
                      >
                        <div className="space-y-0.5">
                          {getSubmenu().map((item, itemIdx) => {
                            const isItemActive = isPathActive(item.href)
                            const isGeneral = item.variant === 'general'
                            const ItemIcon = item.icon ? getIcon(item.icon) : null
                            return (
                              <div
                                key={`${item.href}-${itemIdx}`}
                                className={isGeneral ? 'mt-2 border-t border-[#E2E8F0] pt-2' : undefined}
                              >
                                <Link
                                  href={item.href}
                                  onClick={markMobileNavigation}
                                  aria-current={isItemActive ? 'page' : undefined}
                                  className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors ${
                                    isGeneral
                                      ? 'bg-[#5B21B6] text-white shadow-[0_8px_20px_-14px_rgba(91,33,182,0.9)] hover:bg-[#4C1D95]'
                                      : isItemActive
                                        ? 'bg-white text-[#2563EB] shadow-xs ring-1 ring-[#2563EB]/15'
                                        : 'text-[#334155] hover:bg-white hover:text-[#2563EB]'
                                  }`}
                                >
                                  {isGeneral ? (
                                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/15 text-white">
                                      <ArrowRight className="size-3.5" />
                                    </span>
                                  ) : ItemIcon ? (
                                    <span
                                      className={`grid size-8 shrink-0 place-items-center rounded-lg border transition-colors ${
                                        isItemActive
                                          ? 'border-[#2563EB]/25 bg-[#EFF6FF] text-[#2563EB]'
                                          : 'border-[#E2E8F0] bg-white text-[#64748B] group-hover:border-[#2563EB]/25 group-hover:text-[#2563EB]'
                                      }`}
                                    >
                                      <ItemIcon className="size-3.5" />
                                    </span>
                                  ) : null}
                                  <div className="min-w-0 flex-1">
                                    <span
                                      className={`block text-xs font-bold leading-snug tracking-tight ${
                                        isGeneral
                                          ? ''
                                          : isItemActive
                                            ? 'text-[#2563EB]'
                                            : 'text-[#334155] group-hover:text-[#2563EB]'
                                      }`}
                                    >
                                      {item.label}
                                    </span>
                                    {item.desc && !isGeneral && (
                                      <span className="mt-0.5 block text-[11px] leading-snug text-[#64748B] group-hover:text-[#475569]">
                                        {item.desc}
                                      </span>
                                    )}
                                  </div>
                                  {isGeneral ? (
                                    <ArrowRight className="size-3.5 shrink-0" />
                                  ) : isItemActive ? (
                                    <span className="size-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                                  ) : (
                                    <ChevronRight className="size-3.5 shrink-0 text-[#94A3B8] group-hover:text-[#2563EB]" />
                                  )}
                                </Link>
                              </div>
                            )
                          })}
                        </div>
                      </MobileAccordion>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={markMobileNavigation}
                        className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm font-semibold transition-colors ${
                          active
                            ? 'border-[#2563EB]/40 bg-[#EFF6FF] text-[#2563EB]'
                            : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="size-4 text-[#94A3B8]" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Acciones rápidas móvil */}
            <div className="mt-5 space-y-2 border-t border-[#F1F5F9] pt-4">
              <Link
                href="/mi-cuenta"
                onClick={markMobileNavigation}
                aria-current={isAccountActive ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isAccountActive
                    ? 'border-[#2563EB]/40 bg-[#EFF6FF] text-[#2563EB]'
                    : 'border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                }`}
              >
                <div className="grid size-8 place-items-center rounded-lg bg-[#F1F5F9] text-[#64748B]">
                  <UserRound className="size-4" />
                </div>
                <span>Mi cuenta</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  markMobileNavigation()
                  goToQuote()
                }}
                aria-current={isQuotePageActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isQuotePageActive
                    ? 'border-[#2563EB]/40 bg-[#EFF6FF] text-[#2563EB]'
                    : 'border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                    <FileText className="size-4" />
                  </div>
                  <span>Mi cotización</span>
                </div>
                {quoteCount > 0 ? (
                  <span className="grid size-6 place-items-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                    {quoteCount}
                  </span>
                ) : (
                  <span className="text-xs font-normal text-[#94A3B8]">0 items</span>
                )}
              </button>

              <Link
                href="/contacto"
                onClick={markMobileNavigation}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#6D28D9] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:from-[#1D4ED8] hover:to-[#5B21B6]"
              >
                <FaTeamspeak aria-hidden="true" className="size-4" />
                <span>Solicitar asesoría</span>
              </Link>
            </div>

            {/* Contacto móvil */}
            <div className="mt-5 border-t border-[#F1F5F9] pt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Atención directa
              </p>
              <div className="space-y-1.5 text-xs text-[#64748B]">
                <a
                  href="tel:+51999888777"
                  className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                >
                  <Phone className="size-3.5 text-[#2563EB]" />
                  <span>+51 999 888 777</span>
                </a>
                <a
                  href="mailto:ventas@fjsolutions.pe"
                  className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                >
                  <Mail className="size-3.5 text-[#2563EB]" />
                  <span>ventas@fjsolutions.pe</span>
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
