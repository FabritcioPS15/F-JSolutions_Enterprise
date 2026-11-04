import type { admin } from '@fj-solutions/contracts'
import { AppError } from '../src/middleware/error-handler'
import type {
  BrandWriteInput,
  CatalogRepository,
  CategoryLevelKey,
  CategoryNodeRecord,
  CategoryWriteInput,
  DeleteBrandResult,
  DeleteCategoryResult,
  ProductListFilters,
  ProductListResult,
  ProductWriteInput,
} from '../src/repositories/catalog.repository'
import { CatalogService, type ProductPayload } from '../src/services/catalog.service'

function node(
  id: string,
  name: string,
  level: CategoryLevelKey,
  parentId: string | null,
  status: 'active' | 'inactive' = 'active'
): CategoryNodeRecord {
  return {
    id,
    parentId,
    level,
    name,
    slug: id,
    description: '',
    imageUrl: '',
    status,
    sortOrder: 0,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  }
}

class FakeCatalogRepository implements CatalogRepository {
  products: admin.AdminProduct[] = []
  nodes: CategoryNodeRecord[] = [
    node('impresoras', 'Impresoras y Escáneres', 'category', null),
    node('tinta', 'Impresoras de Tinta Continua', 'subcategory', 'impresoras'),
    node('tanque', 'Tanque de Tinta Wi-Fi', 'type', 'tinta'),
    node('redes', 'Redes', 'category', null),
  ]
  brands: admin.Brand[] = []
  lastInput: ProductWriteInput | null = null
  inventoryEvents = 0

  async listProducts(filters: ProductListFilters): Promise<ProductListResult> {
    const list = this.products.filter((product) =>
      filters.publishedOnly ? product.status === 'active' : product.status !== 'archived'
    )
    return { data: list, total: list.length }
  }

  async findProductById(
    id: string,
    publishedOnly = false,
    includeArchived = false
  ): Promise<admin.AdminProduct | null> {
    const product = this.products.find((item) => item.id === id)
    if (!product) return null
    if (publishedOnly && product.status !== 'active') return null
    if (!includeArchived && product.status === 'archived') return null
    return product
  }

  async findProductBySlug(
    slug: string,
    publishedOnly = false,
    includeArchived = false
  ): Promise<admin.AdminProduct | null> {
    const product = this.products.find((item) => item.slug === slug)
    if (!product) return null
    if (publishedOnly && product.status !== 'active') return null
    if (!includeArchived && product.status === 'archived') return null
    return product
  }

  async createProduct(input: ProductWriteInput): Promise<admin.AdminProduct> {
    this.lastInput = input
    this.inventoryEvents += input.stock > 0 ? 1 : 0
    const product = this.toAdminProduct(input, input.id ?? `producto-${this.products.length + 1}`)
    this.products.unshift(product)
    return product
  }

  async updateProduct(id: string, input: ProductWriteInput): Promise<admin.AdminProduct | null> {
    this.lastInput = input
    const index = this.products.findIndex((item) => item.id === id)
    if (index === -1) return null
    const product = this.toAdminProduct(input, id)
    this.products[index] = product
    return product
  }

  async archiveProduct(id: string): Promise<boolean> {
    const product = this.products.find((item) => item.id === id)
    if (!product) return false
    product.status = 'archived'
    return true
  }

  async listCategoryNodes(): Promise<CategoryNodeRecord[]> {
    return this.nodes.map((item) => ({ ...item }))
  }

  async findCategoryById(id: string): Promise<CategoryNodeRecord | null> {
    return this.nodes.find((item) => item.id === id) ?? null
  }

  async createCategory(
    input: CategoryWriteInput,
    level: CategoryLevelKey
  ): Promise<CategoryNodeRecord> {
    const category = node(
      input.id ?? `categoria-${this.nodes.length + 1}`,
      input.name,
      level,
      input.parentId ?? null,
      input.status
    )
    category.slug = input.slug ?? category.slug
    category.sortOrder = input.sortOrder ?? 0
    this.nodes.push(category)
    return category
  }

