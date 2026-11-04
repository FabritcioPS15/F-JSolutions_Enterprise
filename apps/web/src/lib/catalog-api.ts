import { products as staticProducts, type Product, type SpecGroup } from './catalog'

type ApiProduct = {
  id: string
  slug: string
  name: string
  shortDescription?: string
  description?: string
  category?: string
  subcategory?: string | null
  subSubcategory?: string | null
  brand?: string
  model?: string | null
  sku?: string | null
  price?: number
  showPrice?: boolean
  availability?: 'available' | 'limited' | 'consult'
  specs?: string[]
  image?: string
  images?: string[]
}

type ApiEnvelope<T> = {
  success?: boolean
  data?: T
  pagination?: { page: number; limit: number; total: number; totalPages: number }
}

function buildFullSpecs(specs: string[]): SpecGroup[] | undefined {
  const detailed: { label: string; value: string }[] = []

  for (const spec of specs) {
    const separator = spec.indexOf(':')
    if (separator > 0) {
      const label = spec.slice(0, separator).trim()
      const value = spec.slice(separator + 1).trim()
      if (label && value) {
        detailed.push({ label, value })
        continue
      }
    }
    detailed.push({ label: 'Especificación', value: spec })
  }

  return detailed.length > 0 ? [{ category: 'Especificaciones técnicas', specs: detailed }] : undefined
}

function mapApiProduct(product: ApiProduct): Product | null {
  if (!product.id || !product.slug || !product.name) return null

  const images = (product.images ?? []).filter(Boolean)
  const image = product.image || images[0] || ''
  const specs = (product.specs ?? []).filter(Boolean)

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category || 'Sin categoría',
    subcategory: product.subcategory || undefined,
    subSubcategory: product.subSubcategory || undefined,
    brand: product.brand || 'Genérica',
    model: product.model || undefined,
    sku: product.sku || undefined,
    description: product.description || product.shortDescription || '',
    price: product.showPrice === false ? undefined : product.price,
    image,
    images: images.length > 0 ? images : undefined,
    specs,
    fullSpecs: buildFullSpecs(specs),
    availability: product.availability,
  }
}

async function fetchJson<T>(path: string): Promise<T | null> {
  const response = await fetch(path, { cache: 'no-store' })

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Catálogo no disponible (${response.status}).`)

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null
  if (!payload?.success || payload.data === undefined) return null

  return payload.data
}

async function fetchRemoteProducts(): Promise<Product[]> {
  const remote: Product[] = []
  let page = 1

  while (page <= 50) {
    const response = await fetch(
      `/api/catalog/products?limit=100&page=${page}&sort=name`,
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error(`Catálogo no disponible (${response.status}).`)

    const payload = (await response.json().catch(() => null)) as ApiEnvelope<ApiProduct[]> | null
    if (!payload?.success || !Array.isArray(payload.data)) {
      throw new Error('La API devolvió una respuesta no válida.')
    }

    for (const item of payload.data) {
      const mapped = mapApiProduct(item)
      if (mapped) remote.push(mapped)
    }

    const totalPages = payload.pagination?.totalPages ?? 1
    if (page >= totalPages) break
    page += 1
  }

  return remote
}

export async function fetchStoreProducts(): Promise<Product[]> {
  const remote = await fetchRemoteProducts()
  const remoteSlugs = new Set(remote.map((product) => product.slug))

  return [...remote, ...staticProducts.filter((product) => !remoteSlugs.has(product.slug))]
}

export async function fetchStoreProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await fetchJson<ApiProduct>(
      `/api/catalog/products/slug/${encodeURIComponent(slug)}`
    )
    return data ? mapApiProduct(data) : null
  } catch {
    return null
  }
}
