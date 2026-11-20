import type { Metadata } from 'next'
import {
  ServiceQuotePage,
  type QuoteServiceOption,
} from '@/components/quote/service-quote-page'
import { getStoreServiceCatalog } from '@/lib/service-offerings'

export const metadata: Metadata = {
  title: 'Cotizador de servicios | SparkTree Systems',
  description:
    'Cotiza soporte TI, infraestructura o desarrollo de software con un rango referencial según el alcance de tu proyecto. El precio final puede variar según los requerimientos del cliente.',
  alternates: { canonical: '/cotizador-servicios' },
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function CotizacionPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const raw = params.servicio
  const initialSlug = typeof raw === 'string' ? raw : undefined

  const catalog = await getStoreServiceCatalog()
  const services: QuoteServiceOption[] = catalog.map((service) => ({
    slug: service.slug,
    title: service.title,
    category: service.category,
    summary: service.summary,
  }))

  return <ServiceQuotePage services={services} initialSlug={initialSlug} />
}
