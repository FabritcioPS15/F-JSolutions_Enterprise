'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react'

type ContactFormData = {
  name: string
  company: string
  email: string
  phone: string
  topic: string
  message: string
}

type FieldErrors = Partial<Record<keyof ContactFormData, string>>

const initialForm: ContactFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  topic: 'cotizacion',
  message: '',
}

const topics = [
  { value: 'cotizacion', label: 'Cotización de equipos' },
  { value: 'soporte', label: 'Soporte TI' },
  { value: 'software', label: 'Proyecto de software' },
  { value: 'infraestructura', label: 'Redes e infraestructura' },
  { value: 'otro', label: 'Otro tema' },
]

const fieldClass =
  'mt-1.5 h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-normal text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState('')

  const updateField = (field: keyof ContactFormData, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }))
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: undefined }))
    }
    if (status === 'error') {
      setStatus('idle')
      setServerMessage('')
    }
  }

  const validate = () => {
    const nextErrors: FieldErrors = {}

    if (form.name.trim().length < 2) {
      nextErrors.name = 'Indícanos tu nombre.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Ingresa un correo válido.'
    }

    if (form.message.trim().length < 10) {
      nextErrors.message = 'Cuéntanos un poco más (mínimo 10 caracteres).'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending' || !validate()) return

    setStatus('sending')
    setServerMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          topic: form.topic,
          message: form.message.trim(),
        }),
      })

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null

      if (!response.ok || !data?.success) {
        throw new Error(data?.message ?? 'No pudimos enviar tu mensaje. Inténtalo nuevamente.')
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setServerMessage(
        error instanceof Error
          ? error.message
          : 'No pudimos enviar tu mensaje. Escríbenos directamente a ventas@fjsolutions.pe.',
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-[#BBF7D0] bg-white p-6 text-center shadow-[0_24px_60px_-46px_rgba(15,23,42,0.35)] sm:p-8">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#F0FDF4] text-[#15803D]">
          <CheckCircle2 aria-hidden="true" className="size-7" />
        </span>
        <h3 className="mt-4 font-heading text-xl font-bold tracking-[-0.03em] text-[#0F172A]">
          Mensaje enviado
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#475569]">
          Gracias{form.name ? `, ${form.name.split(' ')[0]}` : ''}. Recibimos tu consulta y te
          responderemos a <span className="font-semibold text-[#0F172A]">{form.email}</span> en
          menos de 24 horas hábiles.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setForm(initialForm)
              setErrors({})
              setStatus('idle')
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-bold text-[#0F172A] transition hover:border-[#2563EB]/40 hover:text-[#1D4ED8]"
          >
            Enviar otro mensaje
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
          >
            Volver al inicio
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.35)] sm:p-7"
    >
      <div>
        <h2 className="font-heading text-lg font-bold tracking-[-0.03em] text-[#0F172A]">
          Cuéntanos qué necesitas
        </h2>
        <p className="mt-1 text-xs leading-5 text-[#64748B]">
          Los campos con <span aria-hidden="true">*</span> son obligatorios.
        </p>
      </div>

      <fieldset disabled={status === 'sending'} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-[#0F172A]">
            Nombre completo *
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Tu nombre"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className={`${fieldClass} ${errors.name ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''}`}
            />
            {errors.name && (
              <span id="contact-name-error" className="mt-1 block text-[10px] font-normal text-[#EF4444]">
                {errors.name}
              </span>
            )}
          </label>

          <label className="block text-xs font-semibold text-[#0F172A]">
            Empresa
            <input
              value={form.company}
              onChange={(event) => updateField('company', event.target.value)}
              placeholder="Nombre de tu empresa"
              autoComplete="organization"
              className={fieldClass}
            />
          </label>

          <label className="block text-xs font-semibold text-[#0F172A]">
            Correo electrónico *
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="tu@empresa.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className={`${fieldClass} ${errors.email ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''}`}
            />
            {errors.email && (
              <span id="contact-email-error" className="mt-1 block text-[10px] font-normal text-[#EF4444]">
                {errors.email}
              </span>
            )}
          </label>

          <label className="block text-xs font-semibold text-[#0F172A]">
            Teléfono
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="+51 999 999 999"
              autoComplete="tel"
              className={fieldClass}
            />
          </label>

          <label className="block text-xs font-semibold text-[#0F172A] sm:col-span-2">
            ¿En qué podemos ayudarte?
            <select
              value={form.topic}
              onChange={(event) => updateField('topic', event.target.value)}
              className={fieldClass}
            >
              {topics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold text-[#0F172A] sm:col-span-2">
            Mensaje *
            <textarea
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              placeholder="Describe tu necesidad, la cantidad de equipos, la sede o el problema que quieres resolver..."
              rows={5}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className={`mt-1.5 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm font-normal text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 ${
                errors.message ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : ''
              }`}
            />
            {errors.message && (
              <span id="contact-message-error" className="mt-1 block text-[10px] font-normal text-[#EF4444]">
                {errors.message}
              </span>
            )}
          </label>
        </div>

        {status === 'error' && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3 text-[11px] leading-4 text-[#B91C1C]"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>
              {serverMessage} También puedes escribirnos a{' '}
              <a href="mailto:ventas@fjsolutions.pe" className="font-bold underline">
                ventas@fjsolutions.pe
              </a>
              .
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-[0_12px_28px_-16px_rgba(37,99,235,0.75)] transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'sending' ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Enviando mensaje...
            </>
          ) : (
            <>
              Enviar mensaje
              <Send aria-hidden="true" className="size-4" />
            </>
          )}
        </button>

        <p className="text-[10px] leading-4 text-[#94A3B8]">
          Usamos tus datos únicamente para responder tu solicitud. No compartimos tu información con
          terceros.
        </p>
      </fieldset>
    </form>
  )
}
