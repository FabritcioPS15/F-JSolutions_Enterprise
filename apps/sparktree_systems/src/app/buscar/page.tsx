import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchPage } from '@/components/sections/search-page'

export const metadata: Metadata = {
  title: 'Buscar | SparkTree Systems',
  description: 'Busca servicios, desarrollo de software, categorías y secciones de SparkTree Systems.',
  robots: { index: false, follow: true },
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted" />}>
      <SearchPage />
    </Suspense>
  )
}
