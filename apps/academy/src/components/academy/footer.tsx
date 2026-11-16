import { GraduationCap, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react'

export function AcademyFooter() {
  return (
    <footer className="border-t border-slate-900 bg-[#070A10] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] text-white">
                <GraduationCap className="size-5" />
              </div>
              <span className="font-heading font-black text-lg">
                F&J <span className="text-[#A78BFA]">ACADEMY</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Instituto de Especialización Tecnológica & Alta Formación TI. Formando a la nueva
              generación de ingenieros de software, DevOps y ciberseguridad con proyectos reales.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Especialidades
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              <li><a href="#programas" className="hover:text-white transition">Desarrollo Web Full Stack</a></li>
              <li><a href="#programas" className="hover:text-white transition">Cloud Computing & DevOps</a></li>
              <li><a href="#programas" className="hover:text-white transition">Ciberseguridad Ofensiva</a></li>
              <li><a href="#programas" className="hover:text-white transition">Infraestructura de Servidores</a></li>
              <li><a href="#programas" className="hover:text-white transition">Inteligencia Artificial</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Ecosistema F&J
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="https://fjsolutions.com.pe"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition"
                >
                  F&J Solutions Enterprise <ArrowUpRight className="size-3" />
                </a>
              </li>
              <li><a href="#metodologia" className="hover:text-white transition">Bolsa de Trabajo</a></li>
              <li><a href="#docentes" className="hover:text-white transition">Plana Docente</a></li>
              <li><a href="#testimonios" className="hover:text-white transition">Casos de Éxito</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Contacto de Admisiones
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 text-[#A78BFA]" />
                <span>+51 923 055 963</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 text-[#A78BFA]" />
                <span>academia@fjsolutions.com.pe</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5 text-[#A78BFA]" />
                <span>Lima, Perú (Sede Central & Campus Virtual)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} F&J Academy · Todos los derechos reservados.</p>
          <p>Impulsado por F&J Solutions Enterprise</p>
        </div>
      </div>
    </footer>
  )
}
