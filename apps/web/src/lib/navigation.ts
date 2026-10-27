// ─── Navegación Principal ──────────────────────────────────────────────────────────────────

export const mainNav = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/productos', hasMegaMenu: true },
  { label: 'Servicios TI', href: '/servicios', hasMenu: true },
  { label: 'Infraestructura TI', href: '/servicios', hasMenu: true },
  { label: 'Desarrollo de software', href: '/sistemas', hasMenu: true },
  { label: 'Empresa', href: '/nosotros', hasMenu: true },
]

// ─── Mega Menú de Tienda ──────────────────────────────────────────────────────────────────

export const storeCategories = [
  {
    id: 'pcs',
    label: 'PC y Servidores',
    icon: 'Cpu',
    items: [
      { label: 'PCs de Escritorio', href: '/productos?categoria=PC y Servidores' },
      { label: 'Servidores', href: '/productos?categoria=PC y Servidores' },
      { label: 'Mini PCs', href: '/productos?categoria=PC y Servidores' },
    ],
  },
  {
    id: 'laptops',
    label: 'Laptops',
    icon: 'Laptop',
    items: [
      { label: 'Laptops', href: '/productos?categoria=Laptops', subItems: [
        { label: 'Lenovo', href: '/productos?categoria=Laptops&marca=Lenovo' },
        { label: 'Dell', href: '/productos?categoria=Laptops&marca=Dell' },
        { label: 'HP', href: '/productos?categoria=Laptops&marca=HP' },
        { label: 'ASUS', href: '/productos?categoria=Laptops&marca=ASUS' },
        { label: 'Acer', href: '/productos?categoria=Laptops&marca=Acer' },
        { label: 'MSI', href: '/productos?categoria=Laptops&marca=MSI' },
      ]},
      { label: 'Laptops Empresariales', href: '/productos?categoria=Laptops' },
      { label: 'Laptops Gaming', href: '/productos?categoria=Laptops' },
    ],
  },
  {
    id: 'components',
    label: 'Componentes',
    icon: 'Cpu',
    items: [
      { label: 'Procesadores', href: '/productos?categoria=Componentes', subItems: [
        { label: 'Intel', href: '/productos?categoria=Componentes&marca=Intel' },
        { label: 'AMD', href: '/productos?categoria=Componentes&marca=AMD' },
      ]},
      { label: 'Tarjetas Gráficas', href: '/productos?categoria=Componentes', subItems: [
        { label: 'NVIDIA', href: '/productos?categoria=Componentes&marca=NVIDIA' },
        { label: 'ASUS', href: '/productos?categoria=Componentes&marca=ASUS' },
        { label: 'MSI', href: '/productos?categoria=Componentes&marca=MSI' },
      ]},
      { label: 'Placas Madre', href: '/productos?categoria=Componentes' },
      { label: 'Fuentes de Poder', href: '/productos?categoria=Cables y Energía' },
    ],
  },
  {
    id: 'monitors',
    label: 'Monitores',
    icon: 'Monitor',
    items: [
      { label: 'Monitores', href: '/productos?categoria=Monitores', subItems: [
        { label: 'LG', href: '/productos?categoria=Monitores&marca=LG' },
        { label: 'Samsung', href: '/productos?categoria=Monitores&marca=Samsung' },
        { label: 'Dell', href: '/productos?categoria=Monitores&marca=Dell' },
        { label: 'ASUS', href: '/productos?categoria=Monitores&marca=ASUS' },
      ]},
      { label: 'Gaming', href: '/productos?categoria=Monitores' },
      { label: 'Profesionales', href: '/productos?categoria=Monitores' },
    ],
  },
  {
    id: 'peripherals',
    label: 'Periféricos',
    icon: 'MousePointer2',
    items: [
      { label: 'Teclados', href: '/productos?categoria=Periféricos', subItems: [
        { label: 'Logitech', href: '/productos?categoria=Periféricos&marca=Logitech' },
        { label: 'Redragon', href: '/productos?categoria=Periféricos&marca=Redragon' },
        { label: 'Razer', href: '/productos?categoria=Periféricos&marca=Razer' },
      ]},
      { label: 'Mouse', href: '/productos?categoria=Periféricos', subItems: [
        { label: 'Logitech', href: '/productos?categoria=Periféricos&marca=Logitech' },
        { label: 'Redragon', href: '/productos?categoria=Periféricos&marca=Redragon' },
      ]},
      { label: 'Auriculares', href: '/productos?categoria=Audio y Video' },
      { label: 'Webcams', href: '/productos?categoria=Accesorios' },
    ],
  },
  {
    id: 'storage',
    label: 'Almacenamiento',
    icon: 'HardDrive',
    items: [
      { label: 'SSD', href: '/productos?categoria=Almacenamiento', subItems: [
        { label: 'Kingston', href: '/productos?categoria=Almacenamiento&marca=Kingston' },
        { label: 'Samsung', href: '/productos?categoria=Almacenamiento&marca=Samsung' },
        { label: 'Crucial', href: '/productos?categoria=Almacenamiento&marca=Crucial' },
        { label: 'WD', href: '/productos?categoria=Almacenamiento&marca=WD' },
      ]},
      { label: 'HDD', href: '/productos?categoria=Almacenamiento' },
      { label: 'NAS', href: '/productos?categoria=Almacenamiento' },
    ],
  },
  {
    id: 'networks',
    label: 'Redes',
    icon: 'Network',
    items: [
      { label: 'Routers', href: '/productos?categoria=Redes', subItems: [
        { label: 'TP-Link', href: '/productos?categoria=Redes&marca=TP-Link' },
        { label: 'Ubiquiti', href: '/productos?categoria=Redes&marca=Ubiquiti' },
      ]},
      { label: 'Switches', href: '/productos?categoria=Redes' },
      { label: 'Access Points', href: '/productos?categoria=Redes' },
    ],
  },
  {
    id: 'printing',
    label: 'Impresión',
    icon: 'Printer',
    items: [
      { label: 'Impresoras', href: '/productos?categoria=Impresoras', subItems: [
        { label: 'HP', href: '/productos?categoria=Impresoras&marca=HP' },
        { label: 'Epson', href: '/productos?categoria=Impresoras&marca=Epson' },
        { label: 'Brother', href: '/productos?categoria=Impresoras&marca=Brother' },
      ]},
      { label: 'Multifuncionales', href: '/productos?categoria=Impresoras' },
    ],
  },
  {
    id: 'power',
    label: 'Cables y Energía',
    icon: 'Zap',
    items: [
      { label: 'UPS', href: '/productos?categoria=Cables y Energía', subItems: [
        { label: 'Forza', href: '/productos?categoria=Cables y Energía&marca=Forza' },
        { label: 'APC', href: '/productos?categoria=Cables y Energía&marca=APC' },
      ]},
      { label: 'Regletas', href: '/productos?categoria=Cables y Energía' },
      { label: 'Accesorios', href: '/productos?categoria=Accesorios' },
    ],
  },
]

