import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { ProfilePage } from '@/components/profile-page'
import { findLinkProfile } from '@/lib/link-profiles'
import { resolveBaseUrl } from '@/lib/og'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const profile = await findLinkProfile(slug)
  if (!profile) return { title: 'Página no encontrada | Linkeador' }
  const baseUrl = resolveBaseUrl(await headers())
  const canonical = `${baseUrl}/e/${profile.slug}`
  const title = `${profile.name} | Linkeador`
  const description = profile.bio || 'Todos nuestros enlaces oficiales en un solo lugar.'
  // El parámetro v fuerza a WhatsApp y otras redes a pedir la tarjeta nueva
  // después de cambiar el fondo o el logo en el panel.
  const image = `/e/${profile.slug}/opengraph-image?v=${encodeURIComponent(profile.updatedAt)}`
  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: canonical,
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

export default async function CompanyLinksPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const query = await searchParams
  const profile = await findLinkProfile(slug)
  if (!profile || (!profile.published && query.preview !== '1')) notFound()

  return <ProfilePage profile={profile} />
}
