import { Award, Briefcase, Server, Users, Cpu, ShieldCheck } from 'lucide-react'
import { PILLARS } from '@/lib/academy-data'

const iconMap = {
  Briefcase: Briefcase,
  Users: Users,
  Award: Award,
  Server: Server,
}

export function AcademyMethodology() {
  return (
    <section id="metodologia" className="border-b border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <ShieldCheck className="size-4" />
              Respaldo empresarial
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              ¿Por qué formarte en F&amp;J Academy?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              La mayoría de institutos enseña teoría que el mercado ya no usa. Aquí los temarios los
              dictan los mismos líderes técnicos que desarrollan software, gestionan servidores e
              implementan infraestructura para empresas en todo el Perú.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-72">
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
              <p className="text-xl font-semibold text-slate-900">100%</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Práctico con código real</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
              <p className="text-xl font-semibold text-slate-900">Bolsa F&amp;J</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Pasantías remuneradas</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = iconMap[pillar.icon as keyof typeof iconMap] || Cpu
            return (
              <div
                key={pillar.title}
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300"
              >
                <div className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="size-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{pillar.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{pillar.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
