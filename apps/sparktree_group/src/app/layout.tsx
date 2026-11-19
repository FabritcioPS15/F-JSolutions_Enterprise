import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3008'),
  title: 'SparkTree Group | Unidades de negocio',
  description:
    'Studio, Systems, Academia, Store y Legal: las unidades de negocio de SparkTree Group trabajan como un solo ecosistema para hacer crecer empresas.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    locale: 'es_PE',
    type: 'website',
    siteName: 'SparkTree Group',
    title: 'SparkTree Group | Unidades de negocio',
    description:
      'Un ecosistema de empresas especializadas en marca, tecnología, formación, equipamiento y respaldo legal.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#123B2A',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
