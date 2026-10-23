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
    id: 'components',
    label: 'Componentes de PC',
    icon: 'Cpu',
    items: [
      { label: 'Procesadores', href: '/productos?categoria=procesadores', subItems: [
        { label: 'Intel', href: '/productos?categoria=procesadores&marca=intel' },
        { label: 'AMD', href: '/productos?categoria=procesadores&marca=amd' },
        { label: 'Ryzen', href: '/productos?categoria=procesadores&marca=ryzen' },
      ]},
      { label: 'Placas madre', href: '/productos?categoria=placas-madre', subItems: [
        { label: 'Intel', href: '/productos?categoria=placas-madre&marca=intel' },
        { label: 'AMD', href: '/productos?categoria=placas-madre&marca=amd' },
        { label: 'ASUS', href: '/productos?categoria=placas-madre&marca=asus' },
      ]},
      { label: 'Memoria RAM', href: '/productos?categoria=memoria-ram', subItems: [
        { label: 'DDR4', href: '/productos?categoria=memoria-ram&tipo=ddr4' },
        { label: 'DDR5', href: '/productos?categoria=memoria-ram&tipo=ddr5' },
        { label: 'Laptop RAM', href: '/productos?categoria=memoria-ram&tipo=laptop' },
      ]},
      { label: 'Tarjetas gráficas', href: '/productos?categoria=tarjetas-graficas', subItems: [
        { label: 'NVIDIA', href: '/productos?categoria=tarjetas-graficas&marca=nvidia' },
        { label: 'AMD Radeon', href: '/productos?categoria=tarjetas-graficas&marca=amd' },
        { label: 'GTX', href: '/productos?categoria=tarjetas-graficas&serie=gtx' },
      ]},
      { label: 'Discos SSD', href: '/productos?categoria=discos-ssd' },
    ],
  },
  {
    id: 'laptops',
    label: 'Laptops y computadoras',
    icon: 'Laptop',
    items: [
      { label: 'Laptops de trabajo', href: '/productos?categoria=laptops-trabajo', subItems: [
        { label: 'Lenovo ThinkPad', href: '/productos?categoria=laptops-trabajo&marca=lenovo' },
        { label: 'Dell Latitude', href: '/productos?categoria=laptops-trabajo&marca=dell' },
        { label: 'HP EliteBook', href: '/productos?categoria=laptops-trabajo&marca=hp' },
      ]},
      { label: 'Laptops gaming', href: '/productos?categoria=laptops-gaming', subItems: [
        { label: 'ASUS ROG', href: '/productos?categoria=laptops-gaming&marca=asus' },
        { label: 'MSI', href: '/productos?categoria=laptops-gaming&marca=msi' },
        { label: 'Acer Predator', href: '/productos?categoria=laptops-gaming&marca=acer' },
      ]},
      { label: 'Computadoras de escritorio', href: '/productos?categoria=computadoras-escritorio' },
      { label: 'All-in-One', href: '/productos?categoria=all-in-one' },
      { label: 'Mini PCs', href: '/productos?categoria=mini-pcs' },
    ],
  },
  {
    id: 'monitors',
    label: 'Monitores y pantallas',
    icon: 'Monitor',
    items: [
      { label: 'Monitores 4K', href: '/productos?categoria=monitores-4k', subItems: [
        { label: '27"', href: '/productos?categoria=monitores-4k&tamano=27' },
        { label: '32"', href: '/productos?categoria=monitores-4k&tamano=32' },
        { label: '34"', href: '/productos?categoria=monitores-4k&tamano=34' },
      ]},
      { label: 'Monitores IPS', href: '/productos?categoria=monitores-ips' },
      { label: 'Monitores gaming', href: '/productos?categoria=monitores-gaming', subItems: [
        { label: '144Hz', href: '/productos?categoria=monitores-gaming=144hz' },
        { label: '240Hz', href: '/productos?categoria=monitores-gaming=240hz' },
        { label: '360Hz', href: '/productos?categoria=monitores-gaming=360hz' },
      ]},
      { label: 'Monitores ultrawide', href: '/productos?categoria=monitores-ultrawide' },
      { label: 'Pantallas táctiles', href: '/productos?categoria=pantallas-tactiles' },
    ],
  },
  {
    id: 'peripherals',
    label: 'Periféricos y accesorios',
    icon: 'MousePointer2',
    items: [
      { label: 'Teclados', href: '/productos?categoria=teclados', subItems: [
        { label: 'Mecánicos', href: '/productos?categoria=teclados&tipo=mecanico' },
        { label: 'Membrana', href: '/productos?categoria=teclados&tipo=membrana' },
        { label: 'Inalámbricos', href: '/productos?categoria=teclados&tipo=inalambrico' },
      ]},
      { label: 'Ratones', href: '/productos?categoria=ratones', subItems: [
        { label: 'Gaming', href: '/productos?categoria=ratones&tipo=gaming' },
        { label: 'Oficina', href: '/productos?categoria=ratones&tipo=oficina' },
        { label: 'Inalámbricos', href: '/productos?categoria=ratones&tipo=inalambrico' },
      ]},
      { label: 'Webcams', href: '/productos?categoria=webcams' },
      { label: 'Auriculares', href: '/productos?categoria=auriculares' },
      { label: 'Parlantes', href: '/productos?categoria=parlantes' },
    ],
  },
  {
    id: 'storage',
    label: 'Almacenamiento',
    icon: 'HardDrive',
    items: [
      { label: 'Discos SSD', href: '/productos?categoria=discos-ssd', subItems: [
        { label: 'NVMe M.2', href: '/productos?categoria=discos-ssd&tipo=nvme' },
        { label: 'SATA III', href: '/productos?categoria=discos-ssd&tipo=sata' },
        { label: 'Externos', href: '/productos?categoria=discos-ssd&tipo=externo' },
      ]},
      { label: 'Discos HDD', href: '/productos?categoria=discos-hdd' },
      { label: 'Unidades NVMe', href: '/productos?categoria=unidades-nvme' },
      { label: 'Memorias USB', href: '/productos?categoria=memorias-usb' },
      { label: 'Discos externos', href: '/productos?categoria=discos-externos' },
    ],
  },
  {
    id: 'networks',
    label: 'Redes y conectividad',
    icon: 'Network',
    items: [
      { label: 'Routers', href: '/productos?categoria=routers', subItems: [
        { label: 'TP-Link', href: '/productos?categoria=routers&marca=tp-link' },
        { label: 'Cisco', href: '/productos?categoria=routers&marca=cisco' },
        { label: 'Linksys', href: '/productos?categoria=routers&marca=linksys' },
      ]},
      { label: 'Switches', href: '/productos?categoria=switches' },
      { label: 'Access points', href: '/productos?categoria=access-points' },
      { label: 'Tarjetas de red', href: '/productos?categoria=tarjetas-red' },
      { label: 'Cables de red', href: '/productos?categoria=cables-red' },
    ],
  },
  {
    id: 'printing',
    label: 'Impresión',
    icon: 'Printer',
    items: [
      { label: 'Impresoras láser', href: '/productos?categoria=impresoras-laser' },
      { label: 'Impresoras inyección', href: '/productos?categoria=impresoras-inyeccion' },
      { label: 'Multifuncionales', href: '/productos?categoria=multifuncionales' },
      { label: 'Escáneres', href: '/productos?categoria=escaneres' },
      { label: 'Toner y tinta', href: '/productos?categoria=toner-tinta' },
    ],
  },
  {
    id: 'power',
    label: 'Energía y protección eléctrica',
    icon: 'Zap',
    items: [
      { label: 'Fuentes de poder', href: '/productos?categoria=fuentes-poder', subItems: [
        { label: '80 Plus', href: '/productos?categoria=fuentes-poder&watts=80plus' },
        { label: '750W', href: '/productos?categoria=fuentes-poder&watts=750' },
        { label: '850W', href: '/productos?categoria=fuentes-poder&watts=850' },
        { label: '1000W', href: '/productos?categoria=fuentes-poder&watts=1000' },
      ]},
      { label: 'UPS', href: '/productos?categoria=ups', subItems: [
        { label: '600VA', href: '/productos?categoria=ups&va=600' },
        { label: '1000VA', href: '/productos?categoria=ups&va=1000' },
        { label: '1500VA', href: '/productos?categoria=ups&va=1500' },
        { label: '2200VA', href: '/productos?categoria=ups&va=2200' },
      ]},
      { label: 'Regletas', href: '/productos?categoria=regletas' },
      { label: 'Protectores de sobretensión', href: '/productos?categoria=protectores-sobretension' },
      { label: 'Cableado eléctrico', href: '/productos?categoria=cableado-electrico' },
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

export const itServicesMenu = [
  { label: 'Soporte técnico', href: '/soporte-ti', desc: 'Asistencia inmediata para problemas técnicos' },
  { label: 'Mantenimiento de computadoras y laptops', href: '/soporte-ti', desc: 'Servicio preventivo y correctivo' },
  { label: 'Instalación y configuración de software', href: '/soporte-ti', desc: 'Sistemas operativos y aplicaciones' },
  { label: 'Configuración de impresoras', href: '/soporte-ti', desc: 'Configuración en red y local' },
  { label: 'Soporte remoto y presencial', href: '/soporte-ti', desc: 'Atención flexible según tus necesidades' },
  { label: 'Soluciones de soporte para empresas', href: '/servicios', desc: 'Planes empresariales personalizados' },
]

export const infrastructureMenu = [
  { label: 'Redes y conectividad', href: '/servicios', desc: 'Diseño e implementación de redes' },
  { label: 'Cableado estructurado', href: '/servicios', desc: 'Instalación profesional de cableado' },
  { label: 'Configuración de equipos de red', href: '/servicios', desc: 'Routers, switches y access points' },
  { label: 'Implementación de infraestructura tecnológica', href: '/servicios', desc: 'Infraestructura completa para empresas' },
  { label: 'Equipamiento tecnológico empresarial', href: '/servicios', desc: 'Servidores y equipamiento profesional' },
]

export const softwareDevMenu = [
  { label: 'Sistemas web a medida', href: '/sistemas', desc: 'Desarrollo de aplicaciones web personalizadas' },
  { label: 'Sistemas de gestión empresarial', href: '/sistemas', desc: 'ERP y sistemas de gestión' },
  { label: 'Automatización de procesos', href: '/sistemas', desc: 'Optimización de flujos de trabajo' },
  { label: 'Integraciones y API', href: '/sistemas', desc: 'Conexión entre sistemas existentes' },
  { label: 'Consultoría y proyectos personalizados', href: '/sistemas', desc: 'Asesoría tecnológica especializada' },
]

// ─── Menú Empresa ─────────────────────────────────────────────────────────────────────

export const companyMenu = [
  { label: 'Sobre nosotros', href: '/nosotros' },
  { label: 'Proyectos y experiencia', href: '/nosotros#proyectos' },
  { label: 'Cómo trabajamos', href: '/nosotros#metodologia' },
  { label: 'Preguntas frecuentes', href: '/nosotros#faq' },
  { label: 'Contacto', href: '/contacto' },
]
