'use client'

import { useMemo, useState, type FormEvent } from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleSlash,
  ClipboardList,
  Gauge,
  History,
  Layers,
  PackagePlus,
  Plus,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  TriangleAlert,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { ExportMenu } from '@/components/admin/export-menu'
import { Modal } from '@/components/admin/modal'
import { ProductThumb } from '@/components/admin/product-thumb'
import { PurchasingPanel } from '@/components/admin/purchasing-panel'
import { StockCountPanel } from '@/components/admin/stock-count-panel'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  FilterSelect,
  PageHeader,
  Select,
  StatCard,
  StockBadge,
  btnPrimary,
  btnSecondary,
  iconButton,
  inputClass,
  tableClass,
  tableHeadRowClass,
  textareaClass,
} from '@/components/admin/ui'
import { inventoryDataset } from '@/lib/admin/excel-exports'
import {
  buildStockPositions,
  formatCurrency,
  formatDateTime,
  formatNumber,
  getStockState,
  inventoryMovementDescriptions,
  inventoryMovementLabels,
  inventoryReasons,
  locationKindLabels,
  movementDelta,
  movementSourceLabels,
  stockLabels,
} from '@/lib/admin/format'
import type {
  AdminProduct,
  Currency,
  InventoryMovement,
  InventoryMovementType,
  StockPosition,
  StockState,
} from '@/lib/admin/types'
import { cn } from '@/lib/utils'

type Tab = 'stock' | 'movements' | 'purchase' | 'counts'
type StockFilter = 'all' | StockState | 'replenish'
type MovementFilter = 'all' | InventoryMovementType
type SortKey =
  | 'risk'
  | 'name'
  | 'onHand'
  | 'available'
  | 'committed'
  | 'cover'
  | 'valuationCost'
  | 'suggested'

const stockRank: Record<StockState | 'replenish', number> = {
  out: 0,
  low: 1,
  over: 2,
  ok: 3,
  replenish: 0,
}

const PAGE_SIZES = [25, 50, 100] as const

const sortComparators: Record<SortKey, (a: StockPosition, b: StockPosition) => number> = {
  risk: (a, b) => stockRank[a.state] - stockRank[b.state] || a.name.localeCompare(b.name, 'es'),
  name: (a, b) => a.name.localeCompare(b.name, 'es'),
  onHand: (a, b) => b.onHand - a.onHand,
  available: (a, b) => b.available - a.available,
  committed: (a, b) => b.committed - a.committed,
  cover: (a, b) => (a.daysOfCover ?? Number.POSITIVE_INFINITY) - (b.daysOfCover ?? Number.POSITIVE_INFINITY),
  valuationCost: (a, b) => b.valuationCost - a.valuationCost,
  suggested: (a, b) => b.suggestedOrderQuantity - a.suggestedOrderQuantity,
}

const columnLabels: Record<SortKey, string> = {
  risk: 'Riesgo',
  name: 'Producto',
  onHand: 'Existencias',
  available: 'Disponible',
  committed: 'Comprometido',
  cover: 'Cobertura',
  valuationCost: 'Valor en costo',
  suggested: 'Sugerido',
}

const typeStyles: Record<InventoryMovementType, string> = {
  in: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  out: 'bg-red-50 text-red-700 ring-red-600/15',
  adjustment: 'bg-[#F5F3FF] text-[#5B21B6] ring-[#A78BFA]/40',
}

const typeIcons: Record<InventoryMovementType, LucideIcon> = {
  in: ArrowDownToLine,
  out: ArrowUpFromLine,
  adjustment: SlidersHorizontal,
}

function MovementTypeBadge({ type }: { type: InventoryMovementType }) {
  const Icon = typeIcons[type]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        typeStyles[type]
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {inventoryMovementLabels[type]}
    </span>
  )
}

