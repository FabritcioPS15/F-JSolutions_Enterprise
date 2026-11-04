// Modelo de dominio del panel administrativo.
// Fuente única de verdad para el frontend admin y, a futuro, para la API.
// Los estados se almacenan como texto en inglés en el frontend y se mapean
// a los enums de Prisma en la capa de persistencia.

export type ProductStatus = 'active' | 'draft' | 'archived'

export type ProductAvailability = 'available' | 'limited' | 'consult'

export type AdminProduct = {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: string
  subcategory?: string
  subSubcategory?: string
  brand: string
  model?: string
  sku: string
  internalCode?: string
  price: number
  cost?: number
  showPrice: boolean
  commercialMessage: string
  stock: number
  minStock: number
  availability: ProductAvailability
  status: ProductStatus
  featured: boolean
  specs: string[]
  image: string
  imageAlt: string
  images: string[]
  seoTitle: string
  seoDescription: string
  createdAt: string
  updatedAt: string
}

export type ProductInput = Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>

export type SubSubcategory = {
  id: string
  label: string
}

export type Subcategory = {
  id: string
  label: string
  subSubcategories: SubSubcategory[]
}

export type CategoryStatus = 'active' | 'inactive'

export type Category = {
  id: string
  label: string
  slug: string
  description: string
  image: string
  status: CategoryStatus
  order: number
  subcategories: Subcategory[]
}

export type BrandStatus = 'active' | 'inactive'

export type Brand = {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  status: BrandStatus
  order: number
}

export type Currency = 'PEN' | 'USD'

export type StoreSettings = {
  storeName: string
  legalName: string
  ruc: string
  email: string
  phone: string
  address: string
  currency: Currency
  igv: number
  lowStockThreshold: number
}

export type ClientSegment = 'empresa' | 'persona'

export type ClientStatus = 'active' | 'inactive'

