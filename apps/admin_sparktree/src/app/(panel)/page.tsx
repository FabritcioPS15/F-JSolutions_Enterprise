'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Archive,
  CheckCircle2,
  Copy,
  EyeOff,
  FileEdit,
  FileText,
  FolderTree,
  Inbox,
  Package,
  PackagePlus,
  Pencil,
  RotateCcw,
  Sparkles,
  Tags,
  Trash2,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { CategoryGlyph } from '@/components/admin/category-icon'
import { ProductThumb } from '@/components/admin/product-thumb'
import {
  EmptyState,
  SectionCard,
  StatCard,
  StockBadge,
} from '@/components/admin/ui'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  getStockState,
  quoteStatusLabels,
  requestStatusLabels,
} from '@/lib/admin/format'
import { DashboardApiError, fetchDashboardSummary } from '@/lib/services/dashboard'
import { buildLocalDashboardSummary } from '@/lib/admin/dashboard-local'
import type { ActivityType, DashboardSummary } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const storeUrl = process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3000'

const activityMeta: Record<
  ActivityType,
  { label: string; icon: LucideIcon; chip: string }
> = {
  created: { label: 'Producto creado', icon: PackagePlus, chip: 'bg-muted text-muted-foreground ring-border' },
  updated: { label: 'Producto actualizado', icon: Pencil, chip: 'bg-muted text-muted-foreground ring-border' },
  published: { label: 'Producto publicado', icon: CheckCircle2, chip: 'bg-emerald-500/10 text-success-ink ring-emerald-500/20' },
  unpublished: { label: 'Retirado de publicación', icon: EyeOff, chip: 'bg-muted text-muted-foreground ring-border' },
  archived: { label: 'Producto archivado', icon: Archive, chip: 'bg-amber-500/10 text-warning-ink ring-amber-100' },
  restored: { label: 'Producto restaurado', icon: RotateCcw, chip: 'bg-emerald-500/10 text-success-ink ring-emerald-500/20' },
  duplicated: { label: 'Producto duplicado', icon: Copy, chip: 'bg-muted text-muted-foreground ring-border' },
  deleted: { label: 'Producto eliminado', icon: Trash2, chip: 'bg-red-500/10 text-danger-ink ring-red-500/20' },
}

