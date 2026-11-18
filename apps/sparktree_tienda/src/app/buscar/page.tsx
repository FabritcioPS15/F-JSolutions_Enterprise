import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Search } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { listCategories } from '@/lib/catalog-query'
import { products } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Buscar productos | F&J Store',
  description: 'Busca laptops, servidores, redes, componentes y accesorios en la tienda de F&J.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function StoreSearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const raw = params.q
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? ''

  // Los resultados se muestran siempre en el catálogo para conservar filtros y orden.
  if (q) redirect(`/productos?q=${encodeURIComponent(q)}`)

  const categories = [...listCategories()].sort((a, b) => b.count - a.count).slice(0, 6)
  const featured = products.slice(0, 4)

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-ink">Búsqueda</p>
        <h1 className="mt-2 font-heading text-3xl font-black text-foreground sm:text-4xl">
          Encuentra tu próximo equipo
        </h1>
        <form action="/productos" className="mt-6 flex items-center gap-2">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-3">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              autoFocus
              placeholder="Ej. laptop Lenovo, switch TP-Link, SSD 1TB"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-[#2563EB] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
          >
            Buscar
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
          Categorías populares
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/productos?categoria=${encodeURIComponent(category.value)}`}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-muted-foreground transition hover:border-[#2563EB]/30 hover:text-blue-ink"
            >
              {category.label}
            </Link>
          ))}
        </div>

        <h2 className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
          Sugerencias
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
