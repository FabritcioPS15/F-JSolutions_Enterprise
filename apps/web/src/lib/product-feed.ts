import { getTaxonomyCategory, products, type Product } from '@/lib/catalog'

export const FEATURED_PAGE_SIZE = 8

const curatedFeaturedIds = [
  'lenovo-ideapad-slim-3',
  'asus-rtx-4060-8gb',
  'monitor-lg-ultragear-24',
  'redragon-kumara',
]

const curatedOrder = new Map(curatedFeaturedIds.map((id, index) => [id, index]))

const orderedFeatured = [...products].sort((a, b) => {
  const aIndex = curatedOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER
  const bIndex = curatedOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER
  return aIndex - bIndex
})

function matchesCategory(product: Product, category: string) {
  if (category === 'Todas') return true

  const taxonomy = getTaxonomyCategory(product.category)
  return (
    product.category.toLowerCase() === category.toLowerCase() ||
    (taxonomy ? taxonomy.label.toLowerCase() === category.toLowerCase() : false)
  )
}

export function getFeaturedProducts({
  category = 'Todas',
  pages = 1,
  pageSize = FEATURED_PAGE_SIZE,
}: {
  category?: string
  pages?: number
  pageSize?: number
} = {}) {
  const filtered = orderedFeatured.filter((product) => matchesCategory(product, category))
  const items = filtered.slice(0, pages * pageSize)

  return { items, total: filtered.length, hasMore: items.length < filtered.length }
}
