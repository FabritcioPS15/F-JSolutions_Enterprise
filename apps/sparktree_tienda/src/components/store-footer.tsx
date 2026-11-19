'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { COMPANY, corporateUrl } from '@/lib/store-nav'
import { cn } from '@/lib/utils'

type StoreCategory = { value: string; label: string }

type FooterLink = { label: string; href: string }

type FooterColumn = { title: string; links: FooterLink[] }

const FEATURED_LABELS = [
  'PC y Servidores',
  'Laptops',
  'Componentes',
  'Monitores',
  'Redes',
  'Almacenamiento',
  'Accesorios',
  'Impresoras',
]

const CORPORATE_COLUMNS: FooterColumn[] = [
  {
    title: 'Servicios tecnológicos',
    links: [
      { label: 'Soporte técnico', href: corporateUrl('/servicios/soporte-tecnico') },
      { label: 'Soporte para empresas', href: corporateUrl('/servicios/soporte-empresarial') },
      { label: 'Infraestructura TI', href: corporateUrl('/infraestructura-ti') },
      { label: 'Redes y conectividad', href: corporateUrl('/servicios/redes-y-conectividad') },
      { label: 'Cableado estructurado', href: corporateUrl('/servicios/cableado-estructurado') },
      { label: 'Mantenimiento de equipos', href: corporateUrl('/servicios/mantenimiento-de-equipos') },
      { label: 'Sistemas web a medida', href: corporateUrl('/sistemas/sistemas-web-a-medida') },
      { label: 'Creación de páginas web', href: corporateUrl('/sistemas/creacion-de-paginas-web') },
      { label: 'Automatización de procesos', href: corporateUrl('/sistemas/automatizacion-de-procesos') },
    ],
  },
  {
    title: 'Soluciones empresariales',
    links: [
      { label: 'Soluciones para empresas', href: corporateUrl('/nosotros') },
      { label: 'Proyectos tecnológicos', href: corporateUrl('/proyectos') },
      { label: 'Sistemas y aplicaciones', href: corporateUrl('/sistemas') },
      { label: 'Consultoría TI', href: corporateUrl('/sistemas/consultoria-y-proyectos-personalizados') },
      { label: 'Cómo trabajamos', href: corporateUrl('/como-trabajamos') },
    ],
  },
  {
    title: 'Atención y cotizaciones',
    links: [
      { label: 'Solicitar cotización', href: corporateUrl('/cotizacion') },
      { label: 'Mi cuenta', href: corporateUrl('/mi-cuenta') },
      { label: 'Contacto', href: corporateUrl('/contacto') },
      { label: 'Preguntas frecuentes', href: corporateUrl('/preguntas-frecuentes') },
      { label: 'Libro de reclamaciones', href: corporateUrl('/libro-de-reclamaciones') },
      { label: 'Web corporativa', href: corporateUrl('/') },
    ],
  },
]

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Términos y condiciones', href: corporateUrl('/terminos-y-condiciones') },
  { label: 'Política de privacidad', href: corporateUrl('/politica-de-privacidad') },
  { label: 'Información legal', href: corporateUrl('/informacion-legal') },
  { label: 'Libro de reclamaciones', href: corporateUrl('/libro-de-reclamaciones') },
]

const SOCIAL_PATHS: Record<string, React.ReactNode> = {
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
      <path d="M9.4 8.9c.2-.5.9-.5 1.1-.1l.9 1.6c.1.3 0 .5-.1.7l-.6.6c.4 1.2 1.4 2.2 2.6 2.6l.6-.6c.2-.1.5-.2.7-.1l1.6.9c.4.2.4.9-.1 1.1-1.4.7-3 .3-4.7-.8a7.6 7.6 0 0 1-2.8-2.8c-1.1-1.7-1.5-3.3-.8-4.7z" />
    </>
  ),
}

const FOCUS_STYLE =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#172554]'

function isInternal(href: string) {
  return href.startsWith('/')
}

