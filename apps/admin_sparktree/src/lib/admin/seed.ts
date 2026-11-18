import type {
  ActivityEntry,
  AdminData,
  AdminProduct,
  Brand,
  Category,
  Client,
  GoodsReceipt,
  InventoryMovement,
  MovementSourceType,
  Order,
  ProductAttribute,
  PurchaseOrder,
  PurchaseOrderLine,
  PurchaseOrderStatus,
  PurchaseRequest,
  PurchaseRequestLine,
  Quote,
  StockCount,
  StockCountLine,
  StoreSettings,
  Supplier,
  WarehouseLocation,
  WebProject,
} from './types'
import { slugify } from './format'

type SeedCategory = Omit<Category, 'slug' | 'description' | 'image' | 'status' | 'order'>

const categories: SeedCategory[] = [
  {
    id: 'impresoras-escaneres',
    label: 'Impresoras y Escáneres',
    subcategories: [
      {
        id: 'tinta-continua',
        label: 'Impresoras de Tinta Continua',
        subSubcategories: [
          { id: 'tanque-tinta', label: 'Tanque de Tinta Wi-Fi' },
          { id: 'multifuncional-color', label: 'Multifuncional a Color' },
          { id: 'ecotank-empresarial', label: 'EcoTank Empresarial' },
        ],
      },
      {
        id: 'cartucho',
        label: 'Impresoras de Cartucho',
        subSubcategories: [
          { id: 'inyeccion-termica', label: 'Inyección Térmica' },
          { id: 'fotografica', label: 'Fotográfica Compacta' },
          { id: 'cartuchos-consumibles', label: 'Cartuchos y Consumibles' },
        ],
      },
      {
        id: 'laser',
        label: 'Impresoras Láser',
        subSubcategories: [
          { id: 'laser-monocromatica', label: 'Láser Monocromática' },
          { id: 'laser-color', label: 'Láser Color Corporativa' },
          { id: 'toner', label: 'Tóner y Tambores' },
        ],
      },
      {
        id: 'escaneres',
        label: 'Escáneres y Digitalizadores',
        subSubcategories: [
          { id: 'escaner-documental-adf', label: 'Escáner de Documentos ADF' },
          { id: 'escaner-cama-plana', label: 'Escáner Cama Plana' },
          { id: 'escaner-portatil', label: 'Escáner Portátil' },
        ],
      },
    ],
  },
  {
    id: 'laptops',
    label: 'Laptops',
    subcategories: [
      {
        id: 'laptops-corporativas',
        label: 'Laptops Corporativas',
        subSubcategories: [
          { id: 'thinkpad', label: 'Lenovo ThinkPad' },
          { id: 'latitude', label: 'Dell Latitude' },
          { id: 'probook', label: 'HP ProBook' },
        ],
      },
      {
        id: 'laptops-gaming',
        label: 'Laptops Gaming',
        subSubcategories: [
          { id: 'tuf-gaming', label: 'ASUS TUF' },
          { id: 'loq-legion', label: 'Lenovo Legion' },
        ],
      },
      {
        id: 'laptops-ultraligeras',
        label: 'Laptops Ultraligeras y Estudio',
        subSubcategories: [
          { id: 'ideapad', label: 'IdeaPad Slim' },
          { id: 'pavilion', label: 'HP Pavilion' },
        ],
      },
    ],
  },
  {
    id: 'pc-servidores',
    label: 'PC y Servidores',
    subcategories: [
      {
        id: 'pcs-escritorio',
        label: 'PCs de Escritorio y Torres',
        subSubcategories: [
          { id: 'pc-gamer', label: 'PC Gamer Custom' },
          { id: 'pc-corporativa', label: 'Torres Corporativas' },
        ],
      },
      {
        id: 'servidores',
        label: 'Servidores Tower y Rack',
        subSubcategories: [
          { id: 'servidor-tower', label: 'Servidores Tower' },
          { id: 'servidor-rack', label: 'Servidores Rackeables' },
        ],
      },
      {
        id: 'mini-pcs',
        label: 'Mini PCs y All in One',
        subSubcategories: [{ id: 'mini-pc', label: 'Mini PCs Compactos' }],
      },
    ],
  },
  {
    id: 'componentes',
    label: 'Componentes',
    subcategories: [
      {
        id: 'procesadores',
        label: 'Procesadores (CPU)',
        subSubcategories: [
          { id: 'cpu-intel', label: 'Intel Core' },
          { id: 'cpu-amd', label: 'AMD Ryzen' },
        ],
      },
      {
        id: 'tarjetas-video',
        label: 'Tarjetas Gráficas (GPU)',
        subSubcategories: [
          { id: 'gpu-nvidia', label: 'NVIDIA RTX' },
          { id: 'gpu-amd', label: 'AMD Radeon' },
        ],
      },
      {
        id: 'placas-madre',
        label: 'Placas Madre (Motherboards)',
        subSubcategories: [],
      },
      {
        id: 'fuentes-poder',
        label: 'Fuentes de Poder y Gabinetes',
        subSubcategories: [],
      },
    ],
  },
  {
    id: 'almacenamiento',
    label: 'Almacenamiento',
    subcategories: [
      {
        id: 'ssd',
        label: 'Discos Sólidos (SSD)',
        subSubcategories: [
          { id: 'ssd-nvme', label: 'M.2 NVMe PCIe' },
          { id: 'ssd-sata', label: 'SATA 2.5"' },
        ],
      },
      {
        id: 'hdd',
        label: 'Discos Duros (HDD)',
        subSubcategories: [
          { id: 'hdd-interno', label: 'HDD Interno 3.5"' },
          { id: 'hdd-externo', label: 'Discos Externos USB' },
        ],
      },
      {
        id: 'nas',
        label: 'Servidores de Almacenamiento NAS',
        subSubcategories: [],
      },
    ],
  },
  {
    id: 'redes',
    label: 'Redes',
    subcategories: [
      { id: 'routers-mesh', label: 'Routers y Sistemas Mesh', subSubcategories: [] },
      { id: 'switches', label: 'Switches Gestionables y PoE', subSubcategories: [] },
      { id: 'access-points', label: 'Access Points Wi-Fi 6', subSubcategories: [] },
    ],
  },
  {
    id: 'monitores',
    label: 'Monitores',
    subcategories: [
      { id: 'monitores-gaming', label: 'Monitores Gaming (144Hz+)', subSubcategories: [] },
      { id: 'monitores-profesionales', label: 'Monitores Profesionales IPS', subSubcategories: [] },
    ],
  },
  {
    id: 'perifericos',
    label: 'Periféricos',
    subcategories: [
      { id: 'teclados', label: 'Teclados Mecánicos y Oficina', subSubcategories: [] },
      { id: 'mouse', label: 'Mouse Ergonómico y Gamer', subSubcategories: [] },
      { id: 'auriculares', label: 'Auriculares y Headsets', subSubcategories: [] },
    ],
  },
  {
    id: 'accesorios',
    label: 'Accesorios',
    subcategories: [],
  },
  {
    id: 'audio-video',
    label: 'Audio y Video',
    subcategories: [],
  },
  {
    id: 'gaming',
    label: 'Gaming',
    subcategories: [
      { id: 'consolas', label: 'Consolas y Videojuegos', subSubcategories: [] },
      { id: 'controles', label: 'Controles y Accesorios', subSubcategories: [] },
    ],
  },
  {
    id: 'software',
    label: 'Software',
    subcategories: [],
  },
  {
    id: 'cables-energia',
    label: 'Cables y Energía',
    subcategories: [
      { id: 'ups', label: 'Sistemas UPS y Baterías', subSubcategories: [] },
      { id: 'supresores', label: 'Supresores de Picos', subSubcategories: [] },
    ],
  },
]

const categoryDescriptions: Record<string, string> = {
  'impresoras-escaneres': 'Impresoras de tinta continua, láser y equipos multifuncionales.',
  laptops: 'Equipos portátiles para trabajo corporativo, gaming y estudio.',
  'pc-servidores': 'Equipos de escritorio, estaciones de trabajo y servidores.',
  componentes: 'Procesadores, tarjetas gráficas, placas madre y fuentes.',
  almacenamiento: 'Discos SSD, HDD y soluciones NAS para empresas.',
  monitores: 'Pantallas profesionales, monitores gaming y videoconferencia.',
  redes: 'Routers, switches y acceso point para redes empresariales.',
  perifericos: 'Teclados, mouse, audio y accesorios de productividad.',
}

const brandNames = [
  'HP',
  'Epson',
  'Brother',
  'Canon',
  'Lenovo',
  'ASUS',
  'Dell',
  'AMD',
  'Intel',
  'NVIDIA',
  'Kingston',
  'WD',
  'TP-Link',
  'Logitech',
  'HyperX',
  'Microsoft',
  'Forza',
  'Sony',
  'Xiaomi',
  'Samsung',
  'LG',
  'MSI',
  'HPE',
  'Crucial',
  'Seagate',
  'Synology',
  'Razer',
  'UGREEN',
  'Ubiquiti',
  'APC',
  'ESET',
  'JBL',
  'Redragon',
  'Acer',
  'FJ Build',
]

const brandDescriptions: Record<string, string> = {
  HP: 'Impresión, cómputo y periféricos para oficina.',
  Epson: 'Impresoras de inyección de tinta y escáneres.',
  Brother: 'Impresoras láser y equipos multifuncionales.',
  Lenovo: 'Laptops y equipos corporativos.',
  ASUS: 'Componentes, laptops y monitores.',
  Dell: 'Equipos de cómputo y servidores empresariales.',
  Logitech: 'Periféricos y accesorios de productividad.',
  AMD: 'Procesadores y tarjetas gráficas.',
  NVIDIA: 'Tarjetas gráficas profesionales y gaming.',
  'FJ Build': 'Equipos ensamblados y configurados por FJ Systems.',
}

const brands: Brand[] = brandNames.map((name, index) => ({
  id: slugify(name),
  name,
  slug: slugify(name),
  description: brandDescriptions[name] ?? '',
  logo: '',
  status: 'active',
  order: index,
}))

const settings: StoreSettings = {
  storeName: 'FJ Systems',
  legalName: 'FJ Systems S.A.C.',
  ruc: '20601234567',
  email: 'ventas@fjsystems.pe',
  phone: '+51 999 888 777',
  address: 'Av. Javier Prado Este 1234, San Isidro, Lima',
  currency: 'PEN',
  igv: 18,
  lowStockThreshold: 5,
}

type SeedProduct = Omit<
  AdminProduct,
  | 'createdAt'
  | 'updatedAt'
  | 'shortDescription'
  | 'internalCode'
  | 'showPrice'
  | 'commercialMessage'
  | 'seoTitle'
  | 'seoDescription'
  | 'imageAlt'
> & {
  createdAt: string
  updatedAt: string
}

