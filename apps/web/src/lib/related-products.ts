import type { Product } from './catalog'

export const RELATED_PRODUCTS_LIMIT = 4

const UNCATEGORIZED = 'sin categoría'

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? ''
}

function sameValue(a?: string, b?: string) {
  const left = normalize(a)
  return left.length > 0 && left === normalize(b)
}

function priceProximityScore(current: Product, candidate: Product) {
  if (typeof current.price !== 'number' || typeof candidate.price !== 'number') return 0
  if (current.price <= 0 || candidate.price <= 0) return 0

  const distance = Math.abs(candidate.price - current.price) / current.price
  return 15 * (1 - Math.min(distance, 1))
}

function scoreCandidate(current: Product, candidate: Product) {
  let score = 0

  if (sameValue(current.category, candidate.category)) score += 30
  if (sameValue(current.subcategory, candidate.subcategory)) score += 60
  if (sameValue(current.subSubcategory, candidate.subSubcategory)) score += 20
  if (sameValue(current.brand, candidate.brand)) score += 15

  score += priceProximityScore(current, candidate)
  return score
}

function isRelevant(current: Product, candidate: Product) {
  const sharesCategory =
    normalize(current.category) !== UNCATEGORIZED &&
    sameValue(current.category, candidate.category)

  return sharesCategory || sameValue(current.brand, candidate.brand)
}

export function resolveRelatedProducts(
  current: Product,
  catalog: Product[],
  limit = RELATED_PRODUCTS_LIMIT
): Product[] {
  const bySlug = new Map(catalog.map((product) => [product.slug, product]))
  const seen = new Set<string>([current.slug, current.id])
  const selected: Product[] = []

  for (const slug of current.relatedProducts ?? []) {
    if (selected.length >= limit) break

    const candidate = bySlug.get(slug)
    if (!candidate || seen.has(candidate.slug) || seen.has(candidate.id)) continue

    seen.add(candidate.slug)
    seen.add(candidate.id)
    selected.push(candidate)
  }

  if (selected.length >= limit) return selected

  const fallback = catalog
    .filter(
      (candidate) =>
        !seen.has(candidate.slug) && !seen.has(candidate.id) && isRelevant(current, candidate)
    )
    .map((candidate) => ({ candidate, score: scoreCandidate(current, candidate) }))
    .sort(
      (a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name, 'es')
    )

  for (const { candidate } of fallback) {
    if (selected.length >= limit) break
    seen.add(candidate.slug)
    seen.add(candidate.id)
    selected.push(candidate)
  }

  return selected
}
