import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'F&J Store | Tienda Oficial de Hardware & Equipamiento TI',
  description:
    'Catálogo y tienda oficial de F&J Solutions Enterprise. Servidores, Laptops, Equipos de Red Cisco/MikroTik, Componentes y Licencias con garantía corporativa.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased min-h-screen bg-[#0B0F19] text-slate-100">{children}</body>
    </html>
  )
}
