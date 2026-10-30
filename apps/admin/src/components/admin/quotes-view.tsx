'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Eye,
  FileText,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import {
  ClientAvatar,
  QuoteStatusBadge,
} from '@/components/admin/commercial-ui'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Modal } from '@/components/admin/modal'
import { QuoteDocumentPreview } from '@/components/admin/quote-document-preview'
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
  iconButton,
  inputClass,
  textareaClass,
} from '@/components/admin/ui'
import {
  formatCurrency,
  formatDate,
  formatNumber,
  quoteItemCount,
  quoteStatusLabels,
  quoteTotals,
} from '@/lib/admin/format'
import type { Quote, QuoteLine, QuoteStatus } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const statusOrder: QuoteStatus[] = ['draft', 'sent', 'answered', 'closed']

type QuoteDraft = {
  clientId: string
  clientName: string
  clientCompany: string
  clientEmail: string
  clientPhone: string
  status: QuoteStatus
  validUntil: string
  notes: string
  items: QuoteLine[]
}

type QuoteErrors = {
  clientName?: string
  clientEmail?: string
  items?: string
}

type QuoteEditor = { mode: 'create' } | { mode: 'edit'; id: string }

function defaultValidUntil() {
  return new Date(Date.now() + 15 * 86_400_000).toISOString().slice(0, 10)
}

