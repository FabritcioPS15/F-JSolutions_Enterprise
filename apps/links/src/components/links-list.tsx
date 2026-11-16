'use client'

import { useState } from 'react'
import {
  Code2,
  Globe,
  GraduationCap,
  MessageCircle,
  Share2,
  ShoppingBag,
  Sparkles,
  UserPlus,
  Video,
  Wrench,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import {
  LINK_CATEGORIES,
  QUICK_LINKS,
  PROFILE_INFO,
  type LinkCategory,
  type QuickLink,
} from '@/lib/links-data'
import { FaInstagram } from 'react-icons/fa'
import { TikTokIcon, WhatsAppIcon } from '@/components/social-icons'

const badgeColorStyles = {
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
}

function renderIcon(iconKey: string, isHighlight: boolean) {
  if (iconKey === 'Instagram') {
    return <FaInstagram className="size-5" />
  }
  if (iconKey === 'Video') {
    return <TikTokIcon className="size-5" />
  }
  if (iconKey === 'MessageCircle') {
    return <WhatsAppIcon className="size-5" />
  }

  const map: Record<string, LucideIcon> = {
    ShoppingBag,
    Code2,
    GraduationCap,
    Wrench,
    Globe,
    UserPlus,
  }

  const Icon = map[iconKey] || Globe
  return <Icon className="size-5" />
}

export function LinksList() {
  const [activeCategory, setActiveCategory] = useState<LinkCategory>('all')

  const filtered = QUICK_LINKS.filter((item) => {
    if (activeCategory === 'all') return true
    return item.category === activeCategory
  })

  function downloadVCard() {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Solutions Enterprise;F&J;;;
FN:F&J Solutions Enterprise
ORG:F&J Solutions Enterprise
TITLE:Soluciones Tecnológicas Corporativas
TEL;TYPE=CELL,VOICE:${PROFILE_INFO.phone}
EMAIL;TYPE=PREF,INTERNET:${PROFILE_INFO.email}
URL:${PROFILE_INFO.website}
ADR;TYPE=WORK:;;Lima;Lima;;;Peru
NOTE:Hardware, Desarrollo de Software, Ciberseguridad e Instituto Tecnológico F&J Academy.
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'FJ_Solutions_Enterprise.vcf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function handleLinkClick(item: QuickLink, e: React.MouseEvent) {
    if (item.onClickAction === 'vcard') {
      e.preventDefault()
      downloadVCard()
    }
  }

  return (
    <div className="mt-6 w-full">
      {/* Category Pills */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {LINK_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white shadow-md shadow-[#5B21B6]/30'
                  : 'border border-white/5 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Links Stack */}
      <div className="mt-4 flex flex-col gap-3">
        {filtered.map((item) => {
          const isHighlight = item.highlight

          return (
            <a
              key={item.id}
              href={item.url}
              target={item.onClickAction ? undefined : '_blank'}
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(item, e)}
              className={`group glass-button relative flex items-center justify-between gap-3.5 rounded-2xl p-4 transition-all duration-200 ${
                isHighlight
                  ? 'border-[#7C3AED]/40 bg-gradient-to-r from-[#1E1B4B]/80 via-slate-900/80 to-[#1E1B4B]/80 shadow-lg shadow-[#5B21B6]/20'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${
                    isHighlight
                      ? 'bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] text-white shadow-md shadow-[#5B21B6]/30'
                      : 'border border-white/10 bg-slate-800/80 text-slate-300'
                  }`}
                >
                  {renderIcon(item.icon, Boolean(isHighlight))}
                </div>

                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-xs font-bold text-white group-hover:text-[#DDD6FE] transition truncate">
                      {item.title}
                    </p>
                  </div>
                  {item.subtitle && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.badge && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      badgeColorStyles[item.badgeColor ?? 'purple']
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="size-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
