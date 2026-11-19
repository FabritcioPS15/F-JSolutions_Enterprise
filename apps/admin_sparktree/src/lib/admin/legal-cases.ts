import { buildSheet, type ExcelColumn } from './excel'
import type { DatasetExport } from './dataset-export'

export type LegalCaseMatter =
  | 'corporativo'
  | 'contratos'
  | 'laboral'
  | 'tributario'
  | 'propiedad-intelectual'
  | 'litigios'
  | 'otra'

export type LegalCaseStatus = 'nuevo' | 'evaluacion' | 'en-curso' | 'en-espera' | 'cerrado'

export type LegalCasePriority = 'alta' | 'media' | 'baja'

export type LegalCase = {
  id: string
  code: string
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
  updatedAt: string
}

export const LEGAL_CASES_KEY = 'fj-legal-cases-v1'
export const LEGAL_CASES_UPDATED_EVENT = 'fj-legal-cases-updated'

export const legalMatterLabels: Record<LegalCaseMatter, string> = {
  corporativo: 'Corporativo y societario',
  contratos: 'Contratos y negociaciones',
  laboral: 'Laboral',
  tributario: 'Tributario',
  'propiedad-intelectual': 'Propiedad intelectual y tecnología',
  litigios: 'Litigios y arbitraje',
  otra: 'Otra materia / por definir',
}

export const legalStatusLabels: Record<LegalCaseStatus, string> = {
  nuevo: 'Nuevo',
  evaluacion: 'En evaluación',
  'en-curso': 'En curso',
  'en-espera': 'En espera del cliente',
  cerrado: 'Cerrado',
}

export const legalPriorityLabels: Record<LegalCasePriority, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export const legalStatusOrder: LegalCaseStatus[] = [
  'nuevo',
  'evaluacion',
  'en-curso',
  'en-espera',
  'cerrado',
]

const seedCases: LegalCase[] = [
  {
    id: 'legal-seed-1',
    code: 'LEG-2026-001',
    clientName: 'Comercial Andina S.A.C.',
    company: 'Comercial Andina S.A.C.',
    email: 'contacto@comercialandina.pe',
    phone: '+51 958 077 827',
    matter: 'contratos',
    summary: 'Revisión del contrato de servicios con un proveedor logístico antes de la firma.',
    status: 'evaluacion',
    priority: 'alta',
    owner: 'Dirección legal',
    openedAt: '2026-11-12T00:00:00.000Z',
    dueAt: '2026-11-25T00:00:00.000Z',
    nextStep: 'Devolver observaciones al área comercial y agendar reunión con el proveedor.',
    updatedAt: '2026-11-16T15:20:00.000Z',
  },
  {
    id: 'legal-seed-2',
    code: 'LEG-2026-002',
    clientName: 'Talleres del Norte S.A.C.',
    company: 'Talleres del Norte S.A.C.',
    email: 'administracion@talleresdelnorte.pe',
    phone: '',
    matter: 'laboral',
    summary: 'Revisión de contratos de trabajo y política interna de horarios para una nueva sede.',
    status: 'en-curso',
    priority: 'media',
    owner: 'Equipo laboral',
    openedAt: '2026-11-05T00:00:00.000Z',
    dueAt: '',
    nextStep: 'Consolidar plantillas de contrato y validar con recursos humanos.',
    updatedAt: '2026-11-14T10:05:00.000Z',
  },
  {
    id: 'legal-seed-3',
    code: 'LEG-2026-003',
    clientName: 'Nova Retail S.A.C.',
    company: 'Nova Retail S.A.C.',
    email: 'gerencia@novaretail.pe',
    phone: '',
    matter: 'tributario',
    summary: 'Acompañamiento en la respuesta a una fiscalización tributaria del periodo 2025.',
    status: 'cerrado',
    priority: 'baja',
    owner: 'Dirección legal',
    openedAt: '2026-09-18T00:00:00.000Z',
    dueAt: '2026-10-30T00:00:00.000Z',
    nextStep: 'Expediente archivado. Se mantiene copia en el repositorio legal.',
    updatedAt: '2026-10-31T09:40:00.000Z',
  },
]

function isMatter(value: unknown): value is LegalCaseMatter {
  return typeof value === 'string' && value in legalMatterLabels
}

function isStatus(value: unknown): value is LegalCaseStatus {
  return typeof value === 'string' && value in legalStatusLabels
}

function isPriority(value: unknown): value is LegalCasePriority {
  return typeof value === 'string' && value in legalPriorityLabels
}

