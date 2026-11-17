import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { PROFILE_INFO, QUICK_LINKS } from '@/lib/links-data'

// Mismas formas que apps/admin/src/lib/links/types.ts. El archivo lo escribe el
// panel y aquí solo se lee: la página pública nunca modifica datos.
export type BadgeColor = 'emerald' | 'amber' | 'purple' | 'blue'

export type ProfileBackground =
  | { kind: 'solid'; color: string }
  | { kind: 'gradient'; from: string; to: string; angle: number }
  | { kind: 'image'; url: string; dim: number }

export type ProfileTone = 'auto' | 'light' | 'dark'

export type ProfileLink = {
  id: string
  title: string
  subtitle: string
  url: string
  icon: string
  badge: string
  badgeColor: BadgeColor
  highlight: boolean
  action: 'vcard' | 'share' | ''
}

export type LinkProfile = {
  id: string
  slug: string
  name: string
  handle: string
  bio: string
  initials: string
  avatarUrl: string
  verified: boolean
  statusEnabled: boolean
  statusText: string
  location: string
  phone: string
  email: string
  website: string
  accent: string
  background: ProfileBackground
  tone: ProfileTone
  footerNote: string
  socials: { whatsapp: string; tiktok: string; instagram: string; website: string }
  links: ProfileLink[]
  published: boolean
  updatedAt: string
}

const DATA_DIR = process.env.FJ_DATA_DIR ?? path.join(process.cwd(), '..', '..', '.data')
const STORE_PATH = path.join(DATA_DIR, 'link-profiles.json')

const DEFAULT_BACKGROUND: ProfileBackground = {
  kind: 'gradient',
  from: '#0B1220',
  to: '#16213A',
  angle: 160,
}

function hexOr(value: unknown, fallback: string) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback
}

// Las páginas guardadas antes del editor de fondos no traen estos campos.
function normalizeProfile(profile: LinkProfile): LinkProfile {
  const raw = (profile.background ?? {}) as Record<string, unknown>
  let background: ProfileBackground = DEFAULT_BACKGROUND
  if (raw.kind === 'solid') {
    background = { kind: 'solid', color: hexOr(raw.color, '#0B1220') }
  } else if (raw.kind === 'gradient') {
    const angle = Number(raw.angle)
    background = {
      kind: 'gradient',
      from: hexOr(raw.from, '#0B1220'),
      to: hexOr(raw.to, '#16213A'),
      angle: Number.isFinite(angle) ? Math.min(360, Math.max(0, Math.round(angle))) : 160,
    }
  } else if (raw.kind === 'image' && typeof raw.url === 'string' && raw.url) {
    const dim = Number(raw.dim)
    background = {
      kind: 'image',
      url: raw.url,
      dim: Number.isFinite(dim) ? Math.min(85, Math.max(0, Math.round(dim))) : 45,
    }
  }

  return {
    ...profile,
    background,
    tone: profile.tone === 'light' || profile.tone === 'dark' ? profile.tone : 'auto',
  }
}

function fallbackProfile(): LinkProfile {
  return {
    id: 'fjsolutions',
    slug: 'fjsolutions',
    name: PROFILE_INFO.name,
    handle: PROFILE_INFO.handle,
    bio: PROFILE_INFO.bio,
    initials: 'FJ',
    avatarUrl: '',
    verified: true,
    statusEnabled: true,
    statusText: 'Atención en línea disponible',
    location: PROFILE_INFO.location,
    phone: PROFILE_INFO.phone,
    email: PROFILE_INFO.email,
    website: PROFILE_INFO.website,
    accent: '#7C3AED',
    background: DEFAULT_BACKGROUND,
    tone: 'auto',
    footerNote: 'Lima, Perú · RUC & Marca Registrada',
    socials: {
      whatsapp: 'https://wa.me/51923055963',
      tiktok: 'https://tiktok.com/@fjsolutions.pe',
      instagram: 'https://instagram.com/fjsolutions.pe',
      website: PROFILE_INFO.website,
    },
    links: QUICK_LINKS.map((link) => ({
      id: link.id,
      title: link.title,
      subtitle: link.subtitle ?? '',
      url: link.url,
      icon: link.icon,
      badge: link.badge ?? '',
      badgeColor: link.badgeColor ?? 'purple',
      highlight: Boolean(link.highlight),
      action: link.onClickAction === 'vcard' || link.onClickAction === 'share' ? link.onClickAction : '',
    })),
    published: true,
    updatedAt: new Date().toISOString(),
  }
}

export async function listLinkProfiles(): Promise<LinkProfile[]> {
  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as { profiles?: LinkProfile[] }
    if (!Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
      return [fallbackProfile()]
    }
    return parsed.profiles.map(normalizeProfile)
  } catch {
    // Sin archivo del panel se mantiene la página histórica de F&J.
    return [fallbackProfile()]
  }
}

export async function findLinkProfile(slug?: string): Promise<LinkProfile | null> {
  const profiles = await listLinkProfiles()
  if (!slug) return profiles[0] ?? null
  return profiles.find((profile) => profile.slug === slug) ?? null
}
