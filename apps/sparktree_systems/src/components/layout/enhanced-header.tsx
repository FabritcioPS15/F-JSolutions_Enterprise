'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
  Home,
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
  inicio: Home,
  tienda: Store,
  store: Store,
  'servicios-ti': Headset,
  'infraestructura-ti': Network,
  'desarrollo-de-software': Code2,
  empresa: Compass,
}

// Bloque de medios del menú móvil: reemplaza image/video/href por el contenido definitivo.
const mobileMenuMedia: {
  href: string
  image: string
  video?: string
  eyebrow: string
  title: string
  description: string
} = {
  href: '/sistemas',
  image: '/images/heroes/sistemas-web-a-medida.webp',
  eyebrow: 'Recurso destacado',
  title: 'Sistemas web a la medida',
  description: 'Conoce cómo diseñamos software que se adapta a tu operación.',
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
      className={`relative overflow-hidden rounded-2xl transition-colors duration-300 ${
        isOpen ? 'bg-[#F1F6FA]/70' : active ? 'bg-tint-blue/20' : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-muted/50"
      >
        {Icon && (
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
              isOpen
                ? 'bg-[#1769AA] text-white'
                : active
                ? 'bg-tint-blue text-blue-ink'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Icon className="size-4" />
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span
              className={`text-base font-bold leading-tight transition-colors duration-200 ${
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
          <span className="mt-0.5 block truncate text-[10.5px] font-medium text-muted-foreground">
            {isOpen ? 'Toca para cerrar' : `${count ?? 0} opciones`}
          </span>
        </span>

        <span
          className={`grid size-7 shrink-0 place-items-center rounded-full transition-all duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isOpen
              ? 'rotate-180 bg-[#1769AA] text-white'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <ChevronDown className="size-3.5" />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        inert={!isOpen}
      >
        <div className="overflow-hidden">
          <div
            className={`bg-[#F1F6FA]/80 p-2 transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isOpen ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
            }`}
          >
            {children}
          </div>
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
      className={`absolute top-[calc(100%+4px)] z-[60] w-80 rounded-xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in duration-100 ${className}`}
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
}: {
  items: NavMenuItem[]
  sectionLabel: string
  onClose: () => void
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
  const [placement, setPlacement] = useState<{ left: number; top: number; caret: number } | null>(
    null,
  )

  // Ancla el panel al botón del menú y lo mantiene dentro de la pantalla.
  useLayoutEffect(() => {
    const update = () => {
      const panel = ref.current
      const anchor = panel?.parentElement?.getBoundingClientRect()
      if (!panel || !anchor) return
      const header = document.querySelector('header')?.getBoundingClientRect()
      const width = panel.offsetWidth
      const margin = 16
      const triggerCenter = anchor.left + anchor.width / 2
      const left = Math.min(Math.max(anchor.left, margin), window.innerWidth - width - margin)
      setPlacement({
        left,
        top: (header?.bottom ?? anchor.bottom) + 8,
        caret: Math.min(Math.max(triggerCenter - left, 22), width - 22),
      })
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (options.length === 0) return null

  const total = options.length
  const gridColumns = total === 4 ? 'grid-cols-2' : 'grid-cols-3'
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
      style={{
        left: placement?.left ?? 0,
        top: placement?.top ?? 0,
        visibility: placement ? 'visible' : 'hidden',
      }}
      className="fixed z-[60] w-[720px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/80 bg-card p-3.5 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5 animate-in fade-in duration-100 xl:w-[880px]"
    >
      <span
        aria-hidden="true"
        className="absolute -top-2 size-4 rotate-45 rounded-[3px] border-l border-t border-border/80 bg-card shadow-[-3px_-3px_8px_-4px_rgba(15,23,42,0.18)]"
        style={{ left: (placement?.caret ?? 22) - 8 }}
      />

      <div className="flex items-stretch gap-3">
        {/* Opciones en dos filas de tres */}
        <div className={`grid flex-1 auto-rows-fr gap-2 ${gridColumns}`}>
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
                className={`group relative flex h-full flex-col gap-1.5 rounded-xl border p-3 transition-all duration-150 ${
                  selected
                    ? 'border-[#1769AA]/30 bg-tint-blue/45 shadow-[0_10px_24px_-20px_rgba(23,105,170,0.6)]'
                    : 'border-transparent hover:border-border hover:bg-muted/60'
                }`}
              >
                <span
                  className={`grid size-9 place-items-center rounded-xl border transition-colors duration-150 ${
                    selected
                      ? 'border-[#1769AA]/25 bg-card text-[#1769AA]'
                      : 'border-border bg-muted text-muted-foreground group-hover:border-[#1769AA]/20 group-hover:text-blue-ink'
                  }`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span
                  className={`text-[12.5px] font-semibold leading-snug ${
                    selected ? 'text-blue-ink' : 'text-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {item.desc && (
                  <span className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                    {item.desc}
                  </span>
                )}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 size-1.5 rounded-full bg-[#1769AA]"
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Minicarrusel de vista previa + enlace general */}
        <div className="flex w-[272px] shrink-0 flex-col gap-2.5 xl:w-[304px]">
          <div className="relative flex min-h-[224px] flex-1 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white ring-1 ring-inset ring-white/10">
            <div
              aria-hidden="true"
              className={`absolute inset-0 bg-gradient-to-br ${palette}`}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.09] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:14px_14px]"
            />
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-10 size-36 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-12 -left-6 size-32 rounded-full bg-black/25 blur-2xl"
            />

            <div className="relative flex flex-1 flex-col">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/85">
                  {sectionLabel}
                </span>
                <span className="text-[10px] font-semibold tabular-nums text-white/70">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>

              <span className="mt-3.5 grid size-12 place-items-center rounded-2xl border border-white/25 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm">
                <PreviewIcon aria-hidden="true" className="size-[22px]" />
              </span>

              <p className="mt-3 text-[15px] font-bold leading-snug">{preview.label}</p>
              {preview.desc && (
                <p className="mt-1 text-[11.5px] leading-relaxed text-white/80">{preview.desc}</p>
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
                      index === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Opción anterior"
                  className="grid size-7 place-items-center rounded-full border border-white/25 bg-white/10 text-white/85 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Opción siguiente"
                  className="grid size-7 place-items-center rounded-full border border-white/25 bg-white/10 text-white/85 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {general && (
            <Link
              href={general.href}
              onClick={onClose}
              aria-current={isItemActive(general.href) ? 'page' : undefined}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold text-white transition-all ${
                isItemActive(general.href)
                  ? 'bg-[#12568C] ring-2 ring-[#1769AA]/30'
                  : 'bg-gradient-to-r from-[#1769AA] to-[#12568C] shadow-[0_10px_22px_-14px_rgba(23,105,170,0.9)] hover:from-[#12568C] hover:to-[#1769AA]'
              }`}
            >
              {general.label}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function ActiveIndicator({ onDark = false }: { onDark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-3 bottom-0.5 h-[2px] rounded-full ${onDark
        ? 'bg-gradient-to-r from-[#00B8D9] to-[#7FD8E8]'
        : 'bg-gradient-to-r from-[#1769AA] via-[#1769AA] to-[#1769AA]'
        }`}
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
          placeholder={isDesktop ? 'Buscar servicios, soluciones o secciones...' : 'Buscar en SparkTree...'}
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
          className={`overflow-y-auto overscroll-contain rounded-xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-in fade-in slide-in-from-top-1 duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none ${
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
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-[220ms] ease-out motion-reduce:animate-none"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-redirect-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-[97%] slide-in-from-bottom-1 duration-[240ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none"
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
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#102A43] shadow-lg shadow-slate-950/20'
          : 'border-b border-border bg-card'
      }`}
    >
      <div className="mx-auto flex h-[calc(var(--site-header-height)-1px)] max-w-[1400px] items-center gap-3 px-3 sm:px-4 lg:px-8 xl:gap-5">
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
              className={`h-12 w-auto object-contain transition-[transform,filter] duration-300 group-hover:scale-105 ${scrolled ? 'brightness-0 invert' : 'brightness-0 dark:brightness-100'
                }`}
            />
          </Link>

          {/* Navegación principal (escritorio) */}
          <div className="hidden min-w-0 flex-1 lg:block">
            <nav className="flex items-center" aria-label="Navegación principal">
            <div className="flex flex-1 items-center justify-center gap-0.5 xl:gap-1">
            {mainNav.map((link, index) => {
              const active = isActive(link)
              const itemTone = scrolled
                ? active
                  ? 'text-white'
                  : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                : active
                  ? 'text-blue-ink'
                  : 'text-muted-foreground hover:text-blue-ink'
              const dropdownKey = link.label.toLowerCase().replace(/ /g, '-')
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

              return (
                <div key={index} className="relative" ref={refMap[dropdownKey]}>
                  {link.hasMenu ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggle(dropdownKey)}
                        aria-expanded={openDropdown === dropdownKey}
                        aria-haspopup="dialog"
                        aria-current={active ? 'page' : undefined}
                        className={`relative flex h-11 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-[13px] font-semibold transition-colors xl:px-3 xl:text-sm ${itemTone}`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`size-3.5 transition-transform duration-200 ${openDropdown === dropdownKey ? 'rotate-180' : ''}`}
                        />
                        {active && <ActiveIndicator onDark={scrolled} />}
                      </button>
                      {openDropdown === dropdownKey &&
                        (usesMegaMenu ? (
                          <MegaDropdown
                            items={itemsMap[dropdownKey] || []}
                            sectionLabel={link.label}
                            onClose={closeAll}
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
                      className={`relative flex h-11 items-center gap-1 whitespace-nowrap rounded-lg px-2 text-[13px] font-semibold transition-colors xl:px-3 xl:text-sm ${itemTone}`}
                    >
                      {link.label}
                      {isExternalHref(link.href) && (
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      )}
                      {active && <ActiveIndicator onDark={scrolled} />}
                    </Link>
                  )}
                </div>
              )
            })}
            </div>

            {/* CTA: Asesoría */}
            <div className="shrink-0">
              <Link
                href="/contacto"
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2.5 text-[13px] font-semibold transition-colors xl:px-4 xl:text-sm ${scrolled
                  ? 'bg-white text-[#12568C] hover:bg-[#DCEEFB]'
                  : 'bg-gradient-to-r from-[#1769AA] to-[#12568C] text-white hover:from-[#12568C] hover:to-[#1769AA]'
                  }`}
              >
                <FaTeamspeak aria-hidden="true" className="size-4" />
                <span>Asesoría</span>
              </Link>
            </div>
            </nav>
          </div>

          {/* Botón de menú móvil */}
          <button
            type="button"
            onClick={() => (menuOpen ? closeMobileMenu() : setMenuOpen(true))}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className={`ml-auto grid size-11 place-items-center rounded-xl border transition-colors lg:hidden ${scrolled
              ? 'border-white/20 text-white hover:bg-white/10'
              : 'border-border text-muted-foreground hover:border-[#1769AA]/30 hover:bg-muted hover:text-blue-ink'
              }`}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
      </div>
    </header>

    {/* Menú móvil */}
    {menuOpen && (
      <>
        {/* Backdrop oscuro con blur y fade suave */}
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-[240ms] ease-out motion-reduce:animate-none lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Drawer lateral con animación fluida */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-[110] flex flex-col overflow-hidden bg-card animate-in slide-in-from-right duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none lg:hidden"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-[#1769AA] via-[#00B8D9] to-[#1769AA]"
          />

          {/* Cabecera fija */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/70 px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)]">
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
                className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105 brightness-0 dark:brightness-100"
              />
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-muted/50 text-muted-foreground transition-colors hover:border-[#1769AA]/30 hover:bg-muted hover:text-blue-ink"
              aria-label="Cerrar menú"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Contenido desplazable */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-4 sm:px-6">
            <div className="mx-auto w-full max-w-lg">
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
                    {link.hasMenu ? (
                      <MobileAccordion
                        label={link.label}
                        isOpen={isSectionOpen}
                        onToggle={() => toggleMobile(dropdownKey)}
                        active={active}
                        icon={sectionIcons[dropdownKey]}
                        count={getSubmenu().filter((item) => item.variant !== 'general').length}
                      >
                        <div className="space-y-1.5">
                          {getSubmenu().map((item, itemIdx) => {
                            const isItemActive = isPathActive(item.href)
                            const isGeneral = item.variant === 'general'
                            const ItemIcon = item.icon ? getIcon(item.icon) : null
                            return (
                              <div
                                key={`${item.href}-${itemIdx}`}
                                className={`${isGeneral ? 'mt-3' : ''} ${
                                  isSectionOpen
                                    ? 'animate-in fade-in slide-in-from-top-1 fill-mode-both duration-[220ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none'
                                    : ''
                                }`}
                                style={{ animationDelay: isSectionOpen ? `${Math.min(itemIdx, 7) * 22}ms` : undefined }}
                              >
                                <Link
                                  href={item.href}
                                  onClick={markMobileNavigation}
                                  aria-current={isItemActive ? 'page' : undefined}
                                  className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors ${
                                    isGeneral
                                      ? 'bg-[#1769AA] text-white shadow-[0_8px_20px_-14px_rgba(23,105,170,0.9)] hover:bg-[#12568C]'
                                      : isItemActive
                                        ? 'bg-tint-blue/70 text-blue-ink'
                                        : 'text-foreground/85 hover:bg-card hover:text-blue-ink'
                                  }`}
                                >
                                  {isGeneral ? (
                                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/15 text-white">
                                      <ArrowRight className="size-3.5" />
                                    </span>
                                  ) : ItemIcon ? (
                                    <span
                                      className={`grid size-8 shrink-0 place-items-center rounded-lg transition-colors ${
                                        isItemActive
                                          ? 'bg-card text-blue-ink'
                                          : 'bg-card text-muted-foreground group-hover:text-blue-ink'
                                      }`}
                                    >
                                      <ItemIcon className="size-3.5" />
                                    </span>
                                  ) : null}
                                  <div className="min-w-0 flex-1">
                                    <span
                                      className={`block text-[13px] font-bold leading-snug tracking-tight ${
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
                                      <span className="mt-0.5 block text-[10.5px] leading-snug text-muted-foreground group-hover:text-muted-foreground">
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
                        aria-current={active ? 'page' : undefined}
                        className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors ${
                          active
                            ? 'bg-tint-blue/40 text-blue-ink'
                            : 'text-foreground hover:bg-muted/60 hover:text-blue-ink'
                        }`}
                      >
                        {(() => {
                          const PlainIcon = sectionIcons[dropdownKey]
                          return PlainIcon ? (
                            <span
                              className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors ${
                                active
                                  ? 'bg-tint-blue text-blue-ink'
                                  : 'bg-muted text-muted-foreground group-hover:text-blue-ink'
                              }`}
                            >
                              <PlainIcon className="size-4" />
                            </span>
                          ) : null
                        })()}
                        <span className="min-w-0 flex-1">
                          <span className={`block text-base font-bold ${active ? 'text-blue-ink' : 'text-foreground'}`}>
                            {link.label}
                          </span>
                          <span className="mt-0.5 block text-[10.5px] font-medium text-muted-foreground">
                            {isExternalHref(link.href) ? 'Catálogo en línea' : 'Página principal'}
                          </span>
                        </span>
                        {isExternalHref(link.href) ? (
                          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-blue-ink" />
                        ) : (
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground group-hover:text-blue-ink" />
                        )}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>

            <Link
              href={mobileMenuMedia.href}
              onClick={markMobileNavigation}
              className="group relative mt-5 block overflow-hidden rounded-2xl bg-slate-900 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.65)]"
            >
              <span className="block aspect-[16/9]">
                {mobileMenuMedia.video ? (
                  <video
                    className="h-full w-full object-cover"
                    src={mobileMenuMedia.video}
                    poster={mobileMenuMedia.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mobileMenuMedia.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"
              />
              <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-blue-ink">
                <ArrowUpRight className="size-4" />
              </span>
              <span className="absolute inset-x-0 bottom-0 block p-3.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                  {mobileMenuMedia.eyebrow}
                </span>
                <span className="mt-1.5 block text-[15px] font-bold leading-snug">{mobileMenuMedia.title}</span>
                <span className="mt-0.5 block line-clamp-2 text-[11px] leading-snug text-white/75">
                  {mobileMenuMedia.description}
                </span>
              </span>
            </Link>
            </div>
          </div>

          {/* Acciones fijas al pie */}
          <div className="shrink-0 border-t border-border/70 bg-card px-3.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 sm:px-6">
            <div className="mx-auto w-full max-w-lg">
            <Link
              href="/contacto"
              onClick={markMobileNavigation}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1769AA] to-[#12568C] px-4 py-3 text-[15px] font-bold text-white shadow-[0_10px_24px_-16px_rgba(23,105,170,0.9)] transition hover:from-[#12568C] hover:to-[#1769AA]"
            >
              <FaTeamspeak aria-hidden="true" className="size-4" />
              <span>Asesoría</span>
            </Link>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-medium text-muted-foreground">
              <a
                href="tel:+51999888777"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 transition-colors hover:bg-muted hover:text-blue-ink"
              >
                <Phone className="size-3.5 text-blue-ink" />
                <span>+51 999 888 777</span>
              </a>
              <span aria-hidden="true" className="hidden size-1 rounded-full bg-border min-[360px]:block" />
              <a
                href="mailto:ventas@fjsolutions.pe"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 transition-colors hover:bg-muted hover:text-blue-ink"
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
