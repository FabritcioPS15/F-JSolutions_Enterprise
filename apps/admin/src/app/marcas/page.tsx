'use client'

import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Building2,
  Package,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Modal } from '@/components/admin/modal'
import { ProductThumb } from '@/components/admin/product-thumb'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  Field,
  PageHeader,
  Select,
  btnPrimary,
  btnSecondary,
  iconButton,
  inputClass,
  textareaClass,
} from '@/components/admin/ui'
import { formatNumber, slugify } from '@/lib/admin/format'
import type { Brand, BrandStatus } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

type BrandDraft = {
  name: string
  slug: string
  description: string
  logo: string
  status: BrandStatus
  order: string
}

type EditTarget = { mode: 'create' } | { mode: 'edit'; id: string }

function toDraft(brand?: Brand): BrandDraft {
  return {
    name: brand?.name ?? '',
    slug: brand?.slug ?? '',
    description: brand?.description ?? '',
    logo: brand?.logo ?? '',
    status: brand?.status ?? 'active',
    order: String(brand?.order ?? 0),
  }
}

export default function MarcasPage() {
  const { products, brands, addBrand, updateBrand, removeBrand } = useAdmin()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | BrandStatus>('all')
  const [target, setTarget] = useState<EditTarget | null>(null)
  const [draft, setDraft] = useState<BrandDraft>(() => toDraft())
  const [slugTouched, setSlugTouched] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)

  const brandStats = useMemo(() => {
    const counts = new Map<string, { total: number; published: number }>()
    for (const product of products) {
      const entry = counts.get(product.brand) ?? { total: 0, published: 0 }
      entry.total += 1
      if (product.status === 'active') entry.published += 1
      counts.set(product.brand, entry)
    }

    const rows = [...brands]
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
      .map((brand) => ({
        brand,
        total: counts.get(brand.name)?.total ?? 0,
        published: counts.get(brand.name)?.published ?? 0,
      }))

    return {
      rows,
      inUse: rows.filter((row) => row.total > 0).length,
      inactive: brands.filter((brand) => brand.status === 'inactive').length,
      unassigned: products.filter((product) => !product.brand).length,
    }
  }, [brands, products])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return brandStats.rows.filter((row) => {
      if (statusFilter !== 'all' && row.brand.status !== statusFilter) return false
      if (!term) return true
      return (
        row.brand.name.toLowerCase().includes(term) ||
        row.brand.slug.toLowerCase().includes(term) ||
        row.brand.description.toLowerCase().includes(term)
      )
    })
  }, [brandStats.rows, search, statusFilter])

  const searching = search.trim().length > 0 || statusFilter !== 'all'

  function openCreate() {
    setDraft({ ...toDraft(), order: String(brands.length) })
    setSlugTouched(false)
    setTarget({ mode: 'create' })
  }

  function openEdit(brand: Brand) {
    setDraft(toDraft(brand))
    setSlugTouched(true)
    setTarget({ mode: 'edit', id: brand.id })
  }

  function updateDraft<K extends keyof BrandDraft>(key: K, value: BrandDraft[K]) {
    setDraft((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'name' && !slugTouched) next.slug = slugify(String(value))
      return next
    })
  }

  function handleSave() {
    if (!target) return
    const clean = draft.name.trim()
    if (!clean) {
      toast.error('Escribe un nombre', 'La marca no puede estar vacía.')
      return
    }

    const patch = {
      slug: draft.slug.trim() || slugify(clean),
      description: draft.description,
      logo: draft.logo,
      status: draft.status,
      order: Number(draft.order) || 0,
    }

    if (target.mode === 'create') {
      if (!addBrand(clean, patch)) {
        toast.error('Marca duplicada', `“${clean}” ya existe en el catálogo.`)
        return
      }
      toast.success('Marca creada', clean)
    } else {
      if (!updateBrand(target.id, { ...patch, name: clean })) {
        toast.error('No se pudo guardar', `“${clean}” ya existe en el catálogo.`)
        return
      }
      toast.success('Marca actualizada', clean)
    }

    setTarget(null)
  }

  function handleDelete() {
    if (!deleteTarget) return
    if (!removeBrand(deleteTarget.id)) {
      toast.error('No se puede eliminar', 'La marca tiene productos asociados.')
      return
    }
    toast.success('Marca eliminada', deleteTarget.name)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Catálogo"
        title="Marcas"
        description="Gestiona las marcas del catálogo, su visibilidad y los datos que se muestran en la tienda."
        actions={
          <button type="button" onClick={openCreate} className={btnPrimary}>
            <Plus className="size-4" aria-hidden="true" />
            Nueva marca
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Marcas registradas', value: brands.length, icon: Building2 },
          { label: 'Activas', value: brands.length - brandStats.inactive, icon: BadgeCheck },
          { label: 'Inactivas', value: brandStats.inactive, icon: Tag },
          { label: 'Con productos', value: brandStats.inUse, icon: Package },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading text-lg font-bold leading-none text-slate-900">
                  {formatNumber(item.value)}
                </p>
                <p className="mt-1 text-[10.5px] font-medium text-slate-500">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar marca, slug o descripción…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar marca"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as 'all' | BrandStatus)
              }
              aria-label="Filtrar por estado"
              className="sm:w-44"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </Select>
            <p className="text-[11px] text-slate-500">
              <span className="font-bold text-slate-900">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'marca visible' : 'marcas visibles'}
            </p>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={searching ? 'Sin coincidencias' : 'Sin marcas registradas'}
          description={
            searching
              ? 'No encontramos marcas con esos criterios. Prueba con otro término.'
              : 'Añade tu primera marca para empezar a clasificar productos.'
          }
          action={
            searching ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setStatusFilter('all')
                }}
                className={btnSecondary}
              >
                Limpiar filtros
              </button>
            ) : (
              <button type="button" onClick={openCreate} className={btnPrimary}>
                <Plus className="size-4" aria-hidden="true" />
                Nueva marca
              </button>
            )
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ brand, total, published }) => {
            const inUse = total > 0
            return (
              <article
                key={brand.id}
                className="group flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-blue-200 hover:shadow-sm"
              >
                <ProductThumb src={brand.logo} alt={`Logo de ${brand.name}`} className="size-11" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="truncate text-[13px] font-bold text-slate-900">{brand.name}</p>
                    {brand.status === 'inactive' && (
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                        Inactiva
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[10.5px] text-slate-500">
                    {brand.description || 'Sin descripción'}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-1.5 font-mono text-[9.5px] text-slate-400">
                    <span className="truncate">{brand.slug}</span>
                    <span className="font-sans text-slate-300">·</span>
                    <span className="font-sans font-semibold text-slate-600">
                      {total} {total === 1 ? 'producto' : 'productos'}
                    </span>
                    {inUse && (
                      <>
                        <span className="font-sans text-slate-300">·</span>
                        <span className="font-sans">
                          {published} {published === 1 ? 'publicado' : 'publicados'}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-0.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openEdit(brand)}
                    className={iconButton}
                    title="Editar marca"
                    aria-label={`Editar marca ${brand.name}`}
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(brand)}
                    disabled={inUse}
                    className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600 disabled:opacity-30')}
                    title={
                      inUse
                        ? `No se puede eliminar: tiene ${total} productos`
                        : 'Eliminar marca'
                    }
                    aria-label={`Eliminar marca ${brand.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {brandStats.unassigned > 0 && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-800">
          Hay <span className="font-bold">{brandStats.unassigned}</span>{' '}
          {brandStats.unassigned === 1 ? 'producto' : 'productos'} sin marca asignada. Edítalos
          desde Productos para completar su clasificación.
        </p>
      )}

      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title={target?.mode === 'create' ? 'Nueva marca' : 'Editar marca'}
        description="Los productos asociados se actualizan automáticamente si cambias el nombre."
        size="md"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setTarget(null)}>
              Cancelar
            </button>
            <button type="button" className={btnPrimary} onClick={handleSave} disabled={!draft.name.trim()}>
              {target?.mode === 'create' ? 'Crear marca' : 'Guardar cambios'}
            </button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="brand-name" required className="sm:col-span-2">
            <input
              id="brand-name"
              value={draft.name}
              onChange={(event) => updateDraft('name', event.target.value)}
              className={inputClass}
              placeholder="Ej. Logitech"
              autoFocus
            />
          </Field>

          <Field
            label="Slug"
            htmlFor="brand-slug"
            hint="Identificador para la URL pública. Debe ser único."
            className="sm:col-span-2"
          >
            <div className="flex gap-2">
              <input
                id="brand-slug"
                value={draft.slug}
                onChange={(event) => {
                  setSlugTouched(true)
                  updateDraft('slug', event.target.value)
                }}
                className={cn(inputClass, 'font-mono text-xs')}
                placeholder="logitech"
              />
              <button
                type="button"
                onClick={() => {
                  setSlugTouched(false)
                  setDraft((prev) => ({ ...prev, slug: slugify(prev.name) }))
                }}
                className={btnSecondary}
                disabled={!draft.name.trim()}
              >
                Generar
              </button>
            </div>
          </Field>

          <Field label="Descripción" htmlFor="brand-description" className="sm:col-span-2">
            <textarea
              id="brand-description"
              value={draft.description}
              onChange={(event) => updateDraft('description', event.target.value)}
              className={cn(textareaClass, 'min-h-20')}
              placeholder="Breve descripción de la marca para el catálogo."
            />
          </Field>

          <Field
            label="Logo (URL)"
            htmlFor="brand-logo"
            hint="Opcional. URL pública de una imagen."
            className="sm:col-span-2"
          >
            <input
              id="brand-logo"
              value={draft.logo}
              onChange={(event) => updateDraft('logo', event.target.value)}
              className={inputClass}
              placeholder="https://…/logo.png"
              inputMode="url"
            />
          </Field>

          <Field label="Estado" htmlFor="brand-status" hint="Inactiva no se ofrece en formularios nuevos.">
            <Select
              id="brand-status"
              value={draft.status}
              onChange={(event) => updateDraft('status', event.target.value as BrandStatus)}
            >
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </Select>
          </Field>

          <Field label="Orden" htmlFor="brand-order" hint="Menor número aparece primero.">
            <input
              id="brand-order"
              value={draft.order}
              onChange={(event) => updateDraft('order', event.target.value)}
              className={inputClass}
              inputMode="numeric"
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar marca"
        description={`Se eliminará “${deleteTarget?.name ?? ''}” del listado de marcas. Solo es posible si no tiene productos asociados.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
