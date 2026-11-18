import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StudioShell } from './studio-shell';

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sparktree.pe'),
  title: {
    template: '%s | SparkTree Studio',
    default: 'SparkTree Studio | Agencia de Marketing Digital en Lima - Diseño Web & SEO',
  },
  description:
    'Agencia líder de marketing digital en Lima. Especialistas en diseño web profesional, SEO posicionamiento, branding y automatización con IA. Transforma tu negocio con resultados reales.',
  keywords: [
    'agencia marketing digital Lima',
    'diseño web Perú',
    'SEO posicionamiento',
    'branding empresarial',
    'automatización IA',
    'SparkBots',
    'marketing online',
    'desarrollo web',
    'estrategia digital',
  ],
  authors: [{ name: 'SparkTree Studio - Agencia de Marketing Digital' }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/assets/favicon.svg',
  },
  openGraph: {
    locale: 'es_PE',
    type: 'website',
    title: 'SparkTree Studio | Agencia de Marketing Digital en Lima - Diseño Web & SEO',
    description:
      'Agencia líder de marketing digital en Lima. Especialistas en diseño web profesional, SEO posicionamiento, branding y automatización con IA. Transforma tu negocio con resultados reales.',
    url: 'https://sparktree.pe/',
    siteName: 'SparkTree',
    images: [
      {
        url: '/assets/branding.webp',
        width: 1200,
        height: 630,
        alt: 'SparkTree Marketing Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SparkTree Studio | Agencia de Marketing Digital en Lima',
    description:
      'Especialistas en diseño web, SEO, branding y automatización con IA. Transforma tu negocio con resultados reales.',
    images: ['/assets/branding.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <StudioShell>{children}</StudioShell>
      </body>
    </html>
  );
}
