// URLs del ecosistema SparkTree: en producción se configuran por entorno.
export const STORE_APP_URL = (
  process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006'
).replace(/\/$/, '')

export const STUDIO_URL = (
  process.env.NEXT_PUBLIC_STUDIO_URL ?? 'https://sparktree.pe'
).replace(/\/$/, '')

export const ACADEMY_APP_URL = (
  process.env.NEXT_PUBLIC_ACADEMY_APP_URL ?? 'http://localhost:3004'
).replace(/\/$/, '')

export const GROUP_APP_URL = (
  process.env.NEXT_PUBLIC_GROUP_APP_URL ?? 'http://localhost:3008'
).replace(/\/$/, '')

export function storeUrl(path = '') {
  if (!path) return STORE_APP_URL
  return `${STORE_APP_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export type EcosystemUnit = {
  slug: 'systems' | 'studio' | 'academia' | 'store'
  name: string
  tagline: string
  description: string
  href: string
  accent: string
  icon: 'server' | 'globe' | 'academic' | 'store'
}

export const ECOSYSTEM_UNITS: EcosystemUnit[] = [
  {
    slug: 'systems',
    name: 'SparkTree Systems',
    tagline: 'Infraestructura y soluciones tecnológicas',
    description:
      'Infraestructura TI, soporte gestionado, seguridad y desarrollo de software para empresas.',
    href: '/',
    accent: '#00B8D9',
    icon: 'server',
  },
  {
    slug: 'studio',
    name: 'SparkTree Studio',
    tagline: 'Desarrollo de software y productos digitales',
    description:
      'Sitios web, plataformas y productos digitales con estrategia de marca y crecimiento.',
    href: STUDIO_URL,
    accent: '#10B981',
    icon: 'globe',
  },
  {
    slug: 'academia',
    name: 'SparkTree Academia',
    tagline: 'Educación y formación tecnológica',
    description:
      'Programas prácticos para formar a los equipos que sostienen la operación.',
    href: ACADEMY_APP_URL,
    accent: '#4267C7',
    icon: 'academic',
  },
  {
    slug: 'store',
    name: 'SparkTree Store',
    tagline: 'Productos y equipamiento tecnológico',
    description:
      'Computadoras, redes y periféricos con asesoría técnica y garantía de marca.',
    href: STORE_APP_URL,
    accent: '#2563EB',
    icon: 'store',
  },
]
