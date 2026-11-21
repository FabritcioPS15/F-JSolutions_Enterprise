import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fira_Sans } from 'next/font/google'
import { SiteFooter } from '@/components/layout/site-footer'
import { QuoteCartWidget } from '@/components/quote/quote-cart-widget'
import { ThemeScript } from '@/components/theme-script'
import { serviceDefinitions } from '@/lib/services'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-fira-sans',
  display: 'swap',
})

// Fija el tema claro antes del primer pintado y descarta preferencias previas.
const themeScript = `(function(){try{var r=document.documentElement;r.classList.remove('dark');r.classList.add('light');r.style.colorScheme='light';localStorage.removeItem('fj-theme');}catch(e){}})()`

const quoteCartServices = serviceDefinitions.map(({ slug, title, category }) => ({
  slug,
  title,
  category,
}))



export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'SparkTree Systems | Soluciones tecnológicas para empresas',
  description: 'Desarrollo de software, infraestructura TI y soporte técnico para empresas que quieren avanzar.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: 'white',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={firaSans.variable}
    >
      <body className="antialiased">
        <ThemeScript script={themeScript} />
        {children}
        <SiteFooter />
        <QuoteCartWidget services={quoteCartServices} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