const products: SeedProduct[] = [
  {
    id: 'hp-smart-tank-580',
    slug: 'hp-smart-tank-580',
    name: 'Impresora HP Smart Tank 580',
    description:
      'Impresora multifuncional con tanque de tinta continua de alto rendimiento, Wi-Fi y conexión móvil para impresión sin cartuchos.',
    category: 'Impresoras y Escáneres',
    subcategory: 'Impresoras de Tinta Continua',
    subSubcategory: 'Tanque de Tinta Wi-Fi',
    brand: 'HP',
    model: 'Smart Tank 580',
    sku: 'HP-ST580',
    price: 899,
    cost: 720,
    stock: 14,
    minStock: 5,
    availability: 'available',
    status: 'active',
    featured: true,
    specs: ['Multifuncional · Wi-Fi', 'Impresión a color sin cartuchos', 'Hasta 12,000 páginas', 'Bandeja de 100 hojas'],
    image:
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-12T14:10:00.000Z',
    updatedAt: '2026-10-28T15:20:00.000Z',
  },
  {
    id: 'epson-ecotank-l3250',
    slug: 'epson-ecotank-l3250',
    name: 'Impresora Epson EcoTank L3250',
    description:
      'Multifuncional con sistema EcoTank sin cartuchos, Wi-Fi Direct y costo por página ultrabajo para oficinas y hogares.',
    category: 'Impresoras y Escáneres',
    subcategory: 'Impresoras de Tinta Continua',
    subSubcategory: 'Tanque de Tinta Wi-Fi',
    brand: 'Epson',
    model: 'EcoTank L3250',
    sku: 'EPS-L3250',
    price: 849,
    cost: 690,
    stock: 3,
    minStock: 5,
    availability: 'limited',
    status: 'active',
    featured: false,
    specs: ['Multifuncional · Wi-Fi Direct', 'Impresión a color EcoTank', 'Hasta 4,500 páginas', '5760 x 1440 dpi'],
    image:
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-14T10:30:00.000Z',
    updatedAt: '2026-10-27T09:45:00.000Z',
  },
  {
    id: 'brother-hl-l2350dw',
    slug: 'brother-hl-l2350dw',
    name: 'Impresora Brother HL-L2350DW',
    description:
      'Impresora láser monocromática compacta con dúplex automático y Wi-Fi de alta velocidad para oficinas.',
    category: 'Impresoras y Escáneres',
    subcategory: 'Impresoras Láser',
    subSubcategory: 'Láser Monocromática',
    brand: 'Brother',
    model: 'HL-L2350DW',
    sku: 'BRO-HL2350DW',
    price: 749,
    cost: 610,
    stock: 0,
    minStock: 4,
    availability: 'consult',
    status: 'active',
    featured: false,
    specs: ['Láser monocromático', 'Dúplex automático · Wi-Fi', 'Velocidad 32 ppm', 'Bandeja de 250 hojas'],
    image:
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-10T16:00:00.000Z',
    updatedAt: '2026-10-26T11:15:00.000Z',
  },
  {
    id: 'canon-pixma-ts3420',
    slug: 'canon-pixma-ts3420',
    name: 'Impresora Canon PIXMA TS3420',
    description:
      'Impresora compacta inalámbrica con cartuchos FINE de alta resolución. Ideal para documentos y fotografías.',
    category: 'Impresoras y Escáneres',
    subcategory: 'Impresoras de Cartucho',
    subSubcategory: 'Inyección Térmica',
    brand: 'Canon',
    model: 'PIXMA TS3420',
    sku: 'CAN-TS3420',
    price: 499,
    cost: 399,
    stock: 22,
    minStock: 6,
    availability: 'available',
    status: 'draft',
    featured: false,
    specs: ['2 cartuchos FINE', 'Wi-Fi integrado', 'Pantalla LCD 1.5"', '4800 x 1200 dpi'],
    image:
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-10-02T12:20:00.000Z',
    updatedAt: '2026-10-24T18:05:00.000Z',
  },
  {
    id: 'hp-color-laserjet-pro-4203dw',
    slug: 'hp-color-laserjet-pro-4203dw',
    name: 'Impresora HP Color LaserJet Pro 4203dw',
    description:
      'Impresora láser a color corporativa con alta velocidad, seguridad HP Wolf Pro y tóner TerraJet de bajo consumo.',
    category: 'Impresoras y Escáneres',
    subcategory: 'Impresoras Láser',
    subSubcategory: 'Láser Color Corporativa',
    brand: 'HP',
    model: 'LaserJet 4203dw',
    sku: 'HP-LJ4203DW',
    price: 2499,
    cost: 2050,
    stock: 5,
    minStock: 3,
    availability: 'limited',
    status: 'active',
    featured: false,
    specs: ['35 ppm a color y B/N', 'Dúplex automático', 'Seguridad Wolf Pro', 'Ethernet + Wi-Fi'],
    image:
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-20T08:40:00.000Z',
    updatedAt: '2026-10-23T13:30:00.000Z',
  },
  {
    id: 'lenovo-ideapad-slim-3',
    slug: 'lenovo-ideapad-slim-3',
    name: 'Laptop Lenovo IdeaPad Slim 3 15.6"',
    description:
      'Laptop ligera y eficiente para trabajo y estudio diario. Pantalla Full HD y procesador AMD Ryzen de última generación.',
    category: 'Laptops',
    subcategory: 'Laptops Ultraligeras y Estudio',
    subSubcategory: 'IdeaPad Slim',
    brand: 'Lenovo',
    model: '82R80005PE',
    sku: '82R80005PE',
    price: 2499,
    cost: 2090,
    stock: 8,
    minStock: 4,
    availability: 'available',
    status: 'active',
    featured: true,
    specs: ['AMD Ryzen 5 7520U', '16 GB RAM · 512 GB SSD', 'Pantalla 15.6" FHD', 'Windows 11 Home'],
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80&auto=format&fit=crop',
    ],
    createdAt: '2026-09-05T09:00:00.000Z',
    updatedAt: '2026-10-28T10:10:00.000Z',
  },
  {
    id: 'asus-tuf-f15',
    slug: 'asus-tuf-f15',
    name: 'Laptop ASUS TUF Gaming F15 RTX 4060',
    description:
      'Laptop gaming resistente con GPU NVIDIA RTX 4060, diseño militar y refrigeración eficiente para sesiones prolongadas.',
    category: 'Laptops',
    subcategory: 'Laptops Gaming',
    subSubcategory: 'ASUS TUF',
    brand: 'ASUS',
    model: 'FX507HF-ES52',
    sku: 'FX507HF-ES52',
    price: 4999,
    cost: 4350,
    stock: 4,
    minStock: 3,
    availability: 'available',
    status: 'active',
    featured: true,
    specs: ['Intel Core i7-13620H', '16 GB RAM · 1 TB SSD', 'RTX 4060 6 GB', 'Pantalla 144 Hz'],
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-18T11:25:00.000Z',
    updatedAt: '2026-10-22T16:40:00.000Z',
  },
  {
    id: 'hp-pavilion-14',
    slug: 'hp-pavilion-14',
    name: 'Laptop HP Pavilion 14" Core i5',
    description:
      'Laptop compacta con diseño premium y rendimiento multitarea para profesionales y estudiantes.',
    category: 'Laptops',
    subcategory: 'Laptops Ultraligeras y Estudio',
    subSubcategory: 'HP Pavilion',
    brand: 'HP',
    model: '14-eh1000la',
    sku: '14-eh1000la',
    price: 2899,
    cost: 2450,
    stock: 12,
    minStock: 5,
    availability: 'available',
    status: 'active',
    featured: false,
    specs: ['Intel Core i5-1335U', '8 GB RAM · 512 GB SSD', 'Pantalla 14" FHD', 'Windows 11'],
    image:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-08T15:10:00.000Z',
    updatedAt: '2026-10-21T12:00:00.000Z',
  },
  {
    id: 'dell-latitude-5440',
    slug: 'dell-latitude-5440',
    name: 'Laptop empresarial Dell Latitude 5440',
    description:
      'Laptop corporativa con Intel vPro y seguridad avanzada, diseñada para entornos empresariales exigentes.',
    category: 'Laptops',
    subcategory: 'Laptops Corporativas',
    subSubcategory: 'Dell Latitude',
    brand: 'Dell',
    model: 'Latitude 5440',
    sku: 'LAT-5440-I5',
    price: 4599,
    cost: 3990,
    stock: 2,
    minStock: 3,
    availability: 'limited',
    status: 'active',
    featured: false,
    specs: ['Intel Core i5 vPro', '16 GB RAM · 512 GB SSD', '14" FHD IPS', 'Windows 11 Pro'],
    image:
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-16T13:50:00.000Z',
    updatedAt: '2026-10-20T09:20:00.000Z',
  },
  {
    id: 'pc-gamer-fj-ryzen-7',
    slug: 'pc-gamer-fj-ryzen-7',
    name: 'PC Gamer FJ Ryzen 7 + RTX 4060',
    description:
      'PC de escritorio ensamblada por FJ Systems con componentes de alto rendimiento para gaming y creación de contenido.',
    category: 'PC y Servidores',
    subcategory: 'PCs de Escritorio y Torres',
    subSubcategory: 'PC Gamer Custom',
    brand: 'FJ Build',
    model: 'FJ-GAMER-R7-4060',
    sku: 'FJ-R7-4060',
    price: 4299,
    cost: 3750,
    stock: 6,
    minStock: 2,
    availability: 'available',
    status: 'active',
    featured: true,
    specs: ['Ryzen 7 5700X · RTX 4060', '32 GB RAM · 1 TB NVMe', 'Case RGB', 'Fuente 650W 80+'],
    image:
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-25T10:00:00.000Z',
    updatedAt: '2026-10-29T08:05:00.000Z',
  },
  {
    id: 'servidor-dell-poweredge-t150',
    slug: 'servidor-dell-poweredge-t150',
    name: 'Servidor Dell PowerEdge T150',
    description:
      'Servidor tower de entrada para pequeñas empresas, con soporte para Intel Xeon E-2300 y hasta 4 bahías de almacenamiento.',
    category: 'PC y Servidores',
    subcategory: 'Servidores Tower y Rack',
    subSubcategory: 'Servidores Tower',
    brand: 'Dell',
    model: 'PowerEdge T150',
    sku: 'PE-T150-XEON',
    price: 6899,
    cost: 6100,
    stock: 2,
    minStock: 2,
    availability: 'limited',
    status: 'active',
    featured: false,
    specs: ['Intel Xeon E-2314', '16 GB ECC · 2 TB', '4 bahías 3.5"', 'Gigabit LAN'],
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-02T09:30:00.000Z',
    updatedAt: '2026-10-19T14:25:00.000Z',
  },
  {
    id: 'monitor-lg-ultragear-24',
    slug: 'monitor-lg-ultragear-24',
    name: 'Monitor LG UltraGear 24" 180Hz',
    description:
      'Monitor gaming de 24" con 180 Hz y 1 ms de respuesta. Ideal para juegos competitivos y productividad.',
    category: 'Monitores',
    subcategory: 'Monitores Gaming (144Hz+)',
    brand: 'LG',
    model: '24GN650',
    sku: '24GN650-B',
    price: 899,
    cost: 720,
    stock: 15,
    minStock: 6,
    availability: 'available',
    status: 'active',
    featured: false,
    specs: ['24" Full HD · 180 Hz', '1 ms · Panel IPS', 'AMD FreeSync', 'HDR10'],
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-11T08:20:00.000Z',
    updatedAt: '2026-10-18T17:00:00.000Z',
  },
  {
    id: 'monitor-samsung-odyssey-g5',
    slug: 'monitor-samsung-odyssey-g5',
    name: 'Monitor Samsung Odyssey G5 27"',
    description:
      'Monitor curvo QHD de 27" con 165 Hz, inmersión visual mejorada para gaming y productividad.',
    category: 'Monitores',
    subcategory: 'Monitores Gaming (144Hz+)',
    brand: 'Samsung',
    model: 'LC27G55T',
    sku: 'LC27G55TQN',
    price: 1299,
    cost: 1090,
    stock: 7,
    minStock: 4,
    availability: 'available',
    status: 'active',
    featured: false,
    specs: ['27" QHD · 165 Hz', 'Curvo · 1 ms', 'FreeSync Premium', 'HDR10'],
    image:
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-13T12:35:00.000Z',
    updatedAt: '2026-10-17T10:45:00.000Z',
  },
  {
    id: 'asus-rtx-4060-8gb',
    slug: 'asus-rtx-4060-8gb',
    name: 'Tarjeta gráfica ASUS RTX 4060 8GB',
    description:
      'GPU NVIDIA RTX 4060 con 8 GB de VRAM, DLSS 3 y Ray Tracing para gaming y renderizado profesional.',
    category: 'Componentes',
    subcategory: 'Tarjetas Gráficas (GPU)',
    subSubcategory: 'NVIDIA RTX',
    brand: 'ASUS',
    model: 'DUAL-RTX4060-O8G',
    sku: 'ASUS-RTX4060-8G',
    price: 1699,
    cost: 1450,
    stock: 9,
    minStock: 4,
    availability: 'available',
    status: 'active',
    featured: true,
    specs: ['8 GB GDDR6', 'DLSS 3 · Ray Tracing', 'PCIe 4.0', '3 ventiladores'],
    image:
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-19T14:15:00.000Z',
    updatedAt: '2026-10-28T11:30:00.000Z',
  },
  {
    id: 'amd-ryzen-7-5700x',
    slug: 'amd-ryzen-7-5700x',
    name: 'Procesador AMD Ryzen 7 5700X',
    description:
      'Procesador de 8 núcleos y 16 hilos para gaming y cargas multitarea, con socket AM4 y 65W TDP.',
    category: 'Componentes',
    subcategory: 'Procesadores (CPU)',
    subSubcategory: 'AMD Ryzen',
    brand: 'AMD',
    model: '5700X',
    sku: 'AMD-5700X',
    price: 899,
    cost: 760,
    stock: 0,
    minStock: 3,
    availability: 'consult',
    status: 'draft',
    featured: false,
    specs: ['8 núcleos · 16 hilos', 'Hasta 4.6 GHz', 'Socket AM4', '65W TDP'],
    image:
      'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-07T11:55:00.000Z',
    updatedAt: '2026-10-16T15:35:00.000Z',
  },
  {
    id: 'kingston-nv2-1tb',
    slug: 'kingston-nv2-1tb',
    name: 'SSD Kingston NV2 1TB NVMe',
    description:
      'SSD NVMe de alto rendimiento con 1 TB y velocidades de lectura de hasta 3,500 MB/s.',
    category: 'Almacenamiento',
    subcategory: 'Discos Sólidos (SSD)',
    subSubcategory: 'M.2 NVMe PCIe',
    brand: 'Kingston',
    model: 'NV2 1TB',
    sku: 'KING-NV2-1TB',
    price: 289,
    cost: 220,
    stock: 40,
    minStock: 10,
    availability: 'available',
    status: 'active',
    featured: false,
    specs: ['1 TB NVMe PCIe 4.0', 'Hasta 3,500 MB/s', 'Formato M.2', '3 años de garantía'],
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/128GB_2230_NVME_SSD.jpg/960px-128GB_2230_NVME_SSD.jpg',
    images: [],
    createdAt: '2026-09-03T16:20:00.000Z',
    updatedAt: '2026-10-15T09:10:00.000Z',
  },
  {
    id: 'wd-blue-2tb',
    slug: 'wd-blue-2tb',
    name: 'Disco duro WD Blue 2TB',
    description:
      'Disco duro de 2 TB y 7200 RPM para almacenamiento masivo, respaldo y equipos de escritorio.',
    category: 'Almacenamiento',
    subcategory: 'Discos Duros (HDD)',
    subSubcategory: 'HDD Interno 3.5"',
    brand: 'WD',
    model: 'WD20EZAZ',
    sku: 'WD-BLUE-2TB',
    price: 349,
    cost: 270,
    stock: 18,
    minStock: 8,
    availability: 'available',
    status: 'active',
    featured: false,
    specs: ['2 TB · 7200 RPM', 'SATA 6 Gb/s', 'Caché 256 MB', '2 años de garantía'],
    image:
      'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-04T10:05:00.000Z',
    updatedAt: '2026-10-14T12:50:00.000Z',
  },
  {
    id: 'tp-link-archer-ax23',
    slug: 'tp-link-archer-ax23',
    name: 'Router TP-Link Archer AX23 Wi-Fi 6',
    description:
      'Router Wi-Fi 6 de hasta 1800 Mbps con EasyMesh, gigabit LAN y servidor VPN integrado.',
    category: 'Redes',
    subcategory: 'Routers y Sistemas Mesh',
    brand: 'TP-Link',
    model: 'Archer AX23',
    sku: 'TPL-AX23',
    price: 299,
    cost: 230,
    stock: 25,
    minStock: 8,
    availability: 'available',
    status: 'active',
    featured: false,
    specs: ['Wi-Fi 6 · 1800 Mbps', '4 antenas · EasyMesh', 'Gigabit LAN', 'VPN Server'],
    image:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-06T13:15:00.000Z',
    updatedAt: '2026-10-13T08:40:00.000Z',
  },
  {
    id: 'logitech-mx-master-3s',
    slug: 'logitech-mx-master-3s',
    name: 'Mouse Logitech MX Master 3S',
    description:
      'Mouse inalámbrico premium con 8K DPI, clic silencioso y rueda de desplazamiento electromagnética.',
    category: 'Periféricos',
    subcategory: 'Mouse Ergonómico y Gamer',
    brand: 'Logitech',
    model: 'MX Master 3S',
    sku: 'LOG-MXM3S',
    price: 429,
    cost: 340,
    stock: 10,
    minStock: 4,
    availability: 'available',
    status: 'active',
    featured: true,
    specs: ['8,000 DPI', 'Clic silencioso', 'Scroll electromagnético', 'Carga USB-C'],
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-21T15:45:00.000Z',
    updatedAt: '2026-10-27T16:10:00.000Z',
  },
  {
    id: 'hyperx-cloud-ii',
    slug: 'hyperx-cloud-ii',
    name: 'Headset HyperX Cloud II',
    description:
      'Headset gaming con audio 7.1 virtual, micrófono con cancelación de ruido y confort premium.',
    category: 'Audio y Video',
    brand: 'HyperX',
    model: 'Cloud II',
    sku: 'HX-HSCC2',
    price: 349,
    cost: 270,
    stock: 5,
    minStock: 6,
    availability: 'available',
    status: 'active',
    featured: false,
    specs: ['Audio 7.1 virtual', 'Micrófono con cancelación', 'Drivers de 53 mm', '2 años de garantía'],
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-09T09:25:00.000Z',
    updatedAt: '2026-10-12T14:05:00.000Z',
  },
  {
    id: 'microsoft-365-business',
    slug: 'microsoft-365-business',
    name: 'Licencia Microsoft 365 Business',
    description:
      'Licencia anual de Microsoft 365 Business para un usuario, con aplicaciones de Office y 1 TB en OneDrive.',
    category: 'Software',
    brand: 'Microsoft',
    model: 'Business Basic',
    sku: 'MSFT-365-BUS',
    price: 1199,
    cost: 990,
    stock: 50,
    minStock: 10,
    availability: 'available',
    status: 'active',
    featured: false,
    specs: ['1 año · 1 usuario', 'Office + 1 TB en la nube', 'Exchange + Teams', 'Soporte 24/7'],
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-01T08:10:00.000Z',
    updatedAt: '2026-10-11T10:30:00.000Z',
  },
  {
    id: 'forza-ups-1000va',
    slug: 'forza-ups-1000va',
    name: 'UPS Forza 1000VA · 600W',
    description:
      'UPS de 1000 VA y 600 W con AVR automático, protección contra picos y respaldo para equipos críticos.',
    category: 'Cables y Energía',
    subcategory: 'Sistemas UPS y Baterías',
    brand: 'Forza',
    model: 'FZ-1000VA',
    sku: 'FORZA-1000VA',
    price: 459,
    cost: 380,
    stock: 1,
    minStock: 3,
    availability: 'limited',
    status: 'active',
    featured: false,
    specs: ['1000 VA · 600 W', 'Protección contra picos', 'AVR automático', '6 tomadas'],
    image:
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-15T17:30:00.000Z',
    updatedAt: '2026-10-11T09:55:00.000Z',
  },
  {
    id: 'playstation-5-slim',
    slug: 'playstation-5-slim',
    name: 'Consola PlayStation 5 Slim 1TB',
    description:
      'Consola PlayStation 5 en versión slim con 1 TB de almacenamiento e inclusión del control DualSense.',
    category: 'Gaming',
    subcategory: 'Consolas y Videojuegos',
    brand: 'Sony',
    model: 'PS5 Slim',
    sku: 'SONY-PS5-SLIM',
    price: 2999,
    cost: 2650,
    stock: 3,
    minStock: 3,
    availability: 'limited',
    status: 'active',
    featured: true,
    specs: ['1 TB SSD', 'Incluye control DualSense', '4K / 120 fps', 'Ray Tracing'],
    image:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-22T12:00:00.000Z',
    updatedAt: '2026-10-26T18:20:00.000Z',
  },
  {
    id: 'xiaomi-redmi-watch-4',
    slug: 'xiaomi-redmi-watch-4',
    name: 'Smartwatch Xiaomi Redmi Watch 4',
    description:
      'Smartwatch con pantalla AMOLED de 1.97", hasta 20 días de batería y seguimiento avanzado de salud.',
    category: 'Accesorios',
    brand: 'Xiaomi',
    model: 'Redmi Watch 4',
    sku: 'XIA-WATCH4',
    price: 399,
    cost: 310,
    stock: 0,
    minStock: 5,
    availability: 'consult',
    status: 'draft',
    featured: false,
    specs: ['AMOLED 1.97"', 'Hasta 20 días de batería', 'Resistencia 5 ATM', 'GPS integrado'],
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-09-23T14:50:00.000Z',
    updatedAt: '2026-10-10T11:45:00.000Z',
  },
  {
    id: 'epson-l120-descontinuada',
    slug: 'epson-l120-descontinuada',
    name: 'Impresora Epson L120',
    description:
      'Impresora de inyección de tinta descontinuada por el fabricante. Se conserva como referencia histórica del catálogo.',
    category: 'Impresoras y Escáneres',
    brand: 'Epson',
    model: 'L120',
    sku: 'EPS-L120',
    price: 0,
    stock: 0,
    minStock: 0,
    availability: 'consult',
    status: 'archived',
    featured: false,
    specs: ['Modelo descontinuado', 'Sin stock disponible'],
    image:
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80&auto=format&fit=crop',
    images: [],
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-10-05T09:30:00.000Z',
  },
]

