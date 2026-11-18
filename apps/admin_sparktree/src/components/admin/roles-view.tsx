'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ChevronRight,
  Filter,
  KeyRound,
  Lock,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import {
  EmptyState,
  PageHeader,
  SectionCard,
  StatCard,
  btnPrimary,
  btnSecondary,
  inputClass,
  tableClass,
  tableHeadRowClass,
} from '@/components/admin/ui'
import {
  permissionActionLabels,
  permissionModules,
  rolePermissions,
  roleSummary,
  type PermissionModule,
} from '@/lib/admin/permissions'
import { formatNumber } from '@/lib/admin/format'
import { roleLabels } from '@/lib/admin/operations'
import type { AdminUserRole } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const selectableRoles: { key: AdminUserRole; description: string; badge: string; color: string }[] = [
  {
    key: 'superadmin',
    description: 'Control total de la infraestructura, usuarios, auditoría, finanzas y configuración avanzada.',
    badge: 'Acceso Total',
    color: 'bg-purple-500/10 text-purple-400 ring-purple-500/30',
  },
  {
    key: 'admin',
    description: 'Gestión operacional diaria, productos, precios, pedidos, clientes y servicios sin acceso a administración de usuarios raíz.',
    badge: 'Gestión Operativa',
    color: 'bg-blue-500/10 text-blue-400 ring-blue-500/30',
  },
  {
    key: 'ventas',
    description: 'Atención comercial, cotizaciones, cartera de clientes y consulta de disponibilidad de stock.',
    badge: 'Comercial',
    color: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
  },
  {
    key: 'soporte',
    description: 'Mesa de ayuda, libro de reclamaciones, seguimiento técnico y resolución de incidencias de clientes.',
    badge: 'Atención Técnica',
    color: 'bg-amber-500/10 text-amber-400 ring-amber-500/30',
  },
  {
    key: 'consulta',
    description: 'Auditoría y revisión analítica con permisos de solo lectura en todos los módulos sin capacidad de edición.',
    badge: 'Solo Lectura',
    color: 'bg-slate-500/10 text-slate-400 ring-slate-500/30',
  },
]

type ModuleCategory = 'all' | 'catalogo' | 'comercial' | 'servicios' | 'atencion' | 'sistema'

const moduleCategories: Record<string, ModuleCategory> = {
  dashboard: 'sistema',
  reports: 'sistema',
  products: 'catalogo',
  attributes: 'catalogo',
  categories: 'catalogo',
  brands: 'catalogo',
  inventory: 'catalogo',
  suppliers: 'catalogo',
  clients: 'comercial',
  quotes: 'comercial',
  orders: 'comercial',
  requests: 'atencion',
  complaints: 'atencion',
  services: 'servicios',
  projects: 'servicios',
  links: 'servicios',
  users: 'sistema',
  roles: 'sistema',
  settings: 'sistema',
  audit: 'sistema',
}

const categoryTabs: { key: ModuleCategory; label: string }[] = [
  { key: 'all', label: 'Todos los módulos' },
  { key: 'catalogo', label: 'Catálogo & Almacén' },
  { key: 'comercial', label: 'Comercial & Ventas' },
  { key: 'servicios', label: 'Servicios TI' },
  { key: 'atencion', label: 'Atención al Cliente' },
  { key: 'sistema', label: 'Sistema & Control' },
]

