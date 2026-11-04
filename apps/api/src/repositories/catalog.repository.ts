import type { admin } from '@fj-solutions/contracts'

export type CategoryStatus = admin.CategoryStatus

export type CategoryLevelKey = 'category' | 'subcategory' | 'type'

export type CategoryNodeRecord = {
  id: string
  parentId: string | null
  level: CategoryLevelKey
  name: string
  slug: string
  description: string
  imageUrl: string
  status: CategoryStatus
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export type CategoryWriteInput = {
  id?: string
  parentId?: string | null
  name: string
  slug?: string
  description?: string
  imageUrl?: string
  status?: CategoryStatus
  sortOrder?: number
}

export type BrandWriteInput = {
  id?: string
  name: string
  slug?: string
  description?: string
  logoUrl?: string
  status?: CategoryStatus
  sortOrder?: number
}

export type ProductWriteInput = {
  id?: string
  slug?: string
  name: string
  shortDescription: string
  description: string
  categoryId: string | null
  brandId: string | null
  model?: string | null
  sku?: string | null
  internalCode?: string | null
  price: number
  cost?: number | null
  showPrice: boolean
  commercialMessage: string
  stock: number
  minStock: number
  availability: admin.ProductAvailability
  status: admin.ProductStatus
  featured: boolean
  specs: string[]
  image: string
  imageAlt: string
  images: string[]
  seoTitle: string
  seoDescription: string
  actorId?: string | null
}

export type ProductListFilters = {
  page: number
  limit: number
  q?: string
  categorySlug?: string
  brandName?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  status?: admin.ProductStatus
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name'
  publishedOnly: boolean
}

export type ProductListResult = {
  data: admin.AdminProduct[]
  total: number
}

export type DeleteCategoryResult = 'deleted' | 'not_found' | 'has_children' | 'has_products'
export type DeleteBrandResult = 'deleted' | 'not_found' | 'has_products'

export interface CatalogRepository {
  listProducts(filters: ProductListFilters): Promise<ProductListResult>
  findProductById(
    id: string,
    publishedOnly?: boolean,
    includeArchived?: boolean
  ): Promise<admin.AdminProduct | null>
  findProductBySlug(
    slug: string,
    publishedOnly?: boolean,
    includeArchived?: boolean
  ): Promise<admin.AdminProduct | null>
  createProduct(input: ProductWriteInput): Promise<admin.AdminProduct>
  updateProduct(id: string, input: ProductWriteInput): Promise<admin.AdminProduct | null>
  archiveProduct(id: string): Promise<boolean>

  listCategoryNodes(): Promise<CategoryNodeRecord[]>
  findCategoryById(id: string): Promise<CategoryNodeRecord | null>
  createCategory(input: CategoryWriteInput, level: CategoryLevelKey): Promise<CategoryNodeRecord>
  updateCategory(
    id: string,
    input: Partial<CategoryWriteInput>
  ): Promise<CategoryNodeRecord | null>
  deleteCategory(id: string): Promise<DeleteCategoryResult>

  listBrands(): Promise<admin.Brand[]>
  findBrandById(id: string): Promise<admin.Brand | null>
  findBrandByName(name: string): Promise<admin.Brand | null>
  createBrand(input: BrandWriteInput): Promise<admin.Brand>
  updateBrand(id: string, input: Partial<BrandWriteInput>): Promise<admin.Brand | null>
  deleteBrand(id: string): Promise<DeleteBrandResult>
}
