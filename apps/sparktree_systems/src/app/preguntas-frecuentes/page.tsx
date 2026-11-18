import type { Metadata } from 'next'
import { FaqPage } from '@/components/sections/faq-page'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Soporte, Redes y Garantías | F&J Systems',
  description:
    'Respuestas a preguntas habituales sobre servicios de soporte TI, proyectos de redes, desarrollo de software a medida, facturación y garantías de equipamiento con F&J Systems.',
}

export default function PreguntasFrecuentesRoute() {
  return <FaqPage />
}