function isActiveLink(href: string, pathname: string | null): boolean {
  if (!pathname || !isInternal(href) || href.includes('?')) return false
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
            <span className="size-1.5 rounded-full bg-[#93C5FD]" aria-hidden="true" />
          )}
          <ChevronDown
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none',
              open && 'rotate-180'
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      <ul
        id={panelId}
        className={cn('text-sm sm:mt-4 sm:block sm:space-y-2.5', open ? 'block pb-4' : 'hidden')}
      >
        {column.links.map((link) => {
          const active = isActiveLink(link.href, pathname)
          const className = cn(
            'relative flex min-h-11 items-center rounded-sm transition-colors duration-200 motion-reduce:transition-none sm:inline-block sm:min-h-0',
            FOCUS_STYLE,
            active ? 'font-semibold text-white' : 'text-muted-foreground hover:text-[#93C5FD]'
          )

          return (
            <li key={`${column.title}-${link.label}`}>
              {isInternal(link.href) ? (
                <Link href={link.href} aria-current={active ? 'page' : undefined} className={className}>
                  {active && (
                    <span
                      className="absolute -left-3 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#93C5FD]"
                      aria-hidden="true"
                    />
                  )}
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className={className}>
                  {link.label}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function StoreFooter({ categories }: { categories: StoreCategory[] }) {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  const featured = categories
    .filter((category) =>
      FEATURED_LABELS.some((label) => category.label.toLowerCase().startsWith(label.toLowerCase()))
    )
    .slice(0, FEATURED_LABELS.length)

  const columns: FooterColumn[] = [
    {
      title: 'Tienda de equipos TI',
      links: [
        ...featured.map((category) => ({
          label: category.label,
          href: `/productos?categoria=${encodeURIComponent(category.value)}`,
        })),
        { label: 'Búsqueda de productos', href: '/buscar' },
        { label: 'Ver toda la tienda', href: '/productos' },
      ],
    },
    ...CORPORATE_COLUMNS,
  ]

  return (
    <footer
      data-surface="dark"
      className="border-t border-white/10 bg-gradient-to-b from-[#172554] via-[#14244c] to-[#0f1a33] text-muted-foreground selection:bg-[#2563EB]/30 selection:text-white"
      aria-label="Pie de página"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/"
              className={`group inline-flex items-center gap-3 rounded-lg ${FOCUS_STYLE}`}
              aria-label="SparkTree Store · Inicio"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/sparktree-horizontal.png"
                alt="SparkTree Store"
                className="h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none sm:h-20"
              />
            </Link>

            <div
              className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 sm:rounded-none sm:border-0 sm:border-l sm:bg-transparent sm:px-0 sm:py-0 sm:pl-6"
              aria-label="RUC de la empresa"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                RUC
              </span>
              <span className="text-sm font-semibold tracking-wide text-[#F8FAFC] tabular-nums">
                {COMPANY.ruc}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3" aria-label="Redes sociales oficiales">
            {COMPANY.socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-muted-foreground transition duration-200 hover:border-[#93C5FD]/60 hover:bg-[#2563EB]/25 hover:text-white motion-reduce:transition-none ${FOCUS_STYLE}`}
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
                  {SOCIAL_PATHS[social.id]}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <nav
          aria-label="Navegación del pie de página"
          className="divide-y divide-white/10 sm:grid sm:grid-cols-2 sm:gap-8 sm:divide-y-0 sm:py-10 lg:grid-cols-4 lg:gap-10"
        >
          {columns.map((column, index) => (
            <FooterNavColumn
              key={column.title}
              column={column}
              panelId={`store-footer-nav-${index}`}
              pathname={pathname}
            />
          ))}
        </nav>

        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {currentYear} SparkTree Store. Todos los derechos reservados.</p>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`inline-flex min-h-9 items-center rounded-sm py-1 transition-colors duration-200 hover:text-white motion-reduce:transition-none sm:min-h-0 sm:py-0 ${FOCUS_STYLE}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