const clients: Client[] = [
  {
    id: 'banco-andino',
    name: 'María Fernanda Ríos',
    company: 'Banco Andino del Perú',
    documentType: 'ruc',
    documentNumber: '20512345678',
    email: 'mrios@bancoandino.pe',
    phone: '+51 987 654 321',
    city: 'Lima',
    address: 'Av. República de Panamá 3500, San Isidro',
    segment: 'empresa',
    status: 'active',
    notes: 'Cuenta corporativa. Compras centralizadas por la gerencia de TI.',
    createdAt: '2026-06-12T10:20:00.000Z',
    updatedAt: '2026-10-28T15:40:00.000Z',
  },
  {
    id: 'colegio-san-agustin',
    name: 'Jorge Salazar',
    company: 'Colegio San Agustín',
    documentType: 'ruc',
    documentNumber: '20487654321',
    email: 'jsalazar@sanagustin.edu.pe',
    phone: '+51 956 112 233',
    city: 'Lima',
    address: 'Calle Los Álamos 245, Santiago de Surco',
    segment: 'empresa',
    status: 'active',
    notes: 'Renovación de equipos al inicio del año escolar.',
    createdAt: '2026-07-03T09:10:00.000Z',
    updatedAt: '2026-10-26T11:15:00.000Z',
  },
  {
    id: 'constructora-vertice',
    name: 'Lucía Paredes',
    company: 'Constructora Vértice',
    documentType: 'ruc',
    documentNumber: '20603344556',
    email: 'lparedes@vertice.pe',
    phone: '+51 944 556 677',
    city: 'Arequipa',
    address: 'Av. Ejército 1020, Cayma',
    segment: 'empresa',
    status: 'active',
    notes: 'Proyecto de implementación de oficina técnica en Arequipa.',
    createdAt: '2026-08-19T14:35:00.000Z',
    updatedAt: '2026-10-22T16:05:00.000Z',
  },
  {
    id: 'estudio-norte',
    name: 'Diego Ramírez',
    company: 'Estudio Diseño Norte',
    documentType: 'dni',
    documentNumber: '45678901',
    email: 'diego@disenonorte.pe',
    phone: '+51 949 332 118',
    city: 'Trujillo',
    address: 'Jr. Pizarro 540, Centro Histórico',
    segment: 'persona',
    status: 'active',
    notes: 'Estudio de arquitectura y renderizado. Prefiere contacto por correo.',
    createdAt: '2026-09-09T11:45:00.000Z',
    updatedAt: '2026-10-29T08:30:00.000Z',
  },
  {
    id: 'clinica-santa-elena',
    name: 'Ana Torres',
    company: 'Clínica Santa Elena',
    documentType: 'ruc',
    documentNumber: '20556677889',
    email: 'atorres@clinicasantaelena.pe',
    phone: '+51 981 220 340',
    city: 'Lima',
    address: 'Av. Arequipa 2150, Lince',
    segment: 'empresa',
    status: 'active',
    notes: 'Área de sistemas solicita soporte y equipos para admisión.',
    createdAt: '2026-05-27T08:50:00.000Z',
    updatedAt: '2026-10-18T12:20:00.000Z',
  },
  {
    id: 'textiles-del-sur',
    name: 'Rosa Quispe',
    company: 'Textiles del Sur',
    documentType: 'ruc',
    documentNumber: '20445566778',
    email: 'rquispe@textilesdelsur.pe',
    phone: '+51 973 441 209',
    city: 'Cusco',
    address: 'Av. La Cultura 1205, Wanchaq',
    segment: 'empresa',
    status: 'inactive',
    notes: 'Sin compras desde 2025. Se reactivará la cuenta cuando cierren su planta nueva.',
    createdAt: '2025-11-11T10:00:00.000Z',
    updatedAt: '2026-08-30T09:25:00.000Z',
  },
]

