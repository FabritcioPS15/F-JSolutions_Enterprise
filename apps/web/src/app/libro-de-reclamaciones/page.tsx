import type { Metadata } from 'next'
import { ComplaintsBookPage } from '@/components/complaints/complaints-book-page'

const TITLE = 'Libro de Reclamaciones Virtual | F&J Systems'
const DESCRIPTION =
  'Registra tu reclamo o queja en línea y obtén tu constancia con código de seguimiento. Libro de Reclamaciones Virtual de F&J Systems conforme al Código de Protección y Defensa del Consumidor.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/libro-de-reclamaciones' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/libro-de-reclamaciones',
    siteName: 'F&J Systems',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function LibroDeReclamacionesPage() {
  return <ComplaintsBookPage />
}
