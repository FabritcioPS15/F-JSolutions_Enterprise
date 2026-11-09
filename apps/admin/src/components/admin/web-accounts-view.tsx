'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Inbox,
  MailCheck,
  RotateCcw,
  Search,
  ShieldBan,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react'
import type {
  CustomerAccountPublic,
  CustomerAccountStatus,
  CustomerProvider,
  OutboxEmail,
} from '@fj-solutions/contracts/customer-accounts'
import { useAdmin } from '@/components/admin/admin-provider'
import { Modal } from '@/components/admin/modal'
import { RowActions } from '@/components/admin/row-actions'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  FilterSelect,
  LoadingState,
  PageHeader,
  StatCard,
  btnSecondary,
  inputClass,
  tableClass,
  tableHeadRowClass,
} from '@/components/admin/ui'
import { formatDateTime, formatNumber } from '@/lib/admin/format'
import { cn } from '@/lib/utils'

const statusLabels: Record<CustomerAccountStatus, string> = {
  pending: 'Pendiente de confirmar',
  active: 'Activa',
  blocked: 'Bloqueada',
}

const statusStyles: Record<CustomerAccountStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  blocked: 'bg-red-50 text-red-700 ring-red-200',
}

const methodLabels: Record<CustomerProvider, string> = {
  password: 'Correo',
  google: 'Google',
  facebook: 'Facebook',
}

type Action = 'verify' | 'resend' | 'block' | 'activate'

