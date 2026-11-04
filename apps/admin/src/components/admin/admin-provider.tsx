'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { createSeedData } from '@/lib/admin/seed'
import { buildQuoteCode, slugify, statusLabels } from '@/lib/admin/format'
import {
  CatalogApiError,
  createBrand as createBrandNode,
  createCategory as createCategoryNode,
  deleteBrandNode,
  deleteCategoryNode,
  deleteProductNode,
  fetchCatalogSnapshot,
  saveProduct,
  updateBrandNode,
  updateCategoryNode,
  type CatalogSnapshot,
} from '@/lib/services/catalog'
import {
  createTicket as createHelpdeskTicket,
  deleteTicket as deleteHelpdeskTicket,
  fetchTickets,
  mapTicket,
  sendTicketReply,
  toApiChannel,
  toApiStatus,
  updateTicket as updateHelpdeskTicket,
  type TicketPatch,
} from '@/lib/admin/helpdesk'
import {
  CommercialApiError,
  deleteClientNode,
  deleteQuoteNode,
  fetchCommercialSnapshot,
  saveClient,
  saveQuote,
  updateQuoteStatusNode,
  type CommercialSnapshot,
} from '@/lib/services/commercial'
import type {
  ActivityEntry,
  ActivityType,
  AdminData,
  AdminProduct,
  Brand,
  Category,
  Client,
  ClientInput,
  DeploymentEnvironment,
  DeploymentInput,
  InventoryMovement,
  InventoryMovementInput,
  InventoryMovementType,
  ProductInput,
  ProductStatus,
  Quote,
  QuoteInput,
  QuoteLine,
  QuoteStatus,
  RequestInput,
  RequestStatus,
  ServiceRequest,
  StoreSettings,
  WebProject,
  WebProjectDeployment,
  WebProjectInput,
  WebProjectStatus,
  WebProjectType,
} from '@/lib/admin/types'

export const ADMIN_STORAGE_KEY = 'fj-systems-admin-v1'

export type CategoryPatch = Partial<
  Pick<Category, 'label' | 'slug' | 'description' | 'image' | 'status' | 'order'>
>

export type BrandPatch = Partial<
  Pick<Brand, 'name' | 'slug' | 'description' | 'logo' | 'status' | 'order'>
>

export type RequestPatch = Partial<
  Pick<
    ServiceRequest,
    | 'name'
    | 'company'
    | 'email'
    | 'phone'
    | 'topic'
    | 'message'
    | 'channel'
    | 'status'
    | 'notes'
    | 'quoteCode'
  >
>

