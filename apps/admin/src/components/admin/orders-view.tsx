'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Ban,
  CheckCircle2,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Timer,
  Trash2,
  Truck,
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
  btnDanger,
  iconButton,
  inputClass,
  tableClass,
  tableHeadRowClass,
  textareaClass,
} from '@/components/admin/ui'
import { DatePicker } from '@/components/admin/date-picker'
import { ordersDataset } from '@/lib/admin/excel-exports'
import { formatCurrency, formatDate, formatDateTime, quoteTotals } from '@/lib/admin/format'
import { isEmail } from '@fj-solutions/contracts/domain'
import {
  deliveryFlow,
  deliveryMethodLabels,
  isDeliveryLate,
  nextOrderStatus,
  orderStatusClasses,
  orderStatusLabels,
  orderUnits,
  paymentStatusLabels,
} from '@/lib/admin/operations'
import type {
  Currency,
  DeliveryMethod,
  Order,
  OrderInput,
  OrderLine,
  OrderStatus,
  PaymentStatus,
} from '@/lib/admin/types'
import { cn } from '@/lib/utils'

type OrderDraft = {
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  quoteCode: string
  currency: Currency
  paymentStatus: PaymentStatus
  deliveryMethod: DeliveryMethod
  deliveryAddress: string
  recipientName: string
  carrier: string
  trackingNumber: string
  expectedDeliveryAt: string
  notes: string
  items: OrderLine[]
}

type OrderErrors = Partial<
  Record<
    keyof Pick<OrderDraft, 'clientName' | 'clientEmail' | 'deliveryAddress' | 'items'>,
    string
  >
>

function toDraft(order: Order): OrderDraft {
  return {
    clientId: order.clientId ?? '',
    clientName: order.clientName,
    clientEmail: order.clientEmail,
    clientPhone: order.clientPhone,
    quoteCode: order.quoteCode ?? '',
    currency: order.currency,
    paymentStatus: order.paymentStatus,
    deliveryMethod: order.deliveryMethod,
    deliveryAddress: order.deliveryAddress,
    recipientName: order.recipientName,
    carrier: order.carrier,
    trackingNumber: order.trackingNumber,
    expectedDeliveryAt: order.expectedDeliveryAt ?? '',
    notes: order.notes,
    items: order.items.map((item) => ({ ...item })),
  }
}

function toInput(source: Order | OrderDraft): OrderInput {
  return {
    clientId: source.clientId || undefined,
    clientName: source.clientName.trim(),
    clientEmail: source.clientEmail.trim(),
    clientPhone: source.clientPhone.trim(),
    quoteCode: source.quoteCode?.trim() || undefined,
    paymentStatus: source.paymentStatus,
    currency: source.currency,
    items: source.items.map((item) => ({ ...item })),
    deliveryMethod: source.deliveryMethod,
    deliveryAddress: source.deliveryAddress.trim(),
    recipientName: source.recipientName.trim(),
    carrier: source.carrier.trim(),
    trackingNumber: source.trackingNumber.trim(),
    expectedDeliveryAt: source.expectedDeliveryAt || undefined,
    notes: source.notes.trim(),
  }
}

function validate(draft: OrderDraft): OrderErrors {
  const errors: OrderErrors = {}
  if (draft.clientName.trim().length < 2) {
    errors.clientName = 'Indica quién recibe el pedido.'
  }
  if (draft.clientEmail.trim() && !isEmail(draft.clientEmail)) {
    errors.clientEmail = 'Escribe un correo válido.'
  }
  if (draft.deliveryMethod !== 'pickup' && draft.deliveryAddress.trim().length < 6) {
    errors.deliveryAddress = 'La dirección de entrega es obligatoria.'
  }
  if (draft.items.length === 0) {
    errors.items = 'Agrega al menos un producto al pedido.'
  } else if (draft.items.some((item) => item.quantity <= 0)) {
    errors.items = 'Las líneas deben tener cantidad mayor a cero.'
  }
  return errors
}

function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
        orderStatusClasses[status]
      )}
    >
      {orderStatusLabels[status]}
    </span>
  )
}

