'use client'

import { ArrowRight, CheckCircle2, Flame, Laptop, ShieldCheck, Terminal, Users } from 'lucide-react'
import { STATS } from '@/lib/academy-data'

export function AcademyHero({ onOpenEnroll }: { onOpenEnroll: () => void }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background glow effects */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(91,33,182,0.22),transparent_65%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-[400px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_60%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5B21B6]/50 bg-[#1E1B4B]/60 px-4 py-1.5 shadow-lg shadow-[#5B21B6]/15 backdrop-blur-md">
            <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-[#DDD6FE]">
              Convocatoria de Admisiones 2026 - 2027 Abierta
            </span>
            <span className="rounded-md bg-[#5B21B6] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
              Cupos Limitados
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-8 max-w-4xl font-heading text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.12]">
            El Instituto de Tecnología respaldado por{' '}
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#F472B6] bg-clip-text text-transparent">
              F&J Solutions Enterprise
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Olvídate de la teoría anticuada. Aprende Desarrollo Web Moderno, Cloud & DevOps,
            Ciberseguridad e Infraestructura con ingenieros seniors que dirigen proyectos reales para empresas.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenEnroll}
              className="inline-flex h-13 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] px-8 text-sm font-bold text-white shadow-xl shadow-[#5B21B6]/30 transition hover:brightness-110 active:scale-95"
            >
              <span>Explorar Carreras y Becas</span>
              <ArrowRight className="size-4" />
            </button>

            <a
              href="#programas"
              className="inline-flex h-13 items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-7 text-sm font-bold text-slate-200 backdrop-blur-md transition hover:border-slate-500 hover:bg-slate-800"
            >
              <span>Ver Catálogo de Cursos</span>
            </a>
          </div>

          {/* Quick value props */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Certificación Oficial Empresarial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Bolsa Laboral en F&J Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Laboratorios y Servidores Dedicados</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl sm:grid-cols-4 sm:p-8">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center ${
                i !== 0 ? 'sm:border-l sm:border-slate-800/80' : ''
              }`}
            >
              <span className="font-heading text-3xl font-black text-white sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-xs text-slate-400 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
