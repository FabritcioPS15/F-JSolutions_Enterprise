import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogPage } from '@/components/catalog-page'

export const metadata: Metadata = {
  title: 'Tienda de equipos TI | SparkTree Store',
  description:
    'Laptops, servidores, componentes, redes, impresoras y accesorios con garantía corporativa.',
}

function CatalogFallback() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] animate-pulse rounded-2xl border border-border bg-card"
          />
        ))}
      </div>
    </main>
  )
}

export default function StoreCatalogRoute() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogPage />
    </Suspense>
  )
}
