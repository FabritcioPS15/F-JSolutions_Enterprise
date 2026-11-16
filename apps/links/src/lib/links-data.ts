export type LinkCategory = 'all' | 'direct' | 'business' | 'academy' | 'social'

export type QuickLink = {
  id: string
  title: string
  subtitle?: string
  url: string
  category: LinkCategory
  icon: string
  badge?: string
  badgeColor?: 'emerald' | 'amber' | 'purple' | 'blue'
  highlight?: boolean
  onClickAction?: 'vcard' | 'share'
}

export const PROFILE_INFO = {
  name: 'F&J Solutions Enterprise',
  handle: '@fjsolutions.pe',
  bio: 'Soluciones Tecnológicas Corporativas · Hardware, Desarrollo de Software & Soporte TI en Perú 🇵🇪',
  status: '🟢 Atendiendo solicitudes en vivo',
  avatarUrl: '/logo.png',
  location: 'Lima, Perú',
  phone: '+51 923 055 963',
  email: 'ventas@fjsolutions.com.pe',
  website: 'https://fjsolutions.com.pe',
}

export const LINK_CATEGORIES: { id: LinkCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'direct', label: '⚡ Rápido' },
  { id: 'business', label: '💼 Empresa' },
  { id: 'academy', label: '🎓 Academia' },
  { id: 'social', label: '📱 Redes' },
]

export const QUICK_LINKS: QuickLink[] = [
  {
    id: 'whatsapp-ventas',
    title: 'Chatear por WhatsApp (Ventas & Cotizaciones)',
    subtitle: 'Atención personalizada en menos de 5 minutos',
    url: 'https://wa.me/51923055963?text=Hola%20F%26J%20Solutions,%20vengo%20desde%20sus%20redes%20sociales%20y%20deseo%20informaci%C3%B3n.',
    category: 'direct',
    icon: 'MessageCircle',
    badge: 'MÁS RÁPIDO',
    badgeColor: 'emerald',
    highlight: true,
  },
  {
    id: 'catalogo-productos',
    title: 'Catálogo de Equipos & Hardware TI',
    subtitle: 'Laptops, Servidores, Redes, Componentes y Accesorios',
    url: 'https://fjsolutions.com.pe/productos',
    category: 'business',
    icon: 'ShoppingBag',
    badge: 'TIENDA',
    badgeColor: 'purple',
  },
  {
    id: 'desarrollo-software',
    title: 'Cotizar Desarrollo de Software & Apps Web',
    subtitle: 'Sistemas a medida, ERPs, E-commerce e infraestructura Cloud',
    url: 'https://fjsolutions.com.pe/servicios',
    category: 'business',
    icon: 'Code2',
    badge: 'EMPRESAS',
    badgeColor: 'blue',
  },
  {
    id: 'fj-academy',
    title: 'F&J Academy — Cursos & Certificaciones TI',
    subtitle: 'Programación Full Stack, DevOps, Ciberseguridad e IA',
    url: 'http://localhost:3004',
    category: 'academy',
    icon: 'GraduationCap',
    badge: 'NUEVO',
    badgeColor: 'amber',
    highlight: true,
  },
  {
    id: 'whatsapp-soporte',
    title: 'Mesa de Ayuda & Soporte Técnico',
    subtitle: 'Atención a clientes corporativos con convenios vigentes',
    url: 'https://wa.me/51923055963?text=Hola,%20necesito%20soporte%20t%C3%A9cnico%20para%20mi%20empresa.',
    category: 'direct',
    icon: 'Wrench',
  },
  {
    id: 'tiktok-oficial',
    title: 'Síguenos en TikTok',
    subtitle: '@fjsolutions.pe · Tips de tecnología, hardware y proyectos',
    url: 'https://tiktok.com/@fjsolutions.pe',
    category: 'social',
    icon: 'Video',
  },
  {
    id: 'instagram-oficial',
    title: 'Síguenos en Instagram',
    subtitle: '@fjsolutions.pe · Novedades, unboxings y casos de éxito',
    url: 'https://instagram.com/fjsolutions.pe',
    category: 'social',
    icon: 'Instagram',
  },
  {
    id: 'sitio-web-oficial',
    title: 'Página Web Oficial',
    subtitle: 'Conoce todo sobre F&J Solutions Enterprise',
    url: 'https://fjsolutions.com.pe',
    category: 'business',
    icon: 'Globe',
  },
  {
    id: 'guardar-contacto',
    title: 'Guardar Contacto en tu Celular (VCard)',
    subtitle: 'Agrega a F&J Solutions a tus contactos con 1 toque',
    url: '#',
    category: 'direct',
    icon: 'UserPlus',
    onClickAction: 'vcard',
  },
]
