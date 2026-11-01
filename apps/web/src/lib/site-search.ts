import { categories as catalogCategories, products as catalogProducts } from './catalog'
import { getServicePath, serviceDefinitions, type ServiceCategory } from './services'

export type SiteSearchType = 'product' | 'system' | 'service' | 'category' | 'page' | 'legal'

export type SiteSearchEntry = {
  id: string
  type: SiteSearchType
  title: string
  description?: string
  href: string
  keywords: string[]
  image?: string
}

export type SiteSearchResult = SiteSearchEntry & {
  score: number
}

export type SiteSearchGroup = {
  type: SiteSearchType
  label: string
  items: SiteSearchResult[]
}

export const searchTypeGroupLabels: Record<SiteSearchType, string> = {
  product: 'Productos',
  system: 'Desarrollo de software',
  service: 'Servicios',
  category: 'Categorías',
  page: 'Secciones',
  legal: 'Legal',
}

export const searchTypeOrder: SiteSearchType[] = [
  'product',
  'system',
  'service',
  'category',
  'page',
  'legal',
]

const typeWeight: Record<SiteSearchType, number> = {
  product: 8,
  system: 7,
  service: 6,
  category: 5,
  page: 4,
  legal: 1,
}

const categoryKeywords: Record<ServiceCategory, string[]> = {
  'Soporte TI': [
    'soporte',
    'tecnico',
    'mantenimiento',
    'reparacion',
    'incidencias',
    'mesa de ayuda',
    'instalacion',
    'impresoras',
    'remoto',
    'presencial',
    'empresas',
  ],
  'Infraestructura TI': [
    'infraestructura',
    'redes',
    'red',
    'conectividad',
    'cableado',
    'estructurado',
    'switch',
    'router',
    'access point',
    'wifi',
    'servidores',
    'equipamiento',
    'empresas',
  ],
  'Desarrollo de software': [
    'web',
    'pagina web',
    'software',
    'sistemas',
    'desarrollo',
    'erp',
    'api',
    'integraciones',
    'automatizacion',
    'aplicaciones',
    'app',
    'digitalizacion',
  ],
}

type StaticPage = {
  title: string
  href: string
  description: string
  keywords: string[]
}

const staticPages: StaticPage[] = [
  {
    title: 'Inicio',
    href: '/',
    description: 'Soluciones tecnológicas para empresas: equipos, soporte y software.',
    keywords: ['inicio', 'home', 'portada', 'fj', 'f&j', 'sistemas', 'tecnologia'],
  },
  {
    title: 'Catálogo de productos',
    href: '/productos',
    description: 'Laptops, computadoras, monitores, redes, impresoras y más.',
    keywords: [
      'productos',
      'catalogo',
      'tienda',
      'comprar',
      'laptops',
      'pcs',
      'computadoras',
      'monitores',
      'perifericos',
      'componentes',
      'impresoras',
      'redes',
      'almacenamiento',
    ],
  },
  {
    title: 'Servicios TI',
    href: '/servicios',
    description: 'Soporte técnico, mantenimiento e infraestructura para empresas.',
    keywords: [
      'servicios',
      'soporte',
      'mantenimiento',
      'infraestructura',
      'redes',
      'cableado',
      'empresas',
    ],
  },
  {
    title: 'Desarrollo de software',
    href: '/sistemas',
    description: 'Sistemas web a medida, ERP, automatización e integraciones.',
    keywords: [
      'web',
      'pagina web',
      'software',
      'sistemas',
      'desarrollo',
      'erp',
      'api',
      'automatizacion',
      'aplicaciones',
      'app',
    ],
  },
  {
    title: 'Sobre nosotros',
    href: '/nosotros',
    description: 'Trayectoria, valores y equipo técnico de F&J Systems.',
    keywords: ['empresa', 'nosotros', 'quienes somos', 'equipo', 'historia', 'fj'],
  },
  {
    title: 'Proyectos y experiencia',
    href: '/proyectos',
    description: 'Casos de éxito y sectores atendidos.',
    keywords: ['proyectos', 'casos', 'experiencia', 'portafolio', 'clientes', 'exito'],
  },
  {
    title: 'Cómo trabajamos',
    href: '/como-trabajamos',
    description: 'Metodología, etapas y garantías de nuestro servicio.',
    keywords: ['metodologia', 'proceso', 'etapas', 'garantia', 'como trabajamos'],
  },
  {
    title: 'Preguntas frecuentes',
    href: '/preguntas-frecuentes',
    description: 'Respuestas a las consultas más habituales.',
    keywords: ['faq', 'preguntas', 'dudas', 'ayuda', 'frecuentes'],
  },
  {
    title: 'Contacto',
    href: '/contacto',
    description: 'Canales directos de atención, ventas y asesoría.',
    keywords: [
      'contacto',
      'contactar',
      'telefono',
      'whatsapp',
      'correo',
      'email',
      'asesoria',
      'ventas',
      'atencion',
    ],
  },
  {
    title: 'Solicitar cotización',
    href: '/cotizacion',
    description: 'Arma tu cotización y recíbela con asesoría personalizada.',
    keywords: ['cotizacion', 'cotizar', 'presupuesto', 'precio', 'cotizador', 'comprar'],
  },
  {
    title: 'Mi cuenta',
    href: '/mi-cuenta',
    description: 'Perfil, favoritos y cotizaciones guardadas.',
    keywords: ['cuenta', 'perfil', 'favoritos', 'cotizaciones', 'mi cuenta'],
  },
  {
    title: 'Blog',
    href: '/blog',
    description: 'Artículos y novedades de tecnología para empresas.',
    keywords: ['blog', 'noticias', 'articulos', 'tecnologia', 'guías'],
  },
]