const quotes: Quote[] = [
  {
    id: 'cot-banco-andino',
    code: 'COT-20261028-4KD9',
    clientId: 'banco-andino',
    clientName: 'María Fernanda Ríos',
    clientCompany: 'Banco Andino del Perú',
    clientEmail: 'mrios@bancoandino.pe',
    clientPhone: '+51 987 654 321',
    status: 'sent',
    items: [
      {
        id: 'linea-banco-1',
        productId: 'lenovo-ideapad-slim-3',
        name: 'Laptop Lenovo IdeaPad Slim 3 15.6"',
        sku: '82R80005PE',
        quantity: 8,
        unitPrice: 2499,
      },
      {
        id: 'linea-banco-2',
        productId: 'monitor-lg-ultragear-24',
        name: 'Monitor LG UltraGear 24" 180Hz',
        sku: '24GN650-B',
        quantity: 2,
        unitPrice: 899,
      },
    ],
    notes: 'Incluye entrega en la sede central de San Isidro y configuración inicial.',
    validUntil: '2026-11-12',
    createdAt: '2026-10-28T10:40:00.000Z',
    updatedAt: '2026-10-28T15:40:00.000Z',
  },
  {
    id: 'cot-colegio-san-agustin',
    code: 'COT-20261026-7QW2',
    clientId: 'colegio-san-agustin',
    clientName: 'Jorge Salazar',
    clientCompany: 'Colegio San Agustín',
    clientEmail: 'jsalazar@sanagustin.edu.pe',
    clientPhone: '+51 956 112 233',
    status: 'approved',
    items: [
      {
        id: 'linea-colegio-1',
        productId: 'hp-smart-tank-580',
        name: 'Impresora HP Smart Tank 580',
        sku: 'HP-ST580',
        quantity: 12,
        unitPrice: 899,
      },
      {
        id: 'linea-colegio-2',
        productId: 'forza-ups-1000va',
        name: 'UPS Forza 1000VA · 600W',
        sku: 'FORZA-1000VA',
        quantity: 4,
        unitPrice: 459,
      },
    ],
    notes: 'Solicitan instalación en tres pabellones durante la primera semana de noviembre.',
    validUntil: '2026-11-09',
    createdAt: '2026-10-26T09:20:00.000Z',
    updatedAt: '2026-10-27T17:10:00.000Z',
  },
  {
    id: 'cot-constructora-vertice',
    code: 'COT-20261022-1ZP5',
    clientId: 'constructora-vertice',
    clientName: 'Lucía Paredes',
    clientCompany: 'Constructora Vértice',
    clientEmail: 'lparedes@vertice.pe',
    clientPhone: '+51 944 556 677',
    status: 'draft',
    items: [
      {
        id: 'linea-vertice-1',
        productId: 'dell-latitude-5440',
        name: 'Laptop empresarial Dell Latitude 5440',
        sku: 'LAT-5440-I5',
        quantity: 5,
        unitPrice: 4599,
      },
    ],
    notes: 'Falta confirmar si la oficina técnica requiere docking stations.',
    validUntil: '2026-11-05',
    createdAt: '2026-10-22T14:15:00.000Z',
    updatedAt: '2026-10-22T16:05:00.000Z',
  },
  {
    id: 'cot-clinica-santa-elena',
    code: 'COT-20261018-9MN3',
    clientId: 'clinica-santa-elena',
    clientName: 'Ana Torres',
    clientCompany: 'Clínica Santa Elena',
    clientEmail: 'atorres@clinicasantaelena.pe',
    clientPhone: '+51 981 220 340',
    status: 'rejected',
    items: [
      {
        id: 'linea-clinica-1',
        productId: 'servidor-dell-poweredge-t150',
        name: 'Servidor Dell PowerEdge T150',
        sku: 'PE-T150-XEON',
        quantity: 3,
        unitPrice: 6899,
      },
    ],
    notes: 'Orden atendida. El cliente pidió una segunda propuesta para el próximo trimestre.',
    validUntil: '2026-11-01',
    createdAt: '2026-10-18T11:05:00.000Z',
    updatedAt: '2026-10-24T09:30:00.000Z',
  },
  {
    id: 'cot-estudio-norte',
    code: 'COT-20261029-6TR8',
    clientId: 'estudio-norte',
    clientName: 'Diego Ramírez',
    clientCompany: 'Estudio Diseño Norte',
    clientEmail: 'diego@disenonorte.pe',
    clientPhone: '+51 949 332 118',
    status: 'sent',
    items: [
      {
        id: 'linea-estudio-1',
        productId: 'asus-rtx-4060-8gb',
        name: 'Tarjeta gráfica ASUS RTX 4060 8GB',
        sku: 'ASUS-RTX4060-8G',
        quantity: 2,
        unitPrice: 1699,
      },
      {
        id: 'linea-estudio-2',
        productId: 'amd-ryzen-7-5700x',
        name: 'Procesador AMD Ryzen 7 5700X',
        sku: 'AMD-5700X',
        quantity: 1,
        unitPrice: 899,
      },
    ],
    notes: 'Equipos para renderizado. Coordinar recojo en tienda.',
    validUntil: '2026-11-13',
    createdAt: '2026-10-29T08:30:00.000Z',
    updatedAt: '2026-10-29T09:10:00.000Z',
  },
]

