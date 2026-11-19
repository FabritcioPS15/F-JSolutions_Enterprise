'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, MailCheck, Plus } from 'lucide-react'
import { PASSWORD_HINT, isEmail, onlyDigits, passwordProblem } from '@fj-solutions/contracts/domain'
import { AuthDivider, OAuthButtons } from './oauth-buttons'
import { corporateUrl } from '@/lib/store-nav'

type Availability = { google: boolean; facebook: boolean }
type DocumentType = 'dni' | 'ruc'
type FieldErrors = Partial<
  Record<'name' | 'email' | 'phone' | 'documentNumber' | 'password' | 'confirmPassword' | 'terms', string>
>

const fieldClass =
  'mt-1 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm font-normal text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 aria-[invalid=true]:border-destructive'

const initialDraft = {
  name: '',
  email: '',
  phone: '',
  documentType: 'dni' as DocumentType,
  documentNumber: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  marketingConsent: false,
}

export function RegisterForm({ availability }: { availability: Availability }) {
  const [draft, setDraft] = useState(initialDraft)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'resending'>('idle')
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRuc, setShowRuc] = useState(false)
  const [created, setCreated] = useState<{ email: string; verificationLink: string } | null>(null)
  const [resendInfo, setResendInfo] = useState('')
  const [devLink, setDevLink] = useState('')

  const isCompany = draft.documentType === 'ruc'

  const selectAccountKind = (kind: DocumentType) => {
    setDraft((previous) => ({ ...previous, documentType: kind, documentNumber: '' }))
    setErrors((previous) => ({ ...previous, documentNumber: undefined }))
    setShowRuc(false)
  }

  const update = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
    setDraft((previous) => ({ ...previous, [key]: value }))
    setServerError('')
    if (errors[key as keyof FieldErrors]) {
      setErrors((previous) => ({ ...previous, [key]: undefined }))
    }
  }

  const validate = () => {
    const nextErrors: FieldErrors = {}

    if (draft.name.trim().length < 3) {
      nextErrors.name =
        draft.documentType === 'ruc' ? 'Escribe la razón social.' : 'Escribe tu nombre completo.'
    }
    if (!isEmail(draft.email)) {
      nextErrors.email = 'Ingresa un correo válido.'
    }
    const digits = onlyDigits(draft.documentNumber)
    if (digits.length > 0 && digits.length !== 11) {
      nextErrors.documentNumber = 'El RUC debe tener 11 dígitos.'
    }
    const passwordIssue = passwordProblem(draft.password)
    if (passwordIssue) nextErrors.password = passwordIssue
    if (draft.confirmPassword !== draft.password) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.'
    }
    if (!draft.acceptTerms) {
      nextErrors.terms = 'Acepta los términos y la política de privacidad.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status !== 'idle' || !validate()) return

    setStatus('sending')
    setServerError('')
    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name.trim(),
          email: draft.email.trim(),
          phone: draft.phone.trim(),
          company: isCompany ? draft.name.trim() : '',
          documentType: onlyDigits(draft.documentNumber) ? draft.documentType : null,
          documentNumber: onlyDigits(draft.documentNumber),
          password: draft.password,
          confirmPassword: draft.confirmPassword,
          acceptTerms: draft.acceptTerms,
          marketingConsent: draft.marketingConsent,
        }),
      })
      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean
            message?: string
            data?: { verificationLink?: string; account?: { email?: string } }
          }
        | null

      if (!response.ok || !data?.success) {
        setServerError(data?.message ?? 'No pudimos crear tu cuenta. Inténtalo nuevamente.')
        return
      }

      setCreated({
        email: data.data?.account?.email ?? draft.email.trim(),
        verificationLink: data.data?.verificationLink ?? '',
      })
    } catch {
      setServerError('No pudimos crear tu cuenta. Revisa tu conexión e inténtalo nuevamente.')
    } finally {
      setStatus('idle')
    }
  }

  const handleResend = async () => {
    if (!created) return
    setStatus('resending')
    setResendInfo('')
    try {
      const response = await fetch('/api/customer/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: created.email }),
      })
      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; data?: { verificationLink?: string } }
        | null

      if (!response.ok || !data?.success) {
        setServerError(data?.message ?? 'No pudimos reenviar el correo.')
        return
      }
      setResendInfo(data.message ?? 'Te enviamos un enlace nuevo.')
      setDevLink(data.data?.verificationLink ?? '')
    } catch {
      setServerError('No pudimos reenviar el correo. Revisa tu conexión.')
    } finally {
      setStatus('idle')
    }
  }

  if (created) {
    return (
      <div>
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-[0_24px_60px_-48px_rgba(15,23,42,0.35)]">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-tint-blue text-blue-ink">
            <MailCheck aria-hidden="true" className="size-7" />
          </span>
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">Revisa tu correo</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enviamos un enlace de confirmación a{' '}
            <span className="font-semibold text-foreground">{created.email}</span>. Abre ese enlace
            desde tu bandeja para activar la cuenta; vence en 24 horas.
          </p>
          <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
            Hasta confirmar el correo, la cuenta queda pendiente y no puede iniciar sesión.
          </p>
        </div>

        {created.verificationLink && (
          <div className="mt-4 rounded-2xl border border-blue-ink/25 bg-tint-blue px-4 py-3 text-[13px] text-foreground">
            <p className="font-semibold">Modo local (sin SMTP configurado)</p>
            <p className="mt-1">
              El correo quedó en la bandeja local del panel. Puedes abrir el enlace directamente:{' '}
              <a href={created.verificationLink} className="font-bold underline underline-offset-2">
                confirmar mi correo
              </a>
            </p>
          </div>
        )}

        {resendInfo && (
          <p className="mt-4 rounded-2xl border border-success/35 bg-tint-green px-4 py-3 text-[13px] font-semibold text-success">
            {resendInfo}
            {devLink && (
              <>
                {' '}
                <a href={devLink} className="underline underline-offset-2">
                  Abrir enlace
                </a>
              </>
            )}
          </p>
        )}
        {serverError && (
          <p className="mt-4 rounded-2xl border border-destructive/35 bg-tint-red px-4 py-3 text-[13px] font-semibold text-destructive">
            {serverError}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleResend}
            disabled={status === 'resending'}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink disabled:opacity-60"
          >
            {status === 'resending' && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            Reenviar enlace
          </button>
          <Link
            href={`/login?correo=${encodeURIComponent(created.email)}`}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
          >
            Ir a iniciar sesión
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <OAuthButtons availability={availability} next="/mi-cuenta" />
      <AuthDivider label="o regístrate con tu correo" />

      {serverError && (
        <div
          role="alert"
          className="mb-3 flex items-start gap-2.5 rounded-2xl border border-destructive/35 bg-tint-red px-3.5 py-2.5 text-[13px] text-destructive sm:mb-4"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p className="font-semibold">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-2.5 sm:space-y-3">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <label className="col-span-2 block text-xs font-semibold text-foreground sm:col-span-1">
            {isCompany ? 'Razón social *' : 'Nombre completo *'}
            <input
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder={isCompany ? 'Razón social de la empresa' : 'Nombres y apellidos'}
              autoComplete={isCompany ? 'organization' : 'name'}
              aria-invalid={Boolean(errors.name)}
              className={fieldClass}
            />
            {errors.name && <span className="mt-1 block text-[10px] font-normal text-destructive">{errors.name}</span>}
          </label>

          <label className="block text-xs font-semibold text-foreground">
            Correo electrónico *
            <input
              type="email"
              value={draft.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="tu@empresa.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className={fieldClass}
            />
            {errors.email && <span className="mt-1 block text-[10px] font-normal text-destructive">{errors.email}</span>}
          </label>

          <label className="block text-xs font-semibold text-foreground">
            Teléfono
            <input
              type="tel"
              value={draft.phone}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="+51 999 999 999"
              autoComplete="tel"
              className={fieldClass}
            />
          </label>

          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between gap-2">
              <span className="block text-xs font-semibold text-foreground">Tipo de cuenta *</span>
              {isCompany && !showRuc && (
                <button
                  type="button"
                  onClick={() => setShowRuc(true)}
                  aria-label="Agregar RUC (opcional)"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-ink transition hover:text-blue-ink"
                >
                  <Plus aria-hidden="true" className="size-3" />
                  RUC
                </button>
              )}
            </div>
            <div
              role="group"
              aria-label="Tipo de cuenta"
              className="mt-1 grid h-10 grid-cols-2 gap-1 rounded-xl border border-border bg-muted p-1"
            >
              <button
                type="button"
                aria-pressed={!isCompany}
                onClick={() => selectAccountKind('dni')}
                className={`rounded-lg text-[11px] font-semibold transition ${
                  !isCompany
                    ? 'bg-card text-blue-ink shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Persona natural
              </button>
              <button
                type="button"
                aria-pressed={isCompany}
                onClick={() => selectAccountKind('ruc')}
                className={`rounded-lg text-[11px] font-semibold transition ${
                  isCompany
                    ? 'bg-card text-blue-ink shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Empresa
              </button>
            </div>
          </div>

          {isCompany && showRuc && (
            <label className="col-span-2 block text-xs font-semibold text-foreground">
              RUC (opcional)
              <input
                inputMode="numeric"
                maxLength={11}
                value={draft.documentNumber}
                onChange={(event) => update('documentNumber', onlyDigits(event.target.value))}
                placeholder="11 dígitos"
                aria-invalid={Boolean(errors.documentNumber)}
                className={fieldClass}
              />
              {errors.documentNumber && (
                <span className="mt-1 block text-[10px] font-normal text-destructive">{errors.documentNumber}</span>
              )}
            </label>
          )}

          <label className="block text-xs font-semibold text-foreground">
            Contraseña *
            <span className="relative mt-1 block">
              <input
                type={showPassword ? 'text' : 'password'}
                value={draft.password}
                onChange={(event) => update('password', event.target.value)}
                placeholder="Crea una contraseña"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                className={`${fieldClass} mt-0 pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-muted-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </span>
            {errors.password ? (
              <span className="mt-1 block text-[10px] font-normal text-destructive">{errors.password}</span>
            ) : (
              <span className="mt-1 hidden text-[10px] font-normal leading-4 text-muted-foreground xl:block">
                {PASSWORD_HINT}
              </span>
            )}
          </label>

          <label className="block text-xs font-semibold text-foreground">
            Repite la contraseña *
            <input
              type={showPassword ? 'text' : 'password'}
              value={draft.confirmPassword}
              onChange={(event) => update('confirmPassword', event.target.value)}
              placeholder="Confirma tu contraseña"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              className={fieldClass}
            />
            {errors.confirmPassword && (
              <span className="mt-1 block text-[10px] font-normal text-destructive">{errors.confirmPassword}</span>
            )}
          </label>
        </div>

        <div className="rounded-2xl border border-border bg-muted p-2 sm:p-2.5">
          <div className="grid gap-1.5">
            <label className="flex items-start gap-2 text-[11px] leading-4 text-foreground/85">
              <input
                type="checkbox"
                checked={draft.acceptTerms}
                onChange={(event) => update('acceptTerms', event.target.checked)}
                aria-invalid={Boolean(errors.terms)}
                className="mt-0.5 size-3.5 shrink-0 rounded border-input text-blue-ink focus:ring-[#2563EB]/30"
              />
              <span>
                Acepto los{' '}
                <a
                  href={corporateUrl('/terminos-y-condiciones')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-ink hover:underline"
                >
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a
                  href={corporateUrl('/politica-de-privacidad')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-ink hover:underline"
                >
                  política de privacidad
                </a>
                . *
              </span>
            </label>

            <label className="flex items-start gap-2 text-[11px] leading-4 text-foreground/85">
              <input
                type="checkbox"
                checked={draft.marketingConsent}
                onChange={(event) => update('marketingConsent', event.target.checked)}
                className="mt-0.5 size-3.5 shrink-0 rounded border-input text-blue-ink focus:ring-[#2563EB]/30"
              />
              <span>Quiero recibir novedades y promociones de SparkTree Store (opcional).</span>
            </label>
          </div>
          {errors.terms && <p className="mt-1 text-[10px] font-semibold text-destructive">{errors.terms}</p>}
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#1D4ED8] disabled:opacity-60"
        >
          {status === 'sending' ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <CheckCircle2 aria-hidden="true" className="size-4" />
          )}
          {status === 'sending' ? 'Creando cuenta…' : 'Crear mi cuenta'}
        </button>
      </form>

      <p className="mt-2.5 text-center text-[13px] text-muted-foreground sm:mt-4 sm:text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-blue-ink hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
