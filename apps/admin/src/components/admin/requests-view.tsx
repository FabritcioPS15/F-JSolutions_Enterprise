'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Check,
  FileText,
  Globe2,
  Inbox,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import {
  ClientStatusBadge,
  RequestStatusBadge,
} from '@/components/admin/commercial-ui'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Modal } from '@/components/admin/modal'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  Field,
  LoadingState,
  PageHeader,
  Select,
  StatCard,
  btnPrimary,
  btnSecondary,
  inputClass,
  textareaClass,
} from '@/components/admin/ui'
import {
  formatDateTime,
  formatNumber,
  requestChannelLabels,
  requestStatusLabels,
} from '@/lib/admin/format'
import type {
  RequestChannel,
  RequestStatus,
  ServiceRequest,
} from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const channelIcons = {
  web: Globe2,
  email: Mail,
  whatsapp: MessageCircle,
  phone: Phone,
} as const

type RequestDraft = {
  name: string
  company: string
  email: string
  phone: string
  topic: string
  channel: RequestChannel
  message: string
  notes: string
}

type RequestErrors = Partial<Record<keyof RequestDraft, string>>

const emptyDraft: RequestDraft = {
  name: '',
  company: '',
  email: '',
  phone: '',
  topic: '',
  channel: 'web',
  message: '',
  notes: '',
}

const statusOrder: RequestStatus[] = ['new', 'review', 'attended', 'discarded']

function validate(draft: RequestDraft): RequestErrors {
  const errors: RequestErrors = {}
  if (draft.name.trim().length < 2) errors.name = 'Ingresa el nombre del contacto.'
  if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = 'Escribe un correo válido.'
  if (!draft.topic.trim()) errors.topic = 'Resume el motivo de la solicitud.'
  if (draft.message.trim().length < 10) {
    errors.message = 'Describe la necesidad con al menos 10 caracteres.'
  }
  return errors
}

