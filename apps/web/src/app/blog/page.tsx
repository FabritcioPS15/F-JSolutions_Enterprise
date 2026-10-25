import type { Metadata } from 'next'
import { EnhancedHeader } from '@/components/layout/enhanced-header'

export const metadata: Metadata = {
  title: 'Blog | FJ Tech Solutions',
  description: 'Artículos y noticias sobre tecnología, soporte TI, ciberseguridad y más.',
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <EnhancedHeader />
      <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">Blog</h1>
        <p className="mt-4 text-lg text-[#475569]">Próximamente: artículos y noticias tecnológicas.</p>
      </section>
    </main>
  )
}
