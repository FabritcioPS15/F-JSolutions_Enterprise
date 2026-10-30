'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  FileText,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import {
  ClientAvatar,
  ClientStatusBadge,
} from '@/components/admin/commercial-ui'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Modal } from '@/components/admin/modal'
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
  clientSegmentLabels,
  formatDate,
  formatNumber,
} from '@/lib/admin/format'
import type { Client, ClientSegment, ClientStatus } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

type ClientDraft = {
  name: string
  company: string
  documentType: '' | 'dni' | 'ruc'
  documentNumber: string
  email: string
  phone: string
  city: string
  address: string
  segment: ClientSegment
  status: ClientStatus
  notes: string
}

type ClientErrors = Partial<Record<keyof ClientDraft, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emptyDraft: ClientDraft = {
  name: '',
  company: '',
  documentType: 'ruc',
  documentNumber: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  segment: 'empresa',
  status: 'active',
  notes: '',
}

function toDraft(client: Client): ClientDraft {
  return {
    name: client.name,
    company: client.company,
    documentType: client.documentType ?? '',
    documentNumber: client.documentNumber ?? '',
    email: client.email,
    phone: client.phone,
    city: client.city,
    address: client.address,
    segment: client.segment,
    status: client.status,
    notes: client.notes,
  }
}

function validate(draft: ClientDraft): ClientErrors {
  const errors: ClientErrors = {}
  if (draft.name.trim().length < 2) errors.name = 'Ingresa el nombre del contacto.'
  if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = 'Escribe un correo válido.'
  if (draft.documentType && draft.documentNumber.trim()) {
    const digits = draft.documentNumber.replace(/\D/g, '')
    const expected = draft.documentType === 'ruc' ? 11 : 8
    if (digits.length !== expected) {
      errors.documentNumber =
        draft.documentType === 'ruc' ? 'El RUC debe tener 11 dígitos.' : 'El DNI debe tener 8 dígitos.'
    }
  }
  return errors
}

