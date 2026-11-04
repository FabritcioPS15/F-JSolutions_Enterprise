'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  FileText,
  Globe2,
  Inbox,
  Mail,
  MailCheck,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import {
  ClientStatusBadge,
  RequestStatusBadge,
} from '@/components/admin/commercial-ui'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { ExportMenu } from '@/components/admin/export-menu'
import { Modal } from '@/components/admin/modal'
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
  textareaClass,
} from '@/components/admin/ui'
import { requestsDataset } from '@/lib/admin/excel-exports'
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
  if (!draft.topic.trim()) errors.topic = 'Resume el motivo de la consulta.'
  if (draft.message.trim().length < 10) {
    errors.message = 'Describe la necesidad con al menos 10 caracteres.'
  }
  return errors
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Inténtalo de nuevo en unos segundos.'
}

function replyTemplate(item: ServiceRequest) {
  const firstName = item.name.trim().split(/\s+/)[0] ?? ''
  return `Hola ${firstName},

Gracias por contactar a F&J Systems. Hemos recibido tu consulta "${item.topic}".



Quedamos atentos a cualquier consulta adicional.

Saludos,
Equipo de F&J Systems`
}

export function RequestsView() {
  const {
    hydrated,
    requests,
    clients,
    quotes,
    helpdeskError,
    helpdeskSynced,
    createRequest,
    updateRequest,
    removeRequest,
    setRequestStatus,
    convertRequestToQuote,
    refreshRequests,
    replyToRequest,
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
  const [replyOpen, setReplyOpen] = useState(false)
  const [replySubject, setReplySubject] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [working, setWorking] = useState<string | null>(null)

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

  useEffect(() => {
    if (!replyOpen) {
      setReplySubject('')
      setReplyMessage('')
    }
  }, [replyOpen])

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
  const repliedCount = requests.filter((item) => Boolean(item.repliedAt)).length
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

  function openReply(item: ServiceRequest) {
    setReplySubject(`Re: ${item.topic}`)
    setReplyMessage(replyTemplate(item))
    setReplyOpen(true)
  }

  async function handleRefresh() {
    setWorking('refresh')
    try {
      await refreshRequests()
      toast.success('Bandeja actualizada', 'Se sincronizaron las consultas de la web.')
    } catch (error) {
      toast.error('No se pudo actualizar', errorMessage(error))
    } finally {
      setWorking(null)
    }
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Revisa la consulta', 'Faltan datos para registrar el contacto.')
      return
    }

    setWorking('register')
    try {
      const created = await createRequest({
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
      toast.success('Consulta registrada', created.code)
      setRegistering(false)
    } catch (error) {
      toast.error('No se pudo registrar', errorMessage(error))
    } finally {
      setWorking(null)
    }
  }

  async function handleStatus(item: ServiceRequest, next: RequestStatus) {
    if (item.status === next || working) return
    setWorking(`status-${item.id}`)
    try {
      await setRequestStatus(item.id, next)
      toast.info(`Consulta ${requestStatusLabels[next].toLowerCase()}`, item.code)
    } catch (error) {
      toast.error('No se pudo actualizar', errorMessage(error))
    } finally {
      setWorking(null)
    }
  }

  async function handleSaveNotes() {
    if (!detail) return
    setWorking('notes')
    try {
      await updateRequest(detail.id, { notes: notesDraft.trim() })
      toast.success('Nota guardada', detail.code)
    } catch (error) {
      toast.error('No se pudo guardar la nota', errorMessage(error))
    } finally {
      setWorking(null)
    }
  }

  async function handleConvert(item: ServiceRequest) {
    setWorking('convert')
    try {
      const quote = await convertRequestToQuote(item.id)
      if (!quote) return
      toast.success(
        'Cotización creada',
        `${quote.code} quedó como borrador. Agrega los productos desde Cotizaciones.`
      )
      setDetailId(null)
    } catch (error) {
      toast.error('No se pudo convertir', errorMessage(error))
    } finally {
      setWorking(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setWorking('delete')
    try {
      await removeRequest(deleteTarget.id)
      toast.success('Consulta eliminada', deleteTarget.code)
      if (detailId === deleteTarget.id) setDetailId(null)
      setDeleteTarget(null)
    } catch (error) {
      toast.error('No se pudo eliminar', errorMessage(error))
    } finally {
      setWorking(null)
    }
  }

  async function handleSendReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!detail) return
    if (replySubject.trim().length < 3) {
      toast.error('Falta el asunto', 'Escribe un asunto para el correo.')
      return
    }
    if (replyMessage.trim().length < 10) {
      toast.error('Falta la respuesta', 'Escribe el mensaje que recibirá el cliente.')
      return
    }

    const recipient = detail.email
    setWorking('reply')
    try {
      const result = await replyToRequest(detail.id, {
        subject: replySubject.trim(),
        message: replyMessage.trim(),
      })
      if (result.delivered) {
        toast.success('Respuesta enviada', `Correo entregado a ${recipient}.`)
      } else {
        toast.error(
          'Respuesta guardada sin envío',
          result.reason === 'SMTP no configurado'
            ? 'Configura SMTP en la API para enviar correos reales. La respuesta quedó registrada.'
            : `${result.reason ?? 'El correo no pudo enviarse.'} La respuesta quedó registrada.`
        )
      }
      setReplyOpen(false)
    } catch (error) {
      toast.error('No se pudo responder', errorMessage(error))
    } finally {
      setWorking(null)
    }
  }

  if (!hydrated) {
    return <LoadingState label="Cargando mesa de ayuda…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Atención al cliente"
        title="Mesa de ayuda"
        description="Consultas del formulario web, correos y registros manuales. Responde con plantilla o conviértelas en cotización."
        actions={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={handleRefresh}
              disabled={working !== null}
            >
              <RefreshCw
                className={cn('size-4', working === 'refresh' && 'animate-spin')}
                aria-hidden="true"
              />
              Actualizar
            </button>
            <ExportMenu
              build={() => requestsDataset(filtered)}
              nouns={['mensaje', 'mensajes']}
              disabled={filtered.length === 0}
            />
            <button type="button" className={btnPrimary} onClick={openRegister}>
              <Plus className="size-4" aria-hidden="true" />
              Registrar consulta
            </button>
          </>
        }
      />

      {helpdeskError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold text-amber-900">Sin conexión con la API de consultas</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
                {helpdeskError} Revisa que la API esté activa en el puerto 4000.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 text-[11px] font-semibold text-amber-900 transition hover:bg-amber-100"
            onClick={handleRefresh}
            disabled={working !== null}
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}

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
          label="Respondidas"
          value={formatNumber(repliedCount)}
          helper="Con correo enviado al cliente"
          icon={MailCheck}
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
              aria-label="Buscar en la mesa de ayuda"
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
              label="Estado"
              value={status}
              onChange={(next) => setStatus(next as 'all' | RequestStatus)}
              ariaLabel="Filtrar por estado"
              align="right"
              className="sm:w-full lg:w-48"
              options={[
                { value: 'all', label: 'Todos', count: requests.length },
                ...statusOrder.map((item) => ({
                  value: item,
                  label: requestStatusLabels[item],
                  count: requests.filter((request) => request.status === item).length,
                })),
              ]}
            />
            <FilterSelect
              label="Canal"
              value={channel}
              onChange={(next) => setChannel(next as 'all' | RequestChannel)}
              ariaLabel="Filtrar por canal"
              align="right"
              className="sm:w-full lg:w-48"
              options={[
                { value: 'all', label: 'Todos', count: requests.length },
                ...(Object.keys(requestChannelLabels) as RequestChannel[]).map((item) => ({
                  value: item,
                  label: requestChannelLabels[item],
                  count: requests.filter((request) => request.channel === item).length,
                })),
              ]}
            />
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
          {filtered.length === 1 ? 'mensaje' : 'mensajes'}
          {hasFilters ? ' con los filtros aplicados' : ' en la bandeja'}
          {!helpdeskSynced && (
            <span className="ml-2 inline-flex items-center gap-1 text-slate-400">
              <RefreshCw className="size-3 animate-spin" aria-hidden="true" />
              Sincronizando…
            </span>
          )}
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={requests.length === 0 ? 'Bandeja vacía' : 'Sin resultados'}
          description={
            requests.length === 0
              ? 'Las consultas enviadas desde el formulario de contacto de la web aparecerán aquí automáticamente.'
              : 'No hay mensajes con esos criterios. Prueba limpiando los filtros.'
          }
          action={
            requests.length === 0 ? (
              <button type="button" className={btnSecondary} onClick={handleRefresh}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Actualizar bandeja
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
                  item.status === 'new' ? 'border-[#DDD6FE]/80' : 'border-slate-200/80'
                )}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
                      item.status === 'new'
                        ? 'bg-[#F5F3FF] text-[#5B21B6] ring-[#DDD6FE]'
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
                      {item.repliedAt && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">
                          <MailCheck className="size-2.5" aria-hidden="true" />
                          Respondida
                        </span>
                      )}
                      {item.quoteId && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F3FF] px-1.5 py-0.5 font-semibold text-[#5B21B6]">
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
                      title="Eliminar consulta"
                      aria-label={`Eliminar consulta ${item.code}`}
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
        title={detail ? `Consulta ${detail.code}` : 'Consulta'}
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
            {detail && (
              <>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => openReply(detail)}
                >
                  <Send className="size-4" aria-hidden="true" />
                  Responder
                </button>
                {linkedQuote ? (
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
                    disabled={working !== null}
                  >
                    <FileText className="size-4" aria-hidden="true" />
                    Convertir en cotización
                  </button>
                )}
              </>
            )}
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
                  className="mt-1 block truncate text-xs font-semibold text-[#5B21B6] hover:text-[#5B21B6]"
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

            {detail.lastReply && (
              <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    Última respuesta
                  </p>
                  <span className="text-[10px] font-medium text-emerald-700">
                    {detail.lastReply.delivered ? 'Enviada' : 'No enviada'} ·{' '}
                    {formatDateTime(detail.lastReply.at)}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-emerald-900">
                  {detail.lastReply.subject}
                </p>
                <p className="mt-1 line-clamp-3 whitespace-pre-line text-[11px] leading-relaxed text-emerald-800">
                  {detail.lastReply.message}
                </p>
              </div>
            )}

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
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F3FF] px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[#5B21B6] transition hover:bg-[#EDE9FE]"
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
                    disabled={working !== null}
                    className={cn(
                      'h-9 rounded-lg border text-[11px] font-semibold transition disabled:opacity-60',
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
                  disabled={notesDraft.trim() === detail.notes || working !== null}
                >
                  Guardar nota
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
        title="Responder por correo"
        description={
          detail
            ? `La respuesta se enviará a ${detail.email} desde la plantilla de F&J Systems.`
            : undefined
        }
        size="lg"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setReplyOpen(false)}>
              Cancelar
            </button>
            <button
              type="submit"
              form="request-reply-form"
              className={btnPrimary}
              disabled={working !== null}
            >
              <Send className="size-4" aria-hidden="true" />
              {working === 'reply' ? 'Enviando…' : 'Enviar respuesta'}
            </button>
          </>
        }
      >
        <form id="request-reply-form" onSubmit={handleSendReply} className="space-y-4">
          <Field label="Asunto" htmlFor="reply-subject" required>
            <input
              id="reply-subject"
              value={replySubject}
              onChange={(event) => setReplySubject(event.target.value)}
              className={inputClass}
              placeholder="Re: consulta"
            />
          </Field>
          <Field
            label="Mensaje"
            htmlFor="reply-message"
            required
            hint="Edita la plantilla y escribe tu respuesta en el espacio en blanco."
          >
            <textarea
              id="reply-message"
              value={replyMessage}
              onChange={(event) => setReplyMessage(event.target.value)}
              className={cn(textareaClass, 'min-h-56 font-normal')}
            />
          </Field>
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
            Si la API no tiene SMTP configurado, la respuesta quedará registrada en la consulta
            pero no se enviará el correo. La consulta pasa a <strong>Atendida</strong> solo cuando
            el envío se completa.
          </p>
        </form>
      </Modal>

      <Modal
        open={registering}
        onClose={() => setRegistering(false)}
        title="Registrar consulta"
        description="Úsalo para consultas recibidas por teléfono, WhatsApp o de forma presencial."
        size="lg"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setRegistering(false)}>
              Cancelar
            </button>
            <button
              type="submit"
              form="request-form"
              className={btnPrimary}
              disabled={working !== null}
            >
              {working === 'register' ? 'Registrando…' : 'Registrar consulta'}
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
              label="Detalle de la consulta"
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
        title="Eliminar consulta"
        description={`Se eliminará la consulta ${deleteTarget?.code ?? ''} de la mesa de ayuda. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar consulta"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
