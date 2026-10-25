import type { Metadata } from 'next'
import { AccountPage } from '@/components/sections/account-page'

export const metadata: Metadata = {
  title: 'Mi cuenta | FJ Solutions',
  description: 'Administra tu perfil, favoritos y cotizaciones en FJ Solutions.',
}

export default function MiCuentaPage() {
  return <AccountPage />
}