const webProjects: WebProject[] = [
  {
    id: 'portal-proveedores-banco-andino',
    name: 'Portal de proveedores',
    clientId: 'banco-andino',
    clientName: 'Banco Andino del Perú',
    type: 'webapp',
    status: 'live',
    productionUrl: 'https://proveedores.bancoandino.pe',
    stagingUrl: 'https://staging-proveedores.bancoandino.pe',
    repoUrl: 'https://github.com/fjsystems/portal-andino',
    hosting: 'Vercel + PostgreSQL administrado',
    domain: 'proveedores.bancoandino.pe',
    responsible: 'Fabritcio Peña',
    credentialLocation: 'Bitwarden · Clientes/Banco Andino',
    launchedAt: '2026-09-15',
    renewalAt: '2027-03-15',
    notes: 'Registro y seguimiento de órdenes de compra. Incluye soporte y mantenimiento mensual.',
    deployments: [
      {
        id: 'despliegue-andino-3',
        environment: 'staging',
        url: 'https://staging-proveedores.bancoandino.pe',
        version: 'v1.5.0-rc',
        note: 'Validación del nuevo módulo de reportes.',
        deployedAt: '2026-10-30T18:10:00.000Z',
      },
      {
        id: 'despliegue-andino-2',
        environment: 'production',
        url: 'https://proveedores.bancoandino.pe',
        version: 'v1.4.0',
        note: 'Ajustes de facturación y exportación.',
        deployedAt: '2026-10-24T16:30:00.000Z',
      },
      {
        id: 'despliegue-andino-1',
        environment: 'production',
        url: 'https://proveedores.bancoandino.pe',
        version: 'v1.0.0',
        note: 'Salida a producción.',
        deployedAt: '2026-09-15T15:00:00.000Z',
      },
    ],
    createdAt: '2026-07-10T14:00:00.000Z',
    updatedAt: '2026-10-30T18:10:00.000Z',
  },
  {
    id: 'web-colegio-san-agustin',
    name: 'Sitio web institucional',
    clientId: 'colegio-san-agustin',
    clientName: 'Colegio San Agustín',
    type: 'website',
    status: 'live',
    productionUrl: 'https://www.sanagustin.edu.pe',
    stagingUrl: 'https://staging.sanagustin.edu.pe',
    repoUrl: 'https://github.com/fjsystems/web-san-agustin',
    hosting: 'Vercel + Cloudflare',
    domain: 'sanagustin.edu.pe',
    responsible: 'Fabritcio Peña',
    credentialLocation: 'Bitwarden · Clientes/Colegio San Agustín',
    launchedAt: '2026-08-20',
    renewalAt: '2027-01-20',
    notes: 'Sitio institucional con admisiones, calendario escolar y portal de noticias.',
    deployments: [
      {
        id: 'despliegue-san-agustin-2',
        environment: 'staging',
        url: 'https://staging.sanagustin.edu.pe',
        version: 'v2.2.0-rc',
        note: 'Revisión de la sección de admisiones 2027.',
        deployedAt: '2026-10-27T17:20:00.000Z',
      },
      {
        id: 'despliegue-san-agustin-1',
        environment: 'production',
        url: 'https://www.sanagustin.edu.pe',
        version: 'v2.1.0',
        note: 'Actualización de contenido y formulario de contacto.',
        deployedAt: '2026-10-18T15:45:00.000Z',
      },
    ],
    createdAt: '2026-06-25T10:30:00.000Z',
    updatedAt: '2026-10-27T17:20:00.000Z',
  },
  {
    id: 'intranet-constructora-vertice',
    name: 'Intranet de obra',
    clientId: 'constructora-vertice',
    clientName: 'Constructora Vértice',
    type: 'webapp',
    status: 'development',
    productionUrl: '',
    stagingUrl: 'https://staging-intranet.vertice.pe',
    repoUrl: 'https://github.com/fjsystems/intranet-vertice',
    hosting: 'Railway + PostgreSQL',
    domain: 'intranet.vertice.pe',
    responsible: 'Fabritcio Peña',
    credentialLocation: '1Password · Clientes/Constructora Vértice',
    renewalAt: '2027-02-01',
    notes: 'Avance de obra, incidencias y documentación técnica por proyecto.',
    deployments: [
      {
        id: 'despliegue-vertice-1',
        environment: 'staging',
        url: 'https://staging-intranet.vertice.pe',
        version: 'v0.6.0',
        note: 'Primera entrega funcional para revisión del cliente.',
        deployedAt: '2026-10-26T20:00:00.000Z',
      },
    ],
    createdAt: '2026-09-02T13:15:00.000Z',
    updatedAt: '2026-10-26T20:00:00.000Z',
  },
]

const suppliers: Supplier[] = [
  {
    id: 'prov-insumos-andina',
    name: 'Insumos y Distribución Andina S.A.C.',
    ruc: '20654120019',
    contactName: 'Miguel Ángel Sifuentes',
    email: 'msifuentes@insumosandina.pe',
    phone: '+51 1 640 2210',
    city: 'Lima',
    address: 'Av. Petit Thouars 3120, Lince',
    categoryIds: ['impresoras-escaneres', 'componentes', 'cables-energia'],
    leadTimeDays: 5,
    minimumOrder: 2000,
    rating: 4.5,
    status: 'active',
    notes: 'Tóner, tambores y consumibles con stock permanente. Acepta devoluciones por garantía.',
    createdAt: '2025-10-06T09:00:00.000Z',
    updatedAt: '2026-10-21T14:20:00.000Z',
  },
  {
    id: 'prov-computrade',
    name: 'CompuTrade Perú S.A.C.',
    ruc: '20601874521',
    contactName: 'Patricia Delgado Belmonte',
    email: 'pdelgado@computrade.pe',
    phone: '+51 1 512 8890',
    city: 'Lima',
    address: 'Jr. de la Unión 630, Cercado de Lima',
    categoryIds: ['laptops', 'pc-servidores', 'monitores'],
    leadTimeDays: 8,
    minimumOrder: 5000,
    rating: 4.2,
    status: 'active',
    notes: 'Distribuidor autorizado de Lenovo y Dell para la línea empresarial.',
    createdAt: '2025-08-19T10:30:00.000Z',
    updatedAt: '2026-11-02T09:15:00.000Z',
  },
  {
    id: 'prov-tecno-norte',
    name: 'Tecno Norte Distribuidor',
    ruc: '20598874123',
    contactName: 'Álvaro Castro Peña',
    email: 'acastro@tecnonorte.pe',
    phone: '+51 44 602 118',
    city: 'Trujillo',
    address: 'Jr. Independencia 545, Centro Histórico',
    categoryIds: ['redes', 'accesorios', 'perifericos'],
    leadTimeDays: 4,
    minimumOrder: 1200,
    rating: 3.8,
    status: 'active',
    notes: 'Mejor precio en networking TP-Link y Ubiquiti; entregas los martes y viernes.',
    createdAt: '2026-01-13T08:45:00.000Z',
    updatedAt: '2026-09-30T16:10:00.000Z',
  },
  {
    id: 'prov-global-storage',
    name: 'Global Storage Imports',
    ruc: '20633214987',
    contactName: 'Karina Huanca Ortiz',
    email: 'khuanca@globalstorage.lat',
    phone: '+51 1 397 4402',
    city: 'Callao',
    address: 'Av. José Gálvez 1850, Callao',
    categoryIds: ['almacenamiento', 'componentes'],
    leadTimeDays: 15,
    minimumOrder: 8000,
    rating: 4.0,
    status: 'active',
    notes: 'Importa SSD y HDD por contenedor. Anticipar los pedidos tres semanas.',
    createdAt: '2025-12-02T11:20:00.000Z',
    updatedAt: '2026-10-08T10:05:00.000Z',
  },
  {
    id: 'prov-software-latam',
    name: 'Software Licensing Latam',
    ruc: '20677451203',
    contactName: 'Renée Bertot',
    email: 'rbertot@softwarelatam.co',
    phone: '+51 1 705 8844',
    city: 'Lima',
    address: 'Av. Javier Prado Este 465, Santiago de Surco',
    categoryIds: ['software'],
    leadTimeDays: 2,
    minimumOrder: 900,
    rating: 4.7,
    status: 'active',
    notes: 'Licencias Microsoft y Adobe por suscripción. Entrega inmediata por correo.',
    createdAt: '2026-03-05T15:00:00.000Z',
    updatedAt: '2026-10-29T13:35:00.000Z',
  },
  {
    id: 'prov-smart-gaming',
    name: 'Smart Gaming Distribution',
    ruc: '20550129876',
    contactName: 'Gianfranco Poggi',
    email: 'gpoggi@smartgaming.pe',
    phone: '+51 1 447 6621',
    city: 'Lima',
    address: 'Av. La Marina 2450, San Miguel',
    categoryIds: ['gaming', 'audio-video'],
    leadTimeDays: 6,
    minimumOrder: 1500,
    rating: 3.2,
    status: 'inactive',
    notes: 'Contratación suspendida por demoras en la garantía de consolas.',
    createdAt: '2025-07-28T09:10:00.000Z',
    updatedAt: '2026-08-11T17:45:00.000Z',
  },
]

