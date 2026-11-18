import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AccountPage } from '@/components/sections/account-page'
import { getCustomerSession } from '@/lib/customer/session'

export const metadata: Metadata = {
  title: 'Mi cuenta | F&J Systems',
  description:
    'Administra tu perfil, tus productos favoritos y el historial de cotizaciones de F&J Systems.',
  robots: { index: false, follow: false },
}

export default async function MiCuentaPage() {
  const customer = await getCustomerSession()
  if (!customer) redirect('/login?next=%2Fmi-cuenta')

  return (
    <AccountPage
      customer={{
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        documentType: customer.documentType,
        documentNumber: customer.documentNumber,
        createdAt: customer.createdAt,
      }}
    />
  )
}
