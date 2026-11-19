import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/sections/projects-page'

export const metadata: Metadata = {
  title: 'Proyectos y Casos de Éxito | SparkTree Systems',
  description:
    'Casos de éxito y proyectos implementados por SparkTree Systems en redes corporativas, soporte técnico, desarrollo de software e infraestructura TI en Perú.',
}

export default function ProyectosRoute() {
  return <ProjectsPage />
}
