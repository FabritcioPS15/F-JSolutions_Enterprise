import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'F&J Solutions Enterprise | All My Links · Enlaces Oficiales',
  description:
    'Enlaces directos a WhatsApp, Catálogo de Productos, Desarrollo de Software, F&J Academy, Instagram, TikTok y canales oficiales de F&J Solutions Enterprise.',
  openGraph: {
    title: 'F&J Solutions Enterprise | All My Links',
    description: 'Hardware, Software, TI y F&J Academy en Perú.',
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
