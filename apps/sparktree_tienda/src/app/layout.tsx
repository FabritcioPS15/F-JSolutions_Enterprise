import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { StoreFooter } from '@/components/store-footer'
import { StoreHeader } from '@/components/store-header'
import { listCategories } from '@/lib/catalog-query'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006'),
  title: 'SparkTree Store | Tienda Oficial de Hardware & Equipamiento TI',
  description:
    'Tienda oficial de SparkTree Group. Servidores, Laptops, Equipos de Red Cisco/MikroTik, Componentes y Licencias con garantía corporativa.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: 'white',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = listCategories().map(({ value, label }) => ({ value, label }))

  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <StoreHeader categories={categories} />
        {children}
        <StoreFooter categories={categories} />
      </body>
    </html>
  )
}
