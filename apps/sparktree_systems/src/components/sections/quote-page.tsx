'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ClipboardList,
  Download,
  Loader2,
  Mail,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Send,
  ShoppingCart,
  Trash2,
  UserRound,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { QuotePanel } from '@/components/sections/quote-panel'
import { QuantityInput } from '@/components/ui/quantity-input'
import {
  documentLabel,
  formatQuoteDate,
  isValidDocument,
  onlyDigits,
  type ContactPreference,
  type DocumentType,
  type SavedQuote,
} from '@/lib/account'
import { useAccount } from '@/lib/use-account'
import { useQuote } from '@/lib/use-quote'
import { buildQuoteWhatsAppUrl, downloadQuotePdf } from '@/lib/quote-export'
import { storeUrl } from '@/lib/store-url'

type QuoteFormData = {
  contactName: string
  contactEmail: string
  contactPhone: string
  companyName: string
  documentType: DocumentType
  documentNumber: string
  contactPreference: ContactPreference
  generalNotes: string
}

const initialForm: QuoteFormData = {
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  companyName: '',
  documentType: 'ruc',
  documentNumber: '',
  contactPreference: 'email',
  generalNotes: '',
}

const steps = [
  { id: 1, label: 'Productos', description: 'Elige tus equipos' },
  { id: 2, label: 'Tus datos', description: 'Cuéntanos de ti' },
  { id: 3, label: 'Confirmar', description: 'Envía la solicitud' },
]

