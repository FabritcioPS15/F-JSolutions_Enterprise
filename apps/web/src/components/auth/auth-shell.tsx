import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

const benefits = [
  'Cotizaciones y favoritos guardados en tu cuenta',
  'Seguimiento de pedidos y solicitudes de soporte',
  'Acceso rápido con Google, Facebook o correo',
]

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <main className="grid min-h-svh bg-white text-[#0F172A] lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative flex flex-col overflow-hidden bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#4C1D95] px-6 py-7 text-white sm:px-10 lg:px-14 lg:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#3B82F6]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/4 size-72 rounded-full bg-[#7C3AED]/20 blur-3xl"
        />

        <Link href="/" className="relative inline-flex w-fit items-center" aria-label="F&J Systems · Inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logos/logo.png"
            alt="F&J Systems"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </Link>

        <div className="relative mt-10 max-w-md lg:mt-auto lg:mb-14">
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

        <p className="relative mt-8 hidden text-[11px] text-[#94A3B8] sm:block">
          © {new Date().getFullYear()} F&amp;J Systems. Todos los derechos reservados.
        </p>
      </aside>

      <section className="flex flex-col bg-white px-5 py-6 sm:px-10 sm:py-8">
        <div className="flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#1D4ED8]"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Volver a la tienda
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-8 sm:py-10">
          <div className="w-full max-w-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#0F172A] sm:text-[32px]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">{subtitle}</p>
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </section>
    </main>
  )
}
