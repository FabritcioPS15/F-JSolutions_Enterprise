'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown,
  FolderTree,
  Layers,
  Package,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { CategoryGlyph } from '@/components/admin/category-icon'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Modal } from '@/components/admin/modal'
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
import type { Category, CategoryStatus } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

type NodeKind = 'category' | 'subcategory' | 'type'

type AddTarget =
  | { kind: 'category' }
  | { kind: 'subcategory'; categoryId: string; categoryLabel: string }
  | { kind: 'type'; categoryId: string; categoryLabel: string; subcategoryId: string; subcategoryLabel: string }

type EditTarget = {
  kind: NodeKind
  id: string
  label: string
  categoryId: string
  categoryLabel: string
  subcategoryId?: string
  subcategoryLabel?: string
}

type DeleteTarget = {
  kind: NodeKind
  label: string
  categoryId: string
  subcategoryId?: string
  subSubcategoryId?: string
}

type CategoryDraft = {
  label: string
  slug: string
  description: string
  image: string
  status: CategoryStatus
  order: string
}

function toCategoryDraft(category: Category): CategoryDraft {
  return {
    label: category.label,
    slug: category.slug,
    description: category.description,
    image: category.image,
    status: category.status,
    order: String(category.order),
  }
}

const kindLabels: Record<NodeKind, string> = {
  category: 'categoría',
  subcategory: 'subcategoría',
  type: 'tipo',
}

const addPlaceholders: Record<NodeKind, string> = {
  category: 'Ej. Cámaras de seguridad',
  subcategory: 'Ej. Winsurf',
  type: 'Ej. Modelos 4K',
}

function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

