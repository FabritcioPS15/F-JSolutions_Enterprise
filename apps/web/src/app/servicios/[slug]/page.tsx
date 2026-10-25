import type { Metadata } from 'next'
import { EnhancedHeader } from '@/components/layout/enhanced-header'

export const metadata: Metadata = {
  title: 'Servicio | FJ Tech Solutions',
}

export default function ServicioDetallePage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <EnhancedHeader />
      <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <h1>Servicio: <span className="font-mono">{params.slug}</span></h1>
      </section>
    </main>
  )
}