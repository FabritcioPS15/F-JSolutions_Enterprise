'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  CalendarClock,
  Code2,
  ExternalLink,
  GitBranch,
  Globe2,
  Pencil,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { DatePicker } from '@/components/admin/date-picker'
import { ExportMenu } from '@/components/admin/export-menu'
import { Modal } from '@/components/admin/modal'
import { RowActions } from '@/components/admin/row-actions'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  Field,
  FilterSelect,
  PageHeader,
  Select,
  StatCard,
  btnPrimary,
  btnSecondary,
  inputClass,
  tableClass,
  tableHeadRowClass,
  textareaClass,
} from '@/components/admin/ui'
import { projectsDataset } from '@/lib/admin/excel-exports'
import {
  daysBetweenDates,
  deploymentEnvironmentLabels,
  formatDate,
  formatDateTime,
  webProjectStatusLabels,
  webProjectTypeLabels,
} from '@/lib/admin/format'
import type {
  Client,
  DeploymentEnvironment,
  WebProject,
  WebProjectInput,
  WebProjectStatus,
  WebProjectType,
} from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const statusRank: Record<WebProjectStatus, number> = {
  live: 0,
  staging: 1,
  development: 2,
  planning: 3,
  paused: 4,
  archived: 5,
}

const statusStyles: Record<WebProjectStatus, string> = {
  planning: 'bg-slate-100 text-slate-600 ring-slate-500/15',
  development: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  staging: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  live: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  paused: 'bg-orange-50 text-orange-700 ring-orange-600/15',
  archived: 'bg-slate-100 text-slate-500 ring-slate-400/15',
}

const environmentStyles: Record<DeploymentEnvironment, string> = {
  production: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  staging: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  preview: 'bg-sky-50 text-sky-700 ring-sky-600/15',
}

function ProjectStatusBadge({ status }: { status: WebProjectStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset',
        statusStyles[status]
      )}
    >
      {webProjectStatusLabels[status]}
    </span>
  )
}

function EnvironmentBadge({ environment }: { environment: DeploymentEnvironment }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
        environmentStyles[environment]
      )}
    >
      {deploymentEnvironmentLabels[environment]}
    </span>
  )
}

