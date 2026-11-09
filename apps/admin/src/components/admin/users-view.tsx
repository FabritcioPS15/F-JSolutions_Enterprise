'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  KeyRound,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserRound,
  UserX,
  Users,
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
  SectionCard,
  Select,
  StatCard,
  StatusToggle,
  btnPrimary,
  btnSecondary,
  inputClass,
  tableClass,
  tableHeadRowClass,
} from '@/components/admin/ui'
import { usersDataset } from '@/lib/admin/excel-exports'
import { formatDate, formatDateTime, formatNumber } from '@/lib/admin/format'
import { PASSWORD_HINT, passwordProblem } from '@/lib/auth/password'
import { isEmail } from '@fj-solutions/contracts/domain'
import { permissionActionLabels, permissionModules, rolePermissions, roleSummary } from '@/lib/admin/permissions'
import {
  roleLabels,
  userInitials,
  userStatusClasses,
  userStatusLabels,
} from '@/lib/admin/operations'
import type { AdminUser, AdminUserInput, AdminUserRole, AdminUserStatus } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const roleOrder: AdminUserRole[] = ['superadmin', 'admin', 'ventas', 'soporte', 'consulta']
const userStatusOrder: AdminUserStatus[] = ['active', 'invited', 'disabled']

type UserDraft = {
  name: string
  email: string
  phone: string
  role: AdminUserRole
  status: AdminUserStatus
  twoFactorEnabled: boolean
  password: string
}

type UserErrors = Partial<Record<keyof UserDraft, string>>

const emptyDraft: UserDraft = {
  name: '',
  email: '',
  phone: '',
  role: 'ventas',
  status: 'invited',
  twoFactorEnabled: false,
  password: '',
}

function toDraft(user: AdminUser): UserDraft {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    twoFactorEnabled: user.twoFactorEnabled,
    password: '',
  }
}

function StatusChip({ status }: { status: AdminUserStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        userStatusClasses[status]
      )}
    >
      {userStatusLabels[status]}
    </span>
  )
}

