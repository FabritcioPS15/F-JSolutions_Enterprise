import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ImageIcon, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export type MediaBandMedia = {
  type?: 'image' | 'video'
  src: string
  poster?: string
  alt: string
}

type MediaBandProps = {
  id?: string
  eyebrow: string
  title: ReactNode
  media: MediaBandMedia
  chips?: string[]
  action?: { label: string; href: string }
  note?: string
  className?: string
}

export function MediaBand({
  id,
  eyebrow,
  title,
  media,
  chips = [],
  action,
  note = 'Ilustración conceptual',
  className,
}: MediaBandProps) {
  const isVideo = media.type === 'video'
  const titleId = id ? `${id}-title` : undefined

  return (
    <section
      aria-labelledby={titleId}
      className={cn('bg-card px-4 py-10 sm:px-6 lg:px-8 lg:py-14', className)}
    >
      <div className="mx-auto max-w-[1280px]">
        <figure className="group relative isolate overflow-hidden rounded-[28px] border border-border bg-[#08192A] shadow-[0_30px_80px_-60px_rgba(15,23,42,0.65)] lg:aspect-[16/9] xl:aspect-[21/9]">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
            {isVideo ? (
              <video
                className="absolute inset-0 size-full object-cover object-[70%_50%] lg:object-center"
                autoPlay
                muted
                loop
                playsInline
                poster={media.poster}
                aria-label={media.alt}
              />
            ) : (
              <Image
                src={media.src}
                alt={media.alt}
                fill
                sizes="(min-width: 1280px) 1216px, calc(100vw - 32px)"
                className="object-cover object-[70%_50%] transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 lg:object-center"
              />
            )}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_top,#08192A_0%,rgba(8,25,42,0.88)_34%,rgba(8,25,42,0.55)_58%,rgba(8,25,42,0.08)_82%)] lg:block"
          />

          <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#08192A]/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/85 backdrop-blur sm:right-6 sm:top-6">
            {isVideo ? <Play className="size-2.5" /> : <ImageIcon className="size-2.5" />}
            {isVideo ? 'Video' : note}
          </span>

          <figcaption className="bg-[#08192A] p-5 sm:p-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:bg-transparent lg:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#75D7E8] sm:text-[11px]">
              {eyebrow}
            </p>
            <h2
              id={titleId}
              className="mt-2 max-w-[46ch] font-heading text-2xl font-bold leading-[1.12] tracking-[-0.04em] text-white sm:text-3xl lg:text-[2.4rem]"
            >
              {title}
            </h2>

            {chips.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/90 backdrop-blur sm:text-[11px]"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            )}

            {action && (
              <Link
                href={action.href}
                className="group/cta mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:text-sm"
              >
                {action.label}
                <ArrowRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5" />
              </Link>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
