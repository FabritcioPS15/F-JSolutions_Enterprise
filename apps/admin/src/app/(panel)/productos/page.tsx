import {
  ProductsView,
  type StatusFilter,
  type StockFilter,
} from '@/components/admin/products-view'

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ stock?: string; q?: string; status?: string }>
}) {
  const params = await searchParams
  const stock: StockFilter =
    params.stock === 'low'
      ? 'replenish'
      : params.stock === 'out' || params.stock === 'ok' || params.stock === 'replenish'
        ? params.stock
        : 'all'
  const status: StatusFilter =
    params.status === 'active' || params.status === 'draft' || params.status === 'archived'
      ? params.status
      : 'all'

  return (
    <ProductsView
      initialStock={stock}
      initialQuery={params.q?.slice(0, 120) ?? ''}
      initialStatus={status}
    />
  )
}
