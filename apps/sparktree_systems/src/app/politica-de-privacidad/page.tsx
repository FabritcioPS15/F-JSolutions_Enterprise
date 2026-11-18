import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { LegalPage, type LegalSection } from '@/components/legal-page'
import { EMPRESA } from '@/lib/constants'
import { SITE_NAME } from '@/lib/site'

const TITLE = 'Política de privacidad | F&J Systems'
const DESCRIPTION =
  'Conoce qué datos personales recopila F&J Systems, con qué finalidad los usa, cuánto tiempo los conserva y cómo puedes ejercer tus derechos.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/politica-de-privacidad' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/politica-de-privacidad',
    siteName: SITE_NAME,
    locale: 'es_PE',
    type: 'website',
  },
}

const sections: LegalSection[] = [
  {
    id: 'responsable-del-tratamiento',
    title: 'Responsable del tratamiento',
    paragraphs: [
      `El responsable del tratamiento de tus datos personales es ${EMPRESA.nombre}, con domicilio en ${EMPRESA.direccion} y correo de contacto ${EMPRESA.email}.`,
      `Para consultas relacionadas con esta política puedes escribirnos a ${EMPRESA.email} o llamarnos al ${EMPRESA.telefono} en el horario ${EMPRESA.horario}.`,
    ],
  },
  {
    id: 'datos-que-recopilamos',
    title: 'Datos que recopilamos',
    paragraphs: [
      'Recopilamos únicamente la información necesaria para atender tus solicitudes, procesar pedidos y brindar los servicios contratados.',
    ],
    list: [
      'Datos de identificación y contacto: nombre, DNI o RUC, correo electrónico, teléfono y dirección.',
      'Datos de la empresa: razón social, área de contacto y datos de facturación.',
      'Información de cotizaciones, pedidos, comprobantes y atenciones de soporte.',
      'Datos de navegación: dirección IP, tipo de dispositivo, navegador y páginas visitadas.',
      'Comunicaciones que nos envías por correo, formularios o canales de mensajería.',
    ],
  },
  {
    id: 'finalidades-del-tratamiento',
    title: 'Finalidades del tratamiento',
    paragraphs: [
      'Utilizamos tus datos para las siguientes finalidades:',
    ],
    list: [
      'Atender consultas, solicitudes de cotización y requerimientos comerciales.',
      'Procesar pedidos, emitir comprobantes y coordinar entregas.',
      'Brindar soporte técnico, mantenimiento e implementación de servicios.',
      'Enviar información comercial sobre productos y servicios, cuando hayas otorgado tu consentimiento.',
      'Mejorar la experiencia de navegación y la calidad de nuestros servicios.',
      'Cumplir obligaciones legales, contables y tributarias.',
    ],
  },
  {
    id: 'base-legal-y-consentimiento',
    title: 'Base legal y consentimiento',
    paragraphs: [
      'El tratamiento se sustenta en el consentimiento del titular, la ejecución de la relación comercial, el cumplimiento de obligaciones legales y el interés legítimo de la empresa, conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento.',
      'Cuando sea necesario un consentimiento adicional, te lo solicitaremos de forma previa, expresa e informada.',
    ],
  },
  {
    id: 'cookies-y-tecnologias-similares',
    title: 'Cookies y tecnologías similares',
    paragraphs: [
      'El sitio puede utilizar cookies propias y de terceros para recordar preferencias, medir el tráfico y mejorar la experiencia de navegación.',
      'Puedes desactivar o eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que algunas funciones del sitio podrían dejar de funcionar correctamente.',
    ],
  },
  {
    id: 'comunicaciones-comerciales',
    title: 'Comunicaciones comerciales',
    paragraphs: [
      'Solo enviamos comunicaciones comerciales cuando contamos con tu consentimiento. Puedes solicitar la baja en cualquier momento respondiendo al correo recibido o escribiéndonos a nuestra dirección de contacto.',
      'La baja de comunicaciones comerciales no afecta los mensajes necesarios para gestionar un pedido o un servicio contratado.',
    ],
  },
  {
    id: 'comparticion-con-terceros',
    title: 'Compartición con terceros',
    paragraphs: [
      'No vendemos tus datos personales. Podemos compartirlos con proveedores que nos ayudan a operar el servicio, siempre bajo obligaciones de confidencialidad y con la finalidad limitada a su función.',
    ],
    list: [
      'Proveedores de hosting, correo y herramientas de gestión.',
      'Servicios de facturación electrónica y pasarelas de pago.',
      'Empresas de transporte o courier para la entrega de equipos.',
      'Autoridades competentes cuando exista una obligación legal.',
    ],
  },
  {
    id: 'conservacion-de-datos',
    title: 'Conservación de datos',
    paragraphs: [
      'Conservamos los datos durante el tiempo necesario para cumplir las finalidades descritas y los plazos exigidos por la normativa contable, tributaria y de protección al consumidor. Cumplidos esos plazos, los datos se eliminan o se anonimizan de forma segura.',
    ],
  },
  {
    id: 'derechos-del-titular',
    title: 'Derechos del titular',
    paragraphs: [
      'Como titular de los datos puedes ejercer los derechos de acceso, rectificación, cancelación, oposición e información reconocidos por la normativa vigente.',
      `Para ejercerlos, escríbenos a ${EMPRESA.email} indicando tu nombre, documento de identidad y el derecho que deseas ejercer. Atenderemos tu solicitud dentro de los plazos legales.`,
      'Si consideras que tu solicitud no fue atendida correctamente, puedes acudir a la Autoridad Nacional de Protección de Datos Personales.',
    ],
  },
  {
    id: 'seguridad-de-la-informacion',
    title: 'Seguridad de la información',
    paragraphs: [
      'Aplicamos medidas técnicas y organizativas razonables para proteger los datos frente a accesos no autorizados, pérdida o alteración. Aun así, ningún sistema es completamente infalible, por lo que te recomendamos no compartir contraseñas ni datos sensibles por canales no seguros.',
      'Ante un incidente que afecte datos personales, activamos nuestros protocolos de contención y, cuando corresponda, comunicamos el hecho a los titulares y a la autoridad competente.',
    ],
  },
  {
    id: 'menores-de-edad',
    title: 'Menores de edad',
    paragraphs: [
      'Nuestros servicios están dirigidos a empresas y personas mayores de edad. No recopilamos intencionalmente datos de menores. Si detectamos un registro de este tipo, procederemos a su eliminación.',
    ],
  },
  {
    id: 'cambios-y-contacto',
    title: 'Cambios y contacto',
    paragraphs: [
      'Podemos actualizar esta política para reflejar cambios legales o de nuestros procesos. La versión vigente se publica en esta página con su fecha de actualización.',
      `Para cualquier consulta sobre el tratamiento de tus datos personales, contáctanos en ${EMPRESA.email} o al ${EMPRESA.telefono}.`,
    ],
  },
]

export default function PoliticaDePrivacidadPage() {
  return (
    <LegalPage
      path="/politica-de-privacidad"
      title="Política de privacidad"
      description={DESCRIPTION}
      intro="Explicamos qué datos personales recopilamos, para qué los usamos y cómo puedes ejercer tus derechos. Nos comprometemos a tratarlos de forma transparente y segura."
      updatedLabel="1 de noviembre de 2026"
      updatedIso="2026-11-01"
      icon={ShieldCheck}
      sections={sections}
    />
  )
}
