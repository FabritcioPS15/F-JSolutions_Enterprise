import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/catalog'
import { formatPrice } from '@/lib/catalog-query'

const availabilityLabels: Record<NonNullable<Product['availability']>, string> = {
  available: 'Disponible',
  limited: 'Stock limitado',
  consult: 'A consultar',
}

const availabilityStyles: Record<NonNullable<Product['availability']>, string> = {
  available: 'bg-tint-green text-success-ink ring-emerald-500/25',
  limited: 'bg-tint-amber text-warning-ink ring-amber-500/25',
  consult: 'bg-muted text-muted-foreground ring-border',
}

export function ProductCard({ product }: { product: Product }) {
  const price = formatPrice(product.price)
  const availability = product.availability ?? 'consult'

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-[#2563EB]/40 hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${availabilityStyles[availability]}`}
        >
          {availabilityLabels[availability]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-blue-ink">
          {product.brand}
        </p>
        <h2 className="line-clamp-2 text-sm font-bold text-foreground">{product.name}</h2>
        <p className="line-clamp-2 text-[11.5px] text-muted-foreground">
          {product.specs.slice(0, 2).join(' · ') || product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="text-sm font-black text-foreground">
            {price ?? <span className="text-xs font-semibold text-muted-foreground">Precio a consultar</span>}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-ink transition group-hover:gap-2">
            Ver ficha
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}
