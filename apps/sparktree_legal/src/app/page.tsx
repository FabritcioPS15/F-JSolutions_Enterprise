import Image from 'next/image'
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  Check,
  Clock,
  FileText,
  Gavel,
  Landmark,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Scale,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { LegalContactForm } from '@/components/legal-contact-form'
import { LEGAL_CONTACT, formatPhone, whatsappUrl } from '@/lib/contact'
import { PRACTICE_AREAS, PROCESS_STEPS } from '@/lib/legal-content'

const AREA_ICONS: Record<string, LucideIcon> = {
  corporativo: Building2,
  contratos: FileText,
  laboral: Briefcase,
  tributario: Landmark,
  'propiedad-intelectual': Lock,
  litigios: Gavel,
}

const TRUST = ['Confidencialidad', 'Un solo interlocutor', 'Enfoque empresarial']

const directWhatsapp = whatsappUrl(
  LEGAL_CONTACT.whatsapp,
  'Hola SparkTree Legal, quisiera coordinar una consulta sobre un caso de mi empresa.',
)

export default function LegalHome() {
  return (
    <div className="min-h-screen bg-bone-50">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <a href="#inicio" className="flex items-center">
            <Image
              src="/brand/sparktree-horizontal.png"
              alt="SparkTree"
              width={322}
              height={86}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </a>
          <nav className="hidden items-center gap-7 text-sm text-bone-200/80 md:flex">
            <a href="#areas" className="transition hover:text-gold-300">
              Áreas
            </a>
            <a href="#proceso" className="transition hover:text-gold-300">
              Cómo trabajamos
            </a>
            <a href="#contacto" className="transition hover:text-gold-300">
              Contacto
            </a>
          </nav>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 rounded-md border border-gold-500/50 px-4 py-2 text-sm font-medium text-gold-300 transition hover:border-gold-500 hover:bg-gold-500 hover:text-navy-900"
          >
            Consultar
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </header>

      <main id="inicio">
        <section className="relative overflow-hidden bg-navy-900 text-bone-50">
          <div className="hero-lines absolute inset-0" />
          <div className="absolute -right-32 -top-40 size-[26rem] rounded-full bg-gold-500/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-36">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300">
                <Scale className="size-4" />
                SparkTree Legal · Lima, Perú
              </p>
              <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Claridad legal para decisiones que no admiten improvisación.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-bone-200/80">
                Contratos, cumplimiento, societario y controversias. Un solo interlocutor para
                ordenar todos tus casos legales y evitar que cada área de tu empresa hable con un
                abogado distinto.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:bg-gold-300"
                >
                  Coordinar una consulta
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href={directWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-bone-50 transition hover:border-gold-500/60 hover:text-gold-300"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp directo
                </a>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-bone-200/70">
                {TRUST.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
              <p className="font-serif text-xl text-bone-50">Tu caso, en orden.</p>
              <p className="mt-2 text-sm leading-relaxed text-bone-200/70">
                Un mismo proceso para cualquier materia: desde la primera consulta hasta el
                seguimiento.
              </p>
              <ol className="mt-6 space-y-4">
                {PROCESS_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-xs font-semibold text-gold-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-bone-50">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-bone-200/65">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-bone-200/60">
                <Lock className="size-3.5 text-gold-500" />
                Toda consulta se trata de forma confidencial.
              </div>
            </div>
          </div>
        </section>

        <section id="areas" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-500">
              Áreas de práctica
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-navy-800 sm:text-4xl">
              Cobertura legal para la operación completa.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              Si tu caso no encaja exactamente en una materia, escríbenos igual: lo evaluamos y lo
              derivamos internamente sin que tengas que contarlo dos veces.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICE_AREAS.map((area, index) => {
              const Icon = AREA_ICONS[area.slug] ?? Scale
              return (
                <article
                  key={area.slug}
                  className="group rounded-xl border border-bone-200 bg-white p-6 transition hover:border-gold-500/70 hover:shadow-[0_30px_60px_-50px_rgba(32,44,57,0.6)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-navy-800/[0.04] text-navy-800 transition group-hover:bg-gold-500/15 group-hover:text-gold-500">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-serif text-sm text-ink-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-navy-800">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{area.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section id="proceso" className="border-y border-bone-200 bg-bone-100">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-500">
                  Cómo trabajamos
                </p>
                <h2 className="mt-4 font-serif text-3xl leading-tight text-navy-800 sm:text-4xl">
                  Un caso, una conversación, un responsable.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-600">
                  Centralizamos la comunicación para que no repitas antecedentes ni pierdas el hilo
                  entre un área y otra.
                </p>
                <div className="mt-8 flex items-start gap-3 rounded-xl border border-bone-200 bg-white p-4">
                  <Clock className="mt-0.5 size-5 shrink-0 text-gold-500" />
                  <p className="text-sm leading-relaxed text-ink-600">
                    ¿Tienes un plazo próximo? Indícalo en el primer mensaje: priorizamos las
                    consultas con vencimiento o notificación recibida.
                  </p>
                </div>
              </div>

              <ol className="space-y-6">
                {PROCESS_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    className="flex gap-5 rounded-xl border border-bone-200 bg-white p-5"
                  >
                    <span className="font-serif text-3xl leading-none text-gold-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-navy-800">{step.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="contacto" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-500">
              Contacto
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-navy-800 sm:text-4xl">
              Cuéntanos tu caso.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              Completa lo que puedas y elige por dónde enviarlo. Te responde una sola persona del
              equipo legal.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <LegalContactForm whatsapp={LEGAL_CONTACT.whatsapp} email={LEGAL_CONTACT.email} />

            <div className="flex flex-col rounded-2xl bg-navy-900 p-6 text-bone-50 sm:p-8">
              <p className="font-serif text-xl">Contacto directo</p>
              <p className="mt-2 text-sm leading-relaxed text-bone-200/70">
                Si prefieres no escribir el resumen todavía, escríbenos y coordinamos la primera
                conversación.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href={directWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 transition hover:border-gold-500/60 hover:bg-white/5"
                >
                  <MessageCircle className="size-5 text-gold-500" />
                  <span className="text-sm">
                    <span className="block font-medium text-bone-50">WhatsApp</span>
                    <span className="block text-bone-200/60">{formatPhone(LEGAL_CONTACT.whatsapp)}</span>
                  </span>
                </a>
                <a
                  href={`mailto:${LEGAL_CONTACT.email}`}
                  className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 transition hover:border-gold-500/60 hover:bg-white/5"
                >
                  <Mail className="size-5 text-gold-500" />
                  <span className="text-sm">
                    <span className="block font-medium text-bone-50">Correo</span>
                    <span className="block break-all text-bone-200/60">{LEGAL_CONTACT.email}</span>
                  </span>
                </a>
                <div className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3">
                  <MapPin className="size-5 text-gold-500" />
                  <span className="text-sm">
                    <span className="block font-medium text-bone-50">{LEGAL_CONTACT.location}</span>
                    <span className="block text-bone-200/60">{LEGAL_CONTACT.hours}</span>
                  </span>
                </div>
              </div>

              <p className="mt-auto pt-6 text-xs leading-relaxed text-bone-200/55">
                Si tu caso involucra otra especialidad, lo derivamos internamente con el mismo
                interlocutor: no tendrás que repetir tu historia.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy-950 text-bone-200/70">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <Image
                src="/brand/sparktree-horizontal.png"
                alt="SparkTree"
                width={322}
                height={86}
                className="h-7 w-auto"
              />
              <p className="mt-4 max-w-xs text-sm leading-relaxed">
                Respaldo legal para empresas que necesitan decidir con claridad y continuidad
                operativa.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bone-200/50">
                Áreas
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {PRACTICE_AREAS.slice(0, 4).map((area) => (
                  <li key={area.slug}>
                    <a href="#contacto" className="transition hover:text-gold-300">
                      {area.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bone-200/50">
                Contacto
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href={directWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-gold-300"
                  >
                    WhatsApp {formatPhone(LEGAL_CONTACT.whatsapp)}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${LEGAL_CONTACT.email}`}
                    className="break-all transition hover:text-gold-300"
                  >
                    {LEGAL_CONTACT.email}
                  </a>
                </li>
                <li>{LEGAL_CONTACT.location}</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-bone-200/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} SparkTree Legal · Lima, Perú</p>
            <p>La información de este sitio es referencial y no constituye asesoría legal.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
