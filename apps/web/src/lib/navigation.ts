import { getServicesByCategory } from './services'
import { storeUrl } from './store-url'

// ─── Navegación Principal ──────────────────────────────────────────────────────────────────

export type MainNavItem = {
  label: string
  href: string
  hasMegaMenu?: boolean
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
  { label: 'Tienda', href: storeUrl('/productos'), hasMegaMenu: true },
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

// ─── Mega Menú de Tienda ──────────────────────────────────────────────────────────────────

export const storeCategories = [
  {
    id: 'pcs',
    label: 'PC y Servidores',
    icon: 'Cpu',
    items: [
      { label: 'PCs de Escritorio', href: storeUrl('/productos?categoria=PC y Servidores') },
      { label: 'Servidores', href: storeUrl('/productos?categoria=PC y Servidores') },
      { label: 'Mini PCs', href: storeUrl('/productos?categoria=PC y Servidores') },
    ],
  },
  {
    id: 'laptops',
    label: 'Laptops',
    icon: 'Laptop',
    items: [
      { label: 'Laptops', href: storeUrl('/productos?categoria=Laptops'), subItems: [
        { label: 'Lenovo', href: storeUrl('/productos?categoria=Laptops&marca=Lenovo') },
        { label: 'Dell', href: storeUrl('/productos?categoria=Laptops&marca=Dell') },
        { label: 'HP', href: storeUrl('/productos?categoria=Laptops&marca=HP') },
        { label: 'ASUS', href: storeUrl('/productos?categoria=Laptops&marca=ASUS') },
        { label: 'Acer', href: storeUrl('/productos?categoria=Laptops&marca=Acer') },
        { label: 'MSI', href: storeUrl('/productos?categoria=Laptops&marca=MSI') },
      ]},
      { label: 'Laptops Empresariales', href: storeUrl('/productos?categoria=Laptops') },
      { label: 'Laptops Gaming', href: storeUrl('/productos?categoria=Laptops') },
    ],
  },
  {
    id: 'components',
    label: 'Componentes',
    icon: 'Cpu',
    items: [
      { label: 'Procesadores', href: storeUrl('/productos?categoria=Componentes'), subItems: [
        { label: 'Intel', href: storeUrl('/productos?categoria=Componentes&marca=Intel') },
        { label: 'AMD', href: storeUrl('/productos?categoria=Componentes&marca=AMD') },
      ]},
      { label: 'Tarjetas Gráficas', href: storeUrl('/productos?categoria=Componentes'), subItems: [
        { label: 'NVIDIA', href: storeUrl('/productos?categoria=Componentes&marca=NVIDIA') },
        { label: 'ASUS', href: storeUrl('/productos?categoria=Componentes&marca=ASUS') },
        { label: 'MSI', href: storeUrl('/productos?categoria=Componentes&marca=MSI') },
      ]},
      { label: 'Placas Madre', href: storeUrl('/productos?categoria=Componentes') },
      { label: 'Fuentes de Poder', href: storeUrl('/productos?categoria=Cables y Energía') },
    ],
  },
  {
    id: 'monitors',
    label: 'Monitores',
    icon: 'Monitor',
    items: [
      { label: 'Monitores', href: storeUrl('/productos?categoria=Monitores'), subItems: [
        { label: 'LG', href: storeUrl('/productos?categoria=Monitores&marca=LG') },
        { label: 'Samsung', href: storeUrl('/productos?categoria=Monitores&marca=Samsung') },
        { label: 'Dell', href: storeUrl('/productos?categoria=Monitores&marca=Dell') },
        { label: 'ASUS', href: storeUrl('/productos?categoria=Monitores&marca=ASUS') },
      ]},
      { label: 'Gaming', href: storeUrl('/productos?categoria=Monitores') },
      { label: 'Profesionales', href: storeUrl('/productos?categoria=Monitores') },
    ],
  },
  {
    id: 'peripherals',
    label: 'Periféricos',
    icon: 'MousePointer2',
    items: [
      { label: 'Teclados', href: storeUrl('/productos?categoria=Periféricos'), subItems: [
        { label: 'Logitech', href: storeUrl('/productos?categoria=Periféricos&marca=Logitech') },
        { label: 'Redragon', href: storeUrl('/productos?categoria=Periféricos&marca=Redragon') },
        { label: 'Razer', href: storeUrl('/productos?categoria=Periféricos&marca=Razer') },
      ]},
      { label: 'Mouse', href: storeUrl('/productos?categoria=Periféricos'), subItems: [
        { label: 'Logitech', href: storeUrl('/productos?categoria=Periféricos&marca=Logitech') },
        { label: 'Redragon', href: storeUrl('/productos?categoria=Periféricos&marca=Redragon') },
      ]},
      { label: 'Auriculares', href: storeUrl('/productos?categoria=Audio y Video') },
      { label: 'Webcams', href: storeUrl('/productos?categoria=Accesorios') },
    ],
  },
  {
    id: 'storage',
    label: 'Almacenamiento',
    icon: 'HardDrive',
    items: [
      { label: 'SSD', href: storeUrl('/productos?categoria=Almacenamiento'), subItems: [
        { label: 'Kingston', href: storeUrl('/productos?categoria=Almacenamiento&marca=Kingston') },
        { label: 'Samsung', href: storeUrl('/productos?categoria=Almacenamiento&marca=Samsung') },
        { label: 'Crucial', href: storeUrl('/productos?categoria=Almacenamiento&marca=Crucial') },
        { label: 'WD', href: storeUrl('/productos?categoria=Almacenamiento&marca=WD') },
      ]},
      { label: 'HDD', href: storeUrl('/productos?categoria=Almacenamiento') },
      { label: 'NAS', href: storeUrl('/productos?categoria=Almacenamiento') },
    ],
  },
  {
    id: 'networks',
    label: 'Redes',
    icon: 'Network',
    items: [
      { label: 'Routers', href: storeUrl('/productos?categoria=Redes'), subItems: [
        { label: 'TP-Link', href: storeUrl('/productos?categoria=Redes&marca=TP-Link') },
        { label: 'Ubiquiti', href: storeUrl('/productos?categoria=Redes&marca=Ubiquiti') },
      ]},
      { label: 'Switches', href: storeUrl('/productos?categoria=Redes') },
      { label: 'Access Points', href: storeUrl('/productos?categoria=Redes') },
    ],
  },
  {
    id: 'printing',
    label: 'Impresión',
    icon: 'Printer',
    items: [
      { label: 'Impresoras', href: storeUrl('/productos?categoria=Impresoras'), subItems: [
        { label: 'HP', href: storeUrl('/productos?categoria=Impresoras&marca=HP') },
        { label: 'Epson', href: storeUrl('/productos?categoria=Impresoras&marca=Epson') },
        { label: 'Brother', href: storeUrl('/productos?categoria=Impresoras&marca=Brother') },
      ]},
      { label: 'Multifuncionales', href: storeUrl('/productos?categoria=Impresoras') },
    ],
  },
  {
    id: 'power',
    label: 'Cables y Energía',
    icon: 'Zap',
    items: [
      { label: 'UPS', href: storeUrl('/productos?categoria=Cables y Energía'), subItems: [
        { label: 'Forza', href: storeUrl('/productos?categoria=Cables y Energía&marca=Forza') },
        { label: 'APC', href: storeUrl('/productos?categoria=Cables y Energía&marca=APC') },
      ]},
      { label: 'Regletas', href: storeUrl('/productos?categoria=Cables y Energía') },
      { label: 'Accesorios', href: storeUrl('/productos?categoria=Accesorios') },
    ],
  },
]

export const featuredBrands = [
  { name: 'Intel', href: storeUrl('/productos?marca=Intel') },
  { name: 'AMD', href: storeUrl('/productos?marca=AMD') },
  { name: 'NVIDIA', href: storeUrl('/productos?marca=NVIDIA') },
  { name: 'Dell', href: storeUrl('/productos?marca=Dell') },
  { name: 'HP', href: storeUrl('/productos?marca=HP') },
  { name: 'Lenovo', href: storeUrl('/productos?marca=Lenovo') },
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
