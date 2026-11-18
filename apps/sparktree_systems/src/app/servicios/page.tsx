import type { Metadata } from 'next'
import { ServicesPage } from '@/components/sections/services-page'

export const metadata: Metadata = {
  title: 'Servicios TI para empresas',
  description:
    'Soporte TI, redes, servidores, ciberseguridad, respaldos y desarrollo de software. Planes para empresas con diagnóstico sin costo.',
  alternates: { canonical: '/servicios' },
}

export default function ServiciosPage() {
  return <ServicesPage />
}

