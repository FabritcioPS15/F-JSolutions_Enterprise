import {
  BrandStatus as PrismaBrandStatus,
  CategoryLevel as PrismaCategoryLevel,
  CategoryStatus as PrismaCategoryStatus,
  InventoryMovementType as PrismaInventoryMovementType,
  Prisma,
  ProductAvailability as PrismaProductAvailability,
  ProductStatus as PrismaProductStatus,
} from '@prisma/client'
import type { admin } from '@fj-solutions/contracts'
import { prisma } from '../config/database'
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
} from './catalog.repository'

const GENERIC_SPEC_NAME = 'Especificación'

const productInclude = {
  category: { include: { parent: { include: { parent: true } } } },
  brand: true,
  images: { orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] },
  specs: { orderBy: { position: 'asc' } },
} satisfies Prisma.ProductInclude

type PrismaProductWithCatalog = Prisma.ProductGetPayload<{ include: typeof productInclude }>

type CategoryPathNode = {
  id: string
  name: string
  slug: string
  parent?: CategoryPathNode | null
}

function categoryPath(category: CategoryPathNode | null): CategoryPathNode[] {
  const path: CategoryPathNode[] = []
  let node: CategoryPathNode | null | undefined = category
  while (node) {
    path.unshift(node)
    node = node.parent
  }
  return path
}

function toFrontendStatus(status: PrismaProductStatus): admin.ProductStatus {
  if (status === PrismaProductStatus.PUBLISHED) return 'active'
  if (status === PrismaProductStatus.ARCHIVED) return 'archived'
  return 'draft'
}

function toPrismaStatus(status: admin.ProductStatus): PrismaProductStatus {
  if (status === 'active') return PrismaProductStatus.PUBLISHED
  if (status === 'archived') return PrismaProductStatus.ARCHIVED
  return PrismaProductStatus.DRAFT
}

function toFrontendAvailability(
  availability: PrismaProductAvailability
): admin.ProductAvailability {
  if (availability === PrismaProductAvailability.LIMITED) return 'limited'
  if (availability === PrismaProductAvailability.CONSULT) return 'consult'
  return 'available'
}

function toPrismaAvailability(
  availability: admin.ProductAvailability
): PrismaProductAvailability {
  if (availability === 'limited') return PrismaProductAvailability.LIMITED
  if (availability === 'consult') return PrismaProductAvailability.CONSULT
  return PrismaProductAvailability.AVAILABLE
}

function toFrontendCategoryStatus(status: PrismaCategoryStatus): 'active' | 'inactive' {
  return status === PrismaCategoryStatus.ACTIVE ? 'active' : 'inactive'
}

function toPrismaCategoryStatus(status: 'active' | 'inactive' | undefined): PrismaCategoryStatus {
  return status === 'inactive' ? PrismaCategoryStatus.INACTIVE : PrismaCategoryStatus.ACTIVE
}

function specLabel(spec: { name: string; value: string; unit: string | null }): string {
  const value = spec.unit ? `${spec.value} ${spec.unit}` : spec.value
  return spec.name === GENERIC_SPEC_NAME ? value : `${spec.name}: ${value}`
}

function specData(spec: string, position: number) {
  const separator = spec.indexOf(':')
  if (separator > 0) {
    const name = spec.slice(0, separator).trim()
    const value = spec.slice(separator + 1).trim()
    if (name && value) return { name, value, position }
  }
  return { name: GENERIC_SPEC_NAME, value: spec, position }
}

function toAdminProduct(product: PrismaProductWithCatalog): admin.AdminProduct {
  const path = categoryPath(product.category)
  const primary = product.images.find((image) => image.isPrimary) ?? product.images[0]
  const images = product.images.map((image) => image.url)

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription ?? '',
    description: product.description,
    category: path[0]?.name ?? '',
    subcategory: path[1]?.name,
    subSubcategory: path[2]?.name,
    brand: product.brand?.name ?? '',
    model: product.model ?? undefined,
    sku: product.sku ?? '',
    internalCode: product.internalCode ?? undefined,
    price: Number(product.price),
    cost: product.cost === null ? undefined : Number(product.cost),
    showPrice: product.showPrice,
    commercialMessage: product.commercialMessage ?? '',
    stock: product.stock,
    minStock: product.minStock,
    availability: toFrontendAvailability(product.availability),
    status: toFrontendStatus(product.status),
    featured: product.featured,
    specs: product.specs.map(specLabel),
    image: primary?.url ?? '',
    imageAlt: primary?.alt ?? '',
    images,
    seoTitle: product.seoTitle ?? '',
    seoDescription: product.seoDescription ?? '',
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}

