import { permanentRedirect } from 'next/navigation'

const storeAppUrl = process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006'

export default async function ProductoDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  permanentRedirect(`${storeAppUrl}/productos/${encodeURIComponent(slug)}`)
}
