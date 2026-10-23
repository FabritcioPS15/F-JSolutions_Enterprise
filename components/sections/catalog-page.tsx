'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  Headset,
  Package,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
  X,
} from 'lucide-react'
import { ProductCard } from '@/components/cards/product-card'
import { QuotePanel } from '@/components/sections/quote-panel'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { categories, products } from '@/lib/catalog'
import { useQuote } from '@/lib/use-quote'

const sortOptions = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'nombre', label: 'Nombre A-Z' },
  { value: 'nombre-desc', label: 'Nombre Z-A' },
]

type CatalogPageProps = {
  initialQuery?: string
  initialCategory?: string
}

export function CatalogPage({
  initialQuery = '',
  initialCategory = 'Todas',
}: CatalogPageProps) {
  const quote = useQuote()
  const [showQuote, setShowQuote] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [brand, setBrand] = useState('Todas')
  const [sort, setSort] = useState('relevancia')

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    setCategory(initialCategory)
  }, [initialCategory])

  const availableBrands = useMemo(
    () => Array.from(new Set(products.map((product) => product.brand))).sort(),
    [],
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = products.filter((product) => {
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        (product.model && product.model.toLowerCase().includes(term)) ||
        (product.sku && product.sku.toLowerCase().includes(term))
      const matchesCategory = category === 'Todas' || product.category === category
      const matchesBrand = brand === 'Todas' || product.brand === brand
      return matchesTerm && matchesCategory && matchesBrand
    })

    return [...list].sort((a, b) => {
      if (sort === 'nombre') return a.name.localeCompare(b.name)
      if (sort === 'nombre-desc') return b.name.localeCompare(a.name)
      return 0
    })
  }, [query, category, brand, sort])

  const resultsText =
    filtered.length === 1 ? '1 producto encontrado' : `${filtered.length} productos encontrados`

  const resetFilters = () => {
    setQuery('')
    setCategory('Todas')
    setBrand('Todas')
    setSort('relevancia')
  }

  const hasFilters = query !== '' || category !== 'Todas' || brand !== 'Todas'

  const filterProps = {
    query,
    setQuery,
    category,
    setCategory,
    brand,
    setBrand,
    brands: availableBrands,
    hasFilters,
    resetFilters,
  }

  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <SiteHeader quoteCount={quote.count} onQuoteClick={() => setShowQuote(true)} />

      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-[#475569] sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold hover:text-[#2563EB]">
            Inicio
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A]">Catálogo</span>
        </div>
      </div>

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
                Catálogo de productos
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#0F172A] sm:text-4xl">
                Encuentra la tecnología que necesitas
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
                Explora equipos, componentes y accesorios para tu hogar, oficina o empresa. Solicita
                una cotización personalizada con orientación para elegir.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-semibold text-[#475569]">
                <Package className="size-3.5 text-[#2563EB]" /> {products.length} productos
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-semibold text-[#475569]">
                <Truck className="size-3.5 text-[#2563EB]" /> Envío coordinado
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-semibold text-[#475569]">
                <ShieldCheck className="size-3.5 text-[#2563EB]" /> Garantía según producto
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-40 rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 font-heading text-sm font-bold text-[#0F172A]">
                  <SlidersHorizontal className="size-4 text-[#2563EB]" /> Filtros
                </p>
                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-bold text-[#2563EB] hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <CatalogFilters {...filterProps} />
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-[#475569]">{resultsText}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 text-xs font-bold text-[#0F172A] lg:hidden"
                >
                  <SlidersHorizontal className="size-4" /> Filtros
                  {hasFilters && <span className="size-2 rounded-full bg-[#2563EB]" />}
                </button>
                <label className="relative">
                  <span className="sr-only">Ordenar productos</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="h-10 appearance-none rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-9 text-xs font-bold text-[#0F172A] outline-none focus:border-[#2563EB]"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        Ordenar: {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#475569]" />
                </label>
              </div>
            </div>

            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {['Todas', ...categories].map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                    category === item
                      ? 'border-[#2563EB] bg-[#2563EB] text-white'
                      : 'border-[#E2E8F0] bg-white text-[#475569]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {filtered.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToQuote={quote.addItem} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
                  <Search className="size-6" />
                </span>
                <p className="mt-4 text-base font-bold text-[#0F172A]">
                  No encontramos productos con esos filtros
                </p>
                <p className="mt-1 text-sm text-[#475569]">
                  Prueba con otra búsqueda o solicita una cotización personalizada.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={resetFilters}
                    className="inline-flex h-10 items-center rounded-lg border border-[#E2E8F0] px-4 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC]"
                  >
                    Limpiar filtros
                  </button>
                  <Link
                    href="/cotizacion"
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563EB] px-4 text-xs font-bold text-white"
                  >
                    Cotizar a medida <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#2563EB]/20 bg-gradient-to-r from-[#EFF6FF] to-white p-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#F1F5F9] text-[#0E7490]">
                  <Headset className="size-5" />
                </span>
                <div>
                  <p className="font-heading text-sm font-bold">¿Compras para tu empresa?</p>
                  <p className="mt-1 text-xs leading-5 text-[#475569]">
                    Cotizamos por volumen, emitimos factura y coordinamos la entrega e instalación.
                  </p>
                </div>
              </div>
              <Link
                href="/cotizacion"
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#2563EB] px-4 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Solicitar cotización <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {filtersOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <div
            onClick={(event) => event.stopPropagation()}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-heading text-base font-bold text-[#0F172A]">
                <SlidersHorizontal className="size-4 text-[#2563EB]" /> Filtros
              </p>
              <button
                onClick={() => setFiltersOpen(false)}
                aria-label="Cerrar filtros"
                className="grid size-9 place-items-center rounded-full bg-[#F1F5F9] text-[#475569]"
              >
                <X className="size-4" />
              </button>
            </div>
            <CatalogFilters {...filterProps} />
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 h-11 w-full rounded-lg bg-[#2563EB] text-sm font-bold text-white"
            >
              Ver {filtered.length} productos
            </button>
          </div>
        </div>
      )}

      <SiteFooter />

      {showQuote && (
        <QuotePanel
          items={quote.quote.items}
          count={quote.count}
          onClose={() => setShowQuote(false)}
          onAdd={quote.addItem}
          onRemove={quote.removeItem}
          onSetQty={quote.updateItemQuantity}
          onUpdateNotes={quote.updateItemNotes}
        />
      )}
    </main>
  )
}

type CatalogFiltersProps = {
  query: string
  setQuery: (value: string) => void
  category: string
  setCategory: (value: string) => void
  brand: string
  setBrand: (value: string) => void
  brands: string[]
  hasFilters: boolean
  resetFilters: () => void
}

function CatalogFilters({
  query,
  setQuery,
  category,
  setCategory,
  brand,
  setBrand,
  brands,
  hasFilters,
  resetFilters,
}: CatalogFiltersProps) {
  return (
    <div className="mt-5 space-y-6">
      <div>
        <label className="relative block">
          <span className="sr-only">Buscar en el catálogo</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#475569]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar producto, marca, modelo o SKU..."
            className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
          />
        </label>
      </div>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#475569]">
          Categorías
        </p>
        <div className="mt-2 space-y-0.5">
          {['Todas', ...categories].map((item) => {
            const count =
              item === 'Todas'
                ? products.length
                : products.filter((product) => product.category === item).length
            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                  category === item
                    ? 'bg-[#2563EB]/10 font-bold text-[#2563EB]'
                    : 'text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="truncate">{item}</span>
                <span className="text-[10px] text-[#475569]">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#475569]">Marcas</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['Todas', ...brands].map((item) => (
            <button
              key={item}
              onClick={() => setBrand(item)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                brand === item
                  ? 'border-[#2563EB] bg-[#2563EB] text-white'
                  : 'border-[#E2E8F0] text-[#475569] hover:border-[#2563EB]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="h-10 w-full rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#475569] transition hover:bg-[#F8FAFC]"
        >
          Limpiar todos los filtros
        </button>
      )}
    </div>
  )
}