export function UsersView() {
  const {
    hydrated,
    users,
    usersReady,
    access,
    createUser,
    updateUser,
    removeUser,
    setUserStatus,
  } = useAdmin()
  const toast = useToast()
  // Solo el superadministrador registra cuentas; el resto puede consultarlas.
  const canManage = access.role === 'superadmin'

  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'all' | AdminUserRole>('all')
  const [status, setStatus] = useState<'all' | AdminUserStatus>('all')
  const [editing, setEditing] = useState<AdminUser | 'new' | null>(null)
  const [draft, setDraft] = useState<UserDraft>(emptyDraft)
  const [errors, setErrors] = useState<UserErrors>({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [permissionsTarget, setPermissionsTarget] = useState<AdminUser | null>(null)

  useEffect(() => {
    if (editing === 'new') {
      setDraft(emptyDraft)
      setErrors({})
      return
    }
    if (editing) {
      setDraft(toDraft(editing))
      setErrors({})
    }
  }, [editing])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return users
      .filter((user) => {
        const matchesTerm =
          !term ||
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.phone.toLowerCase().includes(term)
        const matchesRole = role === 'all' || user.role === role
        const matchesStatus = status === 'all' || user.status === status
        return matchesTerm && matchesRole && matchesStatus
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [users, query, role, status])

  const activeCount = users.filter((user) => user.status === 'active').length
  const twoFactorCount = users.filter((user) => user.twoFactorEnabled).length
  const invitedCount = users.filter((user) => user.status === 'invited').length
  const disabledCount = users.filter((user) => user.status === 'disabled').length

  // El panel no puede quedarse sin un superadministrador con acceso.
  const activeSuperadmins = users.filter(
    (user) => user.role === 'superadmin' && user.status === 'active'
  ).length

  const matrix = useMemo(
    () =>
      permissionModules.map((module) => ({
        module,
        grants: roleOrder.map(
          (currentRole) =>
            new Set(rolePermissions[currentRole].filter((key) => key.startsWith(`${module.key}.`)))
        ),
      })),
    []
  )

  function update<K extends keyof UserDraft>(key: K, value: UserDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function resetFilters() {
    setQuery('')
    setRole('all')
    setStatus('all')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = draft.email.trim().toLowerCase()
    const editingId = editing === 'new' || editing === null ? null : editing.id
    const nextErrors: UserErrors = {}
    if (draft.name.trim().length < 3) nextErrors.name = 'Escribe el nombre completo del usuario.'
    if (!isEmail(email)) nextErrors.email = 'Escribe un correo válido.'
    else if (users.some((user) => user.id !== editingId && user.email.toLowerCase() === email)) {
      nextErrors.email = 'Ya existe un usuario con este correo.'
    }
    if (editing === 'new' || draft.password) {
      const problem = passwordProblem(draft.password)
      if (problem) nextErrors.password = problem
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Revisa los datos', 'Hay campos del usuario sin completar correctamente.')
      return
    }

    const input: AdminUserInput = {
      name: draft.name.trim(),
      email,
      phone: draft.phone.trim(),
      role: draft.role,
      status: draft.status,
      twoFactorEnabled: draft.twoFactorEnabled,
    }

    setSaving(true)
    try {
      if (editing === 'new') {
        await createUser({ ...input, password: draft.password })
        toast.success(
          input.status === 'invited' ? 'Invitación registrada' : 'Usuario creado',
          input.name
        )
      } else if (editing) {
        await updateUser(editing.id, {
          ...input,
          password: draft.password || undefined,
        })
        toast.success('Usuario actualizado', input.name)
      }
      setEditing(null)
    } catch (error) {
      toast.error(
        'No se pudo guardar',
        error instanceof Error ? error.message : 'Revisa la conexión con el servidor.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(user: AdminUser) {
    if (user.status === 'active') {
      if (user.role === 'superadmin' && activeSuperadmins <= 1) {
        toast.error('No se puede desactivar', 'Debe quedar al menos un superadministrador activo.')
        return
      }
      try {
        await setUserStatus(user.id, 'disabled')
        toast.info('Acceso desactivado', user.name)
      } catch (error) {
        toast.error(
          'No se pudo desactivar',
          error instanceof Error ? error.message : 'Revisa la conexión con el servidor.'
        )
      }
      return
    }

    try {
      const updated = await setUserStatus(user.id, 'active')
      toast.success('Acceso habilitado', `${updated.name} · ${roleLabels[updated.role]}`)
    } catch (error) {
      toast.error(
        'No se pudo activar',
        error instanceof Error ? error.message : 'Revisa la conexión con el servidor.'
      )
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    if (deleteTarget.role === 'superadmin' && activeSuperadmins <= 1) {
      toast.error('No se puede eliminar', 'Debe quedar al menos un superadministrador activo.')
      setDeleteTarget(null)
      return
    }
    try {
      await removeUser(deleteTarget.id)
      toast.success('Usuario eliminado', deleteTarget.name)
      setDeleteTarget(null)
    } catch (error) {
      toast.error(
        'No se pudo eliminar',
        error instanceof Error ? error.message : 'Revisa la conexión con el servidor.'
      )
    }
  }

  if (!hydrated || !usersReady) {
    return <LoadingState label="Cargando usuarios…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Administración"
        title="Usuarios y permisos"
        description="Cuentas con acceso al panel, su rol y lo que cada rol puede hacer dentro de FJ Systems. No hay registro público: solo el superadministrador crea usuarios."
        actions={
          <>
            <ExportMenu
              build={() => usersDataset(filtered)}
              nouns={['usuario', 'usuarios']}
              disabled={filtered.length === 0}
            />
            {canManage && (
              <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
                <Plus className="size-4" aria-hidden="true" />
                Registrar usuario
              </button>
            )}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Usuarios"
          value={formatNumber(users.length)}
          helper={activeCount === 1 ? '1 con acceso activo' : `${formatNumber(activeCount)} con acceso activo`}
          icon={Users}
        />
        <StatCard
          label="Con doble factor"
          value={formatNumber(twoFactorCount)}
          helper={
            users.length - twoFactorCount === 0
              ? 'Todas las cuentas protegidas'
              : `${formatNumber(users.length - twoFactorCount)} sin proteger`
          }
          icon={ShieldCheck}
        />
        <StatCard
          label="Invitados"
          value={formatNumber(invitedCount)}
          helper="Aún no aceptan su invitación"
          icon={KeyRound}
        />
        <StatCard
          label="Desactivados"
          value={formatNumber(disabledCount)}
          helper="Cuentas sin acceso al panel"
          icon={UserX}
        />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-0 lg:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, correo o teléfono…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar usuarios"
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
              label="Rol"
              value={role}
              onChange={(next) => setRole(next as 'all' | AdminUserRole)}
              ariaLabel="Filtrar por rol"
              align="right"
              className="sm:w-full lg:w-52"
              options={[
                { value: 'all', label: 'Todos los roles', count: users.length },
                ...roleOrder.map((item) => ({
                  value: item,
                  label: roleLabels[item],
                  count: users.filter((user) => user.role === item).length,
                })),
              ]}
            />
            <FilterSelect
              label="Estado"
              value={status}
              onChange={(next) => setStatus(next as 'all' | AdminUserStatus)}
              ariaLabel="Filtrar por estado"
              align="right"
              className="sm:w-full lg:w-44"
              options={[
                { value: 'all', label: 'Todos', count: users.length },
                ...userStatusOrder.map((item) => ({
                  value: item,
                  label: userStatusLabels[item],
                  count: users.filter((user) => user.status === item).length,
                })),
              ]}
            />
            {(query || role !== 'all' || status !== 'all') && (
              <button type="button" className={btnSecondary} onClick={resetFilters}>
                Limpiar
              </button>
            )}
          </div>
        </div>

        <p className="mt-3 text-[11px] font-medium text-slate-500">
          {filtered.length === users.length
            ? `${formatNumber(users.length)} cuentas registradas`
            : `${formatNumber(filtered.length)} de ${formatNumber(users.length)} cuentas`}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Users}
              title="Sin resultados"
              description="Ningún usuario coincide con la búsqueda o los filtros aplicados."
              action={
                <button type="button" className={btnSecondary} onClick={resetFilters}>
                  Limpiar filtros
                </button>
              }
            />
          </div>
        ) : (
          <div className="mt-4 -mx-4 overflow-x-auto px-4">
            <table className={tableClass}>
              <thead>
                <tr className={tableHeadRowClass}>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Doble factor
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Último acceso
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em]">
                    Alta
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#F5F3FF] font-heading text-[12px] font-bold text-[#5B21B6]">
                          {userInitials(user)}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[13px] font-semibold text-slate-900">
                              {user.name}
                            </p>
                            {user.seeded && (
                              <span className="shrink-0 rounded-full bg-[#F5F3FF] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#5B21B6]">
                                Cuenta base
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[11.5px] text-slate-500">{user.email}</p>
                          {user.phone && (
                            <p className="truncate text-[11px] text-slate-400">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12.5px] font-semibold text-slate-800">
                        {roleLabels[user.role]}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatNumber(roleSummary(user.role))} permisos
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={user.status} />
                    </td>
                    <td className="px-4 py-3">
                      {user.twoFactorEnabled ? (
                        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-600">
                          <ShieldCheck className="size-3.5" aria-hidden="true" />
                          Activo
                        </span>
                      ) : (
                        <span className="text-[11.5px] font-medium text-slate-400">Desactivado</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-slate-600">
                      {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Nunca ingresó'}
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-slate-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        label={`Acciones para ${user.name}`}
                        title={user.name}
                        items={[
                          {
                            key: 'permissions',
                            label: 'Ver permisos',
                            icon: ShieldCheck,
                            onSelect: () => setPermissionsTarget(user),
                          },
                          ...(canManage && !user.seeded
                            ? [
                                {
                                  key: 'status',
                                  label:
                                    user.status === 'active'
                                      ? 'Desactivar acceso'
                                      : 'Activar acceso',
                                  icon: user.status === 'active' ? UserX : UserCheck,
                                  onSelect: () => void toggleStatus(user),
                                },
                                {
                                  key: 'edit',
                                  label: 'Editar usuario',
                                  icon: Pencil,
                                  onSelect: () => setEditing(user),
                                },
                                {
                                  key: 'delete',
                                  label: 'Eliminar usuario',
                                  icon: Trash2,
                                  tone: 'danger' as const,
                                  onSelect: () => setDeleteTarget(user),
                                },
                              ]
                            : []),
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SectionCard
        title="Matriz de roles y permisos"
        description="Es la referencia que sigue el panel para mostrar u ocultar acciones. Los cambios se aplican asignando el rol a cada usuario."
        icon={KeyRound}
      >
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2.5 pr-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Módulo
                </th>
                {roleOrder.map((item) => (
                  <th key={item} className="py-2.5 px-2 align-bottom">
                    <p className="text-[11.5px] font-bold text-slate-800">{roleLabels[item]}</p>
                    <p className="text-[10px] font-medium text-slate-400">
                      {formatNumber(roleSummary(item))} permisos
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map(({ module, grants }) => (
                <tr key={module.key}>
                  <td className="py-2.5 pr-3">
                    <p className="text-[12.5px] font-semibold text-slate-900">{module.label}</p>
                    <p className="font-mono text-[10px] text-slate-400">{module.key}</p>
                  </td>
                  {grants.map((granted, index) => {
                    const roleKey = roleOrder[index]
                    return (
                      <td key={roleKey} className="py-2.5 px-2 align-top">
                        {module.actions.every((action) => granted.has(`${module.key}.${action}`)) ? (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            Todos
                          </span>
                        ) : granted.size === 0 ? (
                          <span className="text-[11px] text-slate-300">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {[...granted].map((key) => (
                              <span
                                key={key}
                                className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600"
                              >
                                {permissionActionLabels[key.split('.')[1]] ?? key.split('.')[1]}
                              </span>
                            ))}
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

      <Modal
        open={permissionsTarget !== null}
        onClose={() => setPermissionsTarget(null)}
        title={permissionsTarget ? permissionsTarget.name : 'Permisos'}
        description={
          permissionsTarget
            ? `${roleLabels[permissionsTarget.role]} · ${formatNumber(
                roleSummary(permissionsTarget.role)
              )} permisos concedidos`
            : ''
        }
        size="lg"
        footer={
          <button type="button" className={btnSecondary} onClick={() => setPermissionsTarget(null)}>
            Cerrar
          </button>
        }
      >
        {permissionsTarget && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip status={permissionsTarget.status} />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-semibold text-slate-600">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                {permissionsTarget.twoFactorEnabled ? 'Doble factor activo' : 'Sin doble factor'}
              </span>
              <span className="text-[11px] text-slate-500">{permissionsTarget.email}</span>
            </div>

            <div className="space-y-2.5">
              {permissionModules
                .filter((module) =>
                  module.actions.some((action) =>
                    rolePermissions[permissionsTarget.role].includes(`${module.key}.${action}`)
                  )
                )
                .map((module) => (
                  <div
                    key={module.key}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-slate-900">{module.label}</p>
                      <p className="font-mono text-[10px] text-slate-400">{module.key}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {module.actions
                        .filter((action) =>
                          rolePermissions[permissionsTarget.role].includes(`${module.key}.${action}`)
                        )
                        .map((action) => (
                          <span
                            key={action}
                            className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#5B21B6] ring-1 ring-inset ring-[#DDD6FE]"
                          >
                            {permissionActionLabels[action] ?? action}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Registrar usuario' : 'Editar usuario'}
        description={
          editing === 'new'
            ? 'Solo el superadministrador crea cuentas. Define la contraseña inicial y compártela por un canal seguro.'
            : 'El rol define qué puede ver y modificar dentro del panel.'
        }
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setEditing(null)}>
              Cancelar
            </button>
            <button type="submit" form="user-form" className={btnPrimary} disabled={saving}>
              {saving
                ? 'Guardando…'
                : editing === 'new'
                  ? 'Crear usuario'
                  : 'Guardar cambios'}
            </button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre completo" htmlFor="user-name" required error={errors.name}>
            <input
              id="user-name"
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
              className={inputClass}
              placeholder="Nombres y apellidos"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Correo corporativo"
              htmlFor="user-email"
              required
              error={errors.email}
              hint="Será su usuario de acceso al panel."
            >
              <input
                id="user-email"
                type="email"
                value={draft.email}
                onChange={(event) => update('email', event.target.value)}
                className={inputClass}
                placeholder="nombre@fjsolutions.com.pe"
              />
            </Field>
            <Field label="Teléfono" htmlFor="user-phone">
              <input
                id="user-phone"
                value={draft.phone}
                onChange={(event) => update('phone', event.target.value)}
                className={inputClass}
                placeholder="+51 900 000 000"
              />
            </Field>
          </div>

          <Field
            label={editing === 'new' ? 'Contraseña inicial' : 'Nueva contraseña'}
            htmlFor="user-password"
            required={editing === 'new'}
            error={errors.password}
            hint={
              editing === 'new'
                ? PASSWORD_HINT
                : 'Déjala vacía para conservar la contraseña actual.'
            }
          >
            <input
              id="user-password"
              type="password"
              autoComplete="new-password"
              value={draft.password}
              onChange={(event) => update('password', event.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rol" htmlFor="user-role" required>
              <Select
                id="user-role"
                value={draft.role}
                onChange={(event) => update('role', event.target.value as AdminUserRole)}
              >
                {roleOrder.map((item) => (
                  <option key={item} value={item}>
                    {roleLabels[item]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Estado" htmlFor="user-status" required>
              <Select
                id="user-status"
                value={draft.status}
                onChange={(event) => update('status', event.target.value as AdminUserStatus)}
              >
                {userStatusOrder.map((item) => (
                  <option key={item} value={item}>
                    {userStatusLabels[item]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-slate-900">Doble factor</p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Se guarda como preferencia de la cuenta. El segundo factor todavía no se exige en
                el acceso local.
              </p>
            </div>
            <StatusToggle
              active={draft.twoFactorEnabled}
              onToggle={() => update('twoFactorEnabled', !draft.twoFactorEnabled)}
              label="Activar doble factor"
            />
          </div>

          <div className="rounded-xl border border-slate-100 bg-[#F5F3FF] px-3 py-2.5">
            <p className="flex items-center gap-2 text-[11.5px] font-semibold text-[#5B21B6]">
              <UserRound className="size-3.5" aria-hidden="true" />
              {roleLabels[draft.role]} · {formatNumber(roleSummary(draft.role))} permisos
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#6D28D9]/80">
              {draft.status === 'invited'
                ? 'La cuenta queda como invitada hasta que la persona ingrese por primera vez.'
                : draft.status === 'disabled'
                  ? 'Esta cuenta no podrá ingresar hasta que la actives.'
                  : 'Puedes revisar el detalle de la matriz de permisos de esta sección.'}
            </p>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar usuario"
        description={
          deleteTarget
            ? `Se eliminará el acceso de “${deleteTarget.name}” (${roleLabels[deleteTarget.role]}). Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
