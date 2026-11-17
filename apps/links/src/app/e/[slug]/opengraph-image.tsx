import { headers } from 'next/headers'
import { findLinkProfile } from '@/lib/link-profiles'
import { profileOgImage, resolveBaseUrl } from '@/lib/og'

export const alt = 'Página de enlaces'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-dynamic'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const profile = await findLinkProfile(slug)
  if (!profile) return new Response('No encontrado', { status: 404 })
  return profileOgImage(profile, resolveBaseUrl(await headers()))
}
