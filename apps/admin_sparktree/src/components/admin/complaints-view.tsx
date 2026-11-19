'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import { ExportMenu } from '@/components/admin/export-menu'
import { Modal } from '@/components/admin/modal'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  FilterSelect,
  LoadingState,
  PageHeader,
  Select,
  StatCard,
  btnPrimary,
  btnSecondary,
  inputClass,
  textareaClass,
} from '@/components/admin/ui'
import { useAdmin } from '@/components/admin/admin-provider'
import { complaintsDataset } from '@/lib/admin/excel-exports'
import { formatDate, formatDateTime, formatNumber } from '@/lib/admin/format'
import type {
  Complaint,
  ComplaintKind,
  ComplaintStatus,
} from '@fj-solutions/contracts/complaints-book'
import { cn } from '@/lib/utils'

const kindLabels: Record<ComplaintKind, string> = {
  reclamo: 'Reclamo',
  queja: 'Queja',
}

const statusLabels: Record<ComplaintStatus, string> = {
  pending: 'Pendiente',
  review: 'En revisión',
  answered: 'Respondido',
}

const documentLabels: Record<Complaint['consumer']['documentType'], string> = {
  dni: 'DNI',
  ce: 'Carné de extranjería',
  pasaporte: 'Pasaporte',
  ruc: 'RUC',
}

const statusStyles: Record<ComplaintStatus, string> = {
  pending: 'bg-amber-500/10 text-warning-ink ring-amber-500/25',
  review: 'bg-sky-500/10 text-sky-600 ring-sky-500/25',
  answered: 'bg-emerald-500/10 text-success-ink ring-emerald-500/25',
}

const statusOrder: Record<ComplaintStatus, number> = { pending: 0, review: 1, answered: 2 }

function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

function KindBadge({ kind }: { kind: ComplaintKind }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        kind === 'reclamo'
          ? 'bg-tint-brand text-brand-ink ring-[#5946A6]/20'
          : 'bg-muted text-muted-foreground ring-border/70'
      )}
    >
      {kindLabels[kind]}
    </span>
  )
}

function deadlineLabel(item: Complaint, now: number) {
  if (item.status === 'answered') return 'Atendido dentro del plazo'
  const days = Math.ceil((new Date(item.dueAt).getTime() - now) / 86_400_000)
  if (Number.isNaN(days)) return 'Sin fecha'
  if (days < 0) return `Vencido hace ${Math.abs(days)} ${Math.abs(days) === 1 ? 'día' : 'días'}`
  if (days === 0) return 'Vence hoy'
  return `${days} ${days === 1 ? 'día' : 'días'} para responder`
}

function isOverdue(item: Complaint, now: number) {
  if (item.status === 'answered') return false
  return new Date(item.dueAt).getTime() < now
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? ''
}

function responseTemplate(item: Complaint) {
  return `Hola ${firstName(item.consumer.name)}:

Gracias por comunicarte con F&J Systems. Hemos revisado tu ${kindLabels[item.kind].toLowerCase()} con código ${item.code} respecto a ${item.item.description.toLowerCase()}.

[Describe aquí la solución o el acuerdo alcanzado]

Quedamos atentos a cualquier consulta adicional.

Saludos,
Equipo de F&J Systems`
}

type StatusFilter = ComplaintStatus | 'all'
type KindFilter = ComplaintKind | 'all'

