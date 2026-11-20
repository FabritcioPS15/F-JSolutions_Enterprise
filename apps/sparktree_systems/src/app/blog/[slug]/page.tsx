import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { HERO_BODY, HeroLead, HeroTitle } from '@/components/heroes/hero-primitives'

export const metadata: Metadata = {
  title: 'Articulo | SparkTree Systems',
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-card text-foreground">
      <EnhancedHeader />
      <article className={`mx-auto w-full max-w-[860px] px-4 sm:px-6 ${HERO_BODY}`}>
        <Link
          href="/blog"
          className="hero-reveal inline-flex items-center gap-1.5 rounded-md text-[11px] font-semibold text-muted-foreground transition hover:text-blue-ink"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Volver al blog
        </Link>
        <HeroTitle size="lg" className="max-w-none">
          Blog: {params.slug}
        </HeroTitle>
        <HeroLead>Este artículo estará disponible próximamente.</HeroLead>
      </article>
    </main>
  )
}
