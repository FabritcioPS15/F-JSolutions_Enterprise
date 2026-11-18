import type { Metadata } from 'next'
import { ServicePage } from '@/components/service-page'
import { getStoreServicesByCategory } from '@/lib/service-offerings'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Desarrollo de software a medida | F&J Systems',
  description:
    'Páginas web, sistemas a medida, ERP, automatización de procesos e integraciones para empresas. Desarrollo por etapas, con alcance claro y soporte posterior.',
  alternates: { canonical: '/sistemas' },
}

export default async function SistemasPage() {
  const softwareServices = await getStoreServicesByCategory('Desarrollo de software')
  return <ServicePage kind="sistemas" softwareServices={softwareServices} />
}
