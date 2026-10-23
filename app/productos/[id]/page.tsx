import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const metadata: Metadata = {
  title: 'Producto | FJ Tech Solutions',
}

export default function ProductoDetallePage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <SiteHeader />
      <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <h1>Producto #{params.id}</h1>
      </section>
      <SiteFooter />
    </main>
  )
}