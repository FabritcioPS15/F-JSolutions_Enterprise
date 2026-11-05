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
  /** Techo de existencias deseado; por encima se considera sobre-stock. */
  maxStock?: number
  /** Ubicación de resguardo por defecto del SKU. */
  locationId?: string
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

/** Origen documental de un movimiento; evita duplicar el kardex por módulo. */
export type MovementSourceType =
  | 'manual'
  | 'purchase_receipt'
  | 'stock_count'
  | 'transfer'
  | 'order'
  | 'quote'

export type WarehouseLocationKind = 'warehouse' | 'shelf' | 'transit'

export type WarehouseLocation = {
  id: string
  code: string
  name: string
  kind: WarehouseLocationKind
  /** Almacén padre cuando `kind` es 'shelf'; los transit no tienen padre. */
  parentLocationId?: string
  address?: string
  responsible?: string
  isDefault: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export type WarehouseLocationInput = Omit<
  WarehouseLocation,
  'id' | 'createdAt' | 'updatedAt'
>

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
  /** Costo unitario del movimiento; base de la valorización. */
  unitCost?: number
  /** Documentó la operación (recepción, conteo, pedido) en lugar de un alta manual. */
  sourceType?: MovementSourceType
  sourceId?: string
  /** Folio legible del documento origen (RC-0007, CT-0002…). */
  sourceCode?: string
  locationId?: string
  /** Destino en transferencias entre almacenes. */
  toLocationId?: string
  /** Usuario que registró el movimiento. */
  actor?: string
  createdAt: string
}

export type InventoryMovementInput = {
  productId: string
  type: InventoryMovementType
  quantity: number
  reason: string
  note?: string
  unitCost?: number
  locationId?: string
  toLocationId?: string
}

/** Posición de stock derivada; nunca se persiste para no duplicar el saldo. */
export type StockPosition = {
  productId: string
  name: string
  sku: string
  brand: string
  category: string
  locationId?: string
  onHand: number
  /** Unidades comprometidas por pedidos abiertos sin despacho. */
  committed: number
  /** onHand - committed; lo único vendible. */
  available: number
  minStock: number
  maxStock?: number
  state: StockState
  unitCost: number
  valuationCost: number
  valuationRetail: number
  /** Cobertura en días según la demanda de los últimos 30 días. */
  demand30d: number
  daysOfCover: number | null
  turnover30d: number | null
  suggestedOrderQuantity: number
}

export type PurchaseRequestStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'ordered'
  | 'cancelled'

export type PurchaseRequestLine = {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitCost?: number
  note?: string
}

export type PurchaseRequest = {
  id: string
  code: string
  status: PurchaseRequestStatus
  requestedBy: string
  neededBy?: string
  supplierId?: string
  supplierName?: string
  justification?: string
  lines: PurchaseRequestLine[]
  decisionNote?: string
  decidedBy?: string
  decidedAt?: string
  createdAt: string
  updatedAt: string
}

export type PurchaseRequestInput = Omit<
  PurchaseRequest,
  'id' | 'code' | 'status' | 'createdAt' | 'updatedAt' | 'decidedBy' | 'decidedAt'
>

export type PurchaseOrderStatus =
  | 'draft'
  | 'sent'
  | 'partial'
  | 'received'
  | 'cancelled'

export type PurchaseOrderLine = {
  productId: string
  productName: string
  sku: string
  quantity: number
  receivedQuantity: number
  unitCost: number
  note?: string
}

