'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { EMPRESA } from '@/lib/constants'
import { cn } from '@/lib/utils'

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
      { label: 'Soporte técnico', href: '/servicios/soporte-tecnico' },
      { label: 'Soporte para empresas', href: '/servicios/soporte-empresarial' },
      { label: 'Redes y conectividad', href: '/servicios/redes-y-conectividad' },
      { label: 'Cableado estructurado', href: '/servicios/cableado-estructurado' },
      { label: 'Mantenimiento de equipos', href: '/servicios/mantenimiento-de-equipos' },
      { label: 'Implementación de infraestructura', href: '/servicios/implementacion-de-infraestructura' },
      { label: 'Sistemas web a medida', href: '/sistemas/sistemas-web-a-medida' },
      { label: 'Creación de páginas web', href: '/sistemas/creacion-de-paginas-web' },
      { label: 'Automatización de procesos', href: '/sistemas/automatizacion-de-procesos' },
    ],
  },
  {
    title: 'Soluciones empresariales',
    links: [
      { label: 'Soluciones para empresas', href: '/nosotros' },
      { label: 'Implementación tecnológica', href: '/servicios/implementacion-de-infraestructura' },
      { label: 'Sistemas y aplicaciones', href: '/sistemas' },
      { label: 'Consultoría TI', href: '/sistemas/consultoria-y-proyectos-personalizados' },
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

function isActiveLink(href: string, pathname: string | null): boolean {
  if (!pathname || href.includes('?')) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function FooterNavColumn({
  column,
  panelId,
  pathname,
}: {
  column: FooterColumn
  panelId: string
  pathname: string | null
}) {
  const hasActiveLink = column.links.some((link) => isActiveLink(link.href, pathname))
  const [open, setOpen] = useState(hasActiveLink)

  useEffect(() => {
    if (hasActiveLink) setOpen(true)
  }, [hasActiveLink])

  return (
    <div className="flex flex-col">
      <h2 className="hidden font-heading text-[13px] font-bold uppercase tracking-[0.12em] text-[#F8FAFC] sm:block">
        {column.title}
      </h2>

      {/* En móvil cada columna se despliega para no alargar el footer. */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-sm py-4 text-left sm:hidden ${FOCUS_STYLE}`}
      >
        <span className="font-heading text-[13px] font-bold uppercase tracking-[0.12em] text-[#F8FAFC]">
          {column.title}
        </span>
        <span className="flex items-center gap-2">
          {hasActiveLink && (
            <span className="size-1.5 rounded-full bg-[#38BDF8]" aria-hidden="true" />
          )}
          <ChevronDown
            className={cn(
              'size-4 shrink-0 text-[#64748B] transition-transform duration-300 motion-reduce:transition-none',
              open && 'rotate-180'
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      <ul
        id={panelId}
        className={cn(
          'text-sm sm:mt-4 sm:block sm:space-y-2.5',
          open ? 'block pb-4' : 'hidden'
        )}
      >
        {column.links.map((link) => {
          const active = isActiveLink(link.href, pathname)
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-11 items-center rounded-sm transition-colors duration-200 motion-reduce:transition-none sm:inline-block sm:min-h-0',
                  FOCUS_STYLE,
                  active
                    ? 'font-semibold text-white'
                    : 'text-[#94A3B8] hover:text-[#38BDF8]'
                )}
              >
                {active && (
                  <span
                    className="absolute -left-3 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#38BDF8]"
                    aria-hidden="true"
                  />
                )}
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  return (
    <footer
      className="border-t border-[#1E293B]/80 bg-[#0B132B] text-[#94A3B8] selection:bg-[#2563EB]/25 selection:text-white"
      aria-label="Pie de página"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* ─── A. Cabecera del Footer: Logotipo oficial & Redes Sociales ─── */}
        <div className="flex flex-col gap-5 pb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-10 border-b border-[#1E293B]/80">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {/* Logotipo F&J Systems */}
            <Link
              href="/"
              className={`group inline-flex items-center gap-3 ${FOCUS_STYLE} rounded-lg`}
              aria-label="F&J Systems · Inicio"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logos/logo.png"
                alt="F&J Systems"
                className="h-16 w-auto object-contain brightness-0 invert transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none sm:h-20"
              />
            </Link>

            {/* RUC de la empresa, junto al logotipo */}
            <div
              className="flex items-center gap-2.5 rounded-full border border-[#1E293B] bg-[#0F172A]/60 px-3 py-1.5 sm:rounded-none sm:border-0 sm:border-l sm:bg-transparent sm:px-0 sm:py-0 sm:pl-6"
              aria-label="RUC de la empresa"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
                RUC
              </span>
              <span className="text-sm font-semibold tracking-wide text-[#E2E8F0] tabular-nums">
                {EMPRESA.ruc}
              </span>
            </div>
          </div>

          {/* Redes Sociales: botones circulares discretos */}
          {SOCIAL_NETWORKS.length > 0 && (
            <div className="flex items-center gap-3" aria-label="Redes sociales oficiales">
              {SOCIAL_NETWORKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`grid size-11 place-items-center rounded-full border border-[#1E293B] bg-[#0F172A]/70 text-[#94A3B8] transition duration-200 hover:border-[#2563EB]/60 hover:bg-[#1E293B] hover:text-white motion-reduce:transition-none ${FOCUS_STYLE}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
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

        {/* ─── B. Navegación Principal: desplegable en móvil, columnas en escritorio ─── */}
        <nav
          aria-label="Navegación del pie de página"
          className="divide-y divide-[#1E293B]/70 sm:grid sm:grid-cols-2 sm:gap-8 sm:divide-y-0 sm:py-10 lg:grid-cols-4 lg:gap-10"
        >
          {FOOTER_COLUMNS.map((column, index) => (
            <FooterNavColumn
              key={column.title}
              column={column}
              panelId={`footer-nav-${index}`}
              pathname={pathname}
            />
          ))}
        </nav>

        {/* ─── C & D. Separador y Franja Legal Inferior ─── */}
        <div className="border-t border-[#1E293B]/80 pt-6 sm:pt-8">
          <div className="flex flex-col gap-4 text-xs text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[#94A3B8]">
              &copy; {currentYear} F&J Systems. Todos los derechos reservados.
            </p>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
              {[
                { label: 'Términos y condiciones', href: '/terminos-y-condiciones' },
                { label: 'Política de privacidad', href: '/politica-de-privacidad' },
                { label: 'Información legal', href: '/informacion-legal' },
              ].map((item) => {
                const active = isActiveLink(item.href, pathname)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-flex min-h-9 items-center rounded-sm py-1 transition-colors duration-200 motion-reduce:transition-none sm:min-h-0 sm:py-0',
                        FOCUS_STYLE,
                        active
                          ? 'font-semibold text-white underline decoration-[#38BDF8] decoration-2 underline-offset-4'
                          : 'hover:text-[#CBD5E1]'
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