function lineId() {
  return `linea-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function emptyDraft(): QuoteDraft {
  return {
    clientId: '',
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    status: 'draft',
    validUntil: defaultValidUntil(),
    notes: '',
    items: [],
  }
}

function toDraft(quote: Quote): QuoteDraft {
  return {
    clientId: quote.clientId ?? '',
    clientName: quote.clientName,
    clientCompany: quote.clientCompany,
    clientEmail: quote.clientEmail,
    clientPhone: quote.clientPhone,
    status: quote.status,
    validUntil: quote.validUntil,
    notes: quote.notes,
    items: quote.items.map((item) => ({ ...item })),
  }
}

function sanitizeItems(items: QuoteLine[]): QuoteLine[] {
  return items.map((item) => ({
    ...item,
    quantity: Math.max(1, Math.trunc(Number(item.quantity) || 1)),
    unitPrice: Math.max(0, Number(item.unitPrice) || 0),
  }))
}

function QuoteTotals({
  items,
  igv,
  currency,
}: {
  items: Pick<QuoteLine, 'quantity' | 'unitPrice'>[]
  igv: number
  currency: 'PEN' | 'USD'
}) {
  const totals = quoteTotals(items, igv)
  return (
    <dl className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-[11.5px]">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-slate-500">Subtotal (sin IGV)</dt>
        <dd className="font-semibold tabular-nums text-slate-700">
          {formatCurrency(totals.net, currency)}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-3">
        <dt className="text-slate-500">IGV ({igv}%)</dt>
        <dd className="font-semibold tabular-nums text-slate-700">
          {formatCurrency(totals.tax, currency)}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-1.5">
        <dt className="text-xs font-bold text-slate-900">Total</dt>
        <dd className="font-heading text-base font-bold tabular-nums text-slate-900">
          {formatCurrency(totals.total, currency)}
        </dd>
      </div>
    </dl>
  )
}

export function QuotesView({ initialQuery = '' }: { initialQuery?: string }) {
  const {
    hydrated,
    quotes,
    clients,
    products,
    settings,
    createQuote,
    updateQuote,
    removeQuote,
    setQuoteStatus,
  } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState<'all' | QuoteStatus>('all')
  const [sort, setSort] = useState<'recent' | 'amount' | 'client'>('recent')
  const [viewerId, setViewerId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [editor, setEditor] = useState<QuoteEditor | null>(null)
  const [draft, setDraft] = useState<QuoteDraft>(emptyDraft)
  const [errors, setErrors] = useState<QuoteErrors>({})
  const [deleteTarget, setDeleteTarget] = useState<Quote | null>(null)
  const [pickProductId, setPickProductId] = useState('')
  const [pickQuantity, setPickQuantity] = useState('1')

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    if (!editor) return
    if (editor.mode === 'create') {
      setDraft(emptyDraft())
    } else {
      const quote = quotes.find((item) => item.id === editor.id)
      if (quote) setDraft(toDraft(quote))
    }
    setErrors({})
    setPickProductId('')
    setPickQuantity('1')
    // Solo al abrir o cambiar de cotización.
  }, [editor])

  const viewer = viewerId ? quotes.find((quote) => quote.id === viewerId) ?? null : null
  const preview = previewId ? quotes.find((quote) => quote.id === previewId) ?? null : null
  const viewerClient = viewer?.clientId
    ? clients.find((client) => client.id === viewer.clientId) ?? null
    : null

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = quotes.filter((quote) => {
      const matchesTerm =
        !term ||
        quote.code.toLowerCase().includes(term) ||
        quote.clientName.toLowerCase().includes(term) ||
        quote.clientCompany.toLowerCase().includes(term) ||
        quote.clientEmail.toLowerCase().includes(term) ||
        quote.notes.toLowerCase().includes(term) ||
        quote.items.some((item) => item.name.toLowerCase().includes(term))
      const matchesStatus = status === 'all' || quote.status === status
      return matchesTerm && matchesStatus
    })

    return [...list].sort((a, b) => {
      if (sort === 'amount') {
        return (
          quoteTotals(b.items, settings.igv).total - quoteTotals(a.items, settings.igv).total
        )
      }
      if (sort === 'client') {
        return (a.clientCompany || a.clientName).localeCompare(
          b.clientCompany || b.clientName,
          'es'
        )
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [quotes, query, status, sort, settings.igv])

  const draftCount = quotes.filter((quote) => quote.status === 'draft').length
  const sentCount = quotes.filter((quote) => quote.status === 'sent').length
  const answeredCount = quotes.filter((quote) => quote.status === 'answered').length
  const totalAmount = quotes.reduce(
    (sum, quote) => sum + quoteTotals(quote.items, settings.igv).total,
    0
  )
  const hasFilters = query !== '' || status !== 'all'

  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        if (a.status === 'archived' && b.status !== 'archived') return 1
        if (b.status === 'archived' && a.status !== 'archived') return -1
        return a.name.localeCompare(b.name, 'es')
      }),
    [products]
  )

  function updateDraft<K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setQuery('')
    setStatus('all')
  }

  function handleClientChange(clientId: string) {
    if (!clientId) {
      setDraft((prev) => ({
        ...prev,
        clientId: '',
        clientName: '',
        clientCompany: '',
        clientEmail: '',
        clientPhone: '',
      }))
      return
    }
    const client = clients.find((item) => item.id === clientId)
    if (!client) return
    setDraft((prev) => ({
      ...prev,
      clientId,
      clientName: client.name,
      clientCompany: client.company,
      clientEmail: client.email,
      clientPhone: client.phone,
    }))
  }

  function addProduct() {
    if (!pickProductId) return
    const product = products.find((item) => item.id === pickProductId)
    if (!product) return
    const quantity = Math.max(1, Math.trunc(Number(pickQuantity) || 1))
    setDraft((prev) => {
      const existing = prev.items.find((item) => item.productId === product.id)
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        }
      }
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            id: lineId(),
            productId: product.id,
            name: product.name,
            sku: product.sku,
            quantity,
            unitPrice: product.price,
          },
        ],
      }
    })
    setPickProductId('')
    setPickQuantity('1')
    if (errors.items) setErrors((prev) => ({ ...prev, items: undefined }))
  }

  function updateLine(id: string, patch: Partial<QuoteLine>) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  function removeLine(id: string) {
    setDraft((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: QuoteErrors = {}
    if (draft.clientName.trim().length < 2) {
      nextErrors.clientName = 'Indica el nombre del contacto.'
    }
    if (!EMAIL_PATTERN.test(draft.clientEmail.trim())) {
      nextErrors.clientEmail = 'Escribe un correo válido.'
    }
    if (draft.status !== 'draft' && draft.items.length === 0) {
      nextErrors.items = 'Agrega al menos un producto antes de marcar la cotización como enviada.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Revisa la cotización', 'Faltan datos obligatorios o productos.')
      return
    }

    const input = {
      clientId: draft.clientId || undefined,
      clientName: draft.clientName.trim(),
      clientCompany: draft.clientCompany.trim(),
      clientEmail: draft.clientEmail.trim(),
      clientPhone: draft.clientPhone.trim(),
      status: draft.status,
      items: sanitizeItems(draft.items),
      notes: draft.notes.trim(),
      validUntil: draft.validUntil,
    }

    if (editor?.mode === 'edit') {
      updateQuote(editor.id, input)
      toast.success('Cotización actualizada', draft.clientCompany || draft.clientName)
      setEditor(null)
      return
    }

    const quote = createQuote(input)
    toast.success('Cotización creada', `${quote.code} · ${quote.clientCompany || quote.clientName}`)
    setEditor(null)
  }

  function handleStatus(quote: Quote, next: QuoteStatus) {
    if (quote.status === next) return
    setQuoteStatus(quote.id, next)
    toast.info(`Cotización ${quoteStatusLabels[next].toLowerCase()}`, quote.code)
  }

  function handleDelete() {
    if (!deleteTarget) return
    removeQuote(deleteTarget.id)
    toast.success('Cotización eliminada', deleteTarget.code)
    if (viewerId === deleteTarget.id) setViewerId(null)
    setDeleteTarget(null)
  }

  if (!hydrated) {
    return <LoadingState label="Cargando cotizaciones…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Comercial"
        title="Cotizaciones"
        description="Propuestas preparadas para clientes. Las cotizaciones no generan cobros ni facturas."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setEditor({ mode: 'create' })}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nueva cotización
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Cotizaciones"
          value={formatNumber(quotes.length)}
          helper={
            answeredCount === 1 ? '1 respondida' : `${answeredCount} respondidas`
          }
          icon={FileText}
        />
        <StatCard
          label="Borradores"
          value={formatNumber(draftCount)}
          helper="Pendientes de completar"
          icon={Pencil}
        />
        <StatCard
          label="Enviadas"
          value={formatNumber(sentCount)}
          helper="Esperando respuesta del cliente"
          icon={Eye}
        />
        <StatCard
          label="Monto cotizado"
          value={formatCurrency(totalAmount, settings.currency)}
          helper="Total histórico, IGV incluido"
          icon={FileText}
        />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-0 lg:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por código, cliente, correo o producto…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar cotizaciones"
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
              onChange={(event) => setStatus(event.target.value as 'all' | QuoteStatus)}
              aria-label="Filtrar por estado"
              className="sm:w-full lg:w-40"
            >
              <option value="all">Todos los estados</option>
              {statusOrder.map((item) => (
                <option key={item} value={item}>
                  {quoteStatusLabels[item]}
                </option>
              ))}
            </Select>
            <Select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as 'recent' | 'amount' | 'client')
              }
              aria-label="Ordenar cotizaciones"
              className="sm:w-full lg:w-48"
            >
              <option value="recent">Actualizadas recientemente</option>
              <option value="amount">Mayor monto</option>
              <option value="client">Cliente A–Z</option>
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
          {filtered.length === 1 ? 'cotización' : 'cotizaciones'}
          {hasFilters ? ' con los filtros aplicados' : ' registradas'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={quotes.length === 0 ? 'Aún no hay cotizaciones' : 'Sin resultados'}
          description={
            quotes.length === 0
              ? 'Crea la primera propuesta y agrégale productos del catálogo.'
              : 'No encontramos cotizaciones con esos criterios. Prueba limpiando los filtros.'
          }
          action={
            quotes.length === 0 ? (
              <button
                type="button"
                className={btnPrimary}
                onClick={() => setEditor({ mode: 'create' })}
              >
                <Plus className="size-4" aria-hidden="true" />
                Nueva cotización
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
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs lg:block">
            <div className="overflow-x-auto scrollbar-light">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <th scope="col" className="min-w-[150px] px-5 py-3">Código</th>
                    <th scope="col" className="min-w-[220px] px-3 py-3">Cliente</th>
                    <th scope="col" className="px-3 py-3">Productos</th>
                    <th scope="col" className="px-3 py-3 text-right">Total</th>
                    <th scope="col" className="px-3 py-3">Estado</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3">Válida hasta</th>
                    <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((quote) => {
                    const totals = quoteTotals(quote.items, settings.igv)
                    return (
                      <tr key={quote.id} className="group transition-colors hover:bg-slate-50/70">
                        <td className="px-5 py-3">
                          <p className="font-mono text-[11px] font-semibold text-slate-800">
                            {quote.code}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {formatDate(quote.createdAt)}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <ClientAvatar
                              name={quote.clientName}
                              company={quote.clientCompany}
                              className="size-9"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-[12px] font-semibold text-slate-900">
                                {quote.clientCompany || quote.clientName}
                              </p>
                              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                {quote.clientCompany ? quote.clientName : quote.clientEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-[11.5px] font-semibold text-slate-700">
                            {quote.items.length}{' '}
                            {quote.items.length === 1 ? 'línea' : 'líneas'}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {formatNumber(quoteItemCount(quote.items))} unidades
                          </p>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <p className="whitespace-nowrap text-[12.5px] font-bold tabular-nums text-slate-900">
                            {formatCurrency(totals.total, settings.currency)}
                          </p>
                          <p className="mt-0.5 text-[9.5px] text-slate-400">IGV incluido</p>
                        </td>
                        <td className="px-3 py-3">
                          <QuoteStatusBadge status={quote.status} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-[11px] text-slate-500">
                          {quote.validUntil ? formatDate(quote.validUntil) : 'Sin fecha'}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              type="button"
                              onClick={() => setViewerId(quote.id)}
                              className={iconButton}
                              title="Ver cotización"
                              aria-label={`Ver cotización ${quote.code}`}
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewId(quote.id)}
                              className={iconButton}
                              title="Vista previa del documento"
                              aria-label={`Vista previa del documento de ${quote.code}`}
                            >
                              <FileText className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditor({ mode: 'edit', id: quote.id })}
                              className={iconButton}
                              title="Editar cotización"
                              aria-label={`Editar cotización ${quote.code}`}
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(quote)}
                              className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600')}
                              title="Eliminar cotización"
                              aria-label={`Eliminar cotización ${quote.code}`}
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

          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {filtered.map((quote) => {
              const totals = quoteTotals(quote.items, settings.igv)
              return (
                <article
                  key={quote.id}
                  className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-[10.5px] font-semibold text-slate-500">
                        {quote.code}
                      </p>
                      <p className="mt-1 truncate text-[13px] font-bold text-slate-900">
                        {quote.clientCompany || quote.clientName}
                      </p>
                      <p className="mt-0.5 truncate text-[10.5px] text-slate-400">
                        {quote.clientCompany ? quote.clientName : quote.clientEmail}
                      </p>
                    </div>
                    <QuoteStatusBadge status={quote.status} />
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                    <div>
                      <p className="text-[9.5px] font-bold uppercase tracking-wide text-slate-400">
                        Total
                      </p>
                      <p className="mt-0.5 text-sm font-bold tabular-nums text-slate-900">
                        {formatCurrency(totals.total, settings.currency)}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {quote.items.length} {quote.items.length === 1 ? 'línea' : 'líneas'} ·{' '}
                      {formatNumber(quoteItemCount(quote.items))} uds.
                    </p>
                  </div>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Válida hasta {quote.validUntil ? formatDate(quote.validUntil) : '—'}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setViewerId(quote.id)}
                      className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Eye className="size-3.5" aria-hidden="true" />
                      Ver
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewId(quote.id)}
                      className={cn(iconButton, 'border border-slate-200 bg-white')}
                      title="Vista previa del documento"
                      aria-label={`Vista previa del documento de ${quote.code}`}
                    >
                      <FileText className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditor({ mode: 'edit', id: quote.id })}
                      className={cn(iconButton, 'border border-slate-200 bg-white')}
                      aria-label={`Editar cotización ${quote.code}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(quote)}
                      className={cn(
                        iconButton,
                        'border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600'
                      )}
                      aria-label={`Eliminar cotización ${quote.code}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}

      <Modal
        open={Boolean(viewer)}
        onClose={() => setViewerId(null)}
        title={viewer ? `Cotización ${viewer.code}` : 'Cotización'}
        description={
          viewer
            ? `${viewer.clientCompany || viewer.clientName} · ${formatDate(viewer.createdAt)}`
            : undefined
        }
        size="lg"
        footer={
          <>
            {viewer && (
              <button
                type="button"
                onClick={() => {
                  setViewerId(null)
                  setDeleteTarget(viewer)
                }}
                className="mr-auto inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Eliminar
              </button>
            )}
            {viewer && (
              <button
                type="button"
                className={btnSecondary}
                onClick={() => {
                  setPreviewId(viewer.id)
                  setViewerId(null)
                }}
              >
                <FileText className="size-4" aria-hidden="true" />
                Vista previa
              </button>
            )}
            <button type="button" className={btnSecondary} onClick={() => setViewerId(null)}>
              Cerrar
            </button>
            {viewer && (
              <button
                type="button"
                className={btnPrimary}
                onClick={() => {
                  setEditor({ mode: 'edit', id: viewer.id })
                  setViewerId(null)
                }}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Editar cotización
              </button>
            )}
          </>
        }
      >
        {viewer && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <QuoteStatusBadge status={viewer.status} />
              <p className="text-[10.5px] text-slate-500">
                Válida hasta{' '}
                <span className="font-semibold text-slate-700">
                  {viewer.validUntil ? formatDate(viewer.validUntil) : 'sin fecha'}
                </span>
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Cliente
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-900">
                  {viewer.clientCompany || viewer.clientName}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {viewer.clientCompany ? viewer.clientName : 'Persona natural'}
                  {viewerClient ? ' · Cliente registrado' : ' · Sin registrar'}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Contacto
                </p>
                <p className="mt-1 truncate text-xs font-semibold text-blue-600">
                  {viewer.clientEmail}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {viewer.clientPhone || 'Sin teléfono'}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-[11.5px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[9.5px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    <th scope="col" className="px-3 py-2">Producto</th>
                    <th scope="col" className="w-16 px-3 py-2 text-right">Cant.</th>
                    <th scope="col" className="w-24 px-3 py-2 text-right">P. unit.</th>
                    <th scope="col" className="w-28 px-3 py-2 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewer.items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-[11px] text-slate-400">
                        Sin productos agregados todavía.
                      </td>
                    </tr>
                  ) : (
                    viewer.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2.5">
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          {item.sku && (
                            <p className="mt-0.5 font-mono text-[9.5px] text-slate-400">{item.sku}</p>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-slate-700">
                          {formatCurrency(item.unitPrice, settings.currency)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold tabular-nums text-slate-900">
                          {formatCurrency(item.quantity * item.unitPrice, settings.currency)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <QuoteTotals items={viewer.items} igv={settings.igv} currency={settings.currency} />

            {viewer.notes && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Observaciones
                </p>
                <p className="mt-1.5 whitespace-pre-line rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-[11px] leading-relaxed text-slate-600">
                  {viewer.notes}
                </p>
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Cambiar estado
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {statusOrder.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleStatus(viewer, item)}
                    aria-pressed={viewer.status === item}
                    className={cn(
                      'h-9 rounded-lg border text-[11px] font-semibold transition',
                      viewer.status === item
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    {quoteStatusLabels[item]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {preview && (
        <QuoteDocumentPreview
          open
          quote={preview}
          settings={settings}
          clients={clients}
          products={products}
          onClose={() => setPreviewId(null)}
        />
      )}

      <Modal
        open={editor !== null}
        onClose={() => setEditor(null)}
        title={editor?.mode === 'edit' ? 'Editar cotización' : 'Nueva cotización'}
        description="El total se calcula con los precios del catálogo. Los precios incluyen IGV."
        size="xl"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setEditor(null)}>
              Cancelar
            </button>
            <button type="submit" form="quote-form" className={btnPrimary}>
              {editor?.mode === 'edit' ? 'Guardar cambios' : 'Crear cotización'}
            </button>
          </>
        }
      >
        <form id="quote-form" onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Cliente registrado"
              htmlFor="quote-client"
              hint="Al elegirlo se completan los datos de contacto."
              className="sm:col-span-2"
            >
              <Select
                id="quote-client"
                value={draft.clientId}
                onChange={(event) => handleClientChange(event.target.value)}
              >
                <option value="">Cliente manual</option>
                {[...clients]
                  .sort((a, b) =>
                    (a.company || a.name).localeCompare(b.company || b.name, 'es')
                  )
                  .map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company || client.name}
                      {client.company ? ` · ${client.name}` : ''}
                    </option>
                  ))}
              </Select>
            </Field>
            <Field label="Contacto" htmlFor="quote-client-name" required error={errors.clientName}>
              <input
                id="quote-client-name"
                value={draft.clientName}
                onChange={(event) => updateDraft('clientName', event.target.value)}
                className={inputClass}
                placeholder="Nombre del contacto"
                aria-invalid={Boolean(errors.clientName)}
              />
            </Field>
            <Field label="Empresa" htmlFor="quote-client-company">
              <input
                id="quote-client-company"
                value={draft.clientCompany}
                onChange={(event) => updateDraft('clientCompany', event.target.value)}
                className={inputClass}
                placeholder="Empresa o razón social"
              />
            </Field>
            <Field label="Correo" htmlFor="quote-client-email" required error={errors.clientEmail}>
              <input
                id="quote-client-email"
                type="email"
                value={draft.clientEmail}
                onChange={(event) => updateDraft('clientEmail', event.target.value)}
                className={inputClass}
                placeholder="contacto@empresa.pe"
                aria-invalid={Boolean(errors.clientEmail)}
              />
            </Field>
            <Field label="Teléfono" htmlFor="quote-client-phone">
              <input
                id="quote-client-phone"
                value={draft.clientPhone}
                onChange={(event) => updateDraft('clientPhone', event.target.value)}
                className={inputClass}
                placeholder="+51 987 654 321"
                inputMode="tel"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Estado" htmlFor="quote-status">
              <Select
                id="quote-status"
                value={draft.status}
                onChange={(event) => updateDraft('status', event.target.value as QuoteStatus)}
              >
                {statusOrder.map((item) => (
                  <option key={item} value={item}>
                    {quoteStatusLabels[item]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Válida hasta" htmlFor="quote-valid-until">
              <input
                id="quote-valid-until"
                type="date"
                value={draft.validUntil}
                onChange={(event) => updateDraft('validUntil', event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label="Observaciones"
              htmlFor="quote-notes"
              hint="Condiciones de entrega, tiempos o notas para el cliente."
              className="sm:col-span-2"
            >
              <textarea
                id="quote-notes"
                value={draft.notes}
                onChange={(event) => updateDraft('notes', event.target.value)}
                className={cn(textareaClass, 'min-h-20')}
                placeholder="Entrega en sede, instalación, garantía…"
              />
            </Field>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-end gap-2">
              <div className="min-w-0 flex-1">
                <Field label="Agregar producto" htmlFor="quote-product">
                  <Select
                    id="quote-product"
                    value={pickProductId}
                    onChange={(event) => setPickProductId(event.target.value)}
                  >
                    <option value="">Selecciona un producto del catálogo</option>
                    {sortedProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} · {product.sku} ·{' '}
                        {formatCurrency(product.price, settings.currency)}
                        {product.status === 'archived' ? ' · Archivado' : ''}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <div className="w-20 shrink-0">
                <Field label="Cant." htmlFor="quote-quantity">
                  <input
                    id="quote-quantity"
                    type="number"
                    min={1}
                    value={pickQuantity}
                    onChange={(event) => setPickQuantity(event.target.value)}
                    className={cn(inputClass, 'tabular-nums')}
                  />
                </Field>
              </div>
              <button
                type="button"
                className={cn(btnSecondary, 'mb-0.5')}
                onClick={addProduct}
                disabled={!pickProductId}
              >
                <Plus className="size-4" aria-hidden="true" />
                Agregar
              </button>
            </div>

            {errors.items && (
              <p className="mt-2 text-[11px] font-medium text-red-600">{errors.items}</p>
            )}

            <div className="mt-4 space-y-2">
              {draft.items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center">
                  <p className="text-[11px] font-semibold text-slate-600">Sin productos</p>
                  <p className="mt-1 text-[10.5px] text-slate-400">
                    Elige un producto del catálogo para agregar la primera línea.
                  </p>
                </div>
              ) : (
                draft.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_80px_120px_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[9.5px] text-slate-400">
                        {item.sku ?? 'Sin SKU'}
                      </p>
                    </div>
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="sm:hidden">Cant.</span>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          updateLine(item.id, {
                            quantity: Math.max(1, Math.trunc(Number(event.target.value) || 1)),
                          })
                        }
                        aria-label={`Cantidad de ${item.name}`}
                        className={cn(inputClass, 'h-8 w-full px-2 text-xs tabular-nums')}
                      />
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="shrink-0 sm:hidden">P. unit.</span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(event) =>
                          updateLine(item.id, {
                            unitPrice: Math.max(0, Number(event.target.value) || 0),
                          })
                        }
                        aria-label={`Precio unitario de ${item.name}`}
                        className={cn(inputClass, 'h-8 w-full px-2 text-xs tabular-nums')}
                      />
                    </label>
                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <p className="text-[11px] font-bold tabular-nums text-slate-900 sm:hidden">
                        {formatCurrency(item.quantity * item.unitPrice, settings.currency)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeLine(item.id)}
                        className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600')}
                        aria-label={`Quitar ${item.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3">
              <QuoteTotals items={draft.items} igv={settings.igv} currency={settings.currency} />
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar cotización"
        description={`Se eliminará la cotización ${deleteTarget?.code ?? ''} del panel local. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar cotización"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
