'use client'

import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  GraduationCap,
  ShieldCheck,
  Star,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { COURSES, STATS } from '@/lib/academy-data'

const VALUE_PROPS = [
  'Certificación oficial empresarial',
  'Bolsa laboral en SparkTree Group',
  'Laboratorios y servidores dedicados',
]

const STAT_ICONS: LucideIcon[] = [GraduationCap, TrendingUp, Wrench, Star]

const FEATURED_COURSE = COURSES.find((course) => course.featured) ?? COURSES[0]

function instructorInitials(name: string) {
  return name
    .replace(/^(Ing\.|MSc\.|Dr\.|Lic\.)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

export function AcademyHero({ onOpenEnroll }: { onOpenEnroll: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="academy-grid absolute inset-0" />
        <div className="academy-float-slow absolute -right-28 -top-32 size-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(66,103,199,0.16),transparent_68%)] blur-2xl" />
        <div className="academy-float absolute -left-24 bottom-0 size-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(244,185,66,0.22),transparent_70%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div
            className="academy-rise flex flex-col items-center text-center lg:items-start lg:text-left"
            style={{ animationDelay: '60ms' }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-muted px-3.5 py-1 text-xs font-medium text-ink-600">
              <span className="size-1.5 rounded-full bg-accent-500" />
              Admisiones 2026 – 2027 abiertas
            </p>

            <h1 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl sm:leading-tight lg:text-5xl">
              Formación tecnológica{' '}
              <span className="relative inline-block text-brand-600">
                práctica
                <svg
                  className="academy-underline absolute -bottom-1 left-0 h-2 w-full text-accent-500"
                  viewBox="0 0 120 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C30 2 60 2 118 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    pathLength={1}
                  />
                </svg>
              </span>{' '}
              con respaldo de SparkTree Group
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-600 sm:text-base">
              Cursos cortos de desarrollo web, cloud, ciberseguridad e infraestructura, dictados
              por ingenieros que trabajan en proyectos reales para empresas.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <button
                type="button"
                onClick={onOpenEnroll}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white shadow-[0_16px_30px_-18px_rgba(66,103,199,0.9)] transition hover:-translate-y-0.5 hover:bg-brand-700"
              >
                Ver programas y becas
                <ArrowRight className="size-4" />
              </button>
              <a
                href="#programas"
                className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-white px-6 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:bg-surface-muted"
              >
                Explorar cursos
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
              {VALUE_PROPS.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 text-[13px] text-ink-600">
                  <Check className="size-4 text-brand-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            className="academy-rise relative mx-auto w-full max-w-md lg:max-w-none"
            style={{ animationDelay: '200ms' }}
          >
            <div className="academy-float absolute -left-4 top-8 z-10 hidden items-center gap-2.5 rounded-xl border border-line bg-white/95 px-3.5 py-2.5 shadow-[0_20px_40px_-28px_rgba(38,59,115,0.6)] backdrop-blur sm:flex">
              <span className="grid size-8 place-items-center rounded-lg bg-accent-50 text-accent-700">
                <Star className="size-4" fill="currentColor" />
              </span>
              <div>
                <p className="text-sm font-bold leading-none text-ink-900">4.9/5</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-ink-500">
                  Egresados
                </p>
              </div>
            </div>

            <div className="academy-float-slow absolute -bottom-5 right-4 z-10 hidden items-center gap-2 rounded-xl border border-line bg-white/95 px-3.5 py-2.5 shadow-[0_20px_40px_-28px_rgba(38,59,115,0.6)] backdrop-blur sm:flex">
              <ShieldCheck className="size-4 text-brand-600" />
              <p className="text-xs font-semibold text-ink-700">Certificación oficial</p>
            </div>

            <article className="relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-[0_35px_80px_-50px_rgba(38,59,115,0.55)] sm:p-7">
              <div
                className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-brand-50 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
                    <span className="size-1.5 rounded-full bg-brand-600" />
                    Próximo inicio
                  </span>
                  {FEATURED_COURSE.badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-semibold text-accent-700">
                      <Star className="size-3" fill="currentColor" />
                      {FEATURED_COURSE.badge}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 line-clamp-2 text-lg font-semibold leading-snug text-ink-900 sm:text-xl">
                  {FEATURED_COURSE.title}
                </h2>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[FEATURED_COURSE.modality, FEATURED_COURSE.level, FEATURED_COURSE.duration].map(
                    (meta) => (
                      <span
                        key={meta}
                        className="rounded-md border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink-600"
                      >
                        {meta}
                      </span>
                    ),
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-3">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-ink-600">
                    <CalendarDays className="size-4 text-brand-600" />
                    Inicia el {FEATURED_COURSE.nextStartDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-900">
                    <Clock className="size-3.5 text-ink-500" />
                    {FEATURED_COURSE.hours} h
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {instructorInitials(FEATURED_COURSE.instructor.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {FEATURED_COURSE.instructor.name}
                    </p>
                    <p className="truncate text-xs text-ink-500">
                      {FEATURED_COURSE.instructor.role}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {FEATURED_COURSE.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-surface-muted px-2 py-1 text-[11px] font-medium text-ink-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onOpenEnroll}
                  className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-ink-900 px-4 text-[13px] font-semibold text-white transition hover:bg-brand-700"
                >
                  Reservar mi vacante
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </article>
          </div>
        </div>

        <dl
          className="academy-rise mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
          style={{ animationDelay: '340ms' }}
        >
          {STATS.map((stat, index) => {
            const Icon = STAT_ICONS[index % STAT_ICONS.length]
            return (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-3 bg-white px-4 py-5 text-left"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <dd className="text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-0.5 text-[11px] leading-snug text-ink-500">{stat.label}</dt>
                </div>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
