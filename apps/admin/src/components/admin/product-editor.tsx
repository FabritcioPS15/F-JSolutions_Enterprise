'use client'

import Link from 'next/link'
import { PackageSearch } from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { ProductForm } from '@/components/admin/product-form'
import { EmptyState, LoadingState, PageHeader, btnPrimary } from '@/components/admin/ui'

export function ProductEditor({ id }: { id: string }) {
  const { products, hydrated } = useAdmin()
  const product = products.find((item) => item.id === id)

  if (!hydrated) {
    return <LoadingState label="Cargando producto…" />
  }

  if (!product) {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Catálogo"
          title="Producto no encontrado"
          description="El producto que intentas editar no existe o fue eliminado del almacenamiento local."
          actions={
            <Link href="/productos" className={btnPrimary}>
              Volver a productos
            </Link>
          }
        />
        <EmptyState
          icon={PackageSearch}
          title="No encontramos este producto"
          description="Revisa el listado del catálogo o crea un producto nuevo."
          action={
            <Link href="/productos/nuevo" className={btnPrimary}>
              Crear producto
            </Link>
          }
        />
      </div>
    )
  }

  return <ProductForm mode="edit" product={product} />
}