export default function CategoriasPage() {
  const {
    hydrated,
    products,
    categories,
    addCategory,
    updateCategory,
    renameCategory,
    removeCategory,
    addSubcategory,
    renameSubcategory,
    removeSubcategory,
    addSubSubcategory,
    renameSubSubcategory,
    removeSubSubcategory,
  } = useAdmin()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CategoryStatus>('all')
  const [expanded, setExpanded] = useState<string[]>([])
  const [addTarget, setAddTarget] = useState<AddTarget | null>(null)
  const [name, setName] = useState('')
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [editName, setEditName] = useState('')
  const [metaTarget, setMetaTarget] = useState<Category | null>(null)
  const [metaDraft, setMetaDraft] = useState<CategoryDraft | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!hydrated || initialized.current || categories.length === 0) return
    initialized.current = true
    setExpanded(categories.slice(0, 2).map((category) => category.id))
  }, [hydrated, categories])

  const stats = useMemo(() => {
    const subcategories = categories.reduce((total, category) => total + category.subcategories.length, 0)
    const types = categories.reduce(
      (total, category) =>
        total +
        category.subcategories.reduce(
          (sum, sub) => sum + sub.subSubcategories.length,
          0
        ),
      0
    )
    return {
      categories: categories.length,
      subcategories,
      types,
      classified: products.filter((product) => product.category).length,
    }
  }, [categories, products])

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...categories]
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
      .filter((category) => {
        if (statusFilter !== 'all' && category.status !== statusFilter) return false
        if (!term) return true
        if (category.label.toLowerCase().includes(term)) return true
        if (category.slug.toLowerCase().includes(term)) return true
        if (category.description.toLowerCase().includes(term)) return true
        return category.subcategories.some(
          (sub) =>
            sub.label.toLowerCase().includes(term) ||
            sub.subSubcategories.some((type) => type.label.toLowerCase().includes(term))
        )
      })
  }, [categories, search, statusFilter])

  const searching = search.trim().length > 0 || statusFilter !== 'all'

  const activeCategories = categories.filter((category) => category.status === 'active').length
  const inactiveCategories = categories.length - activeCategories

  function productCount(categoryLabel: string, subcategoryLabel?: string, typeLabel?: string) {
    return products.filter(
      (product) =>
        product.category === categoryLabel &&
        (subcategoryLabel === undefined || product.subcategory === subcategoryLabel) &&
        (typeLabel === undefined || product.subSubcategory === typeLabel)
    ).length
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function openAdd(target: AddTarget) {
    setName('')
    setAddTarget(target)
  }

  function openEdit(target: EditTarget) {
    setEditName(target.label)
    setEditTarget(target)
  }

  function openMeta(category: Category) {
    setMetaTarget(category)
    setMetaDraft(toCategoryDraft(category))
  }

  function handleMetaSave() {
    if (!metaTarget || !metaDraft) return
    const clean = metaDraft.label.trim()
    if (!clean) {
      toast.error('Escribe un nombre', 'La categoría no puede estar vacía.')
      return
    }

    const saved = updateCategory(metaTarget.id, {
      label: clean,
      slug: metaDraft.slug.trim() || slugify(clean),
      description: metaDraft.description,
      image: metaDraft.image,
      status: metaDraft.status,
      order: Number(metaDraft.order) || 0,
    })

    if (!saved) {
      toast.error('No se pudo guardar', 'Ya existe una categoría con ese nombre.')
      return
    }

    toast.success('Categoría actualizada', clean)
    setMetaTarget(null)
    setMetaDraft(null)
  }

  function handleAdd() {
    if (!addTarget) return
    const clean = name.trim()
    if (!clean) {
      toast.error('Escribe un nombre')
      return
    }

    let added = false
    if (addTarget.kind === 'category') {
      added = addCategory(clean)
    } else if (addTarget.kind === 'subcategory') {
      added = addSubcategory(addTarget.categoryId, clean)
    } else {
      added = addSubSubcategory(addTarget.categoryId, addTarget.subcategoryId, clean)
    }

    if (!added) {
      toast.error('No se pudo crear', 'Ya existe un elemento con ese nombre en este nivel.')
      return
    }

    if (addTarget.kind !== 'category') {
      setExpanded((prev) =>
        prev.includes(addTarget.categoryId) ? prev : [...prev, addTarget.categoryId]
      )
    }

    toast.success('Elemento creado', clean)
    setAddTarget(null)
    setName('')
  }

  function handleEdit() {
    if (!editTarget) return
    const clean = editName.trim()
    if (!clean) {
      toast.error('Escribe un nombre')
      return
    }
    if (clean === editTarget.label) {
      setEditTarget(null)
      return
    }

    let renamed = false
    if (editTarget.kind === 'category') {
      renamed = renameCategory(editTarget.id, clean)
    } else if (editTarget.kind === 'subcategory' && editTarget.subcategoryId) {
      renamed = renameSubcategory(editTarget.categoryId, editTarget.subcategoryId, clean)
    } else if (editTarget.subcategoryId) {
      renamed = renameSubSubcategory(
        editTarget.categoryId,
        editTarget.subcategoryId,
        editTarget.id,
        clean
      )
    }

    if (!renamed) {
      toast.error('No se pudo renombrar', 'Ya existe un elemento con ese nombre en este nivel.')
      return
    }

    toast.success('Nombre actualizado', `${editTarget.label} → ${clean}`)
    setEditTarget(null)
    setEditName('')
  }

  function handleDelete() {
    if (!deleteTarget) return
    let removed = false
    if (deleteTarget.kind === 'category') {
      removed = removeCategory(deleteTarget.categoryId)
    } else if (deleteTarget.kind === 'subcategory' && deleteTarget.subcategoryId) {
      removed = removeSubcategory(deleteTarget.categoryId, deleteTarget.subcategoryId)
    } else if (deleteTarget.subcategoryId && deleteTarget.subSubcategoryId) {
      removed = removeSubSubcategory(
        deleteTarget.categoryId,
        deleteTarget.subcategoryId,
        deleteTarget.subSubcategoryId
      )
    }

    if (!removed) {
      toast.error('No se puede eliminar', 'Tiene productos asociados en el catálogo.')
      return
    }

    toast.success('Elemento eliminado', deleteTarget.label)
    setDeleteTarget(null)
  }

  const addTitle =
    addTarget?.kind === 'category'
      ? 'Nueva categoría'
      : addTarget?.kind === 'subcategory'
        ? 'Nueva subcategoría'
        : 'Nuevo tipo'

  const addDescription =
    addTarget?.kind === 'category'
      ? 'Crea un nuevo nivel principal para organizar el catálogo.'
      : addTarget?.kind === 'subcategory'
        ? `Se agregará dentro de “${addTarget.categoryLabel}”.`
        : addTarget?.kind === 'type'
          ? `Se agregará en “${addTarget.categoryLabel} › ${addTarget.subcategoryLabel}”.`
          : ''

  const editDescription = editTarget
    ? `Los productos asociados a esta ${kindLabels[editTarget.kind]} se actualizarán automáticamente.`
    : ''

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Catálogo"
        title="Categorías"
        description="Organiza el catálogo en categorías, subcategorías y tipos. Puedes crear, renombrar y eliminar cada nivel."
        actions={
          <button type="button" onClick={() => openAdd({ kind: 'category' })} className={btnPrimary}>
            <Plus className="size-4" aria-hidden="true" />
            Nueva categoría
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Categorías', value: stats.categories, icon: FolderTree },
          { label: 'Subcategorías', value: stats.subcategories, icon: Layers },
          { label: 'Tipos', value: stats.types, icon: Tag },
          { label: 'Productos clasificados', value: stats.classified, icon: Package },
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
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar categoría, subcategoría o tipo…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar en la taxonomía"
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
                setStatusFilter(event.target.value as 'all' | CategoryStatus)
              }
              aria-label="Filtrar categorías por estado"
              className="sm:w-48"
            >
              <option value="all">Todas ({categories.length})</option>
              <option value="active">Activas ({activeCategories})</option>
              <option value="inactive">Inactivas ({inactiveCategories})</option>
            </Select>
            <p className="text-[11px] text-slate-500">
              <span className="font-bold text-slate-900">{filteredCategories.length}</span>{' '}
              {filteredCategories.length === 1 ? 'categoría visible' : 'categorías visibles'}
              {searching ? ' con los filtros' : ''}
            </p>
          </div>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="Sin categorías"
          description={
            searching
              ? 'No hay coincidencias para tu búsqueda. Prueba con otro término.'
              : 'Crea la primera categoría para organizar tus productos.'
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
              <button type="button" onClick={() => openAdd({ kind: 'category' })} className={btnPrimary}>
                <Plus className="size-4" aria-hidden="true" />
                Nueva categoría
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredCategories.map((category) => {
            const isOpen = searching || expanded.includes(category.id)
            const count = productCount(category.label)
            const subcategoryCount = category.subcategories.length
            const typeCount = category.subcategories.reduce(
              (total, sub) => total + sub.subSubcategories.length,
              0
            )

            return (
              <section
                key={category.id}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs"
              >
                <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(category.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
                      <CategoryGlyph label={category.label} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-[13.5px] font-bold text-slate-900">
                          {category.label}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {plural(count, 'producto', 'productos')}
                        </span>
                        {category.status === 'inactive' && (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                            Inactiva
                          </span>
                        )}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-slate-500">
                        <span>
                          {plural(subcategoryCount, 'subcategoría', 'subcategorías')}
                          <span className="mx-1.5 text-slate-300">·</span>
                          {plural(typeCount, 'tipo', 'tipos')}
                        </span>
                        {category.description && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="max-w-[380px] truncate text-slate-400">
                              {category.description}
                            </span>
                          </>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-[9.5px] text-slate-400">
                        /{category.slug}
                      </span>
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        openAdd({
                          kind: 'subcategory',
                          categoryId: category.id,
                          categoryLabel: category.label,
                        })
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      title="Añadir subcategoría"
                      aria-label={`Añadir subcategoría a ${category.label}`}
                    >
                      <Plus className="size-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Subcategoría</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openMeta(category)}
                      className={iconButton}
                      title="Editar categoría"
                      aria-label={`Editar categoría ${category.label}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          kind: 'category',
                          label: category.label,
                          categoryId: category.id,
                        })
                      }
                      disabled={count > 0}
                      className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600 disabled:opacity-30')}
                      title={
                        count > 0
                          ? `No se puede eliminar: tiene ${plural(count, 'producto', 'productos')}`
                          : 'Eliminar categoría'
                      }
                      aria-label={`Eliminar categoría ${category.label}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpanded(category.id)}
                      className={iconButton}
                      aria-label={isOpen ? 'Contraer categoría' : 'Expandir categoría'}
                      aria-expanded={isOpen}
                    >
                      <ChevronDown
                        className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
                      />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-3 sm:p-4">
                    {category.subcategories.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center">
                        <p className="text-[11px] font-semibold text-slate-600">
                          Esta categoría aún no tiene subcategorías
                        </p>
                        <p className="mt-1 text-[10.5px] text-slate-400">
                          Añade la primera para clasificar mejor los productos.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            openAdd({
                              kind: 'subcategory',
                              categoryId: category.id,
                              categoryLabel: category.label,
                            })
                          }
                          className={cn(btnSecondary, 'mt-3 h-8 px-3 text-xs')}
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                          Añadir subcategoría
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {category.subcategories
                          .filter(
                            (sub) =>
                              !searching ||
                              sub.label.toLowerCase().includes(search.trim().toLowerCase()) ||
                              category.label.toLowerCase().includes(search.trim().toLowerCase()) ||
                              sub.subSubcategories.some((type) =>
                                type.label.toLowerCase().includes(search.trim().toLowerCase())
                              )
                          )
                          .map((sub) => {
                            const subCount = productCount(category.label, sub.label)
                            return (
                              <div
                                key={sub.id}
                                className="relative rounded-xl border border-slate-200 bg-white p-3 pl-4"
                              >
                                <span
                                  className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-slate-200"
                                  aria-hidden="true"
                                />
                                <div className="flex items-center gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-1.5">
                                      <p className="truncate text-[11.5px] font-semibold text-slate-800">
                                        {sub.label}
                                      </p>
                                      <span className="text-[10px] text-slate-400">
                                        {plural(subCount, 'producto', 'productos')}
                                      </span>
                                    </div>
                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                      {plural(sub.subSubcategories.length, 'tipo', 'tipos')}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openAdd({
                                        kind: 'type',
                                        categoryId: category.id,
                                        categoryLabel: category.label,
                                        subcategoryId: sub.id,
                                        subcategoryLabel: sub.label,
                                      })
                                    }
                                    className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[10.5px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                  >
                                    <Plus className="size-3" aria-hidden="true" />
                                    Tipo
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEdit({
                                        kind: 'subcategory',
                                        id: sub.id,
                                        label: sub.label,
                                        categoryId: category.id,
                                        categoryLabel: category.label,
                                        subcategoryId: sub.id,
                                        subcategoryLabel: sub.label,
                                      })
                                    }
                                    className="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                    title="Renombrar subcategoría"
                                    aria-label={`Renombrar subcategoría ${sub.label}`}
                                  >
                                    <Pencil className="size-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteTarget({
                                        kind: 'subcategory',
                                        label: sub.label,
                                        categoryId: category.id,
                                        subcategoryId: sub.id,
                                      })
                                    }
                                    disabled={subCount > 0}
                                    className="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                                    title={
                                      subCount > 0
                                        ? `No se puede eliminar: tiene ${plural(subCount, 'producto', 'productos')}`
                                        : 'Eliminar subcategoría'
                                    }
                                    aria-label={`Eliminar subcategoría ${sub.label}`}
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>

                                {sub.subSubcategories.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2">
                                    {sub.subSubcategories.map((type) => {
                                      const typeCount = productCount(category.label, sub.label, type.label)
                                      return (
                                        <span
                                          key={type.id}
                                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 py-1 pl-2 pr-1 text-[10px] font-medium text-slate-600"
                                        >
                                          {type.label}
                                          {typeCount > 0 && (
                                            <span className="rounded-full bg-slate-200 px-1.5 text-[9px] font-bold text-slate-600">
                                              {typeCount}
                                            </span>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              openEdit({
                                                kind: 'type',
                                                id: type.id,
                                                label: type.label,
                                                categoryId: category.id,
                                                categoryLabel: category.label,
                                                subcategoryId: sub.id,
                                                subcategoryLabel: sub.label,
                                              })
                                            }
                                            className="rounded p-0.5 text-slate-400 transition hover:bg-white hover:text-slate-700"
                                            title="Renombrar tipo"
                                            aria-label={`Renombrar tipo ${type.label}`}
                                          >
                                            <Pencil className="size-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setDeleteTarget({
                                                kind: 'type',
                                                label: type.label,
                                                categoryId: category.id,
                                                subcategoryId: sub.id,
                                                subSubcategoryId: type.id,
                                              })
                                            }
                                            disabled={typeCount > 0}
                                            className="rounded p-0.5 text-slate-400 transition hover:bg-white hover:text-red-600 disabled:opacity-30"
                                            title={
                                              typeCount > 0
                                                ? `No se puede eliminar: tiene ${plural(typeCount, 'producto', 'productos')}`
                                                : 'Eliminar tipo'
                                            }
                                            aria-label={`Eliminar tipo ${type.label}`}
                                          >
                                            <X className="size-3" />
                                          </button>
                                        </span>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}

      <Modal
        open={Boolean(addTarget)}
        onClose={() => setAddTarget(null)}
        title={addTitle}
        description={addDescription}
        size="sm"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setAddTarget(null)}>
              Cancelar
            </button>
            <button type="button" className={btnPrimary} onClick={handleAdd}>
              Crear
            </button>
          </>
        }
      >
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-slate-700">Nombre</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleAdd()
              }
            }}
            placeholder={addTarget ? addPlaceholders[addTarget.kind] : ''}
            className={inputClass}
            autoFocus
          />
        </label>
      </Modal>

      <Modal
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title={editTarget ? `Renombrar ${kindLabels[editTarget.kind]}` : 'Renombrar'}
        description={editDescription}
        size="sm"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setEditTarget(null)}>
              Cancelar
            </button>
            <button type="button" className={btnPrimary} onClick={handleEdit}>
              Guardar nombre
            </button>
          </>
        }
      >
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-slate-700">Nombre</span>
          <input
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleEdit()
              }
            }}
            className={inputClass}
            autoFocus
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
        {editTarget && (
          <p className="mt-2 text-[10.5px] leading-relaxed text-slate-400">
            Ruta actual: {editTarget.categoryLabel}
            {editTarget.kind !== 'category' && editTarget.subcategoryLabel
              ? ` › ${editTarget.subcategoryLabel}`
              : ''}
            {editTarget.kind === 'type' ? ` › ${editTarget.label}` : ''}
          </p>
        )}
      </Modal>

      <Modal
        open={Boolean(metaTarget && metaDraft)}
        onClose={() => {
          setMetaTarget(null)
          setMetaDraft(null)
        }}
        title="Editar categoría"
        description="Datos visibles en el catálogo y en la navegación pública."
        size="md"
        footer={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setMetaTarget(null)
                setMetaDraft(null)
              }}
            >
              Cancelar
            </button>
            <button type="button" className={btnPrimary} onClick={handleMetaSave}>
              Guardar cambios
            </button>
          </>
        }
      >
        {metaDraft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" htmlFor="category-name" required className="sm:col-span-2">
              <input
                id="category-name"
                value={metaDraft.label}
                onChange={(event) =>
                  setMetaDraft((prev) => {
                    if (!prev) return prev
                    const label = event.target.value
                    const autoSlug = slugify(prev.label)
                    return {
                      ...prev,
                      label,
                      slug: prev.slug === autoSlug ? slugify(label) : prev.slug,
                    }
                  })
                }
                className={inputClass}
                autoFocus
              />
            </Field>

            <Field
              label="Slug"
              htmlFor="category-slug"
              hint="Identificador único para la URL pública."
              className="sm:col-span-2"
            >
              <div className="flex gap-2">
                <input
                  id="category-slug"
                  value={metaDraft.slug}
                  onChange={(event) =>
                    setMetaDraft((prev) => (prev ? { ...prev, slug: event.target.value } : prev))
                  }
                  className={cn(inputClass, 'font-mono text-xs')}
                />
                <button
                  type="button"
                  onClick={() =>
                    setMetaDraft((prev) =>
                      prev ? { ...prev, slug: slugify(prev.label) } : prev
                    )
                  }
                  className={btnSecondary}
                  disabled={!metaDraft.label.trim()}
                >
                  Generar
                </button>
              </div>
            </Field>

            <Field label="Descripción" htmlFor="category-description" className="sm:col-span-2">
              <textarea
                id="category-description"
                value={metaDraft.description}
                onChange={(event) =>
                  setMetaDraft((prev) =>
                    prev ? { ...prev, description: event.target.value } : prev
                  )
                }
                className={cn(textareaClass, 'min-h-20')}
                placeholder="Describe qué productos agrupa esta categoría."
              />
            </Field>

            <Field
              label="Imagen (URL)"
              htmlFor="category-image"
              hint="Opcional. URL pública de una imagen de portada."
              className="sm:col-span-2"
            >
              <input
                id="category-image"
                value={metaDraft.image}
                onChange={(event) =>
                  setMetaDraft((prev) => (prev ? { ...prev, image: event.target.value } : prev))
                }
                className={inputClass}
                placeholder="https://…/categoria.jpg"
                inputMode="url"
              />
            </Field>

            <Field label="Estado" htmlFor="category-status" hint="Inactiva no se ofrece en formularios nuevos.">
              <Select
                id="category-status"
                value={metaDraft.status}
                onChange={(event) =>
                  setMetaDraft((prev) =>
                    prev ? { ...prev, status: event.target.value as CategoryStatus } : prev
                  )
                }
              >
                <option value="active">Activa</option>
                <option value="inactive">Inactiva</option>
              </Select>
            </Field>

            <Field label="Orden" htmlFor="category-order" hint="Menor número aparece primero.">
              <input
                id="category-order"
                value={metaDraft.order}
                onChange={(event) =>
                  setMetaDraft((prev) => (prev ? { ...prev, order: event.target.value } : prev))
                }
                className={inputClass}
                inputMode="numeric"
              />
            </Field>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar elemento"
        description={`Se eliminará “${deleteTarget?.label ?? ''}” de la taxonomía. Solo es posible si no tiene productos asociados.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
