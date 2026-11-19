'use client'

import { useState } from 'react'
import { Calendar, Check, Clock, Layers } from 'lucide-react'
import { CATEGORIES, COURSES, type Course, type CourseCategory } from '@/lib/academy-data'

export function ProgramsGrid({ onSelectCourse }: { onSelectCourse: (course: Course) => void }) {
  const [activeCategory, setActiveCategory] = useState<CourseCategory | 'all'>('all')

  const filtered = COURSES.filter((course) => {
    if (activeCategory === 'all') return true
    return course.category === activeCategory
  })

  return (
    <section id="programas" className="bg-surface-muted py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Programas académicos
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Especializaciones diseñadas para la industria
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Los mismos estándares técnicos que aplicamos en los proyectos corporativos de F&amp;J
              Solutions, ordenados en programas cortos y prácticos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'bg-ink-900 text-white'
                      : 'border border-line bg-white text-ink-600 hover:border-line-strong hover:text-ink-900'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <article
              key={course.id}
              className="flex flex-col justify-between rounded-xl border border-line bg-white p-5 transition hover:border-line-strong hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                    {course.categoryLabel}
                  </span>
                  {course.badge && (
                    <span className="rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-ink-600">
                      {course.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-[15px] font-semibold leading-snug text-ink-900">
                  {course.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-600">
                  {course.shortDescription}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-line bg-surface-muted p-3 text-[11px] text-ink-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-ink-400" />
                    {course.duration} ({course.hours}h)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers className="size-3.5 text-ink-400" />
                    {course.level}
                  </span>
                  <span className="col-span-2 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-ink-400" />
                    Inicio: <strong className="font-medium text-ink-900">{course.nextStartDate}</strong>
                  </span>
                </div>

                <ul className="mt-4 space-y-1.5">
                  {course.syllabus.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-ink-600">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {course.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-line px-2 py-0.5 text-[10px] font-medium text-ink-500"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-line pt-4">
                <div className="mb-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-ink-900">
                      S/ {course.pricePEN}
                    </span>
                    {course.discountPercent && (
                      <span className="text-xs text-ink-400 line-through">
                        S/ {Math.round(course.pricePEN / (1 - course.discountPercent / 100))}
                      </span>
                    )}
                  </div>
                  {course.discountPercent && (
                    <span className="rounded-md bg-accent-50 px-2 py-0.5 text-[11px] font-medium text-accent-700">
                      -{course.discountPercent}% beca
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectCourse(course)}
                  className="w-full rounded-lg border border-line-strong py-2 text-xs font-semibold text-ink-700 transition hover:border-brand-600 hover:bg-brand-600 hover:text-white"
                >
                  Ver temario e inscribirme
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
