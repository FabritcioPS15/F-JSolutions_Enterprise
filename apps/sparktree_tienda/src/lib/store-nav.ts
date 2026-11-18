export const CORPORATE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fjsolutions.pe').replace(
  /\/$/,
  ''
)

export function corporateUrl(path: string) {
  return `${CORPORATE_URL}${path}`
}

export const STORE_NAV = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/productos' },
  { label: 'Búsqueda', href: '/buscar' },
]

export const CORPORATE_NAV = [
  { label: 'Servicios TI', href: '/servicios' },
  { label: 'Infraestructura TI', href: '/infraestructura-ti' },
  { label: 'Desarrollo de software', href: '/sistemas' },
  { label: 'Empresa', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
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
