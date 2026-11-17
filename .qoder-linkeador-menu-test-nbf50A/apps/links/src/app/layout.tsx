import type { Metadata } from 'next'
import './globals.css'

const LINKS_URL = (
  process.env.NEXT_PUBLIC_LINKS_APP_URL ?? 'http://localhost:3005'
).replace(/\/+$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(LINKS_URL),
  title: 'F&J Solutions Enterprise | Linkeador · Enlaces Oficiales',
  description:
    'Enlaces directos a WhatsApp, Catálogo de Productos, Desarrollo de Software, F&J Academy, Instagram, TikTok y canales oficiales de F&J Solutions Enterprise.',
  openGraph: {
    title: 'F&J Solutions Enterprise | Linkeador',
    description: 'Hardware, Software, TI y F&J Academy en Perú.',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
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
