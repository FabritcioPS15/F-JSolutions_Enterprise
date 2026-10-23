'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Mail, MapPin, Phone, Send } from 'lucide-react'

const columns = [
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre FJ Tech', href: '/servicios' },
      { label: 'Servicios TI', href: '/servicios' },
      { label: 'Desarrollo de sistemas', href: '/sistemas' },
      { label: 'Trabaja con nosotros', href: '/#contacto' },
    ],
  },
  {
    title: 'Soluciones',
    links: [
      { label: 'Catálogo de productos', href: '/productos' },
      { label: 'Soporte TI', href: '/soporte-ti' },
      { label: 'Redes y servidores', href: '/servicios' },
      { label: 'Cotizador de equipos', href: '/cotizador' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Contacto y ventas', href: '/#contacto' },
      { label: 'Garantías y devoluciones', href: '/servicios' },
      { label: 'Despachos y entregas', href: '/servicios' },
      { label: 'Preguntas frecuentes', href: '/servicios#faq' },
    ],
  },
]

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    window.setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="border-t border-[#E2E8F0] bg-white text-[#475569]">
      <div className="border-b border-[#E2E8F0]">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#0E7490]">
              Estemos en contacto
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              Recibe ofertas, guías y novedades tecnológicas.
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#475569]">
              Un correo al mes con recomendaciones de equipos, promociones exclusivas y consejos
              para mantener tu operación segura.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex flex-col gap-2 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Correo electrónico</span>
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#475569]" />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@empresa.com"
                className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB] focus:bg-white"
              />
            </label>
            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              {subscribed ? (
                <>
                  <Check className="size-4" /> Suscrito
                </>
              ) : (
                <>
                  Suscribirme <Send className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-[#2563EB] font-heading text-sm font-bold text-white">
              FJ
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight text-[#0F172A]">
              FJ <span className="text-[#2563EB]">TECH</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#475569]">
            Vendemos tecnología, implementamos infraestructura y desarrollamos sistemas para
            empresas que quieren crecer con orden.
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <a href="tel:+51999888777" className="flex items-center gap-2 hover:text-[#0F172A]">
              <Phone className="size-4 text-[#0E7490]" /> +51 999 888 777
            </a>
            <a
              href="mailto:ventas@fjsolutions.pe"
              className="flex items-center gap-2 hover:text-[#0F172A]"
            >
              <Mail className="size-4 text-[#0E7490]" /> ventas@fjsolutions.pe
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-[#0E7490]" /> Av. Javier Prado Este, Lima
            </span>
          </div>
          <div className="mt-5 flex gap-2">
            <SocialIcon label="Facebook" href="#">
              <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9.8c0-.4.4-.8 1-.8z" />
            </SocialIcon>
            <SocialIcon label="Instagram" href="#">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
            </SocialIcon>
            <SocialIcon label="LinkedIn" href="#">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M7 10v7M7 7v.2M11 17v-4c0-1.4 1-2.3 2.3-2.3S15.5 11.6 15.5 13v4" />
            </SocialIcon>
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="font-heading text-sm font-bold text-[#0F172A]">{column.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#475569] transition hover:text-[#0F172A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E2E8F0]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-6 text-xs text-[#475569] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} FJ Tech Solutions. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/servicios" className="hover:text-[#475569]">
              Términos y condiciones
            </Link>
            <Link href="/servicios" className="hover:text-[#475569]">
              Política de privacidad
            </Link>
            <span className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] px-3 py-1 font-semibold text-[#475569]">
              Visa · Mastercard · Yape · Plin <ArrowRight className="size-3" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-[#E2E8F0] text-[#475569] transition hover:border-[#2563EB]/50 hover:bg-[#F8FAFC] hover:text-[#0F172A]"
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

