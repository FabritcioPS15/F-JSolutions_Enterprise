import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { EMPRESA } from '@/lib/constants'

// ─── Navegación del footer (enlaces reales del sitio) ──────────────────────────

const productLinks = [
  { label: 'Catálogo de productos', href: '/productos' },
  { label: 'PC y Servidores', href: '/productos?categoria=PC y Servidores' },
  { label: 'Laptops', href: '/productos?categoria=Laptops' },
  { label: 'Componentes', href: '/productos?categoria=Componentes' },
  { label: 'Monitores', href: '/productos?categoria=Monitores' },
]

const serviceLinks = [
  { label: 'Servicios TI', href: '/servicios' },
  { label: 'Soporte Técnico', href: '/soporte-ti' },
  { label: 'Infraestructura TI', href: '/servicios' },
  { label: 'Desarrollo de Software', href: '/sistemas' },
  { label: 'Cotización', href: '/cotizacion' },
]

const companyLinks = [
  { label: 'Sobre nosotros', href: '/nosotros' },
  { label: 'Proyectos y experiencia', href: '/nosotros#proyectos' },
  { label: 'Cómo trabajamos', href: '/nosotros#metodologia' },
  { label: 'Contacto', href: '/contacto' },
]

const supportLinks = [
  { label: 'Contacto y ventas', href: '/contacto' },
  { label: 'Preguntas frecuentes', href: '/nosotros#faq' },
  { label: 'Atención empresarial', href: '/servicios' },
]

const linkColumns = [
  { title: 'Productos', links: productLinks },
  { title: 'Servicios', links: serviceLinks },
  { title: 'Empresa', links: companyLinks },
  { title: 'Soporte al cliente', links: supportLinks },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: EMPRESA.redesSociales.facebook,
    path: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
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
    label: 'WhatsApp',
    href: EMPRESA.redesSociales.whatsapp,
    path: (
      <>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
        <path d="M9.4 8.9c.2-.5.9-.5 1.1-.1l.9 1.6c.1.3 0 .5-.1.7l-.6.6c.4 1.2 1.4 2.2 2.6 2.6l.6-.6c.2-.1.5-.2.7-.1l1.6.9c.4.2.4.9-.1 1.1-1.4.7-3 .3-4.7-.8a7.6 7.6 0 0 1-2.8-2.8c-1.1-1.7-1.5-3.3-.8-4.7z" />
      </>
    ),
  },
]

// ─── Look fijo (independiente del tema) ────────────────────────────────────────
// Paleta existente del proyecto:
//   fondo  → --midnight-navy  #0B1220
//   títulos→ --cloud-white    #F8FAFC
//   texto  → slate            #94A3B8 / #CBD5E1
//   acento → --tech-blue      #2563EB / #3B82F6

const FOCUS =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]'

// ─── Componentes de apoyo ──────────────────────────────────────────────────────

function FooterLink({
  href,
  className = '',
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={`inline-block text-[#CBD5E1] transition-colors hover:text-[#3B82F6] ${FOCUS} ${className}`}>
      {children}
    </Link>
  )
}

function SocialIcon({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`grid size-9 place-items-center rounded-lg border border-white/10 text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:bg-white/5 hover:text-white ${FOCUS}`}
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
        {children}
      </svg>
    </a>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-[#0B1220] text-[#94A3B8]">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          {/* Columna de identidad corporativa */}
          <div className="lg:col-span-4">
            <Link href="/" className={`inline-flex items-center gap-2.5 ${FOCUS}`} aria-label="FJ Solutions · Inicio">
              <span className="grid size-10 place-items-center rounded-xl bg-[#2563EB] font-heading text-sm font-bold tracking-tight text-white shadow-md shadow-[#2563EB]/30">
                FJ
              </span>
              <span className="font-heading text-xl font-bold tracking-[-0.04em] text-[#F8FAFC]">
                FJ <span className="text-[#3B82F6]">Solutions</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#94A3B8]">
              Vendemos tecnología, implementamos infraestructura TI y desarrollamos sistemas para
              empresas que buscan soluciones tecnológicas confiables y eficaces.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href="tel:+51999888777"
                  className={`flex items-center gap-2.5 text-[#94A3B8] transition-colors hover:text-[#3B82F6] ${FOCUS}`}
                >
                  <Phone className="size-4 shrink-0" />
                  <span className="min-w-0 break-words">+51 999 888 777</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:ventas@fjsolutions.pe"
                  className={`flex items-center gap-2.5 text-[#94A3B8] transition-colors hover:text-[#3B82F6] ${FOCUS}`}
                >
                  <Mail className="size-4 shrink-0" />
                  <span className="min-w-0 break-words">ventas@fjsolutions.pe</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span className="min-w-0 break-words">Av. Javier Prado Este, Lima, Perú</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0" />
                <span className="min-w-0 break-words">{EMPRESA.horario}</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {socialLinks.map((social) => (
                <SocialIcon key={social.label} label={social.label} href={social.href}>
                  {social.path}
                </SocialIcon>
              ))}
            </div>
          </div>

          {/* Columnas de navegación */}
          <nav
            aria-label="Enlaces del sitio"
            className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4"
          >
            {linkColumns.map((column) => (
              <div key={column.title}>
                <h3 className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-[#F8FAFC]">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Franja inferior */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 text-xs text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {currentYear} FJ Solutions. Todos los derechos reservados.</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <li>
              <FooterLink href="/nosotros">Términos y condiciones</FooterLink>
            </li>
            <li>
              <FooterLink href="/nosotros">Política de privacidad</FooterLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