const orders: Order[] = [
  {
    id: 'pedido-colegio-entregado',
    code: 'PED-20261027-01',
    clientId: 'colegio-san-agustin',
    clientName: 'Jorge Salazar',
    clientEmail: 'jsalazar@sanagustin.edu.pe',
    clientPhone: '+51 956 112 233',
    quoteCode: 'COT-20261026-7QW2',
    status: 'delivered',
    paymentStatus: 'paid',
    currency: 'PEN',
    items: [
      {
        id: 'ped-01-linea-1',
        productId: 'hp-smart-tank-580',
        name: 'Impresora HP Smart Tank 580',
        sku: 'HP-ST580',
        quantity: 12,
        unitPrice: 899,
        deliveredQuantity: 12,
      },
      {
        id: 'ped-01-linea-2',
        productId: 'forza-ups-1000va',
        name: 'UPS Forza 1000VA · 600W',
        sku: 'FORZA-1000VA',
        quantity: 4,
        unitPrice: 459,
        deliveredQuantity: 4,
      },
    ],
    deliveryMethod: 'own',
    deliveryAddress: 'Calle Los Álamos 245, Santiago de Surco',
    recipientName: 'Jorge Salazar',
    carrier: '',
    trackingNumber: '',
    expectedDeliveryAt: '2026-10-31',
    deliveredAt: '2026-10-31T16:20:00.000Z',
    deliveryEvents: [
      {
        id: 'ped-01-ev-1',
        status: 'confirmed',
        note: 'Confirmación de la orden de compra.',
        at: '2026-10-27T09:15:00.000Z',
      },
      {
        id: 'ped-01-ev-2',
        status: 'processing',
        note: 'Separación de equipos en el almacén central.',
        at: '2026-10-28T11:30:00.000Z',
      },
      {
        id: 'ped-01-ev-3',
        status: 'shipped',
        note: 'Despacho con unidad propia hacia Surco.',
        at: '2026-10-30T08:05:00.000Z',
      },
      {
        id: 'ped-01-ev-4',
        status: 'delivered',
        note: 'Entregado e instalado en los tres pabellones.',
        at: '2026-10-31T16:20:00.000Z',
      },
    ],
    notes: 'Instalación incluida en la primera semana de noviembre.',
    createdAt: '2026-10-27T09:10:00.000Z',
    updatedAt: '2026-10-31T16:20:00.000Z',
  },
  {
    id: 'pedido-banco-proceso',
    code: 'PED-20261102-02',
    clientId: 'banco-andino',
    clientName: 'María Fernanda Ríos',
    clientEmail: 'mrios@bancoandino.pe',
    clientPhone: '+51 987 654 321',
    quoteCode: 'COT-20261028-4KD9',
    status: 'processing',
    paymentStatus: 'partial',
    currency: 'PEN',
    items: [
      {
        id: 'ped-02-linea-1',
        productId: 'lenovo-ideapad-slim-3',
        name: 'Laptop Lenovo IdeaPad Slim 3 15.6"',
        sku: '82R80005PE',
        quantity: 8,
        unitPrice: 2499,
        deliveredQuantity: 0,
      },
      {
        id: 'ped-02-linea-2',
        productId: 'monitor-lg-ultragear-24',
        name: 'Monitor LG UltraGear 24" 180Hz',
        sku: '24GN650-B',
        quantity: 2,
        unitPrice: 899,
        deliveredQuantity: 2,
      },
    ],
    deliveryMethod: 'own',
    deliveryAddress: 'Av. República de Panamá 3500, San Isidro',
    recipientName: 'María Fernanda Ríos',
    carrier: '',
    trackingNumber: '',
    expectedDeliveryAt: '2026-11-08',
    deliveryEvents: [
      {
        id: 'ped-02-ev-1',
        status: 'confirmed',
        note: 'Adelanto del 50% recibido.',
        at: '2026-11-02T10:20:00.000Z',
      },
      {
        id: 'ped-02-ev-2',
        status: 'processing',
        note: 'Monitores entregados como muestra; laptops en separación.',
        at: '2026-11-04T09:45:00.000Z',
      },
    ],
    notes: 'Entrega parcial autorizada por la gerencia de TI.',
    createdAt: '2026-11-02T10:15:00.000Z',
    updatedAt: '2026-11-04T09:45:00.000Z',
  },
  {
    id: 'pedido-vertice-enviado',
    code: 'PED-20261103-03',
    clientId: 'constructora-vertice',
    clientName: 'Lucía Paredes',
    clientEmail: 'lparedes@vertice.pe',
    clientPhone: '+51 944 556 677',
    status: 'shipped',
    paymentStatus: 'pending',
    currency: 'PEN',
    items: [
      {
        id: 'ped-03-linea-1',
        productId: 'dell-latitude-5440',
        name: 'Laptop empresarial Dell Latitude 5440',
        sku: 'LAT-5440-I5',
        quantity: 5,
        unitPrice: 4599,
        deliveredQuantity: 0,
      },
    ],
    deliveryMethod: 'courier',
    deliveryAddress: 'Av. Ejército 1020, Cayma, Arequipa',
    recipientName: 'Lucía Paredes',
    carrier: 'Shalom.pe',
    trackingNumber: 'SHA-4419283',
    expectedDeliveryAt: '2026-11-06',
    deliveryEvents: [
      {
        id: 'ped-03-ev-1',
        status: 'confirmed',
        note: 'Orden confirmada por correo.',
        at: '2026-11-03T12:05:00.000Z',
      },
      {
        id: 'ped-03-ev-2',
        status: 'processing',
        note: 'Configuración de la imagen de escritorio corporativa.',
        at: '2026-11-03T17:30:00.000Z',
      },
      {
        id: 'ped-03-ev-3',
        status: 'shipped',
        note: 'En ruta a Arequipa.',
        at: '2026-11-04T07:50:00.000Z',
      },
    ],
    notes: 'Coordinar recepción en la oficina técnica de Cayma.',
    createdAt: '2026-11-03T12:00:00.000Z',
    updatedAt: '2026-11-04T07:50:00.000Z',
  },
  {
    id: 'pedido-estudio-recojo',
    code: 'PED-20261104-04',
    clientId: 'estudio-norte',
    clientName: 'Diego Ramírez',
    clientEmail: 'diego@disenonorte.pe',
    clientPhone: '+51 949 332 118',
    status: 'confirmed',
    paymentStatus: 'paid',
    currency: 'PEN',
    items: [
      {
        id: 'ped-04-linea-1',
        productId: 'asus-rtx-4060-8gb',
        name: 'Tarjeta gráfica ASUS RTX 4060 8GB',
        sku: 'ASUS-RTX4060-8G',
        quantity: 2,
        unitPrice: 1699,
        deliveredQuantity: 0,
      },
      {
        id: 'ped-04-linea-2',
        productId: 'amd-ryzen-7-5700x',
        name: 'Procesador AMD Ryzen 7 5700X',
        sku: 'AMD-5700X',
        quantity: 1,
        unitPrice: 899,
        deliveredQuantity: 0,
      },
    ],
    deliveryMethod: 'pickup',
    deliveryAddress: 'Retiro en tienda · Jr. de la Unión, Cercado de Lima',
    recipientName: 'Diego Ramírez',
    carrier: '',
    trackingNumber: '',
    expectedDeliveryAt: '2026-11-07',
    deliveryEvents: [
      {
        id: 'ped-04-ev-1',
        status: 'confirmed',
        note: 'Pago íntegro confirmado; recojo programado.',
        at: '2026-11-04T15:40:00.000Z',
      },
    ],
    notes: 'El cliente recoge con su DNI.',
    createdAt: '2026-11-04T15:35:00.000Z',
    updatedAt: '2026-11-04T15:40:00.000Z',
  },
  {
    id: 'pedido-clinica-nuevo',
    code: 'PED-20261105-05',
    clientId: 'clinica-santa-elena',
    clientName: 'Ana Torres',
    clientEmail: 'atorres@clinicasantaelena.pe',
    clientPhone: '+51 981 220 340',
    status: 'pending',
    paymentStatus: 'pending',
    currency: 'PEN',
    items: [
      {
        id: 'ped-05-linea-1',
        productId: 'kingston-nv2-1tb',
        name: 'SSD Kingston NV2 1TB NVMe',
        sku: 'KING-NV2-1TB',
        quantity: 10,
        unitPrice: 289,
        deliveredQuantity: 0,
      },
      {
        id: 'ped-05-linea-2',
        productId: 'forza-ups-1000va',
        name: 'UPS Forza 1000VA · 600W',
        sku: 'FORZA-1000VA',
        quantity: 2,
        unitPrice: 459,
        deliveredQuantity: 0,
      },
    ],
    deliveryMethod: 'own',
    deliveryAddress: 'Av. Arequipa 2150, Lince',
    recipientName: 'Ana Torres',
    carrier: '',
    trackingNumber: '',
    expectedDeliveryAt: '2026-11-10',
    deliveryEvents: [
      {
        id: 'ped-05-ev-1',
        status: 'pending',
        note: 'Solicitud recibida desde la mesa de ayuda.',
        at: '2026-11-05T08:25:00.000Z',
      },
    ],
    notes: 'Falta confirmar la orden de compra firmada.',
    createdAt: '2026-11-05T08:25:00.000Z',
    updatedAt: '2026-11-05T08:25:00.000Z',
  },
  {
    id: 'pedido-textiles-cancelado',
    code: 'PED-20261020-06',
    clientId: 'textiles-del-sur',
    clientName: 'Rosa Quispe',
    clientEmail: 'rquispe@textilesdelsur.pe',
    clientPhone: '+51 973 441 209',
    status: 'cancelled',
    paymentStatus: 'pending',
    currency: 'PEN',
    items: [
      {
        id: 'ped-06-linea-1',
        productId: 'epson-ecotank-l3250',
        name: 'Impresora Epson EcoTank L3250',
        sku: 'EPS-L3250',
        quantity: 6,
        unitPrice: 849,
        deliveredQuantity: 0,
      },
    ],
    deliveryMethod: 'courier',
    deliveryAddress: 'Av. La Cultura 1205, Wanchaq, Cusco',
    recipientName: 'Rosa Quispe',
    carrier: 'Marvisur',
    trackingNumber: '',
    deliveryEvents: [
      {
        id: 'ped-06-ev-1',
        status: 'confirmed',
        note: 'Orden confirmada a la espera de la planta nueva.',
        at: '2026-10-21T10:00:00.000Z',
      },
      {
        id: 'ped-06-ev-2',
        status: 'cancelled',
        note: 'El cliente pospone la compra para el próximo trimestre.',
        at: '2026-10-26T15:20:00.000Z',
      },
    ],
    notes: 'La guía de envío quedó anulada antes del despacho.',
    createdAt: '2026-10-20T11:30:00.000Z',
    updatedAt: '2026-10-26T15:20:00.000Z',
  },
]

const attributes: ProductAttribute[] = [
  {
    id: 'atributo-conectividad',
    label: 'Conectividad inalámbrica',
    type: 'select',
    unit: '',
    options: ['Wi-Fi', 'Bluetooth', 'Sin conexión'],
    keywords: ['Wi-Fi', 'WiFi', 'Bluetooth'],
    categoryIds: ['impresoras-escaneres', 'redes', 'laptops', 'perifericos', 'accesorios'],
    required: false,
    status: 'active',
    createdAt: '2026-08-10T09:00:00.000Z',
    updatedAt: '2026-10-20T14:10:00.000Z',
  },
  {
    id: 'atributo-tecnologia-impresion',
    label: 'Tecnología de impresión',
    type: 'select',
    unit: '',
    options: ['Inyección de tinta', 'Láser monocromática', 'Láser color', 'Térmica'],
    keywords: ['Inyección', 'Láser', 'Tinta', 'cartuchos'],
    categoryIds: ['impresoras-escaneres'],
    required: true,
    status: 'active',
    createdAt: '2026-08-10T09:05:00.000Z',
    updatedAt: '2026-09-28T10:40:00.000Z',
  },
  {
    id: 'atributo-velocidad-impresion',
    label: 'Velocidad de impresión',
    type: 'number',
    unit: 'ppm',
    options: [],
    keywords: ['ppm', 'páginas por minuto', 'páginas'],
    categoryIds: ['impresoras-escaneres'],
    required: true,
    status: 'active',
    createdAt: '2026-08-10T09:10:00.000Z',
    updatedAt: '2026-10-12T08:25:00.000Z',
  },
  {
    id: 'atributo-bandeja',
    label: 'Capacidad de bandeja',
    type: 'number',
    unit: 'hojas',
    options: [],
    keywords: ['Bandeja', 'hojas'],
    categoryIds: ['impresoras-escaneres'],
    required: false,
    status: 'active',
    createdAt: '2026-08-10T09:15:00.000Z',
    updatedAt: '2026-08-10T09:15:00.000Z',
  },
  {
    id: 'atributo-panel',
    label: 'Tipo de panel',
    type: 'select',
    unit: '',
    options: ['IPS', 'VA', 'TN', 'OLED'],
    keywords: ['IPS', 'VA', 'TN', 'OLED', 'Panel'],
    categoryIds: ['monitores'],
    required: true,
    status: 'active',
    createdAt: '2026-08-14T11:00:00.000Z',
    updatedAt: '2026-10-18T17:00:00.000Z',
  },
  {
    id: 'atributo-refresco',
    label: 'Tasa de refresco',
    type: 'number',
    unit: 'Hz',
    options: [],
    keywords: ['Hz'],
    categoryIds: ['monitores', 'gaming'],
    required: false,
    status: 'active',
    createdAt: '2026-08-14T11:05:00.000Z',
    updatedAt: '2026-10-18T17:00:00.000Z',
  },
  {
    id: 'atributo-procesador',
    label: 'Procesador',
    type: 'text',
    unit: '',
    options: [],
    keywords: ['Ryzen', 'Core', 'Xeon', 'Celeron', 'Athlon'],
    categoryIds: ['laptops', 'pc-servidores', 'componentes'],
    required: true,
    status: 'active',
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-11-02T09:20:00.000Z',
  },
  {
    id: 'atributo-memoria',
    label: 'Memoria RAM',
    type: 'number',
    unit: 'GB',
    options: [],
    keywords: ['RAM', 'DDR'],
    categoryIds: ['laptops', 'pc-servidores', 'componentes'],
    required: true,
    status: 'active',
    createdAt: '2026-08-20T10:05:00.000Z',
    updatedAt: '2026-08-20T10:05:00.000Z',
  },
  {
    id: 'atributo-almacenamiento',
    label: 'Almacenamiento',
    type: 'text',
    unit: '',
    options: [],
    keywords: ['SSD', 'NVMe', 'HDD', 'TB'],
    categoryIds: ['laptops', 'pc-servidores', 'componentes', 'almacenamiento'],
    required: true,
    status: 'active',
    createdAt: '2026-08-20T10:10:00.000Z',
    updatedAt: '2026-10-15T09:10:00.000Z',
  },
  {
    id: 'atributo-garantia',
    label: 'Garantía',
    type: 'text',
    unit: 'meses',
    options: [],
    keywords: ['garantía', 'Garantía', 'años de garantía'],
    categoryIds: [],
    required: true,
    status: 'active',
    createdAt: '2026-08-22T09:30:00.000Z',
    updatedAt: '2026-08-22T09:30:00.000Z',
  },
  {
    id: 'atributo-sistema-operativo',
    label: 'Sistema operativo',
    type: 'select',
    unit: '',
    options: ['Windows 11 Pro', 'Windows 11 Home', 'FreeDOS', 'Sin sistema'],
    keywords: ['Windows', 'FreeDOS', 'DOS'],
    categoryIds: ['laptops', 'pc-servidores'],
    required: false,
    status: 'active',
    createdAt: '2026-08-22T09:35:00.000Z',
    updatedAt: '2026-09-11T13:45:00.000Z',
  },
  {
    id: 'atributo-resolucion',
    label: 'Resolución de imagen',
    type: 'text',
    unit: 'dpi',
    options: [],
    keywords: ['dpi', 'Full HD', 'QHD', 'píxeles'],
    categoryIds: ['impresoras-escaneres', 'monitores', 'perifericos'],
    required: false,
    status: 'inactive',
    createdAt: '2026-08-22T09:40:00.000Z',
    updatedAt: '2026-10-05T09:30:00.000Z',
  },
]

