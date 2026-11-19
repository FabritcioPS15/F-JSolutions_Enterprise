'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const NAV_LINKS = [
  { href: '#programas', label: 'Programas' },
  { href: '#metodologia', label: 'Metodología' },
  { href: '#docentes', label: 'Docentes' },
  { href: '#testimonios', label: 'Egresados' },
]

export function AcademyHeader({ onOpenEnroll }: { onOpenEnroll: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/sparktree-horizontal.png"
            alt="SparkTree Academia"
            className="h-10 w-auto object-contain brightness-0 sm:h-11"
          />
          <div className="hidden flex-col leading-tight sm:flex">
            <p className="text-[13px] font-semibold tracking-tight text-ink-900">Academia</p>
            <p className="text-[11px] text-ink-500">Instituto de tecnología</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-ink-600 transition hover:text-ink-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="https://fjsolutions.com.pe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-500 transition hover:text-ink-900"
          >
            SparkTree Empresa
            <ArrowUpRight className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={onOpenEnroll}
            className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-[13px] font-semibold text-white transition hover:bg-brand-700"
          >
            Inscribirme
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid size-9 place-items-center rounded-lg border border-line text-ink-600 md:hidden"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-line bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-ink-700 hover:bg-surface-muted"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenEnroll()
            }}
            className="mt-2 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Inscribirme
          </button>
        </div>
      )}
    </header>
  )
}