function latestDeployment(project: WebProject) {
  return [...project.deployments].sort(
    (a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()
  )[0]
}

function UrlLink({
  href,
  label,
  icon: Icon = ExternalLink,
}: {
  href: string
  label: string
  icon?: typeof ExternalLink
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      title={href}
      className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-1 text-[10.5px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 transition hover:bg-[#F5F3FF] hover:text-[#5B21B6] hover:ring-[#DDD6FE]"
    >
      <Icon className="size-3" aria-hidden="true" />
      {label}
    </a>
  )
}

function RenewalCell({ value, today }: { value?: string; today: string | null }) {
  if (!value) {
    return <span className="text-[11.5px] text-slate-300">—</span>
  }

  const days = today ? daysBetweenDates(today, value) : null

  return (
    <div className="space-y-1">
      <p className="whitespace-nowrap text-[12.5px] text-slate-600">{formatDate(value)}</p>
      {days !== null && days <= 60 && (
        <span
          className={cn(
            'inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
            days < 0
              ? 'bg-red-50 text-red-700 ring-red-600/15'
              : days <= 30
                ? 'bg-amber-50 text-amber-700 ring-amber-600/15'
                : 'bg-[#F5F3FF] text-[#5B21B6] ring-[#A78BFA]/40'
          )}
        >
          {days < 0
            ? `Vencida hace ${Math.abs(days)} d`
            : days === 0
              ? 'Vence hoy'
              : `En ${days} días`}
        </span>
      )}
    </div>
  )
}

export function ProjectsView() {
  const {
    webProjects,
    clients,
    deleteProject,
    registerDeployment,
    projectsError,
    refreshProjects,
  } = useAdmin()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | WebProjectStatus>('all')
  const [type, setType] = useState<'all' | WebProjectType>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WebProject | null>(null)
  const [deployProjectId, setDeployProjectId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<WebProject | null>(null)
  const [today, setToday] = useState<string | null>(null)

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10))
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return webProjects
      .filter((project) => {
        const matchesTerm =
          !term ||
          project.name.toLowerCase().includes(term) ||
          project.clientName.toLowerCase().includes(term) ||
          project.domain.toLowerCase().includes(term) ||
          project.hosting.toLowerCase().includes(term) ||
          project.responsible.toLowerCase().includes(term) ||
          project.productionUrl.toLowerCase().includes(term) ||
          project.stagingUrl.toLowerCase().includes(term)
        const matchesStatus = status === 'all' || project.status === status
        const matchesType = type === 'all' || project.type === type
        return matchesTerm && matchesStatus && matchesType
      })
      .sort(
        (a, b) =>
          statusRank[a.status] - statusRank[b.status] || a.name.localeCompare(b.name, 'es')
      )
  }, [webProjects, query, status, type])

  const liveCount = webProjects.filter((project) => project.status === 'live').length
  const developmentCount = webProjects.filter(
    (project) => project.status === 'development' || project.status === 'staging'
  ).length
  const renewalCount = today
    ? webProjects.filter((project) => {
        if (!project.renewalAt || project.status === 'archived') return false
        const days = daysBetweenDates(today, project.renewalAt)
        return days !== null && days <= 60
      }).length
    : 0

  const deployProject = webProjects.find((project) => project.id === deployProjectId) ?? null

  function openCreate() {
    setEditTarget(null)
    setFormOpen(true)
  }

  function openEdit(project: WebProject) {
    setEditTarget(project)
    setFormOpen(true)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Operaciones"
        title="Proyectos web"
        description="Centraliza enlaces, infraestructura, accesos y despliegues de cada proyecto entregado."
        actions={
          <>
            <ExportMenu
              build={() => projectsDataset(filtered)}
              nouns={['proyecto', 'proyectos']}
              disabled={filtered.length === 0}
            />
            <button type="button" className={btnPrimary} onClick={openCreate}>
              <Plus className="size-4" aria-hidden="true" />
              Nuevo proyecto
            </button>
          </>
        }
      />

      {projectsError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p>{projectsError}</p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
            onClick={() => void refreshProjects().catch(() => undefined)}
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Proyectos"
          value={String(webProjects.length)}
          helper={`${webProjects.filter((project) => project.status !== 'archived').length} activos`}
          icon={Globe2}
        />
        <StatCard
          label="En producción"
          value={String(liveCount)}
          helper="Publicados y en mantenimiento"
          icon={Rocket}
        />
        <StatCard
          label="En desarrollo"
          value={String(developmentCount)}
          helper="Desarrollo y staging"
          icon={Code2}
        />
        <StatCard
          label="Renovaciones próximas"
          value={String(renewalCount)}
          helper="Vencen en los próximos 60 días"
          icon={CalendarClock}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full min-w-0 xl:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por proyecto, cliente, dominio o hosting…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar proyectos web"
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

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <FilterSelect
              label="Estado"
              value={status}
              onChange={(next) => setStatus(next as 'all' | WebProjectStatus)}
              ariaLabel="Filtrar por estado"
              align="right"
              className="sm:w-44"
              options={[
                { value: 'all', label: 'Todos', count: webProjects.length },
                ...(
                  Object.keys(webProjectStatusLabels) as WebProjectStatus[]
                ).map((value) => ({
                  value,
                  label: webProjectStatusLabels[value],
                  count: webProjects.filter((project) => project.status === value).length,
                })),
              ]}
            />
            <FilterSelect
              label="Tipo"
              value={type}
              onChange={(next) => setType(next as 'all' | WebProjectType)}
              ariaLabel="Filtrar por tipo"
              align="right"
              className="sm:w-44"
              options={[
                { value: 'all', label: 'Todos', count: webProjects.length },
                ...(Object.keys(webProjectTypeLabels) as WebProjectType[]).map((value) => ({
                  value,
                  label: webProjectTypeLabels[value],
                  count: webProjects.filter((project) => project.type === value).length,
                })),
              ]}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon={Globe2}
              title={webProjects.length === 0 ? 'Aún no hay proyectos web' : 'Sin resultados'}
              description={
                webProjects.length === 0
                  ? 'Registra el primer sitio o sistema web para llevar control de enlaces, hosting y despliegues.'
                  : 'No encontramos proyectos con esos criterios. Ajusta la búsqueda o los filtros.'
              }
              action={
                webProjects.length === 0 ? (
                  <button type="button" className={btnPrimary} onClick={openCreate}>
                    <Plus className="size-4" aria-hidden="true" />
                    Nuevo proyecto
                  </button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-light">
            <table className={tableClass}>
              <thead>
                <tr className={tableHeadRowClass}>
                  <th className="px-5 py-3 font-bold">Proyecto</th>
                  <th className="px-4 py-3 font-bold">Tipo</th>
                  <th className="px-4 py-3 font-bold">Estado</th>
                  <th className="px-4 py-3 font-bold">Enlaces</th>
                  <th className="px-4 py-3 font-bold">Hosting</th>
                  <th className="px-4 py-3 font-bold">Responsable</th>
                  <th className="px-4 py-3 font-bold">Renovación</th>
                  <th className="px-4 py-3 font-bold">Último despliegue</th>
                  <th className="px-5 py-3 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((project) => {
                  const last = latestDeployment(project)
                  return (
                    <tr key={project.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-3">
                        <p className="max-w-[260px] truncate font-semibold text-slate-900">
                          {project.name}
                        </p>
                        <p className="max-w-[260px] truncate text-[11px] text-slate-400">
                          {project.clientName || 'Sin cliente'}
                          {project.domain ? ` · ${project.domain}` : ''}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[12.5px] text-slate-600">
                        {webProjectTypeLabels[project.type]}
                      </td>
                      <td className="px-4 py-3">
                        <ProjectStatusBadge status={project.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {project.productionUrl && (
                            <UrlLink href={project.productionUrl} label="Prod" />
                          )}
                          {project.stagingUrl && (
                            <UrlLink href={project.stagingUrl} label="Staging" />
                          )}
                          {project.repoUrl && (
                            <UrlLink href={project.repoUrl} label="Repo" icon={GitBranch} />
                          )}
                          {!project.productionUrl &&
                            !project.stagingUrl &&
                            !project.repoUrl && (
                              <span className="text-[11.5px] text-slate-300">—</span>
                            )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-[180px] truncate text-[12.5px] text-slate-600">
                          {project.hosting || '—'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[12.5px] text-slate-600">
                        {project.responsible || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <RenewalCell value={project.renewalAt} today={today} />
                      </td>
                      <td className="px-4 py-3">
                        {last ? (
                          <div className="space-y-1">
                            <p className="whitespace-nowrap text-[12px] text-slate-600">
                              {formatDateTime(last.deployedAt)}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <EnvironmentBadge environment={last.environment} />
                              {last.version && (
                                <span className="font-mono text-[10px] text-slate-400">
                                  {last.version}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11.5px] text-slate-300">Sin despliegues</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <RowActions
                          label={`Acciones para ${project.name}`}
                          title={project.name}
                          items={[
                            {
                              key: 'deployments',
                              label: 'Ver despliegues',
                              icon: Rocket,
                              onSelect: () => setDeployProjectId(project.id),
                            },
                            {
                              key: 'edit',
                              label: 'Editar proyecto',
                              icon: Pencil,
                              onSelect: () => openEdit(project),
                            },
                            {
                              key: 'delete',
                              label: 'Eliminar proyecto',
                              icon: Trash2,
                              tone: 'danger',
                              onSelect: () => setDeleteTarget(project),
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
      </div>

      {formOpen && (
        <ProjectFormModal
          project={editTarget}
          clients={clients}
          onClose={() => setFormOpen(false)}
        />
      )}

      {deployProject && (
        <DeploymentsModal
          project={deployProject}
          onClose={() => setDeployProjectId(null)}
          onRegister={registerDeployment}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open
          title="Eliminar proyecto web"
          description={`Se eliminará “${deleteTarget.name}” junto con su historial de despliegues. Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar proyecto"
          onConfirm={() => {
            deleteProject(deleteTarget.id)
            toast.success('Proyecto eliminado', `${deleteTarget.name} se quitó del registro.`)
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function ProjectFormModal({
  project,
  clients,
  onClose,
}: {
  project: WebProject | null
  clients: Client[]
  onClose: () => void
}) {
  const { createProject, updateProject } = useAdmin()
  const toast = useToast()

  const [name, setName] = useState(project?.name ?? '')
  const [clientName, setClientName] = useState(project?.clientName ?? '')
  const [type, setType] = useState<WebProjectType>(project?.type ?? 'website')
  const [status, setStatus] = useState<WebProjectStatus>(project?.status ?? 'planning')
  const [productionUrl, setProductionUrl] = useState(project?.productionUrl ?? '')
  const [stagingUrl, setStagingUrl] = useState(project?.stagingUrl ?? '')
  const [repoUrl, setRepoUrl] = useState(project?.repoUrl ?? '')
  const [hosting, setHosting] = useState(project?.hosting ?? '')
  const [domain, setDomain] = useState(project?.domain ?? '')
  const [responsible, setResponsible] = useState(project?.responsible ?? '')
  const [credentialLocation, setCredentialLocation] = useState(
    project?.credentialLocation ?? ''
  )
  const [launchedAt, setLaunchedAt] = useState(project?.launchedAt ?? '')
  const [renewalAt, setRenewalAt] = useState(project?.renewalAt ?? '')
  const [notes, setNotes] = useState(project?.notes ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function isValidUrl(value: string) {
    if (!value.trim()) return true
    try {
      const parsed = new URL(value.trim())
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!name.trim()) nextErrors.name = 'Escribe el nombre del proyecto.'
    if (!isValidUrl(productionUrl)) {
      nextErrors.productionUrl = 'Usa una URL válida, por ejemplo https://midominio.pe.'
    }
    if (!isValidUrl(stagingUrl)) {
      nextErrors.stagingUrl = 'Usa una URL válida, por ejemplo https://staging.midominio.pe.'
    }
    if (!isValidUrl(repoUrl)) {
      nextErrors.repoUrl = 'Usa una URL válida, por ejemplo https://github.com/…'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const cleanClient = clientName.trim()
    const linked = clients.find(
      (client) =>
        (client.company || client.name).trim().toLowerCase() === cleanClient.toLowerCase()
    )

    const input: WebProjectInput = {
      name: name.trim(),
      clientId: linked?.id,
      clientName: cleanClient,
      type,
      status,
      productionUrl: productionUrl.trim(),
      stagingUrl: stagingUrl.trim(),
      repoUrl: repoUrl.trim(),
      hosting: hosting.trim(),
      domain: domain.trim(),
      responsible: responsible.trim(),
      credentialLocation: credentialLocation.trim(),
      launchedAt: launchedAt || undefined,
      renewalAt: renewalAt || undefined,
      notes: notes.trim(),
    }

    if (project) {
      updateProject(project.id, input)
      toast.success('Proyecto actualizado', `${input.name} se guardó correctamente.`)
    } else {
      createProject(input)
      toast.success('Proyecto creado', `${input.name} se agregó a Proyectos web.`)
    }
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={project ? 'Editar proyecto web' : 'Nuevo proyecto web'}
      description="Registra enlaces, infraestructura y la ubicación de las credenciales. No guardes contraseñas aquí."
      size="xl"
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="project-form" className={btnPrimary}>
            {project ? 'Guardar cambios' : 'Crear proyecto'}
          </button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Información general
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre del proyecto" htmlFor="project-name" required error={errors.name} className="sm:col-span-2">
              <input
                id="project-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="Ej. Portal de proveedores"
                className={inputClass}
              />
            </Field>

            <Field
              label="Cliente"
              htmlFor="project-client"
              hint="Escribe el nombre o elígelo de la lista de clientes."
            >
              <input
                id="project-client"
                list="project-clients"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Ej. Banco Andino del Perú"
                className={inputClass}
              />
              <datalist id="project-clients">
                {clients.map((client) => {
                  const label = client.company || client.name
                  return <option key={client.id} value={label} />
                })}
              </datalist>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Tipo" htmlFor="project-type">
                <Select
                  id="project-type"
                  value={type}
                  onChange={(event) => setType(event.target.value as WebProjectType)}
                >
                  {(Object.keys(webProjectTypeLabels) as WebProjectType[]).map((value) => (
                    <option key={value} value={value}>
                      {webProjectTypeLabels[value]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Estado" htmlFor="project-status">
                <Select
                  id="project-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as WebProjectStatus)}
                >
                  {(Object.keys(webProjectStatusLabels) as WebProjectStatus[]).map((value) => (
                    <option key={value} value={value}>
                      {webProjectStatusLabels[value]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Enlaces e infraestructura
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL de producción" htmlFor="project-production" error={errors.productionUrl}>
              <input
                id="project-production"
                type="url"
                value={productionUrl}
                onChange={(event) => {
                  setProductionUrl(event.target.value)
                  setErrors((prev) => ({ ...prev, productionUrl: '' }))
                }}
                placeholder="https://midominio.pe"
                className={inputClass}
              />
            </Field>
            <Field label="URL de staging" htmlFor="project-staging" error={errors.stagingUrl}>
              <input
                id="project-staging"
                type="url"
                value={stagingUrl}
                onChange={(event) => {
                  setStagingUrl(event.target.value)
                  setErrors((prev) => ({ ...prev, stagingUrl: '' }))
                }}
                placeholder="https://staging.midominio.pe"
                className={inputClass}
              />
            </Field>
            <Field label="Repositorio" htmlFor="project-repo" error={errors.repoUrl}>
              <input
                id="project-repo"
                type="url"
                value={repoUrl}
                onChange={(event) => {
                  setRepoUrl(event.target.value)
                  setErrors((prev) => ({ ...prev, repoUrl: '' }))
                }}
                placeholder="https://github.com/…"
                className={inputClass}
              />
            </Field>
            <Field label="Hosting" htmlFor="project-hosting" hint="Vercel, Railway, VPS, cPanel…">
              <input
                id="project-hosting"
                value={hosting}
                onChange={(event) => setHosting(event.target.value)}
                placeholder="Ej. Vercel + PostgreSQL"
                className={inputClass}
              />
            </Field>
            <Field label="Dominio" htmlFor="project-domain">
              <input
                id="project-domain"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="Ej. midominio.pe"
                className={inputClass}
              />
            </Field>
            <Field label="Responsable" htmlFor="project-responsible">
              <input
                id="project-responsible"
                value={responsible}
                onChange={(event) => setResponsible(event.target.value)}
                placeholder="Ej. Fabritcio Peña"
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Accesos y fechas
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Ubicación de credenciales"
              htmlFor="project-credentials"
              hint="Solo la referencia: Bitwarden, 1Password, correo del cliente…"
              className="sm:col-span-2"
            >
              <input
                id="project-credentials"
                value={credentialLocation}
                onChange={(event) => setCredentialLocation(event.target.value)}
                placeholder="Ej. Bitwarden · Clientes/Banco Andino"
                className={inputClass}
              />
            </Field>
            <Field label="Fecha de lanzamiento" htmlFor="project-launched">
              <DatePicker
                id="project-launched"
                value={launchedAt}
                onChange={setLaunchedAt}
              />
            </Field>
            <Field label="Próxima renovación" htmlFor="project-renewal">
              <DatePicker
                id="project-renewal"
                value={renewalAt}
                onChange={setRenewalAt}
              />
            </Field>
            <Field label="Notas" htmlFor="project-notes" className="sm:col-span-2">
              <textarea
                id="project-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Alcance, acuerdos de soporte, pendientes…"
                className={textareaClass}
                rows={3}
              />
            </Field>
          </div>
        </div>
      </form>
    </Modal>
  )
}

function DeploymentsModal({
  project,
  onClose,
  onRegister,
}: {
  project: WebProject
  onClose: () => void
  onRegister: (
    projectId: string,
    input: {
      environment: DeploymentEnvironment
      url: string
      version?: string
      note?: string
      deployedAt?: string
    }
  ) => unknown
}) {
  const toast = useToast()
  const deployments = [...project.deployments].sort(
    (a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()
  )

  const [environment, setEnvironment] = useState<DeploymentEnvironment>('production')
  const [url, setUrl] = useState(project.productionUrl || project.stagingUrl || '')
  const [version, setVersion] = useState('')
  const [note, setNote] = useState('')
  const [deployedAt, setDeployedAt] = useState(new Date().toISOString().slice(0, 10))
  const [error, setError] = useState<string | null>(null)

  function changeEnvironment(next: DeploymentEnvironment) {
    setEnvironment(next)
    setError(null)
    if (!url.trim()) {
      setUrl(
        next === 'production'
          ? project.productionUrl
          : next === 'staging'
            ? project.stagingUrl
            : ''
      )
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = url.trim()
    if (!clean) {
      setError('Ingresa la URL del despliegue.')
      return
    }
    try {
      const parsed = new URL(clean)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        setError('Usa una URL válida, por ejemplo https://midominio.pe.')
        return
      }
    } catch {
      setError('Usa una URL válida, por ejemplo https://midominio.pe.')
      return
    }

    onRegister(project.id, {
      environment,
      url: clean,
      version,
      note,
      deployedAt: `${deployedAt}T12:00:00.000Z`,
    })

    toast.success(
      'Despliegue registrado',
      `${deploymentEnvironmentLabels[environment]} · ${project.name}.`
    )
    setVersion('')
    setNote('')
    setError(null)
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Despliegues · ${project.name}`}
      description={`${project.clientName || 'Sin cliente'} · ${project.domain || project.productionUrl || 'Sin dominio'}`}
      size="lg"
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={onClose}>
            Cerrar
          </button>
          <button type="submit" form="deployment-form" className={btnPrimary}>
            <Rocket className="size-4" aria-hidden="true" />
            Registrar despliegue
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <ProjectStatusBadge status={project.status} />
          {project.productionUrl && (
            <UrlLink href={project.productionUrl} label="Producción" />
          )}
          {project.stagingUrl && <UrlLink href={project.stagingUrl} label="Staging" />}
          {project.repoUrl && <UrlLink href={project.repoUrl} label="Repo" icon={GitBranch} />}
        </div>

        <form
          id="deployment-form"
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Entorno" htmlFor="deployment-environment">
              <Select
                id="deployment-environment"
                value={environment}
                onChange={(event) =>
                  changeEnvironment(event.target.value as DeploymentEnvironment)
                }
              >
                {(Object.keys(deploymentEnvironmentLabels) as DeploymentEnvironment[]).map(
                  (value) => (
                    <option key={value} value={value}>
                      {deploymentEnvironmentLabels[value]}
                    </option>
                  )
                )}
              </Select>
            </Field>
            <Field label="Fecha" htmlFor="deployment-date">
              <DatePicker id="deployment-date" value={deployedAt} onChange={setDeployedAt} />
            </Field>
            <Field label="URL desplegada" htmlFor="deployment-url" className="sm:col-span-2" error={error ?? undefined}>
              <input
                id="deployment-url"
                type="url"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value)
                  setError(null)
                }}
                placeholder="https://midominio.pe"
                className={inputClass}
              />
            </Field>
            <Field label="Versión" htmlFor="deployment-version" hint="Opcional: v1.4.0">
              <input
                id="deployment-version"
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                placeholder="v1.0.0"
                className={inputClass}
              />
            </Field>
            <Field label="Nota" htmlFor="deployment-note" hint="Opcional">
              <input
                id="deployment-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Cambios incluidos en este despliegue"
                className={inputClass}
              />
            </Field>
          </div>
        </form>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Historial · {deployments.length}{' '}
            {deployments.length === 1 ? 'despliegue' : 'despliegues'}
          </p>
          {deployments.length === 0 ? (
            <EmptyState
              icon={Rocket}
              title="Sin despliegues registrados"
              description="Registra el primer despliegue para conservar la fecha, el entorno y la versión publicada."
            />
          ) : (
            <ol className="space-y-2.5">
              {deployments.map((deployment) => (
                <li
                  key={deployment.id}
                  className="rounded-xl border border-slate-200 bg-white p-3.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <EnvironmentBadge environment={deployment.environment} />
                      {deployment.version && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] text-slate-600">
                          {deployment.version}
                        </span>
                      )}
                    </div>
                    <span className="text-[11.5px] text-slate-400">
                      {formatDateTime(deployment.deployedAt)}
                    </span>
                  </div>
                  <a
                    href={deployment.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-1.5 inline-flex max-w-full items-center gap-1.5 truncate text-[12px] font-semibold text-[#5B21B6] hover:underline"
                  >
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{deployment.url}</span>
                  </a>
                  {deployment.note && (
                    <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
                      {deployment.note}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </Modal>
  )
}
