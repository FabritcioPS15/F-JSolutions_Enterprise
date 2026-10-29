'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Archive,
  ArchiveRestore,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  PackageSearch,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { ProductThumb } from '@/components/admin/product-thumb'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  PageHeader,
  Select,
  StatusBadge,
  StatusToggle,
  StockBadge,
  btnGhost,
  btnPrimary,
  btnSecondary,
  iconButton,
  inputClass,
} from '@/components/admin/ui'
import {
  downloadFile,
  formatCurrency,
  formatDate,
  getMargin,
  getStockState,
  productsToCsv,
} from '@/lib/admin/format'
import type { AdminProduct, ProductStatus } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

export type StockFilter = 'all' | 'replenish' | 'out' | 'ok'
export type StatusFilter = 'all' | ProductStatus

type PageSize = 8 | 12 | 24 | 48
type BulkAction = 'publish' | 'unpublish' | 'archive' | 'delete'

const sortOptions = [
  { value: 'recent', label: 'Actualizados recientemente' },
  { value: 'created', label: 'Creados recientemente' },
  { value: 'name', label: 'Nombre A–Z' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'stock-asc', label: 'Stock: menor primero' },
]

const pageSizes: PageSize[] = [8, 12, 24, 48]

const bulkButton =
  'inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50'

function matchStock(product: AdminProduct, filter: StockFilter) {
  if (filter === 'all') return true
  if (product.status === 'archived') return false
  const state = getStockState(product)
  if (filter === 'replenish') return state !== 'ok'
  return state === filter
}

function SelectionCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  label: string
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="size-4 shrink-0 cursor-pointer rounded border-slate-300 accent-blue-600"
    />
  )
}

