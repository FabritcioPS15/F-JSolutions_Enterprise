import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { AdminProvider } from '@/components/admin/admin-provider'
import { AdminShell } from '@/components/admin/admin-shell'
import { ToastProvider } from '@/components/admin/toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FJ Systems · Administración',
    template: '%s · FJ Systems',
  },
  description: 'Panel de administración del catálogo de FJ Systems.',
}

export const viewport: Viewport = {
  themeColor: '#0B1220',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <AdminProvider>
          <ToastProvider>
            <AdminShell>{children}</AdminShell>
          </ToastProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
