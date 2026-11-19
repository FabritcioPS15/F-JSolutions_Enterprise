'use client'

import Link from 'next/link'
import { storeUrl } from '@/lib/store-url'

type CatalogPageProps = {
  initialQuery?: string
  initialCategory?: string
}

export function CatalogPage(_props: CatalogPageProps) {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-foreground">Catálogo de equipos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        El catálogo, las cotizaciones y tu cuenta ahora viven en SparkTree Store.
      </p>
      <Link
        href={storeUrl('/productos')}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#1769AA] px-5 text-sm font-semibold text-white transition hover:bg-[#12568C]"
      >
        Ver catálogo en la tienda
      </Link>
    </section>
  )
}
