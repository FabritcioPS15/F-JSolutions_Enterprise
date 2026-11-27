import type { Metadata } from 'next'
import { getServicePathFor, type ServiceDefinition } from './services'
import { SITE_NAME, SOCIAL_IMAGE } from './site'

export function getServiceMetadata(service: ServiceDefinition): Metadata {
  const path = getServicePathFor(service)
  const title = `${service.title} | SparkTree Systems`

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
      images: [{ ...SOCIAL_IMAGE, alt: `${title} | SparkTree Systems` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: service.summary,
      images: [SOCIAL_IMAGE.url],
    },
  }
}

export function getServiceNotFoundMetadata(): Metadata {
  return {
    title: 'Servicio no encontrado | SparkTree Systems',
    robots: { index: false, follow: false },
  }
}
