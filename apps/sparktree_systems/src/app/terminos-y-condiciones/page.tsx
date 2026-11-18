import type { Metadata } from 'next'
import { Scale } from 'lucide-react'
import { LegalPage, type LegalSection } from '@/components/legal-page'
import { SITE_NAME } from '@/lib/site'

const TITLE = 'Términos y condiciones | F&J Systems'
const DESCRIPTION =
  'Condiciones de uso del sitio web de F&J Systems y de la contratación de equipos, soporte técnico, infraestructura y desarrollo de software.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/terminos-y-condiciones' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/terminos-y-condiciones',
    siteName: SITE_NAME,
    locale: 'es_PE',
    type: 'website',
  },
}

const sections: LegalSection[] = [
  {
    id: 'objeto-y-alcance',
    title: 'Objeto y alcance',
    paragraphs: [
      'Estos términos y condiciones regulan el acceso y uso del sitio web de F&J Systems, así como las cotizaciones, pedidos, compras y servicios contratados a través de nuestros canales de atención.',
      'Al navegar en el sitio o solicitar una cotización aceptas las condiciones descritas en este documento. Si no estás de acuerdo con alguna de ellas, te pedimos no utilizar el sitio ni contratar nuestros servicios.',
    ],
  },
  {
    id: 'uso-del-sitio',
    title: 'Uso del sitio',
    paragraphs: [
      'El sitio tiene fines informativos y comerciales. Te comprometes a utilizarlo de forma lícita, sin afectar su funcionamiento ni el de terceros.',
    ],
    list: [
      'No intentar acceder a áreas restringidas, alterar la seguridad o interferir con el servicio.',
      'No extraer información de forma masiva ni reutilizar el contenido sin autorización.',
      'No publicar información falsa al solicitar una cotización o registrar un pedido.',
      'La información publicada es referencial; las especificaciones y el alcance final se confirman en la propuesta.',
    ],
  },
  {
    id: 'productos-precios-y-disponibilidad',
    title: 'Productos, precios y disponibilidad',
    paragraphs: [
      'Las imágenes, descripciones y especificaciones son referenciales y pueden presentar variaciones propias del fabricante. La disponibilidad está sujeta a stock y a la confirmación del pedido.',
      'Los precios publicados no incluyen IGV salvo indicación expresa y pueden actualizarse sin previo aviso. El precio aplicable será el consignado en la cotización aceptada.',
    ],
    list: [
      'Las marcas y logotipos de terceros pertenecen a sus respectivos titulares.',
      'Los productos expuestos pueden discontinuarse o reemplazarse por versiones equivalentes.',
      'Si detectamos un error manifiesto en un precio, te informaremos antes de procesar el pedido.',
    ],
  },
  {
    id: 'cotizaciones-y-pedidos',
    title: 'Cotizaciones y pedidos',
    paragraphs: [
      'Las cotizaciones tienen la vigencia indicada en cada documento. El pedido se considera confirmado cuando aceptas la propuesta y se realiza el pago o adelanto acordado.',
      'Podemos rechazar un pedido por falta de stock, error manifiesto de precio o imposibilidad de entrega, informando al cliente y devolviendo los montos pagados cuando corresponda.',
    ],
  },
  {
    id: 'pagos-facturacion-y-entrega',
    title: 'Pagos, facturación y entrega',
    paragraphs: [
      'Los medios de pago se acuerdan durante la cotización. Emitimos comprobantes electrónicos conforme a la normativa vigente.',
      'Los plazos de entrega dependen de la disponibilidad, la ubicación y la modalidad acordada. En Lima coordinamos entrega directa; en provincias utilizamos servicios de courier con seguimiento.',
    ],
    list: [
      'El cliente revisa el producto al recibirlo y reporta cualquier observación en el plazo indicado.',
      'Los costos de envío, instalación o configuración se detallan en la cotización.',
      'Los riesgos de traslado se coordinan con el cliente según el servicio contratado.',
    ],
  },
  {
    id: 'garantias-y-servicio-tecnico',
    title: 'Garantías y servicio técnico',
    paragraphs: [
      'Las garantías se rigen por las condiciones del fabricante y se respaldan con el comprobante de compra. El plazo y la cobertura se informan al momento de la venta.',
      'La garantía no cubre daños por mal uso, golpes, humedad, sobretensión, manipulación no autorizada o desgaste normal del equipo.',
    ],
    list: [
      'El diagnóstico de equipos fuera de garantía puede tener un costo, informado antes de intervenir.',
      'Los repuestos y componentes se cotizan por separado, con aprobación previa del cliente.',
      'La garantía de equipos adquiridos en otros proveedores se gestiona según lo que permita el fabricante.',
    ],
  },
  {
    id: 'servicios-de-soporte-e-implementacion',
    title: 'Servicios de soporte e implementación',
    paragraphs: [
      'El alcance, los plazos y las condiciones de soporte, redes, infraestructura y desarrollo de software se definen en la propuesta aceptada por el cliente.',
      'Para brindar soporte remoto se requiere autorización del cliente y una conexión disponible. Las visitas en sitio se coordinan según ubicación y criticidad.',
    ],
    list: [
      'El cliente facilita los accesos, la información y las condiciones necesarias para ejecutar el servicio.',
      'Los cambios de alcance se evalúan y cotizan antes de su ejecución.',
      'La información de la empresa se trata conforme a nuestra Política de privacidad.',
    ],
  },
  {
    id: 'propiedad-intelectual',
    title: 'Propiedad intelectual',
    paragraphs: [
      'Los textos, diseño, logotipos, imágenes y demás contenidos del sitio son propiedad de F&J Systems o de sus licenciantes y están protegidos por la normativa de propiedad intelectual.',
      'Queda prohibida su reproducción, distribución o uso comercial sin autorización previa y por escrito. En los proyectos de desarrollo de software, la titularidad del código y los entregables se define en el contrato correspondiente.',
    ],
  },
  {
    id: 'limitacion-de-responsabilidad',
    title: 'Limitación de responsabilidad',
    paragraphs: [
      'Procuramos que la información del sitio esté actualizada, pero no garantizamos la disponibilidad ininterrumpida del servicio ni la ausencia de errores.',
      'No somos responsables por daños indirectos derivados del uso del sitio o de contenidos de terceros enlazados. Nada en estos términos limita los derechos que la ley reconoce a los consumidores.',
    ],
  },
  {
    id: 'modificaciones',
    title: 'Modificaciones',
    paragraphs: [
      'Podemos actualizar estos términos para reflejar cambios en nuestros servicios o en la normativa aplicable. La versión vigente se publica en esta página junto con su fecha de actualización.',
      'El uso del sitio después de una actualización implica la aceptación de la nueva versión.',
    ],
  },
  {
    id: 'legislacion-aplicable-y-contacto',
    title: 'Legislación aplicable y contacto',
    paragraphs: [
      'Estos términos se rigen por la legislación peruana. Cualquier controversia se resolverá en primera instancia mediante coordinación directa con el cliente, sin perjuicio de los canales legales correspondientes.',
      'Para consultas sobre estos términos escríbenos a ventas@fjsolutions.pe o llámanos al +51 999 888 777 en horario de atención.',
    ],
  },
]

export default function TerminosYCondicionesPage() {
  return (
    <LegalPage
      path="/terminos-y-condiciones"
      title="Términos y condiciones"
      description={DESCRIPTION}
      intro="Estas condiciones explican cómo puedes usar nuestro sitio web y qué debes tener en cuenta al cotizar, comprar o contratar los servicios de F&J Systems."
      updatedLabel="1 de noviembre de 2026"
      updatedIso="2026-11-01"
      icon={Scale}
      sections={sections}
    />
  )
}