const warehouseLocations: WarehouseLocation[] = [
  {
    id: 'alm-principal',
    code: 'ALM-01',
    name: 'Almacén principal · Lince',
    kind: 'warehouse',
    address: 'Av. Argentina 1853, Cercado de Lima',
    responsible: 'Maritza León Galvez',
    isDefault: true,
    notes: 'Recepción de proveedores y picking de pedidos.',
    createdAt: '2025-07-01T08:00:00.000Z',
    updatedAt: '2026-10-12T18:05:00.000Z',
  },
  {
    id: 'est-a1',
    code: 'EST-A1',
    name: 'Estantería A1 · Impresión y consumibles',
    kind: 'shelf',
    parentLocationId: 'alm-principal',
    responsible: 'Maritza León Galvez',
    isDefault: false,
    createdAt: '2025-07-01T08:10:00.000Z',
    updatedAt: '2026-10-12T18:05:00.000Z',
  },
  {
    id: 'est-b2',
    code: 'EST-B2',
    name: 'Estantería B2 · Equipos y servidores',
    kind: 'shelf',
    parentLocationId: 'alm-principal',
    responsible: 'Diego Fuentes Chávez',
    isDefault: false,
    createdAt: '2025-07-01T08:12:00.000Z',
    updatedAt: '2026-10-12T18:05:00.000Z',
  },
  {
    id: 'est-c3',
    code: 'EST-C3',
    name: 'Estantería C3 · Periféricos y red',
    kind: 'shelf',
    parentLocationId: 'alm-principal',
    responsible: 'Rafael Mendoza Rivas',
    isDefault: false,
    createdAt: '2025-07-01T08:14:00.000Z',
    updatedAt: '2026-10-12T18:05:00.000Z',
  },
  {
    id: 'est-d4',
    code: 'EST-D4',
    name: 'Estantería D4 · Software y licencias',
    kind: 'shelf',
    parentLocationId: 'alm-principal',
    responsible: 'Maritza León Galvez',
    isDefault: false,
    notes: 'Solo claves y soportes; las licencias se entregan por correo.',
    createdAt: '2026-01-09T10:00:00.000Z',
    updatedAt: '2026-10-12T18:05:00.000Z',
  },
  {
    id: 'trn-01',
    code: 'TRN-01',
    name: 'Tránsito · por inspeccionar',
    kind: 'transit',
    isDefault: false,
    notes: 'Mercadería en recepción o en reubicación; no es stock vendible.',
    createdAt: '2025-07-01T08:20:00.000Z',
    updatedAt: '2026-10-12T18:05:00.000Z',
  },
]

const shelfByCategory: Record<string, string> = {
  'Impresoras y Escáneres': 'est-a1',
  Laptops: 'est-b2',
  'PC y Servidores': 'est-b2',
  Componentes: 'est-b2',
  Almacenamiento: 'est-b2',
  Monitores: 'est-c3',
  Periféricos: 'est-c3',
  Accesorios: 'est-c3',
  Redes: 'est-c3',
  'Audio y Video': 'est-c3',
  Gaming: 'est-c3',
  'Cables y Energía': 'est-c3',
  Software: 'est-d4',
}

function shelfForCategory(category: string): string {
  return shelfByCategory[category] ?? 'est-b2'
}

function locationCode(id: string): string {
  return warehouseLocations.find((location) => location.id === id)?.code ?? id
}

/** El máximo operativo es 4× el punto de reorden; por encima hay capital inmovilizado. */
function maxStockFor(minStock: number): number {
  return Math.max(minStock * 4, minStock + 6)
}

function supplierForCategory(category: string, variant = 0): Supplier {
  const categoryId = categories.find((item) => item.label === category)?.id
  const matches = suppliers.filter(
    (supplier) => supplier.status === 'active' && categoryId && supplier.categoryIds.includes(categoryId)
  )
  if (matches.length === 0) return suppliers[0]
  return matches[variant % matches.length]
}

const PURCHASE_BUYERS = ['Maritza León Galvez', 'Diego Fuentes Chávez'] as const

function buildSeedPurchaseRequests(items: AdminProduct[]): PurchaseRequest[] {
  const needs = items
    .filter((product) => product.status === 'active' && product.stock <= product.minStock)
    .sort(
      (a, b) =>
        a.stock - a.minStock - (b.stock - b.minStock) ||
        a.name.localeCompare(b.name, 'es')
    )
    .slice(0, 9)

  const grouped = new Map<string, { supplier: Supplier; lines: PurchaseRequestLine[] }>()
  needs.forEach((product) => {
    const supplier = supplierForCategory(product.category)
    const bucket = grouped.get(supplier.id) ?? { supplier, lines: [] }
    bucket.lines.push({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: Math.max(maxStockFor(product.minStock) - product.stock, 2),
      unitCost: product.cost,
      note: `Punto de reorden ${product.minStock} uds.`,
    })
    grouped.set(supplier.id, bucket)
  })

  const statuses: PurchaseRequest['status'][] = ['ordered', 'approved', 'pending', 'rejected']
  const now = new Date('2026-11-03T17:30:00.000Z')

  return [...grouped.values()].map((bucket, index): PurchaseRequest => {
    const status = statuses[Math.min(index, statuses.length - 1)]
    const decided = status !== 'pending' && status !== 'draft'
    return {
      id: `sc-2026-${String(index + 11).padStart(3, '0')}`,
      code: `SC-2026-${String(index + 11).padStart(3, '0')}`,
      status,
      requestedBy: PURCHASE_BUYERS[index % PURCHASE_BUYERS.length],
      neededBy: new Date(now.getTime() + bucket.supplier.leadTimeDays * 86_400_000)
        .toISOString()
        .slice(0, 10),
      supplierId: bucket.supplier.id,
      supplierName: bucket.supplier.name,
      justification:
        status === 'rejected'
          ? 'El proveedor cotizado no cubre estas categorías; reasignar la solicitud.'
          : 'Stock por debajo del punto de reorden detectado en el último conteo.',
      lines: bucket.lines,
      decisionNote: decided
        ? status === 'rejected'
          ? 'Rechazado: falta cotización alternativa.'
          : 'Aprobado con el presupuesto de abastecimiento del trimestre.'
        : undefined,
      decidedBy: decided ? 'Diego Fuentes Chávez' : undefined,
      decidedAt: decided ? '2026-11-04T15:20:00.000Z' : undefined,
      createdAt: '2026-11-02T09:10:00.000Z',
      updatedAt: decided ? '2026-11-04T15:20:00.000Z' : '2026-11-02T09:10:00.000Z',
    }
  })
}

function buildSeedPurchaseOrders(
  items: AdminProduct[],
  requests: PurchaseRequest[]
): PurchaseOrder[] {
  const ordered = requests.find((request) => request.status === 'ordered')
  const healthy = items
    .filter((product) => product.status === 'active' && product.stock >= 10)
    .sort((a, b) => b.price * b.stock - a.price * a.stock)

  const orders: PurchaseOrder[] = []

  if (ordered) {
    orders.push({
      id: 'oc-2026-043',
      code: 'OC-2026-043',
      supplierId: ordered.supplierId ?? suppliers[0].id,
      supplierName: ordered.supplierName ?? suppliers[0].name,
      status: 'sent',
      currency: 'PEN',
      requestId: ordered.id,
      requestCode: ordered.code,
      expectedAt: '2026-11-12T18:00:00.000Z',
      lines: ordered.lines.map((line): PurchaseOrderLine => ({
        productId: line.productId,
        productName: line.productName,
        sku: line.sku,
        quantity: line.quantity,
        receivedQuantity: 0,
        unitCost: line.unitCost ?? 0,
      })),
      notes: 'Confirmada por correo; entrega fragmentada si falta stock en almacén del proveedor.',
      createdBy: ordered.requestedBy,
      createdAt: '2026-11-04T16:05:00.000Z',
      updatedAt: '2026-11-04T16:05:00.000Z',
    })
  }

  const historical: Array<{
    code: string
    status: PurchaseOrderStatus
    variant: number
    slice: number
    receivedAt: string
    part: number
  }> = [
    { code: 'OC-2026-038', status: 'received', variant: 0, slice: 0, receivedAt: '2026-10-19T16:40:00.000Z', part: 1 },
    { code: 'OC-2026-041', status: 'partial', variant: 1, slice: 4, receivedAt: '2026-10-30T15:10:00.000Z', part: 0.6 },
  ]

  historical.forEach((template) => {
    const group = healthy
      .slice(template.slice, template.slice + 4)
      .concat(healthy.slice(0, template.slice))
      .slice(0, 4)
    if (group.length === 0) return
    const supplier = supplierForCategory(group[0].category, template.variant)
    orders.push({
      id: template.code.toLowerCase(),
      code: template.code,
      supplierId: supplier.id,
      supplierName: supplier.name,
      status: template.status,
      currency: 'PEN',
      expectedAt: template.receivedAt,
      lines: group.map((product, lineIndex): PurchaseOrderLine => {
        const quantity = Math.max(Math.round(product.stock * 0.2), 2)
        return {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity,
          receivedQuantity:
            template.status === 'received'
              ? quantity
              : lineIndex === 0
                ? Math.max(Math.round(quantity * template.part), 1)
                : 0,
          unitCost: product.cost ?? Math.round(product.price * 0.78),
        }
      }),
      notes:
        template.status === 'partial'
          ? 'El proveedor avisó quiebre de stock en la segunda partida.'
          : 'Recepción conforme, sin observaciones de calidad.',
      createdBy: PURCHASE_BUYERS[template.variant % PURCHASE_BUYERS.length],
      createdAt: '2026-10-12T10:15:00.000Z',
      updatedAt: template.receivedAt,
    })
  })

  return orders
}

