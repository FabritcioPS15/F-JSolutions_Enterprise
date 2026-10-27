import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/sections/projects-page'

export const metadata: Metadata = {
  title: 'Proyectos y Casos de Éxito | F&J Systems',
  description:
    'Casos de éxito y proyectos implementados por F&J Systems en redes corporativas, soporte técnico, desarrollo de software e infraestructura TI en Perú.',
}

export default function ProyectosRoute() {
  return <ProjectsPage />
}
