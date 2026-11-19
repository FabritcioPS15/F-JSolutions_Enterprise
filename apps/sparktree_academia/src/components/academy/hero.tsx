'use client'

import { ArrowRight, Check } from 'lucide-react'
import { STATS } from '@/lib/academy-data'

const VALUE_PROPS = [
  'Certificación oficial empresarial',
  'Bolsa laboral en F&J Solutions',
  'Laboratorios y servidores dedicados',
]

export function AcademyHero({ onOpenEnroll }: { onOpenEnroll: () => void }) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-muted px-3.5 py-1 text-xs font-medium text-ink-600">
            <span className="size-1.5 rounded-full bg-accent-500" />
            Admisiones 2026 – 2027 abiertas
          </p>

          <h1 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl sm:leading-tight">
            Formación tecnológica práctica con respaldo de{' '}
            <span className="text-brand-600">F&amp;J Solutions</span>
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-600 sm:text-base">
            Cursos cortos de desarrollo web, cloud, ciberseguridad e infraestructura, dictados por
            ingenieros que trabajan en proyectos reales para empresas.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenEnroll}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Ver programas y becas
              <ArrowRight className="size-4" />
            </button>
            <a
              href="#programas"
              className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-white px-6 text-sm font-semibold text-ink-700 transition hover:bg-surface-muted"
            >
              Explorar cursos
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {VALUE_PROPS.map((item) => (
              <span key={item} className="inline-flex items-center gap-2 text-[13px] text-ink-600">
                <Check className="size-4 text-brand-600" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 divide-line overflow-hidden rounded-xl border border-line sm:grid-cols-4 sm:divide-x">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white px-5 py-6 text-center">
              <dd className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1 text-xs text-ink-500">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
