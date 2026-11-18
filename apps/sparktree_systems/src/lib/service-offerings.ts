import type { ServiceOffering } from '@fj-solutions/contracts/admin'
import {
  serviceDefinitions,
  type ServiceCategory,
  type ServiceDefinition,
} from './services'

const API_URL = (
  process.env.API_INTERNAL_URL ??
  process.env.HELPDESK_API_URL ??
  'http://localhost:4000/api/v1'
).replace(/\/+$/, '')

const categories: ServiceCategory[] = [
  'Soporte TI',
  'Infraestructura TI',
  'Desarrollo de software',
]

function toDefinition(service: ServiceOffering): ServiceDefinition {
  return {
    slug: service.slug,
    title: service.title,
    category: service.category,
    summary: service.summary,
    intro: service.intro,
    heroImage: service.heroImage,
    includes: service.includes,
    faq: service.faq,
    related: service.related,
  }
}

function isServiceOffering(value: unknown): value is ServiceOffering {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.slug === 'string' &&
    typeof record.title === 'string' &&
    typeof record.summary === 'string' &&
    typeof record.intro === 'string' &&
    categories.includes(record.category as ServiceCategory) &&
    Array.isArray(record.includes) &&
    Array.isArray(record.faq) &&
    Array.isArray(record.related)
  )
}

async function fetchPublishedOfferings(): Promise<ServiceOffering[]> {
  try {
    const response = await fetch(`${API_URL}/services/public`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2_500),
    })
    if (!response.ok) return []
    const body = (await response.json().catch(() => null)) as
      | { data?: unknown }
      | null
    if (!Array.isArray(body?.data)) return []
    return body.data.filter(isServiceOffering)
  } catch {
    // Sin API o base de datos disponible, la tienda mantiene el contenido estático.
    return []
  }
}

export async function getStoreServiceCatalog(): Promise<ServiceDefinition[]> {
  const merged = new Map<string, ServiceDefinition>(
    serviceDefinitions.map((service) => [service.slug, service])
  )

  for (const offering of await fetchPublishedOfferings()) {
    merged.set(offering.slug, toDefinition(offering))
  }

  return Array.from(merged.values())
}

export async function getStoreServiceBySlug(
  slug: string
): Promise<ServiceDefinition | undefined> {
  const catalog = await getStoreServiceCatalog()
  return catalog.find((service) => service.slug === slug)
}

export async function getStoreServicesByCategory(
  category: ServiceCategory
): Promise<ServiceDefinition[]> {
  const catalog = await getStoreServiceCatalog()
  return catalog.filter((service) => service.category === category)
}
