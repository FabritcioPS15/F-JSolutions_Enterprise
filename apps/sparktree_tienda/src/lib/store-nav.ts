export const CORPORATE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fjsolutions.pe').replace(
  /\/$/,
  ''
)

export function corporateUrl(path: string) {
  return `${CORPORATE_URL}${path}`
}

function unitUrl(value: string | undefined, fallback: string) {
  return (value ?? fallback).replace(/\/$/, '')
}

export const GROUP_URL = unitUrl(process.env.NEXT_PUBLIC_URL_GROUP, 'http://localhost:3008')

export const STORE_NAV = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/productos' },
]

export const ECOSYSTEM_NAV = [
  {
    name: 'SparkTree Systems',
    tagline: 'Tecnología e infraestructura',
    href: unitUrl(process.env.NEXT_PUBLIC_URL_SYSTEMS, CORPORATE_URL),
    accent: '#00B8D9',
  },
  {
    name: 'SparkTree Studio',
    tagline: 'Marca y crecimiento digital',
    href: unitUrl(process.env.NEXT_PUBLIC_URL_STUDIO, 'http://localhost:3007'),
    accent: '#10B981',
  },
  {
    name: 'SparkTree Academia',
    tagline: 'Formación tecnológica',
    href: unitUrl(process.env.NEXT_PUBLIC_URL_ACADEMIA, 'http://localhost:3004'),
    accent: '#4267C7',
  },
  {
    name: 'SparkTree Legal',
    tagline: 'Respaldo legal empresarial',
    href: unitUrl(process.env.NEXT_PUBLIC_URL_LEGAL, 'http://localhost:3009'),
    accent: '#C6A56B',
  },
]

export const COMPANY = {
  ruc: '20XXXXXXXXX',
  phone: '+51 999 888 777',
  phoneHref: 'tel:+51999888777',
  email: 'ventas@fjsolutions.pe',
  location: 'Lima, Perú',
  hours: 'Lun–Sáb · 9:00 a 18:00',
  socials: [
    { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/fjtechpe' },
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/fjtechpe' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/fjtech' },
    { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/51999888777' },
  ],
} as const
