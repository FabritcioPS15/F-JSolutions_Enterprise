import type { Metadata } from 'next'
import { QuotePage } from '@/components/quote-page'

export const metadata: Metadata = {
  title: 'Solicitar cotización | SparkTree Store',
  description:
    'Completa tu solicitud de cotización de equipos, infraestructura TI o desarrollo de software. Un asesor te responde en menos de 24 horas hábiles.',
}

export default function CotizacionPage() {
  return <QuotePage />
}
