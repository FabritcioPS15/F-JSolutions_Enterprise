'use client'

import { CheckCircle2, Share2, Sparkles, MapPin } from 'lucide-react'
import { PROFILE_INFO } from '@/lib/links-data'

export function ProfileHeader() {
  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: PROFILE_INFO.name,
          text: PROFILE_INFO.bio,
          url: window.location.href,
        })
      } catch {
        // Ignorar cancelación del usuario
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('¡Enlace copiado al portapapeles!')
    }
  }

  return (
    <header className="flex flex-col items-center text-center">
      {/* Share floating button */}
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={handleShare}
          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition"
          aria-label="Compartir perfil"
          title="Compartir perfil"
        >
          <Share2 className="size-4" />
        </button>
      </div>

      {/* Avatar */}
      <div className="relative mt-2">
        <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#5B21B6] via-[#7C3AED] to-[#A78BFA] p-1 shadow-2xl shadow-[#5B21B6]/40">
          <div className="flex size-full items-center justify-center rounded-full bg-[#0B0F19] text-white font-black text-2xl tracking-tighter">
            F&J
          </div>
        </div>
        <div
          className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-blue-500 text-white shadow-md ring-4 ring-[#07090E]"
          title="Empresa Verificada"
        >
          <CheckCircle2 className="size-4" />
        </div>
      </div>

      {/* Name and Handle */}
      <h1 className="mt-4 font-heading text-xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
        <span>{PROFILE_INFO.name}</span>
      </h1>
      <p className="text-xs font-semibold text-[#A78BFA] mt-0.5">{PROFILE_INFO.handle}</p>

      {/* Bio */}
      <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-300">
        {PROFILE_INFO.bio}
      </p>

      {/* Status Live Pill */}
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
        <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Atención en línea disponible</span>
      </div>
    </header>
  )
}
