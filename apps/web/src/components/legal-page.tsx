import Link from 'next/link'
import {
  ChevronRight,
  Clock,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { EMPRESA } from '@/lib/constants'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export type LegalSection = {
  id: string
  title: string
  paragraphs?: string[]
  list?: string[]
}

type LegalPageProps = {
  path: string
  title: string
  description: string
  intro: string
  updatedLabel: string
  updatedIso: string
  icon: LucideIcon
  sections: LegalSection[]
}

const LEGAL_LINKS = [
  { label: 'Términos y condiciones', href: '/terminos-y-condiciones' },
  { label: 'Política de privacidad', href: '/politica-de-privacidad' },
  { label: 'Información legal', href: '/informacion-legal' },
]

export function LegalPage({
  path,
  title,
  description,
  intro,
  updatedLabel,
  updatedIso,
  icon: Icon,
  sections,
}: LegalPageProps) {
  const phoneHref = `tel:${EMPRESA.telefono.replace(/\s/g, '')}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: 'es-PE',
    dateModified: updatedIso,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <EnhancedHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <nav aria-label="Ruta de navegación" className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <ol className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-1.5 px-4 py-3 text-[11px] text-[#475569] sm:px-6 lg:px-8">
          <li>
            <Link href="/" className="transition hover:text-[#2563EB]">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3 text-[#94A3B8]" />
          </li>
          <li aria-current="page" className="font-semibold text-[#0F172A]">
            {title}
          </li>
        </ol>
      </nav>

      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]">
        <div className="pointer-events-none absolute -right-32 -top-24 size-96 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/25 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1D4ED8]">
            <Icon className="size-3.5" /> Documento legal
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.045em] text-[#0F172A] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#475569]">{intro}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#64748B]">
            <Clock className="size-3.5 text-[#2563EB]" /> Última actualización: {updatedLabel}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          <article className="min-w-0 max-w-3xl">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-b border-[#F1F5F9] pb-7 pt-7 first:pt-0 last:border-0"
              >
                <h2 className="flex items-baseline gap-3 text-xl font-bold tracking-[-0.02em] text-[#0F172A]">
                  <span className="text-sm font-extrabold text-[#2563EB]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-7 text-[#475569]">
                    {paragraph}
                  </p>
                ))}
                {section.list && section.list.length > 0 && (
                  <ul className="mt-3 space-y-2.5">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#475569]">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#2563EB]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
                En esta página
              </p>
              <ol className="mt-3 space-y-1.5 text-xs">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                    >
                      <span className="mt-px w-4 shrink-0 text-right font-mono text-[10px] text-[#94A3B8]">
                        {index + 1}
                      </span>
                      <span className="leading-5">{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <p className="text-sm font-bold text-[#0F172A]">¿Tienes alguna duda?</p>
              <p className="mt-1 text-xs leading-5 text-[#475569]">
                Escríbenos y te respondemos en menos de 24 horas hábiles.
              </p>
              <div className="mt-3 space-y-2">
                <a
                  href={`mailto:${EMPRESA.email}`}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-[#0F172A] transition hover:text-[#2563EB]"
                >
                  <Mail className="size-4 text-[#2563EB]" /> {EMPRESA.email}
                </a>
                <a
                  href={phoneHref}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-[#0F172A] transition hover:text-[#2563EB]"
                >
                  <Phone className="size-4 text-[#2563EB]" /> {EMPRESA.telefono}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
                <ShieldCheck className="size-3.5 text-[#2563EB]" /> Otros documentos
              </p>
              <ul className="mt-3 space-y-1.5 text-xs">
                {LEGAL_LINKS.filter((link) => link.href !== path).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                    >
                      <FileText className="size-3.5 shrink-0 text-[#2563EB]" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
