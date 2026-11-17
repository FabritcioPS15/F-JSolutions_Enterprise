import { ProductDetail } from '@/components/admin/product-detail'

export default async function DetalleProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ProductDetail id={id} />
}
