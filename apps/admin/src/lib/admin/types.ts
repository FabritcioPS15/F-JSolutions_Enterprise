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

export type QuoteStatus = 'draft' | 'sent' | 'answered' | 'closed'

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

export type AdminData = {
  products: AdminProduct[]
  categories: Category[]
  brands: Brand[]
  clients: Client[]
  quotes: Quote[]
  requests: ServiceRequest[]
  settings: StoreSettings
  activity: ActivityEntry[]
}

export type StockState = 'ok' | 'low' | 'out'

export type ToastVariant = 'success' | 'error' | 'info'
