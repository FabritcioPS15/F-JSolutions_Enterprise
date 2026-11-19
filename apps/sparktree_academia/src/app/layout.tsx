import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SparkTree Academia | Instituto de Especialización Tecnológica & TI',
  description:
    'SparkTree Academia es el instituto de tecnología impulsado por SparkTree Group. Formación práctica en Desarrollo Web Full Stack, DevOps, Cloud, Ciberseguridad e Inteligencia Artificial con proyectos reales.',
  keywords: [
    'instituto de tecnologia',
    'cursos de programacion peru',
    'academia devops',
    'ciberseguridad lima',
    'nextjs cursos',
    'fj academy',
    'fj solutions',
  ],
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
    <html lang="es">
      <body className="bg-surface text-ink-900 antialiased">{children}</body>
    </html>
  )
}