export function RolesView() {
  const { users } = useAdmin()
  const [selectedRole, setSelectedRole] = useState<AdminUserRole>('superadmin')
  const [categoryFilter, setCategoryFilter] = useState<ModuleCategory>('all')
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards')

  const totalActionsCount = useMemo(() => {
    return permissionModules.reduce((acc, m) => acc + m.actions.length, 0)
  }, [])

  const currentRoleInfo = useMemo(() => {
    return selectableRoles.find((r) => r.key === selectedRole) ?? selectableRoles[0]
  }, [selectedRole])

  const grantedKeysSet = useMemo(() => {
    return new Set(rolePermissions[selectedRole] ?? [])
  }, [selectedRole])

  const usersInCurrentRole = useMemo(() => {
    return users.filter((u) => u.role === selectedRole && u.status === 'active')
  }, [users, selectedRole])

  const filteredModules = useMemo(() => {
    const term = query.trim().toLowerCase()
    return permissionModules.filter((module) => {
      const matchesCategory =
        categoryFilter === 'all' || moduleCategories[module.key] === categoryFilter
      const matchesQuery =
        !term ||
        module.label.toLowerCase().includes(term) ||
        module.key.toLowerCase().includes(term)
      return matchesCategory && matchesQuery
    })
  }, [categoryFilter, query])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sistema"
        title="Roles y permisos"
        description="Auditoría y control de permisos granulares por módulo para cada uno de los roles operativos del panel."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/usuarios"
              className={btnSecondary}
            >
              <Users className="size-4" aria-hidden="true" />
              Ver usuarios asignados
            </Link>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Roles del sistema"
          value={formatNumber(selectableRoles.length)}
          helper="5 perfiles preconfigurados"
          icon={KeyRound}
        />
        <StatCard
          label="Módulos controlados"
          value={formatNumber(permissionModules.length)}
          helper="Con control de acceso granular"
          icon={ShieldCheck}
        />
        <StatCard
          label="Permisos del catálogo"
          value={formatNumber(totalActionsCount)}
          helper="Acciones protegidas por el BFF"
          icon={Shield}
        />
        <StatCard
          label="Usuarios activos"
          value={formatNumber(users.filter((u) => u.status === 'active').length)}
          helper="Con rol asignado y acceso vigente"
          icon={Users}
          href="/usuarios"
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Selecciona un rol para auditar sus permisos
              </p>
              <h2 className="text-sm font-semibold text-foreground">
                {roleLabels[selectedRole]} ({grantedKeysSet.size} de {totalActionsCount} acciones concedidas)
              </h2>
            </div>

            <div className="inline-flex rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  viewMode === 'cards'
                    ? 'bg-card text-brand-ink shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Vista por módulo
              </button>
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  viewMode === 'matrix'
                    ? 'bg-card text-brand-ink shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Matriz global comparativa
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {selectableRoles.map((roleItem) => {
              const active = selectedRole === roleItem.key
              const count = roleSummary(roleItem.key)
              const usersCount = users.filter((u) => u.role === roleItem.key && u.status === 'active').length

              return (
                <button
                  key={roleItem.key}
                  type="button"
                  onClick={() => setSelectedRole(roleItem.key)}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition',
                    active
                      ? 'border-[#2563EB]/40 bg-tint-brand shadow-xs ring-1 ring-[#2563EB]/30'
                      : 'border-border bg-card hover:bg-muted/60'
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-1">
                    <span className="truncate text-xs font-bold text-foreground">
                      {roleLabels[roleItem.key]}
                    </span>
                    <span
                      className={cn(
                        'grid size-4 shrink-0 place-items-center rounded-full text-[9px] font-bold',
                        active ? 'bg-[#2563EB] text-white' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {active ? '✓' : ''}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-medium text-muted-foreground">
                    {count} permisos
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {usersCount} {usersCount === 1 ? 'usuario' : 'usuarios'}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset', currentRoleInfo.color)}>
                  {currentRoleInfo.badge}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {roleLabels[selectedRole]}
                </span>
              </div>
              <p className="mt-1 text-[11.5px] text-muted-foreground">
                {currentRoleInfo.description}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-xs font-bold text-foreground">
                {usersInCurrentRole.length} {usersInCurrentRole.length === 1 ? 'usuario activo' : 'usuarios activos'}
              </span>
              <p className="text-[10.5px] text-muted-foreground">
                {usersInCurrentRole.map((u) => u.name).slice(0, 2).join(', ')}
                {usersInCurrentRole.length > 2 ? ` y ${usersInCurrentRole.length - 2} más` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full min-w-0 lg:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar módulo o acción…"
                className={cn(inputClass, 'pl-9 pr-8 text-xs')}
                aria-label="Buscar módulos"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 grid size-4 -translate-y-1/2 place-items-center text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categoryTabs.map((tab) => {
                const active = categoryFilter === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setCategoryFilter(tab.key)}
                    className={cn(
                      'rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition',
                      active
                        ? 'bg-[#2563EB]/10 text-brand-ink ring-1 ring-[#2563EB]/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((module) => {
              const allModuleActions = module.actions
              const grantedActions = allModuleActions.filter((action) =>
                grantedKeysSet.has(`${module.key}.${action}`)
              )
              const hasFullAccess = grantedActions.length === allModuleActions.length
              const hasNoAccess = grantedActions.length === 0

              return (
                <div
                  key={module.key}
                  className={cn(
                    'flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200',
                    hasNoAccess
                      ? 'border-border/50 bg-card/60 opacity-60'
                      : 'border-border/90 bg-card shadow-xs'
                  )}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-[13px] font-bold text-foreground">
                          {module.label}
                        </h3>
                        <p className="font-mono text-[10.5px] text-muted-foreground">
                          {module.key}
                        </p>
                      </div>

                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset',
                          hasFullAccess
                            ? 'bg-emerald-500/10 text-success-ink ring-emerald-500/20'
                            : hasNoAccess
                              ? 'bg-slate-500/10 text-slate-400 ring-slate-500/20'
                              : 'bg-amber-500/10 text-warning-ink ring-amber-500/20'
                        )}
                      >
                        {hasFullAccess
                          ? 'Total'
                          : hasNoAccess
                            ? 'Bloqueado'
                            : `${grantedActions.length}/${allModuleActions.length}`}
                      </span>
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {allModuleActions.map((action) => {
                        const isGranted = grantedKeysSet.has(`${module.key}.${action}`)
                        return (
                          <span
                            key={action}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-semibold transition',
                              isGranted
                                ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30'
                                : 'bg-muted/70 text-slate-500 ring-1 ring-border/50 line-through opacity-70'
                            )}
                            title={
                              isGranted
                                ? `Acción permitida: ${permissionActionLabels[action] ?? action}`
                                : `Sin permiso para: ${permissionActionLabels[action] ?? action}`
                            }
                          >
                            {isGranted ? (
                              <Check className="size-3 text-emerald-400" aria-hidden="true" />
                            ) : (
                              <Lock className="size-2.5 text-slate-500" aria-hidden="true" />
                            )}
                            {permissionActionLabels[action] ?? action}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border/50 pt-2 text-right">
                    <span className="text-[10px] text-muted-foreground">
                      {hasNoAccess
                        ? 'El rol no ve este módulo en el menú'
                        : `Permite ${grantedActions.length} ${grantedActions.length === 1 ? 'operación' : 'operaciones'}`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <SectionCard
          title="Matriz de permisos comparativa"
          description="Contraste directo de capacidades entre todos los roles para cada módulo del catálogo."
          icon={KeyRound}
        >
          <div className="-mx-4 overflow-x-auto px-4">
            <table className={tableClass}>
              <thead>
                <tr className={tableHeadRowClass}>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Módulo
                  </th>
                  {selectableRoles.map((r) => (
                    <th key={r.key} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                      {roleLabels[r.key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {permissionModules.map((module) => (
                  <tr key={module.key} className="transition hover:bg-muted/70">
                    <td className="px-4 py-3">
                      <p className="text-[12.5px] font-semibold text-foreground">{module.label}</p>
                      <p className="font-mono text-[10.5px] text-muted-foreground">{module.key}</p>
                    </td>
                    {selectableRoles.map((r) => {
                      const grantedInRole = module.actions.filter((action) =>
                        rolePermissions[r.key].includes(`${module.key}.${action}`)
                      )
                      const isFull = grantedInRole.length === module.actions.length
                      const isNone = grantedInRole.length === 0

                      return (
                        <td key={r.key} className="px-4 py-3 align-top">
                          {isFull ? (
                            <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-success-ink ring-1 ring-inset ring-emerald-500/30">
                              Total ({module.actions.length})
                            </span>
                          ) : isNone ? (
                            <span className="text-[11px] font-medium text-slate-500">—</span>
                          ) : (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[11px] font-semibold text-warning-ink">
                                {grantedInRole.length} de {module.actions.length}
                              </span>
                              <span className="text-[9.5px] text-muted-foreground">
                                {grantedInRole.map((a) => permissionActionLabels[a] ?? a).join(', ')}
                              </span>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  )
}
