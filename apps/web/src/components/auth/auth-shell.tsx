'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

const benefits = [
  'Cotizaciones y favoritos guardados en tu cuenta',
  'Seguimiento de pedidos y solicitudes de soporte',
  'Acceso rápido con Google, Facebook o correo',
]

const copy = {
  login: {
    title: 'Inicia sesión',
    subtitle: 'Tus cotizaciones, favoritos y solicitudes, en un solo lugar.',
  },
  register: {
    title: 'Crea tu cuenta',
    subtitle: 'Confirma tu correo para activar tu cuenta.',
  },
} as const

export function AuthShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isRegister = pathname === '/registro'
  const content = isRegister ? copy.register : copy.login

  return (
    <main className="auth-page text-[#0F172A]">
      <div className={`auth-stage${isRegister ? ' auth-stage--register' : ''}`}>
        <aside className="auth-aside relative flex flex-col overflow-hidden bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#4C1D95] px-5 py-3 text-white sm:px-10 sm:py-7 lg:px-14 lg:py-9">
          <div aria-hidden="true" className="auth-sheen" />
          <div
            aria-hidden="true"
            className="auth-orb auth-orb--a pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#3B82F6]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="auth-orb auth-orb--b pointer-events-none absolute -bottom-28 left-1/4 size-72 rounded-full bg-[#7C3AED]/20 blur-3xl"
          />

          <div className="relative flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex w-fit items-center" aria-label="F&J Systems · Inicio">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logos/logo.png"
                alt="F&J Systems"
                className="h-10 w-auto object-contain brightness-0 invert sm:h-16 lg:h-20"
              />
            </Link>

            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[#CBD5E1] backdrop-blur transition hover:border-white/40 hover:text-white sm:px-3 sm:py-1.5 sm:text-xs"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Volver a la tienda
            </Link>
          </div>

          <div className="relative hidden flex-1 items-center lg:flex">
            <div className="max-w-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7DD3FC]">
                Cuenta de cliente
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Tu operación con F&amp;J Systems en un solo lugar
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#CBD5E1]">
                Crea tu cuenta para guardar tus cotizaciones, tus equipos favoritos y el historial de
                tus solicitudes.
              </p>
              <ul className="mt-6 hidden space-y-2.5 text-sm text-[#E2E8F0] sm:block">
                {benefits.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#7DD3FC]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="relative mt-8 hidden text-[11px] text-[#94A3B8] sm:block">
            © {new Date().getFullYear()} F&amp;J Systems. Todos los derechos reservados.
          </p>
        </aside>

        <section className="auth-panel flex flex-col bg-white px-4 py-3 sm:px-10 sm:py-3">
          <div className="flex flex-1 items-center justify-center py-1.5">
            <div className="w-full max-w-[600px]">
              <div key={pathname} className="auth-content">
                <h1 className="auth-title font-heading text-[22px] font-bold leading-[1.1] tracking-tight sm:text-[34px]">
                  {content.title}
                </h1>
                <span aria-hidden="true" className="auth-title__rule" />
                <p className="mt-2 hidden text-sm leading-6 text-[#64748B] sm:block">
                  {content.subtitle}
                </p>
                <div className="mt-2 sm:mt-5">{children}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
