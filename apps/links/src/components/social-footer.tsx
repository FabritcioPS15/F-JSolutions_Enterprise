import { Globe, ShieldCheck } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'
import { TikTokIcon, WhatsAppIcon } from '@/components/social-icons'
import { PROFILE_INFO } from '@/lib/links-data'

export function SocialFooter() {
  return (
    <footer className="mt-10 mb-6 flex flex-col items-center text-center">
      {/* Social quick icons */}
      <div className="flex items-center gap-4 text-slate-400">
        <a
          href="https://wa.me/51923055963"
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-10 items-center justify-center rounded-full border border-white/5 bg-slate-900/60 transition hover:text-emerald-400 hover:border-emerald-500/30"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon className="size-4" />
        </a>
        <a
          href="https://tiktok.com/@fjsolutions.pe"
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-10 items-center justify-center rounded-full border border-white/5 bg-slate-900/60 transition hover:text-pink-400 hover:border-pink-500/30"
          aria-label="TikTok"
        >
          <TikTokIcon className="size-4" />
        </a>
        <a
          href="https://instagram.com/fjsolutions.pe"
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-10 items-center justify-center rounded-full border border-white/5 bg-slate-900/60 transition hover:text-purple-400 hover:border-purple-500/30"
          aria-label="Instagram"
        >
          <FaInstagram className="size-4" />
        </a>
        <a
          href="https://fjsolutions.com.pe"
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-10 items-center justify-center rounded-full border border-white/5 bg-slate-900/60 transition hover:text-blue-400 hover:border-blue-500/30"
          aria-label="Web"
        >
          <Globe className="size-4" />
        </a>
      </div>

      {/* Brand footer note */}
      <div className="mt-6 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
        <ShieldCheck className="size-3.5 text-blue-400" />
        <span>F&J Solutions Enterprise · All My Links</span>
      </div>

      <p className="mt-1 text-[10px] text-slate-600">
        Lima, Perú · RUC & Marca Registrada
      </p>
    </footer>
  )
}
