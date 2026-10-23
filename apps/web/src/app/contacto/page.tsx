import type { Metadata } from 'next'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const metadata: Metadata = {
  title: 'Contacto | FJ Tech Solutions',
  description: 'Contáctanos para ventas corporativas, soporte técnico o asesoría gratuita.',
}

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <EnhancedHeader />
      <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">Contacto</h1>
        <p className="mt-4 text-lg text-[#475569]">Próximamente: formulario de contacto.</p>
      </section>
      <SiteFooter />
    </main>
  )
}
