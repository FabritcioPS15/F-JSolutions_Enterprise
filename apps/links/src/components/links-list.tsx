'use client'

import {
  Calendar,
  Code2,
  Globe,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
  ShoppingBag,
  UserPlus,
  Video,
  Wrench,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'
import { TikTokIcon, WhatsAppIcon } from '@/components/social-icons'
import type { LinkProfile, ProfileLink } from '@/lib/link-profiles'

const badgeColorStyles = {
  emerald:
    'bg-[var(--badge-emerald-bg)] text-[var(--badge-emerald-ink)] border-[var(--badge-emerald-border)]',
  amber: 'bg-[var(--badge-amber-bg)] text-[var(--badge-amber-ink)] border-[var(--badge-amber-border)]',
  purple: 'bg-[var(--accent-soft)] text-[var(--page-accent-ink)] border-[var(--accent-border)]',
  blue: 'bg-[var(--badge-blue-bg)] text-[var(--badge-blue-ink)] border-[var(--badge-blue-border)]',
}

function renderIcon(iconKey: string) {
  if (iconKey === 'Instagram') return <FaInstagram className="size-5" />
  if (iconKey === 'Video') return <TikTokIcon className="size-5" />
  if (iconKey === 'MessageCircle') return <WhatsAppIcon className="size-5" />

  const map: Record<string, LucideIcon> = {
    ShoppingBag,
    Code2,
    GraduationCap,
    Wrench,
    Globe,
    UserPlus,
    Mail,
    Phone,
    Calendar,
  }

  const Icon = map[iconKey] || Globe
  return <Icon className="size-5" />
}

function downloadVCard(profile: LinkProfile) {
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:;${profile.name};;;
FN:${profile.name}
ORG:${profile.name}
TEL;TYPE=CELL,VOICE:${profile.phone}
EMAIL;TYPE=PREF,INTERNET:${profile.email}
URL:${profile.website}
ADR;TYPE=WORK:;;${profile.location};;;;
NOTE:${profile.bio.replace(/\n/g, ' ')}
END:VCARD`

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${profile.slug || 'contacto'}.vcf`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

async function sharePage(profile: LinkProfile) {
  const url = window.location.href
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: profile.name, text: profile.bio, url })
    } catch {
      // El usuario canceló el diálogo nativo.
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

export function LinksList({ profile }: { profile: LinkProfile }) {
  function handleLinkClick(link: ProfileLink, event: React.MouseEvent) {
    if (link.action === 'vcard') {
      event.preventDefault()
      downloadVCard(profile)
    }
    if (link.action === 'share') {
      event.preventDefault()
      void sharePage(profile)
    }
  }

  return (
    <div className="mt-6 w-full">
      {profile.links.length === 0 ? (
        <p className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-card)] px-4 py-8 text-center text-xs text-[var(--page-ink-muted)]">
          Esta página aún no tiene enlaces publicados.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {profile.links.map((item) => {
            const isHighlight = item.highlight

            return (
              <a
                key={item.id}
                href={item.url}
                target={item.action ? undefined : '_blank'}
                rel="noopener noreferrer"
                onClick={(event) => handleLinkClick(item, event)}
                className={`group glass-button relative flex items-center justify-between gap-3.5 rounded-2xl p-4 transition-all duration-200 ${
                  isHighlight ? 'link-highlight' : ''
                }`}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${
                      isHighlight
                        ? 'bg-[linear-gradient(135deg,var(--accent),var(--accent-light))] text-white shadow-[0_10px_25px_-8px_var(--accent-glow)]'
                        : 'border border-[var(--page-border-strong)] bg-[var(--page-card)] text-[var(--page-ink-soft)]'
                    }`}
                  >
                    {renderIcon(item.icon)}
                  </div>

                  <div className="min-w-0 text-left">
                    <p className="font-heading truncate text-xs font-bold text-[var(--page-ink)] transition group-hover:text-[var(--page-accent-ink)]">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="mt-0.5 truncate text-[11px] text-[var(--page-ink-muted)]">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {item.badge && (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        badgeColorStyles[item.badgeColor] ?? badgeColorStyles.purple
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="size-4 text-[var(--page-ink-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--page-ink)]" />
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
