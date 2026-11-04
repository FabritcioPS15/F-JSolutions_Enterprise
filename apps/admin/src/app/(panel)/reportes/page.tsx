'use client'

import { useEffect, useState } from 'react'
import {
  BarChart3,
  CalendarDays,
  Clock,
  Download,
  FileText,
  Inbox,
  Package,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  EmptyState,
  PageHeader,
  SectionCard,
  StatCard,
  btnSecondary,
  inputClass,
} from '@/components/admin/ui'
import {
  downloadFile,
  formatCurrency,
  formatNumber,
  quoteStatusLabels,
  requestChannelLabels,
  requestStatusLabels,
} from '@/lib/admin/format'
import {
  DashboardApiError,
  fetchHelpdeskReport,
  fetchSalesReport,
} from '@/lib/services/dashboard'
import type {
  Currency,
  CurrencyAmount,
  HelpdeskReport,
  QuoteStatus,
  RequestChannel,
  RequestStatus,
  SalesReport,
} from '@/lib/admin/types'

const QUOTE_STATUSES: QuoteStatus[] = [
  'draft',
  'new',
  'review',
  'sent',
  'approved',
  'rejected',
  'expired',
]

const REQUEST_STATUSES: RequestStatus[] = ['new', 'review', 'attended', 'discarded']

const REQUEST_CHANNELS: RequestChannel[] = ['web', 'email', 'whatsapp', 'phone']

const tableClass = 'w-full min-w-[560px] text-left text-[12.5px]'
const headRowClass =
  'border-b border-slate-100 bg-slate-50/70 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500'
const cellClass = 'px-4 py-2.5'

function isoDaysAgo(days: number) {
  const today = new Date()
  return new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - days)
  )
    .toISOString()
    .slice(0, 10)
}

function currencyTotal(amounts: CurrencyAmount[], currency: Currency) {
  return amounts.find((amount) => amount.currency === currency)?.total ?? 0
}

function currencyCount(amounts: CurrencyAmount[], currency: Currency) {
  return amounts.find((amount) => amount.currency === currency)?.count ?? 0
}

function hoursLabel(value: number | null) {
  if (value === null) return '—'
  if (value < 1) return `${Math.round(value * 60)} min`
  return `${formatNumber(Math.round(value * 10) / 10)} h`
}

