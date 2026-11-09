'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  ExternalLink,
  FileStack,
  Layers,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Undo2,
} from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { RowActions } from '@/components/admin/row-actions'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  FilterSelect,
  LoadingState,
  PageHeader,
  StatCard,
  btnPrimary,
  btnSecondary,
  inputClass,
  tableClass,
  tableHeadRowClass,
} from '@/components/admin/ui'
import { formatDate } from '@/lib/admin/format'
import {
  ServiceOfferingApiError,
  deleteServiceOffering,
  fetchServiceOfferings,
  updateServiceOfferingStatus,
} from '@/lib/services/service-offerings'
import type {
  ServiceOffering,
  ServiceOfferingCategory,
  ServiceOfferingStatus,
} from '@fj-solutions/contracts/admin'
import { cn } from '@/lib/utils'

const storeUrl = process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3000'

const categories: ServiceOfferingCategory[] = [
  'Soporte TI',
  'Infraestructura TI',
  'Desarrollo de software',
]

const statusLabels: Record<ServiceOfferingStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
}

const statusClasses: Record<ServiceOfferingStatus, string> = {
  draft: 'bg-amber-50 text-amber-700 ring-amber-200',
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  archived: 'bg-slate-100 text-slate-600 ring-slate-200',
}

function storePath(service: ServiceOffering) {
  return service.category === 'Desarrollo de software'
    ? `${storeUrl}/sistemas/${service.slug}`
    : `${storeUrl}/servicios/${service.slug}`
}

