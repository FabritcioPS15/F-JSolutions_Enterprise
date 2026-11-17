import type { AdminProduct, Brand, Category } from '@fj-solutions/contracts/admin'
import { slugify } from '@/lib/admin/format'

type Envelope<T> = {
  success: boolean
  data?: T
  message?: string
  pagination?: { page: number; limit: number; total: number; totalPages: number }
}

export class CatalogApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'CatalogApiError'
  }
}

export type CatalogSnapshot = {
  products: AdminProduct[]
  categories: Category[]
  brands: Brand[]
}

export type CategoryNodeInput = {
  id?: string
  parentId?: string | null
  name: string
  slug?: string
  description?: string
  imageUrl?: string
  status?: 'active' | 'inactive'
  sortOrder?: number
}

export type BrandNodeInput = {
  id?: string
  name: string
  slug?: string
  description?: string
  logoUrl?: string
  status?: 'active' | 'inactive'
  sortOrder?: number
}

async function requestEnvelope<T>(path: string, init?: RequestInit): Promise<Envelope<T>> {
  const response = await fetch(`/api/catalog/${path}`, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  const payload = (await response.json().catch(() => ({
    success: false,
    message: 'La API devolvió una respuesta no válida.',
  }))) as Envelope<T>

  if (!response.ok || payload.success === false) {
    throw new CatalogApiError(
      payload.message ?? 'No se pudo completar la operación de catálogo.',
      response.status
    )
  }

  return payload
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const payload = await requestEnvelope<T>(path, init)
  return payload.data as T
}

export async function fetchCatalogSnapshot(): Promise<CatalogSnapshot> {
  const products: AdminProduct[] = []
  let page = 1

  while (page <= 50) {
    const result = await requestEnvelope<AdminProduct[]>(
      `products?scope=admin&limit=100&page=${page}`
    )
    products.push(...(result.data ?? []))
    const totalPages = result.pagination?.totalPages ?? 1
    if (page >= totalPages) break
    page += 1
  }

  const [categories, brands] = await Promise.all([
    request<Category[]>('categories?scope=admin'),
    request<Brand[]>('brands?scope=admin'),
  ])

  return { products, categories, brands }
}

function flattenCategories(
  categories: Category[],
  parentId: string | null = null
): Array<Category & { parentId: string | null }> {
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

async function createCategoryNode(input: CategoryNodeInput) {
  try {
    await request(`categories`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  } catch (error) {
    if (error instanceof CatalogApiError && error.status === 409) return
    throw error
  }
}

async function ensureProductCategories(product: AdminProduct) {
  if (!product.category) return

  const categories = flattenCategories(await request<Category[]>('categories?scope=admin'))
  const normalized = (value: string) => value.trim().toLowerCase()

  const top = categories.find(
    (category) =>
      category.parentId === null && normalized(category.label) === normalized(product.category)
  )
  const topId = top?.id ?? slugify(product.category)
  if (!top) {
    await createCategoryNode({
      id: topId,
      name: product.category,
      slug: slugify(product.category),
      status: 'active',
    })
  }

  if (!product.subcategory) return
  const sub = categories.find(
    (category) =>
      category.parentId === topId &&
      normalized(category.label) === normalized(product.subcategory ?? '')
  )
  const subId = sub?.id ?? `${topId}-${slugify(product.subcategory)}`
  if (!sub) {
    await createCategoryNode({
      id: subId,
      parentId: topId,
      name: product.subcategory,
      slug: `${topId}-${slugify(product.subcategory)}`,
      status: 'active',
    })
  }

  if (!product.subSubcategory) return
  const type = categories.find(
    (category) =>
      category.parentId === subId &&
      normalized(category.label) === normalized(product.subSubcategory ?? '')
  )
  if (!type) {
    await createCategoryNode({
      id: `${subId}-${slugify(product.subSubcategory)}`,
      parentId: subId,
      name: product.subSubcategory,
      slug: `${subId}-${slugify(product.subSubcategory)}`,
      status: 'active',
    })
  }
}

export async function saveProduct(product: AdminProduct): Promise<AdminProduct> {
  await ensureProductCategories(product)

  try {
    return await request<AdminProduct>(`products/${encodeURIComponent(product.id)}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  } catch (error) {
    if (!(error instanceof CatalogApiError) || error.status !== 404) throw error
  }

  return request<AdminProduct>('products', {
    method: 'POST',
    body: JSON.stringify(product),
  })
}

export async function deleteProductNode(id: string) {
  try {
    await request(`products/${encodeURIComponent(id)}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof CatalogApiError && error.status === 404) return
    throw error
  }
}

export async function createCategory(input: CategoryNodeInput) {
  await createCategoryNode(input)
}

export async function updateCategoryNode(id: string, input: CategoryNodeInput) {
  try {
    await request(`categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
  } catch (error) {
    if (!(error instanceof CatalogApiError) || error.status !== 404) throw error
    await createCategoryNode({ ...input, id })
  }
}

export async function deleteCategoryNode(id: string) {
  try {
    await request(`categories/${encodeURIComponent(id)}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof CatalogApiError && error.status === 404) return
    throw error
  }
}

export async function createBrand(input: BrandNodeInput) {
  return request<Brand>('brands', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateBrandNode(id: string, input: BrandNodeInput) {
  try {
    return await request<Brand>(`brands/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
  } catch (error) {
    if (!(error instanceof CatalogApiError) || error.status !== 404) throw error
    return createBrand({ ...input, id })
  }
}

export async function deleteBrandNode(id: string) {
  try {
    await request(`brands/${encodeURIComponent(id)}`, { method: 'DELETE' })
  } catch (error) {
    if (error instanceof CatalogApiError && error.status === 404) return
    throw error
  }
}
