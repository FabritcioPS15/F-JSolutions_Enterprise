// Libro de Reclamaciones Virtual (server-only).
//
// La tienda registra los reclamos y el panel los atiende leyendo el mismo
// archivo, igual que las cuentas web: escritura serializada y reemplazo
// atómico. El archivo vive fuera de las apps para que ambas lo vean:
// `<repo>/.data/complaints-book.json` (configurable con FJ_DATA_DIR).

import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { isEmail } from './domain'

export type ComplaintKind = 'reclamo' | 'queja'
export type ComplaintStatus = 'pending' | 'review' | 'answered'
export type ComplaintDocumentType = 'dni' | 'ce' | 'pasaporte' | 'ruc'
export type ComplaintItemType = 'producto' | 'servicio'

export type ComplaintConsumer = {
  name: string
  documentType: ComplaintDocumentType
  documentNumber: string
  email: string
  phone: string
  address: string
  isMinor: boolean
  guardianName: string
}

export type ComplaintItem = {
  type: ComplaintItemType
  description: string
  amount: number | null
  orderCode: string
}

export type ComplaintResponse = {
  message: string
  respondedAt: string
}

export type Complaint = {
  id: string
  code: string
  kind: ComplaintKind
  status: ComplaintStatus
  consumer: ComplaintConsumer
  item: ComplaintItem
  detail: string
  request: string
  response: ComplaintResponse | null
  createdAt: string
  updatedAt: string
  dueAt: string
}

export type CreateComplaintInput = {
  kind: ComplaintKind
  consumer: Omit<ComplaintConsumer, 'isMinor' | 'guardianName'> & {
    isMinor?: boolean
    guardianName?: string
  }
  item: {
    type: ComplaintItemType
    description: string
    amount?: number | string | null
    orderCode?: string
  }
  detail: string
  request: string
  accepted: boolean
}

// Vista pública para la consulta en la tienda: sin datos de contacto ni
// dirección, solo lo necesario para conocer el estado y la respuesta.
export type ComplaintStatusView = {
  code: string
  kind: ComplaintKind
  status: ComplaintStatus
  createdAt: string
  dueAt: string
  respondedAt: string | null
  response: string | null
  itemDescription: string
}

export type ComplaintPatch = {
  status?: ComplaintStatus
  response?: string
}

export class ComplaintError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

type StoreFile = {
  version: 1
  sequence: number
  items: Complaint[]
}

const RESPONSE_DEADLINE_DAYS = 30

let queue: Promise<unknown> = Promise.resolve()

export function complaintsDataDir() {
  return process.env.FJ_DATA_DIR ?? path.join(process.cwd(), '..', '..', '.data')
}

export function complaintStorePath() {
  return path.join(complaintsDataDir(), 'complaints-book.json')
}

function withStore<T>(task: (store: StoreFile) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const store = await readStore()
    const result = await task(store)
    await writeStore(store)
    return result
  })
  queue = run.catch(() => undefined)
  return run
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(complaintStorePath(), 'utf8')
    const parsed = JSON.parse(raw) as Partial<StoreFile>
    if (!Array.isArray(parsed.items)) throw new Error('formato inválido')
    return {
      version: 1,
      sequence: typeof parsed.sequence === 'number' ? parsed.sequence : parsed.items.length,
      items: parsed.items,
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { version: 1, sequence: 0, items: [] }
    }
    throw new ComplaintError('No se pudo leer el libro de reclamaciones.', 500)
  }
}

async function writeStore(store: StoreFile) {
  const dir = complaintsDataDir()
  await mkdir(dir, { recursive: true })
  const target = complaintStorePath()
  const temp = `${target}.${process.pid}.tmp`
  await writeFile(temp, JSON.stringify(store, null, 2), 'utf8')
  await rename(temp, target)
}

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function normalizeKind(value: unknown): ComplaintKind {
  if (value === 'reclamo' || value === 'queja') return value
  throw new ComplaintError('Indica si tu caso es un reclamo o una queja.')
}

function normalizeStatus(value: unknown): ComplaintStatus {
  if (value === 'pending' || value === 'review' || value === 'answered') return value
  throw new ComplaintError('El estado indicado no es válido.')
}

function normalizeDocumentType(value: unknown): ComplaintDocumentType {
  if (value === 'dni' || value === 'ce' || value === 'pasaporte' || value === 'ruc') return value
  throw new ComplaintError('Selecciona el tipo de documento del consumidor.')
}

function normalizeItemType(value: unknown): ComplaintItemType {
  if (value === 'producto' || value === 'servicio') return value
  throw new ComplaintError('Indica si reclamas por un producto o un servicio.')
}

function normalizeAmount(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const amount = typeof value === 'number' ? value : Number(String(value).replace(',', '.'))
  if (!Number.isFinite(amount) || amount < 0) {
    throw new ComplaintError('El monto indicado no es válido.')
  }
  return Math.round(amount * 100) / 100
}

function formatCode(sequence: number, date: Date) {
  return `LR-${date.getFullYear()}-${String(sequence).padStart(5, '0')}`
}

