'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Minus,
  Plus,
  Send,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { QuotePanel } from '@/components/sections/quote-panel'
import { useQuote } from '@/lib/use-quote'

export default function CotizacionPage() {
  const quote = useQuote()
  const [showQuote, setShowQuote] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    companyName: '',
    companyRuc: '',
    contactPreference: 'email',
    generalNotes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'El nombre es requerido'
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email inválido'
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'El teléfono es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulación de envío - en producción esto sería una llamada real al backend
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (showSuccess) {
    return (
      <main className="min-h-screen bg-white text-[#0F172A]">
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

        <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#22D3EE]/20 text-[#22D3EE]">
              <Check className="size-10" />
            </span>
            <h1 className="mt-6 text-3xl font-bold">¡Solicitud enviada!</h1>
            <p className="mt-4 text-sm leading-6 text-[#475569]">
              Hemos recibido tu solicitud de cotización. Un asesor se pondrá en contacto contigo
              a la brevedad para coordinar los detalles y brindarte la mejor oferta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/productos"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Seguir explorando <ArrowRight className="size-4" />
              </Link>
              <button
                onClick={() => {
                  quote.clearQuote()
                  setShowSuccess(false)
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] px-6 text-sm font-bold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                Nueva cotización
              </button>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
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
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-12">
          {/* Formulario */}
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Completa tu solicitud de cotización</h1>
            <p className="mt-2 text-sm text-[#475569]">
              Proporciona tus datos de contacto para que un asesor pueda atenderte personalmente.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Información de contacto */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.13em] text-[#2563EB]">
                  Información de contacto
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className={`mt-1.5 h-10 w-full rounded-lg border px-3 text-xs outline-none transition ${
                        errors.contactName
                          ? 'border-[#EF4444] focus:border-[#EF4444]'
                          : 'border-[#E2E8F0] focus:border-[#2563EB]'
                      }`}
                      placeholder="Tu nombre"
                    />
                    {errors.contactName && (
                      <p className="mt-1 text-[10px] text-[#EF4444]">{errors.contactName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      className={`mt-1.5 h-10 w-full rounded-lg border px-3 text-xs outline-none transition ${
                        errors.contactPhone
                          ? 'border-[#EF4444] focus:border-[#EF4444]'
                          : 'border-[#E2E8F0] focus:border-[#2563EB]'
                      }`}
                      placeholder="+51 999 999 999"
                    />
                    {errors.contactPhone && (
                      <p className="mt-1 text-[10px] text-[#EF4444]">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A]">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className={`mt-1.5 h-10 w-full rounded-lg border px-3 text-xs outline-none transition ${
                      errors.contactEmail
                        ? 'border-[#EF4444] focus:border-[#EF4444]'
                        : 'border-[#E2E8F0] focus:border-[#2563EB]'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-[10px] text-[#EF4444]">{errors.contactEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A]">
                    Preferencia de contacto
                  </label>
                  <select
                    value={formData.contactPreference}
                    onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs outline-none transition focus:border-[#2563EB]"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Teléfono</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>

              {/* Información de empresa */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.13em] text-[#2563EB]">
                  Información de empresa (opcional)
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-xs outline-none transition focus:border-[#2563EB]"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A]">
                      RUC
                    </label>
                    <input
                      type="text"
                      value={formData.companyRuc}
                      onChange={(e) => handleInputChange('companyRuc', e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-xs outline-none transition focus:border-[#2563EB]"
                      placeholder="20XXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.13em] text-[#2563EB]">
                  Observaciones adicionales
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A]">
                    Comentarios sobre tu solicitud
                  </label>
                  <textarea
                    value={formData.generalNotes}
                    onChange={(e) => handleInputChange('generalNotes', e.target.value)}
                    rows={4}
                    className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs outline-none transition focus:border-[#2563EB] resize-none"
                    placeholder="Cuéntanos más detalles sobre tu proyecto, presupuesto estimado, fechas requeridas, etc."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || quote.count === 0}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#1D4ED8] disabled:bg-[#64748B] disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    <Send className="size-4" /> Enviar solicitud de cotización
                  </>
                )}
              </button>

              <p className="text-[10px] text-[#64748B]">
                * Campos obligatorios. Al enviar esta solicitud, aceptas que te contactemos para
                proporcionar más información sobre los productos cotizados.
              </p>
            </form>
          </div>

          {/* Resumen de cotización */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                <ShoppingCart className="size-4 text-[#2563EB]" />
                Resumen de cotización
              </h2>

              {quote.count === 0 ? (
                <div className="mt-4 text-center">
                  <p className="text-xs text-[#475569]">No tienes productos en tu cotización</p>
                  <Link
                    href="/productos"
                    className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 text-xs font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                  >
                    <ChevronLeft className="size-4" /> Ir al catálogo
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mt-4 space-y-3">
                    {quote.quote.items.map((item) => (
                      <div key={item.productId} className="flex gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="size-14 shrink-0 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-xs font-bold text-[#0F172A]">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-[#64748B]">Cantidad: {item.quantity}</p>
                        </div>
                        <button
                          onClick={() => quote.removeItem(item.productId)}
                          aria-label={`Eliminar ${item.productName}`}
                          className="text-[#475569] transition hover:text-[#0E7490]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-[#E2E8F0] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#475569]">
                        Total de productos
                      </span>
                      <span className="text-xs font-bold text-[#0F172A]">{quote.count}</span>
                    </div>
                  </div>

                  <Link
                    href="/productos"
                    className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 text-xs font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                  >
                    <ChevronLeft className="size-4" /> Agregar más productos
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

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
