import type { MetadataRoute } from 'next'
import { products } from '@/lib/catalog'
import { getServicePath, serviceDefinitions } from '@/lib/services'
import { SITE_URL } from '@/lib/site'

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/productos', priority: 0.9, changeFrequency: 'daily' },
  { path: '/servicios', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/soporte-ti', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/infraestructura-ti', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/sistemas', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/cotizador', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/cotizacion', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/nosotros', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/proyectos', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/como-trabajamos', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contacto', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/preguntas-frecuentes', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/terminos-y-condiciones', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/politica-de-privacidad', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/informacion-legal', priority: 0.3, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const services: MetadataRoute.Sitemap = serviceDefinitions.map((service) => ({
    url: `${SITE_URL}${getServicePath(service.slug)}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/productos/${product.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...pages, ...services, ...productPages]
}