function toStatusView(complaint: Complaint): ComplaintStatusView {
  return {
    code: complaint.code,
    kind: complaint.kind,
    status: complaint.status,
    createdAt: complaint.createdAt,
    dueAt: complaint.dueAt,
    respondedAt: complaint.response?.respondedAt ?? null,
    response: complaint.response?.message ?? null,
    itemDescription: complaint.item.description,
  }
}

export function createComplaint(input: CreateComplaintInput): Promise<Complaint> {
  const kind = normalizeKind(input.kind)
  const name = clean(input.consumer?.name, 160)
  const documentNumber = clean(input.consumer?.documentNumber, 24)
  const email = clean(input.consumer?.email, 160).toLowerCase()
  const phone = clean(input.consumer?.phone, 40)
  const address = clean(input.consumer?.address, 240)
  const isMinor = Boolean(input.consumer?.isMinor)
  const guardianName = clean(input.consumer?.guardianName, 160)
  const itemType = normalizeItemType(input.item?.type)
  const itemDescription = clean(input.item?.description, 240)
  const orderCode = clean(input.item?.orderCode, 60)
  const amount = normalizeAmount(input.item?.amount)
  const detail = clean(input.detail, 4000)
  const request = clean(input.request, 2000)

  if (name.length < 3) throw new ComplaintError('Escribe el nombre completo del consumidor.')
  if (documentNumber.length < 5 || documentNumber.length > 20) {
    throw new ComplaintError('El número de documento debe tener entre 5 y 20 caracteres.')
  }
  if (!isEmail(email)) throw new ComplaintError('Escribe un correo electrónico válido.')
  if (phone.length < 6) throw new ComplaintError('Escribe un teléfono de contacto.')
  if (address.length < 5) throw new ComplaintError('Escribe el domicilio del consumidor.')
  if (isMinor && guardianName.length < 3) {
    throw new ComplaintError('Indica el nombre del padre, madre o tutor del menor.')
  }
  if (itemDescription.length < 3) {
    throw new ComplaintError('Describe el producto o servicio involucrado.')
  }
  if (detail.length < 30) {
    throw new ComplaintError('El detalle del reclamo o queja debe tener al menos 30 caracteres.')
  }
  if (request.length < 10) {
    throw new ComplaintError('Indica el pedido concreto del consumidor.')
  }
  if (!input.accepted) {
    throw new ComplaintError('Debes aceptar la declaración jurada para registrar el reclamo.')
  }

  return withStore((store) => {
    const now = new Date()
    store.sequence += 1
    const due = new Date(now.getTime() + RESPONSE_DEADLINE_DAYS * 24 * 60 * 60 * 1000)
    const complaint: Complaint = {
      id: randomUUID(),
      code: formatCode(store.sequence, now),
      kind,
      status: 'pending',
      consumer: {
        name,
        documentType: normalizeDocumentType(input.consumer?.documentType),
        documentNumber,
        email,
        phone,
        address,
        isMinor,
        guardianName: isMinor ? guardianName : '',
      },
      item: {
        type: itemType,
        description: itemDescription,
        amount,
        orderCode,
      },
      detail,
      request,
      response: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dueAt: due.toISOString(),
    }
    store.items.unshift(complaint)
    return complaint
  })
}

export function listComplaints(): Promise<Complaint[]> {
  return withStore((store) =>
    [...store.items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  )
}

export function getComplaint(id: string): Promise<Complaint | null> {
  return withStore((store) => store.items.find((item) => item.id === id) ?? null)
}

export function lookupComplaint(code: string, email: string): Promise<ComplaintStatusView | null> {
  const normalizedCode = clean(code, 40).toUpperCase()
  const normalizedEmail = clean(email, 160).toLowerCase()
  if (!normalizedCode || !normalizedEmail) return Promise.resolve(null)

  return withStore((store) => {
    const complaint = store.items.find(
      (item) =>
        item.code.toUpperCase() === normalizedCode &&
        item.consumer.email.toLowerCase() === normalizedEmail
    )
    return complaint ? toStatusView(complaint) : null
  })
}

export function updateComplaint(id: string, patch: ComplaintPatch): Promise<Complaint | null> {
  return withStore((store) => {
    const complaint = store.items.find((item) => item.id === id)
    if (!complaint) return null

    const now = new Date().toISOString()
    const responseText = clean(patch.response, 4000)

    if (patch.response !== undefined) {
      if (responseText.length < 10) {
        throw new ComplaintError('La respuesta debe tener al menos 10 caracteres.')
      }
      complaint.response = { message: responseText, respondedAt: now }
      complaint.status = 'answered'
    } else if (patch.status !== undefined) {
      const status = normalizeStatus(patch.status)
      if (status === 'answered' && !complaint.response) {
        throw new ComplaintError('Registra la respuesta antes de marcar el reclamo como atendido.')
      }
      complaint.status = status
    }

    complaint.updatedAt = now
    return complaint
  })
}

export function complaintDeadlineDays() {
  return RESPONSE_DEADLINE_DAYS
}
