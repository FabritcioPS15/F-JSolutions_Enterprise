import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProfilePage } from '@/components/profile-page'
import { findLinkProfile } from '@/lib/link-profiles'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const profile = await findLinkProfile()
  if (!profile) return { title: 'All My Links' }
  const title = `${profile.name} | All My Links`
  const description = profile.bio || 'Todos nuestros enlaces oficiales en un solo lugar.'
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: profile.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  }
}

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const preview = params.preview === '1'
  const profile = await findLinkProfile()
  if (!profile || (!profile.published && !preview)) notFound()

  return <ProfilePage profile={profile} />
}
