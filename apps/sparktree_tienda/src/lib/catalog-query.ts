import { getTaxonomyCategory, products, type Product } from './catalog'

export function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function matchesCategory(product: Product, category: string) {
  const taxonomy = getTaxonomyCategory(category)
  if (!taxonomy) return normalize(product.category) === normalize(category)

  const names = [taxonomy.id, taxonomy.label, ...(taxonomy.aliases ?? [])].map(normalize)
  return names.includes(normalize(product.category))
}

export function categoryLabel(category: string) {
  return getTaxonomyCategory(category)?.label ?? category
}

export function listCategories() {
  const counts = new Map<string, number>()
  for (const product of products) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: categoryLabel(value), count }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es'))
}

export function listBrands() {
  return [...new Set(products.map((product) => product.brand))].sort((a, b) =>
    a.localeCompare(b, 'es')
  )
}

export const SORT_OPTIONS = [
  { value: '', label: 'Relevancia' },
  { value: 'nombre', label: 'Nombre: A a la Z' },
  { value: 'nombre-desc', label: 'Nombre: Z a la A' },
] as const

export function normalizeSort(value?: string) {
  return value === 'nombre' || value === 'nombre-desc' ? value : ''
}

export function sortLabel(value?: string) {
  return SORT_OPTIONS.find((option) => option.value === value)?.label ?? SORT_OPTIONS[0].label
}

export type ProductFilters = {
  q?: string
  category?: string
  brand?: string
  sort?: string
}

export function filterProducts({ q, category, brand, sort }: ProductFilters) {
  let list = products

  if (category) {
    list = list.filter((product) => matchesCategory(product, category))
  }
  if (brand) {
    list = list.filter((product) => product.brand === brand)
  }
  if (q) {
    const term = normalize(q)
    list = list.filter((product) =>
      [product.name, product.description, product.brand, product.model, product.sku, product.category, ...product.specs]
        .filter(Boolean)
        .some((value) => normalize(String(value)).includes(term))
    )
  }

  const sorted = [...list]
  if (sort === 'nombre') {
    sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'))
  } else if (sort === 'nombre-desc') {
    sorted.sort((a, b) => b.name.localeCompare(a.name, 'es'))
  }

  return sorted
}

export function formatPrice(price?: number) {
  if (typeof price !== 'number') return null
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 0,
  }).format(price)
}
