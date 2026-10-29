'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { createSeedData } from '@/lib/admin/seed'
import { slugify, statusLabels } from '@/lib/admin/format'
import type {
  ActivityEntry,
  ActivityType,
  AdminData,
  AdminProduct,
  Brand,
  Category,
  ProductInput,
  ProductStatus,
  StoreSettings,
} from '@/lib/admin/types'

export const ADMIN_STORAGE_KEY = 'fj-systems-admin-v1'

export type CategoryPatch = Partial<
  Pick<Category, 'label' | 'slug' | 'description' | 'image' | 'status' | 'order'>
>

export type BrandPatch = Partial<
  Pick<Brand, 'name' | 'slug' | 'description' | 'logo' | 'status' | 'order'>
>

type AdminContextValue = {
  hydrated: boolean
  products: AdminProduct[]
  categories: Category[]
  brands: Brand[]
  settings: StoreSettings
  activity: ActivityEntry[]
  createProduct: (input: ProductInput) => AdminProduct
  updateProduct: (id: string, input: ProductInput) => void
  deleteProduct: (id: string) => void
  duplicateProduct: (id: string) => AdminProduct | null
  toggleProductStatus: (id: string) => void
  setProductStatus: (id: string, status: ProductStatus) => void
  bulkSetStatus: (ids: string[], status: ProductStatus) => void
  bulkDeleteProducts: (ids: string[]) => void
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
  updateSettings: (settings: StoreSettings) => void
  resetData: () => void
  exportData: () => string
  importData: (raw: string) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

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

function parseData(raw: string): AdminData {
  const parsed = JSON.parse(raw) as unknown
  const record = parsed as { data?: unknown }
  const payload = (record.data ?? parsed) as Record<string, unknown>

  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.products)) {
    throw new Error('El archivo no contiene un catálogo válido.')
  }

  const seed = createSeedData()
  const settings = (payload.settings ?? {}) as Partial<StoreSettings>

  return {
    products: (payload.products as Record<string, unknown>[]).map(normalizeProduct),
    categories: Array.isArray(payload.categories)
      ? (payload.categories as Record<string, unknown>[]).map((category, index) =>
          normalizeCategory(category, index)
        )
      : seed.categories,
    brands: Array.isArray(payload.brands)
      ? (payload.brands as unknown[]).map((brand, index) => normalizeBrand(brand, index))
      : seed.brands,
    settings: {
      ...seed.settings,
      ...settings,
      igv: Number(settings.igv ?? seed.settings.igv) || 0,
      lowStockThreshold: Number(settings.lowStockThreshold ?? seed.settings.lowStockThreshold) || 0,
    },
    activity: Array.isArray(payload.activity)
      ? (payload.activity as Record<string, unknown>[]).map(normalizeActivity)
      : [],
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(() => createSeedData())
  const [hydrated, setHydrated] = useState(false)

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
        JSON.stringify({ version: 2, data })
      )
    } catch (error) {
      console.warn('No se pudo guardar el catálogo local.', error)
    }
  }, [data, hydrated])

  function createProduct(input: ProductInput) {
    const now = new Date().toISOString()
    const product: AdminProduct = {
      ...input,
      slug: uniqueSlug(input.slug || slugify(input.name), data.products),
      id: uid(slugify(input.slug || input.name) || 'producto'),
      createdAt: now,
      updatedAt: now,
    }
    setData((prev) =>
      appendActivity(
        { ...prev, products: [product, ...prev.products] },
        [
          createActivity('created', product.name, {
            productId: product.id,
            detail: 'Producto creado',
          }),
        ]
      )
    )
    return product
  }

  function updateProduct(id: string, input: ProductInput) {
    const current = data.products.find((product) => product.id === id)
    if (!current) return
    const slug = uniqueSlug(input.slug || slugify(input.name), data.products, id)
    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: prev.products.map((product) =>
            product.id === id
              ? { ...product, ...input, slug, updatedAt: new Date().toISOString() }
              : product
          ),
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
    setData((prev) =>
      appendActivity(
        { ...prev, products: [copy, ...prev.products] },
        [
          createActivity('duplicated', copy.name, {
            productId: copy.id,
            detail: `Copia de ${source.name}`,
          }),
        ]
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
    setData((prev) =>
      appendActivity(
        {
          ...prev,
          products: prev.products.map((item) =>
            item.id === id
              ? { ...item, status, updatedAt: new Date().toISOString() }
              : item
          ),
        },
        [createActivity(type, product.name, { productId: id, detail })]
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
    return true
  }

  function removeCategory(id: string) {
    const category = data.categories.find((item) => item.id === id)
    if (!category) return false
    if (data.products.some((product) => product.category === category.label)) return false
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((item) => item.id !== id),
    }))
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
      slugify(clean) || 'subcategoria',
      category.subcategories.map((sub) => sub.id)
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
    return true
  }

  function removeSubcategory(categoryId: string, subcategoryId: string) {
    const category = data.categories.find((item) => item.id === categoryId)
    const sub = category?.subcategories.find((item) => item.id === subcategoryId)
    if (!category || !sub) return false
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
      slugify(clean) || 'tipo',
      sub.subSubcategories.map((type) => type.id)
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
    return true
  }

  function addBrand(label: string, patch: BrandPatch = {}) {
    const clean = label.trim()
    if (!clean) return false
    if (data.brands.some((brand) => brand.name.toLowerCase() === clean.toLowerCase())) return false
    const slug = uniqueBrandSlug(patch.slug?.trim() || clean, data.brands)
    const id = uniqueId(slug, data.brands.map((brand) => brand.id))
    setData((prev) => ({
      ...prev,
      brands: [
        ...prev.brands,
        {
          id,
          name: clean,
          slug,
          description: patch.description?.trim() ?? '',
          logo: patch.logo?.trim() ?? '',
          status: patch.status ?? 'active',
          order: patch.order ?? prev.brands.length,
        },
      ],
    }))
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

    setData((prev) => ({
      ...prev,
      brands: prev.brands.map((item) =>
        item.id === id
          ? {
              ...item,
              name: nextName,
              slug: nextSlug,
              description: patch.description !== undefined ? patch.description.trim() : item.description,
              logo: patch.logo !== undefined ? patch.logo.trim() : item.logo,
              status: patch.status ?? item.status,
              order: nextOrder,
            }
          : item
      ),
      products: renamed
        ? prev.products.map((product) =>
            product.brand === brand.name
              ? { ...product, brand: nextName, updatedAt: now }
              : product
          )
        : prev.products,
    }))
    return true
  }

  function removeBrand(id: string) {
    const brand = data.brands.find((item) => item.id === id)
    if (!brand) return false
    if (data.products.some((product) => product.brand === brand.name)) return false
    setData((prev) => ({ ...prev, brands: prev.brands.filter((item) => item.id !== id) }))
    return true
  }

  function updateSettings(settings: StoreSettings) {
    setData((prev) => ({ ...prev, settings }))
  }

  function resetData() {
    setData(createSeedData())
  }

  function exportData() {
    return JSON.stringify({ version: 2, data }, null, 2)
  }

  function importData(raw: string) {
    setData(parseData(raw))
  }

  return (
    <AdminContext.Provider
      value={{
        hydrated,
        products: data.products,
        categories: data.categories,
        brands: data.brands,
        settings: data.settings,
        activity: data.activity,
        createProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductStatus,
        setProductStatus,
        bulkSetStatus,
        bulkDeleteProducts,
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
