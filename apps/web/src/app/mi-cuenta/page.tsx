import type { Metadata } from 'next'
import { AccountPage } from '@/components/sections/account-page'

export const metadata: Metadata = {
  title: 'Mi cuenta | F&J Systems',
  description:
    'Administra tu perfil, tus productos favoritos y el historial de cotizaciones de F&J Systems.',
  robots: { index: false, follow: false },
}

export default function MiCuentaPage() {
  return <AccountPage />
}