function toCategoryNode(category: {
  id: string
  parentId: string | null
  level: PrismaCategoryLevel
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  status: PrismaCategoryStatus
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}): CategoryNodeRecord {
  const level: CategoryLevelKey =
    category.level === PrismaCategoryLevel.TYPE
      ? 'type'
      : category.level === PrismaCategoryLevel.SUBCATEGORY
        ? 'subcategory'
        : 'category'

  return {
    id: category.id,
    parentId: category.parentId,
    level,
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    imageUrl: category.imageUrl ?? '',
    status: toFrontendCategoryStatus(category.status),
    sortOrder: category.sortOrder,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }
}

function toBrand(brand: {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  status: PrismaBrandStatus
  sortOrder: number
}): admin.Brand {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description ?? '',
    logo: brand.logoUrl ?? '',
    status: brand.status === PrismaBrandStatus.ACTIVE ? 'active' : 'inactive',
    order: brand.sortOrder,
  }
}

function productImagesData(input: ProductWriteInput) {
  const urls = [input.image, ...input.images].map((url) => url.trim()).filter(Boolean)
  const unique = Array.from(new Set(urls))
  return unique.map((url, position) => ({
    url,
    alt: input.imageAlt || input.name,
    position,
    isPrimary: position === 0,
  }))
}

function productScalarData(input: ProductWriteInput) {
  const status = toPrismaStatus(input.status)
  return {
    name: input.name,
    shortDescription: input.shortDescription || null,
    description: input.description,
    categoryId: input.categoryId,
    brandId: input.brandId,
    model: input.model || null,
    sku: input.sku || null,
    internalCode: input.internalCode || null,
    price: new Prisma.Decimal(input.price),
    cost: input.cost === undefined || input.cost === null ? null : new Prisma.Decimal(input.cost),
    showPrice: input.showPrice,
    commercialMessage: input.commercialMessage || null,
    stock: input.stock,
    minStock: input.minStock,
    availability: toPrismaAvailability(input.availability),
    status,
    featured: input.featured,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
  }
}

