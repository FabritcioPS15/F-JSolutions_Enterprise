import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { getSessionUser } from '@/lib/auth/session'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Acceso restringido al panel de administración de F&J Systems.',
}

export default async function LoginPage() {
  const user = await getSessionUser()
  if (user) redirect('/')

  // Credenciales de desarrollo: el bloque solo se renderiza fuera de producción
  // y refleja los valores del seed cuando están definidos.
  const demo =
    process.env.NODE_ENV !== 'production'
      ? {
          email: process.env.SEED_ADMIN_EMAIL?.trim() || 'admin@fjsolutions.com.pe',
          password: process.env.SEED_ADMIN_PASSWORD || 'Admin12345!',
        }
      : null

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F6FB] px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(91,33,182,0.10),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(37,99,235,0.08),transparent_40%)]"
      />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="F&J Systems" className="h-12 w-auto object-contain" />
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
            Panel de administración
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Inicia sesión</h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
            Ingresa con tu cuenta corporativa para acceder al panel.
          </p>

          <LoginForm demo={demo} />
        </div>

        <div className="mt-6 flex items-start gap-2.5 px-1 text-[11px] leading-relaxed text-slate-500">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          <p>
            El acceso está restringido a usuarios activos autorizados. Si tu cuenta tiene la
            verificación en dos pasos activa, se pedirá un código adicional después de la
            contraseña. Las credenciales nunca se almacenan en el navegador.
          </p>
        </div>

        <p className="mt-6 text-center text-[10.5px] text-slate-400">
          © 2026 F&J Systems · Uso interno
        </p>
      </div>
    </main>
  )
}
