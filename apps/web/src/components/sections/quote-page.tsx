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
import {
  buildQuoteCode,
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
  const [isDownloading, setIsDownloading] = useState(false)
  const [successQuote, setSuccessQuote] = useState<SavedQuote | null>(null)
  const [formData, setFormData] = useState<QuoteFormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({})
  const [prefilled, setPrefilled] = useState(false)

  useEffect(() => {
    if (prefilled || !account.isLoaded) return

    const profile = account.profile
    if (profile) {
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
    }
    setPrefilled(true)
  }, [account.isLoaded, account.profile, prefilled])

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (quote.count === 0 || isSubmitting) return
    if (!validateForm()) return

    setIsSubmitting(true)

    const now = new Date()
    const savedQuote: SavedQuote = {
      id: `quote_${now.getTime()}`,
      code: buildQuoteCode(now),
      createdAt: now.toISOString(),
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

    // Simulación de envío: guarda el perfil y la cotización en el navegador.
    window.setTimeout(() => {
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
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 900)
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
      <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <EnhancedHeader quoteCount={quote.count} />

        <div className="border-b border-[#E2E8F0] bg-white">
          <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-[#475569] sm:px-6 lg:px-8">
            <Link href="/" className="font-semibold hover:text-[#2563EB]">
              Inicio
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A]">Cotización</span>
          </div>
        </div>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 text-center sm:p-10">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#F0FDF4] text-[#15803D]">
              <Check className="size-10" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
              Solicitud registrada
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">¡Gracias por tu solicitud!</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#475569]">
              Un asesor revisará tu cotización y se pondrá en contacto contigo en menos de 24 horas
              hábiles. Guarda tu código para dar seguimiento.
            </p>

            <div className="mx-auto mt-6 w-fit rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Código de cotización
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-[#0F172A]">{successQuote.code}</p>
              <p className="mt-1 text-[11px] text-[#64748B]">
                {formatQuoteDate(successQuote.createdAt)}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-left">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <ShoppingCart className="size-4 text-[#2563EB]" /> Resumen
                </h2>
                <span className="text-xs font-semibold text-[#64748B]">
                  {successQuote.itemCount} producto(s)
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {successQuote.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-2.5"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="size-11 shrink-0 rounded-lg bg-[#F1F5F9] object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-bold">{item.productName}</p>
                      <p className="text-[10px] text-[#64748B]">Cantidad: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-1.5 border-t border-[#E2E8F0] pt-4 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#64748B]">Contacto</dt>
                  <dd className="font-semibold">{successQuote.contactName}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#64748B]">Email</dt>
                  <dd className="truncate font-semibold">{successQuote.contactEmail}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#64748B]">Teléfono</dt>
                  <dd className="font-semibold">{successQuote.contactPhone}</dd>
                </div>
                {successQuote.documentNumber && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#64748B]">{documentLabel(successQuote.documentType)}</dt>
                    <dd className="font-semibold">{successQuote.documentNumber}</dd>
                  </div>
                )}
                {successQuote.companyName && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#64748B]">Empresa</dt>
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
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-5 text-sm font-bold text-[#15803D] transition hover:bg-[#DCFCE7]"
              >
                <MessageCircle className="size-4" /> Enviar por WhatsApp
              </a>
              <button
                type="button"
                onClick={() => handleDownloadPdf(successQuote)}
                disabled={isDownloading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 text-sm font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
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
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Ver mis cotizaciones <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#64748B]">
              <button type="button" onClick={resetQuote} className="hover:text-[#2563EB]">
                Nueva cotización
              </button>
              <Link href="/productos" className="hover:text-[#2563EB]">
                Seguir explorando
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <EnhancedHeader quoteCount={quote.count} onQuoteClick={() => setShowQuote(true)} />

      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-[#475569] sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold hover:text-[#2563EB]">
            Inicio
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A]">Cotización</span>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
            Cotización personalizada
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Completa tu solicitud de cotización
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#475569]">
            Revisa tus productos, cuéntanos cómo contactarte y un asesor preparará una propuesta a
            tu medida.
          </p>
        </div>

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
                    ? 'border-[#2563EB] bg-white shadow-sm shadow-[#2563EB]/10'
                    : 'border-[#E2E8F0] bg-white/60'
                }`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    completed
                      ? 'bg-[#2563EB] text-white'
                      : active
                        ? 'bg-[#EFF6FF] text-[#2563EB]'
                        : 'bg-[#F1F5F9] text-[#94A3B8]'
                  }`}
                >
                  {completed ? <Check className="size-4" /> : step.id}
                </span>
                <div>
                  <p className={`text-xs font-bold ${active || completed ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-[#94A3B8]">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          {/* Formulario */}
          <form id="quote-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
            <fieldset disabled={isSubmitting} className="space-y-5">
              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <UserRound className="size-4.5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold">Datos de contacto</h2>
                    <p className="text-[11px] text-[#64748B]">
                      {account.profile
                        ? 'Prellenamos tus datos guardados. Puedes editarlos.'
                        : 'Los usaremos para enviarte la propuesta.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-[#0F172A]">
                    Nombre completo *
                    <input
                      id="quote-contactName"
                      value={formData.contactName}
                      onChange={(event) => updateField('contactName', event.target.value)}
                      placeholder="Tu nombre"
                      autoComplete="name"
                      className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${
                        errors.contactName
                          ? 'border-[#EF4444] focus:border-[#EF4444]'
                          : 'border-[#E2E8F0] focus:border-[#2563EB]'
                      }`}
                    />
                    {errors.contactName && (
                      <span className="mt-1 block text-[10px] font-normal text-[#EF4444]">
                        {errors.contactName}
                      </span>
                    )}
                  </label>

                  <label className="block text-xs font-semibold text-[#0F172A]">
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
                          ? 'border-[#EF4444] focus:border-[#EF4444]'
                          : 'border-[#E2E8F0] focus:border-[#2563EB]'
                      }`}
                    />
                    {errors.contactPhone && (
                      <span className="mt-1 block text-[10px] font-normal text-[#EF4444]">
                        {errors.contactPhone}
                      </span>
                    )}
                  </label>

                  <label className="block text-xs font-semibold text-[#0F172A] sm:col-span-2">
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
                          ? 'border-[#EF4444] focus:border-[#EF4444]'
                          : 'border-[#E2E8F0] focus:border-[#2563EB]'
                      }`}
                    />
                    {errors.contactEmail && (
                      <span className="mt-1 block text-[10px] font-normal text-[#EF4444]">
                        {errors.contactEmail}
                      </span>
                    )}
                  </label>

                  <label className="block text-xs font-semibold text-[#0F172A] sm:col-span-2">
                    ¿Cómo prefieres que te contactemos?
                    <select
                      value={formData.contactPreference}
                      onChange={(event) =>
                        updateField('contactPreference', event.target.value as ContactPreference)
                      }
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#2563EB]"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Llamada telefónica</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <Building2 className="size-4.5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold">
                      Empresa y documento <span className="font-normal text-[#94A3B8]">(opcional)</span>
                    </h2>
                    <p className="text-[11px] text-[#64748B]">
                      Para cotizaciones corporativas o si necesitas factura. Si eres persona natural, usa DNI.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-[#0F172A] sm:col-span-2">
                    Empresa <span className="font-normal text-[#94A3B8]">(opcional)</span>
                    <input
                      value={formData.companyName}
                      onChange={(event) => updateField('companyName', event.target.value)}
                      placeholder="Nombre de tu empresa"
                      autoComplete="organization"
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-normal outline-none transition focus:border-[#2563EB]"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-[#0F172A]">
                    Tipo de documento
                    <select
                      value={formData.documentType}
                      onChange={(event) => updateField('documentType', event.target.value as DocumentType)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#2563EB]"
                    >
                      <option value="ruc">RUC (empresa)</option>
                      <option value="dni">DNI (persona natural)</option>
                    </select>
                  </label>

                  <label className="block text-xs font-semibold text-[#0F172A]">
                    Número de documento <span className="font-normal text-[#94A3B8]">(opcional)</span>
                    <input
                      id="quote-documentNumber"
                      inputMode="numeric"
                      maxLength={11}
                      value={formData.documentNumber}
                      onChange={(event) => updateField('documentNumber', onlyDigits(event.target.value))}
                      placeholder={formData.documentType === 'dni' ? '12345678' : '20123456789'}
                      className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${
                        errors.documentNumber
                          ? 'border-[#EF4444] focus:border-[#EF4444]'
                          : 'border-[#E2E8F0] focus:border-[#2563EB]'
                      }`}
                    />
                    {errors.documentNumber && (
                      <span className="mt-1 block text-[10px] font-normal text-[#EF4444]">
                        {errors.documentNumber}
                      </span>
                    )}
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <ClipboardList className="size-4.5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold">Detalles del proyecto</h2>
                    <p className="text-[11px] text-[#64748B]">Ayúdanos a preparar una mejor propuesta.</p>
                  </div>
                </div>

                <label className="mt-5 block text-xs font-semibold text-[#0F172A]">
                  Comentarios
                  <textarea
                    value={formData.generalNotes}
                    onChange={(event) => updateField('generalNotes', event.target.value.slice(0, 500))}
                    rows={4}
                    placeholder="Presupuesto estimado, fecha requerida, uso de los equipos, etc."
                    className="mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[#2563EB]"
                  />
                </label>
                <p className="mt-1 text-right text-[10px] text-[#94A3B8]">{totalNotesLength}/500</p>
              </section>
            </fieldset>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || quote.count === 0}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#94A3B8] sm:flex-none sm:min-w-[260px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Enviando solicitud...
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> Enviar solicitud de cotización
                  </>
                )}
              </button>
              {quote.count === 0 && (
                <Link href="/productos" className="text-xs font-bold text-[#2563EB] hover:underline">
                  Agrega productos para continuar
                </Link>
              )}
            </div>

            <p className="text-[10px] leading-5 text-[#64748B]">
              * Campos obligatorios. Al enviar esta solicitud aceptas que te contactemos para
              proporcionar más información sobre los productos cotizados.
            </p>
          </form>

          {/* Resumen */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <ShoppingCart className="size-4 text-[#2563EB]" /> Resumen de cotización
                </h2>
                {quote.count > 0 && (
                  <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-bold text-[#2563EB]">
                    {quote.count} producto(s)
                  </span>
                )}
              </div>

              {summaryItems.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-[#CBD5E1] px-4 py-8 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <ShoppingCart className="size-5" />
                  </span>
                  <p className="mt-3 text-sm font-bold">Tu cotización está vacía</p>
                  <p className="mt-1 text-xs leading-5 text-[#64748B]">
                    Explora el catálogo y agrega los equipos que necesitas.
                  </p>
                  <Link
                    href="/productos"
                    className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
                  >
                    Ir al catálogo <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="mt-5 space-y-3">
                    {summaryItems.map((item) => (
                      <li key={item.productId} className="rounded-xl border border-[#E2E8F0] p-3">
                        <div className="flex gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="size-14 shrink-0 rounded-lg bg-[#F1F5F9] object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-xs font-bold leading-4">
                              {item.productName}
                            </p>
                            <p className="mt-0.5 text-[10px] text-[#64748B]">
                              {item.productModel || item.productSku || 'Producto'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => quote.removeItem(item.productId)}
                            disabled={isSubmitting}
                            aria-label={`Eliminar ${item.productName}`}
                            className="self-start text-[#94A3B8] transition hover:text-[#EF4444] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0]">
                            <button
                              type="button"
                              onClick={() => quote.updateItemQuantity(item.productId, item.quantity - 1)}
                              disabled={isSubmitting}
                              aria-label={`Quitar una unidad de ${item.productName}`}
                              className="grid size-7 place-items-center text-[#475569] transition hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => quote.updateItemQuantity(item.productId, item.quantity + 1)}
                              disabled={isSubmitting}
                              aria-label={`Agregar una unidad de ${item.productName}`}
                              className="grid size-7 place-items-center text-[#475569] transition hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => quote.updateItemQuantity(item.productId, 0)}
                            disabled={isSubmitting}
                            className="text-[10px] font-semibold text-[#64748B] hover:text-[#EF4444] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Quitar
                          </button>
                        </div>

                        <input
                          value={item.notes ?? ''}
                          onChange={(event) => quote.updateItemNotes(item.productId, event.target.value)}
                          disabled={isSubmitting}
                          placeholder="Nota para este producto (opcional)"
                          className="mt-2.5 h-8 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 text-[11px] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-2 border-t border-[#E2E8F0] pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B]">Total de productos</span>
                      <span className="font-bold">{quote.count}</span>
                    </div>
                    <p className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-[10px] leading-4 text-[#64748B]">
                      Los precios y la disponibilidad se confirman en la propuesta del asesor.
                    </p>
                  </div>

                  <button
                    type="submit"
                    form="quote-form"
                    disabled={isSubmitting}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
                  >
                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {isSubmitting ? 'Enviando...' : 'Enviar cotización'}
                  </button>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => quote.clearQuote()}
                      disabled={isSubmitting}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[10px] font-bold text-[#64748B] transition hover:bg-[#FEF2F2] hover:text-[#EF4444] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="size-3" /> Vaciar
                    </button>
                    <Link
                      href="/productos"
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[10px] font-bold text-[#2563EB] transition hover:bg-[#EFF6FF]"
                    >
                      <ChevronLeft className="size-3" /> Agregar más
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#F0FDF4] text-[#15803D]">
                <Mail className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold">Respuesta en menos de 24 horas</p>
                <p className="mt-0.5 text-[11px] leading-4 text-[#64748B]">
                  También puedes escribirnos a ventas@fjsolutions.pe o llamarnos al +51 999 888 777.
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] font-semibold text-[#475569]">
              <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">
                <Phone className="size-3.5 text-[#2563EB]" /> Asesoría real
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">
                <Check className="size-3.5 text-[#2563EB]" /> Sin compromiso
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
