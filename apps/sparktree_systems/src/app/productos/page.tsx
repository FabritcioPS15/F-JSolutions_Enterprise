import { permanentRedirect } from 'next/navigation'

const storeAppUrl = process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function ProductosPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && value) search.set(key, value)
  }

  const query = search.toString()
  permanentRedirect(`${storeAppUrl}/productos${query ? `?${query}` : ''}`)
}
