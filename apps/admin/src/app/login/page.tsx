import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { FileSpreadsheet, Globe, History, LifeBuoy, Package, ShieldCheck } from 'lucide-react'
import { localAdminEmail, localAdminPassword } from '@/lib/auth/local-admin'
import { getSessionUser } from '@/lib/auth/session'
import { LoginForm } from './login-form'
import { LoginTypewriter } from './login-typewriter'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Acceso restringido al panel de administración de F&J Systems.',
}

const HIGHLIGHTS = [
  { icon: Package, label: 'Inventario y movimientos', short: 'Inventario' },
  { icon: Globe, label: 'Proyectos web y despliegues', short: 'Proyectos web' },
  { icon: LifeBuoy, label: 'Solicitudes y mesa de ayuda', short: 'Mesa de ayuda' },
]

const EXTRAS = [
  { icon: ShieldCheck, label: 'Roles y permisos' },
  { icon: FileSpreadsheet, label: 'Exportaciones' },
  { icon: History, label: 'Actividad reciente' },
]

export default async function LoginPage() {
  const user = await getSessionUser()
  if (user) redirect('/')

  // Acceso de demostración: visible también en el sitio publicado para poder
  // entrar al panel sin cuenta propia. La contraseña solo se muestra cuando la
  // cuenta base la tiene configurada.
  const demo = {
    email: localAdminEmail(),
    password: localAdminPassword(),
  }

  return (
    <main className="relative min-h-dvh bg-[#F4F6FB] lg:grid lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
      {/* Panel de marca */}
      <section className="login-brand relative hidden overflow-hidden bg-[#2E1065] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div aria-hidden="true" className="login-sheen" />
        <div aria-hidden="true" className="login-orb login-orb--purple" />
        <div aria-hidden="true" className="login-orb login-orb--blue" />
        <div aria-hidden="true" className="login-orb login-orb--cyan" />
        <div aria-hidden="true" className="login-grid" />
        <div aria-hidden="true" className="login-ring login-ring--lg" />
        <div aria-hidden="true" className="login-ring login-ring--sm" />

        <div className="relative z-10 flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="F&J Systems"
            className="h-20 w-auto object-contain brightness-0 invert xl:h-24"
          />
          <span className="hidden items-center gap-3 xl:inline-flex">
            <span className="h-px w-7 bg-[#22D3EE]/60" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase leading-relaxed tracking-[0.24em] text-white/55">
              Panel de
              <br />
              administración
            </span>
          </span>
        </div>

        <div className="login-brand-copy relative z-10 max-w-[30rem] py-10 xl:py-12">
          <h2 className="login-brand-heading mt-6 text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.06] tracking-tight">
            Toda tu operación,
            <span className="mt-1 block bg-gradient-to-r from-white via-[#DDD6FE] to-[#22D3EE] bg-clip-text text-transparent">
              en un solo lugar.
            </span>
          </h2>

          <p className="login-brand-lead mt-5 max-w-[26rem] text-[13.5px] leading-relaxed text-white/60">
            Gestiona el inventario, los proyectos web y la mesa de ayuda de F&J Systems desde un
            panel único, seguro y siempre disponible.
          </p>

          <LoginTypewriter />

          <ul className="login-brand-highlights mt-7 space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-[12.5px] text-white/75">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-[#A5F3FC]">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div className="login-brand-extras mt-6 flex flex-wrap gap-2">
            {EXTRAS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10.5px] font-medium text-white/55"
              >
                <Icon className="size-3 text-[#22D3EE]" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 text-[10.5px] text-white/40">
          <p>© 2026 F&J Systems · Uso interno</p>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#22D3EE]/80" />
            Entorno local
          </span>
        </div>
      </section>

      {/* Formulario */}
      <section className="login-form-shell relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8 sm:px-8 sm:py-10 lg:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="login-mobile-bg lg:hidden">
            <div className="login-mobile-sheen" />
            <div className="login-mobile-orb login-mobile-orb--purple" />
            <div className="login-mobile-orb login-mobile-orb--cyan" />
            <div className="login-mobile-grid" />
          </div>
          <div className="login-light-orb login-light-orb--purple" />
          <div className="login-light-orb login-light-orb--cyan" />
          <div className="login-light-grid hidden lg:block" />
        </div>

        <div className="relative w-full max-w-[430px]">
          <div className="login-mobile-brand mb-6 flex flex-col items-center text-center sm:mb-7 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="F&J Systems"
              className="h-16 w-auto object-contain brightness-0 invert drop-shadow-[0_12px_32px_rgba(0,0,0,0.35)] sm:h-20"
            />
            <div className="mt-4 flex w-full items-center justify-center gap-3">
              <span className="h-px w-8 bg-white/25" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">
                Panel de administración
              </p>
              <span className="h-px w-8 bg-white/25" aria-hidden="true" />
            </div>
            <p className="mt-3 text-[15px] font-semibold tracking-tight text-white">
              Toda tu operación, <span className="text-[#A5F3FC]">en un solo lugar.</span>
            </p>
            <ul className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              {HIGHLIGHTS.map(({ icon: Icon, short }) => (
                <li
                  key={short}
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10.5px] font-medium text-white/80 backdrop-blur-sm"
                >
                  <Icon className="size-3 text-[#A5F3FC]" aria-hidden="true" />
                  {short}
                </li>
              ))}
            </ul>
          </div>

          <div className="login-card rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_30px_80px_-40px_rgba(46,16,101,0.45)] backdrop-blur-sm min-[400px]:p-6 sm:p-8">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Inicia sesión</h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              Ingresa con tu cuenta corporativa para acceder al panel.
            </p>

            <LoginForm demo={demo} />
          </div>

          <div className="login-aside-note mt-5 flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-white/70 px-3.5 py-3 text-[11px] leading-relaxed text-slate-500 backdrop-blur-sm">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <p>
              No hay registro público: el superadministrador crea cada cuenta y su contraseña se
              valida en el servidor, nunca en el navegador.
            </p>
          </div>

          <p className="mt-6 text-center text-[10.5px] text-slate-400 lg:hidden">
            © 2026 F&J Systems · Uso interno
          </p>
        </div>
      </section>
    </main>
  )
}
