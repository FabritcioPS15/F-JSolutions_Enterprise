import type { Metadata } from 'next'
import './globals.css'

const LINKS_URL = (
  process.env.NEXT_PUBLIC_LINKS_APP_URL ?? 'http://localhost:3005'
).replace(/\/+$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(LINKS_URL),
  title: 'SparkTree Group | Linkeador · Enlaces Oficiales',
  description:
    'Enlaces directos a WhatsApp, Catálogo de Productos, Desarrollo de Software, SparkTree Academia, Instagram, TikTok y canales oficiales de SparkTree Group.',
  openGraph: {
    title: 'SparkTree Group | Linkeador',
    description: 'Hardware, Software, TI y SparkTree Academia en Perú.',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