export function ClientsView() {
  const {
    hydrated,
    clients,
    quotes,
    createClient,
    updateClient,
    removeClient,
  } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [segment, setSegment] = useState<'all' | ClientSegment>('all')
  const [status, setStatus] = useState<'all' | ClientStatus>('all')
  const [editing, setEditing] = useState<Client | 'new' | null>(null)
  const [draft, setDraft] = useState<ClientDraft>(emptyDraft)
  const [errors, setErrors] = useState<ClientErrors>({})
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)

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
    return clients
      .filter((client) => {
        const matchesTerm =
          !term ||
          client.name.toLowerCase().includes(term) ||
          client.company.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.phone.toLowerCase().includes(term) ||
          (client.documentNumber ?? '').toLowerCase().includes(term)
        const matchesSegment = segment === 'all' || client.segment === segment
        const matchesStatus = status === 'all' || client.status === status
        return matchesTerm && matchesSegment && matchesStatus
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [clients, query, segment, status])

  const activeCount = clients.filter((client) => client.status === 'active').length
  const companyCount = clients.filter((client) => client.segment === 'empresa').length
  const hasFilters = query !== '' || segment !== 'all' || status !== 'all'

  function update<K extends keyof ClientDraft>(key: K, value: ClientDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function resetFilters() {
    setQuery('')
    setSegment('all')
    setStatus('all')
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Revisa los datos', 'Hay campos del cliente sin completar correctamente.')
      return
    }

    const input = {
      name: draft.name.trim(),
      company: draft.company.trim(),
      documentType: draft.documentType || undefined,
      documentNumber: draft.documentNumber.trim() || undefined,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      city: draft.city.trim(),
      address: draft.address.trim(),
      segment: draft.segment,
      status: draft.status,
      notes: draft.notes.trim(),
    }

    if (editing === 'new') {
      const client = createClient(input)
      toast.success('Cliente registrado', client.company || client.name)
    } else if (editing) {
      updateClient(editing.id, input)
      toast.success('Cliente actualizado', input.company || input.name)
    }
    setEditing(null)
  }

  function handleDelete() {
    if (!deleteTarget) return
    removeClient(deleteTarget.id)
    toast.success('Cliente eliminado', deleteTarget.company || deleteTarget.name)
    setDeleteTarget(null)
  }

  if (!hydrated) {
    return <LoadingState label="Cargando clientes…" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Comercial"
        title="Clientes"
        description="Directorio de empresas y personas que reciben cotizaciones de FJ Systems."
        actions={
          <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
            <Plus className="size-4" aria-hidden="true" />
            Nuevo cliente
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Clientes"
          value={formatNumber(clients.length)}
          helper={
            activeCount === 1 ? '1 activo' : `${formatNumber(activeCount)} activos`
          }
          icon={Users}
        />
        <StatCard
          label="Empresas"
          value={formatNumber(companyCount)}
          helper={
            clients.length - companyCount === 1
              ? '1 persona'
              : `${formatNumber(clients.length - companyCount)} personas`
          }
          icon={Building2}
        />
        <StatCard
          label="Con cotizaciones"
          value={formatNumber(
            clients.filter((client) => quotes.some((quote) => quote.clientId === client.id)).length
          )}
          helper="Clientes con historial comercial"
          icon={FileText}
        />
        <StatCard
          label="Inactivos"
          value={formatNumber(clients.length - activeCount)}
          helper="Cuentas sin actividad reciente"
          icon={UserRound}
        />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-0 lg:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por empresa, contacto, correo o documento…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar clientes"
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
              value={segment}
              onChange={(event) => setSegment(event.target.value as 'all' | ClientSegment)}
              aria-label="Filtrar por segmento"
              className="sm:w-full lg:w-40"
            >
              <option value="all">Todos los segmentos</option>
              <option value="empresa">Empresas</option>
              <option value="persona">Personas</option>
            </Select>
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value as 'all' | ClientStatus)}
              aria-label="Filtrar por estado"
              className="sm:w-full lg:w-36"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
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
          {filtered.length === 1 ? 'cliente' : 'clientes'}
          {hasFilters ? ' con los filtros aplicados' : ' registrados'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={clients.length === 0 ? 'Sin clientes registrados' : 'Sin resultados'}
          description={
            clients.length === 0
              ? 'Registra tu primer cliente para asociarlo a solicitudes y cotizaciones.'
              : 'No encontramos clientes con esos criterios. Prueba limpiando los filtros.'
          }
          action={
            clients.length === 0 ? (
              <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
                <Plus className="size-4" aria-hidden="true" />
                Registrar cliente
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
              <table className="w-full min-w-[940px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <th scope="col" className="min-w-[240px] px-5 py-3">Cliente</th>
                    <th scope="col" className="px-3 py-3">Documento</th>
                    <th scope="col" className="px-3 py-3">Contacto</th>
                    <th scope="col" className="px-3 py-3">Segmento</th>
                    <th scope="col" className="px-3 py-3">Cotizaciones</th>
                    <th scope="col" className="px-3 py-3">Estado</th>
                    <th scope="col" className="whitespace-nowrap px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((client) => {
                    const clientQuotes = quotes
                      .filter((quote) => quote.clientId === client.id)
                      .sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      )
                    return (
                      <tr key={client.id} className="group transition-colors hover:bg-slate-50/70">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <ClientAvatar name={client.name} company={client.company} />
                            <div className="min-w-0">
                              <p className="truncate text-[12.5px] font-semibold text-slate-900">
                                {client.company || client.name}
                              </p>
                              <p className="mt-0.5 truncate text-[10.5px] text-slate-400">
                                {client.company ? client.name : 'Persona natural'}
                                {client.city ? ` · ${client.city}` : ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          {client.documentNumber ? (
                            <>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                {client.documentType === 'dni' ? 'DNI' : 'RUC'}
                              </p>
                              <p className="mt-0.5 font-mono text-[11px] text-slate-600">
                                {client.documentNumber}
                              </p>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400">Sin documento</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <p className="max-w-[190px] truncate text-[11.5px] font-medium text-slate-700">
                            {client.email}
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-slate-400">
                            {client.phone || 'Sin teléfono'}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-600">
                            {clientSegmentLabels[client.segment]}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {clientQuotes.length > 0 ? (
                            <>
                              <p className="text-[12px] font-bold tabular-nums text-slate-900">
                                {clientQuotes.length}
                              </p>
                              <p className="mt-0.5 text-[10px] text-slate-400">
                                Última {formatDate(clientQuotes[0].createdAt)}
                              </p>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400">Sin cotizaciones</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <ClientStatusBadge status={client.status} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <div className="flex items-center justify-end gap-0.5">
                            <Link
                              href={`/cotizaciones?q=${encodeURIComponent(client.email)}`}
                              className={iconButton}
                              title="Ver cotizaciones del cliente"
                              aria-label={`Ver cotizaciones de ${client.company || client.name}`}
                            >
                              <FileText className="size-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setEditing(client)}
                              className={iconButton}
                              title="Editar cliente"
                              aria-label={`Editar ${client.company || client.name}`}
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(client)}
                              className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600')}
                              title="Eliminar cliente"
                              aria-label={`Eliminar ${client.company || client.name}`}
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
            {filtered.map((client) => {
              const clientQuotes = quotes.filter((quote) => quote.clientId === client.id)
              return (
                <article
                  key={client.id}
                  className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <ClientAvatar name={client.name} company={client.company} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-slate-900">
                        {client.company || client.name}
                      </p>
                      <p className="mt-0.5 truncate text-[10.5px] text-slate-400">
                        {client.company ? client.name : 'Persona natural'}
                        {client.city ? ` · ${client.city}` : ''}
                      </p>
                    </div>
                    <ClientStatusBadge status={client.status} />
                  </div>

                  <dl className="mt-3 space-y-1.5 text-[11px]">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Correo</dt>
                      <dd className="truncate font-medium text-slate-700">{client.email}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Teléfono</dt>
                      <dd className="font-medium text-slate-700">{client.phone || '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Cotizaciones</dt>
                      <dd className="font-medium text-slate-700">{clientQuotes.length}</dd>
                    </div>
                  </dl>

                  <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3">
                    <Link
                      href={`/cotizaciones?q=${encodeURIComponent(client.email)}`}
                      className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <FileText className="size-3.5" aria-hidden="true" />
                      Cotizaciones
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEditing(client)}
                      className={cn(iconButton, 'border border-slate-200 bg-white')}
                      aria-label={`Editar ${client.company || client.name}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(client)}
                      className={cn(
                        iconButton,
                        'border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600'
                      )}
                      aria-label={`Eliminar ${client.company || client.name}`}
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
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Nuevo cliente' : 'Editar cliente'}
        description="Los datos de contacto se reutilizan en las cotizaciones del cliente."
        size="lg"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setEditing(null)}>
              Cancelar
            </button>
            <button type="submit" form="client-form" className={btnPrimary}>
              {editing === 'new' ? 'Registrar cliente' : 'Guardar cambios'}
            </button>
          </>
        }
      >
        <form id="client-form" onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Empresa" htmlFor="client-company" className="sm:col-span-2">
              <input
                id="client-company"
                value={draft.company}
                onChange={(event) => update('company', event.target.value)}
                className={inputClass}
                placeholder="Banco Andino del Perú"
              />
            </Field>
            <Field label="Contacto" htmlFor="client-name" required error={errors.name}>
              <input
                id="client-name"
                value={draft.name}
                onChange={(event) => update('name', event.target.value)}
                className={inputClass}
                placeholder="María Fernanda Ríos"
                aria-invalid={Boolean(errors.name)}
              />
            </Field>
            <Field label="Segmento" htmlFor="client-segment">
              <Select
                id="client-segment"
                value={draft.segment}
                onChange={(event) => update('segment', event.target.value as ClientSegment)}
              >
                <option value="empresa">Empresa</option>
                <option value="persona">Persona</option>
              </Select>
            </Field>
            <Field label="Documento" htmlFor="client-document-type">
              <Select
                id="client-document-type"
                value={draft.documentType}
                onChange={(event) =>
                  update('documentType', event.target.value as ClientDraft['documentType'])
                }
              >
                <option value="">Sin documento</option>
                <option value="ruc">RUC</option>
                <option value="dni">DNI</option>
              </Select>
            </Field>
            <Field
              label="Número de documento"
              htmlFor="client-document-number"
              error={errors.documentNumber}
              hint={draft.documentType === 'dni' ? '8 dígitos' : '11 dígitos'}
            >
              <input
                id="client-document-number"
                value={draft.documentNumber}
                onChange={(event) => update('documentNumber', event.target.value)}
                className={cn(inputClass, 'font-mono')}
                placeholder={draft.documentType === 'dni' ? '45678901' : '20512345678'}
                inputMode="numeric"
                disabled={!draft.documentType}
                aria-invalid={Boolean(errors.documentNumber)}
              />
            </Field>
            <Field label="Correo" htmlFor="client-email" required error={errors.email}>
              <input
                id="client-email"
                type="email"
                value={draft.email}
                onChange={(event) => update('email', event.target.value)}
                className={inputClass}
                placeholder="contacto@empresa.pe"
                aria-invalid={Boolean(errors.email)}
              />
            </Field>
            <Field label="Teléfono / WhatsApp" htmlFor="client-phone">
              <input
                id="client-phone"
                value={draft.phone}
                onChange={(event) => update('phone', event.target.value)}
                className={inputClass}
                placeholder="+51 987 654 321"
                inputMode="tel"
              />
            </Field>
            <Field label="Ciudad" htmlFor="client-city">
              <input
                id="client-city"
                value={draft.city}
                onChange={(event) => update('city', event.target.value)}
                className={inputClass}
                placeholder="Lima"
              />
            </Field>
            <Field label="Dirección" htmlFor="client-address">
              <input
                id="client-address"
                value={draft.address}
                onChange={(event) => update('address', event.target.value)}
                className={inputClass}
                placeholder="Av. Ejemplo 123"
              />
            </Field>
            <Field label="Estado" htmlFor="client-status">
              <Select
                id="client-status"
                value={draft.status}
                onChange={(event) => update('status', event.target.value as ClientStatus)}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </Select>
            </Field>
            <Field
              label="Notas internas"
              htmlFor="client-notes"
              hint="Solo visibles para el equipo."
              className="sm:col-span-2"
            >
              <textarea
                id="client-notes"
                value={draft.notes}
                onChange={(event) => update('notes', event.target.value)}
                className={cn(textareaClass, 'min-h-24')}
                placeholder="Condiciones de compra, preferencias de contacto…"
              />
            </Field>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar cliente"
        description={`Se quitará “${deleteTarget?.company || deleteTarget?.name || ''}” del directorio. Sus cotizaciones se conservan como histórico, pero dejarán de estar vinculadas.`}
        confirmLabel="Eliminar cliente"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
