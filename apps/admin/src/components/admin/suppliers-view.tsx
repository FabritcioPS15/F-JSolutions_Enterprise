'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Boxes,
  Building2,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Truck,
  Undo2,
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
  btnPrimary,
  btnSecondary,
  inputClass,
  tableClass,
  tableHeadRowClass,
  textareaClass,
} from '@/components/admin/ui'
import { suppliersDataset } from '@/lib/admin/excel-exports'
import { formatCurrency, formatDate, formatNumber } from '@/lib/admin/format'
import { isEmail, isValidRuc } from '@fj-solutions/contracts/domain'
import { supplierStatusLabels } from '@/lib/admin/operations'
import type { Supplier, SupplierInput, SupplierStatus } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

type SupplierDraft = {
  name: string
  ruc: string
  contactName: string
  email: string
  phone: string
  city: string
  address: string
  categoryIds: string[]
  leadTimeDays: string
  minimumOrder: string
  rating: string
  status: SupplierStatus
  notes: string
}

type SupplierErrors = Partial<Record<keyof SupplierDraft, string>>


const emptyDraft: SupplierDraft = {
  name: '',
  ruc: '',
  contactName: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  categoryIds: [],
  leadTimeDays: '7',
  minimumOrder: '1000',
  rating: '4.0',
  status: 'active',
  notes: '',
}

function toDraft(supplier: Supplier): SupplierDraft {
  return {
    name: supplier.name,
    ruc: supplier.ruc,
    contactName: supplier.contactName,
    email: supplier.email,
    phone: supplier.phone,
    city: supplier.city,
    address: supplier.address,
    categoryIds: [...supplier.categoryIds],
    leadTimeDays: String(supplier.leadTimeDays),
    minimumOrder: String(supplier.minimumOrder),
    rating: String(supplier.rating),
    status: supplier.status,
    notes: supplier.notes,
  }
}

function validate(draft: SupplierDraft): SupplierErrors {
  const errors: SupplierErrors = {}
  if (draft.name.trim().length < 3) errors.name = 'Ingresa la razón social del proveedor.'
  if (!isValidRuc(draft.ruc)) errors.ruc = 'El RUC debe tener 11 dígitos.'
  if (!isEmail(draft.email)) errors.email = 'Escribe un correo válido.'
  if (draft.categoryIds.length === 0) {
    errors.categoryIds = 'Marca al menos una categoría de producto que abastece.'
  }
  return errors
}

function Rating({ value }: { value: number }) {
  const rounded = Math.round(value)
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Calificación ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'size-3.5',
            star <= rounded ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
          )}
          aria-hidden="true"
        />
      ))}
      <span className="ml-1 text-[11px] tabular-nums text-slate-500">{value.toFixed(1)}</span>
    </span>
  )
}