function DeltaChip({ value }: { value: number }) {
  return (
    <span
      className={cn(
        'inline-flex min-w-9 items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums',
        value > 0
          ? 'bg-emerald-50 text-emerald-700'
          : value < 0
            ? 'bg-red-50 text-red-700'
            : 'bg-slate-100 text-slate-500'
      )}
    >
      {value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : '0'}
    </span>
  )
}

export function InventoryView() {
  const {
    products,
    inventoryMovements,
    orders,
    warehouseLocations,
    settings,
    inventoryError,
    refreshInventory,
    can,
    createPurchaseRequest,
    updateProduct,
  } = useAdmin()
  const [tab, setTab] = useState<Tab>('stock')
  const [query, setQuery] = useState('')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [brandFilter, setBrandFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('risk')
  const [sortDesc, setSortDesc] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(25)
  const [selected, setSelected] = useState<string[]>([])
  const [bulkLocation, setBulkLocation] = useState('')
  const [movementFilter, setMovementFilter] = useState<MovementFilter>('all')
  const [movementSourceFilter, setMovementSourceFilter] = useState('all')
  const [movementFrom, setMovementFrom] = useState('')
  const [movementTo, setMovementTo] = useState('')
  const [movementLimit, setMovementLimit] = useState(60)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [prefillProductId, setPrefillProductId] = useState<string | undefined>()
  const [historyProductId, setHistoryProductId] = useState<string | null>(null)

  const canWrite = can('inventory', 'manage')

  const categories = useMemo(() => {
    const names = new Set(products.map((product) => product.category).filter(Boolean))
    return [...names].sort((a, b) => a.localeCompare(b, 'es'))
  }, [products])

  const brands = useMemo(() => {
    const names = new Set(products.map((product) => product.brand).filter(Boolean))
    return [...names].sort((a, b) => a.localeCompare(b, 'es'))
  }, [products])

  const positions = useMemo(
    () => buildStockPositions({ products, orders, movements: inventoryMovements }),
    [products, orders, inventoryMovements]
  )

  const positionById = useMemo(
    () => new Map(positions.map((position) => [position.productId, position])),
    [positions]
  )

  const locationById = useMemo(
    () => new Map(warehouseLocations.map((location) => [location.id, location])),
    [warehouseLocations]
  )

  const totals = useMemo(() => {
    let units = 0
    let cost = 0
    let retail = 0
    let committed = 0
    let low = 0
    let out = 0
    let over = 0
    let replenishValue = 0
    let coverDays = 0
    let coverCount = 0
    positions.forEach((position) => {
      units += position.onHand
      cost += position.valuationCost
      retail += position.valuationRetail
      committed += position.committed
      if (position.state === 'low') low += 1
      if (position.state === 'out') out += 1
      if (position.state === 'over') over += 1
      if (position.suggestedOrderQuantity > 0) {
        replenishValue += position.suggestedOrderQuantity * position.unitCost
      }
      if (position.daysOfCover !== null) {
        coverDays += position.daysOfCover
        coverCount += 1
      }
    })
    const atRisk = low + out
    return {
      units,
      cost,
      retail,
      margin: retail > 0 ? ((retail - cost) / retail) * 100 : 0,
      committed,
      atRisk,
      over,
      replenishValue,
      coverDays: coverCount > 0 ? Math.round(coverDays / coverCount) : null,
      immobilizedPct: cost > 0 ? (over === 0 ? 0 : 0) : 0,
    }
  }, [positions])

  const lastMovementByProduct = useMemo(() => {
    const map = new Map<string, InventoryMovement>()
    inventoryMovements.forEach((movement) => {
      const current = map.get(movement.productId)
      if (
        !current ||
        new Date(movement.createdAt).getTime() > new Date(current.createdAt).getTime()
      ) {
        map.set(movement.productId, movement)
      }
    })
    return map
  }, [inventoryMovements])

  const term = query.trim().toLowerCase()

  const stockRows = useMemo(() => {
    return products
      .filter((product) => {
        const matchesTerm =
          !term ||
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term) ||
          (product.internalCode ?? '').toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term)
        const matchesStock =
          stockFilter === 'all' || getStockState(product) === stockFilter
        const matchesCategory =
          categoryFilter === 'all' || product.category === categoryFilter
        return matchesTerm && matchesStock && matchesCategory
      })
      .sort((a, b) => {
        const rank = stockRank[getStockState(a)] - stockRank[getStockState(b)]
        return rank !== 0 ? rank : a.name.localeCompare(b.name, 'es')
      })
  }, [products, term, stockFilter, categoryFilter])

  const movementRows = useMemo(() => {
    return inventoryMovements
      .filter((movement) => {
        const matchesType = movementFilter === 'all' || movement.type === movementFilter
        const matchesTerm =
          !term ||
          movement.productName.toLowerCase().includes(term) ||
          movement.sku.toLowerCase().includes(term) ||
          movement.reason.toLowerCase().includes(term) ||
          (movement.note ?? '').toLowerCase().includes(term)
        return matchesType && matchesTerm
      })
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }, [inventoryMovements, movementFilter, term])

  const visibleMovements = movementRows.slice(0, movementLimit)
  const historyProduct = products.find((product) => product.id === historyProductId) ?? null

  function openRegister(productId?: string) {
    setPrefillProductId(productId)
    setRegisterOpen(true)
  }

  function changeTab(next: Tab) {
    setTab(next)
    setQuery('')
    setMovementLimit(60)
  }

  const tabs: { value: Tab; label: string; count: number }[] = [
    { value: 'stock', label: 'Existencias', count: products.length },
    { value: 'movements', label: 'Movimientos', count: inventoryMovements.length },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Operaciones"
        title="Inventario"
        description="Controla las existencias del catálogo y consulta el historial de cada movimiento."
        actions={
          <>
            <ExportMenu
              build={() => inventoryDataset(products, inventoryMovements, settings.currency)}
              nouns={['producto', 'productos']}
              disabled={products.length === 0}
            />
            <button
              type="button"
              className={btnPrimary}
              onClick={() => openRegister()}
              disabled={products.length === 0}
            >
              <Plus className="size-4" aria-hidden="true" />
              Registrar movimiento
            </button>
          </>
        }
      />

      {inventoryError ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
          <span>
            El historial de inventario no está sincronizado con la base de datos.{' '}
            {inventoryError}
          </span>
          <button
            type="button"
            className="font-semibold underline underline-offset-2 hover:text-amber-950"
            onClick={() => {
              void refreshInventory().catch(() => undefined)
            }}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Unidades en stock"
          value={formatNumber(totals.units)}
          helper={`${products.length} ${products.length === 1 ? 'producto registrado' : 'productos registrados'}`}
          icon={Boxes}
        />
        <StatCard
          label="Valor del inventario"
          value={formatCurrency(totals.value, settings.currency)}
          helper="Calculado con el costo unitario"
          icon={Wallet}
        />
        <StatCard
          label="Stock bajo"
          value={formatNumber(totals.low)}
          helper="Con unidades en o bajo el mínimo"
          icon={TriangleAlert}
          href="/productos?stock=low"
        />
        <StatCard
          label="Sin stock"
          value={formatNumber(totals.out)}
          helper="Requieren reposición inmediata"
          icon={CircleSlash}
          href="/productos?stock=out"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="inline-flex w-full shrink-0 rounded-xl bg-slate-100 p-1 sm:w-auto">
            {tabs.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => changeTab(item.value)}
                aria-pressed={tab === item.value}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition sm:flex-none',
                  tab === item.value
                    ? 'bg-white text-[#5B21B6] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                    tab === item.value
                      ? 'bg-[#EDE9FE] text-[#5B21B6]'
                      : 'bg-slate-200/70 text-slate-500'
                  )}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center xl:justify-end">
            <div className="relative w-full min-w-0 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setMovementLimit(60)
                }}
                placeholder={
                  tab === 'stock'
                    ? 'Buscar producto, SKU o categoría…'
                    : 'Buscar producto, motivo o nota…'
                }
                className={cn(inputClass, 'pl-9 pr-9')}
                aria-label={tab === 'stock' ? 'Buscar en existencias' : 'Buscar movimientos'}
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

            {tab === 'stock' ? (
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <FilterSelect
                  label="Stock"
                  value={stockFilter}
                  onChange={(next) => setStockFilter(next as StockFilter)}
                  ariaLabel="Filtrar por estado de stock"
                  align="right"
                  className="sm:w-40"
                  options={[
                    { value: 'all', label: 'Todos', count: products.length },
                    {
                      value: 'ok',
                      label: 'Disponible',
                      count: products.filter((product) => getStockState(product) === 'ok').length,
                    },
                    {
                      value: 'low',
                      label: 'Stock bajo',
                      count: products.filter((product) => getStockState(product) === 'low').length,
                    },
                    {
                      value: 'out',
                      label: 'Sin stock',
                      count: products.filter((product) => getStockState(product) === 'out').length,
                    },
                  ]}
                />
                <FilterSelect
                  label="Categoría"
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  ariaLabel="Filtrar por categoría"
                  align="right"
                  searchable
                  searchPlaceholder="Buscar categoría…"
                  className="sm:w-48"
                  options={[
                    { value: 'all', label: 'Todas', count: products.length },
                    ...categories.map((category) => ({
                      value: category,
                      label: category,
                      count: products.filter((product) => product.category === category).length,
                    })),
                  ]}
                />
              </div>
            ) : (
              <FilterSelect
                label="Tipo"
                value={movementFilter}
                onChange={(next) => setMovementFilter(next as MovementFilter)}
                ariaLabel="Filtrar por tipo de movimiento"
                align="right"
                className="w-full sm:w-44"
                options={[
                  { value: 'all', label: 'Todos', count: inventoryMovements.length },
                  {
                    value: 'in',
                    label: 'Entradas',
                    count: inventoryMovements.filter((movement) => movement.type === 'in').length,
                  },
                  {
                    value: 'out',
                    label: 'Salidas',
                    count: inventoryMovements.filter((movement) => movement.type === 'out').length,
                  },
                  {
                    value: 'adjustment',
                    label: 'Ajustes',
                    count: inventoryMovements.filter((movement) => movement.type === 'adjustment')
                      .length,
                  },
                ]}
              />
            )}
          </div>
        </div>

        {tab === 'stock' ? (
          stockRows.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                icon={Boxes}
                title="Sin resultados"
                description="No encontramos productos con esos criterios. Ajusta la búsqueda o los filtros."
              />
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-light">
              <table className={tableClass}>
                <thead>
                  <tr className={tableHeadRowClass}>
                    <th className="px-5 py-3 font-bold">Producto</th>
                    <th className="px-4 py-3 font-bold">Categoría</th>
                    <th className="px-4 py-3 font-bold">Stock</th>
                    <th className="px-4 py-3 text-right font-bold">Mínimo</th>
                    <th className="px-4 py-3 text-right font-bold">Costo unit.</th>
                    <th className="px-4 py-3 text-right font-bold">Valor</th>
                    <th className="px-4 py-3 font-bold">Último movimiento</th>
                    <th className="px-5 py-3 text-right font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockRows.map((product) => {
                    const last = lastMovementByProduct.get(product.id)
                    return (
                      <tr key={product.id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <ProductThumb
                              src={product.image}
                              alt={product.name}
                              className="size-10 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate font-semibold text-slate-900">
                                {product.name}
                              </p>
                              <p className="truncate text-[11px] text-slate-400">
                                {product.sku || 'Sin SKU'}
                                {product.brand ? ` · ${product.brand}` : ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12.5px] text-slate-600">
                          {product.category || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <StockBadge stock={product.stock} minStock={product.minStock} />
                        </td>
                        <td className="px-4 py-3 text-right text-[12.5px] tabular-nums text-slate-500">
                          {formatNumber(product.minStock)}
                        </td>
                        <td className="px-4 py-3 text-right text-[12.5px] tabular-nums text-slate-600">
                          {formatCurrency(product.cost ?? 0, settings.currency)}
                        </td>
                        <td className="px-4 py-3 text-right text-[12.5px] font-semibold tabular-nums text-slate-800">
                          {formatCurrency(
                            Math.max(0, product.stock) * (product.cost ?? 0),
                            settings.currency
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {last ? (
                            <div className="space-y-1">
                              <p className="text-[12px] text-slate-600">
                                {formatDateTime(last.createdAt)}
                              </p>
                              <MovementTypeBadge type={last.type} />
                            </div>
                          ) : (
                            <span className="text-[12px] text-slate-400">Sin movimientos</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openRegister(product.id)}
                              className={iconButton}
                              aria-label={`Registrar movimiento para ${product.name}`}
                              title="Registrar movimiento"
                            >
                              <Plus className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setHistoryProductId(product.id)}
                              className={iconButton}
                              aria-label={`Ver historial de ${product.name}`}
                              title="Ver historial"
                            >
                              <History className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : movementRows.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon={ClipboardList}
              title="Sin movimientos"
              description="Registra tu primera entrada, salida o ajuste para empezar el historial del inventario."
              action={
                products.length > 0 ? (
                  <button type="button" className={btnPrimary} onClick={() => openRegister()}>
                    <Plus className="size-4" aria-hidden="true" />
                    Registrar movimiento
                  </button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto scrollbar-light">
              <table className={tableClass}>
                <thead>
                  <tr className={tableHeadRowClass}>
                    <th className="px-5 py-3 font-bold">Fecha</th>
                    <th className="px-4 py-3 font-bold">Producto</th>
                    <th className="px-4 py-3 font-bold">Tipo</th>
                    <th className="px-4 py-3 text-right font-bold">Variación</th>
                    <th className="px-4 py-3 text-center font-bold">Stock</th>
                    <th className="px-4 py-3 font-bold">Motivo</th>
                    <th className="px-5 py-3 font-bold">Nota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleMovements.map((movement) => (
                    <tr key={movement.id} className="transition hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-5 py-3 text-[12.5px] text-slate-500">
                        {formatDateTime(movement.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-[240px] truncate font-semibold text-slate-900">
                          {movement.productName}
                        </p>
                        <p className="text-[11px] text-slate-400">{movement.sku || 'Sin SKU'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <MovementTypeBadge type={movement.type} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DeltaChip value={movementDelta(movement)} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center text-[12.5px] tabular-nums text-slate-600">
                        {movement.previousStock}
                        <span className="mx-1.5 text-slate-300">→</span>
                        <strong className="text-slate-900">{movement.resultingStock}</strong>
                      </td>
                      <td className="px-4 py-3 text-[12.5px] text-slate-700">
                        {movement.reason}
                      </td>
                      <td className="px-5 py-3">
                        {movement.note ? (
                          <p
                            className="max-w-[260px] truncate text-[11px] text-slate-500"
                            title={movement.note}
                          >
                            {movement.note}
                          </p>
                        ) : (
                          <span className="text-[11px] text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {movementRows.length > visibleMovements.length && (
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
                <p className="text-[11.5px] text-slate-500">
                  Mostrando {visibleMovements.length} de {movementRows.length} movimientos
                </p>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setMovementLimit((value) => value + 60)}
                >
                  Mostrar más
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {registerOpen && (
        <MovementModal
          products={products}
          currency={settings.currency}
          initialProductId={prefillProductId}
          onClose={() => setRegisterOpen(false)}
        />
      )}

      {historyProduct && (
        <HistoryModal
          product={historyProduct}
          movements={inventoryMovements.filter(
            (movement) => movement.productId === historyProduct.id
          )}
          currency={settings.currency}
          onClose={() => setHistoryProductId(null)}
          onRegister={() => {
            setHistoryProductId(null)
            openRegister(historyProduct.id)
          }}
        />
      )}
    </div>
  )
}

function MovementModal({
  products,
  currency,
  initialProductId,
  onClose,
}: {
  products: AdminProduct[]
  currency: Currency
  initialProductId?: string
  onClose: () => void
}) {
  const { registerMovement } = useAdmin()
  const toast = useToast()
  const [productId, setProductId] = useState(initialProductId ?? products[0]?.id ?? '')
  const [type, setType] = useState<InventoryMovementType>('in')
  const [quantity, setQuantity] = useState('1')
  const [reason, setReason] = useState(inventoryReasons.in[0])
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const product = products.find((item) => item.id === productId)
  const currentStock = product ? Math.max(0, product.stock) : 0
  const parsed = Math.trunc(Number(quantity))
  const hasNumber = Number.isFinite(parsed)

  const resulting = hasNumber
    ? type === 'in'
      ? currentStock + parsed
      : type === 'out'
        ? currentStock - parsed
        : parsed
    : currentStock

  const delta = resulting - currentStock

  function changeType(next: InventoryMovementType) {
    setType(next)
    setReason(inventoryReasons[next][0])
    setQuantity(next === 'adjustment' ? String(currentStock) : '1')
    setError(null)
  }

  function changeProduct(nextId: string) {
    setProductId(nextId)
    setError(null)
    if (type === 'adjustment') {
      const next = products.find((item) => item.id === nextId)
      setQuantity(String(Math.max(0, next?.stock ?? 0)))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const result = await registerMovement({
        productId,
        type,
        quantity: parsed,
        reason,
        note,
      })

      if (!result.ok) {
        setError(result.error ?? 'No se pudo registrar el movimiento.')
        return
      }

      toast.success(
        'Movimiento registrado',
        type === 'adjustment'
          ? `${product?.name ?? 'Producto'} · stock ajustado a ${formatNumber(resulting)} unidades.`
          : `${inventoryMovementLabels[type]} de ${formatNumber(Math.abs(delta))} unidades en ${product?.name ?? 'el producto'}.`
      )
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Registrar movimiento"
      description="Las entradas suman stock, las salidas lo descuentan y los ajustes fijan el conteo real."
      size="lg"
      footer={
        <>
          <button
            type="button"
            className={btnSecondary}
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="movement-form"
            className={btnPrimary}
            disabled={saving}
          >
            {saving ? 'Registrando…' : 'Registrar movimiento'}
          </button>
        </>
      }
    >
      <form id="movement-form" onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-700">Tipo de movimiento</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.keys(inventoryMovementLabels) as InventoryMovementType[]).map((value) => {
              const Icon = typeIcons[value]
              const selected = type === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => changeType(value)}
                  aria-pressed={selected}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition',
                    selected
                      ? 'border-[#5B21B6] bg-[#F5F3FF] ring-4 ring-[#5B21B6]/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 text-[13px] font-bold',
                      selected ? 'text-[#5B21B6]' : 'text-slate-700'
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {inventoryMovementLabels[value]}
                  </span>
                  <span className="text-[11px] leading-snug text-slate-500">
                    {inventoryMovementDescriptions[value]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label htmlFor="movement-product" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Producto
          </label>
          <Select
            id="movement-product"
            value={productId}
            onChange={(event) => changeProduct(event.target.value)}
          >
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.sku ? ` · ${item.sku}` : ''} — {item.stock} uds.
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <label
              htmlFor="movement-quantity"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              {type === 'adjustment' ? 'Stock real contado' : 'Cantidad'}
            </label>
            <input
              id="movement-quantity"
              type="number"
              inputMode="numeric"
              min={type === 'adjustment' ? 0 : 1}
              step={1}
              value={quantity}
              onChange={(event) => {
                setQuantity(event.target.value)
                setError(null)
              }}
              className={inputClass}
            />
            <p className="mt-1.5 text-[11px] text-slate-400">
              Stock actual: <strong className="text-slate-600">{formatNumber(currentStock)}</strong>{' '}
              unidades
            </p>
          </div>

          <div>
            <label
              htmlFor="movement-reason"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Motivo
            </label>
            <Select
              id="movement-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              {inventoryReasons[type].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label
            htmlFor="movement-note"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Nota <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <textarea
            id="movement-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ej. Guía de remisión, proveedor, número de documento…"
            className={textareaClass}
            rows={3}
          />
        </div>

        <div
          className={cn(
            'rounded-xl border p-3.5',
            delta > 0
              ? 'border-emerald-200 bg-emerald-50/60'
              : delta < 0
                ? 'border-red-200 bg-red-50/60'
                : 'border-slate-200 bg-slate-50'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Vista previa del stock
            </p>
            <DeltaChip value={hasNumber ? delta : 0} />
          </div>
          <p className="mt-1.5 font-heading text-lg font-bold text-slate-900">
            {formatNumber(currentStock)}
            <span className="mx-2 text-slate-300">→</span>
            {formatNumber(resulting)}
            <span className="ml-2 text-xs font-medium text-slate-500">unidades</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Valor del stock resultante:{' '}
            {formatCurrency(Math.max(0, resulting) * (product?.cost ?? 0), currency)}
          </p>
          {type === 'out' && hasNumber && parsed > currentStock && (
            <p className="mt-1.5 text-[11px] font-semibold text-red-600">
              No puedes retirar más de {formatNumber(currentStock)} unidades.
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}

function HistoryModal({
  product,
  movements,
  currency,
  onClose,
  onRegister,
}: {
  product: AdminProduct
  movements: InventoryMovement[]
  currency: Currency
  onClose: () => void
  onRegister: () => void
}) {
  const sorted = [...movements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Modal
      open
      onClose={onClose}
      title={`Historial · ${product.name}`}
      description={`SKU ${product.sku || 'sin SKU'} · Stock actual ${product.stock} unidades`}
      size="lg"
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={onClose}>
            Cerrar
          </button>
          <button type="button" className={btnPrimary} onClick={onRegister}>
            <Plus className="size-4" aria-hidden="true" />
            Registrar movimiento
          </button>
        </>
      }
    >
      {sorted.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Sin movimientos registrados"
          description="Este producto todavía no tiene entradas, salidas ni ajustes en el historial."
        />
      ) : (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 px-4 py-3 text-[11.5px] text-slate-600">
            <span>
              Stock actual:{' '}
              <strong className="text-slate-900">{formatNumber(product.stock)}</strong> uds.
            </span>
            <span>
              Mínimo: <strong className="text-slate-900">{formatNumber(product.minStock)}</strong>{' '}
              uds.
            </span>
            <span>
              Valor:{' '}
              <strong className="text-slate-900">
                {formatCurrency(Math.max(0, product.stock) * (product.cost ?? 0), currency)}
              </strong>
            </span>
          </div>

          <ol className="space-y-2.5">
            {sorted.map((movement) => (
              <li
                key={movement.id}
                className="rounded-xl border border-slate-200 bg-white p-3.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <MovementTypeBadge type={movement.type} />
                    <span className="text-[12.5px] font-semibold text-slate-800">
                      {movement.reason}
                    </span>
                  </div>
                  <span className="text-[11.5px] text-slate-400">
                    {formatDateTime(movement.createdAt)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    Cantidad:
                    <DeltaChip value={movementDelta(movement)} />
                  </span>
                  <span className="tabular-nums">
                    {movement.previousStock}
                    <span className="mx-1.5 text-slate-300">→</span>
                    <strong className="text-slate-900">{movement.resultingStock}</strong> uds.
                  </span>
                </div>
                {movement.note && (
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-500">
                    {movement.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </Modal>
  )
}
