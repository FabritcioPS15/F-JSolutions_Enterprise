import { redirect } from 'next/navigation'

const storeAppUrl = (process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006').replace(/\/$/, '')

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function LoginRedirect({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && value) query.set(key, value)
  }

  const qs = query.toString()
  redirect(`${storeAppUrl}/login${qs ? `?${qs}` : ''}`)
}
