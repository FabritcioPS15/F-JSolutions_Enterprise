import type { Metadata } from 'next'
import { ContactPage } from '@/components/sections/contact-page'

export const metadata: Metadata = {
  title: 'Contacto y ventas | F&J Systems',
  description:
    'Hablemos de tu proyecto. Contacta a F&J Systems para cotizaciones de equipos, soporte TI, redes, infraestructura o desarrollo de software. Respuesta en menos de 24 horas hábiles.',
}

export default function ContactoPage() {
  return <ContactPage />
}
