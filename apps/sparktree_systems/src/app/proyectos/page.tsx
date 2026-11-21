import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/sections/projects-page'

export const metadata: Metadata = {
  title: 'Proyectos y experiencia | SparkTree Systems',
  description:
    'Cómo documentamos los proyectos de SparkTree Systems: alcance real, resultados verificables y autorización del cliente antes de publicar cada caso.',
}

export default function ProyectosRoute() {
  return <ProjectsPage />
}
