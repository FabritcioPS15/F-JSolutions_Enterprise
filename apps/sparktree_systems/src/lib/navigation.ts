import { getServicesByCategory } from './services'
import { storeUrl } from './store-url'

// ─── Navegación Principal ──────────────────────────────────────────────────────────────────

export type MainNavItem = {
  label: string
  href: string
  hasMenu?: boolean
  activeExact?: string[]
  activeMatch?: string[]
}

const supportServicePaths = getServicesByCategory('Soporte TI').map(
  (service) => `/servicios/${service.slug}`,
)

const infrastructureServicePaths = getServicesByCategory('Infraestructura TI').map(
  (service) => `/servicios/${service.slug}`,
)

export const mainNav: MainNavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: storeUrl('/productos') },
  {
    label: 'Servicios TI',
    href: '/servicios',
    hasMenu: true,
    activeExact: ['/servicios'],
    activeMatch: [...supportServicePaths, '/soporte-ti', '/cotizador'],
  },
  {
    label: 'Infraestructura TI',
    href: '/infraestructura-ti',
    hasMenu: true,
    activeExact: ['/infraestructura-ti'],
    activeMatch: infrastructureServicePaths,
  },
  { label: 'Desarrollo de software', href: '/sistemas', hasMenu: true },
  {
    label: 'Empresa',
    href: '/nosotros',
    hasMenu: true,
    activeMatch: [
      '/nosotros',
      '/proyectos',
      '/como-trabajamos',
      '/preguntas-frecuentes',
      '/contacto',
    ],
  },
]

// ─── Menús de Servicios ──────────────────────────────────────────────────────────────────

export type NavMenuItem = {
  label: string
  href: string
  desc?: string
  icon?: string
  variant?: 'general'
}

export const itServicesMenu: NavMenuItem[] = [
  { label: 'Soporte técnico', href: '/servicios/soporte-tecnico', desc: 'Atención remota y visitas en sitio', icon: 'Headset' },
  { label: 'Mantenimiento de computadoras y laptops', href: '/servicios/mantenimiento-de-equipos', desc: 'Servicio preventivo y correctivo', icon: 'Wrench' },
  { label: 'Instalación y configuración de software', href: '/servicios/instalacion-de-software', desc: 'Sistemas operativos y aplicaciones', icon: 'Laptop' },
  { label: 'Configuración de impresoras', href: '/servicios/configuracion-de-impresoras', desc: 'Configuración en red y local', icon: 'Printer' },
  { label: 'Soluciones de soporte para empresas', href: '/servicios/soporte-empresarial', desc: 'Planes empresariales personalizados', icon: 'ShieldCheck' },
  { label: '¿Alquiler de equipos?', href: '/servicios#alquiler', desc: 'En evaluación: laptops y PCs por proyecto', icon: 'Boxes' },
  { label: 'Ver servicios TI', href: '/servicios', variant: 'general' },
]

export const infrastructureMenu: NavMenuItem[] = [
  { label: 'Redes y conectividad', href: '/servicios/redes-y-conectividad', desc: 'Diseño e implementación de redes', icon: 'Network' },
  { label: 'Cableado estructurado', href: '/servicios/cableado-estructurado', desc: 'Instalación profesional de cableado', icon: 'Cable' },
  { label: 'Implementación de infraestructura tecnológica', href: '/servicios/implementacion-de-infraestructura', desc: 'Infraestructura completa para empresas', icon: 'Server' },
  { label: 'Equipamiento tecnológico empresarial', href: '/servicios/equipamiento-tecnologico-empresarial', desc: 'Servidores y equipamiento profesional', icon: 'Package' },
  { label: 'Ver infraestructura TI', href: '/infraestructura-ti', variant: 'general' },
]

export const softwareDevMenu: NavMenuItem[] = [
  { label: 'Creación de páginas web', href: '/sistemas/creacion-de-paginas-web', desc: 'Sitios corporativos, landing pages y tiendas', icon: 'Globe' },
  { label: 'Sistemas web a medida', href: '/sistemas/sistemas-web-a-medida', desc: 'Desarrollo de aplicaciones web personalizadas', icon: 'LayoutTemplate' },
  { label: 'Sistemas de gestión empresarial', href: '/sistemas/sistemas-de-gestion-empresarial', desc: 'ERP y sistemas de gestión', icon: 'Building2' },
  { label: 'Automatización de procesos', href: '/sistemas/automatizacion-de-procesos', desc: 'Optimización de flujos de trabajo', icon: 'Workflow' },
  { label: 'Integraciones y API', href: '/sistemas/integraciones-y-api', desc: 'Conexión entre sistemas existentes', icon: 'Plug' },
  { label: 'Consultoría y proyectos personalizados', href: '/sistemas/consultoria-y-proyectos-personalizados', desc: 'Asesoría tecnológica especializada', icon: 'Lightbulb' },
  { label: 'Ver desarrollo de software', href: '/sistemas', variant: 'general' },
]

// ─── Menú Empresa ─────────────────────────────────────────────────────────────────────

export const companyMenu: NavMenuItem[] = [
  { label: 'Sobre nosotros', href: '/nosotros', desc: 'Trayectoria, valores y equipo técnico', icon: 'Compass' },
  { label: 'Proyectos y experiencia', href: '/proyectos', desc: 'Casos de éxito y sectores atendidos', icon: 'FolderKanban' },
  { label: 'Cómo trabajamos', href: '/como-trabajamos', desc: 'Metodología, etapas y garantías', icon: 'Route' },
  { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes', desc: 'Respuestas a consultas habituales', icon: 'CircleHelp' },
  { label: 'Contacto', href: '/contacto', desc: 'Canales directos de atención y cotización', icon: 'Mail' },
]
