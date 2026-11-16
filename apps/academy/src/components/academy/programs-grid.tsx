'use client'

import { useState } from 'react'
import {
  Calendar,
  Check,
  Clock,
  GraduationCap,
  Sparkles,
  Users,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { CATEGORIES, COURSES, type Course, type CourseCategory } from '@/lib/academy-data'

export function ProgramsGrid({ onSelectCourse }: { onSelectCourse: (course: Course) => void }) {
  const [activeCategory, setActiveCategory] = useState<CourseCategory | 'all'>('all')

  const filtered = COURSES.filter((course) => {
    if (activeCategory === 'all') return true
    return course.category === activeCategory
  })

  return (
    <section id="programas" className="relative py-20 bg-slate-950/60 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-[#5B21B6]/60 bg-[#1E1B4B]/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#C4B5FD]">
            Programas Académicos 2026 - 2027
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Especializaciones Diseñadas para la Industria
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            Cada programa está estructurado con el mismo stack tecnológico y estándares de calidad
            que exigimos en los proyectos corporativos de F&J Solutions Enterprise.
          </p>

          {/* Category filter pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white shadow-lg shadow-[#5B21B6]/25'
                      : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Courses grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <article
              key={course.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/60 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#5B21B6]/60 hover:shadow-2xl hover:shadow-[#5B21B6]/15 backdrop-blur-md"
            >
              {/* Header badges */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-slate-800/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    {course.categoryLabel}
                  </span>
                  {course.badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      <Sparkles className="size-3" />
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Course Title */}
                <h3 className="mt-4 font-heading text-lg font-bold text-white transition group-hover:text-[#C4B5FD] leading-snug">
                  {course.title}
                </h3>

                <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                  {course.shortDescription}
                </p>

                {/* Meta list */}
                <div className="mt-5 grid grid-cols-2 gap-2.5 rounded-xl border border-slate-800/70 bg-slate-950/40 p-3 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-[#A78BFA]" />
                    <span>{course.duration} ({course.hours}h)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="size-3.5 text-[#A78BFA]" />
                    <span>{course.level}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="size-3.5 text-[#A78BFA]" />
                    <span>Inicio: <strong className="text-white">{course.nextStartDate}</strong></span>
                  </div>
                </div>

                {/* Syllabus preview */}
                <div className="mt-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Módulos destacados:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    {course.syllabus.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="size-3.5 shrink-0 text-emerald-400 mt-0.5" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {course.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-slate-800 bg-slate-950/70 px-2 py-0.5 text-[10px] font-medium text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer with Price and Action */}
              <div className="mt-8 border-t border-slate-800/80 pt-5">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-[11px] text-slate-400">Inversión:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-xl font-bold text-white">
                        S/ {course.pricePEN}
                      </span>
                      {course.discountPercent && (
                        <span className="text-xs text-slate-500 line-through">
                          S/ {Math.round(course.pricePEN / (1 - course.discountPercent / 100))}
                        </span>
                      )}
                    </div>
                  </div>
                  {course.discountPercent && (
                    <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-400">
                      -{course.discountPercent}% Beca
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectCourse(course)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5B21B6]/20 transition hover:brightness-110 active:scale-98"
                >
                  <BookOpen className="size-3.5" />
                  <span>Ver Plan de Estudios & Inscribirme</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
