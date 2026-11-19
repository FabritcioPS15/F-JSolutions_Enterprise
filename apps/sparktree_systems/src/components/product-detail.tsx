'use client'

import Link from 'next/link'
import { storeUrl } from '@/lib/store-url'

type ProductDetailProps = {
  slug: string
}

export function ProductDetail({ slug }: ProductDetailProps) {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-foreground">Ficha del producto</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Las fichas de producto ahora se muestran en SparkTree Store.
      </p>
      <Link
        href={storeUrl(`/productos/${slug}`)}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#1769AA] px-5 text-sm font-semibold text-white transition hover:bg-[#12568C]"
      >
        Ver producto en la tienda
      </Link>
    </section>
  )
}
