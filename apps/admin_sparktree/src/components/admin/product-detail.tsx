'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Copy,
  EyeOff,
  Globe,
  Package,
  PackageSearch,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { startAdminNavigation } from '@/components/admin/navigation-progress'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { ProductThumb } from '@/components/admin/product-thumb'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  LoadingState,
  PageHeader,
  SectionCard,
  StatusBadge,
  StockBadge,
  btnPrimary,
  btnSecondary,
} from '@/components/admin/ui'
import {
  availabilityDescriptions,
  availabilityLabels,
  formatCurrency,
  formatDate,
  formatDateTime,
  getMargin,
  statusDescriptions,
} from '@/lib/admin/format'
import { cn } from '@/lib/utils'

const storeUrl = process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3000'

export function ProductDetail({ id }: { id: string }) {
  const {
    products,
    hydrated,
    settings,
    setProductStatus,
    duplicateProduct,
    deleteProduct,
  } = useAdmin()
  const router = useRouter()
  const toast = useToast()
  const [activeImage, setActiveImage] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const product = products.find((item) => item.id === id)

  useEffect(() => {
    setActiveImage(0)
  }, [id])

  if (!hydrated) {
    return <LoadingState label="Cargando producto…" />
  }

  if (!product) {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Catálogo"
          title="Producto no encontrado"
          description="El producto que buscas no existe o fue eliminado del almacenamiento local."
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

  const gallery = [product.image, ...product.images].filter(Boolean)
  const margin = getMargin(product)
  const priceVisible = product.showPrice && product.price > 0
  const publicUrl = `${storeUrl}/productos/${product.slug}`

  function handleTogglePublish() {
    if (!product) return
    const next = product.status === 'active' ? 'draft' : 'active'
    setProductStatus(product.id, next)
    toast.success(
      next === 'active' ? 'Producto publicado' : 'Producto retirado de publicación',
      product.name
    )
  }

  function handleArchive() {
    if (!product) return
    setProductStatus(product.id, 'archived')
    toast.info('Producto archivado', `${product.name} salió del catálogo activo.`)
  }

  function handleRestore() {
    if (!product) return
    setProductStatus(product.id, 'draft')
    toast.success('Producto restaurado', `${product.name} volvió como borrador.`)
  }

  function handleDuplicate() {
    if (!product) return
    const copy = duplicateProduct(product.id)
    if (!copy) return
    toast.success('Producto duplicado', `Se creó “${copy.name}” como borrador.`)
    startAdminNavigation()
    router.push(`/productos/${copy.id}/editar`)
  }

  function handleDelete() {
    if (!product) return
    deleteProduct(product.id)
    toast.success('Producto eliminado', product.name)
    setConfirmDelete(false)
    startAdminNavigation()
    router.push('/productos')
  }

  return (
    <div className="space-y-5">
      <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/productos"
          className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground transition hover:text-brand-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Productos
        </Link>
        <ChevronRight className="size-3.5 text-muted-foreground/60" aria-hidden="true" />
        <span className="truncate font-semibold text-foreground">{product.name}</span>
      </nav>

      <PageHeader
        eyebrow="Detalle del producto"
        title={product.name}
        description={product.shortDescription || product.description}
        actions={
          <>
            <Link href={`/productos/${product.id}/editar`} className={btnPrimary}>
              <Pencil className="size-4" aria-hidden="true" />
              Editar producto
            </Link>
            {product.status === 'active' && (
              <a href={publicUrl} target="_blank" rel="noreferrer" className={btnSecondary}>
                <ArrowUpRight className="size-4" aria-hidden="true" />
                Ver en tienda
              </a>
            )}
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={product.status} />
        {product.featured && (
          <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white">
            Destacado
          </span>
        )}
        <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
          {product.sku}
        </span>
        <span className="text-[11px] text-muted-foreground">
          Actualizado el {formatDate(product.updatedAt)}
        </span>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
            <div className="relative aspect-[4/3] bg-muted p-6 sm:aspect-[16/10]">
              <ProductThumb
                src={gallery[activeImage] ?? ''}
                alt={product.imageAlt || product.name}
                className="size-full object-contain"
              />
              <span className="absolute left-4 top-4">
                <StockBadge stock={product.stock} minStock={product.minStock} compact />
              </span>
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-border p-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image.slice(0, 24)}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                    aria-pressed={activeImage === index}
                    className={cn(
                      'size-16 shrink-0 overflow-hidden rounded-lg border bg-muted p-1 transition',
                      activeImage === index
                        ? 'border-[#5946A6] ring-2 ring-[#5946A6]/20'
                        : 'border-border hover:border-input'
                    )}
                  >
                    <ProductThumb src={image} alt={`Imagen ${index + 1}`} className="size-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <SectionCard title="Información general" icon={Package}>
            <div className="space-y-4">
              {product.shortDescription &&
                product.shortDescription.trim() !== product.description.trim() && (
                  <p className="text-sm font-medium leading-relaxed text-foreground/80">
                    {product.shortDescription}
                  </p>
                )}
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description || 'Sin descripción completa registrada.'}
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Especificaciones técnicas"
            description="Características declaradas en la ficha del producto."
            icon={Package}
          >
            {product.specs.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Este producto todavía no tiene especificaciones registradas.
              </p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.specs.map((spec, index) => (
                  <li
                    key={`${spec}-${index}`}
                    className="flex items-start gap-2 rounded-xl bg-muted px-3 py-2.5 text-[11.5px] leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-slate-400" />
                    {spec}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="SEO y buscadores"
            description="Metadatos registrados para la ficha pública."
            icon={Globe}
          >
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="truncate text-[11px] text-success-ink">
                fjsystems.pe › productos › {product.slug}
              </p>
              <p className="mt-1 line-clamp-2 text-[15px] font-medium leading-snug text-brand-ink">
                {product.seoTitle || product.name}
              </p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {product.seoDescription || product.shortDescription || product.description}
              </p>
            </div>
            <dl className="mt-4 grid gap-3 text-[11px] sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-muted-foreground">Título SEO</dt>
                <dd className="mt-0.5 text-foreground/80">{product.seoTitle || 'Sin definir (se usará el nombre)'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted-foreground">Meta descripción</dt>
                <dd className="mt-0.5 text-foreground/80">
                  {product.seoDescription || 'Sin definir (se usará el resumen)'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold text-muted-foreground">Texto alternativo de la imagen</dt>
                <dd className="mt-0.5 text-foreground/80">{product.imageAlt || 'Sin definir'}</dd>
              </div>
            </dl>
          </SectionCard>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Precio referencial
            </p>
            <p className="mt-1.5 font-heading text-[26px] font-bold leading-none text-foreground">
              {priceVisible ? formatCurrency(product.price, settings.currency) : 'A cotizar'}
            </p>
            <p className="mt-2 text-[10.5px] text-muted-foreground">
              {product.price <= 0
                ? 'El producto se cotiza según la necesidad del cliente.'
                : product.showPrice
                  ? 'Precio visible en el catálogo público.'
                  : 'Precio oculto en el catálogo público.'}
            </p>
            {product.commercialMessage && (
              <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-[10.5px] leading-relaxed text-muted-foreground">
                {product.commercialMessage}
              </p>
            )}
            {margin !== null && (
              <p className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[10.5px] text-muted-foreground">
                Margen interno
                <span className={cn('font-bold', margin >= 20 ? 'text-success-ink' : 'text-warning-ink')}>
                  {margin.toFixed(1)}%
                </span>
              </p>
            )}
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
              <StockBadge stock={product.stock} minStock={product.minStock} />
              <span className="text-[10.5px] text-muted-foreground">
                {availabilityLabels[product.availability]}
              </span>
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              {availabilityDescriptions[product.availability]} · mínimo {product.minStock} uds.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Clasificación
            </p>
            <dl className="mt-3 space-y-2.5 text-[11px]">
              {[
                { label: 'SKU', value: product.sku, mono: true },
                { label: 'Código interno', value: product.internalCode, mono: true },
                { label: 'Modelo', value: product.model, mono: true },
                { label: 'Marca', value: product.brand },
                { label: 'Categoría', value: product.category },
                { label: 'Subcategoría', value: product.subcategory },
                { label: 'Tipo', value: product.subSubcategory },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
                  <dd
                    className={cn(
                      'text-right text-foreground/80',
                      row.mono && 'font-mono text-[10.5px]',
                      !row.value && 'text-muted-foreground/60'
                    )}
                  >
                    {row.value || '—'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Publicación
              </p>
              <StatusBadge status={product.status} />
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-muted-foreground">
              {statusDescriptions[product.status]}
            </p>

            {product.status === 'active' && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-[11px] font-semibold text-muted-foreground transition hover:bg-muted"
              >
                Ver ficha pública
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            )}

            <dl className="mt-3 space-y-1.5 border-t border-border pt-3 text-[10.5px]">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Creado</dt>
                <dd className="text-muted-foreground">{formatDateTime(product.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Actualizado</dt>
                <dd className="text-muted-foreground">{formatDateTime(product.updatedAt)}</dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2">
              {product.status !== 'archived' && (
                <button
                  type="button"
                  onClick={handleTogglePublish}
                  className={cn(btnSecondary, 'w-full justify-start')}
                >
                  {product.status === 'active' ? (
                    <EyeOff className="size-4 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="size-4 text-muted-foreground" aria-hidden="true" />
                  )}
                  {product.status === 'active' ? 'Retirar de publicación' : 'Publicar producto'}
                </button>
              )}
              {product.status === 'archived' ? (
                <button
                  type="button"
                  onClick={handleRestore}
                  className={cn(btnSecondary, 'w-full justify-start')}
                >
                  <ArchiveRestore className="size-4 text-muted-foreground" aria-hidden="true" />
                  Restaurar como borrador
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleArchive}
                  className={cn(btnSecondary, 'w-full justify-start')}
                >
                  <Archive className="size-4 text-muted-foreground" aria-hidden="true" />
                  Archivar producto
                </button>
              )}
              <button
                type="button"
                onClick={handleDuplicate}
                className={cn(btnSecondary, 'w-full justify-start')}
              >
                <Copy className="size-4 text-muted-foreground" aria-hidden="true" />
                Duplicar producto
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex h-10 w-full items-center justify-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-sm font-semibold text-danger-ink transition hover:bg-red-500/15"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Eliminar producto
              </button>
            </div>
          </div>

          <p className="rounded-2xl border border-border bg-muted px-4 py-3 text-[10px] leading-relaxed text-muted-foreground">
            Esta ficha se guarda en el almacenamiento local del navegador. El enlace público apunta
            a la tienda configurada y estará disponible cuando el catálogo se sincronice.
          </p>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar producto"
        description={`Esta acción quitará “${product.name}” del catálogo local. No se puede deshacer.`}
        confirmLabel="Eliminar definitivamente"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(false)}
      />
    </div>
  )
}
