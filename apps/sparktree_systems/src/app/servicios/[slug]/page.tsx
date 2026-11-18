import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDetail } from '@/components/service-detail'
import { getStoreServiceCatalog } from '@/lib/service-offerings'
import type { ServiceDefinition } from '@/lib/services'
import { getServiceMetadata, getServiceNotFoundMetadata } from '@/lib/service-metadata'

export const revalidate = 60

export async function generateStaticParams() {
  const catalog = await getStoreServiceCatalog()
  return catalog
    .filter((service) => service.category !== 'Desarrollo de software')
    .map((service) => ({ slug: service.slug }))
}

function relatedServices(
  catalog: ServiceDefinition[],
  service: ServiceDefinition
): ServiceDefinition[] {
  const bySlug = new Map(catalog.map((item) => [item.slug, item]))
  return service.related
    .map((slug) => bySlug.get(slug))
    .filter((item): item is ServiceDefinition => item !== undefined)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const catalog = await getStoreServiceCatalog()
  const service = catalog.find(
    (item) => item.slug === slug && item.category !== 'Desarrollo de software'
  )

  if (!service) {
    return getServiceNotFoundMetadata()
  }

  return getServiceMetadata(service)
}

export default async function ServicioDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const catalog = await getStoreServiceCatalog()
  const service = catalog.find(
    (item) => item.slug === slug && item.category !== 'Desarrollo de software'
  )

  if (!service) {
    notFound()
  }

  return (
    <ServiceDetail
      service={service}
      relatedServices={relatedServices(catalog, service)}
      categoryCrumb={
        service.category === 'Infraestructura TI'
          ? { label: 'Infraestructura TI', href: '/servicios' }
          : { label: 'Servicios TI', href: '/servicios' }
      }
    />
  )
}