export type Client = {
  id: string
  name: string
  company: string
  documentType?: 'ruc' | 'dni'
  documentNumber?: string
  email: string
  phone: string
  city: string
  address: string
  segment: ClientSegment
  status: ClientStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export type ClientInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>

export type QuoteStatus =
  | 'draft'
  | 'new'
  | 'review'
  | 'sent'
  | 'approved'
  | 'rejected'
  | 'expired'

export type QuoteLine = {
  id: string
  productId?: string
  name: string
  sku?: string
  quantity: number
  unitPrice: number
}

export type Quote = {
  id: string
  code: string
  clientId?: string
  clientName: string
  clientCompany: string
  clientEmail: string
  clientPhone: string
  status: QuoteStatus
  items: QuoteLine[]
  notes: string
  validUntil: string
  createdAt: string
  updatedAt: string
}

export type QuoteInput = Omit<Quote, 'id' | 'code' | 'createdAt' | 'updatedAt'>

export type RequestStatus = 'new' | 'review' | 'attended' | 'discarded'

export type RequestChannel = 'web' | 'email' | 'whatsapp' | 'phone'

export type ServiceRequestReply = {
  subject: string
  message: string
  delivered: boolean
  at: string
}

export type ServiceRequest = {
  id: string
  code: string
  name: string
  company: string
  email: string
  phone: string
  topic: string
  message: string
  channel: RequestChannel
  status: RequestStatus
  clientId?: string
  quoteId?: string
  quoteCode?: string
  repliedAt?: string
  lastReply?: ServiceRequestReply
  notes: string
  createdAt: string
  updatedAt: string
}

export type RequestInput = Omit<
  ServiceRequest,
  'id' | 'code' | 'createdAt' | 'updatedAt' | 'clientId' | 'quoteId'
>

export type ActivityType =
  | 'created'
  | 'updated'
  | 'published'
  | 'unpublished'
  | 'archived'
  | 'restored'
  | 'duplicated'
  | 'deleted'

export type ActivityEntry = {
  id: string
  type: ActivityType
  productId?: string
  productName: string
  detail?: string
  at: string
}

export type InventoryMovementType = 'in' | 'out' | 'adjustment'

export type InventoryMovement = {
  id: string
  productId: string
  productName: string
  sku: string
  type: InventoryMovementType
  quantity: number
  previousStock: number
  resultingStock: number
  reason: string
  note?: string
  createdAt: string
}

export type InventoryMovementInput = {
  productId: string
  type: InventoryMovementType
  quantity: number
  reason: string
  note?: string
}

export type WebProjectType = 'landing' | 'website' | 'webapp' | 'ecommerce' | 'maintenance'

export type WebProjectStatus =
  | 'planning'
  | 'development'
  | 'staging'
  | 'live'
  | 'paused'
  | 'archived'

export type DeploymentEnvironment = 'production' | 'staging' | 'preview'

export type WebProjectDeployment = {
  id: string
  environment: DeploymentEnvironment
  url: string
  version?: string
  note?: string
  deployedAt: string
}

export type WebProject = {
  id: string
  name: string
  clientId?: string
  clientName: string
  type: WebProjectType
  status: WebProjectStatus
  productionUrl: string
  stagingUrl: string
  repoUrl: string
  hosting: string
  domain: string
  responsible: string
  credentialLocation: string
  launchedAt?: string
  renewalAt?: string
  notes: string
  deployments: WebProjectDeployment[]
  createdAt: string
  updatedAt: string
}

export type WebProjectInput = Omit<
  WebProject,
  'id' | 'createdAt' | 'updatedAt' | 'deployments'
>

export type DeploymentInput = {
  environment: DeploymentEnvironment
  url: string
  version?: string
  note?: string
  deployedAt?: string
}

export type AdminData = {
  products: AdminProduct[]
  categories: Category[]
  brands: Brand[]
  clients: Client[]
  quotes: Quote[]
  requests: ServiceRequest[]
  settings: StoreSettings
  activity: ActivityEntry[]
  inventoryMovements: InventoryMovement[]
  webProjects: WebProject[]
}

export type StockState = 'ok' | 'low' | 'out'

export type ToastVariant = 'success' | 'error' | 'info'

// ─── Dashboard y reportes ────────────────────────────────────────────────────

export type QuoteStatusCounts = Record<QuoteStatus, number>

export type RequestStatusCounts = Record<RequestStatus, number>

export type RequestChannelCounts = Record<RequestChannel, number>

export type CurrencyAmount = {
  currency: Currency
  count: number
  total: number
}

export type ReportRange = {
  from: string
  to: string
  days: number
}

export type DashboardQuote = {
  id: string
  code: string
  clientName: string
  clientCompany: string
  status: QuoteStatus
  currency: Currency
  total: number
  createdAt: string
}

export type DashboardRequest = {
  id: string
  code: string
  name: string
  topic: string
  status: RequestStatus
  channel: RequestChannel
  createdAt: string
}

export type DashboardSummary = {
  generatedAt: string
  catalog: {
    total: number
    published: number
    draft: number
    archived: number
    lowStock: number
    outOfStock: number
    unitsInStock: number
  }
  clients: {
    total: number
    active: number
    newThisMonth: number
  }
  quotes: {
    total: number
    open: number
    thisMonth: number
    decided: number
    approved: number
    conversionRate: number
    byStatus: QuoteStatusCounts
    amounts: CurrencyAmount[]
  }
  requests: {
    total: number
    open: number
    thisMonth: number
    answered: number
    avgFirstResponseHours: number | null
    avgResolutionHours: number | null
    byStatus: RequestStatusCounts
  }
  recentQuotes: DashboardQuote[]
  recentRequests: DashboardRequest[]
}

export type SalesReportMonth = {
  month: string
  label: string
  quotes: number
  approved: number
  amounts: CurrencyAmount[]
}

export type SalesReportClient = {
  key: string
  clientId?: string
  name: string
  company: string
  quotes: number
  approved: number
  amounts: CurrencyAmount[]
}

export type SalesReportProduct = {
  key: string
  productId?: string
  name: string
  sku?: string
  quantity: number
  quotes: number
  amounts: CurrencyAmount[]
}

export type SalesReport = {
  generatedAt: string
  range: ReportRange
  totals: {
    quotes: number
    approved: number
    rejected: number
    expired: number
    open: number
    decided: number
    conversionRate: number
    averageTicket: CurrencyAmount[]
    amounts: CurrencyAmount[]
  }
  byStatus: QuoteStatusCounts
  monthly: SalesReportMonth[]
  topClients: SalesReportClient[]
  topProducts: SalesReportProduct[]
}

export type HelpdeskReportMonth = {
  month: string
  label: string
  requests: number
  attended: number
}

export type HelpdeskReport = {
  generatedAt: string
  range: ReportRange
  totals: {
    requests: number
    attended: number
    pending: number
    discarded: number
    attendedRate: number
    avgFirstResponseHours: number | null
    avgResolutionHours: number | null
  }
  byStatus: RequestStatusCounts
  byChannel: RequestChannelCounts
  monthly: HelpdeskReportMonth[]
}

export type ServiceOfferingStatus = 'draft' | 'published' | 'archived'

export type ServiceOfferingCategory =
  | 'Soporte TI'
  | 'Infraestructura TI'
  | 'Desarrollo de software'

export type ServiceInclude = {
  title: string
  copy: string
}

export type ServiceFaq = {
  question: string
  answer: string
}

export type ServiceHeroImage = {
  src: string
  alt: string
}

export type ServiceOffering = {
  id: string
  slug: string
  title: string
  category: ServiceOfferingCategory
  summary: string
  intro: string
  heroImage?: ServiceHeroImage
  includes: ServiceInclude[]
  faq: ServiceFaq[]
  related: string[]
  status: ServiceOfferingStatus
  position: number
  createdAt: string
  updatedAt: string
}

export type ServiceOfferingInput = Omit<
  ServiceOffering,
  'id' | 'createdAt' | 'updatedAt'
>
