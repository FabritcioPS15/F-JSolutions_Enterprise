'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowDownAZ,
  ArrowRight,
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  Cpu,
  Filter,
  Gamepad2,
  HardDrive,
  Headset,
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
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
  type LucideIcon,
} from 'lucide-react'
import { ProductCard } from '@/components/cards/product-card'
import { QuotePanel } from '@/components/sections/quote-panel'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import {
  categoryTaxonomy,
  getTaxonomyCategory,
  products,
  type Product,
} from '@/lib/catalog'
import { useQuote } from '@/lib/use-quote'

const categoryIconMap: Record<string, LucideIcon> = {
  'PC y Servidores': Server,
  Laptops: Laptop,
  'Laptops y Portátiles': Laptop,
  Componentes: Cpu,
  'Componentes de PC': Cpu,
  Monitores: Monitor,
  'Periféricos': Keyboard,
  Almacenamiento: HardDrive,
  Redes: RouterIcon,
  'Redes y Conectividad': RouterIcon,
  'Impresoras y Escáneres': Printer,
  Impresoras: Printer,
  'Audio y Video': Headset,
  Gaming: Gamepad2,
}

const sortOptions = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'nombre', label: 'Nombre: A a la Z' },
  { value: 'nombre-desc', label: 'Nombre: Z a la A' },
]

// ─── Componente: Dropdown Personalizado con Popover Elegante ──────────────────────────────

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
  className = '',
}: {
  label: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  icon?: LucideIcon
  searchable?: boolean
  searchPlaceholder?: string
  className?: string
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
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Filtrado interno si el buscador está activo
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return options
    const term = searchTerm.toLowerCase()
    return options.filter((opt) => opt.label.toLowerCase().includes(term))
  }, [options, searchable, searchTerm])

  const selectedOption = options.find((opt) => opt.value === value)
  const isCustomSelected = value !== 'Todas' && value !== 'relevancia'

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`inline-flex h-10 items-center justify-between gap-2 rounded-xl border px-3 text-xs font-semibold transition-all ${
          isCustomSelected
            ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] shadow-xs ring-2 ring-[#2563EB]/15'
            : isOpen
            ? 'border-[#2563EB] bg-white text-[#0F172A] shadow-xs ring-2 ring-[#2563EB]/10'
            : 'border-[#CBD5E1] bg-white text-[#0F172A] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {Icon && (
            <Icon
              className={`size-3.5 shrink-0 ${isCustomSelected ? 'text-[#2563EB]' : 'text-[#64748B]'}`}
            />
          )}
          <span className="font-normal text-[#64748B]">{label}:</span>
          <span className="max-w-[130px] truncate font-bold sm:max-w-[180px]">
            {selectedOption?.label || value}
          </span>
        </div>
        <ChevronDown
          className={`size-3.5 shrink-0 text-[#64748B] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#2563EB]' : ''
          }`}
        />
      </button>

      {/* Popover flotante con sombra y desenfoque */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[230px] max-w-[320px] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150">
          {searchable && (
            <div className="border-b border-[#F1F5F9] p-1.5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-8 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-8 pr-2 text-xs text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:bg-white"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto overscroll-contain py-1">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-2 text-center text-xs text-[#94A3B8]">Sin opciones</p>
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
                        ? 'bg-[#EFF6FF] font-bold text-[#2563EB]'
                        : 'text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#2563EB]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {OptionIcon && (
                        <OptionIcon
                          className={`size-3.5 shrink-0 ${
                            isSelected ? 'text-[#2563EB]' : 'text-[#64748B]'
                          }`}
                        />
                      )}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {typeof opt.count === 'number' && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                            isSelected
                              ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                              : 'bg-[#F1F5F9] text-[#64748B]'
                          }`}
                        >
                          {opt.count}
                        </span>
                      )}
                      {isSelected && <Check className="size-3.5 text-[#2563EB]" />}
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

// ─── Componente Principal: CatalogPage ────────────────────────────────────────────────────

type CatalogPageProps = {
  initialQuery?: string
  initialCategory?: string
}

