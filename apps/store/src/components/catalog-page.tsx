'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  AppWindow,
  ArrowDownAZ,
  ArrowRight,
  Boxes,
  Cable,
  Check,
  ChevronDown,
  ChevronRight,
  Cpu,
  Filter,
  Gamepad2,
  HardDrive,
  Headset,
  House,
  Keyboard,
  Laptop,
  Layers,
  Monitor,
  Package,
  Printer,
  RotateCcw,
  Router as RouterIcon,
  Search,
  Server,
  Smartphone,
  Tag,
  X,
  type LucideIcon,
} from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import {
  categoryTaxonomy,
  getTaxonomyCategory,
  products,
  type CategoryTaxonomy,
  type Product,
} from '@/lib/catalog'
import { SORT_OPTIONS, normalize } from '@/lib/catalog-query'
import { corporateUrl } from '@/lib/store-nav'

const ALL = 'Todas'

const categoryIconMap: Record<string, LucideIcon> = {
  Impresoras: Printer,
  'Impresoras y Escáneres': Printer,
  Laptops: Laptop,
  'Laptops y Portátiles': Laptop,
  'PC y Servidores': Server,
  Componentes: Cpu,
  'Componentes de PC': Cpu,
  Almacenamiento: HardDrive,
  Redes: RouterIcon,
  'Redes y Conectividad': RouterIcon,
  Monitores: Monitor,
  Periféricos: Keyboard,
  'Cables y Energía': Cable,
  'Audio y Video': Headset,
  Gaming: Gamepad2,
  Accesorios: Package,
  Telefonía: Smartphone,
  Software: AppWindow,
  'Hogar inteligente': House,
}

const categoryImages: Record<string, string> = {
  'PC y Servidores': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
  Laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  'Laptops y Portátiles': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  Componentes: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80',
  'Componentes de PC': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80',
  Monitores: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
  Periféricos: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
  Almacenamiento: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&q=80',
  Redes: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80',
  'Redes y Conectividad': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80',
  Impresoras: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80',
  'Impresoras y Escáneres': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80',
  'Audio y Video': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
  Gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80',
  Accesorios: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
  Telefonía: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
  Software: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
  'Hogar inteligente': 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&q=80',
  'Cables y Energía': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
}

const sortOptions = SORT_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}))