export function RequestsView() {
  const {
    hydrated,
    requests,
    clients,
    quotes,
    createRequest,
    updateRequest,
    removeRequest,
    setRequestStatus,
    convertRequestToQuote,
  } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | RequestStatus>('all')
  const [channel, setChannel] = useState<'all' | RequestChannel>('all')
  const [detailId, setDetailId] = useState<string | null>(null)
  const [notesDraft, setNotesDraft] = useState('')
  const [registering, setRegistering] = useState(false)
  const [draft, setDraft] = useState<RequestDraft>(emptyDraft)
  const [errors, setErrors] = useState<RequestErrors>({})
  const [deleteTarget, setDeleteTarget] = useState<ServiceRequest | null>(null)

  const detail = detailId ? requests.find((item) => item.id === detailId) ?? null : null
  const linkedClient = detail?.clientId
    ? clients.find((client) => client.id === detail.clientId) ?? null
    : null
  const linkedQuote = detail?.quoteId
    ? quotes.find((quote) => quote.id === detail.quoteId) ?? null
    : null

  useEffect(() => {
    if (!detailId) setNotesDraft('')
  }, [detailId])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return requests
      .filter((item) => {
        const matchesTerm =
          !term ||
          item.code.toLowerCase().includes(term) ||
          item.name.toLowerCase().includes(term) ||
          item.company.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term) ||
          item.topic.toLowerCase().includes(term) ||
          item.message.toLowerCase().includes(term)
        const matchesStatus = status === 'all' || item.status === status
        const matchesChannel = channel === 'all' || item.channel === channel
        return matchesTerm && matchesStatus && matchesChannel
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [requests, query, status, channel])

  const newCount = requests.filter((item) => item.status === 'new').length
  const reviewCount = requests.filter((item) => item.status === 'review').length
  const attendedCount = requests.filter((item) => item.status === 'attended').length
  const hasFilters = query !== '' || status !== 'all' || channel !== 'all'

  function update<K extends keyof RequestDraft>(key: K, value: RequestDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function resetFilters() {
    setQuery('')
    setStatus('all')
    setChannel('all')
  }

  function openRequest(item: ServiceRequest) {
    setDetailId(item.id)
    setNotesDraft(item.notes)
  }

  function openRegister() {
    setDraft(emptyDraft)
    setErrors({})
    setRegistering(true)
  }

  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Revisa la solicitud', 'Faltan datos para registrar el contacto.')
      return
    }
    const created = createRequest({
      name: draft.name.trim(),
      company: draft.company.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      topic: draft.topic.trim(),
      message: draft.message.trim(),
      channel: draft.channel,
      status: 'new',
      notes: draft.notes.trim(),
    })
    toast.success('Solicitud registrada', created.code)
    setRegistering(false)
  }

  function handleStatus(item: ServiceRequest, next: RequestStatus) {
    if (item.status === next) return
    setRequestStatus(item.id, next)
    toast.info(`Solicitud ${requestStatusLabels[next].toLowerCase()}`, item.code)
  }

  function handleSaveNotes() {
    if (!detail) return
    updateRequest(detail.id, { notes: notesDraft.trim() })
    toast.success('Nota guardada', detail.code)
  }

  function handleConvert(item: ServiceRequest) {
    const quote = convertRequestToQuote(item.id)
    if (!quote) return
    toast.success(
      'Cotización creada',
      `${quote.code} quedó como borrador. Agrega los productos desde Cotizaciones.`
    )
    setDetailId(null)
  }

  function handleDelete() {
    if (!deleteTarget) return
    removeRequest(deleteTarget.id)
    toast.success('Solicitud eliminada', deleteTarget.code)
    if (detailId === deleteTarget.id) setDetailId(null)
    setDeleteTarget(null)
  }

  if (!hydrated) {
    return <LoadingState label="Cargando solicitudes…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Comercial"
        title="Solicitudes recibidas"
        description="Bandeja de consultas y pedidos de cotización. Regístralas o conviértelas en cotizaciones."
        actions={
          <button type="button" className={btnPrimary} onClick={openRegister}>
            <Plus className="size-4" aria-hidden="true" />
            Registrar solicitud
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Nuevas"
          value={formatNumber(newCount)}
          helper="Sin revisar todavía"
          icon={Inbox}
        />
        <StatCard
          label="En revisión"
          value={formatNumber(reviewCount)}
          helper="Con seguimiento en curso"
          icon={FileText}
        />
        <StatCard
          label="Atendidas"
          value={formatNumber(attendedCount)}
          helper="Con respuesta o cotización"
          icon={Check}
        />
        <StatCard
          label="Total"
          value={formatNumber(requests.length)}
          helper={
            requests.length - newCount - reviewCount - attendedCount === 1
              ? '1 descartada'
              : `${formatNumber(requests.length - newCount - reviewCount - attendedCount)} descartadas`
          }
          icon={Globe2}
        />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-0 lg:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por código, contacto, empresa o mensaje…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar solicitudes"
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
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value as 'all' | RequestStatus)}
              aria-label="Filtrar por estado"
              className="sm:w-full lg:w-40"
            >
              <option value="all">Todos los estados</option>
              {statusOrder.map((item) => (
                <option key={item} value={item}>
                  {requestStatusLabels[item]}
                </option>
              ))}
            </Select>
            <Select
              value={channel}
              onChange={(event) => setChannel(event.target.value as 'all' | RequestChannel)}
              aria-label="Filtrar por canal"
              className="sm:w-full lg:w-40"
            >
              <option value="all">Todos los canales</option>
              {(Object.keys(requestChannelLabels) as RequestChannel[]).map((item) => (
                <option key={item} value={item}>
                  {requestChannelLabels[item]}
                </option>
              ))}
            </Select>
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className={cn(btnSecondary, 'h-10')}
                title="Limpiar filtros"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-500">
          <span className="font-bold text-slate-900">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'solicitud' : 'solicitudes'}
          {hasFilters ? ' con los filtros aplicados' : ' en la bandeja'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={requests.length === 0 ? 'Bandeja vacía' : 'Sin resultados'}
          description={
            requests.length === 0
              ? 'Cuando alguien escriba desde la tienda o registres una consulta, aparecerá aquí.'
              : 'No hay solicitudes con esos criterios. Prueba limpiando los filtros.'
          }
          action={
            requests.length === 0 ? (
              <button type="button" className={btnPrimary} onClick={openRegister}>
                <Plus className="size-4" aria-hidden="true" />
                Registrar solicitud
              </button>
            ) : (
              <button type="button" className={btnSecondary} onClick={resetFilters}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Limpiar filtros
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const ChannelIcon = channelIcons[item.channel]
            return (
              <article
                key={item.id}
                className={cn(
                  'group rounded-2xl border bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-sm sm:p-5',
                  item.status === 'new' ? 'border-blue-200/80' : 'border-slate-200/80'
                )}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
                      item.status === 'new'
                        ? 'bg-blue-50 text-blue-600 ring-blue-100'
                        : 'bg-slate-50 text-slate-500 ring-slate-200/70'
                    )}
                    aria-hidden="true"
                  >
                    <ChannelIcon className="size-[18px]" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[12.5px] font-bold text-slate-900">
                        {item.company || item.name}
                      </p>
                      {item.company && (
                        <span className="text-[10.5px] text-slate-400">{item.name}</span>
                      )}
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-slate-500">
                        {item.code}
                      </span>
                      <RequestStatusBadge status={item.status} />
                    </div>
                    <p className="mt-1 text-[12px] font-semibold text-slate-800">{item.topic}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                      {item.message}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                      <span>{requestChannelLabels[item.channel]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDateTime(item.createdAt)}</span>
                      {item.email && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{item.email}</span>
                        </>
                      )}
                      {item.quoteId && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">
                          <FileText className="size-2.5" aria-hidden="true" />
                          Cotización creada
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => openRequest(item)}
                    >
                      Abrir
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-xs transition hover:bg-red-50 hover:text-red-600"
                      title="Eliminar solicitud"
                      aria-label={`Eliminar solicitud ${item.code}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetailId(null)}
        title={detail ? `Solicitud ${detail.code}` : 'Solicitud'}
        description={detail?.topic}
        size="lg"
        footer={
          <>
            {detail && (
              <button
                type="button"
                onClick={() => {
                  setDetailId(null)
                  setDeleteTarget(detail)
                }}
                className="mr-auto inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Eliminar
              </button>
            )}
            <button type="button" className={btnSecondary} onClick={() => setDetailId(null)}>
              Cerrar
            </button>
            {detail &&
              (linkedQuote ? (
                <Link
                  href={`/cotizaciones?q=${encodeURIComponent(linkedQuote.code)}`}
                  className={btnPrimary}
                >
                  <FileText className="size-4" aria-hidden="true" />
                  Ver cotización
                </Link>
              ) : (
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() => handleConvert(detail)}
                >
                  <FileText className="size-4" aria-hidden="true" />
                  Convertir en cotización
                </button>
              ))}
          </>
        }
      >
        {detail && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Contacto
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-900">{detail.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{detail.company || 'Sin empresa'}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Canal y fecha
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-900">
                  {requestChannelLabels[detail.channel]}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {formatDateTime(detail.createdAt)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Correo
                </p>
                <a
                  href={`mailto:${detail.email}`}
                  className="mt-1 block truncate text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  {detail.email}
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Teléfono
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-900">
                  {detail.phone || 'Sin teléfono'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Mensaje recibido
              </p>
              <p className="mt-2 whitespace-pre-line rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs leading-relaxed text-slate-700">
                {detail.message}
              </p>
            </div>

            {(linkedClient || linkedQuote) && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Vinculado
                </span>
                {linkedClient && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-700">
                    {linkedClient.company || linkedClient.name}
                    <ClientStatusBadge status={linkedClient.status} />
                  </span>
                )}
                {linkedQuote && (
                  <Link
                    href={`/cotizaciones?q=${encodeURIComponent(linkedQuote.code)}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    <FileText className="size-3" aria-hidden="true" />
                    {linkedQuote.code}
                  </Link>
                )}
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Estado de atención
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {statusOrder.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleStatus(detail, item)}
                    aria-pressed={detail.status === item}
                    className={cn(
                      'h-9 rounded-lg border text-[11px] font-semibold transition',
                      detail.status === item
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    {requestStatusLabels[item]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Field
                label="Notas internas"
                htmlFor="request-notes"
                hint="Seguimiento visible solo para el equipo."
              >
                <textarea
                  id="request-notes"
                  value={notesDraft}
                  onChange={(event) => setNotesDraft(event.target.value)}
                  className={cn(textareaClass, 'min-h-24')}
                  placeholder="Llamadas, acuerdos, próximos pasos…"
                />
              </Field>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={handleSaveNotes}
                  disabled={notesDraft.trim() === detail.notes}
                >
                  Guardar nota
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={registering}
        onClose={() => setRegistering(false)}
        title="Registrar solicitud"
        description="Úsalo para consultas recibidas por teléfono, WhatsApp o de forma presencial."
        size="lg"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setRegistering(false)}>
              Cancelar
            </button>
            <button type="submit" form="request-form" className={btnPrimary}>
              Registrar solicitud
            </button>
          </>
        }
      >
        <form id="request-form" onSubmit={handleRegister} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contacto" htmlFor="request-name" required error={errors.name}>
              <input
                id="request-name"
                value={draft.name}
                onChange={(event) => update('name', event.target.value)}
                className={inputClass}
                placeholder="Nombre y apellido"
                aria-invalid={Boolean(errors.name)}
              />
            </Field>
            <Field label="Empresa" htmlFor="request-company">
              <input
                id="request-company"
                value={draft.company}
                onChange={(event) => update('company', event.target.value)}
                className={inputClass}
                placeholder="Nombre de la empresa"
              />
            </Field>
            <Field label="Correo" htmlFor="request-email" required error={errors.email}>
              <input
                id="request-email"
                type="email"
                value={draft.email}
                onChange={(event) => update('email', event.target.value)}
                className={inputClass}
                placeholder="contacto@empresa.pe"
                aria-invalid={Boolean(errors.email)}
              />
            </Field>
            <Field label="Teléfono" htmlFor="request-phone">
              <input
                id="request-phone"
                value={draft.phone}
                onChange={(event) => update('phone', event.target.value)}
                className={inputClass}
                placeholder="+51 987 654 321"
                inputMode="tel"
              />
            </Field>
            <Field label="Motivo" htmlFor="request-topic" required error={errors.topic}>
              <input
                id="request-topic"
                value={draft.topic}
                onChange={(event) => update('topic', event.target.value)}
                className={inputClass}
                placeholder="Cotización de laptops corporativas"
                aria-invalid={Boolean(errors.topic)}
              />
            </Field>
            <Field label="Canal" htmlFor="request-channel">
              <Select
                id="request-channel"
                value={draft.channel}
                onChange={(event) => update('channel', event.target.value as RequestChannel)}
              >
                {(Object.keys(requestChannelLabels) as RequestChannel[]).map((item) => (
                  <option key={item} value={item}>
                    {requestChannelLabels[item]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Detalle de la solicitud"
              htmlFor="request-message"
              required
              error={errors.message}
              className="sm:col-span-2"
            >
              <textarea
                id="request-message"
                value={draft.message}
                onChange={(event) => update('message', event.target.value)}
                className={cn(textareaClass, 'min-h-28')}
                placeholder="Qué necesita el cliente, cantidades, plazos…"
                aria-invalid={Boolean(errors.message)}
              />
            </Field>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar solicitud"
        description={`Se eliminará la solicitud ${deleteTarget?.code ?? ''} de la bandeja local. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar solicitud"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
