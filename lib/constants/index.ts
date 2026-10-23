// ─── Empresa ───────────────────────────────────────────────────────────────────
export const EMPRESA = {
  nombre: 'FJ Tech Solutions',
  tagline: 'Tecnologia que mueve tu empresa',
  ruc: '20XXXXXXXXX',
  telefono: '+51 999 888 777',
  email: 'ventas@fjsolutions.pe',
  emailSoporte: 'soporte@fjsolutions.pe',
  direccion: 'Lima, Peru',
  horario: 'Lun-Sab · 9:00 a 18:00',
  redesSociales: {
    linkedin: 'https://linkedin.com/company/fjtech',
    facebook: 'https://facebook.com/fjtechpe',
    instagram: 'https://instagram.com/fjtechpe',
    whatsapp: 'https://wa.me/51999888777',
  },
} as const

// ─── Navegacion ────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Soporte TI', href: '/soporte-ti' },
  { label: 'Sistemas', href: '/sistemas' },
  { label: 'Cotizador', href: '/cotizador' },
  { label: 'Contacto', href: '/#contacto' },
] as const

// ─── Categorias ────────────────────────────────────────────────────────────────
export const CATEGORIES = [
  'PC y Servidores',
  'Laptops',
  'Componentes',
  'Monitores',
  'Perifericos',
  'Almacenamiento',
  'Redes',
  'Impresoras',
  'Audio y Video',
  'Gaming',
  'Accesorios',
  'Telefonia',
  'Software',
  'Cables y Energia',
  'Hogar inteligente',
] as const

// ─── Colores ───────────────────────────────────────────────────────────────────
export const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  accent: '#0891B2',
  accentDark: '#0E7490',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  surface: '#F8FAFC',
} as const

// ─── Paginacion ────────────────────────────────────────────────────────────────
export const ITEMS_PER_PAGE = 24