export type PurchaseOrder = {
  id: string
  code: string
  supplierId: string
  supplierName: string
  status: PurchaseOrderStatus
  currency: Currency
  /** Ocasionada por una solicitud de compra aprobada. */
  requestId?: string
  requestCode?: string
  expectedAt?: string
  lines: PurchaseOrderLine[]
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type PurchaseOrderInput = Omit<
  PurchaseOrder,
  'id' | 'code' | 'status' | 'createdAt' | 'updatedAt' | 'lines'
> & {
  lines: Array<
    Omit<PurchaseOrderLine, 'receivedQuantity'> & { receivedQuantity?: number }
  >
}

export type GoodsReceiptCondition = 'good' | 'damaged' | 'incomplete'

export type GoodsReceiptLine = {
  productId: string
  productName: string
  sku: string
  orderedQuantity: number
  receivedQuantity: number
  rejectedQuantity: number
  locationId?: string
  note?: string
}

export type GoodsReceipt = {
  id: string
  code: string
  purchaseOrderId: string
  purchaseOrderCode: string
  supplierName: string
  condition: GoodsReceiptCondition
  receivedBy: string
  receivedAt: string
  lines: GoodsReceiptLine[]
  notes?: string
  createdAt: string
}

export type GoodsReceiptInput = Omit<
  GoodsReceipt,
  'id' | 'code' | 'createdAt' | 'lines'
> & {
  lines: Array<Omit<GoodsReceiptLine, 'orderedQuantity'> & { orderedQuantity?: number }>
}

export type StockCountStatus = 'open' | 'posted' | 'cancelled'

export type StockCountLine = {
  productId: string
  productName: string
  sku: string
  /** Saldo del sistema al momento de abrir el conteo. */
  systemQuantity: number
  /** Null mientras no se captura el conteo. */
  countedQuantity: number | null
  locationId?: string
  note?: string
}

export type StockCount = {
  id: string
  code: string
  name: string
  status: StockCountStatus
  locationId?: string
  countedBy: string
  startedAt: string
  finishedAt?: string
  lines: StockCountLine[]
  notes?: string
}

export type StockCountInput = Omit<
  StockCount,
  'id' | 'code' | 'status' | 'startedAt' | 'finishedAt' | 'lines'
> & {
  lines: Array<Omit<StockCountLine, 'systemQuantity' | 'countedQuantity'> & { countedQuantity?: number | null }>
}

export type WebProjectType =
  | 'landing'
  | 'website'
  | 'webapp'
  | 'ecommerce'
  | 'maintenance'
  | 'software'

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

// ─── Usuarios y permisos ─────────────────────────────────────────────────────

export type AdminUserRole = 'superadmin' | 'admin' | 'ventas' | 'soporte' | 'consulta'

export type AdminUserStatus = 'active' | 'invited' | 'disabled'

export type AdminUser = {
  id: string
  name: string
  email: string
  phone: string
  role: AdminUserRole
  status: AdminUserStatus
  twoFactorEnabled: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export type AdminUserInput = Omit<
  AdminUser,
  'id' | 'lastLoginAt' | 'createdAt' | 'updatedAt'
>

export type SupplierStatus = 'active' | 'inactive'

export type Supplier = {
  id: string
  name: string
  ruc: string
  contactName: string
  email: string
  phone: string
  city: string
  address: string
  categoryIds: string[]
  leadTimeDays: number
  minimumOrder: number
  rating: number
  status: SupplierStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export type SupplierInput = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>

// Estados en minúsculas, como el resto del panel; la capa de persistencia los
// mapea al enum OrderStatus de Prisma (PENDING … CANCELLED).
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'partial' | 'paid'

export type DeliveryMethod = 'pickup' | 'courier' | 'own'

export type OrderLine = {
  id: string
  productId?: string
  name: string
  sku?: string
  quantity: number
  unitPrice: number
  deliveredQuantity: number
}

export type DeliveryEvent = {
  id: string
  status: OrderStatus
  note: string
  at: string
}

export type Order = {
  id: string
  code: string
  clientId?: string
  clientName: string
  clientEmail: string
  clientPhone: string
  quoteCode?: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  currency: Currency
  items: OrderLine[]
  deliveryMethod: DeliveryMethod
  deliveryAddress: string
  recipientName: string
  carrier: string
  trackingNumber: string
  expectedDeliveryAt?: string
  deliveredAt?: string
  deliveryEvents: DeliveryEvent[]
  notes: string
  createdAt: string
  updatedAt: string
}

export type OrderInput = Omit<
  Order,
  'id' | 'code' | 'status' | 'deliveredAt' | 'deliveryEvents' | 'createdAt' | 'updatedAt'
>

export type OrderDeliveryInput = {
  status: OrderStatus
  note?: string
  carrier?: string
  trackingNumber?: string
  recipientName?: string
  expectedDeliveryAt?: string
}

export type AttributeType = 'text' | 'number' | 'select' | 'boolean'

export type AttributeStatus = 'active' | 'inactive'

// `keywords` detecta si las especificaciones libres de un producto ya declaran
// el atributo; así la cobertura se calcula con los datos reales del catálogo.
export type ProductAttribute = {
  id: string
  label: string
  type: AttributeType
  unit: string
  options: string[]
  keywords: string[]
  categoryIds: string[]
  required: boolean
  status: AttributeStatus
  createdAt: string
  updatedAt: string
}

export type ProductAttributeInput = Omit<
  ProductAttribute,
  'id' | 'createdAt' | 'updatedAt'
>

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
  warehouseLocations: WarehouseLocation[]
  purchaseRequests: PurchaseRequest[]
  purchaseOrders: PurchaseOrder[]
  goodsReceipts: GoodsReceipt[]
  stockCounts: StockCount[]
  webProjects: WebProject[]
  users: AdminUser[]
  suppliers: Supplier[]
  orders: Order[]
  attributes: ProductAttribute[]
}

export type StockState = 'ok' | 'low' | 'out' | 'over'

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