export function WebAccountsView() {
  const { can } = useAdmin()
  const toast = useToast()
  const canEdit = can('clients', 'update')

  const [accounts, setAccounts] = useState<CustomerAccountPublic[]>([])
  const [outbox, setOutbox] = useState<OutboxEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | CustomerAccountStatus>('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [outboxOpen, setOutboxOpen] = useState(false)

  const load = useCallback(async () => {
    setError('')
    try {
      const response = await fetch('/api/admin/customers', { cache: 'no-store' })
      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean
            message?: string
            data?: { accounts?: CustomerAccountPublic[]; outbox?: OutboxEmail[] }
          }
        | null

      if (!response.ok || !data?.success) {
        throw new Error(data?.message ?? 'No pudimos cargar las cuentas web.')
      }

      setAccounts(data.data?.accounts ?? [])
      setOutbox(data.data?.outbox ?? [])
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'No pudimos cargar las cuentas web.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const counts = useMemo(() => {
    return {
      all: accounts.length,
      pending: accounts.filter((account) => account.status === 'pending').length,
      active: accounts.filter((account) => account.status === 'active').length,
      blocked: accounts.filter((account) => account.status === 'blocked').length,
      verified: accounts.filter((account) => account.emailVerifiedAt).length,
    }
  }, [accounts])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return accounts.filter((account) => {
      const matchesTerm =
        !term ||
        account.name.toLowerCase().includes(term) ||
        account.email.toLowerCase().includes(term) ||
        account.company.toLowerCase().includes(term) ||
        account.phone.toLowerCase().includes(term)
      const matchesStatus = status === 'all' || account.status === status
      return matchesTerm && matchesStatus
    })
  }, [accounts, query, status])

  const hasFilters = query !== '' || status !== 'all'

  const runAction = async (account: CustomerAccountPublic, action: Action) => {
    setBusyId(account.id)
    try {
      const response = await fetch(`/api/admin/customers/${account.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean
            message?: string
            data?: { delivery?: { delivery: 'outbox' | 'smtp' } }
          }
        | null

      if (!response.ok || !data?.success) {
        throw new Error(data?.message ?? 'No pudimos actualizar la cuenta.')
      }

      if (action === 'verify') {
        toast.success('Correo verificado', `${account.email} ya puede iniciar sesión.`)
      } else if (action === 'resend') {
        const channel = data.data?.delivery?.delivery === 'smtp' ? 'SMTP' : 'la bandeja local'
        toast.success('Confirmación reenviada', `Correo enviado a ${account.email} por ${channel}.`)
      } else if (action === 'block') {
        toast.success('Cuenta bloqueada', `${account.email} ya no puede iniciar sesión.`)
      } else {
        toast.success('Cuenta activada', `${account.email} ya puede iniciar sesión.`)
      }

      await load()
    } catch (actionError) {
      toast.error(
        'No se pudo actualizar la cuenta',
        actionError instanceof Error ? actionError.message : undefined
      )
    } finally {
      setBusyId(null)
    }
  }

  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      toast.info('Enlace copiado', 'Pégalo en el navegador para confirmar la cuenta.')
    } catch {
      toast.error('No se pudo copiar', 'Copia el enlace manualmente desde la bandeja.')
    }
  }

  if (loading) return <LoadingState label="Cargando cuentas web…" />

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Clientes"
        title="Cuentas web"
        description="Cuentas que los clientes crearon en la tienda. Solo pueden iniciar sesión cuando confirman su correo."
        actions={
          <>
            <button type="button" className={cn(btnSecondary, 'h-10')} onClick={() => void load()}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Actualizar
            </button>
            <button
              type="button"
              className={cn(btnSecondary, 'h-10')}
              onClick={() => setOutboxOpen(true)}
            >
              <Inbox className="size-4" aria-hidden="true" />
              Bandeja de correos
              {outbox.length > 0 && (
                <span className="rounded-full bg-[#5B21B6]/10 px-1.5 text-[11px] font-bold text-[#5B21B6]">
                  {outbox.length}
                </span>
              )}
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Cuentas web"
          value={formatNumber(counts.all)}
          helper="Registradas desde la tienda"
          icon={Users}
        />
        <StatCard
          label="Activas"
          value={formatNumber(counts.active)}
          helper={`${formatNumber(counts.verified)} con correo confirmado`}
          icon={UserCheck}
        />
        <StatCard
          label="Pendientes"
          value={formatNumber(counts.pending)}
          helper="Esperando confirmación del correo"
          icon={MailCheck}
        />
        <StatCard
          label="Bloqueadas"
          value={formatNumber(counts.blocked)}
          helper="Sin acceso a la tienda"
          icon={ShieldBan}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-0 lg:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, correo, empresa o teléfono…"
              className={cn(inputClass, 'pl-9')}
              aria-label="Buscar cuentas web"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterSelect
              label="Estado"
              value={status}
              onChange={(next) => setStatus(next as 'all' | CustomerAccountStatus)}
              ariaLabel="Filtrar cuentas web por estado"
              align="right"
              className="w-full lg:w-52"
              options={[
                { value: 'all', label: 'Todas', count: counts.all },
                { value: 'pending', label: 'Pendientes', count: counts.pending },
                { value: 'active', label: 'Activas', count: counts.active },
                { value: 'blocked', label: 'Bloqueadas', count: counts.blocked },
              ]}
            />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setStatus('all')
                }}
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
          {filtered.length === 1 ? 'cuenta' : 'cuentas'}
          {hasFilters ? ' con los filtros aplicados' : ' registradas'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={accounts.length === 0 ? 'Todavía no hay cuentas web' : 'Sin resultados'}
          description={
            accounts.length === 0
              ? 'Cuando un cliente se registre en la tienda, su cuenta aparecerá aquí para confirmar o bloquear.'
              : 'No encontramos cuentas con esos criterios. Prueba limpiando los filtros.'
          }
          action={
            hasFilters ? (
              <button
                type="button"
                className={btnSecondary}
                onClick={() => {
                  setQuery('')
                  setStatus('all')
                }}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Limpiar filtros
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs lg:block">
            <div className="overflow-x-auto scrollbar-light">
              <table className={tableClass}>
                <thead>
                  <tr className={tableHeadRowClass}>
                    <th scope="col" className="min-w-[230px] px-5 py-3">Cliente</th>
                    <th scope="col" className="px-4 py-3">Correo</th>
                    <th scope="col" className="px-4 py-3">Acceso</th>
                    <th scope="col" className="px-4 py-3">Registro</th>
                    <th scope="col" className="px-4 py-3">Último acceso</th>
                    <th scope="col" className="px-4 py-3">Estado</th>
                    <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((account) => {
                    const busy = busyId === account.id
                    return (
                      <tr key={account.id} className="group transition-colors hover:bg-slate-50/70">
                        <td className="px-5 py-3">
                          <p className="truncate text-[12.5px] font-semibold text-slate-900">
                            {account.name}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-slate-400">
                            {account.company || 'Persona natural'}
                            {account.phone ? ` · ${account.phone}` : ''}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="max-w-[210px] truncate text-[12.5px] font-medium text-slate-700">
                            {account.email}
                          </p>
                          <p className="mt-0.5 text-[10.5px] font-semibold">
                            {account.emailVerifiedAt ? (
                              <span className="text-emerald-600">Correo confirmado</span>
                            ) : (
                              <span className="text-amber-600">Sin confirmar</span>
                            )}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {account.methods.map((method) => (
                              <span
                                key={method}
                                className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-600"
                              >
                                {methodLabels[method]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-500">
                          {formatDateTime(account.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-500">
                          {account.lastLoginAt ? formatDateTime(account.lastLoginAt) : 'Nunca'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1',
                              statusStyles[account.status]
                            )}
                          >
                            {statusLabels[account.status]}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-right">
                          {canEdit ? (
                            <RowActions
                              label={`Acciones para ${account.email}`}
                              title={account.name}
                              busy={busy}
                              items={[
                                ...(!account.emailVerifiedAt
                                  ? [
                                      {
                                        key: 'resend',
                                        label: 'Reenviar confirmación',
                                        icon: MailCheck,
                                        onSelect: () => void runAction(account, 'resend'),
                                      },
                                      {
                                        key: 'verify',
                                        label: 'Verificar manualmente',
                                        icon: CheckCircle2,
                                        onSelect: () => void runAction(account, 'verify'),
                                      },
                                    ]
                                  : []),
                                account.status === 'blocked'
                                  ? {
                                      key: 'activate',
                                      label: 'Activar cuenta',
                                      icon: ShieldCheck,
                                      onSelect: () => void runAction(account, 'activate'),
                                    }
                                  : {
                                      key: 'block',
                                      label: 'Bloquear acceso',
                                      icon: ShieldBan,
                                      tone: 'danger' as const,
                                      onSelect: () => void runAction(account, 'block'),
                                    },
                              ]}
                            />
                          ) : (
                            <span className="pr-2 text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {filtered.map((account) => {
              const busy = busyId === account.id
              return (
                <article
                  key={account.id}
                  className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-slate-900">{account.name}</p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-400">
                        {account.company || 'Persona natural'}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1',
                        statusStyles[account.status]
                      )}
                    >
                      {statusLabels[account.status]}
                    </span>
                  </div>

                  <dl className="mt-3 space-y-1.5 text-[11px]">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Correo</dt>
                      <dd className="truncate font-medium text-slate-700">{account.email}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Confirmado</dt>
                      <dd className="font-medium text-slate-700">
                        {account.emailVerifiedAt ? 'Sí' : 'Pendiente'}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Registro</dt>
                      <dd className="font-medium text-slate-700">
                        {formatDateTime(account.createdAt)}
                      </dd>
                    </div>
                  </dl>

                  {canEdit && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
                      {!account.emailVerifiedAt && (
                        <>
                          <button
                            type="button"
                            onClick={() => void runAction(account, 'resend')}
                            disabled={busy}
                            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                          >
                            <MailCheck className="size-3.5" aria-hidden="true" />
                            Reenviar
                          </button>
                          <button
                            type="button"
                            onClick={() => void runAction(account, 'verify')}
                            disabled={busy}
                            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                          >
                            <CheckCircle2 className="size-3.5" aria-hidden="true" />
                            Verificar
                          </button>
                        </>
                      )}
                      {account.status === 'blocked' ? (
                        <button
                          type="button"
                          onClick={() => void runAction(account, 'activate')}
                          disabled={busy}
                          className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                        >
                          <ShieldCheck className="size-3.5" aria-hidden="true" />
                          Activar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void runAction(account, 'block')}
                          disabled={busy}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-[11px] font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          <ShieldBan className="size-3.5" aria-hidden="true" />
                          Bloquear
                        </button>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </>
      )}

      <Modal
        open={outboxOpen}
        onClose={() => setOutboxOpen(false)}
        title="Bandeja de correos"
        description="Correos de confirmación emitidos por la tienda. Sin SMTP configurado quedan aquí con su enlace."
        size="lg"
      >
        {outbox.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Todavía no se ha enviado ningún correo de confirmación.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {outbox.map((email) => (
              <li key={email.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-semibold text-slate-900">
                      {email.subject}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">{email.to}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1',
                      email.delivery === 'smtp'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : 'bg-slate-50 text-slate-600 ring-slate-200'
                    )}
                  >
                    {email.delivery === 'smtp' ? 'SMTP' : 'Bandeja local'}
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] text-slate-400">{formatDateTime(email.createdAt)}</p>
                {email.error && (
                  <p className="mt-1 text-[10.5px] font-medium text-amber-600">
                    Falló el envío SMTP: {email.error}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <a
                    href={email.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    Abrir enlace
                  </a>
                  <button
                    type="button"
                    onClick={() => void copyLink(email.link)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Copy className="size-3.5" aria-hidden="true" />
                    Copiar enlace
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  )
}
