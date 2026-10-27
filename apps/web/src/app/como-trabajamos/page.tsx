import type { Metadata } from 'next'
import { HowWeWorkPage } from '@/components/sections/how-we-work-page'

export const metadata: Metadata = {
  title: 'Cómo Trabajamos | Metodología y Garantías | F&J Systems',
  description:
    'Conoce la metodología de F&J Systems: diagnóstico sin costo, propuestas claras con alcance cerrado, implementación por fases, actas de entrega y acompañamiento continuo.',
}

export default function ComoTrabajamosRoute() {
  return <HowWeWorkPage />
}
