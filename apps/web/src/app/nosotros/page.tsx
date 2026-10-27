import type { Metadata } from 'next'
import { AboutPage } from '@/components/sections/about-page'

export const metadata: Metadata = {
  title: 'Sobre nosotros, proyectos y experiencia | FJ Solutions',
  description:
    'Conoce a F&J Solutions: nuestro equipo, proyectos y experiencia en infraestructura TI, soporte y desarrollo de software. Cómo trabajamos, preguntas frecuentes y contacto.',
}

export default function NosotrosPage() {
  return <AboutPage />
}
