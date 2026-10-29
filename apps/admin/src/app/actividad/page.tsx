'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Archive,
  CheckCircle2,
  Copy,
  EyeOff,
  History,
  Package,
  PackagePlus,
  Pencil,
  RotateCcw,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import {
  EmptyState,
  LoadingState,
  PageHeader,
  SectionCard,
  Select,
  btnSecondary,
} from '@/components/admin/ui'
import { formatDateTime } from '@/lib/admin/format'
import type { ActivityType } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const activityMeta: Record<
  ActivityType,
  { label: string; icon: LucideIcon; chip: string }
> = {
  created: { label: 'Producto creado', icon: PackagePlus, chip: 'bg-slate-50 text-slate-500 ring-slate-200' },
  updated: { label: 'Producto actualizado', icon: Pencil, chip: 'bg-slate-50 text-slate-500 ring-slate-200' },
  published: { label: 'Producto publicado', icon: CheckCircle2, chip: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
  unpublished: { label: 'Retirado de publicación', icon: EyeOff, chip: 'bg-slate-50 text-slate-500 ring-slate-200' },
  archived: { label: 'Producto archivado', icon: Archive, chip: 'bg-amber-50 text-amber-600 ring-amber-100' },
  restored: { label: 'Producto restaurado', icon: RotateCcw, chip: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
  duplicated: { label: 'Producto duplicado', icon: Copy, chip: 'bg-slate-50 text-slate-500 ring-slate-200' },
  deleted: { label: 'Producto eliminado', icon: Trash2, chip: 'bg-red-50 text-red-600 ring-red-100' },
}

const filterOptions: { value: 'all' | ActivityType; label: string }[] = [
  { value: 'all', label: 'Todas las acciones' },
  { value: 'created', label: 'Creaciones' },
  { value: 'updated', label: 'Actualizaciones' },
  { value: 'published', label: 'Publicaciones' },
  { value: 'unpublished', label: 'Retiros de publicación' },
  { value: 'archived', label: 'Archivados' },
  { value: 'restored', label: 'Restauraciones' },
  { value: 'duplicated', label: 'Duplicados' },
  { value: 'deleted', label: 'Eliminaciones' },
]

export default function ActividadPage() {
  const { activity, products, hydrated } = useAdmin()
  const [type, setType] = useState<'all' | ActivityType>('all')

  const filtered = useMemo(
    () => (type === 'all' ? activity : activity.filter((entry) => entry.type === type)),
    [activity, type]
  )

  if (!hydrated) {
    return <LoadingState label="Cargando actividad…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="General"
        title="Actividad reciente"
        description="Registro de los cambios realizados en el catálogo durante esta sesión y las anteriores."
        actions={
          <Link href="/productos" className={btnSecondary}>
            <Package className="size-4" aria-hidden="true" />
            Ir a productos
          </Link>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <p className="text-[11px] font-medium text-slate-500">
          <span className="font-bold text-slate-900">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'evento registrado' : 'eventos registrados'}
          {type !== 'all' && ' con el filtro aplicado'}
        </p>
        <Select
          value={type}
          onChange={(event) => setType(event.target.value as 'all' | ActivityType)}
          aria-label="Filtrar actividad por tipo"
          className="w-full sm:w-56"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title={activity.length === 0 ? 'Sin actividad registrada' : 'Sin eventos de este tipo'}
          description={
            activity.length === 0
              ? 'Los cambios que realices sobre productos, precios o publicación aparecerán aquí.'
              : 'Prueba con otro tipo de acción o vuelve a ver todas las actividades.'
          }
          action={
            activity.length === 0 ? (
              <Link href="/productos/nuevo" className={btnSecondary}>
                Crear producto
              </Link>
            ) : (
              <button type="button" onClick={() => setType('all')} className={btnSecondary}>
                Ver todas
              </button>
            )
          }
        />
      ) : (
        <SectionCard
          title="Registro de actividad"
          description="Eventos ordenados del más reciente al más antiguo."
          icon={History}
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-slate-100">
            {filtered.map((entry) => {
              const meta = activityMeta[entry.type]
              const Icon = meta.icon
              const product = entry.productId
                ? products.find((item) => item.id === entry.productId)
                : undefined
              return (
                <li key={entry.id} className="flex items-start gap-3 px-5 py-3.5 sm:px-6">
                  <span
                    className={cn(
                      'mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
                      meta.chip
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    {product ? (
                      <Link
                        href={`/productos/${product.id}`}
                        className="line-clamp-1 text-xs font-semibold text-slate-900 transition hover:text-blue-600"
                      >
                        {entry.productName}
                      </Link>
                    ) : (
                      <p className="line-clamp-1 text-xs font-semibold text-slate-900">
                        {entry.productName}
                      </p>
                    )}
                    <p className="mt-0.5 text-[10.5px] text-slate-500">
                      {entry.detail ?? meta.label}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      {meta.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{formatDateTime(entry.at)}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </SectionCard>
      )}
    </div>
  )
}
