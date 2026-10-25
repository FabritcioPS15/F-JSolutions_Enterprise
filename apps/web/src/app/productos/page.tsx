import { Suspense } from 'react'
import { CatalogPage } from '@/components/sections/catalog-page'

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc]" />}>
      <CatalogPage />
    </Suspense>
  )
}