export function ComplaintsView() {
  const { can } = useAdmin()
  const toast = useToast()

  const [items, setItems] = useState<Complaint[]>([])
  const [deadlineDays, setDeadlineDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadError, setLoadError] = useState('')

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [kindFilter, setKindFilter] = useState<KindFilter>('all')

  const [selected, setSelected] = useState<Complaint | null>(null)
  const [statusDraft, setStatusDraft] = useState<ComplaintStatus>('pending')
  const [responseDraft, setResponseDraft] = useState('')
  const [saving, setSaving] = useState(false)

  const canReply = can('complaints', 'reply')
  const canUpdate = can('complaints', 'update')
  const now = Date.now()

  const load = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      if (mode === 'refresh') setRefreshing(true)
      else setLoading(true)
      try {
        const response = await fetch('/api/admin/complaints', { cache: 'no-store' })
        const payload = (await response.json()) as {
          success?: boolean
          message?: string
          data?: { complaints: Complaint[]; deadlineDays: number }
        }
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.message ?? 'No se pudo cargar el libro de reclamaciones.')
        }
        setItems(payload.data.complaints)
        setDeadlineDays(payload.data.deadlineDays)
        setLoadError('')
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Inténtalo de nuevo en unos segundos.')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    []
  )

  useEffect(() => {
    void load()
  }, [load])

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        const byStatus = statusOrder[a.status] - statusOrder[b.status]
        if (byStatus !== 0) return byStatus
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }),
    [items]
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return sorted.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (kindFilter !== 'all' && item.kind !== kindFilter) return false
      if (!needle) return true
      return (
        item.code.toLowerCase().includes(needle) ||
        item.consumer.name.toLowerCase().includes(needle) ||
        item.consumer.email.toLowerCase().includes(needle) ||
        item.consumer.documentNumber.toLowerCase().includes(needle) ||
        item.item.description.toLowerCase().includes(needle)
      )
    })
  }, [sorted, statusFilter, kindFilter, query])

  const pendingCount = items.filter((item) => item.status === 'pending').length
  const reviewCount = items.filter((item) => item.status === 'review').length
  const answeredCount = items.filter((item) => item.status === 'answered').length
  const overdueCount = items.filter((item) => isOverdue(item, now)).length

  function openDetail(item: Complaint) {
    setSelected(item)
    setStatusDraft(item.status)
    setResponseDraft(item.response?.message ?? '')
  }

  function closeDetail() {
    if (saving) return
    setSelected(null)
    setResponseDraft('')
  }

  async function patchComplaint(item: Complaint, patch: { status?: ComplaintStatus; response?: string }) {
    const response = await fetch(`/api/admin/complaints/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const payload = (await response.json()) as {
      success?: boolean
      message?: string
      data?: Complaint
    }
    if (!response.ok || !payload.success || !payload.data) {
      throw new Error(payload.message ?? 'No se pudo guardar el cambio.')
    }
    setItems((prev) => prev.map((row) => (row.id === payload.data!.id ? payload.data! : row)))
    return payload.data
  }

  async function handleQuickReview(item: Complaint) {
    try {
      await patchComplaint(item, { status: 'review' })
      toast.success('Caso en revisión', `${item.code} pasó a revisión.`)
    } catch (error) {
      toast.error('No se pudo actualizar', error instanceof Error ? error.message : undefined)
    }
  }

  async function handleSave() {
    if (!selected) return
    const response = responseDraft.trim()

    if (statusDraft === 'answered' && response.length < 10) {
      toast.error('Falta la respuesta', 'Describe la respuesta al consumidor antes de cerrar el caso.')
      return
    }
    if (response.length > 0 && response.length < 10) {
      toast.error('Respuesta muy corta', 'Escribe al menos 10 caracteres.')
      return
    }
    if (!canUpdate && !canReply) return

    setSaving(true)
    try {
      const patch: { status?: ComplaintStatus; response?: string } = {}
      if (canReply && response) patch.response = response
      // Sin respuesta, el estado se controla por separado; con respuesta, la API
      // marca el caso como respondido.
      if (canUpdate && !response) patch.status = statusDraft
      const updated = await patchComplaint(selected, patch)
      setSelected(updated)
      setStatusDraft(updated.status)
      toast.success(
        updated.status === 'answered' ? 'Reclamo respondido' : 'Caso actualizado',
        `${updated.code} quedó registrado.`
      )
    } catch (error) {
      toast.error('No se pudo guardar', error instanceof Error ? error.message : undefined)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Cargando libro de reclamaciones…" />

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Atención al cliente"
        title="Libro de reclamaciones"
        description={`Reclamos y quejas registrados en la tienda. Atiéndelos y responde antes del plazo legal de ${deadlineDays} días calendario.`}
        actions={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => void load('refresh')}
              disabled={refreshing}
            >
              <RefreshCw className={cn('size-4', refreshing && 'animate-spin')} aria-hidden="true" />
              Actualizar
            </button>
            <ExportMenu
              build={() => complaintsDataset(filtered)}
              nouns={['reclamo', 'reclamos']}
              disabled={filtered.length === 0}
            />
          </>
        }
      />

      {loadError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-ink" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold text-warning-ink">No se pudo leer el libro</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-warning-ink">{loadError}</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-amber-500/40 bg-card px-3 text-[11px] font-semibold text-warning-ink transition hover:bg-amber-500/15"
            onClick={() => void load('refresh')}
            disabled={refreshing}
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pendientes" value={formatNumber(pendingCount)} helper="Sin revisar" icon={Clock3} />
        <StatCard label="En revisión" value={formatNumber(reviewCount)} helper="Con seguimiento" icon={BookOpenCheck} />
        <StatCard label="Respondidos" value={formatNumber(answeredCount)} helper="Con respuesta enviada" icon={CheckCircle2} />
        <StatCard
          label="Fuera de plazo"
          value={formatNumber(overdueCount)}
          helper={overdueCount > 0 ? 'Requieren atención inmediata' : 'Ningún caso vencido'}
          icon={AlertTriangle}
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full min-w-0 lg:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por código, consumidor, documento o correo…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar en el libro de reclamaciones"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground/80"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect
              label="Estado"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as StatusFilter)}
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'pending', label: 'Pendientes' },
                { value: 'review', label: 'En revisión' },
                { value: 'answered', label: 'Respondidos' },
              ]}
            />
            <FilterSelect
              label="Tipo"
              value={kindFilter}
              onChange={(value) => setKindFilter(value as KindFilter)}
              options={[
                { value: 'all', label: 'Reclamos y quejas' },
                { value: 'reclamo', label: 'Reclamos' },
                { value: 'queja', label: 'Quejas' },
              ]}
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card shadow-xs">
          <EmptyState
            icon={BookOpenCheck}
            title={items.length === 0 ? 'Todavía no hay reclamos registrados' : 'Sin resultados con estos filtros'}
            description={
              items.length === 0
                ? 'Los reclamos y quejas que los clientes registren en la tienda aparecerán aquí.'
                : 'Prueba con otro estado, tipo o término de búsqueda.'
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const overdue = isOverdue(item, now)
            return (
              <article
                key={item.id}
                className={cn(
                  'rounded-2xl border bg-card p-4 shadow-xs transition hover:border-input hover:shadow-sm sm:p-5',
                  overdue ? 'border-red-500/40' : item.status === 'pending' ? 'border-amber-500/35' : 'border-border/80'
                )}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
                      item.kind === 'reclamo'
                        ? 'bg-tint-brand text-brand-ink ring-[#5946A6]/20'
                        : 'bg-muted text-muted-foreground ring-border/70'
                    )}
                  >
                    <BookOpenCheck className="size-4" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold tracking-wide text-muted-foreground">
                        {item.code}
                      </span>
                      <KindBadge kind={item.kind} />
                      <StatusBadge status={item.status} />
                      {overdue && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10.5px] font-semibold text-danger-ink ring-1 ring-inset ring-red-500/25">
                          Fuera de plazo
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 truncate text-[13.5px] font-bold text-foreground">
                      {item.consumer.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.item.type === 'producto' ? 'Producto' : 'Servicio'} · {item.item.description}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-muted-foreground">{item.detail}</p>
                  </div>

                  <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:items-end">
                    <span
                      className={cn(
                        'text-[11px] font-semibold',
                        overdue ? 'text-danger-ink' : 'text-muted-foreground'
                      )}
                    >
                      {deadlineLabel(item, now)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Registrado {formatDateTime(item.createdAt)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.status === 'pending' && canUpdate && (
                        <button
                          type="button"
                          className={cn(btnSecondary, 'h-9 text-xs')}
                          onClick={() => void handleQuickReview(item)}
                        >
                          Tomar caso
                        </button>
                      )}
                      <button
                        type="button"
                        className={cn(btnPrimary, 'h-9 px-3 text-xs')}
                        onClick={() => openDetail(item)}
                      >
                        {item.status === 'answered' ? 'Ver detalle' : 'Atender'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal
        open={selected !== null}
        onClose={closeDetail}
        title={selected ? `${selected.code} · ${kindLabels[selected.kind]}` : 'Reclamo'}
        description={
          selected
            ? `Registrado ${formatDateTime(selected.createdAt)} · Límite ${formatDate(selected.dueAt)}`
            : undefined
        }
        size="lg"
        footer={
          selected ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <KindBadge kind={selected.kind} />
                <StatusBadge status={selected.status} />
                {isOverdue(selected, now) && (
                  <span className="text-[11px] font-semibold text-danger-ink">Fuera de plazo</span>
                )}
              </div>
              <div className="flex gap-2">
                <button type="button" className={btnSecondary} onClick={closeDetail} disabled={saving}>
                  Cerrar
                </button>
                {(canUpdate || canReply) && (
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => void handleSave()}
                    disabled={saving}
                  >
                    {saving ? (
                      <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="size-4" aria-hidden="true" />
                    )}
                    Guardar cambios
                  </button>
                )}
              </div>
            </div>
          ) : undefined
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem icon={UserRound} label="Consumidor" value={selected.consumer.name} />
              <DetailItem
                icon={ShieldCheck}
                label="Documento"
                value={`${documentLabels[selected.consumer.documentType]} ${selected.consumer.documentNumber}`}
              />
              <DetailItem icon={Mail} label="Correo" value={selected.consumer.email} />
              <DetailItem icon={Phone} label="Teléfono" value={selected.consumer.phone} />
              <DetailItem icon={MapPin} label="Domicilio" value={selected.consumer.address} />
              <DetailItem
                icon={BookOpenCheck}
                label="Bien o servicio"
                value={`${selected.item.type === 'producto' ? 'Producto' : 'Servicio'} · ${selected.item.description}`}
              />
              {selected.item.amount ? (
                <DetailItem
                  icon={BookOpenCheck}
                  label="Monto reclamado"
                  value={`S/ ${selected.item.amount.toFixed(2)}`}
                />
              ) : null}
              <DetailItem
                icon={BookOpenCheck}
                label="Pedido o comprobante"
                value={selected.item.orderCode || 'No indicado'}
              />
              {selected.consumer.isMinor && (
                <DetailItem
                  icon={UserRound}
                  label="Apoderado (menor de edad)"
                  value={selected.consumer.guardianName || 'No indicado'}
                />
              )}
            </div>

            <div className="space-y-3">
              <TextBlock label="Detalle del caso" value={selected.detail} />
              <TextBlock label="Pedido concreto" value={selected.request} />
            </div>

            {selected.response && (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-success-ink">
                  Respuesta enviada · {formatDateTime(selected.response.respondedAt)}
                </p>
                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-foreground">
                  {selected.response.message}
                </p>
              </div>
            )}

            {(canUpdate || canReply) && (
              <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4">
                {canUpdate && (
                  <div>
                    <label
                      htmlFor="complaint-status"
                      className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
                    >
                      Estado del caso
                    </label>
                    <Select
                      id="complaint-status"
                      value={statusDraft}
                      onChange={(event) => setStatusDraft(event.target.value as ComplaintStatus)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="review">En revisión</option>
                      <option value="answered">Respondido</option>
                    </Select>
                  </div>
                )}

                {canReply && (
                  <div>
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor="complaint-response"
                        className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
                      >
                        Respuesta al consumidor
                      </label>
                      {!responseDraft.trim() && (
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-brand-ink transition hover:underline"
                          onClick={() => setResponseDraft(responseTemplate(selected))}
                        >
                          Usar plantilla
                        </button>
                      )}
                    </div>
                    <textarea
                      id="complaint-response"
                      value={responseDraft}
                      onChange={(event) => setResponseDraft(event.target.value)}
                      className={textareaClass}
                      rows={6}
                      placeholder="Describe la solución o el acuerdo alcanzado…"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      La respuesta quedará visible en la consulta pública del cliente.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-muted/30 px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-semibold text-foreground">{value}</p>
    </div>
  )
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-foreground">{value}</p>
    </div>
  )
}