function buildSeedGoodsReceipts(orders: PurchaseOrder[]): GoodsReceipt[] {
  return orders
    .filter((order) => order.lines.some((line) => line.receivedQuantity > 0))
    .map((order, index): GoodsReceipt => {
      const receivedAt =
        order.status === 'partial' ? '2026-10-30T15:10:00.000Z' : '2026-10-19T16:40:00.000Z'
      return {
        id: `rc-2026-${String(index + 27).padStart(3, '0')}`,
        code: `RC-2026-${String(index + 27).padStart(3, '0')}`,
        purchaseOrderId: order.id,
        purchaseOrderCode: order.code,
        supplierName: order.supplierName,
        condition: order.status === 'partial' ? 'incomplete' : 'good',
        receivedBy: 'Maritza León Galvez',
        receivedAt,
        lines: order.lines
          .filter((line) => line.receivedQuantity > 0)
          .map((line) => ({
            productId: line.productId,
            productName: line.productName,
            sku: line.sku,
            orderedQuantity: line.quantity,
            receivedQuantity: line.receivedQuantity,
            rejectedQuantity: 0,
            locationId: shelfForCategory(
              products.find((product) => product.id === line.productId)?.category ?? ''
            ),
          })),
        notes:
          order.status === 'partial'
            ? 'Se registra solo lo físicamente recibido; el saldo queda pendiente de nueva recepción.'
            : 'Factura del proveedor archivada en la carpeta de compras.',
        createdAt: receivedAt,
      }
    })
}

function buildSeedStockCounts(items: AdminProduct[]): StockCount[] {
  const active = items.filter((product) => product.status === 'active')
  const countable = active.filter((product) => product.stock >= 4)
  const countLines = (indexes: number[], deltas: number[]): StockCountLine[] =>
    indexes.map((index, position) => {
      const product = countable[index % countable.length] ?? active[index % active.length]
      const delta = deltas[position % deltas.length]
      const systemQuantity = Math.max(product.stock - delta, 0)
      return {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        systemQuantity,
        countedQuantity: product.stock,
        locationId: shelfForCategory(product.category),
        note:
          delta === 0
            ? undefined
            : delta > 0
              ? 'Sobrante: unidad encontrada en estantería vecina.'
              : 'Faltante: unidad entregada sin despacho registrado.',
      }
    })

  return [
    {
      id: 'ct-2026-009',
      code: 'CT-2026-009',
      name: 'Conteo cíclico · estanterías A1 y B2',
      status: 'posted',
      locationId: 'est-a1',
      countedBy: 'Maritza León Galvez',
      startedAt: '2026-10-23T08:00:00.000Z',
      finishedAt: '2026-10-23T13:25:00.000Z',
      lines: countLines([0, 3, 7, 12, 18, 25], [-2, 1, 3, -1, 2, -3]),
      notes: 'Diferencias dentro del 2% tolerado; ajustes registrados en el kardex.',
    },
    {
      id: 'ct-2026-010',
      code: 'CT-2026-010',
      name: 'Conteo anual · almacén completo',
      status: 'open',
      countedBy: 'Rafael Mendoza Rivas',
      startedAt: '2026-11-04T07:45:00.000Z',
      lines: [0, 1, 2, 5, 9, 14, 21, 30].map((index) => {
        const product = active[index % active.length]
        return {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          systemQuantity: product.stock,
          countedQuantity: null,
          locationId: shelfForCategory(product.category),
        }
      }),
      notes: 'Pendiente la cuadratura de periféricos antes del cierre de noviembre.',
    },
  ]
}

type KardexEvent = {
  at: string
  type: InventoryMovement['type']
  quantity: number
  sign: 1 | -1
  reason: string
  note?: string
  unitCost?: number
  sourceType: MovementSourceType
  sourceId?: string
  sourceCode?: string
  locationId?: string
  toLocationId?: string
  actor: string
}

function buildSeedMovements(
  items: AdminProduct[],
  receipts: GoodsReceipt[],
  counts: StockCount[]
): InventoryMovement[] {
  const byProduct = new Map<string, KardexEvent[]>()
  const push = (productId: string, event: KardexEvent) => {
    const list = byProduct.get(productId) ?? []
    list.push(event)
    byProduct.set(productId, list)
  }

  receipts.forEach((receipt) => {
    receipt.lines.forEach((line) => {
      const product = items.find((item) => item.id === line.productId)
      push(line.productId, {
        at: receipt.receivedAt,
        type: 'in',
        quantity: line.receivedQuantity,
        sign: 1,
        reason: 'Compra a proveedor',
        note: `Recepción ${receipt.code} de ${receipt.supplierName}.`,
        unitCost: product?.cost,
        sourceType: 'purchase_receipt',
        sourceId: receipt.id,
        sourceCode: receipt.code,
        locationId: line.locationId,
        actor: receipt.receivedBy,
      })
    })
  })

  counts
    .filter((count) => count.status === 'posted')
    .forEach((count) => {
      count.lines.forEach((line) => {
        if (line.countedQuantity === null) return
        const delta = line.countedQuantity - line.systemQuantity
        if (delta === 0) return
        push(line.productId, {
          at: count.finishedAt ?? count.startedAt,
          type: 'adjustment',
          quantity: Math.abs(delta),
          sign: delta > 0 ? 1 : -1,
          reason: 'Conteo físico',
          note: `Diferencia detectada en ${count.code}.`,
          sourceType: 'stock_count',
          sourceId: count.id,
          sourceCode: count.code,
          locationId: line.locationId,
          actor: count.countedBy,
        })
      })
    })

  orders.forEach((order) => {
    if (order.status !== 'shipped' && order.status !== 'delivered') return
    order.items.forEach((item) => {
      if (!item.productId) return
      const quantity = item.deliveredQuantity || item.quantity
      if (quantity <= 0) return
      push(item.productId, {
        at: order.deliveredAt ?? order.updatedAt,
        type: 'out',
        quantity,
        sign: -1,
        reason: 'Venta',
        note: `Despacho del pedido ${order.code} (${order.clientName}).`,
        sourceType: 'order',
        sourceId: order.id,
        sourceCode: order.code,
        actor: 'Carlos Palomino Rueda',
      })
    })
  })

  // Reubicación física de dos SKUs: sale del almacén central hacia su estantería.
  const relocated = items.filter((product) => product.status === 'active').slice(40, 42)
  relocated.forEach((product, index) => {
    const at = index === 0 ? '2026-10-05T09:20:00.000Z' : '2026-10-05T09:35:00.000Z'
    const shelf = shelfForCategory(product.category)
    const quantity = 2
    push(product.id, {
      at,
      type: 'out',
      quantity,
      sign: -1,
      reason: 'Transferencia entre almacenes',
      note: `Movida a tránsito para reubicación en ${locationCode(shelf)}.`,
      sourceType: 'transfer',
      sourceCode: `TR-2026-00${index + 1}`,
      locationId: 'alm-principal',
      toLocationId: 'trn-01',
      actor: 'Rafael Mendoza Rivas',
    })
    push(product.id, {
      at: index === 0 ? '2026-10-05T16:05:00.000Z' : '2026-10-05T16:20:00.000Z',
      type: 'in',
      quantity,
      sign: 1,
      reason: 'Transferencia entre almacenes',
      note: 'Reubicación confirmada en la estantería destino.',
      sourceType: 'transfer',
      sourceCode: `TR-2026-00${index + 1}`,
      locationId: 'trn-01',
      toLocationId: shelf,
      actor: 'Rafael Mendoza Rivas',
    })
  })

  const movements: InventoryMovement[] = []
  items.forEach((product) => {
    const events = (byProduct.get(product.id) ?? [])
      .filter((event) => event.quantity > 0)
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())

    // Se descartan las entradas más grandes hasta que el saldo de apertura siga siendo positivo,
    // para que el kardex cierre contra el stock actual de la ficha.
    let kept = events
    let chain: KardexEvent[] = []
    let opening = 0
    for (let attempt = 0; attempt <= events.length; attempt += 1) {
      chain = []
      let running = 0
      kept.forEach((event) => {
        const next = running + event.sign * event.quantity
        if (next < 0) return
        running = next
        chain.push(event)
      })
      opening = product.stock - running
      if (opening >= 0) break
      let largestIndex = -1
      kept.forEach((event, index) => {
        if (event.sign !== 1) return
        if (largestIndex === -1 || event.quantity > kept[largestIndex].quantity) {
          largestIndex = index
        }
      })
      if (largestIndex === -1) break
      kept = kept.filter((_, index) => index !== largestIndex)
    }

    if (opening > 0) {
      chain.unshift({
        at: product.createdAt,
        type: 'adjustment',
        quantity: opening,
        sign: 1,
        reason: 'Carga inicial',
        note: 'Stock inicial del catálogo de demostración.',
        unitCost: product.cost,
        sourceType: 'manual',
        locationId: product.locationId,
        actor: 'Maritza León Galvez',
      })
    }

    let balance = 0
    chain.forEach((event, index) => {
      const previousStock = balance
      balance += event.sign * event.quantity
      movements.push({
        id: `demo-mov-${product.id}-${index + 1}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        type: event.type,
        // Un ajuste guarda el stock resultante (no la diferencia), igual que el alta manual del panel.
        quantity: event.type === 'adjustment' ? balance : event.quantity,
        previousStock,
        resultingStock: balance,
        reason: event.reason,
        note: event.note,
        unitCost: event.unitCost,
        sourceType: event.sourceType,
        sourceId: event.sourceId,
        sourceCode: event.sourceCode,
        locationId: event.locationId,
        toLocationId: event.toLocationId,
        actor: event.actor,
        createdAt: event.at,
      })
    })
  })

  return movements.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

function summarize(description: string): string {
  const clean = description.replace(/\s+/g, ' ').trim()
  return clean.length <= 140 ? clean : `${clean.slice(0, 137).trimEnd()}…`
}

function buildSeedActivity(items: AdminProduct[]): ActivityEntry[] {
  return [...items]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)
    .map((product, index): ActivityEntry => ({
      id: `demo-${index + 1}`,
      type: product.status === 'archived' ? 'archived' : 'updated',
      productId: product.id,
      productName: product.name,
      detail: product.status === 'archived' ? 'Producto archivado' : 'Ficha actualizada',
      at: product.updatedAt,
    }))
}

export function createSeedData(): AdminData {
  const normalized: AdminProduct[] = products.map((product) => ({
    ...product,
    shortDescription: summarize(product.description),
    showPrice: true,
    commercialMessage: '',
    seoTitle: '',
    seoDescription: '',
    imageAlt: product.name,
    maxStock: maxStockFor(product.minStock),
    locationId: shelfForCategory(product.category),
  }))

  const seededCategories: Category[] = categories.map((category, index) => ({
    ...category,
    slug: slugify(category.label),
    description: categoryDescriptions[category.id] ?? '',
    image: '',
    status: 'active',
    order: index,
  }))

  const purchaseRequests = buildSeedPurchaseRequests(normalized)
  const purchaseOrders = buildSeedPurchaseOrders(normalized, purchaseRequests)
  const goodsReceipts = buildSeedGoodsReceipts(purchaseOrders)
  const stockCounts = buildSeedStockCounts(normalized)

  return JSON.parse(
    JSON.stringify({
      products: normalized,
      categories: seededCategories,
      brands,
      clients,
      quotes,
      requests: [],
      settings,
      activity: buildSeedActivity(normalized),
      inventoryMovements: buildSeedMovements(normalized, goodsReceipts, stockCounts),
      warehouseLocations,
      purchaseRequests,
      purchaseOrders,
      goodsReceipts,
      stockCounts,
      webProjects,
      users: [],
      suppliers,
      orders,
      attributes,
    })
  ) as AdminData
}
