'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Compass,
  FileText,
  Package,
  Scale,
  Search,
  Tag,
  Wrench,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { storeUrl } from '@/lib/store-url'
import { useQuote } from '@/lib/use-quote'
import {
  popularSearches,
  quickSearchLinks,
  searchSite,
  searchTypeGroupLabels,
  searchTypeOrder,
  type SiteSearchResult,
  type SiteSearchType,
} from '@/lib/site-search'

const typeIcons: Record<SiteSearchType, typeof Package> = {
  product: Package,
  system: Code2,
  service: Wrench,
  category: Tag,
  page: FileText,
  legal: Scale,
}

function ResultRow({ item }: { item: SiteSearchResult }) {
  const Icon = typeIcons[item.type]

  return (
    <Link
      href={item.href}
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition hover:border-[#2563EB]/40 hover:shadow-sm sm:gap-4"
    >
      {item.type === 'product' && item.image ? (
        <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt="" className="size-full object-cover" loading="lazy" />
        </span>
      ) : (
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-tint-blue text-blue-ink">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground transition group-hover:text-blue-ink">
          {item.title}
        </span>
        {item.description && (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.description}</span>
        )}
      </span>

      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/60 transition group-hover:text-blue-ink" />
    </Link>
  )
}

export function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const quote = useQuote()

  const q = (searchParams?.get('q') ?? '').trim()
  const [input, setInput] = useState(q)

  useEffect(() => {
    setInput(q)
  }, [q])

  const results = useMemo(() => searchSite(q), [q])

  const groups = useMemo(
    () =>
      searchTypeOrder
        .map((type) => ({
          type,
          label: searchTypeGroupLabels[type],
          items: results.filter((result) => result.type === type),
        }))
        .filter((group) => group.items.length > 0),
    [results],
  )

  const goToSearch = (term: string) => {
    const trimmed = term.trim()
    setInput(trimmed)
    router.push(trimmed ? `/buscar?q=${encodeURIComponent(trimmed)}` : '/buscar')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    goToSearch(input)
  }

  return (
    <main className="min-h-screen bg-muted text-foreground">
      <EnhancedHeader quoteCount={quote.count} />

      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1100px] items-center gap-2 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold hover:text-blue-ink">
            Inicio
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">Buscar</span>
        </div>
      </div>

      {/* Buscador */}
      <section className="bg-gradient-to-br from-[#0B1220] via-[#0B1220] to-[#1D4ED8]">
        <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7DD3FC]">
            Buscador
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Encuentra productos, servicios y soluciones
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Busca por palabra clave en todo el sitio: equipos del catálogo, soporte, infraestructura,
            desarrollo de software y páginas de la empresa.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ej. web, laptops, redes, soporte..."
                aria-label="Buscar en todo el sitio"
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-white/10 bg-card/95 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-sky-300/50 focus:ring-2 focus:ring-[#7DD3FC]/30"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              <Search className="size-4" />
              Buscar
            </button>
          </form>

          {!q && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Populares
              </span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => goToSearch(term)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-[#DBEAFE] transition hover:border-sky-300/50 hover:bg-white/10"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {q ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  {results.length === 1
                    ? '1 resultado para'
                    : `${results.length} resultados para`}{' '}
                  <span className="text-blue-ink">&quot;{q}&quot;</span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Coincidencias en productos, servicios, desarrollo de software y secciones.
                </p>
              </div>
              <Link
                href={storeUrl(`/productos?q=${encodeURIComponent(q)}`)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink"
              >
                Buscar en la tienda <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {groups.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-input bg-card p-8 text-center sm:p-10">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-tint-blue text-blue-ink">
                  <Search className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold">
                  No encontramos resultados para &quot;{q}&quot;
                </h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                  Revisa la ortografía o prueba con una palabra más general. También puedes explorar
                  el catálogo o hablar con un asesor.
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => goToSearch(term)}
                      className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Link
                    href={storeUrl('/productos')}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
                  >
                    Ver tienda <ArrowRight className="size-3.5" />
                  </Link>
                  <Link
                    href="/servicios"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink"
                  >
                    Ver servicios
                  </Link>
                  <Link
                    href="/contacto"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink"
                  >
                    Contactar a ventas
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-8">
                {groups.map((group) => {
                  const Icon = typeIcons[group.type]
                  return (
                    <section key={group.type}>
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-lg bg-tint-blue text-blue-ink">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <h3 className="text-base font-bold">{group.label}</h3>
                        <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {group.items.length}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-2.5">
                        {group.items.map((item) => (
                          <ResultRow key={item.id} item={item} />
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section>
              <h2 className="text-xl font-bold">Búsquedas populares</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Empieza con una de estas palabras clave para explorar el sitio.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => goToSearch(term)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink"
                  >
                    <Search className="size-3.5 text-muted-foreground" />
                    {term}
                  </button>
                ))}
              </div>

              <h2 className="mt-10 text-xl font-bold">Qué puedes encontrar</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Package, title: 'Productos', copy: 'Laptops, PCs, monitores, redes, impresoras y accesorios.' },
                  { icon: Wrench, title: 'Servicios TI', copy: 'Soporte técnico, mantenimiento e infraestructura.' },
                  { icon: Code2, title: 'Desarrollo de software', copy: 'Sistemas web, ERP, automatización e integraciones.' },
                  { icon: FileText, title: 'Secciones y legales', copy: 'Empresa, proyectos, contacto, preguntas y políticas.' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-border bg-card p-4"
                    >
                      <span className="grid size-9 place-items-center rounded-lg bg-tint-blue text-blue-ink">
                        <Icon className="size-4" />
                      </span>
                      <h3 className="mt-3 text-sm font-bold">{item.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.copy}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            <aside className="space-y-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <Compass className="size-4 text-blue-ink" /> Explorar
                </h3>
                <div className="mt-4 space-y-2">
                  {quickSearchLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5 transition hover:border-[#2563EB]/40 hover:bg-muted"
                    >
                      <span>
                        <span className="block text-xs font-bold text-foreground group-hover:text-blue-ink">
                          {link.label}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">{link.description}</span>
                      </span>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/60 group-hover:text-blue-ink" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
