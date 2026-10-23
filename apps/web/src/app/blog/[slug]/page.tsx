import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const metadata: Metadata = {
  title: 'Articulo | FJ Tech Solutions',
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <SiteHeader />
      <article className="mx-auto max-w-[860px] px-4 py-20 sm:px-6">
        <h1>Blog: {params.slug}</h1>
      </article>
      <SiteFooter />
    </main>
  )
}