import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { RegisterForm } from '@/components/auth/register-form'
import { oauthAvailability } from '@/lib/customer/oauth'
import { getCustomerSession } from '@/lib/customer/session'

export const metadata: Metadata = {
  title: 'Crear cuenta | F&J Systems',
  description: 'Regístrate para guardar tus cotizaciones, favoritos y solicitudes de soporte.',
  robots: { index: false, follow: true },
}

export default async function RegistroPage() {
  const session = await getCustomerSession()
  if (session) redirect('/mi-cuenta')

  return <RegisterForm availability={oauthAvailability()} />
}
