'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Ban,
  CheckCircle2,
  ListChecks,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Tags,
  Trash2,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { ExportMenu } from '@/components/admin/export-menu'
import { Modal } from '@/components/admin/modal'
import { RowActions } from '@/components/admin/row-actions'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  Field,
  FilterSelect,
  LoadingState,
  PageHeader,
  Select,
  StatCard,
  StatusToggle,
  btnPrimary,
  btnSecondary,
  inputClass,
  tableClass,
  tableHeadRowClass,
  textareaClass,
} from '@/components/admin/ui'
import { attributesDataset } from '@/lib/admin/excel-exports'
import { formatDate, formatNumber } from '@/lib/admin/format'
import { attributeTypeLabels } from '@/lib/admin/operations'
import type {
  AttributeStatus,
  AttributeType,
  ProductAttribute,
  ProductAttributeInput,
} from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const attributeTypeOrder: AttributeType[] = ['text', 'number', 'select', 'boolean']

type AttributeDraft = {
  label: string
  type: AttributeType
  unit: string
  options: string
  keywords: string
  categoryIds: string[]
  required: boolean
  status: AttributeStatus
}

type AttributeErrors = Partial<Record<keyof AttributeDraft, string>>

const emptyDraft: AttributeDraft = {
  label: '',
  type: 'text',
  unit: '',
  options: '',
  keywords: '',
  categoryIds: [],
  required: false,
  status: 'active',
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function toDraft(attribute: ProductAttribute): AttributeDraft {
  return {
    label: attribute.label,
    type: attribute.type,
    unit: attribute.unit,
    options: attribute.options.join('\n'),
    keywords: attribute.keywords.join(', '),
    categoryIds: [...attribute.categoryIds],
    required: attribute.required,
    status: attribute.status,
  }
}

function toInput(draft: AttributeDraft): ProductAttributeInput {
  return {
    label: draft.label.trim(),
    type: draft.type,
    unit: draft.unit.trim(),
    options: draft.type === 'select' ? splitLines(draft.options) : [],
    keywords: splitList(draft.keywords),
    categoryIds: draft.categoryIds,
    required: draft.required,
    status: draft.status,
  }
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function AttributesView() {
  const {
    hydrated,
    attributes,
    categories,
    products,
    createAttribute,
    updateAttribute,
    removeAttribute,
    setAttributeStatus,
  } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [type, setType] = useState<'all' | AttributeType>('all')
  const [status, setStatus] = useState<'all' | AttributeStatus>('all')
  const [categoryId, setCategoryId] = useState<'all' | string>('all')
  const [editing, setEditing] = useState<ProductAttribute | 'new' | null>(null)
  const [draft, setDraft] = useState<AttributeDraft>(emptyDraft)
  const [errors, setErrors] = useState<AttributeErrors>({})
  const [deleteTarget, setDeleteTarget] = useState<ProductAttribute | null>(null)
  const [coverageTarget, setCoverageTarget] = useState<ProductAttribute | null>(null)

  const categoryLabel = useMemo(
    () => new Map(categories.map((category) => [category.id, category.label])),
    [categories]
  )

  useEffect(() => {
    if (editing === 'new') {
      setDraft(emptyDraft)
      setErrors({})
      return
    }
    if (editing) {
      setDraft(toDraft(editing))
      setErrors({})
    }
  }, [editing])

  // La cobertura se mide contra las especificaciones libres del catálogo: un
  // atributo está declarado en el producto cuando alguna de sus palabras clave
  // aparece en el texto de la ficha.
  const coverage = useMemo(() => {
    const byId = new Map<string, { scope: number; hits: { product: string; spec: string }[]; missing: string[] }>()
    attributes.forEach((attribute) => {
      const labels = attribute.categoryIds
        .map((id) => categoryLabel.get(id))
        .filter((label): label is string => Boolean(label))
      const scope =
        labels.length === 0
          ? products
          : products.filter((product) => labels.includes(product.category))
      const keywords = attribute.keywords.map(normalize).filter(Boolean)
      const hits: { product: string; spec: string }[] = []
      const missing: string[] = []
      scope.forEach((product) => {
        const match =
          keywords.length === 0
            ? undefined
            : product.specs.find((spec) =>
                keywords.some((keyword) => normalize(spec).includes(keyword))
              )
        if (match) hits.push({ product: product.name, spec: match })
        else missing.push(product.name)
      })
      byId.set(attribute.id, { scope: scope.length, hits, missing })
    })
    return byId
  }, [attributes, categoryLabel, products])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return attributes
      .filter((attribute) => {
        const matchesTerm =
          !term ||
          attribute.label.toLowerCase().includes(term) ||
          attribute.keywords.some((keyword) => keyword.toLowerCase().includes(term))
        const matchesType = type === 'all' || attribute.type === type
        const matchesStatus = status === 'all' || attribute.status === status
        const matchesCategory =
          categoryId === 'all' ||
          attribute.categoryIds.length === 0 ||
          attribute.categoryIds.includes(categoryId)
        return matchesTerm && matchesType && matchesStatus && matchesCategory
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [attributes, query, type, status, categoryId])

  const activeCount = attributes.filter((attribute) => attribute.status === 'active').length
  const requiredCount = attributes.filter(
    (attribute) => attribute.required && attribute.status === 'active'
  ).length
  const totalScope = attributes.reduce((sum, attribute) => sum + (coverage.get(attribute.id)?.scope ?? 0), 0)
  const totalHits = attributes.reduce(
    (sum, attribute) => sum + (coverage.get(attribute.id)?.hits.length ?? 0),
    0
  )
  const coveragePercent = totalScope === 0 ? 0 : Math.round((totalHits / totalScope) * 100)
  const uncoveredCount = attributes.filter(
    (attribute) => (coverage.get(attribute.id)?.hits.length ?? 0) === 0
  ).length

  function update<K extends keyof AttributeDraft>(key: K, value: AttributeDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function toggleCategory(id: string) {
    setDraft((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((item) => item !== id)
        : [...prev.categoryIds, id],
    }))
  }

  function resetFilters() {
    setQuery('')
    setType('all')
    setStatus('all')
    setCategoryId('all')
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: AttributeErrors = {}
    if (draft.label.trim().length < 3) {
      nextErrors.label = 'Escribe un nombre claro para el atributo.'
    }
    if (draft.type === 'select' && splitLines(draft.options).length < 2) {
      nextErrors.options = 'Una lista de opciones necesita al menos dos valores.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Revisa los datos', 'Hay campos del atributo sin completar correctamente.')
      return
    }

    const input = toInput(draft)
    if (editing === 'new') {
      createAttribute(input)
      toast.success('Atributo creado', input.label)
    } else if (editing) {
      updateAttribute(editing.id, input)
      toast.success('Atributo actualizado', input.label)
    }
    setEditing(null)
  }

  function toggleStatus(attribute: ProductAttribute) {
    const next: AttributeStatus = attribute.status === 'active' ? 'inactive' : 'active'
    setAttributeStatus(attribute.id, next)
    toast.info(next === 'active' ? 'Atributo activado' : 'Atributo desactivado', attribute.label)
  }

  function handleDelete() {
    if (!deleteTarget) return
    removeAttribute(deleteTarget.id)
    toast.success('Atributo eliminado', deleteTarget.label)
    setDeleteTarget(null)
  }

  if (!hydrated) {
    return <LoadingState label="Cargando atributos…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Catálogo"
        title="Atributos y especificaciones"
        description="Campos técnicos que definen qué se declara en la ficha de cada producto y qué puede filtrar la tienda."
        actions={
          <>
            <ExportMenu
              build={() => attributesDataset(filtered)}
              nouns={['atributo', 'atributos']}
              disabled={filtered.length === 0}
            />
            <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
              <Plus className="size-4" aria-hidden="true" />
              Nuevo atributo
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Atributos"
          value={formatNumber(attributes.length)}
          helper={
            activeCount === 1 ? '1 activo' : `${formatNumber(activeCount)} activos`
          }
          icon={Tags}
        />
        <StatCard
          label="Cobertura"
          value={`${formatNumber(coveragePercent)}%`}
          helper={`${formatNumber(totalHits)} de ${formatNumber(totalScope)} fichas declaradas`}
          icon={ListChecks}
        />
        <StatCard
          label="Obligatorios"
          value={formatNumber(requiredCount)}
          helper="Deben completarse al publicar"
          icon={SlidersHorizontal}
        />
        <StatCard
          label="Sin cobertura"
          value={formatNumber(uncoveredCount)}
          helper={
            uncoveredCount === 0
              ? 'Todos los atributos tienen datos'
              : 'Ningún producto los declara aún'
          }
          icon={Ban}
        />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-0 lg:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o palabra clave…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar atributos"
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

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:shrink-0 lg:items-center">
            <FilterSelect
              label="Tipo"
              value={type}
              onChange={(next) => setType(next as 'all' | AttributeType)}
              ariaLabel="Filtrar por tipo de atributo"
              align="right"
              className="sm:w-full lg:w-48"
              options={[
                { value: 'all', label: 'Todos', count: attributes.length },
                ...attributeTypeOrder.map((item) => ({
                  value: item,
                  label: attributeTypeLabels[item],
                  count: attributes.filter((attribute) => attribute.type === item).length,
                })),
              ]}
            />
            <FilterSelect
              label="Estado"
              value={status}
              onChange={(next) => setStatus(next as 'all' | AttributeStatus)}
              ariaLabel="Filtrar por estado"
              align="right"
              className="sm:w-full lg:w-40"
              options={[
                { value: 'all', label: 'Todos', count: attributes.length },
                {
                  value: 'active',
                  label: 'Activos',
                  count: activeCount,
                },
                {
                  value: 'inactive',
                  label: 'Inactivos',
                  count: attributes.length - activeCount,
                },
              ]}
            />
            <FilterSelect
              label="Categoría"
              value={categoryId}
              onChange={setCategoryId}
              ariaLabel="Filtrar por categoría"
              align="right"
              className="col-span-2 sm:w-full lg:w-56"
              options={[
                { value: 'all', label: 'Todas', count: attributes.length },
                ...categories.map((category) => ({
                  value: category.id,
                  label: category.label,
                  count: attributes.filter(
                    (attribute) =>
                      attribute.categoryIds.length === 0 ||
                      attribute.categoryIds.includes(category.id)
                  ).length,
                })),
              ]}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-[11px] font-medium text-slate-500">
            {filtered.length === attributes.length
              ? `${formatNumber(attributes.length)} atributos definidos`
              : `${formatNumber(filtered.length)} de ${formatNumber(attributes.length)} atributos`}
          </p>
          {(query || type !== 'all' || status !== 'all' || categoryId !== 'all') && (
            <button type="button" className={btnSecondary} onClick={resetFilters}>
              Limpiar filtros
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Tags}
              title="Sin atributos que mostrar"
              description="Ajusta la búsqueda o crea un atributo para estandarizar las especificaciones del catálogo."
              action={
                <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
                  <Plus className="size-4" aria-hidden="true" />
                  Nuevo atributo
                </button>
              }
            />
          </div>
        ) : (
          <div className="mt-4 -mx-4 overflow-x-auto px-4">
            <table className={tableClass}>
              <thead>
                <tr className={tableHeadRowClass}>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Atributo
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Categorías
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Palabras clave
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Cobertura en el catálogo
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((attribute) => {
                  const result = coverage.get(attribute.id)
                  const scope = result?.scope ?? 0
                  const hits = result?.hits.length ?? 0
                  const percent = scope === 0 ? 0 : Math.round((hits / scope) * 100)
                  return (
                    <tr key={attribute.id} className="transition hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setCoverageTarget(attribute)}
                          className="text-left"
                        >
                          <p className="text-[13px] font-semibold text-slate-900 hover:text-[#5B21B6]">
                            {attribute.label}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                            {attribute.unit && <span>{attribute.unit}</span>}
                            {attribute.required && (
                              <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                                Obligatorio
                              </span>
                            )}
                            {attribute.options.length > 0 && (
                              <span className="text-slate-400">
                                {attribute.options.length} opciones
                              </span>
                            )}
                          </p>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-600">
                          {attributeTypeLabels[attribute.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex max-w-[260px] flex-wrap gap-1">
                          {attribute.categoryIds.length === 0 ? (
                            <span className="rounded-full bg-[#F5F3FF] px-2 py-0.5 text-[10.5px] font-semibold text-[#5B21B6] ring-1 ring-inset ring-[#DDD6FE]">
                              Todas las categorías
                            </span>
                          ) : (
                            attribute.categoryIds.map((id) => (
                              <span
                                key={id}
                                className="rounded-full bg-slate-50 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
                              >
                                {categoryLabel.get(id) ?? id}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-[220px] truncate text-[11.5px] text-slate-500">
                          {attribute.keywords.length > 0
                            ? attribute.keywords.join(' · ')
                            : 'Sin palabras clave'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-slate-100">
                            <span
                              className={cn(
                                'block h-full rounded-full',
                                percent >= 60
                                  ? 'bg-emerald-500'
                                  : percent >= 25
                                    ? 'bg-amber-500'
                                    : 'bg-rose-400'
                              )}
                              style={{ width: `${percent}%` }}
                            />
                          </span>
                          <button
                            type="button"
                            onClick={() => setCoverageTarget(attribute)}
                            className="text-[11.5px] font-semibold text-slate-700 hover:text-[#5B21B6]"
                          >
                            {formatNumber(hits)} / {formatNumber(scope)}
                          </button>
                          <span className="text-[11px] tabular-nums text-slate-400">{percent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
                            attribute.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                              : 'bg-slate-100 text-slate-600 ring-slate-200'
                          )}
                        >
                          {attribute.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                        <p className="mt-1 text-[10.5px] text-slate-400">
                          Alta el {formatDate(attribute.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <RowActions
                          label={`Acciones para ${attribute.label}`}
                          title={attribute.label}
                          items={[
                            {
                              key: 'status',
                              label:
                                attribute.status === 'active'
                                  ? 'Desactivar atributo'
                                  : 'Activar atributo',
                              icon: attribute.status === 'active' ? Ban : CheckCircle2,
                              onSelect: () => toggleStatus(attribute),
                            },
                            {
                              key: 'edit',
                              label: 'Editar atributo',
                              icon: Pencil,
                              onSelect: () => setEditing(attribute),
                            },
                            {
                              key: 'delete',
                              label: 'Eliminar atributo',
                              icon: Trash2,
                              tone: 'danger',
                              onSelect: () => setDeleteTarget(attribute),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={coverageTarget !== null}
        onClose={() => setCoverageTarget(null)}
        title={coverageTarget ? coverageTarget.label : 'Cobertura'}
        description={
          coverageTarget
            ? `${attributeTypeLabels[coverageTarget.type]} · ${
                coverageTarget.categoryIds.length === 0
                  ? 'aplica a todo el catálogo'
                  : coverageTarget.categoryIds
                      .map((id) => categoryLabel.get(id) ?? id)
                      .join(', ')
              }`
            : ''
        }
        size="lg"
        footer={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                if (!coverageTarget) return
                setEditing(coverageTarget)
                setCoverageTarget(null)
              }}
            >
              <Pencil className="size-4" aria-hidden="true" />
              Editar atributo
            </button>
            <button type="button" className={btnSecondary} onClick={() => setCoverageTarget(null)}>
              Cerrar
            </button>
          </>
        }
      >
        {coverageTarget &&
          (() => {
            const result = coverage.get(coverageTarget.id)
            const scope = result?.scope ?? 0
            const hits = result?.hits ?? []
            const missing = result?.missing ?? []
            const percent = scope === 0 ? 0 : Math.round((hits.length / scope) * 100)
            return (
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Fichas en el alcance', value: formatNumber(scope) },
                    { label: 'Declaran el atributo', value: formatNumber(hits.length) },
                    { label: 'Cobertura', value: `${formatNumber(percent)}%` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <p className="font-heading text-lg font-bold leading-none text-slate-900">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.1em] text-slate-400">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-[11.5px] leading-relaxed text-slate-600">
                  <p className="font-semibold text-slate-800">Cómo se detecta</p>
                  <p className="mt-1">
                    {coverageTarget.keywords.length > 0
                      ? `Se busca ${coverageTarget.keywords.map((k) => `“${k}”`).join(', ')} dentro de las especificaciones cargadas en cada producto.`
                      : 'Este atributo no tiene palabras clave, por lo que ninguna ficha se marca como cubierta hasta que las definas.'}
                  </p>
                  {coverageTarget.options.length > 0 && (
                    <p className="mt-1">
                      Valores aceptados: {coverageTarget.options.join(' · ')}
                      {coverageTarget.unit ? ` (unidad: ${coverageTarget.unit})` : ''}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Fichas que lo declaran
                  </p>
                  {hits.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 px-3 py-3 text-[11.5px] text-slate-500">
                      Ninguna ficha del alcance menciona este atributo todavía.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {hits.slice(0, 8).map((hit) => (
                        <li
                          key={hit.product}
                          className="rounded-lg bg-slate-50 px-3 py-2 text-[11.5px] text-slate-600"
                        >
                          <span className="font-semibold text-slate-900">{hit.product}</span>
                          <span className="mx-1.5 text-slate-300">·</span>
                          {hit.spec}
                        </li>
                      ))}
                      {hits.length > 8 && (
                        <li className="px-3 text-[11px] text-slate-400">
                          y {formatNumber(hits.length - 8)} fichas más
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Fichas sin el dato {missing.length > 0 && `(${formatNumber(missing.length)})`}
                  </p>
                  {missing.length === 0 ? (
                    <p className="rounded-xl bg-emerald-50 px-3 py-2.5 text-[11.5px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      Cobertura completa en el alcance.
                    </p>
                  ) : (
                    <ul className="flex flex-wrap gap-1.5">
                      {missing.slice(0, 12).map((name) => (
                        <li
                          key={name}
                          className="rounded-lg bg-white px-2 py-1 text-[11px] text-slate-600 ring-1 ring-inset ring-slate-200"
                        >
                          {name}
                        </li>
                      ))}
                      {missing.length > 12 && (
                        <li className="px-2 py-1 text-[11px] text-slate-400">
                          y {formatNumber(missing.length - 12)} más
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )
          })()}
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Nuevo atributo' : 'Editar atributo'}
        description="Define qué se espera en la ficha técnica del producto y cómo detectarlo en los datos actuales."
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setEditing(null)}>
              Cancelar
            </button>
            <button type="submit" form="attribute-form" className={btnPrimary}>
              {editing === 'new' ? 'Crear atributo' : 'Guardar cambios'}
            </button>
          </>
        }
      >
        <form id="attribute-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" htmlFor="attribute-label" required error={errors.label}>
              <input
                id="attribute-label"
                value={draft.label}
                onChange={(event) => update('label', event.target.value)}
                className={inputClass}
                placeholder="Tasa de refresco"
              />
            </Field>
            <Field label="Tipo de dato" htmlFor="attribute-type" required>
              <Select
                id="attribute-type"
                value={draft.type}
                onChange={(event) => update('type', event.target.value as AttributeType)}
              >
                {attributeTypeOrder.map((item) => (
                  <option key={item} value={item}>
                    {attributeTypeLabels[item]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Unidad"
              htmlFor="attribute-unit"
              hint="Se muestra junto al valor: Hz, GB, ppm…"
            >
              <input
                id="attribute-unit"
                value={draft.unit}
                onChange={(event) => update('unit', event.target.value)}
                className={inputClass}
                placeholder="Hz"
              />
            </Field>
            <Field label="Estado" htmlFor="attribute-status" required>
              <Select
                id="attribute-status"
                value={draft.status}
                onChange={(event) => update('status', event.target.value as AttributeStatus)}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </Select>
            </Field>
          </div>

          {draft.type === 'select' && (
            <Field
              label="Opciones permitidas"
              htmlFor="attribute-options"
              required
              error={errors.options}
              hint="Un valor por línea. La tienda solo ofrecerá estos valores como filtros."
            >
              <textarea
                id="attribute-options"
                value={draft.options}
                onChange={(event) => update('options', event.target.value)}
                className={textareaClass}
                rows={4}
                placeholder={'IPS\nVA\nTN\nOLED'}
              />
            </Field>
          )}

          <Field
            label="Palabras clave de detección"
            htmlFor="attribute-keywords"
            hint="Separadas por comas. Permiten medir cuántas fichas ya declaran este dato."
          >
            <input
              id="attribute-keywords"
              value={draft.keywords}
              onChange={(event) => update('keywords', event.target.value)}
              className={inputClass}
              placeholder="Wi-Fi, Bluetooth, 144 Hz"
            />
          </Field>

          <Field
            label="Categorías donde aplica"
            hint="Déjalo vacío para que el atributo aplique a todo el catálogo."
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const selected = draft.categoryIds.includes(category.id)
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-[11.5px] font-semibold ring-1 ring-inset transition',
                      selected
                        ? 'bg-[#F5F3FF] text-[#5B21B6] ring-[#DDD6FE]'
                        : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50'
                    )}
                    aria-pressed={selected}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
          </Field>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-slate-900">Obligatorio al publicar</p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                El editor de productos avisará si la ficha no declara este atributo.
              </p>
            </div>
            <StatusToggle
              active={draft.required}
              onToggle={() => update('required', !draft.required)}
              label="Marcar como obligatorio"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar atributo"
        description={
          deleteTarget
            ? `“${deleteTarget.label}” dejará de usarse en las fichas y en los filtros de la tienda. Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
