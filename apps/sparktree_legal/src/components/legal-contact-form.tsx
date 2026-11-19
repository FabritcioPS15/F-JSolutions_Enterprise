'use client'

import { useState } from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { PRACTICE_AREAS } from '@/lib/legal-content'

export function LegalContactForm({ whatsapp, email }: { whatsapp: string; email: string }) {
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [detail, setDetail] = useState('')

  const cleanName = name.trim().replace(/\.+$/, '')

  const message = [
    'Hola SparkTree Legal, quisiera coordinar una consulta.',
    cleanName ? `Soy ${cleanName}.` : '',
    area ? `Materia: ${area}.` : '',
    detail.trim() ? `Resumen del caso: ${detail.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
  const mailSubject = `Consulta legal${area ? ` · ${area}` : ''}`
  const mailHref = `mailto:${email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(message)}`

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="rounded-2xl border border-bone-200 bg-white p-6 shadow-[0_30px_70px_-55px_rgba(32,44,57,0.55)] sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="legal-name"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500"
          >
            Nombre o empresa <span className="font-normal normal-case tracking-normal">(opcional)</span>
          </label>
          <input
            id="legal-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Comercial Andina S.A.C."
            className="mt-2 w-full rounded-lg border border-bone-200 bg-bone-50 px-3.5 py-2.5 text-sm text-navy-800 outline-none transition placeholder:text-ink-400 focus:border-gold-500 focus:bg-white focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
        <div>
          <label
            htmlFor="legal-area"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500"
          >
            Materia
          </label>
          <select
            id="legal-area"
            value={area}
            onChange={(event) => setArea(event.target.value)}
            className="mt-2 w-full rounded-lg border border-bone-200 bg-bone-50 px-3.5 py-2.5 text-sm text-navy-800 outline-none transition focus:border-gold-500 focus:bg-white focus:ring-2 focus:ring-gold-500/20"
          >
            <option value="">Selecciona una materia</option>
            {PRACTICE_AREAS.map((item) => (
              <option key={item.slug} value={item.title}>
                {item.title}
              </option>
            ))}
            <option value="Otra materia">Otra materia / no estoy seguro</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="legal-detail"
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500"
        >
          Resumen del caso
        </label>
        <textarea
          id="legal-detail"
          rows={5}
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          placeholder="Ej. Necesito revisar un contrato de servicios antes de firmarlo."
          className="mt-2 w-full resize-none rounded-lg border border-bone-200 bg-bone-50 px-3.5 py-3 text-sm leading-relaxed text-navy-800 outline-none transition placeholder:text-ink-400 focus:border-gold-500 focus:bg-white focus:ring-2 focus:ring-gold-500/20"
        />
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
        >
          <MessageCircle className="size-4" />
          Preparar mensaje en WhatsApp
        </a>
        <a
          href={mailHref}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-bone-200 px-4 py-3 text-sm font-semibold text-navy-800 transition hover:border-gold-500 hover:bg-bone-50"
        >
          <Mail className="size-4" />
          Enviar por correo
        </a>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        Se abrirá la aplicación con el mensaje listo para enviar. No guardamos tu consulta en este
        sitio.
      </p>
    </form>
  )
}
