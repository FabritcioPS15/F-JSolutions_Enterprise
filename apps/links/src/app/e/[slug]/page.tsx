import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProfilePage } from '@/components/profile-page'
import { findLinkProfile } from '@/lib/link-profiles'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const profile = await findLinkProfile(slug)
  if (!profile) return { title: 'Página no encontrada | Linkeador' }
  const title = `${profile.name} | Linkeador`
  const description = profile.bio || 'Todos nuestros enlaces oficiales en un solo lugar.'
  const image = `/e/${profile.slug}/opengraph-image`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [{ url: image, width: 1200, height: 630, alt: profile.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function CompanyLinksPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const query = await searchParams
  const profile = await findLinkProfile(slug)
  if (!profile || (!profile.published && query.preview !== '1')) notFound()

  return <ProfilePage profile={profile} />
}
