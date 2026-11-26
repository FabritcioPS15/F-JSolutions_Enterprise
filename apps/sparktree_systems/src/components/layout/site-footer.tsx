'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { EMPRESA, EMPRESA_RUC } from '@/lib/constants'
import { ACADEMY_APP_URL, STORE_APP_URL, STUDIO_URL } from '@/lib/ecosystem'
import { cn } from '@/lib/utils'

interface FooterNavLink {
  label: string
  href: string
  external?: boolean
}

interface FooterColumn {
  title: string
  links: FooterNavLink[]
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Navegación',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Soluciones', href: '/#soluciones' },
      { label: 'Servicios', href: '/servicios' },
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Proyectos', href: '/proyectos' },
      { label: 'Ecosistema', href: '/#ecosistema' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
  {
    title: 'Servicios',
    links: [
      { label: 'Soporte técnico', href: '/servicios/soporte-tecnico' },
      { label: 'Soporte para empresas', href: '/servicios/soporte-empresarial' },
      { label: 'Infraestructura TI', href: '/infraestructura-ti' },
      { label: 'Redes y conectividad', href: '/servicios/redes-y-conectividad' },
      { label: 'Cableado estructurado', href: '/servicios/cableado-estructurado' },
      { label: 'Mantenimiento de equipos', href: '/servicios/mantenimiento-de-equipos' },
      { label: 'Equipamiento empresarial', href: '/servicios/equipamiento-tecnologico-empresarial' },
      { label: 'Software a medida', href: '/sistemas' },
    ],
  },
  {
    title: 'Ecosistema',
    links: [
      { label: 'SparkTree Systems', href: '/#ecosistema' },
      { label: 'SparkTree Studio', href: STUDIO_URL, external: true },
      { label: 'SparkTree Academia', href: ACADEMY_APP_URL, external: true },
      { label: 'SparkTree Store', href: STORE_APP_URL, external: true },
    ],
  },
]

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
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75D7E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1C2E]'

function isActiveLink(href: string, pathname: string | null): boolean {
  if (!pathname || href.includes('?')) return false
  if (href.includes('#')) return false
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
      <h2 className="hidden font-heading text-[12px] font-bold uppercase tracking-[0.14em] text-[#F1F6FA] sm:block">
        {column.title}
      </h2>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border-b border-[#17324A]/70 py-3 text-left sm:hidden ${FOCUS_STYLE}`}
      >
        <span className="font-heading text-[12px] font-bold uppercase tracking-[0.14em] text-[#F1F6FA]">
          {column.title}
        </span>
        <span className="flex items-center gap-2">
          {hasActiveLink && <span className="size-1.5 rounded-full bg-[#75D7E8]" aria-hidden="true" />}
          <ChevronDown
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      <ul
        id={panelId}
        className={cn('text-sm sm:mt-4 sm:block sm:space-y-2', open ? 'block pb-3' : 'hidden')}
      >
        {column.links.map((link) => {
          const active = isActiveLink(link.href, pathname)
          const className = cn(
            'relative flex min-h-11 items-center gap-1.5 rounded-sm transition-colors duration-200 motion-reduce:transition-none sm:inline-flex sm:min-h-0',
            FOCUS_STYLE,
            active ? 'font-semibold text-white' : 'text-muted-foreground hover:text-[#9FE2EF]',
          )
          const inner = (
            <>
              {link.label}
              {link.external && (
                <ExternalLink aria-hidden="true" className="size-3 shrink-0 text-[#75D7E8]/70" />
              )}
            </>
          )

          return (
            <li key={link.label}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={className}
                >
                  {inner}
                </Link>
              )}
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

  if (pathname === '/login' || pathname === '/registro') return null

  return (
    <footer
      data-surface="dark"
      className="border-t border-[#17324A]/80 bg-gradient-to-b from-[#0A1C2E] via-[#102A43] to-[#0C2E4A] text-muted-foreground selection:bg-[#1769AA]/30 selection:text-white"
      aria-label="Pie de página"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid gap-10 border-b border-[#17324A]/80 pb-10 lg:grid-cols-[1.15fr_1.85fr] lg:gap-14">
          {/* Marca, descripción y contacto */}
          <div>
            <Link
              href="/"
              className={`group inline-flex items-center gap-3 rounded-lg ${FOCUS_STYLE}`}
              aria-label="SparkTree Systems · Inicio"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logotipo_SparkTree_Systems.svg"
                alt="SparkTree Systems"
                className="h-20 w-auto object-contain brightness-0 invert transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
              />
            </Link>

            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              Infraestructura TI, soporte gestionado y seguridad tecnológica para empresas que quieren operar con
              orden y crecer con una base sólida.
            </p>

            <div className="mt-5 space-y-2 text-[13px]">
              <div className="flex items-center gap-2.5" aria-label="RUC de la empresa">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">RUC</span>
                <span className="font-semibold tracking-wide text-[#E2E8F0] tabular-nums">{EMPRESA_RUC}</span>
              </div>
              <a
                href={`tel:${EMPRESA.telefono.replace(/\s/g, '')}`}
                className={`flex w-fit items-center gap-2 rounded-sm font-semibold text-[#E2E8F0] transition-colors duration-200 hover:text-[#9FE2EF] motion-reduce:transition-none ${FOCUS_STYLE}`}
              >
                <Phone aria-hidden="true" className="size-3.5 text-[#75D7E8]" />
                {EMPRESA.telefono}
              </a>
              <a
                href={`mailto:${EMPRESA.email}`}
                className={`flex w-fit items-center gap-2 rounded-sm font-semibold text-[#E2E8F0] transition-colors duration-200 hover:text-[#9FE2EF] motion-reduce:transition-none ${FOCUS_STYLE}`}
              >
                <Mail aria-hidden="true" className="size-3.5 text-[#75D7E8]" />
                {EMPRESA.email}
              </a>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin aria-hidden="true" className="size-3.5 text-[#75D7E8]" />
                {EMPRESA.direccion} · {EMPRESA.horario}
              </p>
            </div>

            {SOCIAL_NETWORKS.length > 0 && (
              <div className="mt-5 flex items-center gap-2.5" aria-label="Redes sociales oficiales">
                {SOCIAL_NETWORKS.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`grid size-11 place-items-center rounded-full border border-[#17324A] bg-[#0B2236]/70 text-muted-foreground transition duration-200 hover:border-[#00B8D9]/50 hover:text-white motion-reduce:transition-none sm:size-10 ${FOCUS_STYLE}`}
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

          {/* Columnas de navegación */}
          <nav
            aria-label="Navegación del pie de página"
            className="grid gap-x-8 gap-y-1 sm:grid-cols-3"
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
        </div>

        <div className="pt-6">
          <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {currentYear} SparkTree Systems. Todos los derechos reservados.</p>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
              {[
                { label: 'Términos y condiciones', href: '/terminos-y-condiciones' },
                { label: 'Política de privacidad', href: '/politica-de-privacidad' },
                { label: 'Información legal', href: '/informacion-legal' },
                { label: 'Libro de reclamaciones', href: '/libro-de-reclamaciones' },
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
                          ? 'font-semibold text-white underline decoration-[#00B8D9] decoration-2 underline-offset-4'
                          : 'hover:text-[#9FE2EF]',
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
