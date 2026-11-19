import { Star, Building2 } from 'lucide-react'
import { TESTIMONIALS, COURSES } from '@/lib/academy-data'

export function TestimonialsAndInstructors() {
  const instructors = COURSES.map((c) => c.instructor).filter(
    (inst, idx, arr) => arr.findIndex((i) => i.name === inst.name) === idx
  )

  function initials(name: string) {
    return name
      .split(' ')
      .filter((word) => !word.includes('.'))
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <section id="testimonios" className="bg-surface-muted py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div id="docentes">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Cuerpo docente
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Ingenieros en activo
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Mentores que resuelven desafíos de arquitectura, seguridad e infraestructura todos
              los días.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {instructors.map((instructor) => (
              <div key={instructor.name} className="rounded-xl border border-line bg-white p-4">
                <div className="grid size-10 place-items-center rounded-lg bg-brand-50 text-sm font-semibold text-brand-700">
                  {initials(instructor.name)}
                </div>
                <p className="mt-3 text-sm font-semibold text-ink-900">{instructor.name}</p>
                <p className="text-xs text-ink-600">{instructor.role}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink-500">
                  <Building2 className="size-3 text-ink-400" />
                  {instructor.company}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Casos de éxito
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Lo que dicen nuestros egresados
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((test) => (
              <figure
                key={test.name}
                className="flex flex-col justify-between rounded-xl border border-line bg-white p-5"
              >
                <div>
                  <div className="mb-3 flex gap-0.5 text-accent-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-accent-500" />
                    ))}
                  </div>
                  <blockquote className="text-xs leading-relaxed text-ink-600">
                    “{test.comment}”
                  </blockquote>
                </div>

                <figcaption className="mt-5 border-t border-line pt-3">
                  <p className="text-sm font-semibold text-ink-900">{test.name}</p>
                  <p className="text-[11px] text-ink-600">
                    {test.role} · {test.company}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
