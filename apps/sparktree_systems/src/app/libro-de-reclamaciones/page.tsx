import type { Metadata } from 'next'
import { ComplaintsBookPage } from '@/components/complaints/complaints-book-page'
import { SITE_NAME, SOCIAL_IMAGE } from '@/lib/site'

const TITLE = 'Libro de Reclamaciones Virtual | SparkTree Systems'
const DESCRIPTION =
  'Registra tu reclamo o queja en línea y obtén tu constancia con código de seguimiento. Libro de Reclamaciones Virtual de SparkTree Systems conforme al Código de Protección y Defensa del Consumidor.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/libro-de-reclamaciones' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/libro-de-reclamaciones',
    siteName: SITE_NAME,
    locale: 'es_PE',
    type: 'website',
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [SOCIAL_IMAGE.url],
  },
}

export default function LibroDeReclamacionesPage() {
  return <ComplaintsBookPage />
}