export function QuotePage() {
  const quote = useQuote()
  const account = useAccount()

  const [showQuote, setShowQuote] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [successQuote, setSuccessQuote] = useState<SavedQuote | null>(null)
  const [formData, setFormData] = useState<QuoteFormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({})

  useEffect(() => {
    if (!account.isLoaded || !account.profile) return

    const profile = account.profile
    setFormData((prev) => ({
      ...prev,
      contactName: prev.contactName || profile.name,
      contactEmail: prev.contactEmail || profile.email,
      contactPhone: prev.contactPhone || profile.phone,
      companyName: prev.companyName || profile.company,
      documentType: profile.documentType || prev.documentType,
      documentNumber: prev.documentNumber || profile.documentNumber,
      contactPreference: profile.contactPreference || prev.contactPreference,
    }))
  }, [account.isLoaded, account.profile])

  const activeStep = successQuote || isSubmitting ? 3 : quote.count > 0 ? 2 : 1

  const totalNotesLength = formData.generalNotes.length

  const summaryItems = useMemo(() => quote.quote.items, [quote.quote.items])

  const updateField = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof QuoteFormData, string>> = {}

    if (formData.contactName.trim().length < 2) {
      nextErrors.contactName = 'Ingresa tu nombre completo'
    }
    if (!formData.contactEmail.trim()) {
      nextErrors.contactEmail = 'Ingresa tu correo'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      nextErrors.contactEmail = 'Ingresa un correo válido'
    }
    if (formData.contactPhone.replace(/\D/g, '').length < 6) {
      nextErrors.contactPhone = 'Ingresa un teléfono válido'
    }
    if (formData.documentNumber.trim() && !isValidDocument(formData.documentType, formData.documentNumber)) {
      nextErrors.documentNumber =
        formData.documentType === 'dni' ? 'El DNI debe tener 8 dígitos' : 'El RUC debe tener 11 dígitos'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0]
      document.getElementById(`quote-${firstField}`)?.focus()
      return false
    }

    return true
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (quote.count === 0 || isSubmitting) return
    if (!validateForm()) return

    setSubmitError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/cotizacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: formData.contactName.trim(),
          contactEmail: formData.contactEmail.trim(),
          contactPhone: formData.contactPhone.trim(),
          companyName: formData.companyName.trim() || undefined,
          documentType: formData.documentNumber.trim() ? formData.documentType : undefined,
          documentNumber: onlyDigits(formData.documentNumber) || undefined,
          contactPreference: formData.contactPreference,
          generalNotes: formData.generalNotes.trim() || undefined,
          items: quote.quote.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            quantity: item.quantity,
          })),
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | {
            success?: boolean
            message?: string
            data?: { id?: string; code?: string; createdAt?: string }
          }
        | null

      if (!response.ok || !payload?.success || !payload.data?.code) {
        setSubmitError(
          payload?.message ??
            'No pudimos registrar tu solicitud en este momento. Inténtalo nuevamente.'
        )
        return
      }

      const savedQuote: SavedQuote = {
        id: payload.data.id ?? `quote_${Date.now()}`,
        code: payload.data.code,
        createdAt: payload.data.createdAt ?? new Date().toISOString(),
        status: 'enviada',
        items: quote.quote.items,
        itemCount: quote.count,
        contactName: formData.contactName.trim(),
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        companyName: formData.companyName.trim() || undefined,
        documentType: formData.documentNumber.trim() ? formData.documentType : undefined,
        documentNumber: onlyDigits(formData.documentNumber) || undefined,
        contactPreference: formData.contactPreference,
        generalNotes: formData.generalNotes.trim() || undefined,
      }

      account.saveProfile({
        name: savedQuote.contactName,
        email: savedQuote.contactEmail,
        phone: savedQuote.contactPhone,
        company: savedQuote.companyName ?? '',
        documentType: savedQuote.documentType ?? formData.documentType,
        documentNumber: savedQuote.documentNumber ?? '',
        contactPreference: savedQuote.contactPreference,
        createdAt: account.profile?.createdAt,
      })
      account.addQuote(savedQuote)
      quote.clearQuote()
      setSuccessQuote(savedQuote)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError(
        'No pudimos conectar con el servicio de cotizaciones. Revisa tu conexión e inténtalo nuevamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetQuote = () => {
    quote.clearQuote()
    setSuccessQuote(null)
    setFormData((prev) => ({ ...prev, generalNotes: '' }))
  }

  const handleDownloadPdf = async (quoteToDownload: SavedQuote) => {
    setIsDownloading(true)
    try {
      await downloadQuotePdf(quoteToDownload)
    } finally {
      setIsDownloading(false)
    }
  }

  if (successQuote) {
    return (
      <main className="min-h-screen bg-muted text-foreground">
        <EnhancedHeader quoteCount={quote.count} />

        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
            <Link href="/" className="font-semibold hover:text-blue-ink">
              Inicio
            </Link>
            <span>/</span>
            <span className="font-semibold text-foreground">Cotización</span>
          </div>
        </div>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-6 text-center sm:p-10">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-tint-green text-success">
              <Check className="size-10" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">
              Solicitud registrada
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">¡Gracias por tu solicitud!</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Un asesor revisará tu cotización y se pondrá en contacto contigo en menos de 24 horas
              hábiles. Guarda tu código para dar seguimiento.
            </p>

            <div className="mx-auto mt-6 w-fit rounded-xl border border-border bg-muted px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Código de cotización
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-foreground">{successQuote.code}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {formatQuoteDate(successQuote.createdAt)}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-muted p-5 text-left">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <ShoppingCart className="size-4 text-blue-ink" /> Resumen
                </h2>
                <span className="text-xs font-semibold text-muted-foreground">
                  {successQuote.itemCount} producto(s)
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {successQuote.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="size-11 shrink-0 rounded-lg bg-muted object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-bold">{item.productName}</p>
                      <p className="text-[10px] text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Contacto</dt>
                  <dd className="font-semibold">{successQuote.contactName}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="truncate font-semibold">{successQuote.contactEmail}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Teléfono</dt>
                  <dd className="font-semibold">{successQuote.contactPhone}</dd>
                </div>
                {successQuote.documentNumber && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{documentLabel(successQuote.documentType)}</dt>
                    <dd className="font-semibold">{successQuote.documentNumber}</dd>
                  </div>
                )}
                {successQuote.companyName && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Empresa</dt>
                    <dd className="truncate font-semibold">{successQuote.companyName}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <a
                href={buildQuoteWhatsAppUrl(successQuote)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-success/35 bg-tint-green px-5 text-sm font-bold text-success transition hover:bg-success/15"
              >
                <MessageCircle className="size-4" /> Enviar por WhatsApp
              </a>
              <button
                type="button"
                onClick={() => handleDownloadPdf(successQuote)}
                disabled={isDownloading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-muted-foreground transition hover:border-[#1769AA]/40 hover:text-blue-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDownloading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                {isDownloading ? 'Generando PDF...' : 'Descargar PDF'}
              </button>
              <Link
                href="/mi-cuenta#cotizaciones"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1769AA] px-5 text-sm font-bold text-white transition hover:bg-[#12568C]"
              >
                Ver mis cotizaciones <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
              <button type="button" onClick={resetQuote} className="hover:text-blue-ink">
                Nueva cotización
              </button>
              <Link href={storeUrl('/productos')} className="hover:text-blue-ink">
                Seguir en la tienda
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted text-foreground">
      <EnhancedHeader quoteCount={quote.count} onQuoteClick={() => setShowQuote(true)} />

      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold hover:text-blue-ink">
            Inicio
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">Cotización</span>
        </div>
      </div>

      <section
        id="cotizacion-formulario"
        className="mx-auto max-w-[1280px] scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-28 px-4 pb-8 pt-2 sm:px-6 lg:px-8 lg:pb-12"
      >
        {/* Pasos */}
        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
          {steps.map((step) => {
            const completed = step.id < activeStep
            const active = step.id === activeStep
            return (
              <li
                key={step.id}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                  active
                    ? 'border-[#1769AA] bg-card shadow-sm shadow-[#1769AA]/10'
                    : 'border-border bg-card/60'
                }`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    completed
                      ? 'bg-[#1769AA] text-white'
                      : active
                        ? 'bg-tint-blue text-blue-ink'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {completed ? <Check className="size-4" /> : step.id}
                </span>
                <div>
                  <p className={`text-xs font-bold ${active || completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          {/* Formulario */}
          <form
            id="quote-form"
            onSubmit={handleSubmit}
            className="scroll-mt-32 space-y-5"
            noValidate
          >
            <span id="cotizacion-formulario" className="sr-only">
              Formulario de cotización
            </span>
            <fieldset disabled={isSubmitting} className="space-y-5">
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                    <UserRound className="size-4.5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold">Datos de contacto</h2>
                    <p className="text-[11px] text-muted-foreground">
                      {account.profile
                        ? 'Prellenamos tus datos guardados. Puedes editarlos.'
                        : 'Los usaremos para enviarte la propuesta.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-foreground">
                    Nombre completo *
                    <input
                      id="quote-contactName"
                      value={formData.contactName}
                      onChange={(event) => updateField('contactName', event.target.value)}
                      placeholder="Tu nombre"
                      autoComplete="name"
                      className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${
                        errors.contactName
                          ? 'border-destructive focus:border-destructive'
                          : 'border-border focus:border-[#1769AA]'
                      }`}
                    />
                    {errors.contactName && (
                      <span className="mt-1 block text-[10px] font-normal text-destructive">
                        {errors.contactName}
                      </span>
                    )}
                  </label>

                  <label className="block text-xs font-semibold text-foreground">
                    Teléfono *
                    <input
                      id="quote-contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(event) => updateField('contactPhone', event.target.value)}
                      placeholder="+51 999 999 999"
                      autoComplete="tel"
                      className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${
                        errors.contactPhone
                          ? 'border-destructive focus:border-destructive'
                          : 'border-border focus:border-[#1769AA]'
                      }`}
                    />
                    {errors.contactPhone && (
                      <span className="mt-1 block text-[10px] font-normal text-destructive">
                        {errors.contactPhone}
                      </span>
                    )}
                  </label>

                  <label className="block text-xs font-semibold text-foreground sm:col-span-2">
                    Correo electrónico *
                    <input
                      id="quote-contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(event) => updateField('contactEmail', event.target.value)}
                      placeholder="tu@email.com"
                      autoComplete="email"
                      className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${
                        errors.contactEmail
                          ? 'border-destructive focus:border-destructive'
                          : 'border-border focus:border-[#1769AA]'
                      }`}
                    />
                    {errors.contactEmail && (
                      <span className="mt-1 block text-[10px] font-normal text-destructive">
                        {errors.contactEmail}
                      </span>
                    )}
                  </label>

                  <label className="block text-xs font-semibold text-foreground sm:col-span-2">
                    ¿Cómo prefieres que te contactemos?
                    <select
                      value={formData.contactPreference}
                      onChange={(event) =>
                        updateField('contactPreference', event.target.value as ContactPreference)
                      }
                      className="mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm font-normal outline-none transition focus:border-[#1769AA]"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Llamada telefónica</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                    <Building2 className="size-4.5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold">
                      Empresa y documento <span className="font-normal text-muted-foreground">(opcional)</span>
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Para cotizaciones corporativas o si necesitas factura. Si eres persona natural, usa DNI.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-foreground sm:col-span-2">
                    Empresa <span className="font-normal text-muted-foreground">(opcional)</span>
                    <input
                      value={formData.companyName}
                      onChange={(event) => updateField('companyName', event.target.value)}
                      placeholder="Nombre de tu empresa"
                      autoComplete="organization"
                      className="mt-1.5 h-11 w-full rounded-xl border border-border px-3 text-sm font-normal outline-none transition focus:border-[#1769AA]"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-foreground">
                    Tipo de documento
                    <select
                      value={formData.documentType}
                      onChange={(event) => updateField('documentType', event.target.value as DocumentType)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm font-normal outline-none transition focus:border-[#1769AA]"
                    >
                      <option value="ruc">RUC (empresa)</option>
                      <option value="dni">DNI (persona natural)</option>
                    </select>
                  </label>

                  <label className="block text-xs font-semibold text-foreground">
                    Número de documento <span className="font-normal text-muted-foreground">(opcional)</span>
                    <input
                      id="quote-documentNumber"
                      inputMode="numeric"
                      maxLength={11}
                      value={formData.documentNumber}
                      onChange={(event) => updateField('documentNumber', onlyDigits(event.target.value))}
                      placeholder={formData.documentType === 'dni' ? '12345678' : '20123456789'}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${
                        errors.documentNumber
                          ? 'border-destructive focus:border-destructive'
                          : 'border-border focus:border-[#1769AA]'
                      }`}
                    />
                    {errors.documentNumber && (
                      <span className="mt-1 block text-[10px] font-normal text-destructive">
                        {errors.documentNumber}
                      </span>
                    )}
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                    <ClipboardList className="size-4.5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold">Detalles del proyecto</h2>
                    <p className="text-[11px] text-muted-foreground">Ayúdanos a preparar una mejor propuesta.</p>
                  </div>
                </div>

                <label className="mt-5 block text-xs font-semibold text-foreground">
                  Comentarios
                  <textarea
                    value={formData.generalNotes}
                    onChange={(event) => updateField('generalNotes', event.target.value.slice(0, 500))}
                    rows={4}
                    placeholder="Presupuesto estimado, fecha requerida, uso de los equipos, etc."
                    className="mt-1.5 w-full resize-none rounded-xl border border-border px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[#1769AA]"
                  />
                </label>
                <p className="mt-1 text-right text-[10px] text-muted-foreground">{totalNotesLength}/500</p>
              </section>
            </fieldset>

            <p className="text-[10px] leading-5 text-muted-foreground">
              * Campos obligatorios. Al enviar esta solicitud aceptas que te contactemos para
              proporcionar más información sobre los productos cotizados.
            </p>
          </form>

          {/* Resumen */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <ShoppingCart className="size-4 text-blue-ink" /> Resumen de cotización
                </h2>
                {quote.count > 0 && (
                  <span className="rounded-full bg-tint-blue px-2.5 py-1 text-[10px] font-bold text-blue-ink">
                    {quote.count} producto(s)
                  </span>
                )}
              </div>

              {summaryItems.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-input px-4 py-8 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                    <ShoppingCart className="size-5" />
                  </span>
                  <p className="mt-3 text-sm font-bold">Tu cotización está vacía</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Explora la tienda y agrega los equipos que necesitas.
                  </p>
                  <Link
                    href={storeUrl('/productos')}
                    className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#1769AA] text-xs font-bold text-white transition hover:bg-[#12568C]"
                  >
                    Ir a la tienda <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="mt-5 space-y-3">
                    {summaryItems.map((item) => (
                      <li key={item.productId} className="rounded-xl border border-border p-3">
                        <div className="flex gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="size-14 shrink-0 rounded-lg bg-muted object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-xs font-bold leading-4">
                              {item.productName}
                            </p>
                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                              {item.productModel || item.productSku || 'Producto'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => quote.removeItem(item.productId)}
                            disabled={isSubmitting}
                            aria-label={`Eliminar ${item.productName}`}
                            className="self-start text-muted-foreground transition hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 rounded-lg border border-border">
                            <button
                              type="button"
                              onClick={() => quote.updateItemQuantity(item.productId, item.quantity - 1)}
                              disabled={isSubmitting}
                              aria-label={`Quitar una unidad de ${item.productName}`}
                              className="grid size-7 place-items-center text-muted-foreground transition hover:text-blue-ink disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus className="size-3" />
                            </button>
                            <QuantityInput
                              value={item.quantity}
                              onChange={(qty) => quote.updateItemQuantity(item.productId, qty)}
                              ariaLabel={`Cantidad de ${item.productName}`}
                              disabled={isSubmitting}
                              className="h-7 w-10 rounded-md text-xs font-bold text-foreground focus:bg-tint-blue"
                            />
                            <button
                              type="button"
                              onClick={() => quote.updateItemQuantity(item.productId, item.quantity + 1)}
                              disabled={isSubmitting}
                              aria-label={`Agregar una unidad de ${item.productName}`}
                              className="grid size-7 place-items-center text-muted-foreground transition hover:text-blue-ink disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => quote.updateItemQuantity(item.productId, 0)}
                            disabled={isSubmitting}
                            className="text-[10px] font-semibold text-muted-foreground hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Quitar
                          </button>
                        </div>

                        <input
                          value={item.notes ?? ''}
                          onChange={(event) => quote.updateItemNotes(item.productId, event.target.value)}
                          disabled={isSubmitting}
                          placeholder="Nota para este producto (opcional)"
                          className="mt-2.5 h-8 w-full rounded-lg border border-border bg-muted px-2.5 text-[11px] outline-none transition placeholder:text-muted-foreground focus:border-[#1769AA] focus:bg-card disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total de productos</span>
                      <span className="font-bold">{quote.count}</span>
                    </div>
                    <p className="rounded-lg bg-muted px-3 py-2 text-[10px] leading-4 text-muted-foreground">
                      Los precios y la disponibilidad se confirman en la propuesta del asesor.
                    </p>
                  </div>

                  {submitError ? (
                    <p
                      role="alert"
                      className="mt-3 rounded-lg border border-destructive/35 bg-tint-red px-3 py-2 text-[11px] leading-4 text-destructive"
                    >
                      {submitError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    form="quote-form"
                    disabled={isSubmitting}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1769AA] text-sm font-bold text-white transition hover:bg-[#12568C] disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
                  >
                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {isSubmitting ? 'Enviando solicitud...' : 'Enviar solicitud de cotización'}
                  </button>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => quote.clearQuote()}
                      disabled={isSubmitting}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[10px] font-bold text-muted-foreground transition hover:bg-tint-red hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="size-3" /> Vaciar
                    </button>
                    <Link
                      href={storeUrl('/productos')}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[10px] font-bold text-blue-ink transition hover:bg-tint-blue"
                    >
                      <ChevronLeft className="size-3" /> Agregar más
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-tint-green text-success">
                <Mail className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold">Respuesta en menos de 24 horas</p>
                <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                  También puedes escribirnos a ventas@fjsolutions.pe o llamarnos al +51 999 888 777.
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] font-semibold text-muted-foreground">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <Phone className="size-3.5 text-blue-ink" /> Asesoría real
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <Check className="size-3.5 text-blue-ink" /> Sin compromiso
              </div>
            </div>
          </aside>
        </div>
      </section>

      {showQuote && (
        <QuotePanel
          items={quote.quote.items}
          count={quote.count}
          onClose={() => setShowQuote(false)}
          onAdd={quote.addItem}
          onRemove={quote.removeItem}
          onSetQty={quote.updateItemQuantity}
          onUpdateNotes={quote.updateItemNotes}
        />
      )}
    </main>
  )
}