export const featuredBrands = [
  { name: 'Intel', href: '/productos?marca=intel' },
  { name: 'AMD', href: '/productos?marca=amd' },
  { name: 'NVIDIA', href: '/productos?marca=nvidia' },
  { name: 'Dell', href: '/productos?marca=dell' },
  { name: 'HP', href: '/productos?marca=hp' },
  { name: 'Lenovo', href: '/productos?marca=lenovo' },
]

// ─── Menús de Servicios ──────────────────────────────────────────────────────────────────

export type NavMenuItem = {
  label: string
  href: string
  desc?: string
}

export const itServicesMenu: NavMenuItem[] = [
  { label: 'Soporte técnico', href: '/soporte-ti', desc: 'Asistencia inmediata para problemas técnicos' },
  { label: 'Mantenimiento de computadoras y laptops', href: '/soporte-ti', desc: 'Servicio preventivo y correctivo' },
  { label: 'Instalación y configuración de software', href: '/soporte-ti', desc: 'Sistemas operativos y aplicaciones' },
  { label: 'Configuración de impresoras', href: '/soporte-ti', desc: 'Configuración en red y local' },
  { label: 'Soporte remoto y presencial', href: '/soporte-ti', desc: 'Atención flexible según tus necesidades' },
  { label: 'Soluciones de soporte para empresas', href: '/servicios', desc: 'Planes empresariales personalizados' },
]

export const infrastructureMenu: NavMenuItem[] = [
  { label: 'Redes y conectividad', href: '/servicios', desc: 'Diseño e implementación de redes' },
  { label: 'Cableado estructurado', href: '/servicios', desc: 'Instalación profesional de cableado' },
  { label: 'Configuración de equipos de red', href: '/servicios', desc: 'Routers, switches y access points' },
  { label: 'Implementación de infraestructura tecnológica', href: '/servicios', desc: 'Infraestructura completa para empresas' },
  { label: 'Equipamiento tecnológico empresarial', href: '/servicios', desc: 'Servidores y equipamiento profesional' },
]

export const softwareDevMenu: NavMenuItem[] = [
  { label: 'Sistemas web a medida', href: '/sistemas', desc: 'Desarrollo de aplicaciones web personalizadas' },
  { label: 'Sistemas de gestión empresarial', href: '/sistemas', desc: 'ERP y sistemas de gestión' },
  { label: 'Automatización de procesos', href: '/sistemas', desc: 'Optimización de flujos de trabajo' },
  { label: 'Integraciones y API', href: '/sistemas', desc: 'Conexión entre sistemas existentes' },
  { label: 'Consultoría y proyectos personalizados', href: '/sistemas', desc: 'Asesoría tecnológica especializada' },
]

// ─── Menú Empresa ─────────────────────────────────────────────────────────────────────

export const companyMenu: NavMenuItem[] = [
  { label: 'Sobre nosotros', href: '/nosotros', desc: 'Trayectoria, valores y equipo técnico' },
  { label: 'Proyectos y experiencia', href: '/proyectos', desc: 'Casos de éxito y sectores atendidos' },
  { label: 'Cómo trabajamos', href: '/como-trabajamos', desc: 'Metodología, etapas y garantías' },
  { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes', desc: 'Respuestas a consultas habituales' },
  { label: 'Contacto', href: '/contacto', desc: 'Canales directos de atención y cotización' },
]
