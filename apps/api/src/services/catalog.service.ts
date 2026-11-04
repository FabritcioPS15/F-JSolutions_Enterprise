import type { admin } from '@fj-solutions/contracts'
import { AppError } from '../middleware/error-handler'
import {
  prismaCatalogRepository,
} from '../repositories/prisma-catalog.repository'
import type {
  CatalogRepository,
  CategoryLevelKey,
  CategoryNodeRecord,
  DeleteBrandResult,
  DeleteCategoryResult,
  ProductListFilters,
  ProductWriteInput,
} from '../repositories/catalog.repository'

export type ProductPayload = {
  id?: string
  slug?: string
  name: string
  shortDescription?: string
  description: string
  category?: string
  subcategory?: string
  subSubcategory?: string
  brand: string
  model?: string
  sku?: string
  internalCode?: string
  price: number
  cost?: number
  showPrice?: boolean
  commercialMessage?: string
  stock: number
  minStock?: number
  availability?: admin.ProductAvailability
  status?: admin.ProductStatus
  featured?: boolean
  specs?: string[]
  image?: string
  imageAlt?: string
  images?: string[]
  seoTitle?: string
  seoDescription?: string
}

export type CategoryPayload = {
  id?: string
  parentId?: string | null
  name: string
  slug?: string
  description?: string
  imageUrl?: string
  status?: 'active' | 'inactive'
  sortOrder?: number
}

