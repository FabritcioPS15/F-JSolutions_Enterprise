import type { Metadata } from 'next'
import { Building2 } from 'lucide-react'
import { LegalPage, type LegalSection } from '@/components/legal-page'
import { EMPRESA } from '@/lib/constants'
import { SITE_NAME } from '@/lib/site'

const TITLE = 'Información legal | F&J Systems'
const DESCRIPTION =
  'Datos de la empresa, canales de atención, facturación electrónica, libro de reclamaciones y demás información legal de F&J Systems.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/informacion-legal' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/informacion-legal',
    siteName: SITE_NAME,
    locale: 'es_PE',
    type: 'website',
  },
}

const sections: LegalSection[] = [
  {
    id: 'datos-de-la-empresa',
    title: 'Datos de la empresa',
    paragraphs: [
      `Razón social: ${EMPRESA.nombre}.`,
      `RUC: ${EMPRESA.ruc}.`,
      `Domicilio: ${EMPRESA.direccion}.`,
      `Teléfono: ${EMPRESA.telefono}. Correo: ${EMPRESA.email}.`,
      `Horario de atención: ${EMPRESA.horario}.`,
    ],
  },
  {
    id: 'actividad-comercial',
    title: 'Actividad comercial',
    paragraphs: [
      'F&J Systems comercializa equipos de cómputo y tecnología, brinda soporte técnico y mantenimiento, implementa infraestructura de redes y desarrolla sistemas de software para empresas.',
    ],
    list: [
      'Venta de laptops, computadoras, servidores, componentes y periféricos.',
      'Soporte técnico remoto y presencial, mantenimiento preventivo y correctivo.',
      'Redes, cableado estructurado y equipamiento tecnológico empresarial.',
      'Desarrollo de sistemas web, automatización e integraciones.',
    ],
  },
  {
    id: 'canales-de-atencion',
    title: 'Canales de atención',
    paragraphs: [
      'Atendemos consultas comerciales, pedidos y requerimientos de soporte a través de los siguientes canales:',
    ],
    list: [
      `Ventas y cotizaciones: ${EMPRESA.email}.`,
      `Soporte técnico: ${EMPRESA.emailSoporte}.`,
      `Teléfono y WhatsApp: ${EMPRESA.telefono}.`,
      `Atención presencial y visitas en sitio coordinadas previamente.`,
    ],
  },
  {
    id: 'comprobantes-y-facturacion',
    title: 'Comprobantes y facturación',
    paragraphs: [
      'Emitimos comprobantes de pago electrónicos conforme a la normativa tributaria vigente. Para la emisión correcta, el cliente debe proporcionar su RUC o documento de identidad y los datos de facturación al momento de la compra.',
      'Los precios publicados no incluyen IGV salvo indicación expresa. Los comprobantes se envían al correo registrado por el cliente.',
    ],
  },
  {
    id: 'libro-de-reclamaciones',
    title: 'Libro de reclamaciones',
    paragraphs: [
      'Contamos con un Libro de Reclamaciones a disposición de los clientes en nuestro establecimiento, conforme al Código de Protección y Defensa del Consumidor.',
      `Si no puedes acercarte, escríbenos a ${EMPRESA.email} indicando tu nombre, documento, detalle del reclamo y el servicio o producto involucrado. Coordinaremos la atención por nuestros canales y te informaremos el plazo de respuesta.`,
    ],
  },
  {
    id: 'marcas-y-propiedad-intelectual',
    title: 'Marcas y propiedad intelectual',
    paragraphs: [
      'Las marcas, logotipos y nombres comerciales de terceros que aparecen en el sitio pertenecen a sus respectivos titulares y se utilizan únicamente con fines de identificación de productos.',
      'El nombre F&J Systems, su logotipo, textos y diseño del sitio son propiedad de la empresa. Su reproducción requiere autorización previa y por escrito.',
    ],
  },
  {
    id: 'enlaces-a-sitios-de-terceros',
    title: 'Enlaces a sitios de terceros',
    paragraphs: [
      'El sitio puede incluir enlaces a páginas de terceros, como fabricantes o servicios de pago. No controlamos esos contenidos ni sus políticas, por lo que recomendamos revisar sus condiciones antes de utilizarlos.',
    ],
  },
  {
    id: 'vigencia-y-actualizacion',
    title: 'Vigencia y actualización',
    paragraphs: [
      'La información legal de esta página se mantiene vigente mientras no se publique una actualización. Cualquier cambio relevante se reflejará aquí con su fecha de modificación.',
      `Para consultas adicionales sobre esta información, escríbenos a ${EMPRESA.email}.`,
    ],
  },
]

export default function InformacionLegalPage() {
  return (
    <LegalPage
      path="/informacion-legal"
      title="Información legal"
      description={DESCRIPTION}
      intro="Datos de identificación de la empresa, canales oficiales de atención y la información que respalda nuestra actividad comercial."
      updatedLabel="1 de noviembre de 2026"
      updatedIso="2026-11-01"
      icon={Building2}
      sections={sections}
    />
  )
}
