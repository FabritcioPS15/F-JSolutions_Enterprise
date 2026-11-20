import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { EditorialHero } from '@/components/heroes'
import { HERO_CONTAINER } from '@/components/heroes/hero-primitives'

export const metadata: Metadata = {
  title: 'Blog | SparkTree Systems',
  description: 'Artículos y noticias sobre tecnología, soporte TI, ciberseguridad y más.',
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-card text-foreground">
      <EnhancedHeader />

      <EditorialHero
        id="hero-blog"
        eyebrow="Recursos"
        title={
          <>
            Blog de <span className="text-blue-ink">SparkTree Systems</span>
          </>
        }
        description="Artículos y noticias sobre tecnología, soporte TI, ciberseguridad y más."
        meta={['Próximamente']}
      />

      <section className={`${HERO_CONTAINER} pb-16`}>
        <div className="mx-auto max-w-[760px] rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-tint-blue text-blue-ink">
            <BookOpen className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-base font-bold text-foreground">
            Estamos preparando nuevos artículos
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">
            Muy pronto publicaremos recomendaciones y novedades tecnológicas para tu empresa.
          </p>
          <Link
            href="/servicios"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1769AA] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#12568C]"
          >
            Explorar servicios
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
