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
  ChevronLeft,
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
  Workflow,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { FaTeamspeak } from 'react-icons/fa6'
import { SiReact } from 'react-icons/si'
import { categories as catalogCategories } from '@/lib/catalog'
import {
  popularSearches,
  quickSearchLinks,
  searchSiteGrouped,
  type SiteSearchType,
} from '@/lib/site-search'
import {
  mainNav,
  itServicesMenu,
  infrastructureMenu,
  softwareDevMenu,
  companyMenu,
  type NavMenuItem,
} from '@/lib/navigation'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { storeUrl } from '@/lib/store-url'

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

// Acceso directo destacado junto a "Desarrollo de software".
const SOFTWARE_QUICK_LINK = '/sistemas/sistemas-web-a-medida'

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
          ? 'border-[#1769AA]/45 bg-card shadow-[0_18px_40px_-32px_rgba(23,105,170,0.65)]'
          : active
          ? 'border-[#1769AA]/30 bg-tint-blue/25'
          : 'border-border bg-card'
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
                ? 'border-[#1769AA] bg-[#1769AA] text-white'
                : active
                ? 'border-[#1769AA]/25 bg-tint-blue text-blue-ink'
                : 'border-border bg-muted text-muted-foreground'
            }`}
          >
            <Icon className="size-4" />
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span
              className={`truncate text-sm font-semibold transition-colors duration-200 ${
                isOpen || active ? 'text-blue-ink' : 'text-foreground'
              }`}
            >
              {label}
            </span>
            {active && !isOpen && <span className="size-1.5 shrink-0 rounded-full bg-[#1769AA]" />}
            {badge && (
              <span className="shrink-0 rounded-full bg-tint-blue px-2 py-0.5 text-[10px] font-bold text-blue-ink">
                {badge}
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
            {isOpen ? 'Toca para cerrar' : `${count ?? 0} opciones`}
          </span>
        </span>

        <span
          className={`grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
            isOpen
              ? 'rotate-180 border-[#1769AA] bg-[#1769AA] text-white'
              : 'border-border bg-card text-muted-foreground'
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
          <div className="border-t border-border bg-muted/70 p-2.5">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Componente: Menú Desplegable Compacto ───────────────────────────────────────────────

