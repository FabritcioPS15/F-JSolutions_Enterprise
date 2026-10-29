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
  settings: StoreSettings
  activity: ActivityEntry[]
}

export type StockState = 'ok' | 'low' | 'out'

export type ToastVariant = 'success' | 'error' | 'info'