const legalPages: StaticPage[] = [
  {
    title: 'Términos y condiciones',
    href: '/terminos-y-condiciones',
    description: 'Condiciones de uso de los servicios y la tienda.',
    keywords: ['terminos', 'condiciones', 'contrato', 'legal'],
  },
  {
    title: 'Política de privacidad',
    href: '/politica-de-privacidad',
    description: 'Tratamiento y protección de tus datos personales.',
    keywords: ['privacidad', 'datos', 'proteccion', 'cookies', 'legal'],
  },
  {
    title: 'Información legal',
    href: '/informacion-legal',
    description: 'Datos de la empresa y avisos legales.',
    keywords: ['informacion legal', 'empresa', 'ruc', 'razon social', 'legal'],
  },
]

function buildIndex(): SiteSearchEntry[] {
  const productEntries: SiteSearchEntry[] = catalogProducts.map((product) => ({
    id: `product-${product.id}`,
    type: 'product',
    title: product.name,
    description: `${product.brand} · ${product.category}`,
    href: `/productos/${product.slug}`,
    image: product.image,
    keywords: [
      product.brand,
      product.category,
      product.model ?? '',
      product.sku ?? '',
      ...product.specs.slice(0, 6),
    ].filter(Boolean),
  }))

  const serviceEntries: SiteSearchEntry[] = serviceDefinitions.map((service) => {
    const isSoftware = service.category === 'Desarrollo de software'
    return {
      id: `${isSoftware ? 'system' : 'service'}-${service.slug}`,
      type: isSoftware ? 'system' : 'service',
      title: service.title,
      description: service.summary,
      href: getServicePath(service.slug),
      keywords: [
        service.category,
        ...categoryKeywords[service.category],
        ...service.slug.split('-'),
        ...service.includes.map((item) => item.title),
      ],
    }
  })

  const categoryEntries: SiteSearchEntry[] = catalogCategories.map((category) => ({
    id: `category-${category}`,
    type: 'category',
    title: category,
    description: 'Categoría del catálogo',
    href: `/productos?categoria=${encodeURIComponent(category)}`,
    keywords: ['categoria', category],
  }))

  const pageEntries: SiteSearchEntry[] = staticPages.map((page) => ({
    id: `page-${page.href}`,
    type: 'page',
    title: page.title,
    description: page.description,
    href: page.href,
    keywords: page.keywords,
  }))

  const legalEntries: SiteSearchEntry[] = legalPages.map((page) => ({
    id: `legal-${page.href}`,
    type: 'legal',
    title: page.title,
    description: page.description,
    href: page.href,
    keywords: page.keywords,
  }))

  return [
    ...productEntries,
    ...serviceEntries,
    ...categoryEntries,
    ...pageEntries,
    ...legalEntries,
  ]
}

const searchIndex = buildIndex()

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

function scoreEntry(entry: SiteSearchEntry, tokens: string[], normalizedQuery: string) {
  const title = normalize(entry.title)
  const description = normalize(entry.description ?? '')
  const href = normalize(entry.href)
  const keywords = entry.keywords.map(normalize)
  const haystack = [title, description, href, ...keywords].join(' ')

  if (!tokens.every((token) => haystack.includes(token))) return 0

  let score = 10

  if (title === normalizedQuery) score += 100
  else if (title.startsWith(normalizedQuery)) score += 60
  else if (title.includes(normalizedQuery)) score += 40

  if (keywords.some((keyword) => keyword === normalizedQuery)) score += 30
  else if (keywords.some((keyword) => keyword.includes(normalizedQuery))) score += 18

  if (description.includes(normalizedQuery)) score += 10

  return score + typeWeight[entry.type]
}

export function searchSite(query: string): SiteSearchResult[] {
  const normalizedQuery = normalize(query.trim())
  if (!normalizedQuery) return []

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean)

  return searchIndex
    .map((entry) => ({ ...entry, score: scoreEntry(entry, tokens, normalizedQuery) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es'))
}

export function searchSiteGrouped(
  query: string,
  options: { perType?: number; maxGroups?: number } = {},
): SiteSearchGroup[] {
  const { perType = 2, maxGroups } = options
  const results = searchSite(query)

  const groups = searchTypeOrder
    .map((type) => ({
      type,
      label: searchTypeGroupLabels[type],
      items: results.filter((result) => result.type === type).slice(0, perType),
    }))
    .filter((group) => group.items.length > 0)

  return typeof maxGroups === 'number' ? groups.slice(0, maxGroups) : groups
}

export const popularSearches = ['web', 'laptops', 'redes', 'soporte', 'impresoras', 'software']

export const quickSearchLinks = [
  { label: 'Catálogo', href: '/productos', description: 'Equipos y accesorios' },
  { label: 'Servicios TI', href: '/servicios', description: 'Soporte e infraestructura' },
  { label: 'Desarrollo de software', href: '/sistemas', description: 'Sistemas web, ERP y API' },
]
