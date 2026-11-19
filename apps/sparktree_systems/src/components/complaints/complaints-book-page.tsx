'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileText,
  Loader2,
  Printer,
  Scale,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { EMPRESA } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { ComplaintStatusView } from '@fj-solutions/contracts/complaints-book'

const CONTAINER = 'mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8'

const fieldClass =
  'mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm font-normal text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#1769AA] focus:ring-2 focus:ring-[#1769AA]/15 aria-[invalid=true]:border-destructive'

const labelClass = 'block text-[12px] font-semibold text-foreground'

type Kind = 'reclamo' | 'queja'
type ItemType = 'producto' | 'servicio'
type DocumentType = 'dni' | 'ce' | 'pasaporte' | 'ruc'

type FormState = {
  kind: Kind
  name: string
  documentType: DocumentType
  documentNumber: string
  email: string
  phone: string
  address: string
  isMinor: boolean
  guardianName: string
  itemType: ItemType
  itemDescription: string
  amount: string
  orderCode: string
  detail: string
  request: string
  accepted: boolean
}

type Receipt = {
  code: string
  createdAt: string
  dueAt: string
  kind: Kind
  name: string
  documentType: DocumentType
  documentNumber: string
  email: string
  phone: string
  address: string
  itemType: ItemType
  itemDescription: string
  amount: string
  orderCode: string
  detail: string
  request: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const initialForm: FormState = {
  kind: 'reclamo',
  name: '',
  documentType: 'dni',
  documentNumber: '',
  email: '',
  phone: '',
  address: '',
  isMinor: false,
  guardianName: '',
  itemType: 'producto',
  itemDescription: '',
  amount: '',
  orderCode: '',
  detail: '',
  request: '',
  accepted: false,
}

const documentLabels: Record<DocumentType, string> = {
  dni: 'DNI',
  ce: 'Carné de extranjería',
  pasaporte: 'Pasaporte',
  ruc: 'RUC',
}

const kindLabels: Record<Kind, string> = {
  reclamo: 'Reclamo',
  queja: 'Queja',
}

const statusMeta: Record<
  ComplaintStatusView['status'],
  { label: string; tone: string }
> = {
  pending: {
    label: 'Pendiente de atención',
    tone: 'border-amber-500/25 bg-amber-500/10 text-warning-ink',
  },
  review: {
    label: 'En revisión',
    tone: 'border-sky-500/25 bg-sky-500/10 text-sky-ink',
  },
  answered: {
    label: 'Respondido',
    tone: 'border-emerald-500/25 bg-emerald-500/10 text-success-ink',
  },
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(date)
}

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-destructive" role="alert">
          <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function ComplaintsBookPage() {
  const [tab, setTab] = useState<'registrar' | 'consultar'>('registrar')
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [sending, setSending] = useState(false)
  const [serverError, setServerError] = useState('')
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [copied, setCopied] = useState(false)

  const [lookup, setLookup] = useState({ code: '', email: '' })
  const [lookupError, setLookupError] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupResult, setLookupResult] = useState<ComplaintStatusView | null>(null)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
    if (errors[key]) setErrors((previous) => ({ ...previous, [key]: undefined }))
    if (serverError) setServerError('')
  }

  const validate = () => {
    const next: FormErrors = {}
    if (form.name.trim().length < 3) next.name = 'Escribe tu nombre completo.'
    if (form.documentNumber.trim().length < 5) next.documentNumber = 'Ingresa tu número de documento.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Ingresa un correo válido.'
    if (form.phone.trim().length < 6) next.phone = 'Ingresa un teléfono de contacto.'
    if (form.address.trim().length < 5) next.address = 'Ingresa tu domicilio.'
    if (form.isMinor && form.guardianName.trim().length < 3) {
      next.guardianName = 'Indica el nombre del padre, madre o tutor.'
    }
    if (form.itemDescription.trim().length < 3) {
      next.itemDescription = 'Describe el producto o servicio involucrado.'
    }
    if (form.detail.trim().length < 30) {
      next.detail = 'Detalla lo ocurrido con al menos 30 caracteres.'
    }
    if (form.request.trim().length < 10) {
      next.request = 'Indica qué solución esperas.'
    }
    if (!form.accepted) next.accepted = 'Debes aceptar la declaración jurada.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending || !validate()) return

    setSending(true)
    setServerError('')

    const snapshot: Omit<Receipt, 'code' | 'createdAt' | 'dueAt'> = {
      kind: form.kind,
      name: form.name.trim(),
      documentType: form.documentType,
      documentNumber: form.documentNumber.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      itemType: form.itemType,
      itemDescription: form.itemDescription.trim(),
      amount: form.amount.trim(),
      orderCode: form.orderCode.trim(),
      detail: form.detail.trim(),
      request: form.request.trim(),
    }

    try {
      const response = await fetch('/api/libro-de-reclamaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: form.kind,
          consumer: {
            name: snapshot.name,
            documentType: form.documentType,
            documentNumber: snapshot.documentNumber,
            email: snapshot.email,
            phone: snapshot.phone,
            address: snapshot.address,
            isMinor: form.isMinor,
            guardianName: form.isMinor ? form.guardianName.trim() : '',
          },
          item: {
            type: form.itemType,
            description: snapshot.itemDescription,
            amount: form.amount.trim() || null,
            orderCode: snapshot.orderCode,
          },
          detail: snapshot.detail,
          request: snapshot.request,
          accepted: form.accepted,
        }),
      })

      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean
            message?: string
            data?: { code: string; createdAt: string; dueAt: string }
          }
        | null

      if (!response.ok || !data?.success || !data.data) {
        setServerError(
          data?.message ?? 'No pudimos registrar tu reclamo. Inténtalo nuevamente.'
        )
        return
      }

      setReceipt({
        ...snapshot,
        code: data.data.code,
        createdAt: data.data.createdAt,
        dueAt: data.data.dueAt,
      })
      setForm(initialForm)
      setErrors({})
      requestAnimationFrame(() => {
        document.getElementById('constancia')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } catch {
      setServerError('No pudimos conectar con el registro. Revisa tu conexión e inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  const handleLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (lookupLoading) return

    if (lookup.code.trim().length < 6) {
      setLookupError('Ingresa el código que aparece en tu constancia.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lookup.email.trim())) {
      setLookupError('Ingresa el correo con el que registraste el reclamo.')
      return
    }

    setLookupLoading(true)
    setLookupError('')
    setLookupResult(null)

    try {
      const response = await fetch('/api/libro-de-reclamaciones/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: lookup.code.trim(), email: lookup.email.trim() }),
      })
      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; data?: ComplaintStatusView }
        | null

      if (!response.ok || !data?.success || !data.data) {
        setLookupError(data?.message ?? 'No encontramos tu reclamo con esos datos.')
        return
      }
      setLookupResult(data.data)
    } catch {
      setLookupError('No pudimos conectar con la consulta. Inténtalo nuevamente.')
    } finally {
      setLookupLoading(false)
    }
  }

  const copyCode = async () => {
    if (!receipt) return
    try {
      await navigator.clipboard.writeText(receipt.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="min-h-screen bg-card text-foreground">
      <EnhancedHeader />

      <Breadcrumbs
        items={[{ label: 'Inicio', href: '/' }, { label: 'Libro de reclamaciones', current: true }]}
      />

      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted via-card to-card">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-[#1769AA]/10 blur-3xl"
        />
        <div className={`${CONTAINER} relative py-10 sm:py-14`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-ink/20 bg-tint-brand px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-ink">
            <BookOpenCheck className="size-3.5" aria-hidden="true" />
            Libro de Reclamaciones Virtual
          </span>

          <h1 className="mt-4 max-w-[22ch] font-heading text-[clamp(2rem,1.2rem+3vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.045em] text-foreground">
            Registra tu <span className="text-brand-ink">reclamo</span> o{' '}
            <span className="text-blue-ink">queja</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
            Este libro virtual está a tu disposición las 24 horas, conforme al Código de Protección
            y Defensa del Consumidor. Al registrar tu caso recibirás un código de constancia y
            responderemos en un plazo máximo de 30 días calendario.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
              <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
              Datos tratados de forma confidencial
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
              <Clock3 className="size-3.5 text-blue-ink" aria-hidden="true" />
              Respuesta en 30 días calendario
            </span>
          </div>
        </div>
      </section>

      <section className={`${CONTAINER} py-10 sm:py-14`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <div
              role="tablist"
              aria-label="Opciones del libro de reclamaciones"
              className="inline-flex w-full max-w-md rounded-xl border border-border bg-muted p-1"
            >
              {[
                { id: 'registrar' as const, label: 'Registrar reclamo', icon: FileText },
                { id: 'consultar' as const, label: 'Consultar estado', icon: Search },
              ].map((item) => {
                const active = tab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(item.id)}
                    className={cn(
                      'inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-xs font-bold transition',
                      active
                        ? 'bg-card text-foreground shadow-xs ring-1 ring-border'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </button>
                )
              })}
            </div>

            {tab === 'registrar' && receipt ? (
              <ReceiptCard
                receipt={receipt}
                copied={copied}
                onCopy={copyCode}
                onNew={() => setReceipt(null)}
              />
            ) : null}

            {tab === 'registrar' && !receipt ? (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-8">
                <FormBlock step="1" title="Datos del consumidor">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field id="name" label="Nombre completo *" error={errors.name}>
                        <input
                          id="name"
                          type="text"
                          value={form.name}
                          onChange={(event) => update('name', event.target.value)}
                          placeholder="Nombres y apellidos"
                          autoComplete="name"
                          aria-invalid={Boolean(errors.name)}
                          className={fieldClass}
                        />
                      </Field>
                    </div>
                    <Field id="documentType" label="Tipo de documento *">
                      <select
                        id="documentType"
                        value={form.documentType}
                        onChange={(event) => update('documentType', event.target.value as DocumentType)}
                        className={fieldClass}
                      >
                        {Object.entries(documentLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field id="documentNumber" label="Número de documento *" error={errors.documentNumber}>
                      <input
                        id="documentNumber"
                        type="text"
                        value={form.documentNumber}
                        onChange={(event) => update('documentNumber', event.target.value)}
                        placeholder="Ej. 45678912"
                        autoComplete="off"
                        aria-invalid={Boolean(errors.documentNumber)}
                        className={fieldClass}
                      />
                    </Field>
                    <Field id="email" label="Correo electrónico *" error={errors.email}>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(event) => update('email', event.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        className={fieldClass}
                      />
                    </Field>
                    <Field id="phone" label="Teléfono de contacto *" error={errors.phone}>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) => update('phone', event.target.value)}
                        placeholder="+51 999 999 999"
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.phone)}
                        className={fieldClass}
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field id="address" label="Domicilio *" error={errors.address}>
                        <input
                          id="address"
                          type="text"
                          value={form.address}
                          onChange={(event) => update('address', event.target.value)}
                          placeholder="Distrito, provincia y departamento"
                          autoComplete="street-address"
                          aria-invalid={Boolean(errors.address)}
                          className={fieldClass}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-border bg-muted/60 p-3">
                    <label className="flex cursor-pointer items-start gap-2.5 text-xs font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={form.isMinor}
                        onChange={(event) => update('isMinor', event.target.checked)}
                        className="mt-0.5 size-4 shrink-0 rounded border-input accent-[#1769AA]"
                      />
                      El consumidor es menor de edad
                    </label>
                    {form.isMinor ? (
                      <div className="mt-3">
                        <Field
                          id="guardianName"
                          label="Nombre del padre, madre o tutor *"
                          error={errors.guardianName}
                        >
                          <input
                            id="guardianName"
                            type="text"
                            value={form.guardianName}
                            onChange={(event) => update('guardianName', event.target.value)}
                            placeholder="Nombres y apellidos del tutor"
                            aria-invalid={Boolean(errors.guardianName)}
                            className={fieldClass}
                          />
                        </Field>
                      </div>
                    ) : null}
                  </div>
                </FormBlock>

                <FormBlock step="2" title="Identificación del bien o servicio">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="itemType" label="Tipo *">
                      <select
                        id="itemType"
                        value={form.itemType}
                        onChange={(event) => update('itemType', event.target.value as ItemType)}
                        className={fieldClass}
                      >
                        <option value="producto">Producto</option>
                        <option value="servicio">Servicio</option>
                      </select>
                    </Field>
                    <Field
                      id="amount"
                      label="Monto reclamado (opcional)"
                      hint="Solo si tu caso involucra un importe."
                    >
                      <input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        value={form.amount}
                        onChange={(event) => update('amount', event.target.value)}
                        placeholder="0.00"
                        className={fieldClass}
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field
                        id="itemDescription"
                        label="Producto o servicio involucrado *"
                        error={errors.itemDescription}
                      >
                        <input
                          id="itemDescription"
                          type="text"
                          value={form.itemDescription}
                          onChange={(event) => update('itemDescription', event.target.value)}
                          placeholder="Ej. Laptop Lenovo IdeaPad Slim 3"
                          aria-invalid={Boolean(errors.itemDescription)}
                          className={fieldClass}
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field
                        id="orderCode"
                        label="N.° de pedido, cotización o comprobante (opcional)"
                      >
                        <input
                          id="orderCode"
                          type="text"
                          value={form.orderCode}
                          onChange={(event) => update('orderCode', event.target.value)}
                          placeholder="Ej. COT-20261103-RK9J"
                          className={fieldClass}
                        />
                      </Field>
                    </div>
                  </div>
                </FormBlock>

                <FormBlock step="3" title="Detalle de tu caso">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        {
                          value: 'reclamo' as const,
                          title: 'Reclamo',
                          copy: 'Disconformidad con el producto o el servicio recibido.',
                        },
                        {
                          value: 'queja' as const,
                          title: 'Queja',
                          copy: 'Malestar respecto a la atención o al trato recibido.',
                        },
                      ]
                    ).map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          'flex cursor-pointer gap-3 rounded-xl border p-3 transition',
                          form.kind === option.value
                            ? 'border-brand-ink/40 bg-tint-brand ring-1 ring-brand-ink/20'
                            : 'border-border bg-card hover:border-brand-ink/30'
                        )}
                      >
                        <input
                          type="radio"
                          name="kind"
                          value={option.value}
                          checked={form.kind === option.value}
                          onChange={() => update('kind', option.value)}
                          className="mt-0.5 size-4 shrink-0 accent-[#1769AA]"
                        />
                        <span>
                          <span className="block text-xs font-bold text-foreground">{option.title}</span>
                          <span className="mt-0.5 block text-[11px] leading-5 text-muted-foreground">
                            {option.copy}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Field
                      id="detail"
                      label="Detalle del reclamo o queja *"
                      error={errors.detail}
                      hint={`${form.detail.trim().length}/4000 caracteres · mínimo 30`}
                    >
                      <textarea
                        id="detail"
                        value={form.detail}
                        onChange={(event) => update('detail', event.target.value.slice(0, 4000))}
                        placeholder="Describe qué ocurrió, cuándo y en qué circunstancias."
                        rows={5}
                        aria-invalid={Boolean(errors.detail)}
                        className={`${fieldClass} min-h-32 resize-y py-2.5`}
                      />
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field
                      id="request"
                      label="Pedido concreto *"
                      error={errors.request}
                      hint="Indica qué esperas que hagamos para resolver tu caso."
                    >
                      <textarea
                        id="request"
                        value={form.request}
                        onChange={(event) => update('request', event.target.value.slice(0, 2000))}
                        placeholder="Ej. Solicito la revisión del equipo y la reprogramación de la entrega."
                        rows={3}
                        aria-invalid={Boolean(errors.request)}
                        className={`${fieldClass} resize-y py-2.5`}
                      />
                    </Field>
                  </div>
                </FormBlock>

                <FormBlock step="4" title="Declaración jurada">
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-muted/60 p-3.5 text-xs leading-5 text-foreground/85">
                    <input
                      type="checkbox"
                      checked={form.accepted}
                      onChange={(event) => update('accepted', event.target.checked)}
                      className="mt-0.5 size-4 shrink-0 rounded border-input accent-[#1769AA]"
                      aria-invalid={Boolean(errors.accepted)}
                    />
                    <span>
                      Declaro que la información proporcionada es veraz y autorizo su tratamiento
                      para atender este reclamo. Acepto que este registro forme parte del Libro de
                      Reclamaciones Virtual de {EMPRESA.nombre}.
                    </span>
                  </label>
                  {errors.accepted ? (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-destructive" role="alert">
                      <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
                      {errors.accepted}
                    </p>
                  ) : null}

                  {serverError ? (
                    <p className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/25 bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-danger-ink" role="alert">
                      <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                      {serverError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={sending}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1769AA] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#12568C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769AA]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Registrando…
                      </>
                    ) : (
                      <>
                        Registrar {kindLabels[form.kind].toLowerCase()}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </FormBlock>
              </form>
            ) : null}

            {tab === 'consultar' ? (
              <div className="mt-6 space-y-6">
                <form onSubmit={handleLookup} className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6" noValidate>
                  <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
                    Consulta el estado de tu caso
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Usa el código de tu constancia y el correo con el que registraste el reclamo.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field id="lookupCode" label="Código de constancia *">
                      <input
                        id="lookupCode"
                        type="text"
                        value={lookup.code}
                        onChange={(event) => {
                          setLookup((previous) => ({ ...previous, code: event.target.value }))
                          setLookupError('')
                        }}
                        placeholder="LR-2026-00001"
                        autoComplete="off"
                        className={fieldClass}
                      />
                    </Field>
                    <Field id="lookupEmail" label="Correo registrado *">
                      <input
                        id="lookupEmail"
                        type="email"
                        value={lookup.email}
                        onChange={(event) => {
                          setLookup((previous) => ({ ...previous, email: event.target.value }))
                          setLookupError('')
                        }}
                        placeholder="tucorreo@ejemplo.com"
                        autoComplete="email"
                        className={fieldClass}
                      />
                    </Field>
                  </div>
                  {lookupError ? (
                    <p className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/25 bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-danger-ink" role="alert">
                      <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                      {lookupError}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#1769AA] px-5 text-xs font-bold text-white transition hover:bg-[#12568C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769AA]/40 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {lookupLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Consultando…
                      </>
                    ) : (
                      <>
                        <Search className="size-4" aria-hidden="true" />
                        Consultar estado
                      </>
                    )}
                  </button>
                </form>

                {lookupResult ? <StatusCard result={lookupResult} /> : null}
              </div>
            ) : null}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink">
                Proveedor
              </p>
              <p className="mt-2 text-sm font-bold text-foreground">{EMPRESA.nombre}</p>
              <dl className="mt-3 space-y-2 text-[11.5px] leading-5 text-muted-foreground">
                <div>
                  <dt className="font-semibold text-foreground/80">RUC</dt>
                  <dd>{EMPRESA.ruc}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground/80">Domicilio</dt>
                  <dd>{EMPRESA.direccion}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground/80">Correo</dt>
                  <dd>
                    <a href={`mailto:${EMPRESA.email}`} className="font-semibold text-blue-ink hover:underline">
                      {EMPRESA.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground/80">Horario</dt>
                  <dd>{EMPRESA.horario}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-muted/70 p-5">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                <Scale className="size-3.5" aria-hidden="true" />
                Reclamo o queja
              </p>
              <div className="mt-3 space-y-3 text-[11.5px] leading-5 text-muted-foreground">
                <p>
                  <span className="font-bold text-foreground">Reclamo:</span> disconformidad con el
                  producto o el servicio recibido.
                </p>
                <p>
                  <span className="font-bold text-foreground">Queja:</span> malestar respecto a la
                  atención o al trato recibido.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-ink/20 bg-tint-brand p-5">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink">
                <Clock3 className="size-3.5" aria-hidden="true" />
                Plazo de respuesta
              </p>
              <p className="mt-2 text-[11.5px] leading-5 text-foreground/85">
                Responderemos tu caso en un plazo máximo de 30 días calendario desde el registro.
                Puedes consultar el avance con tu código de constancia.
              </p>
            </div>

            <p className="px-1 text-[11px] leading-5 text-muted-foreground">
              ¿Necesitas ayuda con el formulario?{' '}
              <Link href="/contacto" className="font-semibold text-blue-ink hover:underline">
                Escríbenos
              </Link>{' '}
              o llama al {EMPRESA.telefono}.
            </p>
          </aside>
        </div>
      </section>
    </main>
  )
}

function FormBlock({
  step,
  title,
  children,
}: {
  step: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-[11px] font-bold text-brand-ink">
          {step}
        </span>
        <h2 className="font-heading text-base font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function ReceiptCard({
  receipt,
  copied,
  onCopy,
  onNew,
}: {
  receipt: Receipt
  copied: boolean
  onCopy: () => void
  onNew: () => void
}) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
        <div>
          <p className="text-sm font-bold text-foreground">Reclamo registrado correctamente</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Guarda o imprime tu constancia. Con el código y tu correo podrás consultar el estado en
            cualquier momento.
          </p>
        </div>
      </div>

      <article
        id="constancia"
        className="complaint-print overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <header className="bg-gradient-to-r from-[#0C2E4A] via-[#12568C] to-[#12568C] px-5 py-5 text-white sm:px-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
            {EMPRESA.nombre} · Libro de Reclamaciones Virtual
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/70">
                Constancia de registro
              </p>
              <p className="mt-1 font-heading text-2xl font-bold tracking-tight">{receipt.code}</p>
            </div>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide">
              {kindLabels[receipt.kind]}
            </span>
          </div>
        </header>

        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-7">
          <ReceiptRow label="Fecha de registro" value={formatDateTime(receipt.createdAt)} />
          <ReceiptRow label="Fecha límite de respuesta" value={formatDate(receipt.dueAt)} />
          <ReceiptRow label="Consumidor" value={receipt.name} />
          <ReceiptRow
            label="Documento"
            value={`${documentLabels[receipt.documentType]} ${receipt.documentNumber}`}
          />
          <ReceiptRow label="Correo" value={receipt.email} />
          <ReceiptRow label="Teléfono" value={receipt.phone} />
          <div className="sm:col-span-2">
            <ReceiptRow label="Domicilio" value={receipt.address} />
          </div>
          <ReceiptRow
            label="Bien o servicio"
            value={`${receipt.itemType === 'producto' ? 'Producto' : 'Servicio'} · ${receipt.itemDescription}`}
          />
          <ReceiptRow label="Pedido o comprobante" value={receipt.orderCode || 'No indicado'} />
          <div className="sm:col-span-2">
            <ReceiptRow label="Detalle" value={receipt.detail} multiline />
          </div>
          <div className="sm:col-span-2">
            <ReceiptRow label="Pedido concreto" value={receipt.request} multiline />
          </div>
        </div>

        <footer className="border-t border-border bg-muted/60 px-5 py-4 text-[10.5px] leading-4.5 text-muted-foreground sm:px-7">
          Este registro queda incorporado al Libro de Reclamaciones Virtual de {EMPRESA.nombre}.
          La empresa responderá en un plazo máximo de 30 días calendario. El código de constancia
          es personal: no lo compartas.
        </footer>
      </article>

      <div className="complaint-print-hide flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1769AA] px-5 text-xs font-bold text-white transition hover:bg-[#12568C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769AA]/40"
        >
          <Printer className="size-4" aria-hidden="true" />
          Imprimir o guardar PDF
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-5 text-xs font-bold text-foreground transition hover:border-brand-ink/40 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769AA]/25"
        >
          {copied ? (
            <>
              <Check className="size-4 text-success" aria-hidden="true" />
              Código copiado
            </>
          ) : (
            <>
              <Copy className="size-4" aria-hidden="true" />
              Copiar código
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onNew}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-5 text-xs font-bold text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769AA]/25"
        >
          Registrar otro caso
        </button>
      </div>
    </div>
  )
}

