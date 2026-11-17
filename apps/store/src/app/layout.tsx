import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { StoreFooter } from '@/components/store-footer'
import { StoreHeader } from '@/components/store-header'
import { ThemeScript } from '@/components/theme-script'
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

// Aplica el tema antes del primer pintado para evitar el destello claro.
const themeScript = `(function(){try{var t=localStorage.getItem('fj-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.classList.toggle('light',!d);r.style.colorScheme=d?'dark':'light';}catch(e){}})()`

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006'),
  title: 'F&J Store | Tienda Oficial de Hardware & Equipamiento TI',
  description:
    'Tienda oficial de F&J Solutions Enterprise. Servidores, Laptops, Equipos de Red Cisco/MikroTik, Componentes y Licencias con garantía corporativa.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = listCategories().map(({ value, label }) => ({ value, label }))

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeScript script={themeScript} />
        <StoreHeader categories={categories} />
        {children}
        <StoreFooter categories={categories} />
      </body>
    </html>
  )
}
