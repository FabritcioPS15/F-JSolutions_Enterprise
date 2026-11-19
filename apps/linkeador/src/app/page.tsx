import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { ProfilePage } from '@/components/profile-page'
import { findLinkProfile } from '@/lib/link-profiles'
import { resolveBaseUrl } from '@/lib/og'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const profile = await findLinkProfile()
  if (!profile) return { title: 'Linkeador' }
  const baseUrl = resolveBaseUrl(await headers())
  const title = `${profile.name} | Linkeador`
  const description = profile.bio || 'Todos nuestros enlaces oficiales en un solo lugar.'
  const image = `/opengraph-image?v=${encodeURIComponent(profile.updatedAt)}`
  return {
    metadataBase: new URL(baseUrl),
    title: 'SparkTree Studio | Linkeador',
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: baseUrl,
      siteName: 'Linkeador',
      locale: 'es_PE',
      images: [
        { url: image, type: 'image/png', width: 1200, height: 630, alt: profile.name },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image, alt: profile.name }],
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
