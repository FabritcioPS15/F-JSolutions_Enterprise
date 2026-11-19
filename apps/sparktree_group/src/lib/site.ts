// URLs de cada unidad: en producción se configuran por entorno; los valores
// locales apuntan a los puertos del monorepo para poder probar el ecosistema.
export const GROUP_CONTACT = {
  whatsapp: process.env.NEXT_PUBLIC_GROUP_WHATSAPP ?? '51958077827',
  email: process.env.NEXT_PUBLIC_GROUP_EMAIL ?? 'admin@sparktree.pe',
  location: 'Lima, Perú',
}

export function whatsappUrl(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export type Unit = {
  slug: 'studio' | 'systems' | 'academia' | 'store' | 'legal'
  name: string
  tagline: string
  description: string
  href: string
  tags: string[]
  accent: string
}

export const UNITS: Unit[] = [
  {
    slug: 'studio',
    name: 'SparkTree Studio',
    tagline: 'Marca y crecimiento digital',
    description:
      'Estrategia de marca, sitios web, SEO y campañas para que tu empresa sea encontrada, recordada y elegida.',
    href: process.env.NEXT_PUBLIC_URL_STUDIO ?? 'https://sparktree.pe',
    tags: ['Branding', 'Web & SEO', 'Marketing'],
    accent: '#10B981',
  },
  {
    slug: 'systems',
    name: 'SparkTree Systems',
    tagline: 'Tecnología e infraestructura',
    description:
      'Desarrollo de software, infraestructura TI y equipamiento corporativo para operar con seguridad y continuidad.',
    href: process.env.NEXT_PUBLIC_URL_SYSTEMS ?? 'https://fjsolutions.com.pe',
    tags: ['Software a medida', 'Infraestructura', 'Soporte TI'],
    accent: '#00B8D9',
  },
  {
    slug: 'academia',
    name: 'SparkTree Academia',
    tagline: 'Formación tecnológica',
    description:
      'Programas prácticos para formar a los equipos que sostienen la operación y lideran los próximos proyectos.',
    href: process.env.NEXT_PUBLIC_URL_ACADEMIA ?? 'http://localhost:3004',
    tags: ['Cursos', 'Certificación', 'Equipos'],
    accent: '#4267C7',
  },
  {
    slug: 'store',
    name: 'SparkTree Store',
    tagline: 'Equipamiento corporativo',
    description:
      'Laptops, servidores, redes y licencias con garantía y acompañamiento para comprar bien desde el inicio.',
    href: process.env.NEXT_PUBLIC_URL_STORE ?? 'http://localhost:3006',
    tags: ['Hardware', 'Redes', 'Licencias'],
    accent: '#2563EB',
  },
  {
    slug: 'legal',
    name: 'SparkTree Legal',
    tagline: 'Respaldo legal empresarial',
    description:
      'Contratos, constitución, cumplimiento y disputas con un solo interlocutor para todos los casos legales.',
    href: process.env.NEXT_PUBLIC_URL_LEGAL ?? 'http://localhost:3009',
    tags: ['Contratos', 'Cumplimiento', 'Litigios'],
    accent: '#C6A56B',
  },
]

export const ECOSYSTEM_STEPS = [
  {
    title: 'Diagnóstico compartido',
    text: 'Escuchamos el negocio completo, no solo un entregable aislado. Identificamos prioridades y riesgos.',
  },
  {
    title: 'Un plan por especialidad',
    text: 'Cada unidad propone lo que le corresponde, con alcance, responsables y tiempos claros.',
  },
  {
    title: 'Ejecución coordinada',
    text: 'Un único punto de contacto ordena prioridades y evita esfuerzos duplicados entre áreas.',
  },
  {
    title: 'Acompañamiento continuo',
    text: 'El ecosistema crece contigo: marca, tecnología, equipo y respaldo legal en la misma conversación.',
  },
]
