import type { Metadata } from 'next'
import { ServicePage } from '@/components/service-page'

export const metadata: Metadata = {
  title: 'Infraestructura TI para empresas | F&J Systems',
  description:
    'Redes, Wi-Fi, cableado estructurado, servidores y equipamiento tecnológico para empresas. Diseñamos e implementamos una infraestructura estable, segura y escalable.',
  alternates: { canonical: '/infraestructura-ti' },
}

export default function InfraestructuraPage() {
  return <ServicePage kind="infraestructura" />
}