export type BrandPayload = {
  id?: string
  name: string
  slug?: string
  description?: string
  logoUrl?: string
  status?: 'active' | 'inactive'
  sortOrder?: number
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

function normalize(value: string | undefined | null) {
  return (value ?? '').trim().toLowerCase()
}

function buildCategoryTree(
  nodes: CategoryNodeRecord[],
  includeInactive: boolean
): admin.Category[] {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const isVisible = (node: CategoryNodeRecord) => {
    if (includeInactive) return true
    if (node.status !== 'active') return false
    let parent = node.parentId ? byId.get(node.parentId) : null
    while (parent) {
      if (parent.status !== 'active') return false
      parent = parent.parentId ? byId.get(parent.parentId) : null
    }
    return true
  }

  const visible = nodes.filter(isVisible)
  const byParent = new Map<string | null, CategoryNodeRecord[]>()
  for (const node of visible) {
    const list = byParent.get(node.parentId) ?? []
    list.push(node)
    byParent.set(node.parentId, list)
  }

  const toSubcategory = (node: CategoryNodeRecord): admin.Subcategory => ({
    id: node.id,
    label: node.name,
    subSubcategories: (byParent.get(node.id) ?? []).map((child) => ({
      id: child.id,
      label: child.name,
    })),
  })

  return (byParent.get(null) ?? []).map((node) => ({
    id: node.id,
    label: node.name,
    slug: node.slug,
    description: node.description,
    image: node.imageUrl,
    status: node.status,
    order: node.sortOrder,
    subcategories: (byParent.get(node.id) ?? []).map(toSubcategory),
  }))
}

function levelForParent(parent: CategoryNodeRecord | null): CategoryLevelKey {
  if (!parent) return 'category'
  if (parent.level === 'category') return 'subcategory'
  if (parent.level === 'subcategory') return 'type'
  throw new AppError('La jerarquía de categorías admite tres niveles como máximo.', 400)
}

function deleteCategoryMessage(result: Exclude<DeleteCategoryResult, 'deleted'>): string {
  if (result === 'not_found') return 'La categoría no existe.'
  if (result === 'has_children') return 'Elimina primero las subcategorías o tipos que dependen de esta categoría.'
  return 'No se puede eliminar la categoría porque tiene productos vinculados.'
}

function deleteBrandMessage(result: Exclude<DeleteBrandResult, 'deleted'>): string {
  if (result === 'not_found') return 'La marca no existe.'
  return 'No se puede eliminar la marca porque tiene productos vinculados.'
}

export class CatalogService {
  constructor(private readonly repository: CatalogRepository = prismaCatalogRepository) {}

  async listProducts(filters: ProductListFilters) {
    return this.repository.listProducts(filters)
  }

  async getProductById(id: string, publishedOnly: boolean) {
    const product = await this.repository.findProductById(id, publishedOnly)
    if (!product) throw new AppError('Producto no encontrado.', 404)
    return product
  }

  async getProductBySlug(slug: string, publishedOnly: boolean) {
    const product = await this.repository.findProductBySlug(slug, publishedOnly)
    if (!product) throw new AppError('Producto no encontrado.', 404)
    return product
  }

  async createProduct(
    payload: ProductPayload,
    actorId?: string | null
  ): Promise<admin.AdminProduct> {
    if (payload.id) {
      const existing = await this.repository.findProductById(payload.id, false, true)
      if (existing) throw new AppError('Ya existe un producto con ese identificador.', 409)
    }

    const input = await this.toProductWriteInput(payload, null, actorId)
    const slug = await this.uniqueProductSlug(input.slug ?? slugify(input.name), null)
    return this.repository.createProduct({ ...input, slug })
  }

  async updateProduct(
    id: string,
    payload: Partial<ProductPayload>,
    actorId?: string | null
  ): Promise<admin.AdminProduct> {
    const current = await this.repository.findProductById(id)
    if (!current) throw new AppError('Producto no encontrado.', 404)

    const merged: ProductPayload = {
      ...current,
      ...payload,
      name: payload.name ?? current.name,
      description: payload.description ?? current.description,
      brand: payload.brand ?? current.brand,
      price: payload.price ?? current.price,
      stock: payload.stock ?? current.stock,
    }
    const input = await this.toProductWriteInput(merged, current, actorId)
    const slug = await this.uniqueProductSlug(input.slug ?? current.slug, id)
    return (await this.repository.updateProduct(id, { ...input, slug })) as admin.AdminProduct
  }

  async deleteProduct(id: string) {
    const deleted = await this.repository.archiveProduct(id)
    if (!deleted) throw new AppError('Producto no encontrado.', 404)
  }

  async listCategories(includeInactive: boolean): Promise<admin.Category[]> {
    const nodes = await this.repository.listCategoryNodes()
    return buildCategoryTree(nodes, includeInactive)
  }

  async createCategory(payload: CategoryPayload) {
    if (payload.id) {
      const existing = await this.repository.findCategoryById(payload.id)
      if (existing) throw new AppError('Ya existe una categoría con ese identificador.', 409)
    }

    const nodes = await this.repository.listCategoryNodes()
    const parent = payload.parentId
      ? nodes.find((node) => node.id === payload.parentId) ?? null
      : null
    if (payload.parentId && !parent) {
      throw new AppError('La categoría padre no existe.', 404)
    }
    const level = levelForParent(parent)

    const name = payload.name.trim()
    if (!name) throw new AppError('El nombre de la categoría es obligatorio.', 400)
    const siblings = nodes.filter((node) => node.parentId === (parent?.id ?? null))
    if (siblings.some((node) => normalize(node.name) === normalize(name))) {
      throw new AppError('Ya existe una categoría con ese nombre en el mismo nivel.', 409)
    }

    const slug = this.uniqueSlug(payload.slug ? slugify(payload.slug) : slugify(name), nodes.map((node) => node.slug))
    return this.repository.createCategory(
      {
        id: payload.id,
        parentId: parent?.id ?? null,
        name,
        slug,
        description: payload.description,
        imageUrl: payload.imageUrl,
        status: payload.status,
        sortOrder: payload.sortOrder,
      },
      level
    )
  }

  async updateCategory(id: string, payload: Partial<CategoryPayload>) {
    const nodes = await this.repository.listCategoryNodes()
    const current = nodes.find((node) => node.id === id)
    if (!current) throw new AppError('La categoría no existe.', 404)

    const name = payload.name?.trim() ?? current.name
    if (!name) throw new AppError('El nombre de la categoría es obligatorio.', 400)
    if (
      nodes.some(
        (node) =>
          node.id !== id &&
          node.parentId === current.parentId &&
          normalize(node.name) === normalize(name)
      )
    ) {
      throw new AppError('Ya existe una categoría con ese nombre en el mismo nivel.', 409)
    }

    const slug =
      payload.slug !== undefined
        ? this.uniqueSlug(
            slugify(payload.slug) || slugify(name),
            nodes.filter((node) => node.id !== id).map((node) => node.slug)
          )
        : undefined

    return this.repository.updateCategory(id, {
      name,
      slug,
      description: payload.description,
      imageUrl: payload.imageUrl,
      status: payload.status,
      sortOrder: payload.sortOrder,
    })
  }

  async deleteCategory(id: string) {
    const result = await this.repository.deleteCategory(id)
    if (result !== 'deleted') throw new AppError(deleteCategoryMessage(result), result === 'not_found' ? 404 : 409)
  }

  async listBrands(includeInactive: boolean): Promise<admin.Brand[]> {
    const brands = await this.repository.listBrands()
    return includeInactive ? brands : brands.filter((brand) => brand.status === 'active')
  }

  async createBrand(payload: BrandPayload) {
    if (payload.id) {
      const existing = await this.repository.findBrandById(payload.id)
      if (existing) throw new AppError('Ya existe una marca con ese identificador.', 409)
    }

    const name = payload.name.trim()
    if (!name) throw new AppError('El nombre de la marca es obligatorio.', 400)
    const brands = await this.repository.listBrands()
    if (brands.some((brand) => normalize(brand.name) === normalize(name))) {
      throw new AppError('Ya existe una marca con ese nombre.', 409)
    }

    const slug = this.uniqueSlug(
      payload.slug ? slugify(payload.slug) : slugify(name),
      brands.map((brand) => brand.slug)
    )
    return this.repository.createBrand({
      id: payload.id,
      name,
      slug,
      description: payload.description,
      logoUrl: payload.logoUrl,
      status: payload.status,
      sortOrder: payload.sortOrder,
    })
  }

  async updateBrand(id: string, payload: Partial<BrandPayload>) {
    const brands = await this.repository.listBrands()
    const current = brands.find((brand) => brand.id === id)
    if (!current) throw new AppError('La marca no existe.', 404)

    const name = payload.name?.trim() ?? current.name
    if (!name) throw new AppError('El nombre de la marca es obligatorio.', 400)
    if (brands.some((brand) => brand.id !== id && normalize(brand.name) === normalize(name))) {
      throw new AppError('Ya existe una marca con ese nombre.', 409)
    }

    const slug =
      payload.slug !== undefined
        ? this.uniqueSlug(
            slugify(payload.slug) || slugify(name),
            brands.filter((brand) => brand.id !== id).map((brand) => brand.slug)
          )
        : undefined

    return this.repository.updateBrand(id, {
      name,
      slug,
      description: payload.description,
      logoUrl: payload.logoUrl,
      status: payload.status,
      sortOrder: payload.sortOrder,
    })
  }

  async deleteBrand(id: string) {
    const result = await this.repository.deleteBrand(id)
    if (result !== 'deleted') throw new AppError(deleteBrandMessage(result), result === 'not_found' ? 404 : 409)
  }

  private uniqueSlug(base: string, taken: string[]) {
    const root = base || 'registro'
    const used = new Set(taken)
    let candidate = root
    let index = 2
    while (used.has(candidate)) {
      candidate = `${root}-${index}`
      index += 1
    }
    return candidate
  }

  private async uniqueProductSlug(base: string, excludeId: string | null) {
    const root = slugify(base) || 'producto'
    let candidate = root
    let index = 2
    while (true) {
      const existing = await this.repository.findProductBySlug(candidate, false, true)
      if (!existing || existing.id === excludeId) return candidate
      candidate = `${root}-${index}`
      index += 1
    }
  }

  private async resolveCategoryId(payload: ProductPayload, nodes: CategoryNodeRecord[]) {
    const categoryName = normalize(payload.category)
    if (!categoryName) return null
    const top = nodes.find(
      (node) => node.level === 'category' && normalize(node.name) === categoryName
    )
    if (!top) {
      throw new AppError(
        `La categoría “${payload.category}” no existe. Créala antes de asignarla.`,
        400
      )
    }

    const subName = normalize(payload.subcategory)
    if (!subName) return top.id
    const sub = nodes.find(
      (node) =>
        node.level === 'subcategory' &&
        node.parentId === top.id &&
        normalize(node.name) === subName
    )
    if (!sub) {
      throw new AppError(
        `La subcategoría “${payload.subcategory}” no pertenece a “${payload.category}”.`,
        400
      )
    }

    const typeName = normalize(payload.subSubcategory)
    if (!typeName) return sub.id
    const type = nodes.find(
      (node) =>
        node.level === 'type' && node.parentId === sub.id && normalize(node.name) === typeName
    )
    if (!type) {
      throw new AppError(
        `El tipo “${payload.subSubcategory}” no pertenece a “${payload.subcategory}”.`,
        400
      )
    }
    return type.id
  }

  private async resolveBrandId(brandName: string) {
    const name = brandName.trim()
    if (!name) throw new AppError('La marca del producto es obligatoria.', 400)

    const existing = await this.repository.findBrandByName(name)
    if (existing) return existing.id

    const brands = await this.repository.listBrands()
    const slug = this.uniqueSlug(slugify(name) || 'marca', brands.map((brand) => brand.slug))
    const created = await this.repository.createBrand({ name, slug })
    return created.id
  }

  private async toProductWriteInput(
    payload: ProductPayload,
    current: admin.AdminProduct | null,
    actorId?: string | null
  ): Promise<ProductWriteInput> {
    const nodes = await this.repository.listCategoryNodes()
    const categoryId = await this.resolveCategoryId(payload, nodes)
    const brandId = await this.resolveBrandId(payload.brand)

    return {
      id: current ? undefined : payload.id,
      slug: payload.slug || undefined,
      name: payload.name.trim(),
      shortDescription: payload.shortDescription ?? '',
      description: payload.description,
      categoryId,
      brandId,
      model: payload.model,
      sku: payload.sku,
      internalCode: payload.internalCode,
      price: payload.price,
      cost: payload.cost,
      showPrice: payload.showPrice ?? true,
      commercialMessage: payload.commercialMessage ?? '',
      stock: payload.stock,
      minStock: payload.minStock ?? 0,
      availability: payload.availability ?? 'available',
      status: payload.status ?? 'draft',
      featured: payload.featured ?? false,
      specs: payload.specs ?? [],
      image: payload.image ?? '',
      imageAlt: payload.imageAlt ?? '',
      images: payload.images ?? [],
      seoTitle: payload.seoTitle ?? '',
      seoDescription: payload.seoDescription ?? '',
      actorId: actorId ?? null,
    }
  }
}

export const catalogService = new CatalogService()