  async updateCategory(
    id: string,
    input: Partial<CategoryWriteInput>
  ): Promise<CategoryNodeRecord | null> {
    const category = this.nodes.find((item) => item.id === id)
    if (!category) return null
    Object.assign(category, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    })
    return category
  }

  async deleteCategory(id: string): Promise<DeleteCategoryResult> {
    const category = this.nodes.find((item) => item.id === id)
    if (!category) return 'not_found'
    if (this.nodes.some((item) => item.parentId === id)) return 'has_children'
    if (this.products.some((product) => product.status !== 'archived' && product.category === category.name)) {
      return 'has_products'
    }
    this.nodes = this.nodes.filter((item) => item.id !== id)
    return 'deleted'
  }

  async listBrands(): Promise<admin.Brand[]> {
    return this.brands.map((brand) => ({ ...brand }))
  }

  async findBrandById(id: string): Promise<admin.Brand | null> {
    return this.brands.find((brand) => brand.id === id) ?? null
  }

  async findBrandByName(name: string): Promise<admin.Brand | null> {
    return this.brands.find((brand) => brand.name.toLowerCase() === name.toLowerCase()) ?? null
  }

  async createBrand(input: BrandWriteInput): Promise<admin.Brand> {
    const brand: admin.Brand = {
      id: input.id ?? `marca-${this.brands.length + 1}`,
      name: input.name,
      slug: input.slug ?? 'marca',
      description: input.description ?? '',
      logo: input.logoUrl ?? '',
      status: input.status ?? 'active',
      order: input.sortOrder ?? 0,
    }
    this.brands.push(brand)
    return brand
  }

  async updateBrand(id: string, input: Partial<BrandWriteInput>): Promise<admin.Brand | null> {
    const brand = this.brands.find((item) => item.id === id)
    if (!brand) return null
    Object.assign(brand, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    })
    return brand
  }

  async deleteBrand(id: string): Promise<DeleteBrandResult> {
    const brand = this.brands.find((item) => item.id === id)
    if (!brand) return 'not_found'
    if (this.products.some((product) => product.status !== 'archived' && product.brand === brand.name)) {
      return 'has_products'
    }
    this.brands = this.brands.filter((item) => item.id !== id)
    return 'deleted'
  }

  private toAdminProduct(input: ProductWriteInput, id: string): admin.AdminProduct {
    const byId = new Map(this.nodes.map((item) => [item.id, item]))
    const path: CategoryNodeRecord[] = []
    let current = input.categoryId ? byId.get(input.categoryId) : null
    while (current) {
      path.unshift(current)
      current = current.parentId ? byId.get(current.parentId) ?? null : null
    }
    const brand = input.brandId
      ? this.brands.find((item) => item.id === input.brandId)?.name ?? ''
      : ''
    const now = new Date('2026-02-01T00:00:00Z').toISOString()

    return {
      id,
      slug: input.slug ?? 'producto',
      name: input.name,
      shortDescription: input.shortDescription,
      description: input.description,
      category: path[0]?.name ?? '',
      subcategory: path[1]?.name,
      subSubcategory: path[2]?.name,
      brand,
      model: input.model ?? undefined,
      sku: input.sku ?? '',
      internalCode: input.internalCode ?? undefined,
      price: input.price,
      cost: input.cost ?? undefined,
      showPrice: input.showPrice,
      commercialMessage: input.commercialMessage,
      stock: input.stock,
      minStock: input.minStock,
      availability: input.availability,
      status: input.status,
      featured: input.featured,
      specs: input.specs,
      image: input.image,
      imageAlt: input.imageAlt,
      images: input.images,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      createdAt: now,
      updatedAt: now,
    }
  }
}

function productPayload(overrides: Partial<ProductPayload> = {}): ProductPayload {
  return {
    name: 'Impresora de prueba',
    description: 'Equipo de prueba con descripción suficiente.',
    category: 'Impresoras y Escáneres',
    subcategory: 'Impresoras de Tinta Continua',
    subSubcategory: 'Tanque de Tinta Wi-Fi',
    brand: 'Acme',
    price: 899,
    stock: 4,
    ...overrides,
  }
}

