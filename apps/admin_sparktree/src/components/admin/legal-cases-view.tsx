'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Mail,
  MessageCircle,
  Pencil,
  Plus,
  RotateCcw,
  Scale,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { ExportMenu } from '@/components/admin/export-menu'
import { Modal } from '@/components/admin/modal'
import { RowActions, type RowAction } from '@/components/admin/row-actions'
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
  inputClass,
  tableClass,
  tableHeadRowClass,
  textareaClass,
} from '@/components/admin/ui'
import { formatDate } from '@/lib/admin/format'
import {
  buildLegalCaseCode,
  daysUntilDue,
  legalCasesDataset,
  legalMatterLabels,
  legalPriorityLabels,
  legalStatusLabels,
  readLegalCases,
  writeLegalCases,
  type LegalCase,
  type LegalCaseMatter,
  type LegalCasePriority,
  type LegalCaseStatus,
} from '@/lib/admin/legal-cases'
import { isEmail } from '@fj-solutions/contracts/domain'
import { cn } from '@/lib/utils'

type LegalCaseDraft = {
  clientName: string
  company: string
  email: string
  phone: string
  matter: LegalCaseMatter
  summary: string
  status: LegalCaseStatus
  priority: LegalCasePriority
  owner: string
  openedAt: string
  dueAt: string
  nextStep: string
}

type DraftErrors = Partial<Record<keyof LegalCaseDraft, string>>

const priorityRank: Record<LegalCasePriority, number> = { alta: 0, media: 1, baja: 2 }

const statusStyles: Record<LegalCaseStatus, string> = {
  nuevo: 'bg-sky-500/10 text-sky-700 ring-sky-500/25',
  evaluacion: 'bg-amber-500/10 text-warning-ink ring-amber-500/25',
  'en-curso': 'bg-[#5946A6]/10 text-[#4A3A8F] ring-[#5946A6]/25',
  'en-espera': 'bg-violet-500/10 text-violet-700 ring-violet-500/25',
  cerrado: 'bg-muted text-muted-foreground ring-border',
}

const priorityStyles: Record<LegalCasePriority, string> = {
  alta: 'bg-rose-500/10 text-danger-ink ring-rose-500/25',
  media: 'bg-amber-500/10 text-warning-ink ring-amber-500/25',
  baja: 'bg-muted text-muted-foreground ring-border',
}

function todayInput() {
  return new Date().toISOString().slice(0, 10)
}

function emptyDraft(): LegalCaseDraft {
  return {
    clientName: '',
    company: '',
    email: '',
    phone: '',
    matter: 'contratos',
    summary: '',
    status: 'nuevo',
    priority: 'media',
    owner: '',
    openedAt: todayInput(),
    dueAt: '',
    nextStep: '',
  }
}

function toDateInput(value: string) {
  return value ? value.slice(0, 10) : ''
}

function fromDateInput(value: string) {
  return value ? `${value}T00:00:00.000Z` : ''
}

function toDraft(entry: LegalCase): LegalCaseDraft {
  return {
    clientName: entry.clientName,
    company: entry.company,
    email: entry.email,
    phone: entry.phone,
    matter: entry.matter,
    summary: entry.summary,
    status: entry.status,
    priority: entry.priority,
    owner: entry.owner,
    openedAt: toDateInput(entry.openedAt),
    dueAt: toDateInput(entry.dueAt),
    nextStep: entry.nextStep,
  }
}

function validate(draft: LegalCaseDraft): DraftErrors {
  const errors: DraftErrors = {}
  if (draft.clientName.trim().length < 2) {
    errors.clientName = 'Ingresa el nombre del cliente o de la empresa.'
  }
  if (draft.email.trim() && !isEmail(draft.email.trim())) {
    errors.email = 'Escribe un correo válido.'
  }
  if (draft.summary.trim().length < 10) {
    errors.summary = 'Resume el caso en al menos 10 caracteres.'
  }
  if (draft.openedAt && draft.dueAt && draft.dueAt < draft.openedAt) {
    errors.dueAt = 'El plazo no puede ser anterior a la apertura.'
  }
  return errors
}

function CaseStatusChip({ status }: { status: LegalCaseStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
        statusStyles[status]
      )}
    >
      {legalStatusLabels[status]}
    </span>
  )
}

function dueHint(entry: LegalCase) {
  if (entry.status === 'cerrado') return null
  const days = daysUntilDue(entry)
  if (days === null) return null
  if (days < 0) {
    return { text: `Vencido hace ${Math.abs(days)} d`, tone: 'text-danger-ink' }
  }
  if (days === 0) return { text: 'Vence hoy', tone: 'text-danger-ink' }
  if (days <= 7) return { text: `En ${days} d`, tone: 'text-warning-ink' }
  return { text: `En ${days} d`, tone: 'text-muted-foreground' }
}

