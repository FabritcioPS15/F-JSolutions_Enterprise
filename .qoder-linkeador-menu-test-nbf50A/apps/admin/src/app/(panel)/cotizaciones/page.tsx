import { QuotesView } from '@/components/admin/quotes-view'

export default async function CotizacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  return <QuotesView initialQuery={params.q?.slice(0, 120) ?? ''} />
}
