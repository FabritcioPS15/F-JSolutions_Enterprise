import { Award, Briefcase, Server, Users, ShieldCheck, Cpu } from 'lucide-react'
import { PILLARS } from '@/lib/academy-data'

const iconMap = {
  Briefcase: Briefcase,
  Users: Users,
  Award: Award,
  Server: Server,
}

export function AcademyMethodology() {
  return (
    <section id="metodologia" className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner de Respaldo F&J Enterprise */}
        <div className="relative overflow-hidden rounded-3xl border border-[#5B21B6]/40 bg-gradient-to-r from-[#1E1B4B] via-[#2E1065] to-[#0F172A] p-8 sm:p-12 shadow-2xl">
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-[#7C3AED]/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                Respaldo Empresarial Garantizado
              </div>
              <h3 className="mt-4 font-heading text-2xl font-black text-white sm:text-3xl">
                ¿Por qué formarte en F&J Academy?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                La mayoría de institutos enseñan teoría que ya no se usa en el mercado. En F&J Academy
                los temarios son dictados por los mismos líderes técnicos que desarrollan software,
                gestionan servidores e implementan infraestructura para corporaciones en todo el Perú.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="font-heading text-2xl font-black text-white">100%</p>
                <p className="text-[11px] text-slate-300 mt-1">Práctico con código real</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="font-heading text-2xl font-black text-white">Bolsa F&J</p>
                <p className="text-[11px] text-slate-300 mt-1">Pasantías remuneradas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pilares */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = iconMap[pillar.icon as keyof typeof iconMap] || Cpu
            return (
              <div
                key={pillar.title}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-[#5B21B6]/50"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#5B21B6]/20 text-[#C4B5FD] border border-[#5B21B6]/30">
                  <Icon className="size-6" />
                </div>
                <h4 className="mt-4 font-heading text-base font-bold text-white">
                  {pillar.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {pillar.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