describe('CatalogService', () => {
  it('resuelve la jerarquía de categorías, crea la marca y genera un slug único', async () => {
    const repository = new FakeCatalogRepository()
    const existing = await repository.createProduct({
      name: 'Producto existente',
      shortDescription: '',
      description: 'Descripción existente.',
      categoryId: null,
      brandId: null,
      price: 1,
      showPrice: true,
      commercialMessage: '',
      stock: 1,
      minStock: 0,
      availability: 'available',
      status: 'draft',
      featured: false,
      specs: [],
      image: '',
      imageAlt: '',
      images: [],
      seoTitle: '',
      seoDescription: '',
    })
    existing.slug = 'impresora-de-prueba'

    const service = new CatalogService(repository)
    const product = await service.createProduct(productPayload(), 'user-1')

    expect(repository.lastInput?.categoryId).toBe('tanque')
    expect(repository.lastInput?.brandId).toBe(repository.brands[0]?.id)
    expect(repository.brands[0]?.name).toBe('Acme')
    expect(repository.inventoryEvents).toBe(2)
    expect(product.slug).toBe('impresora-de-prueba-2')
    expect(product.category).toBe('Impresoras y Escáneres')
    expect(product.subcategory).toBe('Impresoras de Tinta Continua')
    expect(product.subSubcategory).toBe('Tanque de Tinta Wi-Fi')
    expect(product.brand).toBe('Acme')
  })

  it('rechaza categorías inexistentes o subcategorías de otra rama', async () => {
    const service = new CatalogService(new FakeCatalogRepository())

    await expect(
      service.createProduct(productPayload({ category: 'Categoría fantasma' }))
    ).rejects.toMatchObject({ statusCode: 400 })

    await expect(
      service.createProduct(productPayload({ category: 'Redes' }))
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('actualiza parcialmente conservando la taxonomía y el stock', async () => {
    const repository = new FakeCatalogRepository()
    repository.brands.push({
      id: 'marca-hp',
      name: 'HP',
      slug: 'hp',
      description: '',
      logo: '',
      status: 'active',
      order: 0,
    })
    const created = await new CatalogService(repository).createProduct(
      productPayload({ category: 'Redes', subcategory: undefined, subSubcategory: undefined, brand: 'HP' })
    )

    const updated = await new CatalogService(repository).updateProduct(created.id, {
      price: 1099,
      status: 'active',
    })

    expect(updated.price).toBe(1099)
    expect(updated.status).toBe('active')
    expect(updated.stock).toBe(created.stock)
    expect(updated.category).toBe('Redes')
    expect(updated.brand).toBe('HP')
  })

  it('evita categorías duplicadas en el mismo nivel y limita la profundidad a tres niveles', async () => {
    const repository = new FakeCatalogRepository()
    const service = new CatalogService(repository)

    await expect(service.createCategory({ name: 'Redes' })).rejects.toMatchObject({
      statusCode: 409,
    })

    await expect(
      service.createCategory({ name: 'Cuarto nivel', parentId: 'tanque' })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('bloquea eliminar categorías con productos o marcas con productos', async () => {
    const repository = new FakeCatalogRepository()
    repository.brands.push({
      id: 'marca-hp',
      name: 'HP',
      slug: 'hp',
      description: '',
      logo: '',
      status: 'active',
      order: 0,
    })
    const service = new CatalogService(repository)
    await service.createProduct(
      productPayload({ category: 'Redes', subcategory: undefined, subSubcategory: undefined, brand: 'HP' })
    )

    await expect(service.deleteCategory('redes')).rejects.toMatchObject({ statusCode: 409 })
    await expect(service.deleteBrand('marca-hp')).rejects.toMatchObject({ statusCode: 409 })
  })

  it('oculta categorías inactivas y sus descendientes en la lectura pública', async () => {
    const repository = new FakeCatalogRepository()
    repository.nodes.push(node('inactiva', 'Categoría oculta', 'category', null, 'inactive'))
    repository.nodes.push(node('hija', 'Hija visible', 'subcategory', 'inactiva'))
    const service = new CatalogService(repository)

    const publicTree = await service.listCategories(false)
    const adminTree = await service.listCategories(true)

    expect(publicTree.some((category) => category.label === 'Categoría oculta')).toBe(false)
    expect(publicTree.some((category) => category.label === 'Hija visible')).toBe(false)
    expect(adminTree.some((category) => category.label === 'Categoría oculta')).toBe(true)
  })
})
