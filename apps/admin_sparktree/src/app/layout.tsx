import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeScript } from '@/components/theme-script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Aplica el tema antes del primer pintado: preferencia guardada o sistema.
const themeScript = `(function(){try{var t=localStorage.getItem('fj-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.classList.toggle('light',!d);r.style.colorScheme=d?'dark':'light';}catch(e){}})()`

export const metadata: Metadata = {
  title: {
    default: 'FJ Systems · Administración',
    template: '%s · FJ Systems',
  },
  description: 'Panel de administración del catálogo de FJ Systems.',
}

export const viewport: Viewport = {
  themeColor: '#30265C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeScript script={themeScript} />
        {children}
      </body>
    </html>
  )
}