type DropdownOption = {
  value: string
  label: string
  count?: number
  icon?: LucideIcon
}
function CustomFilterDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  searchable = false,
  searchPlaceholder = 'Buscar...',
}: {
  label: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  icon?: LucideIcon
  searchable?: boolean
  searchPlaceholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return options
    const term = normalize(searchTerm)
    return options.filter((opt) => normalize(opt.label).includes(term))
  }, [options, searchable, searchTerm])

  const selectedOption = options.find((opt) => opt.value === value)
  const isCustomSelected = value !== ALL && value !== ''
  const displayValue = selectedOption?.label || value

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`inline-flex h-10 items-center justify-between gap-2 rounded-xl border px-3 text-xs font-semibold transition-all ${
          isCustomSelected
            ? 'border-[#2563EB] bg-tint-blue text-blue-ink shadow-xs ring-2 ring-[#2563EB]/15'
            : isOpen
              ? 'border-[#2563EB] bg-card text-foreground shadow-xs ring-2 ring-[#2563EB]/10'
              : 'border-input bg-card text-foreground hover:border-[#94A3B8] hover:bg-muted'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {Icon && (
            <Icon
              className={`size-3.5 shrink-0 ${isCustomSelected ? 'text-blue-ink' : 'text-muted-foreground'}`}
            />
          )}
          <span className="font-normal text-muted-foreground">{label}:</span>
          <span className="max-w-[130px] truncate font-bold sm:max-w-[180px]">{displayValue}</span>
        </div>
        <ChevronDown
          className={`size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-ink' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[230px] max-w-[320px] overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl">
          {searchable && (
            <div className="border-b border-border p-1.5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-8 w-full rounded-lg border border-border bg-muted pl-8 pr-2 text-xs text-foreground outline-none transition focus:border-[#2563EB] focus:bg-card"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto overscroll-contain py-1">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-2 text-center text-xs text-muted-foreground">Sin opciones</p>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value
                const OptionIcon = opt.icon
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value)
                      setIsOpen(false)
                      setSearchTerm('')
                    }}
                    className={`flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-tint-blue font-bold text-blue-ink'
                        : 'text-foreground hover:bg-muted hover:text-blue-ink'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {OptionIcon && (
                        <OptionIcon
                          className={`size-3.5 shrink-0 ${
                            isSelected ? 'text-blue-ink' : 'text-muted-foreground'
                          }`}
                        />
                      )}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {typeof opt.count === 'number' && (
                        <span
                          className={`rounded-full px-1.5 text-[10px] font-semibold ${
                            isSelected
                              ? 'bg-blue-ink/15 text-blue-ink'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {opt.count}
                        </span>
                      )}
                      {isSelected && <Check className="size-3.5 text-blue-ink" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

type CategoryCardData = {
  id: string
  label: string
  count: number
}

function CategoryCard({
  category,
  onSelect,
}: {
  category: CategoryCardData
  onSelect: (label: string) => void
}) {
  const imageUrl =
    categoryImages[category.label] ||
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'

  return (
    <button
      type="button"
      onClick={() => onSelect(category.label)}
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={category.label}
        loading="lazy"
        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 text-left">
        <div>
          <span className="rounded-full bg-[#2563EB]/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            {category.count} {category.count === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-bold text-white transition group-hover:text-[#60A5FA]">
          {category.label}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-white/80 transition group-hover:text-white">
          Ver categoría
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </button>
  )
}

function matchesCategory(product: Product, category: string, activeTaxonomy: CategoryTaxonomy | null) {
  if (category === ALL) return true
  const productTaxonomy = getTaxonomyCategory(product.category)
  if (activeTaxonomy && productTaxonomy) {
    return normalize(productTaxonomy.id) === normalize(activeTaxonomy.id)
  }
  return normalize(product.category) === normalize(category)
}

function matchesTerm(product: Product, term: string) {
  if (!term) return true
  return [
    product.name,
    product.brand,
    product.category,
    product.subcategory,
    product.subSubcategory,
    product.model,
    product.sku,
    product.description,
    ...product.specs,
  ]
    .filter(Boolean)
    .some((value) => normalize(String(value)).includes(term))
}

function firstParam(value: string | null): string {
  return value ?? ''
}

function canonicalBrand(value: string): string {
  if (!value || value === ALL) return ALL
  return products.find((product) => normalize(product.brand) === normalize(value))?.brand ?? value
}

export function CatalogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(firstParam(searchParams.get('q')))
  const [category, setCategory] = useState(
    firstParam(searchParams.get('categoria') || searchParams.get('category')) || ALL
  )
  const [subcategory, setSubcategory] = useState(
    firstParam(searchParams.get('subcategoria')) || ALL
  )
  const [subSubcategory, setSubSubcategory] = useState(
    firstParam(searchParams.get('tipo') || searchParams.get('subSubcategoria')) || ALL
  )
  const [brand, setBrand] = useState(
    canonicalBrand(firstParam(searchParams.get('marca') || searchParams.get('brand')))
  )
  const [sort, setSort] = useState(firstParam(searchParams.get('orden')))

  useEffect(() => {
    setQuery(firstParam(searchParams.get('q')))
    setCategory(firstParam(searchParams.get('categoria') || searchParams.get('category')) || ALL)
    setSubcategory(firstParam(searchParams.get('subcategoria')) || ALL)
    setSubSubcategory(
      firstParam(searchParams.get('tipo') || searchParams.get('subSubcategoria')) || ALL
    )
    setBrand(canonicalBrand(firstParam(searchParams.get('marca') || searchParams.get('brand'))))
    setSort(firstParam(searchParams.get('orden')))
  }, [searchParams])

  const activeTaxonomy = useMemo(
    () => (category === ALL ? null : getTaxonomyCategory(category)),
    [category]
  )

  const activeSubcategory = useMemo(() => {
    if (!activeTaxonomy || subcategory === ALL) return null
    return (
      activeTaxonomy.subcategories.find(
        (sub) =>
          normalize(sub.label) === normalize(subcategory) || normalize(sub.id) === normalize(subcategory)
      ) ?? null
    )
  }, [activeTaxonomy, subcategory])

  const availableSubSubcategories = activeSubcategory?.subSubcategories ?? []

  const subcategoryLabel = activeSubcategory?.label ?? subcategory

  const subSubcategoryLabel =
    availableSubSubcategories.find(
      (type) =>
        normalize(type.label) === normalize(subSubcategory) ||
        normalize(type.id) === normalize(subSubcategory)
    )?.label ?? subSubcategory

  const availableBrands = useMemo(() => {
    return [...new Set(
      products
        .filter((product) => matchesCategory(product, category, activeTaxonomy))
        .map((product) => product.brand)
    )].sort((a, b) => a.localeCompare(b, 'es'))
  }, [category, activeTaxonomy])

  const filtered = useMemo(() => {
    const term = normalize(query)

    const list = products.filter((product) => {
      const matchesSubcategory =
        subcategory === ALL ||
        (!!product.subcategory && normalize(product.subcategory) === normalize(subcategory))

      const matchesSubSubcategory =
        subSubcategory === ALL ||
        (!!product.subSubcategory &&
          normalize(product.subSubcategory) === normalize(subSubcategory))

      const matchesBrand = brand === ALL || normalize(product.brand) === normalize(brand)

      return (
        matchesTerm(product, term) &&
        matchesCategory(product, category, activeTaxonomy) &&
        matchesSubcategory &&
        matchesSubSubcategory &&
        matchesBrand
      )
    })

    return [...list].sort((a, b) => {
      if (sort === 'nombre') return a.name.localeCompare(b.name, 'es')
      if (sort === 'nombre-desc') return b.name.localeCompare(a.name, 'es')
      return 0
    })
  }, [query, category, subcategory, subSubcategory, brand, sort, activeTaxonomy])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const product of products) {
      const key = getTaxonomyCategory(product.category)?.label ?? product.category
      counts[key] = (counts[key] ?? 0) + 1
    }
    return counts
  }, [])

  const categoryCards = useMemo<CategoryCardData[]>(() => {
    const cards: CategoryCardData[] = categoryTaxonomy.map((tax) => ({
      id: tax.id,
      label: tax.label,
      count: categoryCounts[tax.label] ?? 0,
    }))

    for (const [label, count] of Object.entries(categoryCounts)) {
      const exists = cards.some((card) => normalize(card.label) === normalize(label))
      if (!exists) cards.push({ id: label, label, count })
    }

    return cards.filter((card) => card.count > 0)
  }, [categoryCounts])

  const isOverview =
    category === ALL &&
    brand === ALL &&
    subcategory === ALL &&
    subSubcategory === ALL &&
    query.trim() === ''

  const resultsText = isOverview
    ? `${categoryCards.length} categorías · ${products.length} productos disponibles`
    : filtered.length === 1
      ? '1 producto encontrado'
      : `${filtered.length} productos disponibles`

  const subcategoryCounts = useMemo(() => {
    if (!activeTaxonomy) return {}
    const counts: Record<string, number> = {}
    for (const product of products) {
      const productTaxonomy = getTaxonomyCategory(product.category)
      if (
        productTaxonomy &&
        normalize(productTaxonomy.id) === normalize(activeTaxonomy.id) &&
        product.subcategory
      ) {
        counts[product.subcategory] = (counts[product.subcategory] ?? 0) + 1
      }
    }
    return counts
  }, [activeTaxonomy])

  const subSubcategoryCounts = useMemo(() => {
    if (!activeTaxonomy) return {}
    const counts: Record<string, number> = {}
    for (const product of products) {
      const productTaxonomy = getTaxonomyCategory(product.category)
      if (
        productTaxonomy &&
        normalize(productTaxonomy.id) === normalize(activeTaxonomy.id) &&
        product.subSubcategory
      ) {
        counts[product.subSubcategory] = (counts[product.subSubcategory] ?? 0) + 1
      }
    }
    return counts
  }, [activeTaxonomy])

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const product of filtered) {
      counts[product.brand] = (counts[product.brand] ?? 0) + 1
    }
    return counts
  }, [filtered])

  const applyFilterUrl = (overrides: {
    category?: string
    subcategory?: string
    subSubcategory?: string
    brand?: string
    sort?: string
    query?: string
  } = {}) => {
    const next = {
      category: overrides.category ?? category,
      subcategory: overrides.subcategory ?? subcategory,
      subSubcategory: overrides.subSubcategory ?? subSubcategory,
      brand: overrides.brand ?? brand,
      sort: overrides.sort ?? sort,
      query: overrides.query ?? query,
    }

    const params = new URLSearchParams()
    const term = next.query.trim()
    if (term) params.set('q', term)
    if (next.category !== ALL) params.set('categoria', next.category)
    if (next.subcategory !== ALL) params.set('subcategoria', next.subcategory)
    if (next.subSubcategory !== ALL) params.set('tipo', next.subSubcategory)
    if (next.brand !== ALL) params.set('marca', next.brand)
    if (next.sort) params.set('orden', next.sort)

    const queryString = params.toString()
    router.push(queryString ? `/productos?${queryString}` : '/productos', { scroll: false })
  }

  const handleSelectCategory = (label: string) => {
    if (label === category) return
    setCategory(label)
    setSubcategory(ALL)
    setSubSubcategory(ALL)
    setBrand(ALL)
    applyFilterUrl({ category: label, subcategory: ALL, subSubcategory: ALL, brand: ALL })
  }

  const handleSelectSubcategory = (label: string) => {
    if (label === subcategory) return
    setSubcategory(label)
    setSubSubcategory(ALL)
    applyFilterUrl({ subcategory: label, subSubcategory: ALL })
  }

  const handleSelectSubSubcategory = (label: string) => {
    if (label === subSubcategory) return
    setSubSubcategory(label)
    applyFilterUrl({ subSubcategory: label })
  }

  const handleSelectBrand = (label: string) => {
    if (label === brand) return
    setBrand(label)
    applyFilterUrl({ brand: label })
  }

  const handleSelectSort = (value: string) => {
    if (value === sort) return
    setSort(value)
    applyFilterUrl({ sort: value })
  }

  const handleClearQuery = () => {
    setQuery('')
    applyFilterUrl({ query: '' })
  }

  const resetFilters = () => {
    setQuery('')
    setCategory(ALL)
    setSubcategory(ALL)
    setSubSubcategory(ALL)
    setBrand(ALL)
    setSort('')
    applyFilterUrl({
      query: '',
      category: ALL,
      subcategory: ALL,
      subSubcategory: ALL,
      brand: ALL,
      sort: '',
    })
  }

  const hasFilters =
    query !== '' ||
    category !== ALL ||
    subcategory !== ALL ||
    subSubcategory !== ALL ||
    brand !== ALL

  const activeTitle = subSubcategory !== ALL
    ? subSubcategoryLabel
    : subcategory !== ALL
      ? subcategoryLabel
      : category !== ALL
        ? activeTaxonomy?.label ?? category
        : 'Tienda completa de productos'

  const categoryDropdownOptions = useMemo<DropdownOption[]>(
    () => [
      { value: ALL, label: ALL, count: products.length },
      ...categoryCards.map((card) => ({
        value: card.label,
        label: card.label,
        count: card.count,
        icon: categoryIconMap[card.label],
      })),
    ],
    [categoryCards]
  )

  const subcategoryDropdownOptions = useMemo<DropdownOption[]>(() => {
    if (!activeTaxonomy) return []
    return [
      { value: ALL, label: ALL, count: categoryCounts[activeTaxonomy.label] ?? 0 },
      ...activeTaxonomy.subcategories
        .map((sub) => ({
          value: sub.label,
          label: sub.label,
          count: subcategoryCounts[sub.label] ?? 0,
        }))
        .filter((option) => option.count > 0),
    ]
  }, [activeTaxonomy, categoryCounts, subcategoryCounts])

  const subSubcategoryDropdownOptions = useMemo<DropdownOption[]>(() => {
    if (!availableSubSubcategories.length) return []
    return [
      { value: ALL, label: 'Todos' },
      ...availableSubSubcategories
        .map((type) => ({
          value: type.label,
          label: type.label,
          count: subSubcategoryCounts[type.label] ?? 0,
        }))
        .filter((option) => option.count > 0),
    ]
  }, [availableSubSubcategories, subSubcategoryCounts])

  const brandDropdownOptions = useMemo<DropdownOption[]>(
    () => [
      { value: ALL, label: ALL, count: filtered.length },
      ...availableBrands.map((name) => ({
        value: name,
        label: name,
        count: brandCounts[name] ?? 0,
      })),
    ],
    [availableBrands, brandCounts, filtered.length]
  )

  const breadcrumbItems = [
    { key: 'inicio', label: 'Inicio', href: '/' },
    {
      key: 'tienda',
      label: 'Tienda',
      active: category === ALL,
      onClick: () => handleSelectCategory(ALL),
    },
    ...(category !== ALL
      ? [
          {
            key: 'categoria',
            label: activeTaxonomy?.label ?? category,
            active: subcategory === ALL,
            onClick: () => {
              setSubcategory(ALL)
              setSubSubcategory(ALL)
              applyFilterUrl({ subcategory: ALL, subSubcategory: ALL })
            },
          },
        ]
      : []),
    ...(subcategory !== ALL
      ? [
          {
            key: 'subcategoria',
            label: subcategoryLabel,
            active: subSubcategory === ALL,
            onClick: () => handleSelectSubSubcategory(ALL),
          },
        ]
      : []),
    ...(subSubcategory !== ALL
      ? [{ key: 'tipo', label: subSubcategoryLabel, current: true }]
      : []),
  ]

  return (
    <main className="min-h-screen bg-muted/40 text-foreground">
      <nav aria-label="Migas de pan" className="border-b border-border bg-muted">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-1.5 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          {breadcrumbItems.map((item, index) => {
            const className = item.current
              ? 'font-bold text-foreground'
              : item.active
                ? 'font-semibold text-blue-ink'
                : 'font-semibold text-muted-foreground transition hover:text-blue-ink'

            return (
              <Fragment key={item.key}>
                {index > 0 && (
                  <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                )}
                {item.href ? (
                  <Link href={item.href} className={className}>
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    aria-current={item.current ? 'page' : undefined}
                    className={className}
                  >
                    {item.label}
                  </button>
                )}
              </Fragment>
            )
          })}
        </div>
      </nav>

      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {activeTitle}
              </h1>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">{resultsText}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[180px] flex-1 sm:w-56 sm:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar producto..."
                  className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-8 text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {category === ALL && (
                <CustomFilterDropdown
                  label="Categoría"
                  icon={Boxes}
                  value={category}
                  options={categoryDropdownOptions}
                  onChange={handleSelectCategory}
                  searchable={categoryCards.length > 6}
                  searchPlaceholder="Buscar categoría..."
                />
              )}

              {subcategoryDropdownOptions.length > 1 && (
                <CustomFilterDropdown
                  label="Subcategoría"
                  icon={Layers}
                  value={subcategory}
                  options={subcategoryDropdownOptions}
                  onChange={handleSelectSubcategory}
                />
              )}

              {subSubcategoryDropdownOptions.length > 1 && (
                <CustomFilterDropdown
                  label="Tipo"
                  icon={Tag}
                  value={subSubcategory}
                  options={subSubcategoryDropdownOptions}
                  onChange={handleSelectSubSubcategory}
                />
              )}

              {!isOverview && (
                <CustomFilterDropdown
                  label="Marca"
                  icon={Filter}
                  value={brand}
                  options={brandDropdownOptions}
                  onChange={handleSelectBrand}
                  searchable={availableBrands.length > 5}
                  searchPlaceholder="Buscar marca..."
                />
              )}

              {!isOverview && (
                <CustomFilterDropdown
                  label="Ordenar"
                  icon={ArrowDownAZ}
                  value={sort}
                  options={sortOptions}
                  onChange={handleSelectSort}
                />
              )}

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-xs font-semibold text-danger-ink transition hover:bg-red-500/15"
                  title="Restablecer todos los filtros"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {hasFilters && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Filtros activos:
              </span>

              {category !== ALL && (
                <span className="inline-flex items-center gap-1 rounded-md bg-tint-blue px-2 py-0.5 text-xs font-medium text-blue-ink">
                  Categoría: {activeTaxonomy?.label ?? category}
                  <button
                    type="button"
                    onClick={() => handleSelectCategory(ALL)}
                    aria-label="Quitar filtro de categoría"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {subcategory !== ALL && (
                <span className="inline-flex items-center gap-1 rounded-md bg-tint-blue px-2 py-0.5 text-xs font-medium text-blue-ink">
                  Subcategoría: {subcategoryLabel}
                  <button
                    type="button"
                    onClick={() => handleSelectSubcategory(ALL)}
                    aria-label="Quitar filtro de subcategoría"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {subSubcategory !== ALL && (
                <span className="inline-flex items-center gap-1 rounded-md bg-tint-blue px-2 py-0.5 text-xs font-medium text-blue-ink">
                  Tipo: {subSubcategoryLabel}
                  <button
                    type="button"
                    onClick={() => handleSelectSubSubcategory(ALL)}
                    aria-label="Quitar filtro de tipo"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {brand !== ALL && (
                <span className="inline-flex items-center gap-1 rounded-md bg-tint-blue px-2 py-0.5 text-xs font-medium text-blue-ink">
                  Marca: {brand}
                  <button
                    type="button"
                    onClick={() => handleSelectBrand(ALL)}
                    aria-label="Quitar filtro de marca"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {query && (
                <span className="inline-flex items-center gap-1 rounded-md bg-tint-blue px-2 py-0.5 text-xs font-medium text-blue-ink">
                  Búsqueda: &quot;{query}&quot;
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    aria-label="Quitar filtro de búsqueda"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          {isOverview ? (
            <>
              <div className="mb-4 flex items-center gap-2">
                <Boxes aria-hidden="true" className="size-4 text-blue-ink" />
                <p className="text-xs font-semibold text-muted-foreground">
                  Selecciona una categoría para ver sus productos
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryCards.map((card) => (
                  <CategoryCard
                    key={card.id}
                    category={card}
                    onSelect={handleSelectCategory}
                  />
                ))}
              </div>
            </>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-input bg-card p-12 text-center sm:p-16">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#2563EB]/10 text-blue-ink">
                <Search className="size-8" />
              </span>
              <h2 className="mt-4 font-heading text-lg font-bold text-foreground sm:text-xl">
                No encontramos productos con estos criterios
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Prueba cambiando la subcategoría, quitando la marca o buscando con un término más
                general.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-input bg-card px-5 text-xs font-bold text-foreground shadow-xs transition hover:bg-muted"
                >
                  <RotateCcw className="size-3.5" />
                  Limpiar filtros
                </button>
                <a
                  href={corporateUrl('/cotizacion')}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1D4ED8]"
                >
                  Solicitar cotización a medida
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 rounded-3xl border border-[#2563EB]/25 bg-gradient-to-r from-tint-blue via-card to-brand-soft p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#2563EB] text-white shadow-sm">
                <Headset className="size-6" />
              </span>
              <div>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#2563EB]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-ink">
                  Atención B2B
                </span>
                <h2 className="mt-1 font-heading text-base font-bold text-foreground sm:text-lg">
                  ¿Necesitas compras por volumen o licitaciones para tu empresa?
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Preparamos cotizaciones formales con RUC, crédito corporativo, configuración de
                  imagen de fábrica y despacho en Lima y provincias.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <a
                href={corporateUrl('/cotizacion')}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Solicitar cotización
                <ArrowRight className="size-3.5" />
              </a>
              <a
                href={corporateUrl('/contacto')}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-input bg-card px-5 text-xs font-bold text-foreground transition hover:bg-muted"
              >
                Hablar con un asesor
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
