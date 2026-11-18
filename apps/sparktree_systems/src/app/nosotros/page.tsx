import type { Metadata } from 'next'
import { AboutPage } from '@/components/sections/about-page'

export const metadata: Metadata = {
  title: 'Sobre nosotros, proyectos y experiencia | F&J Systems',
  description:
    'Conoce a F&J Systems: nuestro equipo, proyectos y experiencia en infraestructura TI, soporte y desarrollo de software. Cómo trabajamos, preguntas frecuentes y contacto.',
}

export default function NosotrosPage() {
  return <AboutPage />
}
