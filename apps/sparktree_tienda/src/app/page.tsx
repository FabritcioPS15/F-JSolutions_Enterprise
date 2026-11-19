import Link from 'next/link'
import { ArrowRight, Headphones, Search, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/catalog'

export default function StoreHomePage() {
  const featured = products.slice(0, 4)

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
      <section className="py-14 text-center sm:py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-tint-blue px-4 py-1.5 text-xs font-semibold text-blue-ink">
          <Sparkles className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
          <span>SparkTree Store · Tienda especializada en hardware</span>
        </div>

        <h1 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-black leading-tight text-foreground sm:text-5xl">
          Equipamiento y tecnología empresarial con garantía oficial
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Tienda, stock referencial y pedidos de hardware para clientes particulares y empresas.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
          >
            Ver tienda
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink"
          >
            <Search className="size-4" aria-hidden="true" />
            Buscar producto
          </Link>
        </div>

        <div className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint-green text-success-ink">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">Garantía corporativa</p>
              <p className="text-[11px] text-muted-foreground">Equipos 100% originales</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint-blue text-blue-ink">
              <Truck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">Envíos a todo el Perú</p>
              <p className="text-[11px] text-muted-foreground">Entrega rápida y segura</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint-blue text-sky-ink">
              <Headphones className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">Soporte especializado</p>
              <p className="text-[11px] text-muted-foreground">Asesoría de ingenieros</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-heading text-xl font-black text-foreground">Destacados</h2>
          <Link href="/productos" className="text-[11px] font-bold text-blue-ink hover:underline">
            Ver toda la tienda
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