export function LegalCasesView() {
  const toast = useToast()
  const [cases, setCases] = useState<LegalCase[]>([])
  const [loaded, setLoaded] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | LegalCaseStatus>('all')
  const [matter, setMatter] = useState<'all' | LegalCaseMatter>('all')
  const [editing, setEditing] = useState<LegalCase | 'new' | null>(null)
  const [draft, setDraft] = useState<LegalCaseDraft>(emptyDraft)
  const [errors, setErrors] = useState<DraftErrors>({})
  const [deleteTarget, setDeleteTarget] = useState<LegalCase | null>(null)

  useEffect(() => {
    setCases(readLegalCases())
    setLoaded(true)
  }, [])

  function commit(next: LegalCase[]) {
    setCases(next)
    writeLegalCases(next)
  }

  function openNew() {
    setDraft(emptyDraft())
    setErrors({})
    setEditing('new')
  }

  function openEdit(entry: LegalCase) {
    setDraft(toDraft(entry))
    setErrors({})
    setEditing(entry)
  }

  function update<K extends keyof LegalCaseDraft>(key: K, value: LegalCaseDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function patchCase(id: string, patch: Partial<LegalCase>) {
    commit(
      cases.map((entry) =>
        entry.id === id ? { ...entry, ...patch, updatedAt: new Date().toISOString() } : entry
      )
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const now = new Date().toISOString()
    const common = {
      clientName: draft.clientName.trim(),
      company: draft.company.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      matter: draft.matter,
      summary: draft.summary.trim(),
      status: draft.status,
      priority: draft.priority,
      owner: draft.owner.trim(),
      openedAt: fromDateInput(draft.openedAt),
      dueAt: fromDateInput(draft.dueAt),
      nextStep: draft.nextStep.trim(),
      updatedAt: now,
    }

    if (editing === 'new') {
      const record: LegalCase = {
        id: globalThis.crypto?.randomUUID?.() ?? `legal-${Date.now()}`,
        code: buildLegalCaseCode(cases, new Date(common.openedAt)),
        ...common,
      }
      commit([record, ...cases])
      toast.success('Caso registrado', `${record.code} · ${record.clientName}`)
    } else if (editing) {
      commit(
        cases.map((entry) =>
          entry.id === editing.id ? { ...entry, ...common } : entry
        )
      )
      toast.success('Caso actualizado', `${editing.code} · ${common.clientName}`)
    }

    setEditing(null)
  }

  const hasCases = cases.length > 0
  const openCases = cases.filter((entry) => entry.status !== 'cerrado')
  const evaluationCount = cases.filter((entry) => entry.status === 'evaluacion').length
  const closedCount = cases.filter((entry) => entry.status === 'cerrado').length
  const dueSoonCount = openCases.filter((entry) => {
    const days = daysUntilDue(entry)
    return days !== null && days <= 7
  }).length

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return cases
      .filter((entry) => {
        if (status !== 'all' && entry.status !== status) return false
        if (matter !== 'all' && entry.matter !== matter) return false
        if (!needle) return true
        return [entry.code, entry.clientName, entry.company, entry.summary, entry.owner, entry.email]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      })
      .sort(
        (a, b) =>
          Number(a.status === 'cerrado') - Number(b.status === 'cerrado') ||
          priorityRank[a.priority] - priorityRank[b.priority] ||
          b.openedAt.localeCompare(a.openedAt)
      )
  }, [cases, matter, query, status])

  if (!loaded) return <LoadingState label="Cargando casos legales…" />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SparkTree Legal"
        title="Casos legales"
        description="Un solo registro para las consultas de todas las materias. Asigna un responsable, controla plazos y deriva el caso sin repetir antecedentes."
        actions={
          <>
            <ExportMenu
              build={() => legalCasesDataset(cases)}
              nouns={['caso', 'casos']}
              disabled={!hasCases}
            />
            <button type="button" className={btnPrimary} onClick={openNew}>
              <Plus className="size-4" aria-hidden="true" />
              Nuevo caso
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Casos activos"
          value={String(openCases.length)}
          helper={openCases.length === 1 ? '1 caso en seguimiento' : 'Casos en seguimiento'}
          icon={Scale}
          href="/legal"
        />
        <StatCard
          label="En evaluación"
          value={String(evaluationCount)}
          helper="Pendientes de definir la vía"
          icon={ClipboardList}
        />
        <StatCard
          label="Plazos próximos"
          value={String(dueSoonCount)}
          helper="Vencen en los próximos 7 días"
          icon={CalendarClock}
        />
        <StatCard
          label="Cerrados"
          value={String(closedCount)}
          helper="Con expediente archivado"
          icon={CheckCircle2}
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-0 lg:flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por código, cliente, empresa, responsable o resumen…"
              className={cn(inputClass, 'pl-9 pr-9')}
              aria-label="Buscar casos legales"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground/80"
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
              onChange={(next) => setStatus(next as 'all' | LegalCaseStatus)}
              ariaLabel="Filtrar por estado"
              align="right"
              className="sm:w-full lg:w-48"
              options={[
                { value: 'all', label: 'Todos', count: cases.length },
                ...(Object.keys(legalStatusLabels) as LegalCaseStatus[]).map((key) => ({
                  value: key,
                  label: legalStatusLabels[key],
                  count: cases.filter((entry) => entry.status === key).length,
                })),
              ]}
            />
            <FilterSelect
              label="Materia"
              value={matter}
              onChange={(next) => setMatter(next as 'all' | LegalCaseMatter)}
              ariaLabel="Filtrar por materia"
              align="right"
              className="sm:w-full lg:w-60"
              options={[
                { value: 'all', label: 'Todas', count: cases.length },
                ...(Object.keys(legalMatterLabels) as LegalCaseMatter[]).map((key) => ({
                  value: key,
                  label: legalMatterLabels[key],
                  count: cases.filter((entry) => entry.matter === key).length,
                })),
              ]}
            />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Scale}
              title={hasCases ? 'Sin resultados' : 'Sin casos registrados'}
              description={
                hasCases
                  ? 'Ningún caso coincide con los filtros aplicados.'
                  : 'Registra la primera consulta legal para asignar responsable y controlar su plazo.'
              }
              action={
                hasCases ? undefined : (
                  <button type="button" className={btnPrimary} onClick={openNew}>
                    <Plus className="size-4" aria-hidden="true" />
                    Nuevo caso
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
                  <th className="px-5 py-3">Caso</th>
                  <th className="px-4 py-3">Materia</th>
                  <th className="px-4 py-3">Responsable</th>
                  <th className="px-4 py-3">Prioridad</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Plazo</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((entry) => {
                  const hint = dueHint(entry)
                  const actions: RowAction[] = [
                    {
                      key: 'edit',
                      label: 'Editar caso',
                      icon: Pencil,
                      onSelect: () => openEdit(entry),
                    },
                    ...(entry.phone
                      ? [
                          {
                            key: 'whatsapp',
                            label: 'Abrir WhatsApp',
                            icon: MessageCircle,
                            href: `https://wa.me/${entry.phone.replace(/\D/g, '')}`,
                            external: true,
                          } satisfies RowAction,
                        ]
                      : []),
                    ...(entry.email
                      ? [
                          {
                            key: 'mail',
                            label: 'Enviar correo',
                            icon: Mail,
                            href: `mailto:${entry.email}?subject=${encodeURIComponent(
                              `Caso ${entry.code} · SparkTree Legal`
                            )}`,
                            onSelect: undefined,
                          } satisfies RowAction,
                        ]
                      : []),
                    {
                      key: 'toggle',
                      label: entry.status === 'cerrado' ? 'Reabrir caso' : 'Marcar como cerrado',
                      icon: entry.status === 'cerrado' ? RotateCcw : CheckCircle2,
                      onSelect: () => {
                        const nextStatus = entry.status === 'cerrado' ? 'en-curso' : 'cerrado'
                        patchCase(entry.id, { status: nextStatus })
                        toast.success(
                          nextStatus === 'cerrado' ? 'Caso cerrado' : 'Caso reabierto',
                          `${entry.code} · ${entry.clientName}`
                        )
                      },
                    },
                    {
                      key: 'delete',
                      label: 'Eliminar caso',
                      icon: Trash2,
                      tone: 'danger',
                      onSelect: () => setDeleteTarget(entry),
                    },
                  ]

                  return (
                    <tr key={entry.id} className="align-top transition hover:bg-muted/60">
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-[11px] font-semibold text-muted-foreground">
                          {entry.code}
                        </p>
                        <p className="mt-0.5 font-semibold text-foreground">{entry.clientName}</p>
                        {entry.company && entry.company !== entry.clientName ? (
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{entry.company}</p>
                        ) : null}
                        <p className="mt-1 line-clamp-2 max-w-[28rem] text-[11.5px] leading-relaxed text-muted-foreground">
                          {entry.summary}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground ring-1 ring-inset ring-border">
                          {legalMatterLabels[entry.matter]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[12px] text-foreground/80">
                        {entry.owner || 'Sin asignar'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
                            priorityStyles[entry.priority]
                          )}
                        >
                          {legalPriorityLabels[entry.priority]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <CaseStatusChip status={entry.status} />
                        <p className="mt-1 text-[10.5px] text-muted-foreground">
                          Actualizado {formatDate(entry.updatedAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        {entry.dueAt ? (
                          <>
                            <p className="tabular-nums text-foreground/80">{formatDate(entry.dueAt)}</p>
                            {hint && (
                              <p className={cn('mt-0.5 text-[10.5px] font-medium', hint.tone)}>
                                {hint.text}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">Sin plazo</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <RowActions
                          label={`Acciones para ${entry.code}`}
                          title={`${entry.code} · ${entry.clientName}`}
                          items={actions}
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
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Nuevo caso legal' : `Editar ${editing?.code ?? 'caso'}`}
        description="El registro queda en este navegador y se incluye en la exportación. No reemplaza el expediente oficial."
        size="xl"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setEditing(null)}>
              Cancelar
            </button>
            <button type="submit" form="legal-case-form" className={btnPrimary}>
              {editing === 'new' ? 'Registrar caso' : 'Guardar cambios'}
            </button>
          </>
        }
      >
        <form id="legal-case-form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Cliente o empresa"
              htmlFor="legal-client"
              required
              error={errors.clientName}
            >
              <input
                id="legal-client"
                value={draft.clientName}
                onChange={(event) => update('clientName', event.target.value)}
                className={inputClass}
                placeholder="Ej. Comercial Andina S.A.C."
              />
            </Field>
            <Field label="Razón social (si difiere)" htmlFor="legal-company">
              <input
                id="legal-company"
                value={draft.company}
                onChange={(event) => update('company', event.target.value)}
                className={inputClass}
                placeholder="Nombre legal completo"
              />
            </Field>
            <Field label="Correo" htmlFor="legal-email" error={errors.email}>
              <input
                id="legal-email"
                value={draft.email}
                onChange={(event) => update('email', event.target.value)}
                className={inputClass}
                placeholder="contacto@empresa.pe"
              />
            </Field>
            <Field label="Teléfono / WhatsApp" htmlFor="legal-phone">
              <input
                id="legal-phone"
                value={draft.phone}
                onChange={(event) => update('phone', event.target.value)}
                className={inputClass}
                placeholder="+51 999 999 999"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Materia" htmlFor="legal-matter">
              <Select
                id="legal-matter"
                value={draft.matter}
                onChange={(event) => update('matter', event.target.value as LegalCaseMatter)}
              >
                {(Object.keys(legalMatterLabels) as LegalCaseMatter[]).map((key) => (
                  <option key={key} value={key}>
                    {legalMatterLabels[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Prioridad" htmlFor="legal-priority">
              <Select
                id="legal-priority"
                value={draft.priority}
                onChange={(event) =>
                  update('priority', event.target.value as LegalCasePriority)
                }
              >
                {(Object.keys(legalPriorityLabels) as LegalCasePriority[]).map((key) => (
                  <option key={key} value={key}>
                    {legalPriorityLabels[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Estado" htmlFor="legal-status">
              <Select
                id="legal-status"
                value={draft.status}
                onChange={(event) => update('status', event.target.value as LegalCaseStatus)}
              >
                {(Object.keys(legalStatusLabels) as LegalCaseStatus[]).map((key) => (
                  <option key={key} value={key}>
                    {legalStatusLabels[key]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Responsable" htmlFor="legal-owner">
              <input
                id="legal-owner"
                value={draft.owner}
                onChange={(event) => update('owner', event.target.value)}
                className={inputClass}
                placeholder="Área o persona a cargo"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fecha de apertura" htmlFor="legal-opened">
              <input
                id="legal-opened"
                type="date"
                value={draft.openedAt}
                onChange={(event) => update('openedAt', event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Plazo comprometido" htmlFor="legal-due" error={errors.dueAt}>
              <input
                id="legal-due"
                type="date"
                value={draft.dueAt}
                onChange={(event) => update('dueAt', event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Resumen del caso" htmlFor="legal-summary" required error={errors.summary}>
            <textarea
              id="legal-summary"
              rows={4}
              value={draft.summary}
              onChange={(event) => update('summary', event.target.value)}
              className={textareaClass}
              placeholder="Contexto, documentos recibidos y resultado esperado."
            />
          </Field>

          <Field label="Siguiente paso" htmlFor="legal-next">
            <input
              id="legal-next"
              value={draft.nextStep}
              onChange={(event) => update('nextStep', event.target.value)}
              className={inputClass}
              placeholder="Acción inmediata y responsable"
            />
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar caso legal"
        description={
          deleteTarget
            ? `Se quitará ${deleteTarget.code} · ${deleteTarget.clientName} del registro. Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar caso"
        onConfirm={() => {
          if (!deleteTarget) return
          commit(cases.filter((entry) => entry.id !== deleteTarget.id))
          toast.success('Caso eliminado', `${deleteTarget.code} · ${deleteTarget.clientName}`)
          setDeleteTarget(null)
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
