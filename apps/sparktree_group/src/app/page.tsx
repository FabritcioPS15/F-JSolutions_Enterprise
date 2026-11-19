import Image from 'next/image'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Code2,
  GraduationCap,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Network,
  Scale,
  ShoppingBag,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ECOSYSTEM_STEPS, GROUP_CONTACT, UNITS, whatsappUrl } from '@/lib/site'
import { HeroTypewriter } from '@/components/hero-typewriter'

const UNIT_WORDS = {
  studio: 'Marca',
  systems: 'Tecnología',
  academia: 'Formación',
  store: 'Equipamiento',
  legal: 'Respaldo legal',
} as const

const HERO_HIGHLIGHTS = UNITS.map((unit) => ({
  word: UNIT_WORDS[unit.slug],
  accent: unit.accent,
}))

const UNIT_ICONS: Record<string, LucideIcon> = {
  studio: Megaphone,
  systems: Code2,
  academia: GraduationCap,
  store: ShoppingBag,
  legal: Scale,
}

const groupWhatsapp = whatsappUrl(
  GROUP_CONTACT.whatsapp,
  'Hola SparkTree Group, quisiera orientación para mi empresa.',
)

export default function GroupPage() {
  return (
    <div className="min-h-dvh">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" aria-label="SparkTree Group, inicio">
            <Image
              src="/brand/sparktree-horizontal.png"
              alt="SparkTree"
              width={322}
              height={86}
              priority
              className="h-10 w-auto sm:h-11"
            />
          </a>
          <nav className="hidden items-center gap-7 text-sm text-white/65 md:flex">
            <a href="#unidades" className="transition hover:text-white">
              Unidades
            </a>
            <a href="#ecosistema" className="transition hover:text-white">
              Ecosistema
            </a>
            <a href="#contacto" className="transition hover:text-white">
              Contacto
            </a>
          </nav>
          <a
            href={groupWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/10 sm:text-sm"
          >
            <MessageCircle className="size-4" />
            Hablar con el grupo
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-forest-900 text-white">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div
          className="hero-float pointer-events-none absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle at center, rgba(60,128,96,0.45), transparent 68%)',
          }}
          aria-hidden="true"
        />
        <div
          className="hero-float-slow pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle at center, rgba(165,201,174,0.18), transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
          <p
            className="hero-rise flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-forest-200"
            style={{ animationDelay: '80ms' }}
          >
            <span className="size-1.5 rounded-full bg-forest-200" />
            SparkTree Group · Lima, Perú
          </p>
          <h1
            className="hero-rise mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: '180ms' }}
          >
            Un ecosistema de empresas para crecer con orden.
          </h1>

          <div className="hero-rise" style={{ animationDelay: '300ms' }}>
            <HeroTypewriter items={HERO_HIGHLIGHTS} />
          </div>

          <p
            className="hero-rise mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
            style={{ animationDelay: '420ms' }}
          >
            Marca, tecnología, formación, equipamiento y respaldo legal. Cada unidad mantiene su
            especialidad y trabaja con las demás para que tu empresa no tenga que coordinar cinco
            proveedores distintos.
          </p>

          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '520ms' }}
          >
            <a
              href="#unidades"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest-800 transition hover:bg-forest-200"
            >
              Conocer las unidades
              <ArrowRight className="size-4" />
            </a>
            <a
              href={groupWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              <MessageCircle className="size-4" />
              Coordinar una reunión
            </a>
          </div>

          <dl
            className="hero-rise mt-14 grid max-w-2xl grid-cols-1 gap-6 border-t border-white/10 pt-8 sm:grid-cols-3"
            style={{ animationDelay: '640ms' }}
          >
            {[
              { value: '5', label: 'unidades especializadas' },
              { value: '1', label: 'punto de contacto' },
              { value: '360°', label: 'visión del negocio' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl font-semibold text-white">{stat.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-white/50">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="unidades" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-forest-600">
            Unidades de negocio
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-forest-800 sm:text-4xl">
            Una capacidad distinta en cada unidad.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-sage-600">
            Elige la especialidad que necesitas hoy o combínalas para resolver un frente completo:
            desde la presencia digital hasta la operación y el respaldo legal.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {UNITS.map((unit) => {
            const Icon = UNIT_ICONS[unit.slug] ?? Building2
            return (
              <a
                key={unit.slug}
                href={unit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl border border-sage-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-forest-200 hover:shadow-[0_28px_60px_-38px_rgba(18,59,42,0.55)] sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="flex size-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${unit.accent}1A`, color: unit.accent }}
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <ArrowUpRight className="size-4 text-sage-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forest-700" />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
                  {unit.tagline}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-semibold text-forest-800">
                  {unit.name}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-sage-600">{unit.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {unit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-medium text-forest-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            )
          })}

          <div className="flex flex-col justify-between rounded-2xl border border-dashed border-forest-200 bg-sage-100/60 p-6 sm:p-7">
            <div>
              <span className="flex size-11 items-center justify-center rounded-xl bg-white text-forest-700">
                <Network className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-forest-800">
                ¿Una nueva unidad en camino?
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-sage-600">
                Si buscas sumar una capacidad a tu empresa, conversemos sobre cómo encaja dentro del
                ecosistema y quién debería liderarla.
              </p>
            </div>
            <a
              href={groupWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest-700 transition hover:text-forest-600"
            >
              Conversar con el grupo
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="ecosistema" className="border-y border-sage-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-forest-600">
              Cómo trabajamos
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-forest-800 sm:text-4xl">
              Un ecosistema, no servicios sueltos.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-sage-600">
              El valor del grupo aparece cuando las decisiones se toman en conjunto: la marca no
              avanza sin la tecnología, y la operación no crece sin equipo preparado.
            </p>
            <blockquote className="mt-8 rounded-2xl border-l-2 border-forest-600 bg-sage-50 px-5 py-5 text-sm leading-relaxed text-forest-700">
              «Cada unidad mantiene su especialidad. El grupo aporta la visión completa.»
            </blockquote>
          </div>

          <ol>
            {ECOSYSTEM_STEPS.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                {index < ECOSYSTEM_STEPS.length - 1 && (
                  <span
                    className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-sage-200"
                    aria-hidden="true"
                  />
                )}
                <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-sage-200 bg-sage-50 font-display text-sm font-semibold text-forest-700">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="pt-2">
                  <h3 className="font-display text-base font-semibold text-forest-800">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-sage-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contacto" className="px-5 py-20 sm:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-forest-800 px-6 py-12 text-white sm:px-12 sm:py-14">
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle at center, rgba(165,201,174,0.28), transparent 68%)',
            }}
            aria-hidden="true"
          />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                ¿Buscas una sola contraparte para tu empresa?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                Cuéntanos qué necesitas resolver y te orientamos hacia la unidad correcta, sin
                vueltas ni reuniones duplicadas.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={groupWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-forest-800 transition hover:bg-forest-200"
              >
                <MessageCircle className="size-4" />
                Escribir por WhatsApp
              </a>
              <a
                href={`mailto:${GROUP_CONTACT.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/10"
              >
                <Mail className="size-4" />
                {GROUP_CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-sage-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-semibold text-forest-800">SparkTree Group</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-sage-600">
              Un ecosistema de empresas especializadas que trabajan juntas para impulsar negocios en
              Perú.
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-sage-500">
              <MapPin className="size-3.5" />
              {GROUP_CONTACT.location}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
              Unidades
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-sage-600">
              {UNITS.map((unit) => (
                <li key={unit.slug}>
                  <a
                    href={unit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-forest-700"
                  >
                    {unit.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
              Contacto
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-sage-600">
              <li>
                <a
                  href={groupWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-forest-700"
                >
                  WhatsApp del grupo
                </a>
              </li>
              <li>
                <a href={`mailto:${GROUP_CONTACT.email}`} className="transition hover:text-forest-700">
                  {GROUP_CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-sage-200 px-5 py-5 text-xs text-sage-500 sm:px-8">
          <p>© {new Date().getFullYear()} SparkTree Group · Lima, Perú</p>
        </div>
      </footer>
    </div>
  )
}
