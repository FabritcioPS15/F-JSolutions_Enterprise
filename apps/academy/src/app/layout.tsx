import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'F&J Academy | Instituto de Especialización Tecnológica & TI',
  description:
    'F&J Academy es el instituto de tecnología impulsado por F&J Solutions Enterprise. Formación práctica en Desarrollo Web Full Stack, DevOps, Cloud, Ciberseguridad e Inteligencia Artificial con proyectos reales.',
  keywords: [
    'instituto de tecnologia',
    'cursos de programacion peru',
    'academia devops',
    'ciberseguridad lima',
    'nextjs cursos',
    'fj academy',
    'fj solutions',
  ],
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