function UnitsBar({ order }: { order: Order }) {
  const { ordered, delivered } = orderUnits(order)
  const percent = ordered > 0 ? Math.round((delivered / ordered) * 100) : 0
  return (
    <div className="w-40">
      <div className="flex items-baseline justify-between gap-2 text-[11px] text-slate-500">
        <span className="font-semibold tabular-nums text-slate-700">
          {delivered}/{ordered}
        </span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            percent === 100 ? 'bg-emerald-500' : percent > 0 ? 'bg-[#7C3AED]' : 'bg-slate-200'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function DeliveryStepper({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">
        <Ban className="size-4" aria-hidden="true" />
        Pedido anulado
      </p>
    )
  }
  const currentIndex = deliveryFlow.indexOf(order.status)
  return (
    <ol className="flex flex-wrap items-center gap-1.5">
      {deliveryFlow.map((status, index) => {
        const reached = index <= currentIndex
        return (
          <li key={status} className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
                reached
                  ? 'bg-[#F5F3FF] text-[#5B21B6] ring-[#DDD6FE]'
                  : 'bg-white text-slate-400 ring-slate-200'
              )}
            >
              {index < currentIndex && <CheckCircle2 className="size-3.5" aria-hidden="true" />}
              {orderStatusLabels[status]}
            </span>
            {index < deliveryFlow.length - 1 ? (
              <ArrowRight className="size-3.5 text-slate-300" aria-hidden="true" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

export function OrdersView() {
  const {
    hydrated,
    clients,
    products,
    orders,
    settings,
    createOrder,
    updateOrder,
    removeOrder,
    setOrderStatus,
    setOrderPayment,
  } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | OrderStatus>('all')
  const [method, setMethod] = useState<'all' | DeliveryMethod>('all')
  const [editing, setEditing] = useState<Order | 'new' | null>(null)
  const [detail, setDetail] = useState<Order | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null)
  const [draft, setDraft] = useState<OrderDraft>(() => toDraft(emptyOrder(settings.currency)))
  const [errors, setErrors] = useState<OrderErrors>({})
  const [pickProduct, setPickProduct] = useState('')

  useEffect(() => {
    if (editing === 'new') {
      setDraft(toDraft(emptyOrder(settings.currency)))
      setErrors({})
      setPickProduct('')
      return
    }
    if (editing) {
      setDraft(toDraft(editing))
      setErrors({})
    }
  }, [editing, settings.currency])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return orders
      .filter((order) => {
        const matchesTerm =
          !term ||
          order.code.toLowerCase().includes(term) ||
          order.clientName.toLowerCase().includes(term) ||
          order.clientEmail.toLowerCase().includes(term) ||
          order.trackingNumber.toLowerCase().includes(term) ||
          order.deliveryAddress.toLowerCase().includes(term) ||
          order.items.some(
            (item) =>
              item.name.toLowerCase().includes(term) ||
              (item.sku ?? '').toLowerCase().includes(term)
          )
        const matchesStatus = status === 'all' || order.status === status
        const matchesMethod = method === 'all' || order.deliveryMethod === method
        return matchesTerm && matchesStatus && matchesMethod
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [orders, query, status, method])

  const counts = useMemo(() => {
    const byStatus = deliveryFlow.reduce(
      (acc, key) => ({ ...acc, [key]: orders.filter((order) => order.status === key).length }),
      {} as Record<OrderStatus, number>
    )
    byStatus.cancelled = orders.filter((order) => order.status === 'cancelled').length
    return {
      ...byStatus,
      open: orders.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled')
        .length,
      late: orders.filter((order) => isDeliveryLate(order)).length,
    }
  }, [orders])

  const detailOrder = detail ? orders.find((order) => order.id === detail.id) ?? null : null

  function update<K extends keyof OrderDraft>(key: K, value: OrderDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleClientChange(clientId: string) {
    const client = clients.find((item) => item.id === clientId)
    setDraft((prev) => ({
      ...prev,
      clientId,
      clientName: client ? client.name : prev.clientName,
      clientEmail: client ? client.email : prev.clientEmail,
      clientPhone: client ? client.phone : prev.clientPhone,
      deliveryAddress:
        client && !prev.deliveryAddress ? client.address : prev.deliveryAddress,
      recipientName: client && !prev.recipientName ? client.name : prev.recipientName,
    }))
  }

  function addPickedProduct() {
    const product = products.find((item) => item.id === pickProduct)
    if (!product) {
      toast.info('Selecciona un producto', 'Elige un artículo del catálogo para agregarlo.')
      return
    }
    setDraft((prev) => {
      const existing = prev.items.find((item) => item.productId === product.id)
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }
      }
      const line: OrderLine = {
        id: `linea-${Math.random().toString(36).slice(2, 8)}`,
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        unitPrice: product.price,
        deliveredQuantity: 0,
      }
      return { ...prev, items: [...prev.items, line] }
    })
    setPickProduct('')
    setErrors((prev) => ({ ...prev, items: undefined }))
  }

  function updateLine(id: string, patch: Partial<OrderLine>) {
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
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      toast.error('Revisa el pedido', 'Hay datos de entrega o líneas sin completar.')
      return
    }
    const input = toInput(draft)
    if (editing === 'new') {
      const order = createOrder(input)
      toast.success('Pedido registrado', `${order.code} · ${order.clientName}`)
    } else if (editing) {
      updateOrder(editing.id, input)
      toast.success('Pedido actualizado', editing.code)
    }
    setEditing(null)
  }

  function advance(order: Order) {
    const next = nextOrderStatus(order.status)
    if (!next) return
    setOrderStatus(order.id, { status: next })
    toast.success(
      `Pedido ${orderStatusLabels[next].toLowerCase()}`,
      `${order.code} · ${order.clientName}`
    )
  }

  function deliver(order: Order) {
    setOrderStatus(order.id, {
      status: 'delivered',
      note: 'Mercancía entregada y recibida por el cliente.',
    })
    toast.success('Entrega confirmada', `${order.code} · todas las líneas dadas por recibidas`)
  }

  function cancel(order: Order) {
    setOrderStatus(order.id, { status: 'cancelled', note: 'Pedido anulado desde el panel.' })
    toast.info('Pedido anulado', order.code)
  }

  function saveDeliveredUnits(line: OrderLine, quantity: number) {
    if (!detailOrder) return
    const value = Math.max(0, Math.min(quantity, line.quantity))
    updateOrder(detailOrder.id, {
      ...toInput(detailOrder),
      items: detailOrder.items.map((item) =>
        item.id === line.id ? { ...item, deliveredQuantity: value } : item
      ),
    })
  }

  if (!hydrated) {
    return <LoadingState label="Cargando pedidos…" />
  }

  const hasFilters = query !== '' || status !== 'all' || method !== 'all'

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Operaciones"
        title="Pedidos y entregas"
        description="Seguimiento de la mercancía: desde la confirmación hasta que el cliente la recibe."
        actions={
          <>
            <ExportMenu
              build={() => ordersDataset(filtered, settings.currency, settings.igv)}
              nouns={['pedido', 'pedidos']}
              disabled={filtered.length === 0}
            />
            <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
              <Plus className="size-4" aria-hidden="true" />
              Nuevo pedido
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="En curso"
          value={String(counts.open)}
          helper="Pedidos sin entregar ni anular"
          icon={Truck}
        />
        <StatCard
          label="En camino"
          value={String(counts.shipped)}
          helper="Despachados y por recibir"
          icon={ArrowRight}
        />
        <StatCard
          label="Entregados"
          value={String(counts.delivered)}
          helper={
            orders.length > 0
              ? `${Math.round((counts.delivered / orders.length) * 100)}% del total registrado`
              : 'Aún sin entregas'
          }
          icon={CheckCircle2}
        />
        <StatCard
          label="Atrasados"
          value={String(counts.late)}
          helper={
            counts.late === 1
              ? '1 entrega con fecha esperada vencida'
              : `${counts.late} entregas con fecha esperada vencida`
          }
          icon={Timer}
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
              placeholder="Buscar por código, cliente, dirección, guía o producto…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar pedidos"
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
              onChange={(next) => setStatus(next as 'all' | OrderStatus)}
              ariaLabel="Filtrar por estado de entrega"
              align="right"
              className="sm:w-full lg:w-52"
              options={[
                { value: 'all', label: 'Todos', count: orders.length },
                ...[...deliveryFlow, 'cancelled' as OrderStatus].map((key) => ({
                  value: key,
                  label: orderStatusLabels[key],
                  count: counts[key],
                })),
              ]}
            />
            <FilterSelect
              label="Entrega"
              value={method}
              onChange={(next) => setMethod(next as 'all' | DeliveryMethod)}
              ariaLabel="Filtrar por método de entrega"
              align="right"
              className="sm:w-full lg:w-48"
              options={[
                { value: 'all', label: 'Todas', count: orders.length },
                {
                  value: 'own',
                  label: deliveryMethodLabels.own,
                  count: orders.filter((order) => order.deliveryMethod === 'own').length,
                },
                {
                  value: 'courier',
                  label: deliveryMethodLabels.courier,
                  count: orders.filter((order) => order.deliveryMethod === 'courier').length,
                },
                {
                  value: 'pickup',
                  label: deliveryMethodLabels.pickup,
                  count: orders.filter((order) => order.deliveryMethod === 'pickup').length,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Package}
              title={orders.length === 0 ? 'Sin pedidos registrados' : 'Sin resultados'}
              description={
                orders.length === 0
                  ? 'Convierte una cotización aprobada en pedido para iniciar el seguimiento de la entrega.'
                  : 'Ningún pedido coincide con los filtros aplicados.'
              }
              action={
                hasFilters ? (
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() => {
                      setQuery('')
                      setStatus('all')
                      setMethod('all')
                    }}
                  >
                    Limpiar filtros
                  </button>
                ) : (
                  <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
                    <Plus className="size-4" aria-hidden="true" />
                    Nuevo pedido
                  </button>
                )
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadRowClass}>
                <tr>
                  <th className="px-5 py-3">Pedido</th>
                  <th className="px-4 py-3">Estado de entrega</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Fecha esperada</th>
                  <th className="px-4 py-3">Mercancía</th>
                  <th className="px-4 py-3">Pago</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((order) => {
                  const totals = quoteTotals(order.items, settings.igv)
                  const late = isDeliveryLate(order)
                  const next = nextOrderStatus(order.status)
                  return (
                    <tr key={order.id} className="align-top transition hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => setDetail(order)}
                          className="font-semibold text-slate-900 transition hover:text-[#5B21B6]"
                        >
                          {order.code}
                        </button>
                        <p className="mt-0.5 text-[11px] text-slate-500">{order.clientName}</p>
                        {order.quoteCode ? (
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Desde {order.quoteCode}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusChip status={order.status} />
                        {late ? (
                          <p className="mt-1 text-[10.5px] font-semibold text-rose-600">
                            Entrega atrasada
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {deliveryMethodLabels[order.deliveryMethod]}
                        {order.carrier ? (
                          <p className="mt-0.5 text-[10.5px] text-slate-400">{order.carrier}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {order.deliveredAt
                          ? formatDateTime(order.deliveredAt)
                          : order.expectedDeliveryAt
                            ? formatDate(order.expectedDeliveryAt)
                            : 'Por coordinar'}
                      </td>
                      <td className="px-4 py-3.5">
                        <UnitsBar order={order} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[11.5px] font-medium text-slate-600">
                          {paymentStatusLabels[order.paymentStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-slate-900">
                        {formatCurrency(totals.total, order.currency)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <RowActions
                          label={`Acciones para ${order.code}`}
                          title={order.code}
                          items={[
                            ...(next
                              ? [
                                  {
                                    key: 'advance',
                                    label: `Avanzar a ${orderStatusLabels[next]}`,
                                    icon: ArrowRight,
                                    onSelect: () => advance(order),
                                  },
                                ]
                              : []),
                            ...(order.status === 'shipped'
                              ? [
                                  {
                                    key: 'deliver',
                                    label: 'Confirmar entrega',
                                    icon: CheckCircle2,
                                    onSelect: () => deliver(order),
                                  },
                                ]
                              : []),
                            {
                              key: 'edit',
                              label: 'Editar pedido',
                              icon: Pencil,
                              onSelect: () => setEditing(order),
                            },
                            {
                              key: 'delete',
                              label: 'Eliminar pedido',
                              icon: Trash2,
                              tone: 'danger' as const,
                              onSelect: () => setDeleteTarget(order),
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
      </section>

      <Modal
        open={detailOrder !== null}
        onClose={() => setDetail(null)}
        title={detailOrder ? `Entrega de ${detailOrder.code}` : 'Entrega'}
        description={
          detailOrder
            ? `${detailOrder.clientName} · ${deliveryMethodLabels[detailOrder.deliveryMethod]}`
            : undefined
        }
        size="xl"
        footer={
          detailOrder ? (
            <>
              <label className="mr-auto flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                Pago
                <Select
                  value={detailOrder.paymentStatus}
                  aria-label="Estado de pago"
                  className="w-36"
                  onChange={(event) => {
                    setOrderPayment(
                      detailOrder.id,
                      event.target.value as PaymentStatus
                    )
                    toast.success('Pago actualizado', detailOrder.code)
                  }}
                >
                  {(Object.keys(paymentStatusLabels) as PaymentStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {paymentStatusLabels[key]}
                    </option>
                  ))}
                </Select>
              </label>
              {detailOrder.status !== 'delivered' && detailOrder.status !== 'cancelled' ? (
                <>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() => cancel(detailOrder)}
                  >
                    <Ban className="size-4" aria-hidden="true" />
                    Anular pedido
                  </button>
                  {nextOrderStatus(detailOrder.status) ? (
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => advance(detailOrder)}
                    >
                      <ArrowRight className="size-4" aria-hidden="true" />
                      Avanzar
                    </button>
                  ) : null}
                  <button type="button" className={btnPrimary} onClick={() => deliver(detailOrder)}>
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Confirmar entrega
                  </button>
                </>
              ) : (
                <button type="button" className={btnSecondary} onClick={() => setDetail(null)}>
                  Cerrar
                </button>
              )}
            </>
          ) : null
        }
      >
        {detailOrder ? (
          <div className="space-y-5">
            <DeliveryStepper order={detailOrder} />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Dirección de entrega', value: detailOrder.deliveryAddress || '—' },
                { label: 'Recibe', value: detailOrder.recipientName || detailOrder.clientName },
                {
                  label: 'Courier / guía',
                  value:
                    [detailOrder.carrier, detailOrder.trackingNumber].filter(Boolean).join(' · ') ||
                    'No aplica',
                },
                {
                  label: detailOrder.deliveredAt ? 'Entregado el' : 'Fecha esperada',
                  value: detailOrder.deliveredAt
                    ? formatDateTime(detailOrder.deliveredAt)
                    : detailOrder.expectedDeliveryAt
                      ? formatDate(detailOrder.expectedDeliveryAt)
                      : 'Por coordinar',
                },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[12.5px] font-medium leading-snug text-slate-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-[12.5px]">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">Mercancía</th>
                    <th className="px-4 py-2.5 text-right">Pedido</th>
                    <th className="px-4 py-2.5 text-right">Entregado</th>
                    <th className="px-4 py-2.5 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detailOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        {item.sku ? (
                          <p className="mt-0.5 font-mono text-[10.5px] text-slate-400">{item.sku}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <input
                          type="number"
                          min={0}
                          max={item.quantity}
                          value={item.deliveredQuantity}
                          onChange={(event) =>
                            saveDeliveredUnits(item, Number(event.target.value) || 0)
                          }
                          className={cn(inputClass, 'w-20 text-right tabular-nums')}
                          aria-label={`Unidades entregadas de ${item.name}`}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                        {formatCurrency(item.quantity * item.unitPrice, detailOrder.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/70">
                  <tr>
                    <td className="px-4 py-2.5 text-[11px] text-slate-500" colSpan={3}>
                      Subtotal {formatCurrency(quoteTotals(detailOrder.items, settings.igv).net, detailOrder.currency)} ·
                      IGV {settings.igv}% {formatCurrency(quoteTotals(detailOrder.items, settings.igv).tax, detailOrder.currency)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-slate-900">
                      {formatCurrency(quoteTotals(detailOrder.items, settings.igv).total, detailOrder.currency)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Trazabilidad de la entrega
              </p>
              <ol className="space-y-2.5">
                {[...detailOrder.deliveryEvents]
                  .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
                  .map((event) => (
                    <li key={event.id} className="flex gap-3">
                      <span
                        className={cn(
                          'mt-1.5 size-2 shrink-0 rounded-full ring-1 ring-inset',
                          orderStatusClasses[event.status]
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold text-slate-800">
                          {orderStatusLabels[event.status]}
                          <span className="ml-2 text-[11px] font-normal text-slate-400">
                            {formatDateTime(event.at)}
                          </span>
                        </p>
                        {event.note ? (
                          <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500">
                            {event.note}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
              </ol>
            </div>

            {detailOrder.notes ? (
              <p className="rounded-xl bg-slate-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-slate-600">
                {detailOrder.notes}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Nuevo pedido' : `Editar ${editing?.code}`}
        description="Los datos de entrega se registran en el panel; el estado de la mercancía se actualiza desde la lista."
        size="xl"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setEditing(null)}>
              Cancelar
            </button>
            <button type="submit" form="order-form" className={btnPrimary}>
              {editing === 'new' ? 'Registrar pedido' : 'Guardar cambios'}
            </button>
          </>
        }
      >
        <form id="order-form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cliente registrado" htmlFor="order-client" hint="Al elegirlo se completan los datos de contacto.">
              <Select
                id="order-client"
                value={draft.clientId}
                onChange={(event) => handleClientChange(event.target.value)}
              >
                <option value="">Sin vincular</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company || client.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Contacto / destinatario" htmlFor="order-name" required error={errors.clientName}>
              <input
                id="order-name"
                value={draft.clientName}
                onChange={(event) => update('clientName', event.target.value)}
                className={inputClass}
                placeholder="Nombre de quien recibe"
              />
            </Field>
            <Field label="Correo" htmlFor="order-email" error={errors.clientEmail}>
              <input
                id="order-email"
                value={draft.clientEmail}
                onChange={(event) => update('clientEmail', event.target.value)}
                className={inputClass}
                placeholder="cliente@empresa.pe"
              />
            </Field>
            <Field label="Teléfono" htmlFor="order-phone">
              <input
                id="order-phone"
                value={draft.clientPhone}
                onChange={(event) => update('clientPhone', event.target.value)}
                className={inputClass}
                placeholder="+51 900 000 000"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Método de entrega" htmlFor="order-method">
              <Select
                id="order-method"
                value={draft.deliveryMethod}
                onChange={(event) => update('deliveryMethod', event.target.value as DeliveryMethod)}
              >
                {(Object.keys(deliveryMethodLabels) as DeliveryMethod[]).map((key) => (
                  <option key={key} value={key}>
                    {deliveryMethodLabels[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Fecha esperada" htmlFor="order-expected">
              <DatePicker
                id="order-expected"
                value={draft.expectedDeliveryAt}
                onChange={(next) => update('expectedDeliveryAt', next)}
                aria-label="Fecha esperada de entrega"
                placeholder="Por coordinar"
              />
            </Field>
            <Field label="Estado de pago" htmlFor="order-payment">
              <Select
                id="order-payment"
                value={draft.paymentStatus}
                onChange={(event) => update('paymentStatus', event.target.value as PaymentStatus)}
              >
                {(Object.keys(paymentStatusLabels) as PaymentStatus[]).map((key) => (
                  <option key={key} value={key}>
                    {paymentStatusLabels[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Moneda" htmlFor="order-currency">
              <Select
                id="order-currency"
                value={draft.currency}
                onChange={(event) => update('currency', event.target.value as Currency)}
              >
                <option value="PEN">PEN — Sol</option>
                <option value="USD">USD — Dólar</option>
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field
              label="Dirección de entrega"
              htmlFor="order-address"
              required={draft.deliveryMethod !== 'pickup'}
              error={errors.deliveryAddress}
              className="xl:col-span-2"
            >
              <input
                id="order-address"
                value={draft.deliveryAddress}
                onChange={(event) => update('deliveryAddress', event.target.value)}
                className={inputClass}
                placeholder={
                  draft.deliveryMethod === 'pickup'
                    ? 'Retiro en tienda'
                    : 'Av./Ej. 123, distrito, ciudad'
                }
              />
            </Field>
            <Field label="Courier" htmlFor="order-carrier">
              <input
                id="order-carrier"
                value={draft.carrier}
                onChange={(event) => update('carrier', event.target.value)}
                className={inputClass}
                placeholder="Shalom, Marvisur…"
              />
            </Field>
            <Field label="N.º de guía" htmlFor="order-tracking">
              <input
                id="order-tracking"
                value={draft.trackingNumber}
                onChange={(event) => update('trackingNumber', event.target.value)}
                className={inputClass}
                placeholder="SHA-0000000"
              />
            </Field>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-end gap-2">
              <Field label="Agregar del catálogo" htmlFor="order-product" className="flex-1 min-w-[240px]">
                <Select
                  id="order-product"
                  value={pickProduct}
                  onChange={(event) => setPickProduct(event.target.value)}
                >
                  <option value="">Selecciona un producto…</option>
                  {products
                    .filter((product) => product.status !== 'archived')
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} — {product.sku} (stock {product.stock})
                      </option>
                    ))}
                </Select>
              </Field>
              <button type="button" className={btnSecondary} onClick={addPickedProduct}>
                <Plus className="size-4" aria-hidden="true" />
                Agregar
              </button>
            </div>

            {errors.items ? (
              <p className="text-[11px] font-medium text-red-600">{errors.items}</p>
            ) : null}

            {draft.items.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5">Producto</th>
                      <th className="w-24 px-4 py-2.5">Cantidad</th>
                      <th className="w-32 px-4 py-2.5">Unitario</th>
                      <th className="w-28 px-4 py-2.5 text-right">Importe</th>
                      <th className="w-12 px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {draft.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2.5">
                          <input
                            value={item.name}
                            onChange={(event) => updateLine(item.id, { name: event.target.value })}
                            className={inputClass}
                            aria-label="Nombre del ítem"
                          />
                          {item.sku ? (
                            <p className="mt-0.5 font-mono text-[10px] text-slate-400">{item.sku}</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(event) =>
                              updateLine(item.id, { quantity: Number(event.target.value) || 0 })
                            }
                            className={cn(inputClass, 'text-right tabular-nums')}
                            aria-label="Cantidad"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(event) =>
                              updateLine(item.id, { unitPrice: Number(event.target.value) || 0 })
                            }
                            className={cn(inputClass, 'text-right tabular-nums')}
                            aria-label="Precio unitario"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-800">
                          {formatCurrency(item.quantity * item.unitPrice, draft.currency)}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            type="button"
                            className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600')}
                            onClick={() => removeLine(item.id)}
                            aria-label={`Quitar ${item.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-[11.5px] text-slate-500">
                El pedido aún no tiene líneas de mercancía.
              </p>
            )}
          </div>

          <Field label="Observaciones de entrega" htmlFor="order-notes">
            <textarea
              id="order-notes"
              value={draft.notes}
              onChange={(event) => update('notes', event.target.value)}
              className={textareaClass}
              rows={3}
              placeholder="Horarios de recepción, requisitos de instalación, contactos en obra…"
            />
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar pedido"
        description={
          deleteTarget
            ? `Se eliminará el registro ${deleteTarget.code} y su trazabilidad de entrega. Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (!deleteTarget) return
          removeOrder(deleteTarget.id)
          toast.success('Pedido eliminado', deleteTarget.code)
          setDeleteTarget(null)
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}

function emptyOrder(currency: Currency): Order {
  const now = new Date().toISOString()
  return {
    id: '',
    code: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    status: 'pending',
    paymentStatus: 'pending',
    currency,
    items: [],
    deliveryMethod: 'own',
    deliveryAddress: '',
    recipientName: '',
    carrier: '',
    trackingNumber: '',
    deliveryEvents: [],
    notes: '',
    createdAt: now,
    updatedAt: now,
  }
}