function csvValue(value: string | number) {
  const text = String(value ?? '')
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function csvContent(rows: Array<Array<string | number>>) {
  return `\uFEFF${rows.map((row) => row.map(csvValue).join(',')).join('\r\n')}`
}

function salesCsv(report: SalesReport) {
  return csvContent([
    ['Reporte de ventas'],
    ['Desde', report.range.from],
    ['Hasta', report.range.to],
    ['Cotizaciones', report.totals.quotes],
    ['Aprobadas', report.totals.approved],
    ['Conversión (%)', report.totals.conversionRate],
    ['Monto cotizado PEN', currencyTotal(report.totals.amounts, 'PEN')],
    ['Monto cotizado USD', currencyTotal(report.totals.amounts, 'USD')],
    [],
    ['Mes', 'Cotizaciones', 'Aprobadas', 'Monto PEN', 'Monto USD'],
    ...report.monthly.map((row) => [
      row.label,
      row.quotes,
      row.approved,
      currencyTotal(row.amounts, 'PEN'),
      currencyTotal(row.amounts, 'USD'),
    ]),
    [],
    ['Cliente', 'Empresa', 'Cotizaciones', 'Aprobadas', 'PEN', 'USD'],
    ...report.topClients.map((row) => [
      row.name,
      row.company,
      row.quotes,
      row.approved,
      currencyTotal(row.amounts, 'PEN'),
      currencyTotal(row.amounts, 'USD'),
    ]),
    [],
    ['Producto', 'SKU', 'Cantidad', 'Cotizaciones', 'PEN', 'USD'],
    ...report.topProducts.map((row) => [
      row.name,
      row.sku ?? '',
      row.quantity,
      row.quotes,
      currencyTotal(row.amounts, 'PEN'),
      currencyTotal(row.amounts, 'USD'),
    ]),
  ])
}

function helpdeskCsv(report: HelpdeskReport) {
  return csvContent([
    ['Reporte de mesa de ayuda'],
    ['Desde', report.range.from],
    ['Hasta', report.range.to],
    ['Solicitudes', report.totals.requests],
    ['Atendidas', report.totals.attended],
    ['Pendientes', report.totals.pending],
    ['Tasa de atención (%)', report.totals.attendedRate],
    ['Primera respuesta (h)', report.totals.avgFirstResponseHours ?? ''],
    ['Resolución (h)', report.totals.avgResolutionHours ?? ''],
    [],
    ['Mes', 'Solicitudes', 'Atendidas'],
    ...report.monthly.map((row) => [row.label, row.requests, row.attended]),
    [],
    ['Estado', 'Solicitudes'],
    ...REQUEST_STATUSES.map((status) => [requestStatusLabels[status], report.byStatus[status]]),
    [],
    ['Canal', 'Solicitudes'],
    ...REQUEST_CHANNELS.map((channel) => [
      requestChannelLabels[channel],
      report.byChannel[channel],
    ]),
  ])
}

export default function ReportsPage() {
  const [from, setFrom] = useState(() => isoDaysAgo(29))
  const [to, setTo] = useState(() => isoDaysAgo(0))
  const [sales, setSales] = useState<SalesReport | null>(null)
  const [helpdesk, setHelpdesk] = useState<HelpdeskReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!from || !to) return
    if (from > to) {
      setError('La fecha inicial no puede ser posterior a la fecha final.')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([fetchSalesReport({ from, to }), fetchHelpdeskReport({ from, to })])
      .then(([salesResult, helpdeskResult]) => {
        if (cancelled) return
        setSales(salesResult)
        setHelpdesk(helpdeskResult)
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setError(
          cause instanceof DashboardApiError
            ? cause.message
            : 'No se pudieron cargar los reportes.'
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [from, to])

  const resetRange = () => {
    setFrom(isoDaysAgo(29))
    setTo(isoDaysAgo(0))
  }

  const exportSales = () => {
    if (!sales) return
    downloadFile(
      `reporte-ventas-${sales.range.from}_${sales.range.to}.csv`,
      salesCsv(sales),
      'text/csv;charset=utf-8'
    )
  }

  const exportHelpdesk = () => {
    if (!helpdesk) return
    downloadFile(
      `reporte-mesa-ayuda-${helpdesk.range.from}_${helpdesk.range.to}.csv`,
      helpdeskCsv(helpdesk),
      'text/csv;charset=utf-8'
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="General"
        title="Reportes"
        description="Indicadores de ventas y mesa de ayuda calculados en la API sobre los datos persistentes."
        actions={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={exportSales}
              disabled={!sales || loading}
            >
              <Download className="size-4" aria-hidden="true" />
              Exportar ventas
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={exportHelpdesk}
              disabled={!helpdesk || loading}
            >
              <Download className="size-4" aria-hidden="true" />
              Exportar mesa de ayuda
            </button>
          </>
        }
      />

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-full sm:w-44">
              <label
                htmlFor="report-from"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700"
              >
                <CalendarDays className="size-3.5 text-slate-400" aria-hidden="true" />
                Desde
              </label>
              <input
                id="report-from"
                type="date"
                className={inputClass}
                value={from}
                max={to || undefined}
                onChange={(event) => setFrom(event.target.value)}
              />
            </div>
            <div className="w-full sm:w-44">
              <label
                htmlFor="report-to"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700"
              >
                <CalendarDays className="size-3.5 text-slate-400" aria-hidden="true" />
                Hasta
              </label>
              <input
                id="report-to"
                type="date"
                className={inputClass}
                value={to}
                min={from || undefined}
                onChange={(event) => setTo(event.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[11px] text-slate-400">
              {sales
                ? `${sales.range.days} días · ${formatNumber(sales.totals.quotes)} cotizaciones`
                : 'Selecciona un rango de fechas.'}
            </p>
            <button type="button" className={btnSecondary} onClick={resetRange}>
              Últimos 30 días
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        )}
        {!error && loading && (
          <p className="mt-3 text-[11px] font-medium text-slate-400">
            Actualizando reportes…
          </p>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Cotizaciones"
          value={sales ? formatNumber(sales.totals.quotes) : '—'}
          helper={sales ? `${formatNumber(sales.totals.open)} abiertas` : 'Sin datos'}
          icon={FileText}
        />
        <StatCard
          label="Aprobadas"
          value={sales ? formatNumber(sales.totals.approved) : '—'}
          helper={sales ? `${sales.totals.conversionRate}% de conversión` : 'Sin datos'}
          icon={TrendingUp}
        />
        <StatCard
          label="Monto cotizado"
          value={sales ? formatCurrency(currencyTotal(sales.totals.amounts, 'PEN'), 'PEN') : '—'}
          helper={
            sales
              ? `USD ${formatCurrency(currencyTotal(sales.totals.amounts, 'USD'), 'USD')}`
              : 'Sin datos'
          }
          icon={BarChart3}
        />
        <StatCard
          label="Ticket promedio"
          value={
            sales
              ? formatCurrency(currencyTotal(sales.totals.averageTicket, 'PEN'), 'PEN')
              : '—'
          }
          helper={
            sales
              ? `${currencyCount(sales.totals.averageTicket, 'PEN')} cotizaciones aprobadas`
              : 'Sin datos'
          }
          icon={Package}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Ventas por mes"
          description="Cotizaciones registradas y aprobadas dentro del rango."
          icon={BarChart3}
          className="xl:col-span-2"
          bodyClassName="p-0"
        >
          {!sales || sales.monthly.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                icon={BarChart3}
                title="Sin datos en el rango"
                description="Registra cotizaciones o amplía el rango de fechas."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className={headRowClass}>
                  <tr>
                    <th className={cellClass}>Mes</th>
                    <th className={cellClass}>Cotizaciones</th>
                    <th className={cellClass}>Aprobadas</th>
                    <th className={cellClass}>Monto PEN</th>
                    <th className={cellClass}>Monto USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.monthly.map((row) => (
                    <tr key={row.month} className="text-slate-600">
                      <td className={cellClass + ' font-semibold text-slate-900'}>{row.label}</td>
                      <td className={cellClass + ' tabular-nums'}>{formatNumber(row.quotes)}</td>
                      <td className={cellClass + ' tabular-nums'}>{formatNumber(row.approved)}</td>
                      <td className={cellClass + ' tabular-nums'}>
                        {formatCurrency(currencyTotal(row.amounts, 'PEN'), 'PEN')}
                      </td>
                      <td className={cellClass + ' tabular-nums'}>
                        {formatCurrency(currencyTotal(row.amounts, 'USD'), 'USD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Estado de cotizaciones"
          description="Distribución por estado en el rango."
          icon={FileText}
        >
          {!sales ? (
            <EmptyState icon={FileText} title="Sin datos" description="Consultando la API." />
          ) : (
            <ul className="space-y-2.5">
              {QUOTE_STATUSES.map((status) => (
                <li
                  key={status}
                  className="flex items-center justify-between gap-3 text-xs text-slate-600"
                >
                  <span>{quoteStatusLabels[status]}</span>
                  <span className="font-bold tabular-nums text-slate-900">
                    {formatNumber(sales.byStatus[status])}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Principales clientes"
          description="Ordenados por cotizaciones aprobadas en el rango."
          icon={Users}
          bodyClassName="p-0"
        >
          {!sales || sales.topClients.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                icon={Users}
                title="Sin clientes en el rango"
                description="Las cotizaciones registradas alimentan este ranking."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className={headRowClass}>
                  <tr>
                    <th className={cellClass}>Cliente</th>
                    <th className={cellClass}>Cotizaciones</th>
                    <th className={cellClass}>Aprobadas</th>
                    <th className={cellClass}>Monto PEN</th>
                    <th className={cellClass}>Monto USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.topClients.map((row) => (
                    <tr key={row.key} className="text-slate-600">
                      <td className={cellClass}>
                        <p className="font-semibold text-slate-900">{row.name}</p>
                        {row.company && (
                          <p className="text-[10.5px] text-slate-400">{row.company}</p>
                        )}
                      </td>
                      <td className={cellClass + ' tabular-nums'}>{formatNumber(row.quotes)}</td>
                      <td className={cellClass + ' tabular-nums'}>
                        {formatNumber(row.approved)}
                      </td>
                      <td className={cellClass + ' tabular-nums'}>
                        {formatCurrency(currencyTotal(row.amounts, 'PEN'), 'PEN')}
                      </td>
                      <td className={cellClass + ' tabular-nums'}>
                        {formatCurrency(currencyTotal(row.amounts, 'USD'), 'USD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Productos más cotizados"
          description="Ordenados por unidades incluidas en cotizaciones."
          icon={Package}
          bodyClassName="p-0"
        >
          {!sales || sales.topProducts.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                icon={Package}
                title="Sin productos en el rango"
                description="Agrega líneas a las cotizaciones para ver este ranking."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className={headRowClass}>
                  <tr>
                    <th className={cellClass}>Producto</th>
                    <th className={cellClass}>Unidades</th>
                    <th className={cellClass}>Cotizaciones</th>
                    <th className={cellClass}>Monto PEN</th>
                    <th className={cellClass}>Monto USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.topProducts.map((row) => (
                    <tr key={row.key} className="text-slate-600">
                      <td className={cellClass}>
                        <p className="font-semibold text-slate-900">{row.name}</p>
                        {row.sku && <p className="font-mono text-[10.5px] text-slate-400">{row.sku}</p>}
                      </td>
                      <td className={cellClass + ' tabular-nums'}>{formatNumber(row.quantity)}</td>
                      <td className={cellClass + ' tabular-nums'}>{formatNumber(row.quotes)}</td>
                      <td className={cellClass + ' tabular-nums'}>
                        {formatCurrency(currencyTotal(row.amounts, 'PEN'), 'PEN')}
                      </td>
                      <td className={cellClass + ' tabular-nums'}>
                        {formatCurrency(currencyTotal(row.amounts, 'USD'), 'USD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Solicitudes"
          value={helpdesk ? formatNumber(helpdesk.totals.requests) : '—'}
          helper={helpdesk ? `${formatNumber(helpdesk.totals.pending)} pendientes` : 'Sin datos'}
          icon={Inbox}
        />
        <StatCard
          label="Tasa de atención"
          value={helpdesk ? `${helpdesk.totals.attendedRate}%` : '—'}
          helper={
            helpdesk
              ? `${formatNumber(helpdesk.totals.attended)} atendidas`
              : 'Sin datos'
          }
          icon={TrendingUp}
        />
        <StatCard
          label="Primera respuesta"
          value={helpdesk ? hoursLabel(helpdesk.totals.avgFirstResponseHours) : '—'}
          helper="Promedio del rango"
          icon={Clock}
        />
        <StatCard
          label="Resolución"
          value={helpdesk ? hoursLabel(helpdesk.totals.avgResolutionHours) : '—'}
          helper="Promedio del rango"
          icon={Clock}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Mesa de ayuda por canal"
          description="Origen de las solicitudes recibidas."
          icon={Inbox}
        >
          {!helpdesk ? (
            <EmptyState icon={Inbox} title="Sin datos" description="Consultando la API." />
          ) : (
            <ul className="space-y-2.5">
              {REQUEST_CHANNELS.map((channel) => (
                <li
                  key={channel}
                  className="flex items-center justify-between gap-3 text-xs text-slate-600"
                >
                  <span>{requestChannelLabels[channel]}</span>
                  <span className="font-bold tabular-nums text-slate-900">
                    {formatNumber(helpdesk.byChannel[channel])}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Mesa de ayuda por estado"
          description="Situación actual de las solicitudes del rango."
          icon={FileText}
        >
          {!helpdesk ? (
            <EmptyState icon={FileText} title="Sin datos" description="Consultando la API." />
          ) : (
            <ul className="space-y-2.5">
              {REQUEST_STATUSES.map((status) => (
                <li
                  key={status}
                  className="flex items-center justify-between gap-3 text-xs text-slate-600"
                >
                  <span>{requestStatusLabels[status]}</span>
                  <span className="font-bold tabular-nums text-slate-900">
                    {formatNumber(helpdesk.byStatus[status])}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Solicitudes por mes"
          description="Volumen y atención dentro del rango."
          icon={BarChart3}
        >
          {!helpdesk || helpdesk.monthly.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="Sin datos en el rango"
              description="Registra solicitudes o amplía el rango de fechas."
            />
          ) : (
            <ul className="space-y-2.5">
              {helpdesk.monthly.map((row) => (
                <li
                  key={row.month}
                  className="flex items-center justify-between gap-3 text-xs text-slate-600"
                >
                  <span>{row.label}</span>
                  <span className="tabular-nums text-slate-900">
                    {formatNumber(row.requests)} ·{' '}
                    <span className="text-slate-400">{formatNumber(row.attended)} atendidas</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
