import type { Metadata } from 'next'
import { HomePage } from '@/components/home/home-page'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'SparkTree Systems | Tecnología para empresas: infraestructura, soporte y seguridad',
  description:
    'Diseñamos, implementamos y gestionamos soluciones tecnológicas que conectan, protegen y potencian las operaciones de tu negocio. Infraestructura TI, soporte y seguridad para empresas en Lima y el Perú.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'SparkTree Systems | Tecnología para empresas',
    description:
      'Infraestructura TI, soporte gestionado, seguridad tecnológica y equipamiento para empresas.',
    url: '/',
    type: 'website',
    locale: 'es_PE',
    siteName: 'SparkTree Systems',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SparkTree Systems',
  url: SITE_URL,
  description:
    'Infraestructura TI, soporte gestionado, seguridad tecnológica y equipamiento para empresas.',
  areaServed: {
    '@type': 'Country',
    name: 'Perú',
  },
  knowsAbout: [
    'Infraestructura TI',
    'Soporte técnico empresarial',
    'Redes y conectividad',
    'Cableado estructurado',
    'Seguridad tecnológica',
    'Equipamiento empresarial',
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomePage />
    </>
  )
}