function CompactDropdown({
  items,
  onClose,
  className = 'left-0',
}: {
  items: Array<{ label: string; href: string; desc?: string; variant?: 'general' }>
  onClose: () => void
  className?: string
}) {
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
      className={`absolute top-[calc(100%+4px)] z-[60] w-80 rounded-xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}
    >
      <div className="p-2">
        {items.map((item, index) => {
          const active = isItemActive(item.href)
          const isGeneral = item.variant === 'general'
          return (
            <div key={index} className={isGeneral ? 'mt-2 border-t border-border pt-2' : undefined}>
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                  isGeneral
                    ? active
                      ? 'bg-[#12568C] text-white ring-2 ring-[#1769AA]/25'
                      : 'bg-[#1769AA] text-white shadow-[0_8px_20px_-12px_rgba(23,105,170,0.8)] hover:bg-[#12568C]'
                    : active
                      ? 'bg-tint-blue text-blue-ink'
                      : 'text-foreground hover:bg-muted hover:text-blue-ink'
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className={isGeneral ? 'font-bold' : 'font-semibold'}>{item.label}</span>
                  {item.desc && !isGeneral && (
                    <span
                      className={`mt-0.5 block text-xs ${
                        active ? 'text-blue-ink' : 'text-muted-foreground'
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
                    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#1769AA]" />
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

// ─── Componente: Mega menú con vista previa ──────────────────────────────────────────────

const previewPalettes = [
  'from-[#0B3A63] via-[#12568C] to-[#1769AA]',
  'from-[#0A3C52] via-[#0F6E8C] to-[#00B8D9]',
  'from-[#102A43] via-[#1769AA] to-[#00B8D9]',
  'from-[#0E2A52] via-[#12568C] to-[#1769AA]',
  'from-[#0A3350] via-[#177A9B] to-[#00B8D9]',
  'from-[#111C3F] via-[#1B4F82] to-[#1769AA]',
]

function MegaDropdown({
  items,
  sectionLabel,
  onClose,
  className = 'left-0',
}: {
  items: NavMenuItem[]
  sectionLabel: string
  onClose: () => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  useOnClickOutside(ref, onClose)

  const isItemActive = (href: string) => {
    const [path, hash] = href.split('#')
    if (!pathname || hash) return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const options = items.filter((item) => item.variant !== 'general')
  const general = items.find((item) => item.variant === 'general')
  const [activeIndex, setActiveIndex] = useState(() => {
    const current = options.findIndex((item) => isItemActive(item.href))
    return current >= 0 ? current : 0
  })

  if (options.length === 0) return null

  const total = options.length
  const preview = options[Math.min(activeIndex, total - 1)]
  const PreviewIcon = preview.icon ? getIcon(preview.icon) : MousePointer2
  const palette = previewPalettes[activeIndex % previewPalettes.length]
  const goTo = (index: number) => setActiveIndex(((index % total) + total) % total)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={sectionLabel}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
      className={`absolute top-[calc(100%+6px)] z-[60] w-[720px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-3 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] animate-in fade-in slide-in-from-top-2 duration-200 xl:w-[880px] ${className}`}
    >
      <div className="flex items-stretch gap-3">
        {/* Opciones en dos filas de tres */}
        <div className="grid flex-1 auto-rows-fr grid-cols-3 gap-1.5">
          {options.map((item, index) => {
            const active = isItemActive(item.href)
            const selected = index === activeIndex
            const Icon = item.icon ? getIcon(item.icon) : MousePointer2
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                aria-current={active ? 'page' : undefined}
                className={`group relative flex h-full flex-col justify-center gap-2 rounded-xl border p-2.5 transition-colors duration-150 ${
                  selected
                    ? 'border-[#1769AA]/35 bg-tint-blue/50'
                    : 'border-transparent hover:border-border hover:bg-muted/70'
                }`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-lg border transition-colors duration-150 ${
                    selected
                      ? 'border-[#1769AA]/25 bg-card text-[#1769AA]'
                      : 'border-border bg-muted text-muted-foreground group-hover:text-blue-ink'
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <span
                  className={`text-[12.5px] font-semibold leading-snug ${
                    selected ? 'text-blue-ink' : 'text-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[#1769AA]"
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Minicarrusel de vista previa + enlace general */}
        <div className="flex w-[264px] shrink-0 flex-col gap-2 xl:w-[296px]">
          <div className="relative flex min-h-[212px] flex-1 flex-col justify-between overflow-hidden rounded-xl p-3.5 text-white">
            <div
              aria-hidden="true"
              className={`absolute inset-0 bg-gradient-to-br ${palette}`}
            />
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-10 size-36 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-12 -left-6 size-32 rounded-full bg-black/20 blur-2xl"
            />

            <div
              key={activeIndex}
              className="relative flex flex-1 animate-in fade-in flex-col duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">
                  {sectionLabel}
                </span>
                <span className="text-[10px] font-semibold tabular-nums text-white/70">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>

              <span className="mt-3 grid size-11 place-items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                <PreviewIcon aria-hidden="true" className="size-5" />
              </span>

              <p className="mt-2.5 text-sm font-bold leading-snug">{preview.label}</p>
              {preview.desc && (
                <p className="mt-1 text-[11px] leading-snug text-white/75">{preview.desc}</p>
              )}
            </div>

            <div className="relative mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {options.map((item, index) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Ver ${item.label}`}
                    aria-pressed={index === activeIndex}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      index === activeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Opción anterior"
                  className="grid size-6 place-items-center rounded-full border border-white/25 bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <ChevronLeft aria-hidden="true" className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Opción siguiente"
                  className="grid size-6 place-items-center rounded-full border border-white/25 bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <ChevronRight aria-hidden="true" className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {general && (
            <Link
              href={general.href}
              onClick={onClose}
              aria-current={isItemActive(general.href) ? 'page' : undefined}
              className={`flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold text-white transition-colors ${
                isItemActive(general.href)
                  ? 'bg-[#12568C] ring-2 ring-[#1769AA]/30'
                  : 'bg-[#1769AA] shadow-[0_8px_20px_-12px_rgba(23,105,170,0.8)] hover:bg-[#12568C]'
              }`}
            >
              {general.label}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function ActiveIndicator() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-3 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#1769AA] via-[#1769AA] to-[#1769AA]"
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
  Categorías: Tag,
  'Desarrollo de software': Code2,
  Servicios: Wrench,
  Secciones: FileText,
  Legal: Scale,
}

const typeIcons: Record<DropdownType, React.ElementType> = {
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
        sublabel: 'Categoría de la tienda',
        href: storeUrl(`/productos?categoria=${encodeURIComponent(category)}`),
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
            focused ? 'text-blue-ink' : 'text-muted-foreground'
          } ${isDesktop ? 'left-3.5' : 'left-3'}`}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar servicios, soluciones o secciones..."
          autoComplete="off"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
          className={`w-full rounded-lg border bg-muted text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#1769AA] focus:bg-card focus:ring-2 focus:ring-[#1769AA]/15 ${
            isDesktop
              ? 'h-11 border-border pl-10 pr-28'
              : 'h-11 rounded-xl border-border pl-9 pr-[5.75rem] shadow-xs'
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
            className={`absolute top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-border hover:text-muted-foreground ${
              isDesktop ? 'right-20' : 'right-[4.4rem]'
            }`}
          >
            <X className="size-3.5" />
          </button>
        )}
        <button
          type="submit"
          className={`absolute font-bold text-white transition hover:bg-[#12568C] ${
            isDesktop
              ? 'right-1.5 top-1.5 h-8 rounded-lg bg-[#1769AA] px-4 text-xs'
              : 'right-1.5 top-1 h-9 rounded-lg bg-[#1769AA] px-3 text-xs'
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
          className={`overflow-y-auto overscroll-contain rounded-xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in slide-in-from-top-2 duration-150 ${
            isDesktop
              ? 'absolute left-0 right-0 top-full z-[80] mt-1.5 max-h-[420px]'
              : 'relative z-10 mt-2 max-h-[min(52vh,420px)] shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)]'
          }`}
        >
          {/* Section label */}
          {query.trim() && (
            <div className="flex items-center gap-1.5 border-b border-border px-3.5 pb-1.5 pt-3">
              <Sparkles className="size-3 text-blue-ink" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Sugerencias</span>
              <span className="ml-auto rounded-full bg-tint-blue px-1.5 py-0.5 text-[9px] font-bold text-blue-ink">
                {suggestions.length}
              </span>
            </div>
          )}

          {query.trim() && suggestions.length === 0 && (
            <div className="px-3.5 pb-3.5 pt-2.5">
              <p className="text-sm font-semibold text-foreground">
                Sin resultados para &quot;{query.trim()}&quot;
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Prueba con alguna de estas búsquedas:</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition hover:border-[#1769AA]/40 hover:text-blue-ink"
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
                      <GroupIcon className="size-3 text-muted-foreground" aria-hidden="true" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
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
                      activeIndex === index ? 'bg-tint-blue' : 'hover:bg-muted'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${
                        result.type === 'category' || result.type === 'system'
                          ? 'border-blue-ink/25 bg-tint-blue text-blue-ink'
                          : 'border-border bg-muted text-muted-foreground'
                      }`}
                    >
                      <TypeIcon className="size-3.5" aria-hidden="true" />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${
                        activeIndex === index ? 'text-blue-ink' : 'text-foreground'
                      }`}>
                        {result.label}
                      </p>
                      {result.sublabel && (
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {result.sublabel}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {result.type === 'recent' ? (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteRecent(result.label, e)}
                        className="shrink-0 rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Eliminar "${result.label}" de recientes`}
                      >
                        <X className="size-3" />
                      </button>
                    ) : (
                      <ArrowUpRight className={`size-3.5 shrink-0 ${
                        activeIndex === index ? 'text-blue-ink' : 'text-muted-foreground/60'
                      }`} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          {query.trim() && (
            <div className="border-t border-border px-3.5 py-2.5">
              <button
                type="button"
                onClick={() => {
                  saveRecentSearch(query.trim())
                  setRecentSearches(getRecentSearches())
                  setFocused(false)
                  onNavigate?.()
                  router.push(`/buscar?q=${encodeURIComponent(query.trim())}`)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-ink transition-colors hover:bg-tint-blue"
              >
                <Search className="size-3.5" />
                Ver todos los resultados para &quot;{query.trim()}&quot;
                <ArrowRight className="ml-auto size-3.5" />
              </button>
            </div>
          )}

          {/* Keyboard hint */}
          <div className="hidden items-center gap-3 border-t border-border px-3.5 py-2 md:flex">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[9px]">↑↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[9px]">Enter</kbd>
              seleccionar
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[9px]">Esc</kbd>
              cerrar
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Componente: Aviso de redirección a la tienda ────────────────────────────────────────

function StoreRedirectDialog({ onClose }: { onClose: () => void }) {
  const storeHref = storeUrl('/productos')
  const storeHost = useMemo(() => {
    try {
      return new URL(storeHref).host
    } catch {
      return 'SparkTree Store'
    }
  }, [storeHref])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-redirect-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar aviso"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="px-6 pb-5 pt-6">
          <span className="mb-4 grid size-12 place-items-center rounded-xl border border-[#1769AA]/25 bg-tint-blue text-blue-ink">
            <Store className="size-6" />
          </span>
          <h2 id="store-redirect-title" className="text-lg font-bold text-foreground">
            Te llevamos a SparkTree Store
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Vas a salir de SparkTree Systems para entrar a nuestra tienda oficial de hardware y
            equipamiento TI, donde podrás comparar precios, stock y cotizar productos.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <Store className="size-3.5 shrink-0 text-blue-ink" />
            <span className="truncate font-medium text-foreground">{storeHost}</span>
            <span>· tienda oficial</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border bg-muted/40 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="order-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:order-1"
          >
            Seguir aquí
          </button>
          <a
            href={storeHref}
            autoFocus
            className="order-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1769AA] to-[#12568C] px-4 py-2.5 text-sm font-semibold text-white transition hover:from-[#12568C] hover:to-[#1769AA] sm:order-2"
          >
            Ir a la tienda
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Componente: Enhanced Header ─────────────────────────────────────────────────────────

export function EnhancedHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  const [redirectOpen, setRedirectOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const servicesRef = useRef<HTMLDivElement>(null)
  const infrastructureRef = useRef<HTMLDivElement>(null)
  const softwareRef = useRef<HTMLDivElement>(null)
  const companyRef = useRef<HTMLDivElement>(null)
  const mobileNavIntent = useRef(false)
  const mobileMenuPushed = useRef(false)
  const mobileMenuOpenedHref = useRef('')

  const closeAll = () => setOpenDropdown(null)

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
        setRedirectOpen(false)
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
    if (!term) {
      window.location.href = storeUrl('/productos')
      return
    }
    router.push(`/buscar?q=${encodeURIComponent(term)}`)
  }

  const isPathActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isActive = (item: { href: string; activeExact?: string[]; activeMatch?: string[] }) =>
    (item.activeExact ?? []).some((path) => pathname === path) ||
    (item.activeMatch ?? [item.href]).some(isPathActive)

  const isExternalHref = (href: string) => /^https?:\/\//.test(href)

  const openStoreRedirect = () => {
    setMenuOpen(false)
    setOpenMobileSection(null)
    setRedirectOpen(true)
  }

  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key))
  const toggleMobile = (key: string) => setOpenMobileSection((prev) => (prev === key ? null : key))

  return (
    <>
    <header
      className={`sticky top-0 z-50 w-full bg-card transition-all duration-200 ${
        scrolled
          ? 'border-b border-border/90 shadow-md shadow-slate-900/5'
          : 'border-b border-border'
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
              aria-label="SparkTree Systems · Inicio"
              onClick={() => { setMenuOpen(false); closeAll() }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/sparktree-horizontal.png"
                alt="SparkTree Systems"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 brightness-0 dark:brightness-100"
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
              <ThemeToggle />

              <button
                type="button"
                onClick={() => (menuOpen ? closeMobileMenu() : setMenuOpen(true))}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={menuOpen}
                className="grid size-9 sm:size-10 place-items-center rounded-lg border border-border text-muted-foreground transition hover:border-[#1769AA]/30 hover:bg-muted hover:text-blue-ink lg:hidden"
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
              const isSoftware = dropdownKey === 'desarrollo-de-software'
              const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
                'servicios-ti': servicesRef,
                'infraestructura-ti': infrastructureRef,
                'desarrollo-de-software': softwareRef,
                empresa: companyRef,
              }
              const itemsMap: Record<string, NavMenuItem[]> = {
                'servicios-ti': itServicesMenu,
                'infraestructura-ti': infrastructureMenu,
                'desarrollo-de-software': softwareDevMenu,
                empresa: companyMenu,
              }
              const usesMegaMenu = dropdownKey !== 'empresa'
              const megaAlign =
                dropdownKey === 'desarrollo-de-software' ? 'left-1/2 -translate-x-1/2' : 'left-0'

              return (
                <div key={index} className="relative" ref={refMap[dropdownKey]}>
                  {link.hasMenu ? (
                    <>
                      <div className="flex items-center">
                        {isSoftware && (
                          <Link
                            href={SOFTWARE_QUICK_LINK}
                            aria-label="Sistemas web a medida"
                            title="Sistemas web a medida"
                            aria-current={isPathActive(SOFTWARE_QUICK_LINK) ? 'page' : undefined}
                            className="group/react mr-0.5 grid size-7 place-items-center rounded-lg text-[#61DAFB] transition-colors hover:bg-muted"
                          >
                            <SiReact
                              aria-hidden="true"
                              className="size-[18px] transition-transform duration-500 group-hover/react:rotate-180"
                            />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => toggle(dropdownKey)}
                          aria-expanded={openDropdown === dropdownKey}
                          aria-haspopup="dialog"
                          aria-current={active ? 'page' : undefined}
                          className={`relative flex h-10 items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors ${isSoftware ? 'pl-1 pr-3' : 'px-3'} ${active
                              ? 'text-blue-ink'
                              : 'text-muted-foreground hover:text-blue-ink'
                            }`}
                        >
                          {link.label}
                          <ChevronDown
                            className={`size-3.5 transition-transform duration-200 ${openDropdown === dropdownKey ? 'rotate-180' : ''}`}
                          />
                          {active && <ActiveIndicator />}
                        </button>
                      </div>
                      {openDropdown === dropdownKey &&
                        (usesMegaMenu ? (
                          <MegaDropdown
                            items={itemsMap[dropdownKey] || []}
                            sectionLabel={link.label}
                            onClose={closeAll}
                            className={megaAlign}
                          />
                        ) : (
                          <CompactDropdown items={itemsMap[dropdownKey] || []} onClose={closeAll} />
                        ))}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={(event) => {
                        if (!isExternalHref(link.href)) return
                        event.preventDefault()
                        openStoreRedirect()
                      }}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex h-10 items-center rounded-lg px-3 text-sm font-semibold transition-colors ${active
                          ? 'text-blue-ink'
                          : 'text-muted-foreground hover:text-blue-ink'
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
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1769AA] to-[#12568C] px-4 py-2 text-sm font-semibold text-white transition hover:from-[#12568C] hover:to-[#1769AA]"
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
          className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-[340px] sm:max-w-sm flex-col bg-card shadow-2xl transition-transform animate-in slide-in-from-right duration-250 lg:hidden"
        >
          {/* Cabecera fija */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group"
              aria-label="SparkTree Systems · Inicio"
              onClick={() => {
                markMobileNavigation()
                closeAll()
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/sparktree-horizontal.png"
                alt="SparkTree Systems"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 brightness-0 dark:brightness-100"
              />
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-blue-ink"
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
                const isSoftware = dropdownKey === 'desarrollo-de-software'
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
                  <div key={index} className={isSoftware ? 'flex items-start gap-2' : undefined}>
                    {isSoftware && (
                      <Link
                        href={SOFTWARE_QUICK_LINK}
                        onClick={markMobileNavigation}
                        aria-label="Sistemas web a medida"
                        title="Sistemas web a medida"
                        aria-current={isPathActive(SOFTWARE_QUICK_LINK) ? 'page' : undefined}
                        className="mt-1 flex size-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl border border-border bg-card text-[#61DAFB] transition-colors hover:border-[#1769AA]/30 hover:bg-muted"
                      >
                        <SiReact aria-hidden="true" className="size-5" />
                        <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                          React
                        </span>
                      </Link>
                    )}
                    <div className="min-w-0 flex-1">
                    {link.hasMenu ? (
                      <MobileAccordion
                        label={link.label}
                        isOpen={isSectionOpen}
                        onToggle={() => toggleMobile(dropdownKey)}
                        active={active}
                        icon={isSoftware ? undefined : sectionIcons[dropdownKey]}
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
                                className={isGeneral ? 'mt-2 border-t border-border pt-2' : undefined}
                              >
                                <Link
                                  href={item.href}
                                  onClick={markMobileNavigation}
                                  aria-current={isItemActive ? 'page' : undefined}
                                  className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors ${
                                    isGeneral
                                      ? 'bg-[#1769AA] text-white shadow-[0_8px_20px_-14px_rgba(23,105,170,0.9)] hover:bg-[#12568C]'
                                      : isItemActive
                                        ? 'bg-card text-blue-ink shadow-xs ring-1 ring-[#1769AA]/15'
                                        : 'text-foreground/85 hover:bg-card hover:text-blue-ink'
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
                                          ? 'border-[#1769AA]/25 bg-tint-blue text-blue-ink'
                                          : 'border-border bg-card text-muted-foreground group-hover:border-[#1769AA]/25 group-hover:text-blue-ink'
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
                                            ? 'text-blue-ink'
                                            : 'text-foreground/85 group-hover:text-blue-ink'
                                      }`}
                                    >
                                      {item.label}
                                    </span>
                                    {item.desc && !isGeneral && (
                                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground group-hover:text-muted-foreground">
                                        {item.desc}
                                      </span>
                                    )}
                                  </div>
                                  {isGeneral ? (
                                    <ArrowRight className="size-3.5 shrink-0" />
                                  ) : isItemActive ? (
                                    <span className="size-1.5 shrink-0 rounded-full bg-[#1769AA]" />
                                  ) : (
                                    <ChevronRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-blue-ink" />
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
                        onClick={(event) => {
                          if (isExternalHref(link.href)) {
                            event.preventDefault()
                            openStoreRedirect()
                            return
                          }
                          markMobileNavigation()
                        }}
                        className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm font-semibold transition-colors ${
                          active
                            ? 'border-[#1769AA]/40 bg-tint-blue text-blue-ink'
                            : 'border-border bg-card text-foreground hover:bg-muted hover:text-blue-ink'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </Link>
                    )}
                    </div>
                  </div>
                )
              })}
            </nav>

            {/* Acciones rápidas móvil */}
            <div className="mt-5 space-y-2 border-t border-border pt-4">
              <Link
                href="/contacto"
                onClick={markMobileNavigation}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1769AA] to-[#12568C] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:from-[#12568C] hover:to-[#1769AA]"
              >
                <FaTeamspeak aria-hidden="true" className="size-4" />
                <span>Solicitar asesoría</span>
              </Link>
            </div>

            {/* Contacto móvil */}
            <div className="mt-5 border-t border-border pt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Atención directa
              </p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <a
                  href="tel:+51999888777"
                  className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted hover:text-blue-ink"
                >
                  <Phone className="size-3.5 text-blue-ink" />
                  <span>+51 999 888 777</span>
                </a>
                <a
                  href="mailto:ventas@fjsolutions.pe"
                  className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted hover:text-blue-ink"
                >
                  <Mail className="size-3.5 text-blue-ink" />
                  <span>ventas@fjsolutions.pe</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    )}

    {redirectOpen && <StoreRedirectDialog onClose={() => setRedirectOpen(false)} />}
    </>
  )
}
