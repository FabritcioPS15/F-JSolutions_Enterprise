'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  ChevronUp,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
  RefreshCw,
} from 'lucide-react'
import type { TwoFactorMethod } from '@/lib/auth/types'

type ApiResponse = {
  success?: boolean
  message?: string
  data?: {
    requiresTwoFactor?: boolean
    method?: TwoFactorMethod
    email?: string
  }
}

type DemoCredentials = {
  email: string
  password: string
}

type Challenge = {
  method: TwoFactorMethod
  email: string
}

const RESEND_COOLDOWN_SECONDS = 30

export function LoginForm({ demo }: { demo?: DemoCredentials | null }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [code, setCode] = useState('')
  const [useRecoveryCode, setUseRecoveryCode] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [demoOpen, setDemoOpen] = useState(false)
  const demoRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = window.setInterval(() => {
      setResendIn((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [resendIn])

  useEffect(() => {
    if (!demoOpen) return

    function onPointerDown(event: PointerEvent) {
      if (!demoRef.current?.contains(event.target as Node)) setDemoOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setDemoOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [demoOpen])

  function resetToCredentials() {
    setChallenge(null)
    setCode('')
    setUseRecoveryCode(false)
    setResendIn(0)
    setError(null)
    setInfo(null)
    setPassword('')
  }

  function applyDemoCredentials() {
    if (!demo) return
    setEmail(demo.email)
    setPassword(demo.password)
    setError(null)
    setDemoOpen(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setError(null)
    setInfo(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const body = (await response.json().catch(() => null)) as ApiResponse | null

      if (!response.ok || !body?.success) {
        setError(body?.message ?? 'No se pudo iniciar sesión. Inténtalo nuevamente.')
        return
      }

      if (body.data?.requiresTwoFactor && body.data.method) {
        setChallenge({
          method: body.data.method,
          email: body.data.email ?? '',
        })
        setCode('')
        setUseRecoveryCode(false)
        setPassword('')
        setResendIn(body.data.method === 'EMAIL' ? RESEND_COOLDOWN_SECONDS : 0)
        return
      }

      router.replace('/')
      router.refresh()
    } catch {
      setError('No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading || !challenge) return

    const value = code.trim()
    if (useRecoveryCode) {
      if (value.replace(/[^a-z0-9]/gi, '').length < 8) {
        setError('Ingresa un código de recuperación válido.')
        return
      }
    } else if (!/^\d{6}$/.test(value)) {
      setError('El código debe tener 6 dígitos.')
      return
    }

    setLoading(true)
    setError(null)
    setInfo(null)

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          useRecoveryCode ? { recoveryCode: value } : { code: value }
        ),
      })

      const body = (await response.json().catch(() => null)) as ApiResponse | null

      if (!response.ok || !body?.success) {
        setError(body?.message ?? 'No se pudo verificar el código. Inténtalo nuevamente.')
        return
      }

      router.replace('/')
      router.refresh()
    } catch {
      setError('No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (loading || resendIn > 0) return

    setLoading(true)
    setError(null)
    setInfo(null)

    try {
      const response = await fetch('/api/auth/2fa/resend', { method: 'POST' })
      const body = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; data?: { email?: string; delivered?: boolean } }
        | null

      if (!response.ok || !body?.success) {
        setError(body?.message ?? 'No se pudo reenviar el código.')
        return
      }

      setResendIn(RESEND_COOLDOWN_SECONDS)
      setInfo(
        body.data?.delivered === false
          ? 'El correo no pudo confirmarse. Si estás en desarrollo, revisa la consola de la API o usa un código de recuperación.'
          : `Enviamos un nuevo código a ${body.data?.email || challenge?.email || 'tu correo'}.`
      )
    } catch {
      setError('No se pudo conectar con el servidor. Inténtalo nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (challenge) {
    const methodLabel =
      challenge.method === 'TOTP'
        ? 'Abre tu aplicación de autenticación y escribe el código de 6 dígitos.'
        : `Enviamos un código de 6 dígitos a ${challenge.email || 'tu correo electrónico'}.`

    return (
      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-white text-[#5B21B6] ring-1 ring-slate-200">
            {challenge.method === 'TOTP' ? (
              <KeyRound className="size-4" aria-hidden="true" />
            ) : (
              <Mail className="size-4" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              Verificación en dos pasos
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{methodLabel}</p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[12px] leading-relaxed text-red-700"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        {info && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[12px] leading-relaxed text-emerald-800">
            {info}
          </div>
        )}

        <form onSubmit={handleVerify} className="login-form space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="code"
              className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500"
            >
              {useRecoveryCode ? 'Código de recuperación' : 'Código de verificación'}
            </label>
            <input
              id="code"
              name="code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value)
                if (error) setError(null)
              }}
              inputMode={useRecoveryCode ? 'text' : 'numeric'}
              autoComplete="one-time-code"
              autoFocus
              maxLength={useRecoveryCode ? 20 : 6}
              placeholder={useRecoveryCode ? 'XXXX-XXXX' : '000000'}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-center font-mono text-lg tracking-[0.4em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2E1065] text-[13px] font-semibold text-white transition hover:bg-[#3B0764] focus:outline-none focus:ring-4 focus:ring-[#5B21B6]/25 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Verificando…
              </>
            ) : (
              <>
                <KeyRound className="size-4" aria-hidden="true" />
                Verificar y entrar
              </>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px]">
          <button
            type="button"
            onClick={resetToCredentials}
            disabled={loading}
            className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-slate-800 disabled:opacity-50"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Volver
          </button>

          <div className="flex items-center gap-3">
            {challenge.method === 'EMAIL' && !useRecoveryCode && (
              <button
                type="button"
                onClick={() => void handleResend()}
                disabled={loading || resendIn > 0}
                className="inline-flex items-center gap-1.5 font-semibold text-[#5B21B6] transition hover:text-[#4C1D95] disabled:cursor-not-allowed disabled:text-slate-400"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                {resendIn > 0 ? `Reenviar en ${resendIn} s` : 'Reenviar código'}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setUseRecoveryCode((value) => !value)
                setCode('')
                setError(null)
                setInfo(null)
              }}
              className="font-medium text-slate-500 underline-offset-2 transition hover:text-slate-800 hover:underline"
            >
              {useRecoveryCode ? 'Usar código de la app' : 'Usar código de recuperación'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="login-form mt-6 space-y-4" noValidate>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[12px] leading-relaxed text-red-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nombre@fjsolutions.pe"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[16px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10 sm:h-10 sm:text-[13px]"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu contraseña"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 text-[16px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10 sm:h-10 sm:text-[13px]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2E1065] text-[13px] font-semibold text-white transition hover:bg-[#3B0764] focus:outline-none focus:ring-4 focus:ring-[#5B21B6]/25 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Verificando…
          </>
        ) : (
          <>
            <LogIn className="size-4" aria-hidden="true" />
            Entrar al panel
          </>
        )}
      </button>

      {demo && (
        <div ref={demoRef} className="relative">
          <button
            type="button"
            onClick={() => setDemoOpen((value) => !value)}
            aria-expanded={demoOpen}
            aria-controls="login-dev-panel"
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-3 py-2 text-left transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5B21B6]/15"
          >
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 min-[380px]:text-[10px] min-[380px]:tracking-[0.16em]">
              <KeyRound className="size-3.5 shrink-0" aria-hidden="true" />
              Acceso de desarrollo
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5">
              <span className="whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                Solo local
              </span>
              <ChevronUp
                className={`size-4 text-slate-400 transition-transform duration-200 ${
                  demoOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </span>
          </button>

          {demoOpen && (
            <div
              id="login-dev-panel"
              role="region"
              aria-label="Credenciales de desarrollo"
              className="absolute inset-x-0 bottom-[calc(100%+0.5rem)] z-30 rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Credenciales locales
                </p>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                  Solo local
                </span>
              </div>
              <dl className="mt-2 space-y-1 text-[11.5px]">
                <div className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 text-slate-500">Correo</dt>
                  <dd className="min-w-0 break-all text-right font-mono text-slate-800">
                    {demo.email}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 text-slate-500">Contraseña</dt>
                  <dd className="min-w-0 break-all text-right font-mono text-slate-800">
                    {demo.password}
                  </dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={applyDemoCredentials}
                className="mt-2.5 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11.5px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Usar credenciales
              </button>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
                Este bloque nunca se muestra en producción.
              </p>
            </div>
          )}
        </div>
      )}
    </form>
  )
}
