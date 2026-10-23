import type { Metadata } from 'next'
import { ProductDetail } from '@/components/product-detail'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  return {
    title: 'Producto | FJ Tech Solutions',
  }
}

export default async function ProductoDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <ProductDetail slug={slug} />
}
