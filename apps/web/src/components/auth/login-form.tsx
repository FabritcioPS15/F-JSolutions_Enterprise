'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  FlaskConical,
  Loader2,
  MailCheck,
} from 'lucide-react'
import { isEmail } from '@fj-solutions/contracts/domain'
import { AuthDivider, OAuthButtons } from './oauth-buttons'

type Availability = { google: boolean; facebook: boolean }
type Notice = { tone: 'success' | 'error'; title: string; message?: string }

const fieldClass =
  'mt-1 h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-normal text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 aria-[invalid=true]:border-[#EF4444]'

const oauthErrorMessages: Record<string, string> = {
  cancelado: 'Cancelaste el acceso con el proveedor. Puedes intentarlo de nuevo.',
  estado: 'La sesión de acceso venció por seguridad. Inténtalo otra vez.',
  'sin-configurar': 'Ese acceso todavía no está habilitado. Usa tu correo y contraseña.',
  bloqueada: 'Esa cuenta está bloqueada. Escríbenos para revisar tu caso.',
  'sin-correo':
    'Tu cuenta del proveedor no comparte un correo. Usa el acceso con correo o revisa la configuración de privacidad.',
  fallo: 'No pudimos completar el acceso con el proveedor. Inténtalo de nuevo.',
  proveedor: 'El proveedor de acceso no es válido.',
}

export function LoginForm({
  next,
  initialEmail,
  notice,
  availability,
  oauthError,
  devAccess,
}: {
  next: string
  initialEmail: string
  notice: Notice | null
  availability: Availability
  oauthError: string | null
  devAccess: boolean
}) {
  const devHref = (kind: 'persona' | 'empresa') =>
    `/api/customer/dev-login?as=${kind}&next=${encodeURIComponent(next)}`

  const router = useRouter()
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'resending'>('idle')
  const [noticeState, setNoticeState] = useState<Notice | null>(
    oauthError
      ? { tone: 'error', title: 'No pudimos continuar', message: oauthErrorMessages[oauthError] }
      : notice
  )
  const [unverified, setUnverified] = useState(false)
  const [resendInfo, setResendInfo] = useState('')
  const [devLink, setDevLink] = useState('')

  const showError = (title: string, message?: string) =>
    setNoticeState({ tone: 'error', title, message })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status !== 'idle') return

    setNoticeState(null)
    setResendInfo('')
    setDevLink('')

    if (!isEmail(email)) return showError('Revisa tu correo', 'Ingresa un correo válido.')
    if (password.length === 0) return showError('Falta la contraseña', 'Escribe tu contraseña.')

    setStatus('sending')
    try {
      const response = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; code?: string }
        | null

      if (!response.ok || !data?.success) {
        if (data?.code === 'unverified') {
          setUnverified(true)
          showError('Confirma tu correo', data.message)
        } else {
          showError('No pudimos iniciar sesión', data?.message)
        }
        return
      }

      router.push(next)
      router.refresh()
    } catch {
      showError('No pudimos iniciar sesión', 'Revisa tu conexión e inténtalo nuevamente.')
    } finally {
      setStatus('idle')
    }
  }

  const handleResend = async () => {
    if (!isEmail(email)) return showError('Revisa tu correo', 'Escribe el correo de tu cuenta.')
    setStatus('resending')
    setResendInfo('')
    try {
      const response = await fetch('/api/customer/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean
            message?: string
            data?: { verificationLink?: string }
          }
        | null

      if (!response.ok || !data?.success) {
        showError('No pudimos reenviar el correo', data?.message)
        return
      }
      setResendInfo(data.message ?? 'Te enviamos un enlace de confirmación.')
      setDevLink(data.data?.verificationLink ?? '')
    } catch {
      showError('No pudimos reenviar el correo', 'Revisa tu conexión e inténtalo nuevamente.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div>
      {noticeState && (
        <div
          role="alert"
          className={`mb-4 flex items-start gap-2.5 rounded-2xl border px-3.5 py-2.5 text-[13px] sm:text-sm ${
            noticeState.tone === 'success'
              ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
              : 'border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]'
          }`}
        >
          {noticeState.tone === 'success' ? (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          )}
          <div>
            <p className="font-semibold">{noticeState.title}</p>
            {noticeState.message && <p className="mt-0.5 text-[13px] leading-5">{noticeState.message}</p>}
          </div>
        </div>
      )}

      <OAuthButtons availability={availability} next={next} />
      <AuthDivider />

      <form onSubmit={handleSubmit} noValidate className="space-y-2.5 sm:space-y-3">
        <label className="block text-xs font-semibold text-[#0F172A]">
          Correo electrónico
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@empresa.com"
            autoComplete="email"
            required
            className={fieldClass}
          />
        </label>

        <label className="block text-xs font-semibold text-[#0F172A]">
          Contraseña
          <span className="relative mt-1 block">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              required
              className={`${fieldClass} mt-0 pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#475569]"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#1D4ED8] disabled:opacity-60"
        >
          {status === 'sending' && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {status === 'sending' ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>

      {devAccess && (
        <details className="group mt-3 rounded-xl border border-dashed border-[#C4B5FD] bg-[#F5F3FF]/70 transition hover:border-[#A78BFA]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5 text-[12px] font-bold text-[#5B21B6] [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1.5">
              <FlaskConical aria-hidden="true" className="size-3.5" />
              Accesos de desarrollo
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-3.5 transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="border-t border-dashed border-[#DDD6FE] px-3.5 py-3">
            <p className="text-[11px] leading-4 text-[#6D28D9]">
              Solo en entorno local. Entra con una cuenta de prueba ya confirmada.
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <a
                href={devHref('persona')}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-[#C4B5FD] bg-white px-2 text-xs font-bold text-[#5B21B6] transition hover:border-[#7C3AED] hover:bg-[#EDE9FE]"
              >
                Persona natural
              </a>
              <a
                href={devHref('empresa')}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-[#C4B5FD] bg-white px-2 text-xs font-bold text-[#5B21B6] transition hover:border-[#7C3AED] hover:bg-[#EDE9FE]"
              >
                Empresa
              </a>
            </div>
          </div>
        </details>
      )}

      {unverified && (
        <div className="mt-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
            <MailCheck aria-hidden="true" className="size-4 text-[#2563EB]" />
            ¿No recibiste el correo de confirmación?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={status === 'resending'}
            className="mt-2 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-bold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:text-[#1D4ED8] disabled:opacity-60"
          >
            {status === 'resending' && <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />}
            Reenviar enlace de confirmación
          </button>
        </div>
      )}

      {resendInfo && (
        <div className="mt-3 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-3.5 py-2.5 text-[13px] text-[#166534]">
          <p className="font-semibold">{resendInfo}</p>
          {devLink && (
            <p className="mt-1 break-all">
              Modo local:{' '}
              <a href={devLink} className="font-semibold underline underline-offset-2">
                abrir el enlace de confirmación
              </a>
            </p>
          )}
        </div>
      )}

      <p className="mt-2.5 text-center text-[13px] text-[#64748B] sm:mt-4 sm:text-sm">
        ¿Todavía no tienes cuenta?{' '}
        <Link href="/registro" className="font-semibold text-[#2563EB] hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
