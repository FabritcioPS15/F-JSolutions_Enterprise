'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle,
  Check,
  Copy,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react'
import { Modal } from '@/components/admin/modal'
import { useToast } from '@/components/admin/toast'
import {
  Field,
  SectionCard,
  btnDanger,
  btnPrimary,
  btnSecondary,
  inputClass,
} from '@/components/admin/ui'
import type {
  TwoFactorMethod,
  TwoFactorSetupResult,
  TwoFactorStatus,
} from '@/lib/auth/types'
import { cn } from '@/lib/utils'

type ApiEnvelope<T> = {
  success?: boolean
  message?: string
  data?: T
}

type PasswordAction = 'disable' | 'regenerate'

const METHOD_LABELS: Record<TwoFactorMethod, string> = {
  TOTP: 'Aplicación de autenticación',
  EMAIL: 'Código por correo electrónico',
}

async function callTwoFactor<T>(action: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/auth/2fa/${action}`, {
    cache: 'no-store',
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!response.ok || !body?.success) {
    throw new Error(body?.message ?? 'No se pudo completar la operación.')
  }

  return body.data as T
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function TwoFactorSecurityCard() {
  const toast = useToast()
  const [status, setStatus] = useState<TwoFactorStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [setupOpen, setSetupOpen] = useState(false)
  const [setupMethod, setSetupMethod] = useState<TwoFactorMethod | null>(null)
  const [setup, setSetup] = useState<TwoFactorSetupResult | null>(null)
  const [code, setCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [passwordAction, setPasswordAction] = useState<PasswordAction | null>(null)
  const [password, setPassword] = useState('')

  const [codesOpen, setCodesOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const loadStatus = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      setStatus(await callTwoFactor<TwoFactorStatus>('status'))
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : 'No se pudo consultar el estado de seguridad.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  function resetSetup() {
    setSetupMethod(null)
    setSetup(null)
    setCode('')
    setRecoveryCodes(null)
    setActionError(null)
  }

  function closeSetup() {
    if (busy) return
    setSetupOpen(false)
    resetSetup()
  }

  async function startSetup(method: TwoFactorMethod) {
    setBusy(true)
    setActionError(null)
    try {
      const result = await callTwoFactor<TwoFactorSetupResult>('setup', {
        method: 'POST',
        body: JSON.stringify({ method }),
      })
      setSetupMethod(method)
      setSetup(result)
      setRecoveryCodes(null)
      setCode('')
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'No se pudo iniciar la configuración.'
      )
    } finally {
      setBusy(false)
    }
  }

  async function confirmEnable(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) {
      setActionError('El código debe tener 6 dígitos.')
      return
    }

    setBusy(true)
    setActionError(null)
    try {
      const result = await callTwoFactor<{ recoveryCodes: string[] }>('enable', {
        method: 'POST',
        body: JSON.stringify({ code }),
      })
      setRecoveryCodes(result.recoveryCodes)
      toast.success(
        'Verificación en dos pasos activada',
        'Guarda los códigos de recuperación antes de cerrar.'
      )
      void loadStatus()
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'No se pudo activar la verificación.'
      )
    } finally {
      setBusy(false)
    }
  }

  async function confirmPasswordAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!passwordAction || password.length === 0) return

    setBusy(true)
    setActionError(null)
    try {
      if (passwordAction === 'disable') {
        await callTwoFactor<TwoFactorStatus>('disable', {
          method: 'POST',
          body: JSON.stringify({ password }),
        })
        toast.success('Verificación en dos pasos desactivada')
        setPasswordAction(null)
        setPassword('')
        await loadStatus()
      } else {
        const result = await callTwoFactor<{ recoveryCodes: string[] }>('recovery-codes', {
          method: 'POST',
          body: JSON.stringify({ password }),
        })
        setPasswordAction(null)
        setPassword('')
        setRecoveryCodes(result.recoveryCodes)
        setCodesOpen(true)
        setCopied(false)
        toast.success('Códigos de recuperación actualizados')
        void loadStatus()
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'No se pudo completar la operación.'
      )
    } finally {
      setBusy(false)
    }
  }

  async function copyCodes() {
    if (!recoveryCodes) return
    try {
      await navigator.clipboard.writeText(recoveryCodes.join('\n'))
      setCopied(true)
      toast.success('Códigos copiados')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('No se pudo copiar', 'Copia los códigos manualmente.')
    }
  }

  function openPasswordAction(action: PasswordAction) {
    setPassword('')
    setActionError(null)
    setPasswordAction(action)
  }

  function closePasswordAction() {
    if (busy) return
    setPasswordAction(null)
    setPassword('')
    setActionError(null)
  }

  const enabled = Boolean(status?.enabled)

  return (
    <>
      <SectionCard
        title="Seguridad de la cuenta"
        description="Protege el acceso al panel con un segundo factor."
        icon={ShieldCheck}
      >
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 py-2 text-[11.5px] text-slate-500">
              <Loader2 className="size-4 animate-spin text-slate-400" aria-hidden="true" />
              Consultando estado de seguridad…
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-900">
              <p>{loadError}</p>
              <button
                type="button"
                onClick={() => void loadStatus()}
                className="mt-1.5 font-semibold underline underline-offset-2 hover:text-amber-950"
              >
                Reintentar
              </button>
            </div>
          ) : enabled ? (
            <div className="space-y-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Activa
                </span>
                <dl className="mt-2.5 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-500">Método</dt>
                    <dd className="text-right font-semibold text-slate-800">
                      {status?.method ? METHOD_LABELS[status.method] : '—'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-500">Activada</dt>
                    <dd className="text-right font-medium text-slate-700">
                      {formatDate(status?.confirmedAt ?? null)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-500">Códigos de recuperación</dt>
                    <dd
                      className={cn(
                        'text-right font-semibold',
                        (status?.recoveryCodesRemaining ?? 0) === 0
                          ? 'text-red-600'
                          : 'text-slate-800'
                      )}
                    >
                      {status?.recoveryCodesRemaining ?? 0} disponibles
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className={cn(btnSecondary, 'w-full justify-start')}
                  onClick={() => openPasswordAction('regenerate')}
                >
                  <RefreshCw className="size-4 text-slate-500" aria-hidden="true" />
                  Regenerar códigos
                </button>
                <button
                  type="button"
                  className={cn(
                    btnDanger,
                    'w-full justify-start bg-white text-red-600 shadow-none hover:bg-red-50',
                    'border border-red-200'
                  )}
                  onClick={() => openPasswordAction('disable')}
                >
                  <ShieldOff className="size-4" aria-hidden="true" />
                  Desactivar 2FA
                </button>
              </div>

              {(status?.recoveryCodesRemaining ?? 0) <= 2 && (
                <p className="flex gap-1.5 text-[10px] leading-relaxed text-amber-700">
                  <AlertTriangle className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                  Te quedan pocos códigos de recuperación. Regenera una nueva lista.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-slate-500">
                Inactiva
              </span>
              <p className="text-[10.5px] leading-relaxed text-slate-500">
                Actívala para pedir un código adicional en cada inicio de sesión, incluso si la
                contraseña se ve comprometida.
              </p>
              <button
                type="button"
                className={cn(btnPrimary, 'w-full')}
                onClick={() => {
                  resetSetup()
                  setSetupOpen(true)
                }}
              >
                <KeyRound className="size-4" aria-hidden="true" />
                Configurar 2FA
              </button>
            </div>
          )}

          <p className="border-t border-slate-100 pt-3 text-[10px] leading-relaxed text-slate-400">
            La API valida el token en cada solicitud y aplica permisos por rol. Los secretos TOTP se
            guardan cifrados y nunca se envían al navegador después del enrolamiento.
          </p>
        </div>
      </SectionCard>

      <Modal
        open={setupOpen}
        onClose={closeSetup}
        title="Verificación en dos pasos"
        description={
          recoveryCodes
            ? 'Guarda estos códigos en un lugar seguro.'
            : 'Elige cómo quieres confirmar tu identidad.'
        }
        footer={
          recoveryCodes ? (
            <button type="button" className={btnPrimary} onClick={closeSetup}>
              He guardado los códigos
            </button>
          ) : setupMethod ? (
            <>
              <button type="button" className={btnSecondary} onClick={closeSetup} disabled={busy}>
                Cancelar
              </button>
              <button
                type="submit"
                form="two-factor-enable-form"
                className={btnPrimary}
                disabled={busy}
              >
                {busy ? 'Activando…' : 'Activar 2FA'}
              </button>
            </>
          ) : undefined
        }
      >
        {actionError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-red-700">
            {actionError}
          </div>
        )}

        {recoveryCodes ? (
          <div className="space-y-3">
            <p className="text-[12px] leading-relaxed text-slate-600">
              Cada código sirve una sola vez si pierdes acceso a tu método principal. No se volverán
              a mostrar.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {recoveryCodes.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center font-mono text-[12px] tracking-wide text-slate-800"
                >
                  {item}
                </span>
              ))}
            </div>
            <button type="button" className={btnSecondary} onClick={() => void copyCodes()}>
              {copied ? (
                <Check className="size-4 text-emerald-600" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              {copied ? 'Copiados' : 'Copiar códigos'}
            </button>
          </div>
        ) : !setupMethod ? (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => void startSetup('TOTP')}
              disabled={busy}
              className="flex w-full items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-[#C4B5FD] hover:bg-[#F5F3FF]/50 disabled:opacity-60"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-[#5B21B6] ring-1 ring-slate-200">
                <KeyRound className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-slate-900">
                  Aplicación de autenticación
                </span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                  Escanea un código QR con Google Authenticator, Microsoft Authenticator o similar.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => void startSetup('EMAIL')}
              disabled={busy}
              className="flex w-full items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-[#C4B5FD] hover:bg-[#F5F3FF]/50 disabled:opacity-60"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-[#5B21B6] ring-1 ring-slate-200">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-slate-900">
                  Código por correo
                </span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                  Recibe un código de 6 dígitos en el correo registrado de tu cuenta.
                </span>
              </span>
            </button>

            {busy && (
              <p className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Preparando la configuración…
              </p>
            )}
          </div>
        ) : setupMethod === 'TOTP' ? (
          <form id="two-factor-enable-form" onSubmit={confirmEnable} className="space-y-4">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              {setup?.qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={setup.qrDataUrl}
                  alt="Código QR para configurar la aplicación de autenticación"
                  className="size-44 rounded-lg bg-white p-1.5 ring-1 ring-slate-200"
                />
              ) : null}
              <div className="w-full text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Clave manual
                </p>
                <p className="mt-1 select-all break-all font-mono text-[11.5px] text-slate-700">
                  {setup?.secret ?? '—'}
                </p>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Escanea el QR o ingresa la clave manual en tu aplicación y escribe el código de 6
              dígitos que muestra.
            </p>
            <Field label="Código de la aplicación" htmlFor="totp-code" required>
              <input
                id="totp-code"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                  if (actionError) setActionError(null)
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                className={cn(inputClass, 'text-center font-mono text-base tracking-[0.4em]')}
              />
            </Field>
          </form>
        ) : (
          <form id="two-factor-enable-form" onSubmit={confirmEnable} className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-800">
                <Mail className="size-4 text-[#5B21B6]" aria-hidden="true" />
                Código enviado a {setup?.email ?? 'tu correo'}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                Revisa tu bandeja de entrada y la carpeta de spam. El código vence en 10 minutos.
              </p>
              {setup?.delivered === false && (
                <p className="mt-2 flex gap-1.5 text-[10.5px] leading-relaxed text-amber-700">
                  <AlertTriangle className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                  El envío no pudo confirmarse. En desarrollo revisa la consola de la API; en
                  producción configura SMTP.
                </p>
              )}
            </div>
            <Field label="Código recibido" htmlFor="email-code" required>
              <input
                id="email-code"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                  if (actionError) setActionError(null)
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                className={cn(inputClass, 'text-center font-mono text-base tracking-[0.4em]')}
              />
            </Field>
          </form>
        )}
      </Modal>

      <Modal
        open={passwordAction !== null}
        onClose={closePasswordAction}
        title={
          passwordAction === 'disable'
            ? 'Desactivar verificación en dos pasos'
            : 'Regenerar códigos de recuperación'
        }
        description={
          passwordAction === 'disable'
            ? 'Confirma tu contraseña para quitar el segundo factor.'
            : 'Los códigos anteriores dejarán de funcionar de inmediato.'
        }
        footer={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={closePasswordAction}
              disabled={busy}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="two-factor-password-form"
              className={passwordAction === 'disable' ? btnDanger : btnPrimary}
              disabled={busy || password.length === 0}
            >
              {busy ? 'Procesando…' : passwordAction === 'disable' ? 'Desactivar' : 'Regenerar'}
            </button>
          </>
        }
      >
        {actionError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-red-700">
            {actionError}
          </div>
        )}
        <form id="two-factor-password-form" onSubmit={confirmPasswordAction}>
          <Field label="Contraseña actual" htmlFor="confirm-password" required>
            <input
              id="confirm-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (actionError) setActionError(null)
              }}
              className={inputClass}
              placeholder="Tu contraseña"
            />
          </Field>
        </form>
      </Modal>

      <Modal
        open={codesOpen}
        onClose={() => setCodesOpen(false)}
        title="Códigos de recuperación"
        description="Cada código sirve una sola vez y no se volverá a mostrar."
        footer={
          <button type="button" className={btnPrimary} onClick={() => setCodesOpen(false)}>
            Listo
          </button>
        }
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {(recoveryCodes ?? []).map((item) => (
              <span
                key={item}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-center font-mono text-[12px] tracking-wide text-slate-800"
              >
                {item}
              </span>
            ))}
          </div>
          <button type="button" className={btnSecondary} onClick={() => void copyCodes()}>
            {copied ? (
              <Check className="size-4 text-emerald-600" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? 'Copiados' : 'Copiar códigos'}
          </button>
        </div>
      </Modal>
    </>
  )
}