export default function DashboardPage() {
  const { products, categories, brands, clients, quotes, requests, settings, activity } = useAdmin()
  const [remoteSummary, setRemoteSummary] = useState<DashboardSummary | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const localSummary = useMemo(
    () => buildLocalDashboardSummary({ products, clients, quotes, requests, settings }),
    [products, clients, quotes, requests, settings]
  )
  const summary = remoteSummary ?? localSummary

  useEffect(() => {
    let cancelled = false

    fetchDashboardSummary()
      .then((result) => {
        if (!cancelled) setRemoteSummary(result)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        // Sin base de datos el resumen local ya cubre la pantalla; solo se avisa
        // de los fallos que el respaldo local no explica.
        if (error instanceof DashboardApiError && error.status === 503) return
        setSummaryError(
          error instanceof DashboardApiError
            ? error.message
            : 'No se pudieron cargar los indicadores persistentes.'
        )
      })

    return () => {
      cancelled = true
    }
  }, [])

  const penAmount = summary.quotes.amounts.find((amount) => amount.currency === 'PEN')

  const published = products.filter((product) => product.status === 'active')
  const drafts = products.filter((product) => product.status === 'draft')
  const archived = products.filter((product) => product.status === 'archived')
  const lowStock = products
    .filter((product) => product.status !== 'archived' && getStockState(product) !== 'ok')
    .sort((a, b) => a.stock - b.stock)

  const subcategoryCount = categories.reduce(
    (total, category) => total + category.subcategories.length,
    0
  )

  const categoryStats = categories
    .map((category) => {
      const items = products.filter((product) => product.category === category.label)
      return {
        id: category.id,
        label: category.label,
        count: items.length,
        units: items.reduce((total, product) => total + product.stock, 0),
      }
    })
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)

  const maxCategoryCount = Math.max(...categoryStats.map((category) => category.count), 1)
  const total = products.length || 1
  const publishedPct = (published.length / total) * 100
  const draftPct = publishedPct + (drafts.length / total) * 100

  const recent = activity.slice(0, 6)
  const newRequests = requests.filter((request) => request.status === 'new').length
  const openQuotes = quotes.filter(
    (quote) =>
      quote.status === 'draft' ||
      quote.status === 'new' ||
      quote.status === 'review' ||
      quote.status === 'sent'
  ).length
  const activeClients = clients.filter((client) => client.status === 'active').length

  return (
    <div className="space-y-6">
      {/* ── Banner Principal de Operaciones (Enterprise Slate) ── */}
      <section className="relative overflow-hidden rounded-3xl border border-[#2E2750]/80 bg-[#16112E] px-6 py-7 text-white shadow-xl shadow-black/25 sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.2) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#5946A6]/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-1/4 size-72 rounded-full bg-[#8876D9]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8876D9]/30 bg-[#8876D9]/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#C5BDF2]">
                <span className="size-1.5 rounded-full bg-[#8876D9] shadow-[0_0_8px_rgba(169,154,240,0.8)]" />
                {settings.storeName} Enterprise
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10.5px] font-medium text-slate-400">
                Panel de Control Unificado
              </span>
            </div>

            <h1 className="mt-3 font-heading text-2xl font-bold leading-tight tracking-tight sm:text-[30px]">
              Centro de Control Operativo
            </h1>
            <p className="mt-1.5 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-400">
              Gestión centralizada de cotizaciones comerciales, inventario crítico, clientes y
              solicitudes de soporte técnico en tiempo real.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Package className="size-3.5 text-[#A99AF0]" aria-hidden="true" />
                <strong className="text-white">{products.length}</strong> productos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-3.5 text-[#A99AF0]" aria-hidden="true" />
                <strong className="text-white">{openQuotes}</strong> cotizaciones abiertas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5 text-[#A99AF0]" aria-hidden="true" />
                <strong className="text-white">{activeClients}</strong> clientes activos
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/cotizaciones"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5946A6] px-4 text-xs font-bold text-white shadow-md shadow-[#5946A6]/25 transition hover:bg-[#4A3A8F]"
            >
              <FileText className="size-3.5" aria-hidden="true" />
              Ver cotizaciones
            </Link>
            <Link
              href="/productos/nuevo"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <PackagePlus className="size-3.5" aria-hidden="true" />
              Nuevo producto
            </Link>
            <a
              href={`${storeUrl}/productos`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Tienda
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Action Center: Bandeja de Acción Inmediata (Modelo 3) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-[#5946A6]/15 text-[#5946A6]">
              <Sparkles className="size-3.5" />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Bandeja de Acción Operativa
            </h2>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            {openQuotes + lowStock.length + newRequests > 0
              ? `${openQuotes + lowStock.length + newRequests} asuntos que requieren atención`
              : 'Operación al día'}
          </span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Alerta 1: Cotizaciones pendientes */}
          <Link
            href="/cotizaciones"
            className="group relative flex flex-col justify-between rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-blue-500/[0.08] hover:shadow-md hover:shadow-blue-500/5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  <FileText className="size-3" />
                  Comercial
                </span>
                <span className="font-heading text-lg font-bold text-foreground">
                  {openQuotes}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-foreground">
                Cotizaciones por atender
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                {openQuotes === 1
                  ? '1 cotización en borrador o revisión'
                  : `${openQuotes} cotizaciones pendientes de emitir`}
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#5946A6] group-hover:underline">
              Revisar cotizaciones
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Alerta 2: Stock bajo o agotado */}
          <Link
            href="/productos?stock=low"
            className="group relative flex flex-col justify-between rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-amber-500/[0.08] hover:shadow-md hover:shadow-amber-500/5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="size-3" />
                  Almacén
                </span>
                <span className="font-heading text-lg font-bold text-foreground">
                  {lowStock.length}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-foreground">
                Stock crítico o agotado
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                {lowStock.length === 1
                  ? '1 producto requiere reposición'
                  : `${lowStock.length} productos bajo el mínimo`}
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
              Gestionar reposición
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Alerta 3: Consultas mesa de ayuda */}
          <Link
            href="/solicitudes"
            className="group relative flex flex-col justify-between rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/40 hover:bg-purple-500/[0.08] hover:shadow-md hover:shadow-purple-500/5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-400">
                  <Inbox className="size-3" />
                  Soporte
                </span>
                <span className="font-heading text-lg font-bold text-foreground">
                  {newRequests}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-foreground">
                Mesa de ayuda
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                {newRequests === 1
                  ? '1 mensaje nuevo sin responder'
                  : `${newRequests} solicitudes nuevas de clientes`}
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 group-hover:underline">
              Atender solicitudes
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Alerta 4: Clientes y Cuentas */}
          <Link
            href="/clientes"
            className="group relative flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-500/[0.08] hover:shadow-md hover:shadow-emerald-500/5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <Users className="size-3" />
                  Clientes
                </span>
                <span className="font-heading text-lg font-bold text-foreground">
                  {activeClients}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-foreground">
                Cuentas activas
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                {summary.clients.newThisMonth > 0
                  ? `${summary.clients.newThisMonth} clientes nuevos este mes`
                  : `${clients.length} cuentas en el directorio`}
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
              Ver directorio
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>

      {summaryError && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-warning-ink">
          {summaryError} Se muestran los datos locales mientras la API esté disponible.
        </div>
      )}

      {/* ── KPIs Ejecutivos Principales ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Volumen comercial"
          value={formatCurrency(penAmount?.total ?? 0, 'PEN')}
          helper={`${formatNumber(summary.quotes.total)} cotizaciones registradas`}
          icon={FileText}
          href="/cotizaciones"
        />
        <StatCard
          label="Tasa de conversión"
          value={`${summary.quotes.conversionRate}%`}
          helper={`${formatNumber(summary.quotes.approved)} aprobadas de ${formatNumber(summary.quotes.decided)} decididas`}
          icon={CheckCircle2}
          href="/reportes"
        />
        <StatCard
          label="Salud del catálogo"
          value={`${Math.round(publishedPct)}%`}
          helper={`${formatNumber(published.length)} publicados de ${formatNumber(products.length)}`}
          icon={Package}
          href="/productos"
        />
        <StatCard
          label="SLA de respuesta"
          value={summary.requests.avgResolutionHours ? `${summary.requests.avgResolutionHours} h` : 'Óptimo'}
          helper={`${formatNumber(summary.requests.total)} solicitudes atendidas`}
          icon={Inbox}
          href="/solicitudes"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Últimas cotizaciones"
          description="Ordenadas de la más reciente a la más antigua."
          icon={FileText}
          action={
            <Link
              href="/cotizaciones"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-ink transition hover:text-brand-ink"
            >
              Ver todas
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        >
          {summary.recentQuotes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Sin cotizaciones"
              description="Las cotizaciones registradas aparecerán aquí."
            />
          ) : (
            <ul className="divide-y divide-border">
              {summary.recentQuotes.map((quote) => (
                <li
                  key={quote.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border/70">
                    <FileText className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-semibold text-foreground">
                      {quote.code} · {quote.clientName}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {quoteStatusLabels[quote.status]} · {formatDate(quote.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-foreground/80">
                    {formatCurrency(quote.total, quote.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Últimas solicitudes"
          description="Consultas recibidas en la mesa de ayuda."
          icon={Inbox}
          action={
            <Link
              href="/solicitudes"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-ink transition hover:text-brand-ink"
            >
              Ver todas
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        >
          {summary.recentRequests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Sin solicitudes"
              description="Las consultas recibidas aparecerán aquí."
            />
          ) : (
            <ul className="divide-y divide-border">
              {summary.recentRequests.map((request) => (
                <li
                  key={request.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border/70">
                    <Inbox className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-semibold text-foreground">
                      {request.code} · {request.name}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      {requestStatusLabels[request.status]} · {request.topic} ·{' '}
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Catálogo por categoría"
          description="Cantidad de productos registrados en cada categoría."
          icon={FolderTree}
          className="xl:col-span-2"
          action={
            <Link
              href="/categorias"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-ink transition hover:text-brand-ink"
            >
              Gestionar
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        >
          {categoryStats.length === 0 ? (
            <EmptyState
              icon={FolderTree}
              title="Aún no hay productos"
              description="Crea tu primer producto para ver la distribución por categoría."
              action={
                <Link href="/productos/nuevo" className="text-xs font-semibold text-brand-ink">
                  Crear producto
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {categoryStats.slice(0, 7).map((category) => (
                <div key={category.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border">
                        <CategoryGlyph label={category.label} className="size-3.5" />
                      </span>
                      <span className="truncate text-xs font-semibold text-foreground/80">
                        {category.label}
                      </span>
                      <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {category.count}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10.5px] font-medium text-muted-foreground">
                      {formatNumber(category.units)} uds.
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[#5946A6] transition-all duration-500"
                      style={{ width: `${Math.max(4, (category.count / maxCategoryCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Estado de publicación"
          description="Distribución del catálogo según su visibilidad."
          icon={Package}
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row xl:flex-col">
            <div
              className="relative size-36 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(#059669 0% ${publishedPct}%, #A9A2C0 ${publishedPct}% ${draftPct}%, #F59E0B ${draftPct}% 100%)`,
              }}
              role="img"
              aria-label={`${published.length} publicados, ${drafts.length} en borrador, ${archived.length} archivados`}
            >
              <div className="absolute inset-[18px] grid place-items-center rounded-full bg-card text-center shadow-inner">
                <div>
                  <p className="font-heading text-2xl font-bold leading-none text-foreground">
                    {products.length}
                  </p>
                  <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    productos
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-2.5">
              {[
                { label: 'Publicados', count: published.length, dot: 'bg-emerald-600' },
                { label: 'Borradores', count: drafts.length, dot: 'bg-slate-400' },
                { label: 'Archivados', count: archived.length, dot: 'bg-amber-500' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className={cn('size-2 rounded-full', row.dot)} />
                    {row.label}
                  </span>
                  <span className="font-bold tabular-nums text-foreground">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/70 px-3 py-2.5">
            <p className="text-[10.5px] text-muted-foreground">
              <span className="font-bold text-foreground">{lowStock.length}</span>{' '}
              {lowStock.length === 1 ? 'producto requiere' : 'productos requieren'} reposición
            </p>
            <Link
              href="/productos?stock=low"
              className="text-[10.5px] font-semibold text-brand-ink transition hover:text-brand-ink"
            >
              Revisar
            </Link>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Requieren reposición"
          description="Productos agotados o por debajo del stock mínimo."
          icon={AlertTriangle}
          className="xl:col-span-2"
          action={
            <Link
              href="/productos?stock=low"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-ink transition hover:text-brand-ink"
            >
              Ver todos
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
          bodyClassName="p-0"
        >
          {lowStock.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                icon={Package}
                title="Inventario en orden"
                description="Todos los productos tienen stock suficiente según su mínimo configurado."
              />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/productos/${product.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-muted/80 sm:px-6"
                  >
                    <ProductThumb src={product.image} alt={product.name} className="size-10 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground">{product.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {product.sku} · mínimo {product.minStock}
                      </p>
                    </div>
                    <StockBadge stock={product.stock} minStock={product.minStock} compact />
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Actividad reciente"
          description="Últimos cambios registrados en el catálogo."
          icon={Package}
          action={
            <Link
              href="/actividad"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-ink transition hover:text-brand-ink"
            >
              Ver todo
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        >
          {recent.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Sin actividad"
              description="Los cambios que realices aparecerán aquí."
            />
          ) : (
            <ul className="space-y-3.5">
              {recent.map((entry) => {
                const meta = activityMeta[entry.type]
                const Icon = meta.icon
                const product = entry.productId
                  ? products.find((item) => item.id === entry.productId)
                  : undefined
                const content = (
                  <>
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset',
                        meta.chip
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[11.5px] font-semibold text-foreground">
                        {entry.productName}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {entry.detail ?? meta.label} · {formatDateTime(entry.at)}
                      </p>
                    </div>
                  </>
                )

                return (
                  <li key={entry.id}>
                    {product ? (
                      <Link
                        href={`/productos/${product.id}`}
                        className="flex items-center gap-3 rounded-lg transition hover:text-brand-ink"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3">{content}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
