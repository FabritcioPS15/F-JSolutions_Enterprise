import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDetail } from '@/components/service-detail'
import { getService, getServicesByCategory } from '@/lib/services'
import { getServiceMetadata, getServiceNotFoundMetadata } from '@/lib/service-metadata'

export const dynamicParams = false

export function generateStaticParams() {
  return getServicesByCategory('Desarrollo de software').map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)

  if (!service || service.category !== 'Desarrollo de software') {
    return getServiceNotFoundMetadata()
  }

  return getServiceMetadata(service)
}

export default async function SistemaDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getService(slug)

  if (!service || service.category !== 'Desarrollo de software') {
    notFound()
  }

  return (
    <ServiceDetail
      service={service}
      categoryCrumb={{ label: 'Desarrollo de software', href: '/sistemas' }}
    />
  )
}
