import type { Metadata, Viewport } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3009'),
  title: 'SparkTree Legal | Asesoría legal para empresas',
  description:
    'Contratos, constitución, cumplimiento y controversias con un solo interlocutor. SparkTree Legal ordena los casos legales de tu empresa.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    locale: 'es_PE',
    type: 'website',
    siteName: 'SparkTree Legal',
    title: 'SparkTree Legal | Asesoría legal para empresas',
    description:
      'Un solo interlocutor para contratos, cumplimiento y controversias. Consultas confidenciales con enfoque empresarial.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#202C39',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