export function ServicesView() {
  const toast = useToast()
  const [services, setServices] = useState<ServiceOffering[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | ServiceOfferingCategory>('all')
  const [status, setStatus] = useState<'all' | ServiceOfferingStatus>('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ServiceOffering | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchServiceOfferings()
      setServices(result)
      setError(null)
    } catch (err) {
      setError(
        err instanceof ServiceOfferingApiError
          ? err.message
          : 'No se pudo cargar el catálogo de servicios.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return services.filter((service) => {
      if (category !== 'all' && service.category !== category) return false
      if (status !== 'all' && service.status !== status) return false
      if (!needle) return true
      return (
        service.title.toLowerCase().includes(needle) ||
        service.slug.toLowerCase().includes(needle) ||
        service.summary.toLowerCase().includes(needle)
      )
    })
  }, [services, search, category, status])

  const counts = useMemo(
    () => ({
      total: services.length,
      published: services.filter((service) => service.status === 'published').length,
      draft: services.filter((service) => service.status === 'draft').length,
      archived: services.filter((service) => service.status === 'archived').length,
    }),
    [services]
  )

  async function toggleStatus(service: ServiceOffering) {
    setBusyId(service.id)
    try {
      const nextStatus: ServiceOfferingStatus =
        service.status === 'published' ? 'draft' : 'published'
      const updated = await updateServiceOfferingStatus(service.id, nextStatus)
      setServices((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      )
      toast.success(
        nextStatus === 'published' ? 'Servicio publicado' : 'Servicio despublicado',
        updated.title
      )
    } catch (err) {
      toast.error(
        'No se pudo cambiar el estado',
        err instanceof Error ? err.message : undefined
      )
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    setBusyId(target.id)
    try {
      await deleteServiceOffering(target.id)
      setServices((prev) => prev.filter((item) => item.id !== target.id))
      toast.success('Servicio eliminado', target.title)
    } catch (err) {
      toast.error(
        'No se pudo eliminar el servicio',
        err instanceof Error ? err.message : undefined
      )
    } finally {
      setBusyId(null)
    }
  }

  if (loading && services.length === 0) {
    return <LoadingState label="Cargando servicios TI…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Servicios TI"
        title="Catálogo de servicios"
        description="Administra las páginas de servicios que publica la tienda: contenido, alcances, preguntas frecuentes y relaciones."
        actions={
          <>
            <button type="button" className={btnSecondary} onClick={() => void load()}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Actualizar
            </button>
            <Link href="/servicios/nuevo" className={btnPrimary}>
              <Plus className="size-4" aria-hidden="true" />
              Nuevo servicio
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Servicios" value={String(counts.total)} icon={FileStack} />
        <StatCard label="Publicados" value={String(counts.published)} icon={Send} />
        <StatCard label="Borradores" value={String(counts.draft)} icon={Pencil} />
        <StatCard label="Archivados" value={String(counts.archived)} icon={Layers} />
      </div>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p>{error}</p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
            onClick={() => void load()}
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={cn(inputClass, 'pl-9')}
              placeholder="Buscar por título, slug o resumen…"
              aria-label="Buscar servicios"
            />
          </div>
          <FilterSelect
            label="Categoría"
            value={category}
            onChange={(next) => setCategory(next as 'all' | ServiceOfferingCategory)}
            ariaLabel="Filtrar por categoría"
            align="right"
            className="sm:w-full lg:w-56"
            options={[
              { value: 'all', label: 'Todas', count: services.length },
              ...categories.map((item) => ({
                value: item,
                label: item,
                count: services.filter((service) => service.category === item).length,
              })),
            ]}
          />
          <FilterSelect
            label="Estado"
            value={status}
            onChange={(next) => setStatus(next as 'all' | ServiceOfferingStatus)}
            ariaLabel="Filtrar por estado"
            align="right"
            className="sm:w-full lg:w-48"
            options={[
              { value: 'all', label: 'Todos', count: services.length },
              { value: 'published', label: 'Publicados', count: counts.published },
              { value: 'draft', label: 'Borradores', count: counts.draft },
              { value: 'archived', label: 'Archivados', count: counts.archived },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={FileStack}
              title={services.length === 0 ? 'Sin servicios registrados' : 'Sin resultados'}
              description={
                services.length === 0
                  ? 'Crea el primer servicio para publicarlo en la tienda. Mientras no haya datos, la tienda mantiene sus páginas estáticas.'
                  : 'No encontramos servicios con esos criterios. Prueba limpiando los filtros.'
              }
              action={
                services.length === 0 ? (
                  <Link href="/servicios/nuevo" className={btnPrimary}>
                    <Plus className="size-4" aria-hidden="true" />
                    Nuevo servicio
                  </Link>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadRowClass}>
                <tr>
                  <th className="px-5 py-3">Servicio</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Relacionados</th>
                  <th className="px-4 py-3">Actualizado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((service) => (
                  <tr key={service.id} className="align-top transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/servicios/${service.id}/editar`}
                        className="font-semibold text-slate-900 transition hover:text-[#5B21B6]"
                      >
                        {service.title}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-slate-400">/{service.slug}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{service.category}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
                          statusClasses[service.status]
                        )}
                      >
                        {statusLabels[service.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{service.related.length}</td>
                    <td className="px-4 py-3.5 text-slate-500">{formatDate(service.updatedAt)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <RowActions
                        label={`Acciones para ${service.title}`}
                        title={service.title}
                        items={[
                          {
                            key: 'store',
                            label: 'Ver en la tienda',
                            icon: ExternalLink,
                            href: storePath(service),
                            external: true,
                          },
                          {
                            key: 'edit',
                            label: 'Editar servicio',
                            icon: Pencil,
                            href: `/servicios/${service.id}/editar`,
                          },
                          {
                            key: 'status',
                            label:
                              service.status === 'published' ? 'Despublicar' : 'Publicar',
                            icon: service.status === 'published' ? Undo2 : Send,
                            disabled: busyId === service.id,
                            onSelect: () => void toggleStatus(service),
                          },
                          {
                            key: 'delete',
                            label: 'Eliminar servicio',
                            icon: Trash2,
                            tone: 'danger',
                            disabled: busyId === service.id,
                            onSelect: () => setDeleteTarget(service),
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

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
        Los servicios publicados aparecen en la tienda; si no hay registros, se mantienen las
        páginas estáticas del sitio.
      </p>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar servicio"
        description={
          deleteTarget
            ? `Se eliminará “${deleteTarget.title}” del catálogo. Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