function ReceiptRow({
  label,
  value,
  multiline,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div>
      <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          'mt-1 text-xs font-semibold text-foreground',
          multiline && 'whitespace-pre-wrap font-normal leading-5'
        )}
      >
        {value}
      </p>
    </div>
  )
}

function StatusCard({ result }: { result: ComplaintStatusView }) {
  const meta = statusMeta[result.status]
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Código {result.code}
          </p>
          <h3 className="mt-1 font-heading text-lg font-bold tracking-tight text-foreground">
            {result.itemDescription}
          </h3>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide',
            meta.tone
          )}
        >
          {meta.label}
        </span>
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        <ReceiptRow label="Tipo" value={kindLabels[result.kind]} />
        <ReceiptRow label="Registrado" value={formatDateTime(result.createdAt)} />
        <ReceiptRow label="Fecha límite" value={formatDate(result.dueAt)} />
      </dl>

      {result.response ? (
        <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-success-ink">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Respuesta de {EMPRESA.nombre}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-foreground/85">
            {result.response}
          </p>
          {result.respondedAt ? (
            <p className="mt-2 text-[10.5px] text-muted-foreground">
              Respondido el {formatDateTime(result.respondedAt)}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-border bg-muted/60 p-3.5 text-[11.5px] leading-5 text-muted-foreground">
          Tu caso está en evaluación. Te contactaremos al correo registrado antes de la fecha
          límite. También puedes revisar esta consulta cuando lo necesites.
        </p>
      )}
    </article>
  )
}
