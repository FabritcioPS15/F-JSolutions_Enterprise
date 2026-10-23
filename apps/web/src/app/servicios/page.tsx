import type { Metadata } from 'next'
import { ServicesPage } from '@/components/sections/services-page'

export const metadata: Metadata = {
  title: 'Servicios TI para empresas',
  description:
    'Soporte TI, redes, servidores, ciberseguridad, respaldos y desarrollo de software. Planes para empresas con diagnÃ³stico sin costo.',
}

export default function ServiciosPage() {
  return <ServicesPage />
}

