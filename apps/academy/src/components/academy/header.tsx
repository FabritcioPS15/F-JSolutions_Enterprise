'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Menu, X, ArrowUpRight, Sparkles, BookOpen } from 'lucide-react'

export function AcademyHeader({ onOpenEnroll }: { onOpenEnroll: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] text-white shadow-lg shadow-[#5B21B6]/30 transition group-hover:scale-105">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-black tracking-tight text-white">
                F&J <span className="text-[#A78BFA]">ACADEMY</span>
              </span>
              <span className="rounded-full border border-[#5B21B6]/40 bg-[#5B21B6]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#C4B5FD]">
                Instituto TI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Powered by F&J Solutions Enterprise</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#programas"
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:text-white"
          >
            Programas & Carreras
          </a>
          <a
            href="#metodologia"
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:text-white"
          >
            Metodología F&J
          </a>
          <a
            href="#docentes"
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:text-white"
          >
            Docentes
          </a>
          <a
            href="#testimonios"
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:text-white"
          >
            Egresados
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://fjsolutions.com.pe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-white"
          >
            <span>Ir a F&J Empresa</span>
            <ArrowUpRight className="size-3.5" />
          </a>

          <button
            type="button"
            onClick={onOpenEnroll}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5B21B6]/25 transition hover:brightness-110 active:scale-95"
          >
            <Sparkles className="size-3.5" />
            <span>Postular / Inscribirme</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid size-10 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 md:hidden"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Nav dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-[#0B0F19] px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#programas"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200"
            >
              Programas & Carreras
            </a>
            <a
              href="#metodologia"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200"
            >
              Metodología F&J
            </a>
            <a
              href="#docentes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200"
            >
              Docentes
            </a>
            <a
              href="#testimonios"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200"
            >
              Egresados
            </a>

            <div className="mt-2 flex flex-col gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenEnroll()
                }}
                className="w-full rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] py-3 text-center text-xs font-bold text-white"
              >
                Postular / Inscribirme
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