function normalizeCase(value: unknown): LegalCase | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Partial<LegalCase>
  if (
    typeof record.id !== 'string' ||
    typeof record.code !== 'string' ||
    typeof record.clientName !== 'string'
  ) {
    return null
  }
  return {
    id: record.id,
    code: record.code,
    clientName: record.clientName,
    company: typeof record.company === 'string' ? record.company : '',
    email: typeof record.email === 'string' ? record.email : '',
    phone: typeof record.phone === 'string' ? record.phone : '',
    matter: isMatter(record.matter) ? record.matter : 'otra',
    summary: typeof record.summary === 'string' ? record.summary : '',
    status: isStatus(record.status) ? record.status : 'nuevo',
    priority: isPriority(record.priority) ? record.priority : 'media',
    owner: typeof record.owner === 'string' ? record.owner : '',
    openedAt: typeof record.openedAt === 'string' ? record.openedAt : new Date().toISOString(),
    dueAt: typeof record.dueAt === 'string' ? record.dueAt : '',
    nextStep: typeof record.nextStep === 'string' ? record.nextStep : '',
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : new Date().toISOString(),
  }
}

export function readLegalCases(): LegalCase[] {
  if (typeof window === 'undefined') return seedCases
  try {
    const raw = window.localStorage.getItem(LEGAL_CASES_KEY)
    if (!raw) {
      window.localStorage.setItem(LEGAL_CASES_KEY, JSON.stringify(seedCases))
      return seedCases
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return seedCases
    return parsed.map(normalizeCase).filter((entry): entry is LegalCase => entry !== null)
  } catch {
    return seedCases
  }
}

export function writeLegalCases(cases: LegalCase[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LEGAL_CASES_KEY, JSON.stringify(cases))
    window.dispatchEvent(new Event(LEGAL_CASES_UPDATED_EVENT))
  } catch {
    // Sin almacenamiento local el panel sigue mostrando los cambios en memoria.
  }
}

export function countOpenLegalCases() {
  return readLegalCases().filter((entry) => entry.status !== 'cerrado').length
}

export function buildLegalCaseCode(cases: LegalCase[], date = new Date()): string {
  const year = date.getFullYear()
  const prefix = `LEG-${year}-`
  const last = cases.reduce((max, entry) => {
    if (!entry.code.startsWith(prefix)) return max
    const sequence = Number.parseInt(entry.code.slice(prefix.length), 10)
    return Number.isFinite(sequence) ? Math.max(max, sequence) : max
  }, 0)
  return `${prefix}${String(last + 1).padStart(3, '0')}`
}

export function daysUntilDue(entry: LegalCase, today = new Date()): number | null {
  if (!entry.dueAt) return null
  const due = new Date(entry.dueAt)
  if (Number.isNaN(due.getTime())) return null
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const end = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate())
  return Math.round((end - start) / 86_400_000)
}

export function legalCasesDataset(cases: LegalCase[]): DatasetExport {
  const columns: ExcelColumn<LegalCase>[] = [
    { header: 'Código', width: 14, getValue: (entry) => entry.code },
    { header: 'Cliente', width: 26, getValue: (entry) => entry.clientName, wrap: true },
    { header: 'Empresa', width: 26, getValue: (entry) => entry.company, wrap: true },
    { header: 'Correo', width: 26, getValue: (entry) => entry.email },
    { header: 'Teléfono', width: 18, getValue: (entry) => entry.phone },
    { header: 'Materia', width: 28, getValue: (entry) => legalMatterLabels[entry.matter] },
    { header: 'Resumen', width: 48, getValue: (entry) => entry.summary, wrap: true },
    { header: 'Estado', width: 18, getValue: (entry) => legalStatusLabels[entry.status] },
    { header: 'Prioridad', width: 12, getValue: (entry) => legalPriorityLabels[entry.priority] },
    { header: 'Responsable', width: 20, getValue: (entry) => entry.owner },
    {
      header: 'Apertura',
      width: 14,
      getValue: (entry) => new Date(entry.openedAt),
      format: 'dd/mm/yyyy',
    },
    {
      header: 'Plazo',
      width: 14,
      getValue: (entry) => (entry.dueAt ? new Date(entry.dueAt) : null),
      format: 'dd/mm/yyyy',
    },
    { header: 'Siguiente paso', width: 40, getValue: (entry) => entry.nextStep, wrap: true },
    {
      header: 'Actualizado',
      width: 18,
      getValue: (entry) => new Date(entry.updatedAt),
      format: 'dd/mm/yyyy hh:mm',
    },
  ]

  return {
    prefix: 'casos-legales',
    title: 'Casos legales · SparkTree Legal',
    json: cases,
    sheets: [buildSheet('Casos', columns, cases)],
  }
}
