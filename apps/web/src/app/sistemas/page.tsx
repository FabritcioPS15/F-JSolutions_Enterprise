import type { Metadata } from 'next'
import { ServicePage } from '@/components/service-page'

export const metadata: Metadata = {
  title: 'Desarrollo de software a medida | F&J Systems',
  description:
    'Sistemas web, ERP, automatización de procesos e integraciones a medida para empresas. Desarrollo por etapas, con alcance claro y soporte posterior.',
  alternates: { canonical: '/sistemas' },
}

export default function SistemasPage() {
  return <ServicePage kind="sistemas" />
}
