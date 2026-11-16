import { Star, Quote, Award, Sparkles, Building2 } from 'lucide-react'
import { TESTIMONIALS, COURSES } from '@/lib/academy-data'

export function TestimonialsAndInstructors() {
  const instructors = COURSES.map((c) => c.instructor).filter(
    (inst, idx, arr) => arr.findIndex((i) => i.name === inst.name) === idx
  )

  return (
    <section id="testimonios" className="relative py-20 bg-slate-950/40 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Instructors */}
        <div id="docentes" className="text-center">
          <span className="rounded-full border border-[#5B21B6]/60 bg-[#1E1B4B]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#C4B5FD]">
            Cuerpo Docente
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-white">
            Ingenieros Líderes en el Sector Tecnológico
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            Aprende con mentores que construyen y resuelven desafíos de arquitectura y seguridad a diario.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {instructors.map((instructor) => (
              <div
                key={instructor.name}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-left"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] text-white font-bold text-lg">
                  {instructor.name.split(' ')[1]?.[0] || 'FJ'}
                </div>
                <h4 className="mt-4 font-heading text-base font-bold text-white">
                  {instructor.name}
                </h4>
                <p className="text-xs text-[#C4B5FD] font-medium">{instructor.role}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Building2 className="size-3 text-slate-500" />
                  <span>{instructor.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-24">
          <div className="text-center">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Casos de Éxito
            </span>
            <h3 className="mt-4 font-heading text-3xl font-extrabold text-white">
              Lo que dicen nuestros egresados
            </h3>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((test) => (
              <div
                key={test.name}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
              >
                <div>
                  <div className="flex text-amber-400 gap-1 mb-3">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300 italic">
                    "{test.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <p className="font-heading text-sm font-bold text-white">{test.name}</p>
                  <p className="text-[11px] text-[#A78BFA]">{test.role}</p>
                  <p className="text-[10px] text-slate-500">{test.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
