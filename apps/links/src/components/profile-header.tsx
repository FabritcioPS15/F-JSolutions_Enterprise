'use client'

import { CheckCircle2, MapPin, Share2 } from 'lucide-react'
import type { LinkProfile } from '@/lib/link-profiles'

export function ProfileHeader({ profile }: { profile: LinkProfile }) {
  async function handleShare() {
    const url = window.location.href
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: profile.bio,
          url,
        })
      } catch {
        // Ignorar cancelación del usuario
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      alert('¡Enlace copiado al portapapeles!')
    } catch {
      // Sin permiso de portapapeles no hay una alternativa silenciosa.
    }
  }

  return (
    <header className="flex flex-col items-center text-center">
      {/* Share floating button */}
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={handleShare}
          className="flex size-9 items-center justify-center rounded-full border border-[var(--page-border)] bg-[var(--page-card)] text-[var(--page-ink-muted)] transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-soft)] hover:text-[var(--page-ink)]"
          aria-label="Compartir perfil"
          title="Compartir perfil"
        >
          <Share2 className="size-4" />
        </button>
      </div>

      {/* Avatar */}
      <div className="relative mt-2">
        <div
          className={`relative flex items-center justify-center bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] p-1 shadow-[0_25px_60px_-18px_var(--accent-glow)] ${
            profile.avatarUrl ? 'h-[104px] w-[188px] rounded-[30px]' : 'size-24 rounded-full'
          }`}
        >
          <div
            className={`flex size-full items-center justify-center overflow-hidden text-2xl font-black tracking-tighter text-[var(--page-ink)] ${
              profile.avatarUrl
                ? 'rounded-[26px] bg-white p-2.5'
                : 'rounded-full bg-[var(--page-surface-solid)]'
            }`}
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="size-full object-contain"
              />
            ) : (
              profile.initials || 'FJ'
            )}
          </div>
        </div>
        {profile.verified && (
          <div
            className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-blue-500 text-white shadow-md ring-4 ring-[var(--page-surface-solid)]"
            title="Empresa verificada"
          >
            <CheckCircle2 className="size-4" />
          </div>
        )}
      </div>

      {/* Name and Handle */}
      <h1 className="font-heading mt-4 flex items-center justify-center gap-1.5 text-xl font-black tracking-tight text-[var(--page-ink)]">
        <span>{profile.name}</span>
      </h1>
      {profile.handle && (
        <p className="mt-0.5 text-xs font-semibold text-[var(--page-accent-ink)]">{profile.handle}</p>
      )}

      {/* Bio */}
      {profile.bio && (
        <p className="mt-3 max-w-sm text-xs leading-relaxed text-[var(--page-ink-soft)]">{profile.bio}</p>
      )}

      {profile.location && (
        <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--page-ink-muted)]">
          <MapPin className="size-3" aria-hidden="true" />
          {profile.location}
        </p>
      )}

      {/* Status Live Pill */}
      {profile.statusEnabled && profile.statusText && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--status-border)] bg-[var(--status-bg)] px-3 py-1 text-[11px] font-bold text-[var(--status-ink)]">
          <span className="size-2 animate-ping rounded-full bg-[var(--status-dot)]" />
          <span>{profile.statusText}</span>
        </div>
      )}
    </header>
  )
}
