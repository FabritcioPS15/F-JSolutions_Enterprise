'use client'

import { useState } from 'react'
import { X, MessageSquare, Clock, Award } from 'lucide-react'
import { COURSES, type Course } from '@/lib/academy-data'

export function EnrollmentModal({
  course,
  onClose,
}: {
  course: Course | null
  onClose: () => void
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(course?.id ?? COURSES[0].id)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const activeCourse = COURSES.find((c) => c.id === selectedCourseId) ?? COURSES[0]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const text = `Hola F&J Academy, soy ${name.trim() || 'un estudiante interesado'}.\nQuiero informes e inscripción para:\n${activeCourse.title}\n\nCorreo: ${email || 'No especificado'}\nTeléfono: ${phone || 'No especificado'}\n\n¿Tienen vacantes y facilidades de pago?`

    const whatsappUrl = `https://wa.me/51923055963?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-xl sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg border border-line text-ink-500 transition hover:bg-surface-muted hover:text-ink-900"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>

        <div className="pr-8">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
            Admisiones
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink-900">
            Solicitud de información y beca
          </h2>
          <p className="mt-1 text-xs text-ink-600">
            Completa tus datos para recibir el temario, horarios y reservar tu vacante.
          </p>
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-xs font-medium text-ink-700" htmlFor="course-select">
            Programa de interés
          </label>
          <select
            id="course-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full rounded-lg border border-line-strong bg-white px-3 py-2 text-xs font-medium text-ink-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          >
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} — S/ {c.pricePEN}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 rounded-lg border border-line bg-surface-muted p-3.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-ink-900">{activeCourse.categoryLabel}</span>
            <span className="text-ink-600">Inicio: {activeCourse.nextStartDate}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-600">
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-ink-400" />
              {activeCourse.duration} ({activeCourse.hours}h)
            </span>
            <span className="flex items-center gap-1">
              <Award className="size-3 text-ink-400" />
              {activeCourse.certification}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-700">
                Nombre y apellido *
              </label>
              <input
                required
                type="text"
                placeholder="Ej. Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-line-strong px-3 py-2 text-xs text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-700">
                WhatsApp o teléfono *
              </label>
              <input
                required
                type="tel"
                placeholder="Ej. 987 654 321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-line-strong px-3 py-2 text-xs text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Correo electrónico (opcional)
            </label>
            <input
              type="email"
              placeholder="juan@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line-strong px-3 py-2 text-xs text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <MessageSquare className="size-4" />
            Consultar por WhatsApp
          </button>
          <p className="text-center text-[11px] text-ink-500">
            Respuesta en menos de 10 minutos. Te enviamos el brochure y el cupón de descuento.
          </p>
        </form>
      </div>
    </div>
  )
}
