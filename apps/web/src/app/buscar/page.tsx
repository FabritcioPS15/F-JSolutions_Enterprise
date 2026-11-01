import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchPage } from '@/components/sections/search-page'

export const metadata: Metadata = {
  title: 'Buscar | F&J Systems',
  description: 'Busca productos, servicios, desarrollo de software y secciones de F&J Systems.',
  robots: { index: false, follow: true },
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <SearchPage />
    </Suspense>
  )
}
