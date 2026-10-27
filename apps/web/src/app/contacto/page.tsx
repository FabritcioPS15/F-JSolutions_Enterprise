import type { Metadata } from 'next'
import { ContactPage } from '@/components/sections/contact-page'

export const metadata: Metadata = {
  title: 'Contacto y ventas | FJ Solutions',
  description:
    'Hablemos de tu proyecto. Contacta a F&J Solutions para cotizaciones de equipos, soporte TI, redes, infraestructura o desarrollo de software. Respuesta en menos de 24 horas hábiles.',
}

export default function ContactoPage() {
  return <ContactPage />
}
