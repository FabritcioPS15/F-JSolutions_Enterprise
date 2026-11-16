'use client'

import { useState } from 'react'
import { X, CheckCircle2, MessageSquare, Send, Sparkles, BookOpen, Clock, Award } from 'lucide-react'
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

    const text = `¡Hola F&J Academy! 👋\n\nMi nombre es *${name.trim() || 'un estudiante interesado'}*.\nQuiero solicitar informes e inscripción para el programa:\n📚 *${activeCourse.title}*\n\n📧 Correo: ${email || 'No especificado'}\n📱 Teléfono: ${phone || 'No especificado'}\n\n¿Tienen vacantes disponibles y facilidades de pago? ¡Gracias!`

    const whatsappUrl = `https://wa.me/51923055963?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-[#0B0F19] p-6 sm:p-8 shadow-2xl text-slate-200 scrollbar-thin">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid size-9 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Cerrar modal"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="pr-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#5B21B6]/20 border border-[#5B21B6]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C4B5FD]">
            <Sparkles className="size-3" />
            Admisiones F&J Academy
          </div>
          <h3 className="mt-3 font-heading text-xl sm:text-2xl font-black text-white">
            Inscripción y Solicitud de Beca
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Completa tus datos para recibir el temario detallado, horarios y reservar tu vacante con descuento especial.
          </p>
        </div>

        {/* Course selection */}
        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Programa de tu interés:
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-[#7C3AED]"
          >
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} — (S/ {c.pricePEN})
              </option>
            ))}
          </select>
        </div>

        {/* Selected course quick info */}
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <span className="font-semibold text-white">{activeCourse.categoryLabel}</span>
            <span className="text-[#A78BFA] font-bold">Inicio: {activeCourse.nextStartDate}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-[#A78BFA]" />
              {activeCourse.duration} ({activeCourse.hours}h)
            </span>
            <span className="flex items-center gap-1">
              <Award className="size-3 text-emerald-400" />
              {activeCourse.certification}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 pt-1">
            <strong>Temario clave:</strong> {activeCourse.syllabus.join(' · ')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre y Apellido *
              </label>
              <input
                required
                type="text"
                placeholder="Ej. Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                WhatsApp / Teléfono *
              </label>
              <input
                required
                type="tel"
                placeholder="Ej. 987 654 321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Correo Electrónico (opcional)
            </label>
            <input
              type="email"
              placeholder="juan@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-900/30 transition hover:brightness-110 active:scale-98"
            >
              <MessageSquare className="size-4" />
              <span>Contactar a Asesor Académico por WhatsApp</span>
            </button>
            <p className="mt-2 text-center text-[10px] text-slate-500">
              Respuesta en menos de 10 minutos. Te enviaremos el brochure y cupón de descuento.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
