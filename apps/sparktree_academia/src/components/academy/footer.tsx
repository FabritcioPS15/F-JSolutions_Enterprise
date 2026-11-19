import { GraduationCap, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react'

export function AcademyFooter() {
  return (
    <footer className="border-t border-line bg-surface py-10 text-ink-600">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white">
                <GraduationCap className="size-4" />
              </div>
              <span className="text-sm font-semibold text-ink-900">F&amp;J Academy</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed">
              Instituto de especialización tecnológica de F&amp;J Solutions Enterprise. Formación
              práctica en software, cloud, ciberseguridad e infraestructura.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-ink-900">Especialidades</p>
            <ul className="mt-3 space-y-2 text-xs">
              <li><a href="#programas" className="transition hover:text-ink-900">Desarrollo Web Full Stack</a></li>
              <li><a href="#programas" className="transition hover:text-ink-900">Cloud Computing &amp; DevOps</a></li>
              <li><a href="#programas" className="transition hover:text-ink-900">Ciberseguridad</a></li>
              <li><a href="#programas" className="transition hover:text-ink-900">Infraestructura de Servidores</a></li>
              <li><a href="#programas" className="transition hover:text-ink-900">Inteligencia Artificial</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-ink-900">Ecosistema F&amp;J</p>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="https://fjsolutions.com.pe"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 transition hover:text-ink-900"
                >
                  F&amp;J Solutions Enterprise <ArrowUpRight className="size-3" />
                </a>
              </li>
              <li><a href="#metodologia" className="transition hover:text-ink-900">Bolsa de trabajo</a></li>
              <li><a href="#docentes" className="transition hover:text-ink-900">Plana docente</a></li>
              <li><a href="#testimonios" className="transition hover:text-ink-900">Casos de éxito</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-ink-900">Admisiones</p>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 text-ink-400" />
                +51 923 055 963
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 text-ink-400" />
                academia@fjsolutions.com.pe
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5 text-ink-400" />
                Lima, Perú · Campus virtual
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-line pt-5 text-[11px] text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} F&amp;J Academy. Todos los derechos reservados.</p>
          <p>Impulsado por F&amp;J Solutions Enterprise</p>
        </div>
      </div>
    </footer>
  )
}
