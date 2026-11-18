// Modelo de las páginas AllMyLinks: cada empresa tiene su propio perfil público
// en /e/<slug> con identidad, colores y lista de enlaces editable desde el panel.
export type BadgeColor = 'emerald' | 'amber' | 'purple' | 'blue'

export type LinkIconKey =
  | 'MessageCircle'
  | 'ShoppingBag'
  | 'Code2'
  | 'GraduationCap'
  | 'Wrench'
  | 'Instagram'
  | 'Video'
  | 'Globe'
  | 'UserPlus'
  | 'Mail'
  | 'Phone'
  | 'Calendar'

export type LinkAction = 'vcard' | 'share'

export type ProfileLink = {
  id: string
  title: string
  subtitle: string
  url: string
  icon: LinkIconKey
  badge: string
  badgeColor: BadgeColor
  highlight: boolean
  action: LinkAction | ''
}

export type ProfileSocials = {
  whatsapp: string
  tiktok: string
  instagram: string
  website: string
}

// Fondo de la página pública: color plano, degradado o imagen con velo.
export type ProfileBackground =
  | { kind: 'solid'; color: string }
  | { kind: 'gradient'; from: string; to: string; angle: number }
  | { kind: 'image'; url: string; dim: number }

export type ProfileTone = 'auto' | 'light' | 'dark'

export type LinkProfile = {
  id: string
  slug: string
  name: string
  handle: string
  bio: string
  initials: string
  avatarUrl: string
  verified: boolean
  statusEnabled: boolean
  statusText: string
  location: string
  phone: string
  email: string
  website: string
  accent: string
  background: ProfileBackground
  tone: ProfileTone
  footerNote: string
  socials: ProfileSocials
  links: ProfileLink[]
  published: boolean
  updatedAt: string
}

export type LinkProfileInput = Omit<LinkProfile, 'id' | 'updatedAt'>

export const ACCENT_PRESETS = [
  { value: '#7C3AED', label: 'Violeta' },
  { value: '#2563EB', label: 'Azul' },
  { value: '#0891B2', label: 'Cian' },
  { value: '#059669', label: 'Esmeralda' },
  { value: '#D97706', label: 'Ámbar' },
  { value: '#DB2777', label: 'Rosa' },
  { value: '#DC2626', label: 'Rojo' },
  { value: '#475569', label: 'Pizarra' },
] as const

export const LINK_ICON_OPTIONS: { value: LinkIconKey; label: string }[] = [
  { value: 'MessageCircle', label: 'Chat / WhatsApp' },
  { value: 'ShoppingBag', label: 'Tienda / catálogo' },
  { value: 'Code2', label: 'Desarrollo / software' },
  { value: 'GraduationCap', label: 'Academia / cursos' },
  { value: 'Wrench', label: 'Soporte técnico' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Video', label: 'TikTok / video' },
  { value: 'Globe', label: 'Sitio web' },
  { value: 'UserPlus', label: 'Guardar contacto' },
  { value: 'Mail', label: 'Correo' },
  { value: 'Phone', label: 'Teléfono' },
  { value: 'Calendar', label: 'Agenda / reservas' },
]

export const BADGE_COLOR_OPTIONS: { value: BadgeColor; label: string }[] = [
  { value: 'purple', label: 'Violeta' },
  { value: 'blue', label: 'Azul' },
  { value: 'emerald', label: 'Esmeralda' },
  { value: 'amber', label: 'Ámbar' },
]

export const LINK_ICON_KEYS = LINK_ICON_OPTIONS.map((option) => option.value)
export const BADGE_COLORS = BADGE_COLOR_OPTIONS.map((option) => option.value)

export const BACKGROUND_PRESETS: {
  label: string
  background: ProfileBackground
}[] = [
  {
    label: 'Noche',
    background: { kind: 'gradient', from: '#0B1220', to: '#16213A', angle: 160 },
  },
  {
    label: 'Océano',
    background: { kind: 'gradient', from: '#082F49', to: '#0E7490', angle: 150 },
  },
  {
    label: 'Bosque',
    background: { kind: 'gradient', from: '#05201A', to: '#166534', angle: 155 },
  },
  {
    label: 'Atardecer',
    background: { kind: 'gradient', from: '#4C0519', to: '#9A3412', angle: 140 },
  },
  {
    label: 'Arena',
    background: { kind: 'solid', color: '#F5F0E6' },
  },
  {
    label: 'Nieve',
    background: { kind: 'solid', color: '#F8FAFC' },
  },
]

export const DEFAULT_BACKGROUND: ProfileBackground = {
  kind: 'gradient',
  from: '#0B1220',
  to: '#16213A',
  angle: 160,
}

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'FJ'
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