type AdminContextValue = {
  hydrated: boolean
  catalogSource: 'local' | 'api'
  catalogError: string | null
  refreshCatalog: () => Promise<void>
  commercialSource: 'local' | 'api'
  commercialError: string | null
  refreshCommercial: () => Promise<void>
  products: AdminProduct[]
  categories: Category[]
  brands: Brand[]
  clients: Client[]
  quotes: Quote[]
  requests: ServiceRequest[]
  helpdeskError: string | null
  helpdeskSynced: boolean
  settings: StoreSettings
  activity: ActivityEntry[]
  inventoryMovements: InventoryMovement[]
  webProjects: WebProject[]
  createProduct: (input: ProductInput) => AdminProduct
  updateProduct: (id: string, input: ProductInput) => void
  unlinkProductTaxonomy: (id: string, level: 'category' | 'subcategory' | 'type') => boolean
  deleteProduct: (id: string) => void
  duplicateProduct: (id: string) => AdminProduct | null
  toggleProductStatus: (id: string) => void
  setProductStatus: (id: string, status: ProductStatus) => void
  bulkSetStatus: (ids: string[], status: ProductStatus) => void
  bulkDeleteProducts: (ids: string[]) => void
  registerMovement: (input: InventoryMovementInput) => { ok: boolean; error?: string }
  createProject: (input: WebProjectInput) => WebProject
  updateProject: (id: string, input: WebProjectInput) => void
  deleteProject: (id: string) => void
  registerDeployment: (
    projectId: string,
    input: DeploymentInput
  ) => WebProjectDeployment | null
  addCategory: (label: string) => boolean
  updateCategory: (id: string, patch: CategoryPatch) => boolean
  renameCategory: (id: string, label: string) => boolean
  removeCategory: (id: string) => boolean
  addSubcategory: (categoryId: string, label: string) => boolean
  renameSubcategory: (categoryId: string, subcategoryId: string, label: string) => boolean
  removeSubcategory: (categoryId: string, subcategoryId: string) => boolean
  addSubSubcategory: (categoryId: string, subcategoryId: string, label: string) => boolean
  renameSubSubcategory: (
    categoryId: string,
    subcategoryId: string,
    subSubcategoryId: string,
    label: string
  ) => boolean
  removeSubSubcategory: (categoryId: string, subcategoryId: string, subSubcategoryId: string) => boolean
  addBrand: (label: string, patch?: BrandPatch) => boolean
  updateBrand: (id: string, patch: BrandPatch) => boolean
  removeBrand: (id: string) => boolean
  createClient: (input: ClientInput) => Client
  updateClient: (id: string, input: ClientInput) => void
  removeClient: (id: string) => void
  createQuote: (input: QuoteInput) => Promise<Quote>
  updateQuote: (id: string, input: QuoteInput) => void
  removeQuote: (id: string) => void
  setQuoteStatus: (id: string, status: QuoteStatus) => void
  createRequest: (input: RequestInput) => Promise<ServiceRequest>
  updateRequest: (id: string, patch: RequestPatch) => Promise<void>
  removeRequest: (id: string) => Promise<void>
  setRequestStatus: (id: string, status: RequestStatus) => Promise<void>
  convertRequestToQuote: (id: string) => Promise<Quote | null>
  refreshRequests: () => Promise<void>
  replyToRequest: (
    id: string,
    input: { subject: string; message: string }
  ) => Promise<{ delivered: boolean; reason?: string }>
  updateSettings: (settings: StoreSettings) => void
  resetData: () => void
  exportData: () => string
  importData: (raw: string) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

type FlatCategory = Category & { parentId: string | null }

function flattenCategoryTree(
  categories: Category[],
  parentId: string | null = null
): FlatCategory[] {
  return categories.flatMap((category) => [
    { ...category, parentId },
    ...category.subcategories.flatMap((subcategory) => [
      {
        id: subcategory.id,
        label: subcategory.label,
        slug: slugify(subcategory.label),
        description: '',
        image: '',
        status: category.status,
        order: category.order,
        subcategories: [] as Category['subcategories'],
        parentId: category.id,
      },
      ...subcategory.subSubcategories.map((type) => ({
        id: type.id,
        label: type.label,
        slug: slugify(type.label),
        description: '',
        image: '',
        status: category.status,
        order: category.order,
        subcategories: [] as Category['subcategories'],
        parentId: subcategory.id,
      })),
    ]),
  ])
}

function buildCategoryTree(nodes: FlatCategory[]): Category[] {
  const sorted = [...nodes].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
  const byParent = new Map<string | null, FlatCategory[]>()
  for (const node of sorted) {
    const list = byParent.get(node.parentId) ?? []
    list.push(node)
    byParent.set(node.parentId, list)
  }

  return (byParent.get(null) ?? []).map((node) => ({
    id: node.id,
    label: node.label,
    slug: node.slug,
    description: node.description,
    image: node.image,
    status: node.status,
    order: node.order,
    subcategories: (byParent.get(node.id) ?? []).map((sub) => ({
      id: sub.id,
      label: sub.label,
      subSubcategories: (byParent.get(sub.id) ?? []).map((type) => ({
        id: type.id,
        label: type.label,
      })),
    })),
  }))
}

function mergeCategories(local: Category[], remote: Category[]): Category[] {
  const nodes = new Map<string, FlatCategory>()
  for (const node of flattenCategoryTree(local)) nodes.set(node.id, node)
  for (const node of flattenCategoryTree(remote)) nodes.set(node.id, node)
  return buildCategoryTree([...nodes.values()])
}

function mergeBrands(local: Brand[], remote: Brand[]): Brand[] {
  const nodes = new Map<string, Brand>()
  for (const brand of local) nodes.set(brand.id, brand)
  for (const brand of remote) nodes.set(brand.id, brand)
  const seenNames = new Set<string>()
  return [...nodes.values()].filter((brand) => {
    const key = brand.name.toLowerCase()
    if (seenNames.has(key)) return false
    seenNames.add(key)
    return true
  })
}

function mergeProducts(local: AdminProduct[], remote: AdminProduct[]): AdminProduct[] {
  const remoteIds = new Set(remote.map((product) => product.id))
  const remoteSlugs = new Set(remote.map((product) => product.slug))
  return [
    ...remote,
    ...local.filter(
      (product) => !remoteIds.has(product.id) && !remoteSlugs.has(product.slug)
    ),
  ]
}

function mergeCatalog(prev: AdminData, snapshot: CatalogSnapshot): AdminData {
  return {
    ...prev,
    products: mergeProducts(prev.products, snapshot.products),
    categories: mergeCategories(prev.categories, snapshot.categories),
    brands: mergeBrands(prev.brands, snapshot.brands),
  }
}

function mergeClients(local: Client[], remote: Client[]): Client[] {
  const remoteIds = new Set(remote.map((client) => client.id))
  return [...remote, ...local.filter((client) => !remoteIds.has(client.id))]
}

function mergeQuotes(local: Quote[], remote: Quote[]): Quote[] {
  const remoteIds = new Set(remote.map((quote) => quote.id))
  return [...remote, ...local.filter((quote) => !remoteIds.has(quote.id))]
}

function categoryApiInput(category: Category, parentId: string | null = null) {
  return {
    id: category.id,
    parentId,
    name: category.label,
    slug: category.slug,
    description: category.description,
    imageUrl: category.image,
    status: category.status,
    sortOrder: category.order,
  }
}

function allCategoryIds(categories: Category[]): string[] {
  return flattenCategoryTree(categories).map((category) => category.id)
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7)}${Date.now().toString(36).slice(-3)}`
}

function uniqueSlug(base: string, products: AdminProduct[], excludeId?: string) {
  const taken = new Set(
    products.filter((product) => product.id !== excludeId).map((product) => product.slug)
  )
  const root = base || 'producto'
  let candidate = root
  let index = 2
  while (taken.has(candidate)) {
    candidate = `${root}-${index}`
    index += 1
  }
  return candidate
}

function uniqueId(base: string, takenIds: string[]) {
  const taken = new Set(takenIds)
  let candidate = base || 'item'
  let index = 2
  while (taken.has(candidate)) {
    candidate = `${base}-${index}`
    index += 1
  }
  return candidate
}

function uniqueCategorySlug(base: string, categories: Category[], excludeId?: string) {
  const taken = new Set(
    categories.filter((category) => category.id !== excludeId).map((category) => category.slug)
  )
  const root = slugify(base) || 'categoria'
  let candidate = root
  let index = 2
  while (taken.has(candidate)) {
    candidate = `${root}-${index}`
    index += 1
  }
  return candidate
}

function uniqueBrandSlug(base: string, brands: Brand[], excludeId?: string) {
  const taken = new Set(brands.filter((brand) => brand.id !== excludeId).map((brand) => brand.slug))
  const root = slugify(base) || 'marca'
  let candidate = root
  let index = 2
  while (taken.has(candidate)) {
    candidate = `${root}-${index}`
    index += 1
  }
  return candidate
}

function normalizeProduct(raw: Record<string, unknown>): AdminProduct {
  const name = String(raw.name ?? 'Producto sin nombre')
  const id = String(raw.id ?? uid('producto'))
  const description = String(raw.description ?? '')
  return {
    id,
    slug: String(raw.slug ?? slugify(name) ?? id),
    name,
    shortDescription: String(raw.shortDescription ?? description),
    description,
    category: String(raw.category ?? ''),
    subcategory: raw.subcategory ? String(raw.subcategory) : undefined,
    subSubcategory: raw.subSubcategory ? String(raw.subSubcategory) : undefined,
    brand: String(raw.brand ?? ''),
    model: raw.model ? String(raw.model) : undefined,
    sku: String(raw.sku ?? ''),
    internalCode: raw.internalCode ? String(raw.internalCode) : undefined,
    price: Number(raw.price) || 0,
    cost: raw.cost != null && raw.cost !== '' ? Number(raw.cost) || 0 : undefined,
    showPrice: raw.showPrice === undefined ? true : Boolean(raw.showPrice),
    commercialMessage: String(raw.commercialMessage ?? ''),
    stock: Number(raw.stock) || 0,
    minStock: Number(raw.minStock) || 0,
    availability:
      raw.availability === 'limited' || raw.availability === 'consult'
        ? raw.availability
        : 'available',
    status:
      raw.status === 'draft' || raw.status === 'archived' ? raw.status : 'active',
    featured: Boolean(raw.featured),
    specs: Array.isArray(raw.specs) ? raw.specs.map((spec) => String(spec)) : [],
    image: String(raw.image ?? ''),
    imageAlt: String(raw.imageAlt ?? name),
    images: Array.isArray(raw.images) ? raw.images.map((image) => String(image)) : [],
    seoTitle: String(raw.seoTitle ?? ''),
    seoDescription: String(raw.seoDescription ?? ''),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  }
}

const activityTypes: ActivityType[] = [
  'created',
  'updated',
  'published',
  'unpublished',
  'archived',
  'restored',
  'duplicated',
  'deleted',
]

function normalizeActivity(raw: Record<string, unknown>): ActivityEntry {
  const type = activityTypes.includes(raw.type as ActivityType)
    ? (raw.type as ActivityType)
    : 'updated'
  return {
    id: String(raw.id ?? uid('actividad')),
    type,
    productId: raw.productId ? String(raw.productId) : undefined,
    productName: String(raw.productName ?? 'Producto'),
    detail: raw.detail ? String(raw.detail) : undefined,
    at: String(raw.at ?? new Date().toISOString()),
  }
}

const movementTypes: InventoryMovementType[] = ['in', 'out', 'adjustment']

function normalizeInventoryMovement(raw: Record<string, unknown>): InventoryMovement {
  return {
    id: String(raw.id ?? uid('movimiento')),
    productId: String(raw.productId ?? ''),
    productName: String(raw.productName ?? 'Producto'),
    sku: String(raw.sku ?? ''),
    type: movementTypes.includes(raw.type as InventoryMovementType)
      ? (raw.type as InventoryMovementType)
      : 'adjustment',
    quantity: Math.max(0, Math.trunc(Number(raw.quantity) || 0)),
    previousStock: Math.max(0, Math.trunc(Number(raw.previousStock) || 0)),
    resultingStock: Math.max(0, Math.trunc(Number(raw.resultingStock) || 0)),
    reason: String(raw.reason ?? 'Ajuste manual'),
    note: raw.note ? String(raw.note) : undefined,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  }
}

const projectTypes: WebProjectType[] = [
  'landing',
  'website',
  'webapp',
  'ecommerce',
  'maintenance',
]

const projectStatuses: WebProjectStatus[] = [
  'planning',
  'development',
  'staging',
  'live',
  'paused',
  'archived',
]

const deploymentEnvironments: DeploymentEnvironment[] = ['production', 'staging', 'preview']

function normalizeDeployment(raw: Record<string, unknown>): WebProjectDeployment {
  return {
    id: String(raw.id ?? uid('despliegue')),
    environment: deploymentEnvironments.includes(raw.environment as DeploymentEnvironment)
      ? (raw.environment as DeploymentEnvironment)
      : 'production',
    url: String(raw.url ?? ''),
    version: raw.version ? String(raw.version) : undefined,
    note: raw.note ? String(raw.note) : undefined,
    deployedAt: String(raw.deployedAt ?? new Date().toISOString()),
  }
}

function normalizeWebProject(raw: Record<string, unknown>): WebProject {
  const name = String(raw.name ?? 'Proyecto web')
  return {
    id: String(raw.id ?? uid('proyecto-web')),
    name,
    clientId: raw.clientId ? String(raw.clientId) : undefined,
    clientName: String(raw.clientName ?? ''),
    type: projectTypes.includes(raw.type as WebProjectType)
      ? (raw.type as WebProjectType)
      : 'website',
    status: projectStatuses.includes(raw.status as WebProjectStatus)
      ? (raw.status as WebProjectStatus)
      : 'planning',
    productionUrl: String(raw.productionUrl ?? ''),
    stagingUrl: String(raw.stagingUrl ?? ''),
    repoUrl: String(raw.repoUrl ?? ''),
    hosting: String(raw.hosting ?? ''),
    domain: String(raw.domain ?? ''),
    responsible: String(raw.responsible ?? ''),
    credentialLocation: String(raw.credentialLocation ?? ''),
    launchedAt: raw.launchedAt ? String(raw.launchedAt) : undefined,
    renewalAt: raw.renewalAt ? String(raw.renewalAt) : undefined,
    notes: String(raw.notes ?? ''),
    deployments: Array.isArray(raw.deployments)
      ? (raw.deployments as Record<string, unknown>[]).map(normalizeDeployment)
      : [],
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  }
}

type MovementSeed = {
  product: Pick<AdminProduct, 'id' | 'name' | 'sku'>
  type: InventoryMovementType
  quantity: number
  previousStock: number
  resultingStock: number
  reason: string
  note?: string
  at?: string
}

function buildMovement(seed: MovementSeed): InventoryMovement {
  return {
    id: uid('movimiento'),
    productId: seed.product.id,
    productName: seed.product.name,
    sku: seed.product.sku,
    type: seed.type,
    quantity: seed.quantity,
    previousStock: seed.previousStock,
    resultingStock: seed.resultingStock,
    reason: seed.reason,
    note: seed.note,
    createdAt: seed.at ?? new Date().toISOString(),
  }
}

function prependMovements(prev: AdminData, movements: InventoryMovement[]): InventoryMovement[] {
  return [...movements, ...prev.inventoryMovements].slice(0, 1000)
}

function baselineMovements(products: AdminProduct[]): InventoryMovement[] {
  return products
    .filter((product) => product.stock > 0)
    .map((product) => ({
      id: uid('movimiento'),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      type: 'adjustment' as const,
      quantity: product.stock,
      previousStock: 0,
      resultingStock: product.stock,
      reason: 'Carga inicial',
      note: 'Stock detectado al activar el historial de inventario.',
      createdAt: product.updatedAt,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function createActivity(
  type: ActivityType,
  productName: string,
  options: { productId?: string; detail?: string } = {}
): ActivityEntry {
  return {
    id: uid('actividad'),
    type,
    productName,
    productId: options.productId,
    detail: options.detail,
    at: new Date().toISOString(),
  }
}

function appendActivity(prev: AdminData, entries: ActivityEntry[]): AdminData {
  return { ...prev, activity: [...entries, ...prev.activity].slice(0, 120) }
}

function normalizeCategory(raw: Record<string, unknown>, index = 0): Category {
  const label = String(raw.label ?? 'Categoría')
  return {
    id: String(raw.id ?? slugify(label) ?? uid('categoria')),
    label,
    slug: String(raw.slug ?? slugify(label) ?? `categoria-${index + 1}`),
    description: String(raw.description ?? ''),
    image: String(raw.image ?? ''),
    status: raw.status === 'inactive' ? 'inactive' : 'active',
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : index,
    subcategories: Array.isArray(raw.subcategories)
      ? raw.subcategories.map((subRaw) => {
          const sub = subRaw as Record<string, unknown>
          const subLabel = String(sub.label ?? 'Subcategoría')
          return {
            id: String(sub.id ?? slugify(subLabel) ?? uid('sub')),
            label: subLabel,
            subSubcategories: Array.isArray(sub.subSubcategories)
              ? sub.subSubcategories.map((typeRaw) => {
                  const type = typeRaw as Record<string, unknown>
                  const typeLabel = String(type.label ?? 'Tipo')
                  return {
                    id: String(type.id ?? slugify(typeLabel) ?? uid('tipo')),
                    label: typeLabel,
                  }
                })
              : [],
          }
        })
      : [],
  }
}

function normalizeBrand(raw: unknown, index = 0): Brand {
  if (typeof raw === 'string') {
    const name = raw.trim() || 'Marca'
    return {
      id: slugify(name) || uid('marca'),
      name,
      slug: slugify(name) || uid('marca'),
      description: '',
      logo: '',
      status: 'active',
      order: index,
    }
  }

  const record = (raw ?? {}) as Record<string, unknown>
  const name = String(record.name ?? record.label ?? 'Marca')
  return {
    id: String(record.id ?? slugify(name) ?? uid('marca')),
    name,
    slug: String(record.slug ?? slugify(name) ?? `marca-${index + 1}`),
    description: String(record.description ?? ''),
    logo: String(record.logo ?? ''),
    status: record.status === 'inactive' ? 'inactive' : 'active',
    order: Number.isFinite(Number(record.order)) ? Number(record.order) : index,
  }
}

function normalizeClient(raw: Record<string, unknown>): Client {
  const name = String(raw.name ?? 'Cliente')
  return {
    id: String(raw.id ?? uid('cliente')),
    name,
    company: String(raw.company ?? ''),
    documentType:
      raw.documentType === 'dni' || raw.documentType === 'ruc' ? raw.documentType : undefined,
    documentNumber: raw.documentNumber ? String(raw.documentNumber) : undefined,
    email: String(raw.email ?? ''),
    phone: String(raw.phone ?? ''),
    city: String(raw.city ?? ''),
    address: String(raw.address ?? ''),
    segment: raw.segment === 'persona' ? 'persona' : 'empresa',
    status: raw.status === 'inactive' ? 'inactive' : 'active',
    notes: String(raw.notes ?? ''),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  }
}

const quoteStatuses: QuoteStatus[] = [
  'draft',
  'new',
  'review',
  'sent',
  'approved',
  'rejected',
  'expired',
]

const legacyQuoteStatuses: Record<string, QuoteStatus> = {
  answered: 'approved',
  closed: 'rejected',
}

function normalizeQuoteLine(raw: Record<string, unknown>): QuoteLine {
  return {
    id: String(raw.id ?? uid('linea')),
    productId: raw.productId ? String(raw.productId) : undefined,
    name: String(raw.name ?? 'Producto'),
    sku: raw.sku ? String(raw.sku) : undefined,
    quantity: Math.max(1, Math.trunc(Number(raw.quantity) || 1)),
    unitPrice: Math.max(0, Number(raw.unitPrice) || 0),
  }
}

function normalizeQuote(raw: Record<string, unknown>): Quote {
  const rawStatus = legacyQuoteStatuses[String(raw.status)] ?? raw.status
  return {
    id: String(raw.id ?? uid('cotizacion')),
    code: String(raw.code ?? 'COT-SIN-CODIGO'),
    clientId: raw.clientId ? String(raw.clientId) : undefined,
    clientName: String(raw.clientName ?? 'Cliente'),
    clientCompany: String(raw.clientCompany ?? ''),
    clientEmail: String(raw.clientEmail ?? ''),
    clientPhone: String(raw.clientPhone ?? ''),
    status: quoteStatuses.includes(rawStatus as QuoteStatus)
      ? (rawStatus as QuoteStatus)
      : 'draft',
    items: Array.isArray(raw.items)
      ? (raw.items as Record<string, unknown>[]).map(normalizeQuoteLine)
      : [],
    notes: String(raw.notes ?? ''),
    validUntil: String(raw.validUntil ?? ''),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  }
}

const requestStatuses: RequestStatus[] = ['new', 'review', 'attended', 'discarded']

function normalizeRequest(raw: Record<string, unknown>): ServiceRequest {
  return {
    id: String(raw.id ?? uid('solicitud')),
    code: String(raw.code ?? 'SOL-SIN-CODIGO'),
    name: String(raw.name ?? 'Contacto'),
    company: String(raw.company ?? ''),
    email: String(raw.email ?? ''),
    phone: String(raw.phone ?? ''),
    topic: String(raw.topic ?? 'Consulta'),
    message: String(raw.message ?? ''),
    channel:
      raw.channel === 'email' || raw.channel === 'whatsapp' || raw.channel === 'phone'
        ? raw.channel
        : 'web',
    status: requestStatuses.includes(raw.status as RequestStatus)
      ? (raw.status as RequestStatus)
      : 'new',
    clientId: raw.clientId ? String(raw.clientId) : undefined,
    quoteId: raw.quoteId ? String(raw.quoteId) : undefined,
    quoteCode: raw.quoteCode ? String(raw.quoteCode) : undefined,
    repliedAt: raw.repliedAt ? String(raw.repliedAt) : undefined,
    lastReply:
      raw.lastReply && typeof raw.lastReply === 'object'
        ? {
            subject: String((raw.lastReply as Record<string, unknown>).subject ?? ''),
            message: String((raw.lastReply as Record<string, unknown>).message ?? ''),
            delivered: Boolean((raw.lastReply as Record<string, unknown>).delivered),
            at: String((raw.lastReply as Record<string, unknown>).at ?? new Date().toISOString()),
          }
        : undefined,
    notes: String(raw.notes ?? ''),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  }
}

function parseData(raw: string): AdminData {
  const parsed = JSON.parse(raw) as unknown
  const record = parsed as { data?: unknown }
  const payload = (record.data ?? parsed) as Record<string, unknown>

  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.products)) {
    throw new Error('El archivo no contiene un catálogo válido.')
  }

  const seed = createSeedData()
  const settings = (payload.settings ?? {}) as Partial<StoreSettings>
  const products = (payload.products as Record<string, unknown>[]).map(normalizeProduct)
  const storedMovements = Array.isArray(payload.inventoryMovements)
    ? (payload.inventoryMovements as Record<string, unknown>[]).map(normalizeInventoryMovement)
    : []
  const storedProjects = Array.isArray(payload.webProjects)
    ? (payload.webProjects as Record<string, unknown>[]).map(normalizeWebProject)
    : []

  return {
    products,
    categories: Array.isArray(payload.categories)
      ? (payload.categories as Record<string, unknown>[]).map((category, index) =>
          normalizeCategory(category, index)
        )
      : seed.categories,
    brands: Array.isArray(payload.brands)
      ? (payload.brands as unknown[]).map((brand, index) => normalizeBrand(brand, index))
      : seed.brands,
    clients: Array.isArray(payload.clients)
      ? (payload.clients as Record<string, unknown>[]).map(normalizeClient)
      : seed.clients,
    quotes: Array.isArray(payload.quotes)
      ? (payload.quotes as Record<string, unknown>[]).map(normalizeQuote)
      : seed.quotes,
    requests: Array.isArray(payload.requests)
      ? (payload.requests as Record<string, unknown>[]).map(normalizeRequest)
      : seed.requests,
    settings: {
      ...seed.settings,
      ...settings,
      igv: Number(settings.igv ?? seed.settings.igv) || 0,
      lowStockThreshold: Number(settings.lowStockThreshold ?? seed.settings.lowStockThreshold) || 0,
    },
    activity: Array.isArray(payload.activity)
      ? (payload.activity as Record<string, unknown>[]).map(normalizeActivity)
      : [],
    inventoryMovements:
      storedMovements.length > 0 ? storedMovements : baselineMovements(products),
    webProjects: storedProjects,
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(() => createSeedData())
  const [hydrated, setHydrated] = useState(false)
  const [catalogSource, setCatalogSource] = useState<'local' | 'api'>('local')
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [commercialSource, setCommercialSource] = useState<'local' | 'api'>('local')
  const [commercialError, setCommercialError] = useState<string | null>(null)
  const [helpdeskError, setHelpdeskError] = useState<string | null>(null)
  const [helpdeskSynced, setHelpdeskSynced] = useState(false)

  useEffect(() => {
    void refreshCatalog().catch(() => undefined)
  }, [])

  function syncCatalog(task: Promise<unknown>) {
    void task.catch((error: unknown) => {
      setCatalogError(
        error instanceof Error
          ? error.message
          : 'No se pudo sincronizar el catálogo con la base de datos.'
      )
    })
  }

  function syncCommercial<T>(task: Promise<T>, onSuccess?: (value: T) => void) {
    void task
      .then((value) => {
        onSuccess?.(value)
        setCommercialError(null)
      })
      .catch((error: unknown) => {
        setCommercialError(
          error instanceof Error
            ? error.message
            : 'No se pudo sincronizar la información comercial con la base de datos.'
        )
      })
  }

  async function refreshCommercial() {
    try {
      const snapshot: CommercialSnapshot = await fetchCommercialSnapshot()
      setData((prev) => ({
        ...prev,
        clients: mergeClients(prev.clients, snapshot.clients),
        quotes: mergeQuotes(prev.quotes, snapshot.quotes),
      }))
      setCommercialSource(
        snapshot.clients.length > 0 || snapshot.quotes.length > 0 ? 'api' : 'local'
      )
      setCommercialError(null)
    } catch (error) {
      setCommercialSource('local')
      setCommercialError(
        error instanceof CommercialApiError
          ? error.message
          : 'No se pudo cargar la información comercial desde la API. Se usa el respaldo local.'
      )
      throw error
    }
  }

  async function refreshCatalog() {
    try {
      const snapshot = await fetchCatalogSnapshot()
      setData((prev) => mergeCatalog(prev, snapshot))
      setCatalogSource(
        snapshot.products.length > 0 ||
          snapshot.categories.length > 0 ||
          snapshot.brands.length > 0
          ? 'api'
          : 'local'
      )
      setCatalogError(null)
    } catch (error) {
      setCatalogSource('local')
      setCatalogError(
        error instanceof CatalogApiError
          ? error.message
          : 'No se pudo cargar el catálogo desde la API. Se usa el respaldo local.'
      )
      throw error
    }
  }

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ADMIN_STORAGE_KEY)
      if (stored) setData(parseData(stored))
    } catch (error) {
      console.warn('No se pudo leer el catálogo local de FJ Systems.', error)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify({ version: 5, data })
      )
    } catch (error) {
      console.warn('No se pudo guardar el catálogo local.', error)
    }
  }, [data, hydrated])

  useEffect(() => {
    if (!hydrated) return
    void refreshRequests().catch(() => undefined)
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return
    void refreshCommercial().catch(() => undefined)
  }, [hydrated])

  function createProduct(input: ProductInput) {
    const now = new Date().toISOString()
    const product: AdminProduct = {
      ...input,
      slug: uniqueSlug(input.slug || slugify(input.name), data.products),
      id: uid(slugify(input.slug || input.name) || 'producto'),
      createdAt: now,
      updatedAt: now,
    }
    const initialMovement =
      product.stock > 0
        ? buildMovement({
            product,
            type: 'adjustment',
            quantity: product.stock,
            previousStock: 0,
            resultingStock: product.stock,
            reason: 'Carga inicial',
            note: 'Stock registrado al crear el producto.',
            at: now,
          })
        : null
    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: [product, ...prev.products],
          inventoryMovements: initialMovement
            ? prependMovements(prev, [initialMovement])
            : prev.inventoryMovements,
        },
        [
          createActivity('created', product.name, {
            productId: product.id,
            detail: 'Producto creado',
          }),
        ]
      )
    )
    syncCatalog(
      saveProduct(product).then((saved) =>
        setData((prev) => ({
          ...prev,
          products: prev.products.map((item) => (item.id === saved.id ? saved : item)),
        }))
      )
    )
    return product
  }

  function updateProduct(id: string, input: ProductInput) {
    const current = data.products.find((product) => product.id === id)
    if (!current) return
    const slug = uniqueSlug(input.slug || slugify(input.name), data.products, id)
    const now = new Date().toISOString()
    const updated: AdminProduct = { ...current, ...input, slug, updatedAt: now }
    const stockMovement =
      input.stock !== current.stock
        ? buildMovement({
            product: { id, name: input.name, sku: input.sku },
            type: 'adjustment',
            quantity: input.stock,
            previousStock: current.stock,
            resultingStock: input.stock,
            reason: 'Edición de ficha',
            note: 'Stock actualizado desde la ficha del producto.',
            at: now,
          })
        : null
    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: prev.products.map((product) =>
            product.id === id ? updated : product
          ),
          inventoryMovements: stockMovement
            ? prependMovements(prev, [stockMovement])
            : prev.inventoryMovements,
        },
        [
          createActivity('updated', input.name, {
            productId: id,
            detail:
              current.status !== input.status
                ? `Estado cambiado a ${statusLabels[input.status]}`
                : 'Ficha actualizada',
          }),
        ]
      )
    )
    syncCatalog(
      saveProduct(updated).then((saved) =>
        setData((prev) => ({
          ...prev,
          products: prev.products.map((item) => (item.id === saved.id ? saved : item)),
        }))
      )
    )
  }

  function unlinkProductTaxonomy(id: string, level: 'category' | 'subcategory' | 'type') {
    const current = data.products.find((product) => product.id === id)
    if (!current) return false
    if (level === 'category' && !current.category) return false
    if (level === 'subcategory' && !current.subcategory) return false
    if (level === 'type' && !current.subSubcategory) return false

    const detail =
      level === 'category'
        ? `Desvinculado de la categoría “${current.category}”`
        : level === 'subcategory'
          ? `Desvinculado de la subcategoría “${current.subcategory ?? ''}”`
          : `Desvinculado del tipo “${current.subSubcategory ?? ''}”`

    const patch =
      level === 'category'
        ? { category: '', subcategory: undefined, subSubcategory: undefined }
        : level === 'subcategory'
          ? { subcategory: undefined, subSubcategory: undefined }
          : { subSubcategory: undefined }

    const updated: AdminProduct = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: prev.products.map((product) =>
            product.id === id ? updated : product
          ),
        },
        [createActivity('updated', current.name, { productId: id, detail })]
      )
    )
    syncCatalog(
      saveProduct(updated).then((saved) =>
        setData((prev) => ({
          ...prev,
          products: prev.products.map((item) => (item.id === saved.id ? saved : item)),
        }))
      )
    )
    return true
  }

  function deleteProduct(id: string) {
    const current = data.products.find((product) => product.id === id)
    if (!current) return
    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: prev.products.filter((product) => product.id !== id),
        },
        [createActivity('deleted', current.name, { detail: 'Eliminado del catálogo' })]
      )
    )
    syncCatalog(deleteProductNode(id))
  }

  function duplicateProduct(id: string) {
    const source = data.products.find((product) => product.id === id)
    if (!source) return null
    const now = new Date().toISOString()
    const slug = uniqueSlug(`${source.slug}-copia`, data.products)
    const copy: AdminProduct = {
      ...source,
      id: uid(slug),
      slug,
      name: `${source.name} (copia)`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    }
    const initialMovement =
      copy.stock > 0
        ? buildMovement({
            product: copy,
            type: 'adjustment',
            quantity: copy.stock,
            previousStock: 0,
            resultingStock: copy.stock,
            reason: 'Carga inicial',
            note: `Stock inicial de la copia de ${source.name}.`,
            at: now,
          })
        : null
    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: [copy, ...prev.products],
          inventoryMovements: initialMovement
            ? prependMovements(prev, [initialMovement])
            : prev.inventoryMovements,
        },
        [
          createActivity('duplicated', copy.name, {
            productId: copy.id,
            detail: `Copia de ${source.name}`,
          }),
        ]
      )
    )
    syncCatalog(
      saveProduct(copy).then((saved) =>
        setData((prev) => ({
          ...prev,
          products: prev.products.map((item) => (item.id === saved.id ? saved : item)),
        }))
      )
    )
    return copy
  }

  function toggleProductStatus(id: string) {
    const product = data.products.find((item) => item.id === id)
    if (!product) return
    setProductStatus(id, product.status === 'active' ? 'draft' : 'active')
  }

  function setProductStatus(id: string, status: ProductStatus) {
    const product = data.products.find((item) => item.id === id)
    if (!product || product.status === status) return
    const type: ActivityType =
      status === 'active'
        ? product.status === 'archived'
          ? 'restored'
          : 'published'
        : status === 'archived'
          ? 'archived'
          : 'unpublished'
    const detail =
      status === 'active'
        ? product.status === 'archived'
          ? 'Restaurado y publicado'
          : 'Producto publicado'
        : status === 'archived'
          ? 'Producto archivado'
          : 'Producto retirado de publicación'
    const updated: AdminProduct = { ...product, status, updatedAt: new Date().toISOString() }
    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: prev.products.map((item) => (item.id === id ? updated : item)),
        },
        [createActivity(type, product.name, { productId: id, detail })]
      )
    )
    syncCatalog(
      saveProduct(updated).then((saved) =>
        setData((prev) => ({
          ...prev,
          products: prev.products.map((item) => (item.id === saved.id ? saved : item)),
        }))
      )
    )
  }

  function bulkSetStatus(ids: string[], status: ProductStatus) {
    const targetIds = new Set(ids)
    const affected = data.products.filter(
      (product) => targetIds.has(product.id) && product.status !== status
    )
    if (affected.length === 0) return
    const type: ActivityType =
      status === 'active' ? 'published' : status === 'archived' ? 'archived' : 'unpublished'
    const now = new Date().toISOString()
    const updatedProducts = data.products
      .filter((product) => targetIds.has(product.id) && product.status !== status)
      .map((product) => ({ ...product, status, updatedAt: now }))
    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: prev.products.map((product) =>
            targetIds.has(product.id) && product.status !== status
              ? { ...product, status, updatedAt: now }
              : product
          ),
        },
        [
          createActivity(
            type,
            `${affected.length} ${affected.length === 1 ? 'producto' : 'productos'}`,
            { detail: `Estado cambiado a ${statusLabels[status]}` }
          ),
        ]
      )
    )
    for (const product of updatedProducts) {
      syncCatalog(
        saveProduct(product).then((saved) =>
          setData((prev) => ({
            ...prev,
            products: prev.products.map((item) => (item.id === saved.id ? saved : item)),
          }))
        )
      )
    }
  }

  function bulkDeleteProducts(ids: string[]) {
    const targetIds = new Set(ids)
    const affected = data.products.filter((product) => targetIds.has(product.id))
    if (affected.length === 0) return
    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: prev.products.filter((product) => !targetIds.has(product.id)),
        },
        [
          createActivity(
            'deleted',
            `${affected.length} ${affected.length === 1 ? 'producto' : 'productos'}`,
            { detail: 'Eliminados del catálogo' }
          ),
        ]
      )
    )
    for (const product of affected) {
      syncCatalog(deleteProductNode(product.id))
    }
  }

  function registerMovement(input: InventoryMovementInput): { ok: boolean; error?: string } {
    const product = data.products.find((item) => item.id === input.productId)
    if (!product) return { ok: false, error: 'Selecciona un producto válido.' }

    const quantity = Math.trunc(Number(input.quantity))
    if (!Number.isFinite(quantity)) {
      return { ok: false, error: 'Ingresa una cantidad válida.' }
    }
    if (input.type === 'adjustment' && quantity < 0) {
      return { ok: false, error: 'El stock ajustado no puede ser negativo.' }
    }
    if (input.type !== 'adjustment' && quantity <= 0) {
      return { ok: false, error: 'La cantidad debe ser mayor que cero.' }
    }
    if (input.type === 'out' && quantity > product.stock) {
      return { ok: false, error: `Solo hay ${product.stock} unidades disponibles.` }
    }

    const resultingStock =
      input.type === 'in'
        ? product.stock + quantity
        : input.type === 'out'
          ? product.stock - quantity
          : quantity

    if (resultingStock === product.stock) {
      return { ok: false, error: 'El stock resultante es igual al actual.' }
    }

    const now = new Date().toISOString()
    const movement = buildMovement({
      product,
      type: input.type,
      quantity,
      previousStock: product.stock,
      resultingStock,
      reason: input.reason.trim() || 'Movimiento manual',
      note: input.note?.trim() || undefined,
      at: now,
    })

    const updatedProduct: AdminProduct = {
      ...product,
      stock: resultingStock,
      updatedAt: now,
    }
    setData((prev) => ({
      ...prev,
      products: prev.products.map((item) =>
        item.id === product.id ? updatedProduct : item
      ),
      inventoryMovements: prependMovements(prev, [movement]),
    }))
    syncCatalog(
      saveProduct(updatedProduct).then((saved) =>
        setData((prev) => ({
          ...prev,
          products: prev.products.map((item) => (item.id === saved.id ? saved : item)),
        }))
      )
    )

    return { ok: true }
  }

  function createProject(input: WebProjectInput): WebProject {
    const now = new Date().toISOString()
    const project: WebProject = {
      ...input,
      id: uid('proyecto-web'),
      deployments: [],
      createdAt: now,
      updatedAt: now,
    }
    setData((prev) => ({ ...prev, webProjects: [project, ...prev.webProjects] }))
    return project
  }

  function updateProject(id: string, input: WebProjectInput) {
    setData((prev) => ({
      ...prev,
      webProjects: prev.webProjects.map((project) =>
        project.id === id
          ? { ...project, ...input, updatedAt: new Date().toISOString() }
          : project
      ),
    }))
  }

  function deleteProject(id: string) {
    setData((prev) => ({
      ...prev,
      webProjects: prev.webProjects.filter((project) => project.id !== id),
    }))
  }

  function registerDeployment(
    projectId: string,
    input: DeploymentInput
  ): WebProjectDeployment | null {
    const project = data.webProjects.find((item) => item.id === projectId)
    if (!project) return null

    const now = new Date().toISOString()
    const deployment: WebProjectDeployment = {
      id: uid('despliegue'),
      environment: input.environment,
      url: input.url.trim(),
      version: input.version?.trim() || undefined,
      note: input.note?.trim() || undefined,
      deployedAt: input.deployedAt || now,
    }

    setData((prev) => ({
      ...prev,
      webProjects: prev.webProjects.map((item) => {
        if (item.id !== projectId) return item
        return {
          ...item,
          productionUrl:
            deployment.environment === 'production' && deployment.url
              ? deployment.url
              : item.productionUrl,
          stagingUrl:
            deployment.environment === 'staging' && deployment.url
              ? deployment.url
              : item.stagingUrl,
          deployments: [deployment, ...item.deployments].slice(0, 50),
          updatedAt: now,
        }
      }),
    }))

    return deployment
  }

  function addCategory(label: string) {
    const clean = label.trim()
    if (!clean) return false
    if (data.categories.some((category) => category.label.toLowerCase() === clean.toLowerCase())) {
      return false
    }
    const id = uniqueId(slugify(clean) || 'categoria', data.categories.map((category) => category.id))
    const slug = uniqueCategorySlug(clean, data.categories)
    setData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id,
          label: clean,
          slug,
          description: '',
          image: '',
          status: 'active',
          order: prev.categories.length,
          subcategories: [],
        },
      ],
    }))
    syncCatalog(
      createCategoryNode({
        id,
        name: clean,
        slug,
        status: 'active',
        sortOrder: data.categories.length,
      })
    )
    return true
  }

  function updateCategory(id: string, patch: CategoryPatch) {
    const category = data.categories.find((item) => item.id === id)
    if (!category) return false
    const nextLabel = patch.label?.trim() || category.label
    if (!nextLabel) return false
    if (
      data.categories.some(
        (item) => item.id !== id && item.label.toLowerCase() === nextLabel.toLowerCase()
      )
    ) {
      return false
    }

    const renamed = nextLabel !== category.label
    const nextSlug = uniqueCategorySlug(patch.slug?.trim() || category.slug || nextLabel, data.categories, id)
    const nextOrder =
      patch.order !== undefined && Number.isFinite(Number(patch.order))
        ? Math.trunc(Number(patch.order))
        : category.order
    const now = new Date().toISOString()

    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === id
          ? {
              ...item,
              label: nextLabel,
              slug: nextSlug,
              description: patch.description !== undefined ? patch.description.trim() : item.description,
              image: patch.image !== undefined ? patch.image.trim() : item.image,
              status: patch.status ?? item.status,
              order: nextOrder,
            }
          : item
      ),
      products: renamed
        ? prev.products.map((product) =>
            product.category === category.label
              ? { ...product, category: nextLabel, updatedAt: now }
              : product
          )
        : prev.products,
    }))
    syncCatalog(
      updateCategoryNode(id, {
        name: nextLabel,
        slug: nextSlug,
        description:
          patch.description !== undefined ? patch.description.trim() : category.description,
        imageUrl: patch.image !== undefined ? patch.image.trim() : category.image,
        status: patch.status ?? category.status,
        sortOrder: nextOrder,
      })
    )
    return true
  }

  function renameCategory(id: string, label: string) {
    const clean = label.trim()
    const category = data.categories.find((item) => item.id === id)
    if (!category || !clean) return false
    if (category.label === clean) return true
    if (
      data.categories.some(
        (item) => item.id !== id && item.label.toLowerCase() === clean.toLowerCase()
      )
    ) {
      return false
    }
    const now = new Date().toISOString()
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === id ? { ...item, label: clean } : item
      ),
      products: prev.products.map((product) =>
        product.category === category.label
          ? { ...product, category: clean, updatedAt: now }
          : product
      ),
    }))
    syncCatalog(updateCategoryNode(id, { name: clean }))
    return true
  }

  function removeCategory(id: string) {
    const category = data.categories.find((item) => item.id === id)
    if (!category) return false
    if (category.subcategories.length > 0) return false
    if (data.products.some((product) => product.category === category.label)) return false
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((item) => item.id !== id),
    }))
    syncCatalog(deleteCategoryNode(id))
    return true
  }

  function addSubcategory(categoryId: string, label: string) {
    const clean = label.trim()
    const category = data.categories.find((item) => item.id === categoryId)
    if (!clean || !category) return false
    if (category.subcategories.some((sub) => sub.label.toLowerCase() === clean.toLowerCase())) {
      return false
    }
    const id = uniqueId(
      `${category.id}-${slugify(clean) || 'subcategoria'}`,
      allCategoryIds(data.categories)
    )
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === categoryId
          ? {
              ...item,
              subcategories: [...item.subcategories, { id, label: clean, subSubcategories: [] }],
            }
          : item
      ),
    }))
    syncCatalog(
      (async () => {
        await createCategoryNode(categoryApiInput(category))
        await createCategoryNode({
          id,
          parentId: category.id,
          name: clean,
          slug: id,
          status: 'active',
          sortOrder: category.subcategories.length,
        })
      })()
    )
    return true
  }

  function renameSubcategory(categoryId: string, subcategoryId: string, label: string) {
    const clean = label.trim()
    const category = data.categories.find((item) => item.id === categoryId)
    const sub = category?.subcategories.find((item) => item.id === subcategoryId)
    if (!category || !sub || !clean) return false
    if (sub.label === clean) return true
    if (category.subcategories.some((item) => item.id !== subcategoryId && item.label.toLowerCase() === clean.toLowerCase())) {
      return false
    }
    const now = new Date().toISOString()
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === categoryId
          ? {
              ...item,
              subcategories: item.subcategories.map((subItem) =>
                subItem.id === subcategoryId ? { ...subItem, label: clean } : subItem
              ),
            }
          : item
      ),
      products: prev.products.map((product) =>
        product.category === category.label && product.subcategory === sub.label
          ? { ...product, subcategory: clean, updatedAt: now }
          : product
      ),
    }))
    syncCatalog(
      (async () => {
        await createCategoryNode(categoryApiInput(category))
        await updateCategoryNode(subcategoryId, {
          id: subcategoryId,
          parentId: category.id,
          name: clean,
          slug: subcategoryId,
        })
      })()
    )
    return true
  }

  function removeSubcategory(categoryId: string, subcategoryId: string) {
    const category = data.categories.find((item) => item.id === categoryId)
    const sub = category?.subcategories.find((item) => item.id === subcategoryId)
    if (!category || !sub) return false
    if (sub.subSubcategories.length > 0) return false
    if (
      data.products.some(
        (product) => product.category === category.label && product.subcategory === sub.label
      )
    ) {
      return false
    }
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === categoryId
          ? {
              ...item,
              subcategories: item.subcategories.filter((subItem) => subItem.id !== subcategoryId),
            }
          : item
      ),
    }))
    syncCatalog(deleteCategoryNode(subcategoryId))
    return true
  }

  function addSubSubcategory(categoryId: string, subcategoryId: string, label: string) {
    const clean = label.trim()
    const category = data.categories.find((item) => item.id === categoryId)
    const sub = category?.subcategories.find((item) => item.id === subcategoryId)
    if (!clean || !category || !sub) return false
    if (sub.subSubcategories.some((type) => type.label.toLowerCase() === clean.toLowerCase())) {
      return false
    }
    const id = uniqueId(
      `${subcategoryId}-${slugify(clean) || 'tipo'}`,
      allCategoryIds(data.categories)
    )
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === categoryId
          ? {
              ...item,
              subcategories: item.subcategories.map((subItem) =>
                subItem.id === subcategoryId
                  ? {
                      ...subItem,
                      subSubcategories: [
                        ...subItem.subSubcategories,
                        { id, label: clean },
                      ],
                    }
                  : subItem
              ),
            }
          : item
      ),
    }))
    syncCatalog(
      (async () => {
        await createCategoryNode(categoryApiInput(category))
        await createCategoryNode({
          id: sub.id,
          parentId: category.id,
          name: sub.label,
          slug: sub.id,
          status: category.status,
        })
        await createCategoryNode({
          id,
          parentId: sub.id,
          name: clean,
          slug: id,
          status: 'active',
          sortOrder: sub.subSubcategories.length,
        })
      })()
    )
    return true
  }

  function renameSubSubcategory(
    categoryId: string,
    subcategoryId: string,
    subSubcategoryId: string,
    label: string
  ) {
    const clean = label.trim()
    const category = data.categories.find((item) => item.id === categoryId)
    const sub = category?.subcategories.find((item) => item.id === subcategoryId)
    const type = sub?.subSubcategories.find((item) => item.id === subSubcategoryId)
    if (!category || !sub || !type || !clean) return false
    if (type.label === clean) return true
    if (
      sub.subSubcategories.some(
        (item) => item.id !== subSubcategoryId && item.label.toLowerCase() === clean.toLowerCase()
      )
    ) {
      return false
    }
    const now = new Date().toISOString()
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === categoryId
          ? {
              ...item,
              subcategories: item.subcategories.map((subItem) =>
                subItem.id === subcategoryId
                  ? {
                      ...subItem,
                      subSubcategories: subItem.subSubcategories.map((typeItem) =>
                        typeItem.id === subSubcategoryId
                          ? { ...typeItem, label: clean }
                          : typeItem
                      ),
                    }
                  : subItem
              ),
            }
          : item
      ),
      products: prev.products.map((product) =>
        product.category === category.label &&
        product.subcategory === sub.label &&
        product.subSubcategory === type.label
          ? { ...product, subSubcategory: clean, updatedAt: now }
          : product
      ),
    }))
    syncCatalog(
      (async () => {
        await createCategoryNode(categoryApiInput(category))
        await createCategoryNode({
          id: sub.id,
          parentId: category.id,
          name: sub.label,
          slug: sub.id,
          status: category.status,
        })
        await updateCategoryNode(subSubcategoryId, {
          id: subSubcategoryId,
          parentId: sub.id,
          name: clean,
          slug: subSubcategoryId,
        })
      })()
    )
    return true
  }

  function removeSubSubcategory(
    categoryId: string,
    subcategoryId: string,
    subSubcategoryId: string
  ) {
    const category = data.categories.find((item) => item.id === categoryId)
    const sub = category?.subcategories.find((item) => item.id === subcategoryId)
    const type = sub?.subSubcategories.find((item) => item.id === subSubcategoryId)
    if (!category || !sub || !type) return false
    if (
      data.products.some(
        (product) =>
          product.category === category.label &&
          product.subcategory === sub.label &&
          product.subSubcategory === type.label
      )
    ) {
      return false
    }
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === categoryId
          ? {
              ...item,
              subcategories: item.subcategories.map((subItem) =>
                subItem.id === subcategoryId
                  ? {
                      ...subItem,
                      subSubcategories: subItem.subSubcategories.filter(
                        (typeItem) => typeItem.id !== subSubcategoryId
                      ),
                    }
                  : subItem
              ),
            }
          : item
      ),
    }))
    syncCatalog(deleteCategoryNode(subSubcategoryId))
    return true
  }

  function addBrand(label: string, patch: BrandPatch = {}) {
    const clean = label.trim()
    if (!clean) return false
    if (data.brands.some((brand) => brand.name.toLowerCase() === clean.toLowerCase())) return false
    const slug = uniqueBrandSlug(patch.slug?.trim() || clean, data.brands)
    const id = uniqueId(slug, data.brands.map((brand) => brand.id))
    const brand: Brand = {
      id,
      name: clean,
      slug,
      description: patch.description?.trim() ?? '',
      logo: patch.logo?.trim() ?? '',
      status: patch.status ?? 'active',
      order: patch.order ?? data.brands.length,
    }
    setData((prev) => ({
      ...prev,
      brands: [...prev.brands, brand],
    }))
    syncCatalog(
      createBrandNode({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logoUrl: brand.logo,
        status: brand.status,
        sortOrder: brand.order,
      })
    )
    return true
  }

  function updateBrand(id: string, patch: BrandPatch) {
    const brand = data.brands.find((item) => item.id === id)
    if (!brand) return false
    const nextName = patch.name?.trim() || brand.name
    if (!nextName) return false
    if (
      data.brands.some(
        (item) => item.id !== id && item.name.toLowerCase() === nextName.toLowerCase()
      )
    ) {
      return false
    }

    const renamed = nextName !== brand.name
    const nextSlug = uniqueBrandSlug(patch.slug?.trim() || brand.slug || nextName, data.brands, id)
    const nextOrder =
      patch.order !== undefined && Number.isFinite(Number(patch.order))
        ? Math.trunc(Number(patch.order))
        : brand.order
    const now = new Date().toISOString()

    const updatedBrand: Brand = {
      ...brand,
      name: nextName,
      slug: nextSlug,
      description:
        patch.description !== undefined ? patch.description.trim() : brand.description,
      logo: patch.logo !== undefined ? patch.logo.trim() : brand.logo,
      status: patch.status ?? brand.status,
      order: nextOrder,
    }

    setData((prev) => ({
      ...prev,
      brands: prev.brands.map((item) => (item.id === id ? updatedBrand : item)),
      products: renamed
        ? prev.products.map((product) =>
            product.brand === brand.name
              ? { ...product, brand: nextName, updatedAt: now }
              : product
          )
        : prev.products,
    }))
    syncCatalog(
      updateBrandNode(id, {
        name: updatedBrand.name,
        slug: updatedBrand.slug,
        description: updatedBrand.description,
        logoUrl: updatedBrand.logo,
        status: updatedBrand.status,
        sortOrder: updatedBrand.order,
      })
    )
    return true
  }

  function removeBrand(id: string) {
    const brand = data.brands.find((item) => item.id === id)
    if (!brand) return false
    if (data.products.some((product) => product.brand === brand.name)) return false
    setData((prev) => ({ ...prev, brands: prev.brands.filter((item) => item.id !== id) }))
    syncCatalog(deleteBrandNode(id))
    return true
  }

  function createClient(input: ClientInput) {
    const now = new Date().toISOString()
    const client: Client = { ...input, id: uid('cliente'), createdAt: now, updatedAt: now }
    setData((prev) => ({ ...prev, clients: [client, ...prev.clients] }))
    syncCommercial(saveClient(client), (saved) =>
      setData((prev) => ({
        ...prev,
        clients: prev.clients.map((item) => (item.id === saved.id ? saved : item)),
      }))
    )
    return client
  }

  function updateClient(id: string, input: ClientInput) {
    const current = data.clients.find((client) => client.id === id)
    if (!current) return
    const now = new Date().toISOString()
    const updated: Client = { ...current, ...input, updatedAt: now }
    setData((prev) => ({
      ...prev,
      clients: prev.clients.map((client) => (client.id === id ? updated : client)),
      quotes: prev.quotes.map((quote) =>
        quote.clientId === id
          ? {
              ...quote,
              clientName: input.name,
              clientCompany: input.company,
              clientEmail: input.email,
              clientPhone: input.phone,
            }
          : quote
      ),
      webProjects: prev.webProjects.map((project) =>
        project.clientId === id
          ? { ...project, clientName: input.company || input.name }
          : project
      ),
    }))
    syncCommercial(saveClient(updated), (saved) =>
      setData((prev) => ({
        ...prev,
        clients: prev.clients.map((item) => (item.id === saved.id ? saved : item)),
      }))
    )
  }

  function removeClient(id: string) {
    setData((prev) => ({
      ...prev,
      clients: prev.clients.filter((client) => client.id !== id),
      quotes: prev.quotes.map((quote) =>
        quote.clientId === id ? { ...quote, clientId: undefined } : quote
      ),
      requests: prev.requests.map((request) =>
        request.clientId === id ? { ...request, clientId: undefined } : request
      ),
      webProjects: prev.webProjects.map((project) =>
        project.clientId === id ? { ...project, clientId: undefined } : project
      ),
    }))
    syncCommercial(deleteClientNode(id))
  }

  async function ensureCommercialClient(client: Client | undefined) {
    if (!client) return
    try {
      const saved = await saveClient(client)
      setData((prev) => ({
        ...prev,
        clients: prev.clients.map((item) => (item.id === saved.id ? saved : item)),
      }))
    } catch {
      // La API devolverá el error al guardar la cotización si el cliente no existe.
    }
  }

  function nextQuoteCode(prev: AdminData) {
    const taken = new Set(prev.quotes.map((quote) => quote.code))
    let code = buildQuoteCode()
    while (taken.has(code)) code = buildQuoteCode()
    return code
  }

  async function createQuote(input: QuoteInput): Promise<Quote> {
    const now = new Date().toISOString()
    const quote: Quote = {
      ...input,
      id: uid('cotizacion'),
      code: nextQuoteCode(data),
      createdAt: now,
      updatedAt: now,
    }
    setData((prev) => ({ ...prev, quotes: [quote, ...prev.quotes] }))

    const client = quote.clientId
      ? data.clients.find((item) => item.id === quote.clientId)
      : undefined

    try {
      await ensureCommercialClient(client)
      const saved = await saveQuote(quote, client)
      setData((prev) => ({
        ...prev,
        quotes: prev.quotes.map((item) => (item.id === saved.id ? saved : item)),
      }))
      setCommercialError(null)
      return saved
    } catch (error) {
      setCommercialError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la cotización en la base de datos.'
      )
      return quote
    }
  }

  function replaceQuote(saved: Quote) {
    setData((prev) => ({
      ...prev,
      quotes: prev.quotes.map((quote) => (quote.id === saved.id ? saved : quote)),
    }))
  }

  function updateQuote(id: string, input: QuoteInput) {
    const current = data.quotes.find((quote) => quote.id === id)
    if (!current) return
    const updated: Quote = { ...current, ...input, updatedAt: new Date().toISOString() }
    setData((prev) => ({
      ...prev,
      quotes: prev.quotes.map((quote) => (quote.id === id ? updated : quote)),
    }))
    const client = updated.clientId
      ? data.clients.find((item) => item.id === updated.clientId)
      : undefined
    syncCommercial(
      ensureCommercialClient(client).then(() => saveQuote(updated, client)),
      replaceQuote
    )
  }

  function setQuoteStatus(id: string, status: QuoteStatus) {
    setData((prev) => ({
      ...prev,
      quotes: prev.quotes.map((quote) =>
        quote.id === id ? { ...quote, status, updatedAt: new Date().toISOString() } : quote
      ),
    }))
    syncCommercial(updateQuoteStatusNode(id, status), replaceQuote)
  }

  function removeQuote(id: string) {
    setData((prev) => ({
      ...prev,
      quotes: prev.quotes.filter((quote) => quote.id !== id),
      requests: prev.requests.map((request) =>
        request.quoteId === id ? { ...request, quoteId: undefined } : request
      ),
    }))
    syncCommercial(deleteQuoteNode(id))
  }

  async function refreshRequests() {
    try {
      const tickets = await fetchTickets()
      setData((prev) => ({
        ...prev,
        requests: tickets.map((ticket) => mapTicket(ticket, prev.quotes)),
      }))
      setHelpdeskError(null)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con la mesa de ayuda.'
      setHelpdeskError(message)
      throw error instanceof Error ? error : new Error(message)
    } finally {
      setHelpdeskSynced(true)
    }
  }

  async function createRequest(input: RequestInput): Promise<ServiceRequest> {
    const ticket = await createHelpdeskTicket({
      nombre: input.name,
      email: input.email,
      telefono: input.phone || undefined,
      empresa: input.company || undefined,
      asunto: input.topic,
      mensaje: input.message,
      channel: toApiChannel(input.channel),
      notes: input.notes || undefined,
    })
    const request = mapTicket(ticket, data.quotes)
    setData((prev) => ({
      ...prev,
      requests: [request, ...prev.requests.filter((item) => item.id !== request.id)],
    }))
    return request
  }

  async function updateRequest(id: string, patch: RequestPatch): Promise<void> {
    const apiPatch: TicketPatch = {}
    if (patch.status) apiPatch.status = toApiStatus(patch.status)
    if (patch.channel) apiPatch.channel = toApiChannel(patch.channel)
    if (patch.notes !== undefined) apiPatch.notes = patch.notes
    if (patch.quoteCode !== undefined) apiPatch.quoteCode = patch.quoteCode
    if (Object.keys(apiPatch).length === 0) return

    const ticket = await updateHelpdeskTicket(id, apiPatch)
    const updated = mapTicket(ticket, data.quotes)
    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((request) => (request.id === id ? updated : request)),
    }))
  }

  async function setRequestStatus(id: string, status: RequestStatus) {
    await updateRequest(id, { status })
  }

  async function removeRequest(id: string) {
    await deleteHelpdeskTicket(id)
    setData((prev) => ({
      ...prev,
      requests: prev.requests.filter((request) => request.id !== id),
    }))
  }

  async function replyToRequest(
    id: string,
    input: { subject: string; message: string }
  ): Promise<{ delivered: boolean; reason?: string }> {
    const result = await sendTicketReply(id, input)
    const updated = mapTicket(result.ticket, data.quotes)
    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((request) => (request.id === id ? updated : request)),
    }))
    return { delivered: result.delivered, reason: result.reason }
  }

  async function convertRequestToQuote(id: string): Promise<Quote | null> {
    const request = data.requests.find((item) => item.id === id)
    if (!request) return null

    if (request.quoteId) {
      const existing = data.quotes.find((quote) => quote.id === request.quoteId)
      if (existing) return existing
    }

    const now = new Date().toISOString()
    const email = request.email.trim().toLowerCase()
    const linked =
      (email
        ? data.clients.find((client) => client.email.trim().toLowerCase() === email)
        : undefined) ?? null

    let client: Client
    if (linked) {
      client = linked
    } else {
      client = {
        id: uid('cliente'),
        name: request.name,
        company: request.company,
        email: request.email,
        phone: request.phone,
        city: '',
        address: '',
        segment: request.company ? 'empresa' : 'persona',
        status: 'active',
        notes: '',
        createdAt: now,
        updatedAt: now,
      }
      setData((prev) => ({ ...prev, clients: [client, ...prev.clients] }))
      await ensureCommercialClient(client)
    }

    const quote = await createQuote({
      clientId: client.id,
      clientName: request.name,
      clientCompany: request.company,
      clientEmail: request.email,
      clientPhone: request.phone,
      status: 'draft',
      items: [],
      notes: request.message,
      validUntil: new Date(Date.now() + 15 * 86_400_000).toISOString().slice(0, 10),
    })

    const ticket = await updateHelpdeskTicket(id, {
      status: 'REVIEW',
      quoteCode: quote.code,
    })

    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((item) =>
        item.id === id
          ? {
              ...mapTicket(ticket, [quote]),
              clientId: client.id,
              quoteId: quote.id,
            }
          : item
      ),
    }))

    return quote
  }

  function updateSettings(settings: StoreSettings) {
    setData((prev) => ({ ...prev, settings }))
  }

  function resetData() {
    setData(createSeedData())
  }

  function exportData() {
    return JSON.stringify({ version: 5, data }, null, 2)
  }

  function importData(raw: string) {
    setData(parseData(raw))
  }

  return (
    <AdminContext.Provider
      value={{
        hydrated,
        catalogSource,
        catalogError,
        refreshCatalog,
        commercialSource,
        commercialError,
        refreshCommercial,
        products: data.products,
        categories: data.categories,
        brands: data.brands,
        clients: data.clients,
        quotes: data.quotes,
        requests: data.requests,
        helpdeskError,
        helpdeskSynced,
        settings: data.settings,
        activity: data.activity,
        inventoryMovements: data.inventoryMovements,
        webProjects: data.webProjects,
        createProduct,
        updateProduct,
        unlinkProductTaxonomy,
        deleteProduct,
        duplicateProduct,
        toggleProductStatus,
        setProductStatus,
        bulkSetStatus,
        bulkDeleteProducts,
        registerMovement,
        createProject,
        updateProject,
        deleteProject,
        registerDeployment,
        addCategory,
        updateCategory,
        renameCategory,
        removeCategory,
        addSubcategory,
        renameSubcategory,
        removeSubcategory,
        addSubSubcategory,
        renameSubSubcategory,
        removeSubSubcategory,
        addBrand,
        updateBrand,
        removeBrand,
        createClient,
        updateClient,
        removeClient,
        createQuote,
        updateQuote,
        removeQuote,
        setQuoteStatus,
        createRequest,
        updateRequest,
        removeRequest,
        setRequestStatus,
        convertRequestToQuote,
        refreshRequests,
        replyToRequest,
        updateSettings,
        resetData,
        exportData,
        importData,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) throw new Error('useAdmin debe usarse dentro de AdminProvider')
  return context
}