export class PrismaCatalogRepository implements CatalogRepository {
  async listProducts(filters: ProductListFilters): Promise<ProductListResult> {
    const where: Prisma.ProductWhereInput = {}

    if (filters.publishedOnly) {
      where.status = PrismaProductStatus.PUBLISHED
    } else if (filters.status) {
      where.status = toPrismaStatus(filters.status)
    } else {
      where.status = { not: PrismaProductStatus.ARCHIVED }
    }

    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
        { sku: { contains: filters.q, mode: 'insensitive' } },
        { model: { contains: filters.q, mode: 'insensitive' } },
        { brand: { name: { contains: filters.q, mode: 'insensitive' } } },
      ]
    }

    if (filters.categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: filters.categorySlug },
        include: { children: { include: { children: true } } },
      })
      if (!category) return { data: [], total: 0 }
      const ids = [
        category.id,
        ...category.children.map((child) => child.id),
        ...category.children.flatMap((child) => child.children.map((entry) => entry.id)),
      ]
      where.categoryId = { in: ids }
    }

    if (filters.brandName) {
      where.brand = {
        is: {
          OR: [
            { name: { equals: filters.brandName, mode: 'insensitive' } },
            { slug: { equals: filters.brandName, mode: 'insensitive' } },
          ],
        },
      }
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        ...(filters.minPrice !== undefined ? { gte: new Prisma.Decimal(filters.minPrice) } : {}),
        ...(filters.maxPrice !== undefined ? { lte: new Prisma.Decimal(filters.maxPrice) } : {}),
      }
    }

    if (filters.featured !== undefined) where.featured = filters.featured

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      filters.sort === 'price_asc'
        ? { price: 'asc' }
        : filters.sort === 'price_desc'
          ? { price: 'desc' }
          : filters.sort === 'name'
            ? { name: 'asc' }
            : { createdAt: 'desc' }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
    ])

    return { data: products.map(toAdminProduct), total }
  }

  async findProductById(
    id: string,
    publishedOnly = false,
    includeArchived = false
  ): Promise<admin.AdminProduct | null> {
    const product = await prisma.product.findFirst({
      where: publishedOnly
        ? { id, status: PrismaProductStatus.PUBLISHED }
        : includeArchived
          ? { id }
          : { id, status: { not: PrismaProductStatus.ARCHIVED } },
      include: productInclude,
    })
    return product ? toAdminProduct(product) : null
  }

  async findProductBySlug(
    slug: string,
    publishedOnly = false,
    includeArchived = false
  ): Promise<admin.AdminProduct | null> {
    const product = await prisma.product.findFirst({
      where: publishedOnly
        ? { slug, status: PrismaProductStatus.PUBLISHED }
        : includeArchived
          ? { slug }
          : { slug, status: { not: PrismaProductStatus.ARCHIVED } },
      include: productInclude,
    })
    return product ? toAdminProduct(product) : null
  }

  async createProduct(input: ProductWriteInput): Promise<admin.AdminProduct> {
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          ...(input.id ? { id: input.id } : {}),
          ...productScalarData(input),
          slug: input.slug ?? input.name,
          publishedAt:
            toPrismaStatus(input.status) === PrismaProductStatus.PUBLISHED ? new Date() : null,
          archivedAt:
            toPrismaStatus(input.status) === PrismaProductStatus.ARCHIVED ? new Date() : null,
          images: { create: productImagesData(input) },
          specs: { create: input.specs.filter(Boolean).map((spec, index) => specData(spec, index)) },
        },
        include: productInclude,
      })

      if (input.stock > 0) {
        await tx.inventoryMovement.create({
          data: {
            productId: created.id,
            productName: created.name,
            sku: created.sku,
            type: PrismaInventoryMovementType.ADJUSTMENT,
            quantity: input.stock,
            previousStock: 0,
            resultingStock: input.stock,
            reason: 'Carga inicial',
            note: 'Stock registrado al crear el producto.',
            actorId: input.actorId ?? null,
          },
        })
      }

      return created
    })

    return toAdminProduct(product)
  }

  async updateProduct(id: string, input: ProductWriteInput): Promise<admin.AdminProduct | null> {
    const current = await prisma.product.findUnique({ where: { id } })
    if (!current) return null

    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          ...(input.slug ? { slug: input.slug } : {}),
          ...productScalarData(input),
          ...(input.status === 'active'
            ? { publishedAt: current.publishedAt ?? new Date(), archivedAt: null }
            : input.status === 'archived'
              ? { archivedAt: current.archivedAt ?? new Date() }
              : { archivedAt: null }),
          images: { deleteMany: {}, create: productImagesData(input) },
          specs: {
            deleteMany: {},
            create: input.specs.filter(Boolean).map((spec, index) => specData(spec, index)),
          },
        },
        include: productInclude,
      })

      if (input.stock !== current.stock) {
        await tx.inventoryMovement.create({
          data: {
            productId: updated.id,
            productName: updated.name,
            sku: updated.sku,
            type: PrismaInventoryMovementType.ADJUSTMENT,
            quantity: input.stock,
            previousStock: current.stock,
            resultingStock: input.stock,
            reason: 'Edición de ficha',
            note: 'Stock actualizado desde la ficha del producto.',
            actorId: input.actorId ?? null,
          },
        })
      }

      return updated
    })

    return toAdminProduct(product)
  }

  async archiveProduct(id: string): Promise<boolean> {
    const current = await prisma.product.findUnique({ where: { id }, select: { id: true } })
    if (!current) return false
    await prisma.product.update({
      where: { id },
      data: { status: PrismaProductStatus.ARCHIVED, archivedAt: new Date() },
    })
    return true
  }

  async listCategoryNodes(): Promise<CategoryNodeRecord[]> {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
    return categories.map(toCategoryNode)
  }

  async findCategoryById(id: string): Promise<CategoryNodeRecord | null> {
    const category = await prisma.category.findUnique({ where: { id } })
    return category ? toCategoryNode(category) : null
  }

  async createCategory(
    input: CategoryWriteInput,
    level: CategoryLevelKey
  ): Promise<CategoryNodeRecord> {
    const category = await prisma.category.create({
      data: {
        ...(input.id ? { id: input.id } : {}),
        parentId: input.parentId ?? null,
        level:
          level === 'type'
            ? PrismaCategoryLevel.TYPE
            : level === 'subcategory'
              ? PrismaCategoryLevel.SUBCATEGORY
              : PrismaCategoryLevel.CATEGORY,
        name: input.name,
        slug: input.slug ?? input.name,
        description: input.description || null,
        imageUrl: input.imageUrl || null,
        status: toPrismaCategoryStatus(input.status),
        sortOrder: input.sortOrder ?? 0,
      },
    })
    return toCategoryNode(category)
  }

  async updateCategory(
    id: string,
    input: Partial<CategoryWriteInput>
  ): Promise<CategoryNodeRecord | null> {
    const current = await prisma.category.findUnique({ where: { id } })
    if (!current) return null

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.description !== undefined
          ? { description: input.description || null }
          : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl || null } : {}),
        ...(input.status !== undefined ? { status: toPrismaCategoryStatus(input.status) } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      },
    })
    return toCategoryNode(category)
  }

  async deleteCategory(id: string): Promise<DeleteCategoryResult> {
    const category = await prisma.category.findUnique({ where: { id }, select: { id: true } })
    if (!category) return 'not_found'

    const [children, products] = await Promise.all([
      prisma.category.count({ where: { parentId: id } }),
      prisma.product.count({ where: { categoryId: id, status: { not: PrismaProductStatus.ARCHIVED } } }),
    ])
    if (children > 0) return 'has_children'
    if (products > 0) return 'has_products'

    await prisma.category.delete({ where: { id } })
    return 'deleted'
  }

  async listBrands(): Promise<admin.Brand[]> {
    const brands = await prisma.brand.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
    return brands.map(toBrand)
  }

  async findBrandById(id: string): Promise<admin.Brand | null> {
    const brand = await prisma.brand.findUnique({ where: { id } })
    return brand ? toBrand(brand) : null
  }

  async findBrandByName(name: string): Promise<admin.Brand | null> {
    const brand = await prisma.brand.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    })
    return brand ? toBrand(brand) : null
  }

  async createBrand(input: BrandWriteInput): Promise<admin.Brand> {
    const brand = await prisma.brand.create({
      data: {
        ...(input.id ? { id: input.id } : {}),
        name: input.name,
        slug: input.slug ?? input.name,
        description: input.description || null,
        logoUrl: input.logoUrl || null,
        status:
          input.status === 'inactive' ? PrismaBrandStatus.INACTIVE : PrismaBrandStatus.ACTIVE,
        sortOrder: input.sortOrder ?? 0,
      },
    })
    return toBrand(brand)
  }

  async updateBrand(id: string, input: Partial<BrandWriteInput>): Promise<admin.Brand | null> {
    const current = await prisma.brand.findUnique({ where: { id }, select: { id: true } })
    if (!current) return null

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.description !== undefined
          ? { description: input.description || null }
          : {}),
        ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl || null } : {}),
        ...(input.status !== undefined
          ? {
              status:
                input.status === 'inactive'
                  ? PrismaBrandStatus.INACTIVE
                  : PrismaBrandStatus.ACTIVE,
            }
          : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      },
    })
    return toBrand(brand)
  }

  async deleteBrand(id: string): Promise<DeleteBrandResult> {
    const brand = await prisma.brand.findUnique({ where: { id }, select: { id: true } })
    if (!brand) return 'not_found'

    const products = await prisma.product.count({
      where: { brandId: id, status: { not: PrismaProductStatus.ARCHIVED } },
    })
    if (products > 0) return 'has_products'

    await prisma.brand.delete({ where: { id } })
    return 'deleted'
  }
}

export const prismaCatalogRepository = new PrismaCatalogRepository()