export function SuppliersView() {
  const {
    hydrated,
    categories,
    products,
    suppliers,
    settings,
    createSupplier,
    updateSupplier,
    removeSupplier,
    setSupplierStatus,
  } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | SupplierStatus>('all')
  const [categoryId, setCategoryId] = useState<'all' | string>('all')
  const [editing, setEditing] = useState<Supplier | 'new' | null>(null)
  const [draft, setDraft] = useState<SupplierDraft>(emptyDraft)
  const [errors, setErrors] = useState<SupplierErrors>({})
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)

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

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return suppliers
      .filter((supplier) => {
        const matchesTerm =
          !term ||
          supplier.name.toLowerCase().includes(term) ||
          supplier.ruc.includes(term) ||
          supplier.contactName.toLowerCase().includes(term) ||
          supplier.email.toLowerCase().includes(term) ||
          supplier.city.toLowerCase().includes(term)
        const matchesStatus = status === 'all' || supplier.status === status
        const matchesCategory =
          categoryId === 'all' || supplier.categoryIds.includes(categoryId)
        return matchesTerm && matchesStatus && matchesCategory
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [suppliers, query, status, categoryId])

  const activeCount = suppliers.filter((supplier) => supplier.status === 'active').length
  const averageLead =
    suppliers.length > 0
      ? Math.round(suppliers.reduce((total, item) => total + item.leadTimeDays, 0) / suppliers.length)
      : 0
  const coveredCategories = new Set(suppliers.flatMap((supplier) => supplier.categoryIds)).size

  function update<K extends keyof SupplierDraft>(key: K, value: SupplierDraft[K]) {
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
    if (errors.categoryIds) setErrors((prev) => ({ ...prev, categoryIds: undefined }))
  }

  function suppliedProducts(supplier: Supplier) {
    const labels = supplier.categoryIds
      .map((id) => categoryLabel.get(id))
      .filter((label): label is string => Boolean(label))
    if (labels.length === 0) return 0
    return products.filter((product) => labels.includes(product.category)).length
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      toast.error('Revisa los datos', 'Hay campos del proveedor sin completar correctamente.')
      return
    }

    const input: SupplierInput = {
      name: draft.name.trim(),
      ruc: draft.ruc.replace(/\D/g, ''),
      contactName: draft.contactName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      city: draft.city.trim(),
      address: draft.address.trim(),
      categoryIds: draft.categoryIds,
      leadTimeDays: Math.max(0, Number(draft.leadTimeDays) || 0),
      minimumOrder: Math.max(0, Number(draft.minimumOrder) || 0),
      rating: Math.min(5, Math.max(0, Number(draft.rating) || 0)),
      status: draft.status,
      notes: draft.notes.trim(),
    }

    if (editing === 'new') {
      const supplier = createSupplier(input)
      toast.success('Proveedor registrado', supplier.name)
    } else if (editing) {
      updateSupplier(editing.id, input)
      toast.success('Proveedor actualizado', input.name)
    }
    setEditing(null)
  }

  if (!hydrated) {
    return <LoadingState label="Cargando proveedores…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Operaciones"
        title="Proveedores"
        description="Distribuidores y mayoristas que abastecen el catálogo, con plazos y montos mínimos de reposición."
        actions={
          <>
            <ExportMenu
              build={() => suppliersDataset(filtered, settings.currency)}
              nouns={['proveedor', 'proveedores']}
              disabled={filtered.length === 0}
            />
            <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
              <Plus className="size-4" aria-hidden="true" />
              Nuevo proveedor
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Proveedores"
          value={formatNumber(suppliers.length)}
          helper={activeCount === 1 ? '1 activo' : `${formatNumber(activeCount)} activos`}
          icon={Building2}
        />
        <StatCard
          label="Plazo promedio"
          value={`${averageLead} ${averageLead === 1 ? 'día' : 'días'}`}
          helper="Desde la orden hasta la recepción"
          icon={Truck}
        />
        <StatCard
          label="Categorías cubiertas"
          value={formatNumber(coveredCategories)}
          helper={`de ${formatNumber(categories.length)} en el catálogo`}
          icon={Boxes}
        />
        <StatCard
          label="Categorías sin proveedor"
          value={formatNumber(
            categories.filter(
              (category) => !suppliers.some((supplier) => supplier.categoryIds.includes(category.id))
            ).length
          )}
          helper="Riesgo de desabastecimiento"
          icon={Undo2}
        />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-0 lg:flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por razón social, RUC, contacto, correo o ciudad…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar proveedores"
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

          <div className="grid grid-cols-2 gap-2 lg:flex lg:shrink-0 lg:items-center">
            <FilterSelect
              label="Estado"
              value={status}
              onChange={(next) => setStatus(next as 'all' | SupplierStatus)}
              ariaLabel="Filtrar por estado"
              align="right"
              className="sm:w-full lg:w-44"
              options={[
                { value: 'all', label: 'Todos', count: suppliers.length },
                { value: 'active', label: 'Activos', count: activeCount },
                { value: 'inactive', label: 'Inactivos', count: suppliers.length - activeCount },
              ]}
            />
            <FilterSelect
              label="Categoría"
              value={categoryId}
              onChange={setCategoryId}
              ariaLabel="Filtrar por categoría abastecida"
              align="right"
              className="sm:w-full lg:w-56"
              options={[
                { value: 'all', label: 'Todas', count: suppliers.length },
                ...categories.map((category) => ({
                  value: category.id,
                  label: category.label,
                  count: suppliers.filter((supplier) =>
                    supplier.categoryIds.includes(category.id)
                  ).length,
                })),
              ]}
            />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Building2}
              title={suppliers.length === 0 ? 'Sin proveedores registrados' : 'Sin resultados'}
              description={
                suppliers.length === 0
                  ? 'Registra a tus distribuidores para saber de quién reponer cada categoría.'
                  : 'Ningún proveedor coincide con los filtros aplicados.'
              }
              action={
                suppliers.length === 0 ? (
                  <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
                    <Plus className="size-4" aria-hidden="true" />
                    Nuevo proveedor
                  </button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadRowClass}>
                <tr>
                  <th className="px-5 py-3">Proveedor</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Categorías que abastece</th>
                  <th className="px-4 py-3">Plazo</th>
                  <th className="px-4 py-3 text-right">Pedido mínimo</th>
                  <th className="px-4 py-3">Calificación</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((supplier) => (
                  <tr key={supplier.id} className="align-top transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{supplier.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                        RUC {supplier.ruc}
                      </p>
                      {supplier.city ? (
                        <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-slate-400">
                          <MapPin className="size-3" aria-hidden="true" />
                          {supplier.city}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[12px] font-medium text-slate-700">
                        {supplier.contactName || 'Sin contacto'}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                        <Mail className="size-3" aria-hidden="true" />
                        {supplier.email}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{supplier.phone}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {supplier.categoryIds.map((id) => (
                          <span
                            key={id}
                            className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
                          >
                            {categoryLabel.get(id) ?? id}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-[10.5px] text-slate-400">
                        {formatNumber(suppliedProducts(supplier))}{' '}
                        {suppliedProducts(supplier) === 1
                          ? 'producto del catálogo'
                          : 'productos del catálogo'}{' '}
                        en {supplier.categoryIds.length === 1 ? 'esa categoría' : 'esas categorías'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-slate-600">
                      {supplier.leadTimeDays} {supplier.leadTimeDays === 1 ? 'día' : 'días'}
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-slate-700">
                      {formatCurrency(supplier.minimumOrder, settings.currency)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Rating value={supplier.rating} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
                          supplier.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-slate-100 text-slate-600 ring-slate-200'
                        )}
                      >
                        {supplierStatusLabels[supplier.status]}
                      </span>
                      <p className="mt-1 text-[10.5px] text-slate-400">
                        Alta el {formatDate(supplier.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <RowActions
                        label={`Acciones para ${supplier.name}`}
                        title={supplier.name}
                        items={[
                          {
                            key: 'status',
                            label:
                              supplier.status === 'active'
                                ? 'Marcar inactivo'
                                : 'Reactivar proveedor',
                            icon: Undo2,
                            onSelect: () => {
                              const next = supplier.status === 'active' ? 'inactive' : 'active'
                              setSupplierStatus(supplier.id, next)
                              toast.success(
                                next === 'active' ? 'Proveedor reactivado' : 'Proveedor inactivo',
                                supplier.name
                              )
                            },
                          },
                          {
                            key: 'edit',
                            label: 'Editar proveedor',
                            icon: Pencil,
                            onSelect: () => setEditing(supplier),
                          },
                          {
                            key: 'delete',
                            label: 'Eliminar proveedor',
                            icon: Trash2,
                            tone: 'danger',
                            onSelect: () => setDeleteTarget(supplier),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Nuevo proveedor' : `Editar ${editing?.name}`}
        description="Los datos de abastecimiento alimentan la reposición de stock y la vista de inventario."
        size="xl"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setEditing(null)}>
              Cancelar
            </button>
            <button type="submit" form="supplier-form" className={btnPrimary}>
              {editing === 'new' ? 'Registrar proveedor' : 'Guardar cambios'}
            </button>
          </>
        }
      >
        <form id="supplier-form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Razón social" htmlFor="supplier-name" required error={errors.name}>
              <input
                id="supplier-name"
                value={draft.name}
                onChange={(event) => update('name', event.target.value)}
                className={inputClass}
                placeholder="Nombre comercial o razón social"
              />
            </Field>
            <Field label="RUC" htmlFor="supplier-ruc" required error={errors.ruc}>
              <input
                id="supplier-ruc"
                value={draft.ruc}
                inputMode="numeric"
                onChange={(event) => update('ruc', event.target.value)}
                className={cn(inputClass, 'font-mono tabular-nums')}
                placeholder="20123456789"
              />
            </Field>
            <Field label="Contacto" htmlFor="supplier-contact">
              <input
                id="supplier-contact"
                value={draft.contactName}
                onChange={(event) => update('contactName', event.target.value)}
                className={inputClass}
                placeholder="Nombre del ejecutivo de cuenta"
              />
            </Field>
            <Field label="Correo" htmlFor="supplier-email" required error={errors.email}>
              <input
                id="supplier-email"
                value={draft.email}
                onChange={(event) => update('email', event.target.value)}
                className={inputClass}
                placeholder="compras@proveedor.pe"
              />
            </Field>
            <Field label="Teléfono" htmlFor="supplier-phone">
              <input
                id="supplier-phone"
                value={draft.phone}
                onChange={(event) => update('phone', event.target.value)}
                className={inputClass}
                placeholder="+51 1 000 0000"
              />
            </Field>
            <Field label="Ciudad" htmlFor="supplier-city">
              <input
                id="supplier-city"
                value={draft.city}
                onChange={(event) => update('city', event.target.value)}
                className={inputClass}
                placeholder="Lima, Trujillo, Arequipa…"
              />
            </Field>
          </div>

          <Field label="Dirección" htmlFor="supplier-address">
            <input
              id="supplier-address"
              value={draft.address}
              onChange={(event) => update('address', event.target.value)}
              className={inputClass}
              placeholder="Av./Calle 123, distrito"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Plazo de entrega (días)" htmlFor="supplier-lead">
              <input
                id="supplier-lead"
                type="number"
                min={0}
                value={draft.leadTimeDays}
                onChange={(event) => update('leadTimeDays', event.target.value)}
                className={cn(inputClass, 'tabular-nums')}
              />
            </Field>
            <Field label={`Pedido mínimo (${settings.currency})`} htmlFor="supplier-minimum">
              <input
                id="supplier-minimum"
                type="number"
                min={0}
                step="10"
                value={draft.minimumOrder}
                onChange={(event) => update('minimumOrder', event.target.value)}
                className={cn(inputClass, 'tabular-nums')}
              />
            </Field>
            <Field label="Calificación (0 a 5)" htmlFor="supplier-rating">
              <input
                id="supplier-rating"
                type="number"
                min={0}
                max={5}
                step="0.1"
                value={draft.rating}
                onChange={(event) => update('rating', event.target.value)}
                className={cn(inputClass, 'tabular-nums')}
              />
            </Field>
            <Field label="Estado" htmlFor="supplier-status">
              <Select
                id="supplier-status"
                value={draft.status}
                onChange={(event) => update('status', event.target.value as SupplierStatus)}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </Select>
            </Field>
          </div>

          <Field
            label="Categorías que abastece"
            required
            error={errors.categoryIds}
            hint="Se usan para sugerir de quién reponer cuando un producto baja del stock mínimo."
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

          <Field label="Notas" htmlFor="supplier-notes">
            <textarea
              id="supplier-notes"
              value={draft.notes}
              onChange={(event) => update('notes', event.target.value)}
              className={textareaClass}
              rows={3}
              placeholder="Condiciones de pago, garantías, contactos alternos…"
            />
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar proveedor"
        description={
          deleteTarget
            ? `Se eliminará a “${deleteTarget.name}” del registro de abastecimiento. Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (!deleteTarget) return
          removeSupplier(deleteTarget.id)
          toast.success('Proveedor eliminado', deleteTarget.name)
          setDeleteTarget(null)
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
