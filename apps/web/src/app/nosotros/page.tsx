import type { Metadata } from 'next'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const metadata: Metadata = {
  title: 'Nosotros | FJ Tech Solutions',
  description: 'Conoce al equipo detrás de FJ Tech Solutions. Más de 10 años brindando tecnología de calidad a empresas en Lima, Perú.',
}

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <EnhancedHeader />
      <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">Sobre FJ Tech Solutions</h1>
        <p className="mt-4 text-lg text-[#475569]">Próximamente: historia, equipo y valores.</p>
      </section>
      <SiteFooter />
    </main>
  )
}
