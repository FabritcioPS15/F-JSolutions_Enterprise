import { Globe, ShieldCheck } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'
import { TikTokIcon, WhatsAppIcon } from '@/components/social-icons'
import type { LinkProfile } from '@/lib/link-profiles'

export function SocialFooter({ profile }: { profile: LinkProfile }) {
  const socials = [
    {
      key: 'whatsapp',
      href: profile.socials.whatsapp,
      label: 'WhatsApp',
      icon: <WhatsAppIcon className="size-4" />,
      hover: 'hover:border-emerald-500/40 hover:text-emerald-500',
    },
    {
      key: 'tiktok',
      href: profile.socials.tiktok,
      label: 'TikTok',
      icon: <TikTokIcon className="size-4" />,
      hover: 'hover:border-pink-500/40 hover:text-pink-500',
    },
    {
      key: 'instagram',
      href: profile.socials.instagram,
      label: 'Instagram',
      icon: <FaInstagram className="size-4" />,
      hover: 'hover:border-purple-500/40 hover:text-purple-500',
    },
    {
      key: 'website',
      href: profile.socials.website,
      label: 'Web',
      icon: <Globe className="size-4" />,
      hover: 'hover:border-blue-500/40 hover:text-blue-500',
    },
  ].filter((social) => Boolean(social.href))

  return (
    <footer className="mb-6 mt-10 flex flex-col items-center text-center">
      {socials.length > 0 && (
        <div className="flex items-center gap-4 text-[var(--page-ink-muted)]">
          {socials.map((social) => (
            <a
              key={social.key}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex size-10 items-center justify-center rounded-full border border-[var(--page-border)] bg-[var(--page-card)] transition ${social.hover}`}
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--page-ink-muted)]">
        <ShieldCheck className="size-3.5 text-[var(--page-accent-ink)]" />
        <span>{profile.name} · Linkeador</span>
      </div>

      {profile.footerNote && (
        <p className="mt-1 text-[10px] text-[var(--page-ink-muted)] opacity-80">{profile.footerNote}</p>
      )}
    </footer>
  )
}