export function CatalogPage({
  initialQuery = '',
  initialCategory = 'Todas',
}: CatalogPageProps) {
  const quote = useQuote()
  const searchParams = useSearchParams()

  const [showQuote, setShowQuote] = useState(false)
  const [query, setQuery] = useState(initialQuery || searchParams?.get('q') || searchParams?.get('query') || '')
  const [category, setCategory] = useState(
    initialCategory !== 'Todas'
      ? initialCategory
      : searchParams?.get('categoria') || searchParams?.get('category') || 'Todas'
  )
  const [subcategory, setSubcategory] = useState(searchParams?.get('subcategoria') || 'Todas')
  const [subSubcategory, setSubSubcategory] = useState(
    searchParams?.get('tipo') || searchParams?.get('subSubcategoria') || 'Todas'
  )
  const [brand, setBrand] = useState(searchParams?.get('marca') || searchParams?.get('brand') || 'Todas')
  const [sort, setSort] = useState('relevancia')

  // Sincronizar parámetros de URL
  useEffect(() => {
    const q = searchParams?.get('q') || searchParams?.get('query') || ''
    const cat = searchParams?.get('categoria') || searchParams?.get('category') || ''
    const sub = searchParams?.get('subcategoria') || ''
    const subSub = searchParams?.get('tipo') || searchParams?.get('subSubcategoria') || ''
    const b = searchParams?.get('marca') || searchParams?.get('brand') || ''

    if (q) setQuery(q)
    if (cat) setCategory(cat)
    if (sub) setSubcategory(sub)
    if (subSub) setSubSubcategory(subSub)
    if (b) setBrand(b)

    if (!q && !cat && !sub && !subSub && !b) {
      setQuery('')
      setCategory('Todas')
      setSubcategory('Todas')
      setSubSubcategory('Todas')
      setBrand('Todas')
    }
  }, [searchParams])

  // Obtener la taxonomía de la categoría activa
  const activeTaxonomy = useMemo(() => {
    if (category === 'Todas') return null
    return getTaxonomyCategory(category)
  }, [category])

  // Subcategorías de la categoría activa
  const availableSubcategories = useMemo(() => {
    if (!activeTaxonomy) return []
    return activeTaxonomy.subcategories
  }, [activeTaxonomy])

  // Sub-subcategorías (tipos) de la subcategoría activa
  const availableSubSubcategories = useMemo(() => {
    if (!activeTaxonomy || subcategory === 'Todas') return []
    const foundSub = activeTaxonomy.subcategories.find(
      (s) =>
        s.label.toLowerCase() === subcategory.toLowerCase() ||
        s.id.toLowerCase() === subcategory.toLowerCase()
    )
    return foundSub?.subSubcategories || []
  }, [activeTaxonomy, subcategory])

  // Marcas disponibles
  const availableBrands = useMemo(() => {
    let list = products
    if (category !== 'Todas') {
      list = list.filter((p) => {
        const catTax = getTaxonomyCategory(p.category)
        return (
          p.category.toLowerCase() === category.toLowerCase() ||
          (catTax && activeTaxonomy && catTax.id === activeTaxonomy.id)
        )
      })
    }
    return Array.from(new Set(list.map((product) => product.brand))).sort()
  }, [category, activeTaxonomy])

  // Filtrado de productos
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()

    const list = products.filter((product) => {
      // 1. Coincidencia de texto
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(term)) ||
        (product.subSubcategory && product.subSubcategory.toLowerCase().includes(term)) ||
        (product.model && product.model.toLowerCase().includes(term)) ||
        (product.sku && product.sku.toLowerCase().includes(term))

      // 2. Coincidencia de Categoría (soporta alias)
      let matchesCategory = category === 'Todas'
      if (!matchesCategory) {
        const productTax = getTaxonomyCategory(product.category)
        if (activeTaxonomy && productTax) {
          matchesCategory = productTax.id === activeTaxonomy.id
        } else {
          matchesCategory = product.category.toLowerCase() === category.toLowerCase()
        }
      }

      // 3. Coincidencia de Subcategoría
      let matchesSubcategory = subcategory === 'Todas'
      if (!matchesSubcategory) {
        matchesSubcategory =
          !!product.subcategory &&
          (product.subcategory.toLowerCase() === subcategory.toLowerCase() ||
            (activeTaxonomy?.subcategories.some(
              (s) =>
                s.label.toLowerCase() === subcategory.toLowerCase() &&
                product.subcategory?.toLowerCase() === s.label.toLowerCase()
            ) ?? false))
      }

      // 4. Coincidencia de Sub-subcategoría / Tipo
      let matchesSubSubcategory = subSubcategory === 'Todas'
      if (!matchesSubSubcategory) {
        matchesSubSubcategory =
          !!product.subSubcategory &&
          product.subSubcategory.toLowerCase() === subSubcategory.toLowerCase()
      }

      // 5. Coincidencia de Marca
      const matchesBrand = brand === 'Todas' || product.brand.toLowerCase() === brand.toLowerCase()

      return (
        matchesTerm &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSubSubcategory &&
        matchesBrand
      )
    })

    return [...list].sort((a, b) => {
      if (sort === 'nombre') return a.name.localeCompare(b.name)
      if (sort === 'nombre-desc') return b.name.localeCompare(a.name)
      return 0
    })
  }, [query, category, subcategory, subSubcategory, brand, sort, activeTaxonomy])

  const resultsText =
    filtered.length === 1 ? '1 producto encontrado' : `${filtered.length} productos disponibles`

  // Contadores de categorías
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach((p) => {
      const tax = getTaxonomyCategory(p.category)
      const key = tax ? tax.label : p.category
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [])

  // Contadores de subcategorías
  const subcategoryCounts = useMemo(() => {
    if (!activeTaxonomy) return {}
    const counts: Record<string, number> = {}
    products.forEach((p) => {
      const pTax = getTaxonomyCategory(p.category)
      if (pTax && pTax.id === activeTaxonomy.id && p.subcategory) {
        counts[p.subcategory] = (counts[p.subcategory] || 0) + 1
      }
    })
    return counts
  }, [activeTaxonomy])

  // Contadores de marcas
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    filtered.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1
    })
    return counts
  }, [filtered])

  // Handlers de selección
  const handleSelectCategory = (catLabel: string) => {
    setCategory(catLabel)
    setSubcategory('Todas')
    setSubSubcategory('Todas')
  }

  const handleSelectSubcategory = (subLabel: string) => {
    setSubcategory(subLabel)
    setSubSubcategory('Todas')
  }

  const handleSelectSubSubcategory = (typeLabel: string) => {
    setSubSubcategory(typeLabel)
  }

  const resetFilters = () => {
    setQuery('')
    setCategory('Todas')
    setSubcategory('Todas')
    setSubSubcategory('Todas')
    setBrand('Todas')
    setSort('relevancia')
  }

  const hasFilters =
    query !== '' ||
    category !== 'Todas' ||
    subcategory !== 'Todas' ||
    subSubcategory !== 'Todas' ||
    brand !== 'Todas'

  const activeTitle = useMemo(() => {
    if (subSubcategory !== 'Todas') return subSubcategory
    if (subcategory !== 'Todas') return subcategory
    if (category !== 'Todas') return activeTaxonomy?.label || category
    return 'Catálogo Completo de Productos'
  }, [subSubcategory, subcategory, category, activeTaxonomy])

  // Opciones para el dropdown de Subcategorías
  const subcategoryDropdownOptions = useMemo<DropdownOption[]>(() => {
    if (!activeTaxonomy) return []
    const allOpt: DropdownOption = {
      value: 'Todas',
      label: `Todas en ${activeTaxonomy.label}`,
      count: categoryCounts[activeTaxonomy.label] || 0,
    }
    const subOpts: DropdownOption[] = activeTaxonomy.subcategories.map((sub) => ({
      value: sub.label,
      label: sub.label,
      count: subcategoryCounts[sub.label] || 0,
    }))
    return [allOpt, ...subOpts]
  }, [activeTaxonomy, categoryCounts, subcategoryCounts])

  // Opciones para el dropdown de Tipos (Sub-subcategorías)
  const subSubcategoryDropdownOptions = useMemo<DropdownOption[]>(() => {
    if (!availableSubSubcategories.length) return []
    const allOpt: DropdownOption = {
      value: 'Todas',
      label: 'Todos los tipos',
    }
    const typeOpts: DropdownOption[] = availableSubSubcategories.map((t) => ({
      value: t.label,
      label: t.label,
    }))
    return [allOpt, ...typeOpts]
  }, [availableSubSubcategories])

  // Opciones para el dropdown de Marcas
  const brandDropdownOptions = useMemo<DropdownOption[]>(() => {
    const allOpt: DropdownOption = {
      value: 'Todas',
      label: 'Todas las marcas',
      count: filtered.length,
    }
    const bOpts: DropdownOption[] = availableBrands.map((b) => ({
      value: b,
      label: b,
      count: brandCounts[b] || 0,
    }))
    return [allOpt, ...bOpts]
  }, [availableBrands, brandCounts, filtered.length])

  return (
    <main className="min-h-screen bg-white text-[#0F172A] selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      <EnhancedHeader quoteCount={quote.count} onQuoteClick={() => setShowQuote(true)} />

      {/* ── Breadcrumb Multinivel ────────────────────────────────────────────────── */}
      <nav aria-label="Migas de pan" className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-1.5 px-4 py-3 text-xs text-[#64748B] sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold text-[#475569] transition hover:text-[#2563EB]">
            Inicio
          </Link>
          <ChevronRight className="size-3.5 text-[#94A3B8]" />

          <button
            type="button"
            onClick={() => {
              setCategory('Todas')
              setSubcategory('Todas')
              setSubSubcategory('Todas')
            }}
            className={`font-semibold transition hover:text-[#2563EB] ${
              category === 'Todas' ? 'text-[#2563EB]' : 'text-[#475569]'
            }`}
          >
            Productos
          </button>

          {/* Nivel 1: Categoría */}
          {category !== 'Todas' && (
            <>
              <ChevronRight className="size-3.5 text-[#94A3B8]" />
              <button
                type="button"
                onClick={() => {
                  setSubcategory('Todas')
                  setSubSubcategory('Todas')
                }}
                className={`font-semibold transition hover:text-[#2563EB] ${
                  subcategory === 'Todas' ? 'text-[#2563EB]' : 'text-[#475569]'
                }`}
              >
                {activeTaxonomy?.label || category}
              </button>
            </>
          )}

          {/* Nivel 2: Subcategoría */}
          {subcategory !== 'Todas' && (
            <>
              <ChevronRight className="size-3.5 text-[#94A3B8]" />
              <button
                type="button"
                onClick={() => setSubSubcategory('Todas')}
                className={`font-semibold transition hover:text-[#2563EB] ${
                  subSubcategory === 'Todas' ? 'text-[#2563EB]' : 'text-[#475569]'
                }`}
              >
                {subcategory}
              </button>
            </>
          )}

          {/* Nivel 3: Sub-subcategoría / Tipo */}
          {subSubcategory !== 'Todas' && (
            <>
              <ChevronRight className="size-3.5 text-[#94A3B8]" />
              <span className="font-bold text-[#0F172A]">{subSubcategory}</span>
            </>
          )}
        </div>
      </nav>

      {/* ── Selector de Categorías Nivel 1 (Pestañas horizontales elegantes) ────── */}
      <section className="border-b border-[#E2E8F0] bg-white py-4" aria-label="Categorías principales">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => handleSelectCategory('Todas')}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                category === 'Todas'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              <Boxes className="size-4" />
              Todas las categorías
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  category === 'Todas' ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                {products.length}
              </span>
            </button>

            {categoryTaxonomy.map((cat) => {
              const active =
                category !== 'Todas' &&
                (activeTaxonomy?.id === cat.id || category.toLowerCase() === cat.label.toLowerCase())
              const Icon = categoryIconMap[cat.label] || categoryIconMap[cat.id] || Package
              const count = categoryCounts[cat.label] || 0

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.label)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Icon className="size-4" />
                  {cat.label}
                  {count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Contenedor Principal de Productos (FULL WIDTH) ──────────────────────── */}
      <section className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Barra superior de herramientas: Título + Buscador + Dropdowns personalizados */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xs sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Título de la vista y cantidad de productos */}
            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
                {activeTitle}
              </h1>
              <p className="mt-0.5 text-xs font-medium text-[#64748B]">{resultsText}</p>
            </div>

            {/* Controles con Dropdowns de alta gama */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Buscador dentro de la vista */}
              <div className="relative min-w-[180px] flex-1 sm:w-56 sm:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar producto..."
                  className="h-10 w-full rounded-xl border border-[#CBD5E1] bg-white pl-9 pr-8 text-xs text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* 1. Dropdown Personalizado de Subcategorías (disponible en la fila) */}
              {availableSubcategories.length > 0 && (
                <CustomFilterDropdown
                  label="Subcategoría"
                  icon={Layers}
                  value={subcategory}
                  options={subcategoryDropdownOptions}
                  onChange={handleSelectSubcategory}
                />
              )}

              {/* 2. Dropdown Personalizado de Tipos (Sub-subcategorías) */}
              {availableSubSubcategories.length > 0 && (
                <CustomFilterDropdown
                  label="Tipo"
                  icon={Tag}
                  value={subSubcategory}
                  options={subSubcategoryDropdownOptions}
                  onChange={handleSelectSubSubcategory}
                />
              )}

              {/* 3. Dropdown Personalizado de Marcas con buscador interno */}
              <CustomFilterDropdown
                label="Marca"
                icon={Filter}
                value={brand}
                options={brandDropdownOptions}
                onChange={(val) => setBrand(val)}
                searchable={availableBrands.length > 5}
                searchPlaceholder="Buscar marca..."
              />

              {/* 4. Dropdown Personalizado de Ordenamiento */}
              <CustomFilterDropdown
                label="Ordenar"
                icon={ArrowDownAZ}
                value={sort}
                options={sortOptions}
                onChange={(val) => setSort(val)}
              />

              {/* Botón limpiar filtros */}
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
                  title="Restablecer todos los filtros"
                >
                  <RotateCcw className="size-3.5" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Subcategorías DIRECTAMENTE en la fila de productos (Chips rápidos) ──── */}
          {availableSubcategories.length > 0 && (
            <div className="mt-4 border-t border-[#F1F5F9] pt-3.5">
              <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
                {/* Fila de subcategorías */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                    Subcategorías:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectSubcategory('Todas')}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      subcategory === 'Todas'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    Todas
                  </button>
                  {availableSubcategories.map((sub) => {
                    const active = subcategory.toLowerCase() === sub.label.toLowerCase()
                    const count = subcategoryCounts[sub.label] || 0
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSelectSubcategory(sub.label)}
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {sub.label}
                        {count > 0 && (
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                              active ? 'bg-white/20 text-white font-bold' : 'bg-[#F1F5F9] text-[#64748B]'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Fila de tipos / sub-subcategorías */}
                {availableSubSubcategories.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 lg:pt-0">
                    <span className="shrink-0 text-[11px] font-medium text-[#64748B]">Tipos:</span>
                    <button
                      type="button"
                      onClick={() => handleSelectSubSubcategory('Todas')}
                      className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                        subSubcategory === 'Todas'
                          ? 'bg-[#0F172A] text-white'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      Todos
                    </button>
                    {availableSubSubcategories.map((typeItem) => {
                      const active = subSubcategory.toLowerCase() === typeItem.label.toLowerCase()
                      return (
                        <button
                          key={typeItem.id}
                          type="button"
                          onClick={() => handleSelectSubSubcategory(typeItem.label)}
                          className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                            active
                              ? 'bg-[#0F172A] text-white'
                              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                          }`}
                        >
                          {typeItem.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chips de filtros activos */}
          {hasFilters && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-[#F1F5F9] pt-3">
              <span className="text-[11px] font-semibold text-[#64748B]">Filtros activos:</span>

              {category !== 'Todas' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#EFF6FF] px-2 py-0.5 text-xs font-medium text-[#2563EB]">
                  Categoría: {activeTaxonomy?.label || category}
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('Todas')
                      setSubcategory('Todas')
                      setSubSubcategory('Todas')
                    }}
                    className="hover:text-[#1D4ED8]"
                    aria-label="Quitar filtro de categoría"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {subcategory !== 'Todas' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#EFF6FF] px-2 py-0.5 text-xs font-medium text-[#2563EB]">
                  Subcategoría: {subcategory}
                  <button
                    type="button"
                    onClick={() => {
                      setSubcategory('Todas')
                      setSubSubcategory('Todas')
                    }}
                    className="hover:text-[#1D4ED8]"
                    aria-label="Quitar filtro de subcategoría"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {subSubcategory !== 'Todas' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#EFF6FF] px-2 py-0.5 text-xs font-medium text-[#2563EB]">
                  Tipo: {subSubcategory}
                  <button
                    type="button"
                    onClick={() => setSubSubcategory('Todas')}
                    className="hover:text-[#1D4ED8]"
                    aria-label="Quitar filtro de tipo"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {brand !== 'Todas' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#EFF6FF] px-2 py-0.5 text-xs font-medium text-[#2563EB]">
                  Marca: {brand}
                  <button
                    type="button"
                    onClick={() => setBrand('Todas')}
                    className="hover:text-[#1D4ED8]"
                    aria-label="Quitar filtro de marca"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {query && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#EFF6FF] px-2 py-0.5 text-xs font-medium text-[#2563EB]">
                  Búsqueda: &quot;{query}&quot;
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="hover:text-[#1D4ED8]"
                    aria-label="Quitar filtro de búsqueda"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Grilla de Productos AGRANDADA ────────────────────────────────────── */}
        <div className="mt-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-7">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} onAddToQuote={quote.addItem} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-12 text-center sm:p-16">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
                <Search className="size-8" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold text-[#0F172A] sm:text-xl">
                No encontramos productos con estos criterios
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
                Prueba cambiando la subcategoría, quitando la marca o buscando con un término más general.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 text-xs font-bold text-[#0F172A] shadow-xs transition hover:bg-[#F8FAFC]"
                >
                  <RotateCcw className="size-3.5" />
                  Limpiar filtros
                </button>
                <Link
                  href="/cotizacion"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1D4ED8]"
                >
                  Solicitar cotización a medida
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Banner Corporativo de Asesoría Técnica y Cotización ───────────────── */}
        <div className="mt-14 rounded-3xl border border-[#DBEAFE] bg-gradient-to-r from-[#EFF6FF] via-white to-[#F8FAFC] p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#2563EB] text-white shadow-sm">
                <Headset className="size-6" />
              </span>
              <div>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#2563EB]/10 px-2 py-0.5 text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                  Atención B2B
                </span>
                <h4 className="mt-1 font-heading text-base font-bold text-[#0F172A] sm:text-lg">
                  ¿Necesitas compras por volumen o licitaciones para tu empresa?
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Preparamos cotizaciones formales con RUC, crédito corporativo, configuración de imagen de fábrica y despacho en Lima y provincias.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Link
                href="/cotizacion"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Solicitar cotización
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 text-xs font-bold text-[#0F172A] transition hover:bg-[#F8FAFC]"
              >
                Hablar con un asesor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Panel lateral de Cotización */}
      {showQuote && (
        <QuotePanel
          items={quote.quote.items}
          count={quote.count}
          onClose={() => setShowQuote(false)}
          onAdd={(id) => quote.addItem(id)}
          onRemove={(id) => quote.removeItem(id)}
          onSetQty={(id, qty) => quote.updateItemQuantity(id, qty)}
          onUpdateNotes={(id, notes) => quote.updateItemNotes(id, notes)}
        />
      )}
    </main>
  )
}
