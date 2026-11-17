import type { CSSProperties } from 'react'
import type { LinkProfile, ProfileBackground } from '@/lib/link-profiles'

type Rgb = { r: number; g: number; b: number }

function parseHex(hex: string): Rgb {
  const safe = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#7C3AED'
  return {
    r: parseInt(safe.slice(1, 3), 16),
    g: parseInt(safe.slice(3, 5), 16),
    b: parseInt(safe.slice(5, 7), 16),
  }
}

function luminance(hex: string) {
  const { r, g, b } = parseHex(hex)
  const channel = (value: number) => {
    const ratio = value / 255
    return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function shift(hex: string, target: number, amount: number) {
  const { r, g, b } = parseHex(hex)
  const mix = (value: number) => Math.round(value + (target - value) * amount)
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

function lighten(hex: string, amount = 0.42) {
  return shift(hex, 255, amount)
}

function darken(hex: string, amount = 0.2) {
  return shift(hex, 0, amount)
}

export function resolveInk(profile: LinkProfile): 'light' | 'dark' {
  if (profile.tone === 'light' || profile.tone === 'dark') return profile.tone
  const background = profile.background
  if (background.kind === 'solid') return luminance(background.color) < 0.45 ? 'light' : 'dark'
  if (background.kind === 'gradient') {
    const darkest = Math.min(luminance(background.from), luminance(background.to))
    return darkest < 0.45 ? 'light' : 'dark'
  }
  return background.dim >= 35 ? 'light' : 'dark'
}

function backgroundCss(background: ProfileBackground) {
  if (background.kind === 'solid') return background.color
  if (background.kind === 'gradient') {
    return `linear-gradient(${background.angle}deg, ${background.from}, ${background.to})`
  }
  const veil = Math.min(85, Math.max(0, background.dim)) / 100
  return `linear-gradient(rgba(2, 6, 23, ${veil}), rgba(2, 6, 23, ${veil})), url("${background.url}") center / cover no-repeat`
}

function accentVars(hex: string) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.toUpperCase() : '#7C3AED'
  const { r, g, b } = parseHex(safe)
  return {
    '--accent': safe,
    '--accent-light': lighten(safe),
    '--accent-soft': `rgba(${r}, ${g}, ${b}, 0.16)`,
    '--accent-border': `rgba(${r}, ${g}, ${b}, 0.42)`,
    '--accent-glow': `rgba(${r}, ${g}, ${b}, 0.32)`,
  }
}

// Todas las páginas comparten variables: el fondo lo elige la empresa y el
// contraste del texto se resuelve solo, salvo que el editor lo fuerce.
export function profileThemeVars(profile: LinkProfile): CSSProperties {
  const ink = resolveInk(profile)
  const onLight = ink === 'dark'
  const accent = accentVars(profile.accent)

  return {
    ...accent,
    '--page-bg': backgroundCss(profile.background),
    '--page-ink': onLight ? '#0F172A' : '#F8FAFC',
    '--page-ink-soft': onLight ? '#334155' : '#CBD5E1',
    '--page-ink-muted': onLight ? '#64748B' : '#94A3B8',
    '--page-card': onLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(17, 24, 39, 0.66)',
    '--page-card-hover': onLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(30, 41, 59, 0.85)',
    '--page-border': onLight ? 'rgba(15, 23, 42, 0.10)' : 'rgba(255, 255, 255, 0.10)',
    '--page-border-strong': onLight ? 'rgba(15, 23, 42, 0.18)' : 'rgba(255, 255, 255, 0.22)',
    '--page-surface-solid': onLight ? '#F8FAFC' : '#0B0F19',
    '--page-accent-ink': onLight ? darken(profile.accent, 0.2) : lighten(profile.accent, 0.42),
    '--page-shadow': onLight
      ? '0 12px 32px -18px rgba(15, 23, 42, 0.35)'
      : '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
    '--status-ink': onLight ? '#047857' : '#34D399',
    '--status-bg': onLight ? 'rgba(5, 150, 105, 0.10)' : 'rgba(16, 185, 129, 0.12)',
    '--status-border': onLight ? 'rgba(5, 150, 105, 0.30)' : 'rgba(16, 185, 129, 0.35)',
    '--status-dot': onLight ? '#059669' : '#34D399',
    '--badge-emerald-ink': onLight ? '#047857' : '#6EE7B7',
    '--badge-emerald-bg': onLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.20)',
    '--badge-emerald-border': onLight ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.30)',
    '--badge-amber-ink': onLight ? '#B45309' : '#FCD34D',
    '--badge-amber-bg': onLight ? 'rgba(245, 158, 11, 0.14)' : 'rgba(245, 158, 11, 0.20)',
    '--badge-amber-border': onLight ? 'rgba(245, 158, 11, 0.30)' : 'rgba(245, 158, 11, 0.30)',
    '--badge-blue-ink': onLight ? '#1D4ED8' : '#93C5FD',
    '--badge-blue-bg': onLight ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.20)',
    '--badge-blue-border': onLight ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.30)',
  } as CSSProperties
}
