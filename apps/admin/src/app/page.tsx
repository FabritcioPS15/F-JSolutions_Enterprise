'use client'

import Link from 'next/link'
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
  formatDateTime,
  formatNumber,
  getStockState,
} from '@/lib/admin/format'
import type { ActivityType } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const storeUrl = process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3000'

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

export default function DashboardPage() {
  const { products, categories, brands, clients, quotes, requests, settings, activity } = useAdmin()

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
    (quote) => quote.status === 'draft' || quote.status === 'sent'
  ).length
  const activeClients = clients.filter((client) => client.status === 'active').length

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-[#0B1220] px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-9">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,.35) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/[0.06] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-white/[0.04] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
              <Sparkles className="size-3" aria-hidden="true" />
              {settings.storeName} · Administración
            </span>
            <h1 className="mt-4 font-heading text-2xl font-bold leading-tight tracking-tight sm:text-[32px]">
              Tu catálogo, bajo control.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
              Revisa el estado del catálogo, la actividad reciente y los productos que necesitan
              atención. Los indicadores se calculan con los datos guardados en este navegador.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Package className="size-3.5" aria-hidden="true" />
                {products.length} productos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FolderTree className="size-3.5" aria-hidden="true" />
                {categories.length} categorías
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tags className="size-3.5" aria-hidden="true" />
                {brands.length} marcas
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/productos/nuevo"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-slate-900 shadow-lg shadow-black/20 transition hover:bg-slate-100"
            >
              <PackagePlus className="size-4" aria-hidden="true" />
              Nuevo producto
            </Link>
            <a
              href={`${storeUrl}/productos`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              Ver catálogo público
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Productos"
          value={formatNumber(products.length)}
          helper="Total registrado en el catálogo"
          icon={Package}
          href="/productos"
        />
        <StatCard
          label="Publicados"
          value={formatNumber(published.length)}
          helper={`${Math.round((published.length / total) * 100)}% del catálogo`}
          icon={CheckCircle2}
          href="/productos?status=active"
        />
        <StatCard
          label="Borradores"
          value={formatNumber(drafts.length)}
          helper="En preparación, ocultos al público"
          icon={FileEdit}
          href="/productos?status=draft"
        />
        <StatCard
          label="Archivados"
          value={formatNumber(archived.length)}
          helper="Fuera de circulación"
          icon={Archive}
          href="/productos?status=archived"
        />
        <StatCard
          label="Categorías"
          value={formatNumber(categories.length)}
          helper={`${formatNumber(subcategoryCount)} subcategorías`}
          icon={FolderTree}
          href="/categorias"
        />
        <StatCard
          label="Marcas"
          value={formatNumber(brands.length)}
          helper="Marcas registradas"
          icon={Tags}
          href="/marcas"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            href: '/productos/nuevo',
            title: 'Crear producto',
            text: 'Agrega una nueva ficha al catálogo.',
            icon: PackagePlus,
          },
          {
            href: '/categorias',
            title: 'Gestionar categorías',
            text: 'Organiza la taxonomía del catálogo.',
            icon: FolderTree,
          },
          {
            href: '/marcas',
            title: 'Gestionar marcas',
            text: 'Mantén las marcas actualizadas.',
            icon: Tags,
          },
        ].map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-slate-900">{action.title}</span>
                <span className="mt-0.5 block text-[10.5px] text-slate-500">{action.text}</span>
              </span>
              <ArrowUpRight
                className="ml-auto size-4 shrink-0 text-slate-300 transition group-hover:text-slate-500"
                aria-hidden="true"
              />
            </Link>
          )
        })}
        <a
          href={`${storeUrl}/productos`}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
            <ArrowUpRight className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-bold text-slate-900">Ver catálogo público</span>
            <span className="mt-0.5 block text-[10.5px] text-slate-500">Abre la tienda en otra pestaña.</span>
          </span>
          <ArrowUpRight
            className="ml-auto size-4 shrink-0 text-slate-300 transition group-hover:text-slate-500"
            aria-hidden="true"
          />
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            href: '/solicitudes',
            label: 'Solicitudes nuevas',
            value: newRequests,
            hint: 'Consultas sin revisar en la bandeja',
            icon: Inbox,
          },
          {
            href: '/cotizaciones',
            label: 'Cotizaciones abiertas',
            value: openQuotes,
            hint: 'Borradores y enviadas por responder',
            icon: FileText,
          },
          {
            href: '/clientes',
            label: 'Clientes activos',
            value: activeClients,
            hint: 'Cuentas con actividad comercial',
            icon: Users,
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200/70">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {item.label}
                </span>
                <span className="mt-1 flex items-baseline gap-2">
                  <span className="font-heading text-xl font-bold leading-none text-slate-900">
                    {item.value}
                  </span>
                  <span className="truncate text-[10px] text-slate-400">{item.hint}</span>
                </span>
              </span>
              <ArrowUpRight
                className="size-4 shrink-0 text-slate-300 transition group-hover:text-slate-500"
                aria-hidden="true"
              />
            </Link>
          )
        })}
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
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 transition hover:text-blue-700"
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
                <Link href="/productos/nuevo" className="text-xs font-semibold text-blue-600">
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
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-100">
                        <CategoryGlyph label={category.label} className="size-3.5" />
                      </span>
                      <span className="truncate text-xs font-semibold text-slate-700">
                        {category.label}
                      </span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                        {category.count}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10.5px] font-medium text-slate-400">
                      {formatNumber(category.units)} uds.
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
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
                background: `conic-gradient(#059669 0% ${publishedPct}%, #94A3B8 ${publishedPct}% ${draftPct}%, #F59E0B ${draftPct}% 100%)`,
              }}
              role="img"
              aria-label={`${published.length} publicados, ${drafts.length} en borrador, ${archived.length} archivados`}
            >
              <div className="absolute inset-[18px] grid place-items-center rounded-full bg-white text-center shadow-inner">
                <div>
                  <p className="font-heading text-2xl font-bold leading-none text-slate-900">
                    {products.length}
                  </p>
                  <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
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
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className={cn('size-2 rounded-full', row.dot)} />
                    {row.label}
                  </span>
                  <span className="font-bold tabular-nums text-slate-900">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
            <p className="text-[10.5px] text-slate-500">
              <span className="font-bold text-slate-900">{lowStock.length}</span>{' '}
              {lowStock.length === 1 ? 'producto requiere' : 'productos requieren'} reposición
            </p>
            <Link
              href="/productos?stock=low"
              className="text-[10.5px] font-semibold text-blue-600 transition hover:text-blue-700"
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
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 transition hover:text-blue-700"
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
            <ul className="divide-y divide-slate-100">
              {lowStock.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/productos/${product.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50/80 sm:px-6"
                  >
                    <ProductThumb src={product.image} alt={product.name} className="size-10 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                        {product.sku} · mínimo {product.minStock}
                      </p>
                    </div>
                    <StockBadge stock={product.stock} minStock={product.minStock} compact />
                    <ArrowUpRight className="size-4 shrink-0 text-slate-300" aria-hidden="true" />
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
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 transition hover:text-blue-700"
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
                      <p className="line-clamp-1 text-[11.5px] font-semibold text-slate-800">
                        {entry.productName}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
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
                        className="flex items-center gap-3 rounded-lg transition hover:text-blue-600"
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
