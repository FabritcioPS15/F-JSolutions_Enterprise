import Link from 'next/link'
import { EMPRESA } from '@/lib/constants'

// ─── Tipos y Estructura de Navegación (4 Columnas) ───────────────────────────

interface FooterNavLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterNavLink[]
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Productos y equipos TI',
    links: [
      { label: 'Computadoras y laptops', href: '/productos?categoria=PC y Servidores' },
      { label: 'Componentes y periféricos', href: '/productos?categoria=Componentes' },
      { label: 'Monitores y pantallas', href: '/productos?categoria=Monitores' },
      { label: 'Accesorios tecnológicos', href: '/productos?categoria=Accesorios' },
      { label: 'Equipos de redes e infraestructura', href: '/productos?categoria=Redes' },
      { label: 'Ver todos los productos', href: '/productos' },
    ],
  },
  {
    title: 'Servicios tecnológicos',
    links: [
      { label: 'Soporte técnico', href: '/soporte-ti' },
      { label: 'Infraestructura TI', href: '/servicios' },
      { label: 'Redes y conectividad', href: '/servicios' },
      { label: 'Mantenimiento de equipos', href: '/soporte-ti' },
      { label: 'Desarrollo de software', href: '/sistemas' },
      { label: 'Automatización de procesos', href: '/sistemas' },
    ],
  },
  {
    title: 'Soluciones empresariales',
    links: [
      { label: 'Soluciones para empresas', href: '/nosotros' },
      { label: 'Implementación tecnológica', href: '/como-trabajamos' },
      { label: 'Sistemas y aplicaciones', href: '/sistemas' },
      { label: 'Consultoría TI', href: '/servicios' },
      { label: 'Proyectos tecnológicos', href: '/proyectos' },
    ],
  },
  {
    title: 'Atención y cotizaciones',
    links: [
      { label: 'Solicitar cotización', href: '/cotizacion' },
      { label: 'Consultar productos', href: '/cotizador' },
      { label: 'Atención empresarial', href: '/contacto' },
      { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
]

// Redes sociales oficiales configuradas en EMPRESA
const SOCIAL_NETWORKS = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: EMPRESA.redesSociales.facebook,
    path: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: EMPRESA.redesSociales.instagram,
    path: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: EMPRESA.redesSociales.linkedin,
    path: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: EMPRESA.redesSociales.whatsapp,
    path: (
      <>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
        <path d="M9.4 8.9c.2-.5.9-.5 1.1-.1l.9 1.6c.1.3 0 .5-.1.7l-.6.6c.4 1.2 1.4 2.2 2.6 2.6l.6-.6c.2-.1.5-.2.7-.1l1.6.9c.4.2.4.9-.1 1.1-1.4.7-3 .3-4.7-.8a7.6 7.6 0 0 1-2.8-2.8c-1.1-1.7-1.5-3.3-.8-4.7z" />
      </>
    ),
  },
].filter((item) => Boolean(item.href))

const FOCUS_STYLE =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B132B]'

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="border-t border-[#1E293B]/80 bg-[#0B132B] text-[#94A3B8] selection:bg-[#2563EB]/25 selection:text-white"
      aria-label="Pie de página"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* ─── A. Cabecera del Footer: Logotipo oficial & Redes Sociales ─── */}
        <div className="flex flex-col gap-6 pb-10 sm:flex-row sm:items-center sm:justify-between border-b border-[#1E293B]/80">
          {/* Logotipo F&J Systems */}
          <Link
            href="/"
            className={`group inline-flex items-center gap-3 ${FOCUS_STYLE} rounded-lg`}
            aria-label="F&J Systems · Inicio"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="bg-white rounded-xl px-2.5 py-1.5 shadow-sm transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none">
              <img
                src="/images/logo.png"
                alt="F&J Systems"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Redes Sociales: botones circulares discretos */}
          {SOCIAL_NETWORKS.length > 0 && (
            <div className="flex items-center gap-2.5" aria-label="Redes sociales oficiales">
              {SOCIAL_NETWORKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`grid size-9 place-items-center rounded-full border border-[#1E293B] bg-[#0F172A]/70 text-[#94A3B8] transition duration-200 hover:border-[#2563EB]/60 hover:bg-[#1E293B] hover:text-white motion-reduce:transition-none ${FOCUS_STYLE}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {social.path}
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ─── B. Navegación Principal en Cuatro Columnas ─── */}
        <nav
          aria-label="Navegación del pie de página"
          className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10"
        >
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col">
              <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.12em] text-[#F8FAFC]">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`inline-block text-[#94A3B8] transition-colors duration-200 hover:text-[#38BDF8] motion-reduce:transition-none ${FOCUS_STYLE} rounded-sm`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* ─── C & D. Separador y Franja Legal Inferior ─── */}
        <div className="border-t border-[#1E293B]/80 pt-8">
          <div className="flex flex-col gap-4 text-xs text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[#94A3B8]">
              &copy; {currentYear} F&J Systems. Todos los derechos reservados.
            </p>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <li>
                <Link
                  href="/nosotros"
                  className={`transition-colors duration-200 hover:text-[#CBD5E1] motion-reduce:transition-none ${FOCUS_STYLE} rounded-sm`}
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className={`transition-colors duration-200 hover:text-[#CBD5E1] motion-reduce:transition-none ${FOCUS_STYLE} rounded-sm`}
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/preguntas-frecuentes"
                  className={`transition-colors duration-200 hover:text-[#CBD5E1] motion-reduce:transition-none ${FOCUS_STYLE} rounded-sm`}
                >
                  Información legal
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