export function ProductsView({
  initialStock = 'all',
  initialQuery = '',
  initialStatus = 'all',
}: {
  initialStock?: StockFilter
  initialQuery?: string
  initialStatus?: StatusFilter
}) {
  const {
    products,
    categories,
    brands,
    settings,
    toggleProductStatus,
    setProductStatus,
    deleteProduct,
    duplicateProduct,
    bulkSetStatus,
    bulkDeleteProducts,
  } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState('all')
  const [brand, setBrand] = useState('all')
  const [status, setStatus] = useState<StatusFilter>(initialStatus)
  const [stock, setStock] = useState<StockFilter>(initialStock)
  const [sort, setSort] = useState('recent')
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(8)
  const [selected, setSelected] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)
  const [bulkConfirm, setBulkConfirm] = useState<{ action: 'archive' | 'delete'; count: number } | null>(
    null
  )

  useEffect(() => {
    setPage(1)
  }, [query, category, brand, status, stock, sort, pageSize])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = products.filter((product) => {
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        (product.internalCode ?? '').toLowerCase().includes(term) ||
        (product.model ?? '').toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        (product.subcategory ?? '').toLowerCase().includes(term)

      const matchesCategory = category === 'all' || product.category === category
      const matchesBrand = brand === 'all' || product.brand === brand
      const matchesStatus = status === 'all' || product.status === status

      return (
        matchesTerm &&
        matchesCategory &&
        matchesBrand &&
        matchesStatus &&
        matchStock(product, stock)
      )
    })

    return [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'es')
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'stock-asc') return a.stock - b.stock
      if (sort === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [products, query, category, brand, status, stock, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const visibleIds = visible.map((product) => product.id)
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id))
  const someVisibleSelected = visibleIds.some((id) => selected.includes(id))
  const selectedVisibleCount = selected.filter((id) => visibleIds.includes(id)).length

  const hasFilters =
    query !== '' ||
    category !== 'all' ||
    brand !== 'all' ||
    status !== 'all' ||
    stock !== 'all'

  function resetFilters() {
    setQuery('')
    setCategory('all')
    setBrand('all')
    setStatus('all')
    setStock('all')
    setSort('recent')
  }

  function toggleSelected(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function toggleVisibleSelection() {
    setSelected((prev) => {
      if (allVisibleSelected) return prev.filter((id) => !visibleIds.includes(id))
      return Array.from(new Set([...prev, ...visibleIds]))
    })
  }

  function handleToggle(product: AdminProduct) {
    if (product.status === 'archived') return
    toggleProductStatus(product.id)
    toast.success(
      product.status === 'active' ? 'Producto movido a borradores' : 'Producto publicado',
      product.name
    )
  }

  function handleArchive(product: AdminProduct) {
    setProductStatus(product.id, 'archived')
    toast.info('Producto archivado', `${product.name} salió del catálogo activo.`)
  }

  function handleRestore(product: AdminProduct) {
    setProductStatus(product.id, 'draft')
    toast.success('Producto restaurado', `${product.name} volvió como borrador.`)
  }

  function handleDuplicate(product: AdminProduct) {
    const copy = duplicateProduct(product.id)
    if (copy) toast.success('Producto duplicado', `Se creó “${copy.name}” como borrador.`)
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteProduct(deleteTarget.id)
    setSelected((prev) => prev.filter((id) => id !== deleteTarget.id))
    toast.success('Producto eliminado', deleteTarget.name)
    setDeleteTarget(null)
  }

  function handleExport() {
    downloadFile(
      `productos-fj-systems-${new Date().toISOString().slice(0, 10)}.csv`,
      productsToCsv(filtered),
      'text/csv;charset=utf-8;'
    )
    toast.success('Catálogo exportado', `${filtered.length} productos incluidos en el CSV.`)
  }

  function runBulk(action: BulkAction) {
    const ids = [...selected]
    if (ids.length === 0) return
    const count = ids.length

    if (action === 'publish') {
      bulkSetStatus(ids, 'active')
      toast.success('Productos publicados', `${count} ${count === 1 ? 'producto' : 'productos'} visibles en la tienda.`)
    } else if (action === 'unpublish') {
      bulkSetStatus(ids, 'draft')
      toast.info('Productos retirados', `${count} ${count === 1 ? 'producto pasó' : 'productos pasaron'} a borrador.`)
    } else if (action === 'archive') {
      bulkSetStatus(ids, 'archived')
      toast.info('Productos archivados', `${count} ${count === 1 ? 'producto' : 'productos'} fuera del catálogo activo.`)
    } else {
      bulkDeleteProducts(ids)
      toast.success('Productos eliminados', `${count} ${count === 1 ? 'producto' : 'productos'} eliminados del catálogo.`)
    }

    setSelected([])
    setBulkConfirm(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Catálogo"
        title="Productos"
        description="Administra precios, inventario, publicación y contenido de todo el catálogo."
        actions={
          <>
            <button
              type="button"
              onClick={handleExport}
              className={btnSecondary}
              aria-label="Exportar catálogo a CSV"
            >
              <Download className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
            <Link href="/productos/nuevo" className={btnPrimary}>
              <Plus className="size-4" aria-hidden="true" />
              Nuevo producto
            </Link>
          </>
        }
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full min-w-0 xl:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, SKU o código interno…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar productos"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex xl:shrink-0 xl:items-center">
            <Select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filtrar por categoría"
              className="sm:w-full xl:w-48"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((item) => (
                <option key={item.id} value={item.label}>
                  {item.label}
                </option>
              ))}
            </Select>

            <Select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              aria-label="Filtrar por marca"
              className="sm:w-full xl:w-44"
            >
              <option value="all">Todas las marcas</option>
              {[...brands]
                .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
                .map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                    {item.status === 'inactive' ? ' · Inactiva' : ''}
                  </option>
                ))}
            </Select>

            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              aria-label="Filtrar por estado"
              className="sm:w-full xl:w-44"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Publicados</option>
              <option value="draft">Borradores</option>
              <option value="archived">Archivados</option>
            </Select>

            <Select
              value={stock}
              onChange={(event) => setStock(event.target.value as StockFilter)}
              aria-label="Filtrar por stock"
              className="sm:w-full xl:w-36"
            >
              <option value="all">Todo el stock</option>
              <option value="replenish">Requiere reposición</option>
              <option value="out">Sin stock</option>
              <option value="ok">Stock saludable</option>
            </Select>

            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Ordenar productos"
              className="sm:w-full xl:w-48"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                title="Limpiar filtros"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="text-[11px] font-medium text-slate-500">
            <span className="font-bold text-slate-900">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'producto' : 'productos'}
            {hasFilters ? ' con los filtros aplicados' : ' en el catálogo'}
          </p>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setView('table')}
              className={cn(
                'inline-flex size-7 items-center justify-center rounded-md transition',
                view === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
              aria-label="Vista de tabla"
              aria-pressed={view === 'table'}
            >
              <List className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setView('grid')}
              className={cn(
                'inline-flex size-7 items-center justify-center rounded-md transition',
                view === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
              aria-label="Vista de tarjetas"
              aria-pressed={view === 'grid'}
            >
              <LayoutGrid className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3">
          <p className="text-xs font-semibold text-blue-900">
            {selected.length} {selected.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
            {selectedVisibleCount !== selected.length && (
              <span className="ml-1 font-medium text-blue-700/70">
                ({selectedVisibleCount} en esta página)
              </span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" className={bulkButton} onClick={() => runBulk('publish')}>
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              Publicar
            </button>
            <button type="button" className={bulkButton} onClick={() => runBulk('unpublish')}>
              <EyeOff className="size-3.5" aria-hidden="true" />
              Retirar
            </button>
            <button
              type="button"
              className={bulkButton}
              onClick={() => setBulkConfirm({ action: 'archive', count: selected.length })}
            >
              <Archive className="size-3.5" aria-hidden="true" />
              Archivar
            </button>
            <button
              type="button"
              className={cn(bulkButton, 'border-red-200 text-red-600 hover:bg-red-50')}
              onClick={() => setBulkConfirm({ action: 'delete', count: selected.length })}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Eliminar
            </button>
            <button
              type="button"
              className="ml-1 grid size-8 place-items-center rounded-lg text-blue-700 transition hover:bg-blue-100"
              onClick={() => setSelected([])}
              aria-label="Cancelar selección"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title={products.length === 0 ? 'Tu catálogo está vacío' : 'Sin resultados'}
          description={
            products.length === 0
              ? 'Crea tu primer producto para empezar a construir el catálogo de FJ Systems.'
              : 'No encontramos productos con esos criterios. Prueba limpiando los filtros o usando otro término.'
          }
          action={
            products.length === 0 ? (
              <Link href="/productos/nuevo" className={btnPrimary}>
                <Plus className="size-4" aria-hidden="true" />
                Crear producto
              </Link>
            ) : (
              <button type="button" onClick={resetFilters} className={btnSecondary}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Limpiar filtros
              </button>
            )
          }
        />
      ) : (
        <>
          <div
            className={cn(
              'overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs',
              view === 'grid' ? 'hidden' : 'hidden lg:block'
            )}
          >
            <div className="overflow-x-auto scrollbar-light">
              <table className="w-full min-w-[1010px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <th scope="col" className="w-10 px-3 py-3">
                      <SelectionCheckbox
                        checked={allVisibleSelected}
                        indeterminate={someVisibleSelected && !allVisibleSelected}
                        onChange={toggleVisibleSelection}
                        label="Seleccionar productos de esta página"
                      />
                    </th>
                    <th scope="col" className="min-w-[210px] px-2.5 py-3">Producto</th>
                    <th scope="col" className="px-2.5 py-3">SKU</th>
                    <th scope="col" className="px-2.5 py-3">Marca</th>
                    <th scope="col" className="px-2.5 py-3">Categoría</th>
                    <th scope="col" className="px-2.5 py-3 text-right">Precio</th>
                    <th scope="col" className="px-2.5 py-3">Stock</th>
                    <th scope="col" className="px-2.5 py-3">Estado</th>
                    <th scope="col" className="hidden px-2.5 py-3 2xl:table-cell">Actualizado</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((product) => {
                    const margin = getMargin(product)
                    const isSelected = selected.includes(product.id)
                    return (
                      <tr
                        key={product.id}
                        className={cn(
                          'group transition-colors hover:bg-slate-50/70',
                          isSelected && 'bg-blue-50/40'
                        )}
                      >
                        <td className="px-3 py-3">
                          <SelectionCheckbox
                            checked={isSelected}
                            onChange={() => toggleSelected(product.id)}
                            label={`Seleccionar ${product.name}`}
                          />
                        </td>
                        <td className="min-w-[210px] px-2.5 py-3">
                          <div className="flex items-center gap-3">
                            <Link href={`/productos/${product.id}`} className="shrink-0">
                              <ProductThumb
                                src={product.image}
                                alt={product.imageAlt || product.name}
                                className="size-11"
                              />
                            </Link>
                            <div className="min-w-0">
                              <Link
                                href={`/productos/${product.id}`}
                                className="line-clamp-1 text-[12.5px] font-semibold text-slate-900 transition hover:text-blue-600"
                                title={product.name}
                              >
                                {product.name}
                              </Link>
                              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                {product.model ?? product.internalCode ?? 'Sin código de modelo'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2.5 py-3">
                          <p className="font-mono text-[10.5px] text-slate-600">{product.sku}</p>
                          {product.internalCode && (
                            <p className="mt-0.5 font-mono text-[9.5px] text-slate-400">
                              {product.internalCode}
                            </p>
                          )}
                        </td>
                        <td className="px-2.5 py-3">
                          <p className="text-[11.5px] font-semibold text-slate-700">{product.brand}</p>
                        </td>
                        <td className="px-2.5 py-3">
                          <p className="max-w-[150px] truncate text-[11.5px] font-semibold text-slate-700">
                            {product.category}
                          </p>
                          <p className="mt-0.5 max-w-[150px] truncate text-[10px] text-slate-400">
                            {product.subcategory ?? 'Sin subcategoría'}
                          </p>
                        </td>
                        <td className="px-2.5 py-3 text-right">
                          <p className="whitespace-nowrap text-[12.5px] font-bold tabular-nums text-slate-900">
                            {product.price > 0
                              ? formatCurrency(product.price, settings.currency)
                              : 'A cotizar'}
                          </p>
                          {product.price > 0 && !product.showPrice ? (
                            <p className="mt-0.5 text-[9.5px] font-medium text-amber-600">
                              Oculto en tienda
                            </p>
                          ) : margin !== null ? (
                            <p
                              className={cn(
                                'mt-0.5 text-[10px] font-medium',
                                margin >= 20 ? 'text-emerald-600' : 'text-amber-600'
                              )}
                            >
                              Margen {margin.toFixed(0)}%
                            </p>
                          ) : null}
                        </td>
                        <td className="px-2.5 py-3">
                          <StockBadge stock={product.stock} minStock={product.minStock} compact />
                        </td>
                        <td className="px-2.5 py-3">
                          <div className="flex items-center gap-2">
                            {product.status !== 'archived' && (
                              <StatusToggle
                                active={product.status === 'active'}
                                onToggle={() => handleToggle(product)}
                                label={`Cambiar estado de ${product.name}`}
                              />
                            )}
                            <StatusBadge status={product.status} />
                          </div>
                        </td>
                        <td className="hidden whitespace-nowrap px-2.5 py-3 text-[11px] text-slate-500 2xl:table-cell">
                          {formatDate(product.updatedAt)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <div className="flex items-center justify-end gap-0.5">
                            <Link
                              href={`/productos/${product.id}`}
                              className={iconButton}
                              title="Ver detalle"
                              aria-label={`Ver detalle de ${product.name}`}
                            >
                              <Eye className="size-3.5" />
                            </Link>
                            <Link
                              href={`/productos/${product.id}/editar`}
                              className={iconButton}
                              title="Editar producto"
                              aria-label={`Editar ${product.name}`}
                            >
                              <Pencil className="size-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(product)}
                              className={iconButton}
                              title="Duplicar producto"
                              aria-label={`Duplicar ${product.name}`}
                            >
                              <Copy className="size-3.5" />
                            </button>
                            {product.status === 'archived' ? (
                              <button
                                type="button"
                                onClick={() => handleRestore(product)}
                                className={iconButton}
                                title="Restaurar como borrador"
                                aria-label={`Restaurar ${product.name}`}
                              >
                                <ArchiveRestore className="size-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleArchive(product)}
                                className={iconButton}
                                title="Archivar producto"
                                aria-label={`Archivar ${product.name}`}
                              >
                                <Archive className="size-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(product)}
                              className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600')}
                              title="Eliminar producto"
                              aria-label={`Eliminar ${product.name}`}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className={cn(
              'grid gap-4 sm:grid-cols-2',
              view === 'grid' ? 'xl:grid-cols-3 2xl:grid-cols-4' : 'lg:hidden'
            )}
          >
            {visible.map((product) => {
              const margin = getMargin(product)
              const isSelected = selected.includes(product.id)
              return (
                <article
                  key={product.id}
                  className={cn(
                    'group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md',
                    isSelected ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200/80'
                  )}
                >
                  <div className="relative">
                    <Link href={`/productos/${product.id}`} className="block">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 p-4">
                        <ProductThumb
                          src={product.image}
                          alt={product.imageAlt || product.name}
                          className="size-full object-contain"
                        />
                      </div>
                    </Link>
                    <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                      <StatusBadge status={product.status} />
                      {product.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white shadow-sm">
                          Destacado
                        </span>
                      )}
                    </div>
                    <div className="absolute right-3 top-3">
                      <StockBadge stock={product.stock} minStock={product.minStock} compact />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      {product.brand}
                    </p>
                    <Link
                      href={`/productos/${product.id}`}
                      className="mt-1 line-clamp-2 min-h-[38px] font-heading text-[13.5px] font-bold leading-snug text-slate-900 transition hover:text-blue-600"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 truncate text-[10.5px] text-slate-400">
                      {product.category}
                      {product.subcategory ? ` · ${product.subcategory}` : ''}
                    </p>

                    <div className="mt-3 flex items-end justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold tabular-nums text-slate-900">
                          {product.price > 0 ? formatCurrency(product.price, settings.currency) : 'A cotizar'}
                        </p>
                        <p className="mt-0.5 font-mono text-[9.5px] text-slate-400">
                          {product.sku}
                          {product.internalCode ? ` · ${product.internalCode}` : ''}
                        </p>
                      </div>
                      {product.price > 0 && !product.showPrice ? (
                        <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          Precio oculto
                        </span>
                      ) : margin !== null ? (
                        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                          {margin.toFixed(0)}% margen
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
                      <SelectionCheckbox
                        checked={isSelected}
                        onChange={() => toggleSelected(product.id)}
                        label={`Seleccionar ${product.name}`}
                      />
                      <Link
                        href={`/productos/${product.id}/editar`}
                        className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(product)}
                        className={cn(iconButton, 'border border-slate-200 bg-white')}
                        title="Duplicar"
                        aria-label={`Duplicar ${product.name}`}
                      >
                        <Copy className="size-3.5" />
                      </button>
                      {product.status === 'archived' ? (
                        <button
                          type="button"
                          onClick={() => handleRestore(product)}
                          className={cn(iconButton, 'border border-slate-200 bg-white')}
                          title="Restaurar como borrador"
                          aria-label={`Restaurar ${product.name}`}
                        >
                          <ArchiveRestore className="size-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleArchive(product)}
                          className={cn(iconButton, 'border border-slate-200 bg-white')}
                          title="Archivar"
                          aria-label={`Archivar ${product.name}`}
                        >
                          <Archive className="size-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className={cn(
                          iconButton,
                          'border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600'
                        )}
                        title="Eliminar"
                        aria-label={`Eliminar ${product.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs sm:flex-row">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-[11px] text-slate-500">
                Mostrando{' '}
                <span className="font-semibold text-slate-900">
                  {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, filtered.length)}
                </span>{' '}
                de <span className="font-semibold text-slate-900">{filtered.length}</span>
              </p>
              <label className="flex items-center gap-2 text-[11px] text-slate-500">
                Filas por página
                <Select
                  value={String(pageSize)}
                  onChange={(event) => setPageSize(Number(event.target.value) as PageSize)}
                  aria-label="Filas por página"
                  className="h-8 w-[74px] text-xs"
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={cn(btnGhost, 'border border-slate-200 bg-white disabled:opacity-40')}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Anterior
              </button>
              <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-900 px-2 text-[11px] font-bold tabular-nums text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={cn(btnGhost, 'border border-slate-200 bg-white disabled:opacity-40')}
              >
                Siguiente
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar producto"
        description={`Esta acción quitará “${deleteTarget?.name ?? ''}” del catálogo local. No se puede deshacer.`}
        confirmLabel="Eliminar definitivamente"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(bulkConfirm)}
        title={bulkConfirm?.action === 'delete' ? 'Eliminar productos' : 'Archivar productos'}
        description={
          bulkConfirm?.action === 'delete'
            ? `Se eliminarán ${bulkConfirm?.count ?? 0} productos del catálogo local. No se puede deshacer.`
            : `Se archivarán ${bulkConfirm?.count ?? 0} productos y saldrán del catálogo activo. Puedes restaurarlos después.`
        }
        confirmLabel={bulkConfirm?.action === 'delete' ? 'Eliminar definitivamente' : 'Archivar productos'}
        destructive={bulkConfirm?.action === 'delete'}
        onConfirm={() => bulkConfirm && runBulk(bulkConfirm.action)}
        onClose={() => setBulkConfirm(null)}
      />
    </div>
  )
}
