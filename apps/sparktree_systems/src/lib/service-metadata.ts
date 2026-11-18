import type { Metadata } from 'next'
import { getServicePathFor, type ServiceDefinition } from './services'
import { SITE_NAME } from './site'

export function getServiceMetadata(service: ServiceDefinition): Metadata {
  const path = getServicePathFor(service)
  const title = `${service.title} | F&J Systems`

  return {
    title,
    description: service.summary,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: service.summary,
      url: path,
      siteName: SITE_NAME,
      locale: 'es_PE',
      type: 'website',
      images: service.heroImage
        ? [{ url: service.heroImage.src, alt: service.heroImage.alt }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: service.summary,
      images: service.heroImage ? [service.heroImage.src] : undefined,
    },
  }
}

export function getServiceNotFoundMetadata(): Metadata {
  return {
    title: 'Servicio no encontrado | F&J Systems',
    robots: { index: false, follow: false },
  }
}
