import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { isEmail } from '@fj-solutions/contracts/domain'
import {
  BADGE_COLORS,
  DEFAULT_BACKGROUND,
  LINK_ICON_KEYS,
  initialsFromName,
  type BadgeColor,
  type LinkIconKey,
  type LinkProfile,
  type LinkProfileInput,
  type LinkAction,
  type ProfileBackground,
  type ProfileLink,
  type ProfileSocials,
  type ProfileTone,
} from './types'

// Mismo directorio compartido que usan la tienda y el libro de reclamaciones.
const STORE_DIR = process.env.FJ_DATA_DIR ?? path.join(process.cwd(), '..', '..', '.data')
const STORE_PATH = path.join(STORE_DIR, 'link-profiles.json')

type StoreFile = {
  version: 1
  profiles: LinkProfile[]
}

export class LinkProfileError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

let queue: Promise<unknown> = Promise.resolve()

function withStore<T>(task: (store: StoreFile) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const store = await readStore()
    const result = await task(store)
    await writeStore(store)
    return result
  })
  queue = run.catch(() => undefined)
  return run
}

function withRead<T>(task: (store: StoreFile) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => task(await readStore()))
  queue = run.catch(() => undefined)
  return run
}

function storeAppUrl() {
  const base = process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006'
  return base.replace(/\/+$/, '')
}

function academyAppUrl() {
  return (process.env.NEXT_PUBLIC_ACADEMY_APP_URL ?? 'http://localhost:3004').replace(/\/+$/, '')
}

function seedLinks(): ProfileLink[] {
  const links: ProfileLink[] = [
    {
      id: 'whatsapp-ventas',
      title: 'Chatear por WhatsApp (Ventas & Cotizaciones)',
      subtitle: 'Atención personalizada en menos de 5 minutos',
      url: 'https://wa.me/51923055963?text=Hola%20F%26J%20Solutions,%20vengo%20desde%20sus%20redes%20sociales%20y%20deseo%20informaci%C3%B3n.',
      icon: 'MessageCircle',
      badge: 'MÁS RÁPIDO',
      badgeColor: 'emerald',
      highlight: true,
      action: '',
    },
    {
      id: 'catalogo-productos',
      title: 'Catálogo de Equipos & Hardware TI',
      subtitle: 'Laptops, Servidores, Redes, Componentes y Accesorios',
      url: `${storeAppUrl()}/productos`,
      icon: 'ShoppingBag',
      badge: 'TIENDA',
      badgeColor: 'purple',
      highlight: false,
      action: '',
    },
    {
      id: 'desarrollo-software',
      title: 'Cotizar Desarrollo de Software & Apps Web',
      subtitle: 'Sistemas a medida, ERPs, E-commerce e infraestructura Cloud',
      url: 'https://fjsolutions.com.pe/servicios',
      icon: 'Code2',
      badge: 'EMPRESAS',
      badgeColor: 'blue',
      highlight: false,
      action: '',
    },
    {
      id: 'fj-academy',
      title: 'F&J Academy — Cursos & Certificaciones TI',
      subtitle: 'Programación Full Stack, DevOps, Ciberseguridad e IA',
      url: academyAppUrl(),
      icon: 'GraduationCap',
      badge: 'NUEVO',
      badgeColor: 'amber',
      highlight: true,
      action: '',
    },
    {
      id: 'whatsapp-soporte',
      title: 'Mesa de Ayuda & Soporte Técnico',
      subtitle: 'Atención a clientes corporativos con convenios vigentes',
      url: 'https://wa.me/51923055963?text=Hola,%20necesito%20soporte%20t%C3%A9cnico%20para%20mi%20empresa.',
      icon: 'Wrench',
      badge: '',
      badgeColor: 'purple',
      highlight: false,
      action: '',
    },
    {
      id: 'tiktok-oficial',
      title: 'Síguenos en TikTok',
      subtitle: '@fjsolutions.pe · Tips de tecnología, hardware y proyectos',
      url: 'https://tiktok.com/@fjsolutions.pe',
      icon: 'Video',
      badge: '',
      badgeColor: 'purple',
      highlight: false,
      action: '',
    },
    {
      id: 'instagram-oficial',
      title: 'Síguenos en Instagram',
      subtitle: '@fjsolutions.pe · Novedades, unboxings y casos de éxito',
      url: 'https://instagram.com/fjsolutions.pe',
      icon: 'Instagram',
      badge: '',
      badgeColor: 'purple',
      highlight: false,
      action: '',
    },
    {
      id: 'sitio-web-oficial',
      title: 'Página Web Oficial',
      subtitle: 'Conoce todo sobre F&J Solutions Enterprise',
      url: 'https://fjsolutions.com.pe',
      icon: 'Globe',
      badge: '',
      badgeColor: 'purple',
      highlight: false,
      action: '',
    },
    {
      id: 'guardar-contacto',
      title: 'Guardar Contacto en tu Celular (VCard)',
      subtitle: 'Agrega a F&J Solutions a tus contactos con 1 toque',
      url: '#',
      icon: 'UserPlus',
      badge: '',
      badgeColor: 'purple',
      highlight: false,
      action: 'vcard',
    },
  ]
  return links
}

function seedProfile(): LinkProfile {
  return {
    id: 'fjsolutions',
    slug: 'fjsolutions',
    name: 'F&J Solutions Enterprise',
    handle: '@fjsolutions.pe',
    bio: 'Soluciones Tecnológicas Corporativas · Hardware, Desarrollo de Software & Soporte TI en Perú 🇵🇪',
    initials: 'FJ',
    avatarUrl: '',
    verified: true,
    statusEnabled: true,
    statusText: 'Atención en línea disponible',
    location: 'Lima, Perú',
    phone: '+51 923 055 963',
    email: 'ventas@fjsolutions.com.pe',
    website: 'https://fjsolutions.com.pe',
    accent: '#7C3AED',
    background: DEFAULT_BACKGROUND,
    tone: 'auto',
    footerNote: 'Lima, Perú · RUC & Marca Registrada',
    socials: {
      whatsapp: 'https://wa.me/51923055963',
      tiktok: 'https://tiktok.com/@fjsolutions.pe',
      instagram: 'https://instagram.com/fjsolutions.pe',
      website: 'https://fjsolutions.com.pe',
    },
    links: seedLinks(),
    published: true,
    updatedAt: new Date().toISOString(),
  }
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Partial<StoreFile>
    if (!Array.isArray(parsed.profiles)) throw new Error('formato inválido')
    const store: StoreFile = {
      version: 1,
      profiles: parsed.profiles.map(storedProfileDefaults),
    }
    ensureSeeded(store)
    return store
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { version: 1, profiles: [seedProfile()] }
    }
    console.error('[admin/links] No se pudo leer el almacén de páginas:', error)
    throw new LinkProfileError('No se pudo leer el almacén de páginas AllMyLinks.', 500)
  }
}

async function writeStore(store: StoreFile) {
  await mkdir(STORE_DIR, { recursive: true })
  const temp = `${STORE_PATH}.${process.pid}.tmp`
  await writeFile(temp, JSON.stringify(store, null, 2), 'utf8')
  await rename(temp, STORE_PATH)
}

function ensureSeeded(store: StoreFile) {
  if (store.profiles.length === 0) store.profiles.push(seedProfile())
}

function text(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback
}

function bool(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

export function normalizeSlug(raw: string) {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function normalizeUrl(raw: string, allowHash: boolean): string | null {
  const value = raw.trim()
  if (!value) return null
  if (value === '#') return allowHash ? '#' : null
  if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) return value
  if (value.startsWith('/')) return value
  if (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/i.test(value)) return `https://${value}`
  return null
}

function normalizePhoneLink(raw: string) {
  const value = raw.trim()
  if (!value) return ''
  return /^(tel:|https?:\/\/)/i.test(value) ? value : `tel:${value.replace(/[^\d+]/g, '')}`
}

function normalizeSocial(raw: string): string {
  const value = raw.trim()
  if (!value) return ''
  return normalizeUrl(value, false) ?? ''
}

function normalizeLinks(value: unknown, fallback: ProfileLink[]): ProfileLink[] {
  if (value === undefined) return fallback
  if (!Array.isArray(value)) throw new LinkProfileError('La lista de enlaces no es válida.')
  if (value.length > 40) throw new LinkProfileError('Cada página admite como máximo 40 enlaces.')

  const seen = new Set<string>()
  return value.map((entry, index) => {
    const raw = (entry ?? {}) as Record<string, unknown>
    const title = text(raw.title)
    const url = normalizeUrl(text(raw.url), true)
    const icon = (LINK_ICON_KEYS as string[]).includes(text(raw.icon))
      ? (text(raw.icon) as LinkIconKey)
      : 'Globe'
    const badgeColor = (BADGE_COLORS as string[]).includes(text(raw.badgeColor))
      ? (text(raw.badgeColor) as BadgeColor)
      : 'purple'
    const actionValue = text(raw.action)
    const action: LinkAction | '' =
      actionValue === 'vcard' || actionValue === 'share' ? actionValue : ''

    if (title.length < 2) {
      throw new LinkProfileError(`El enlace ${index + 1} necesita un título de al menos 2 caracteres.`)
    }
    if (title.length > 120) {
      throw new LinkProfileError(`El título del enlace ${index + 1} supera los 120 caracteres.`)
    }
    if (!url) {
      throw new LinkProfileError(
        `El enlace ${index + 1} necesita una URL válida (https://, mailto:, tel: o #).`
      )
    }
    if (action && url !== '#') {
      throw new LinkProfileError(
        `El enlace ${index + 1} usa una acción especial; su URL debe ser "#".`
      )
    }

    let id = text(raw.id) || randomUUID()
    if (seen.has(id)) id = randomUUID()
    seen.add(id)

    return {
      id,
      title,
      subtitle: text(raw.subtitle).slice(0, 160),
      url,
      icon,
      badge: text(raw.badge).slice(0, 20),
      badgeColor,
      highlight: bool(raw.highlight, false),
      action,
    }
  })
}

function normalizeSocials(value: unknown, fallback: ProfileSocials): ProfileSocials {
  if (value === undefined) return fallback
  const raw = (value ?? {}) as Record<string, unknown>
  return {
    whatsapp: normalizeSocial(text(raw.whatsapp)),
    tiktok: normalizeSocial(text(raw.tiktok)),
    instagram: normalizeSocial(text(raw.instagram)),
    website: normalizeSocial(text(raw.website)),
  }
}

function normalizeHex(value: unknown, fallback: string) {
  const raw = text(value).toUpperCase()
  return /^#[0-9A-F]{6}$/.test(raw) ? raw : fallback
}

function normalizeBackground(value: unknown, fallback: ProfileBackground): ProfileBackground {
  const raw = (value ?? {}) as Record<string, unknown>
  const kind = text(raw.kind)
  if (kind === 'solid') {
    return { kind: 'solid', color: normalizeHex(raw.color, '#0B1220') }
  }
  if (kind === 'gradient') {
    const angle = Number(raw.angle)
    return {
      kind: 'gradient',
      from: normalizeHex(raw.from, '#0B1220'),
      to: normalizeHex(raw.to, '#16213A'),
      angle: Number.isFinite(angle) ? Math.min(360, Math.max(0, Math.round(angle))) : 160,
    }
  }
  if (kind === 'image') {
    const url = normalizeUrl(text(raw.url), false) ?? ''
    if (!url) return fallback
    const dim = Number(raw.dim)
    return {
      kind: 'image',
      url,
      dim: Number.isFinite(dim) ? Math.min(85, Math.max(0, Math.round(dim))) : 45,
    }
  }
  return fallback
}

function normalizeTone(value: unknown): ProfileTone {
  const raw = text(value)
  return raw === 'light' || raw === 'dark' ? raw : 'auto'
}

function storedProfileDefaults(profile: LinkProfile): LinkProfile {
  return {
    ...profile,
    background: normalizeBackground(profile.background, DEFAULT_BACKGROUND),
    tone: normalizeTone(profile.tone),
  }
}

function validateProfile(
  input: Partial<LinkProfileInput>,
  existing?: LinkProfile
): LinkProfileInput {
  const name = text(input.name, existing?.name ?? '')
  if (name.length < 2 || name.length > 80) {
    throw new LinkProfileError('El nombre de la empresa debe tener entre 2 y 80 caracteres.')
  }

  const slug = normalizeSlug(text(input.slug, existing?.slug ?? '') || name)
  if (slug.length < 2) {
    throw new LinkProfileError('El enlace público necesita al menos 2 caracteres válidos.')
  }

  let handle = text(input.handle, existing?.handle ?? '')
  if (handle && !handle.startsWith('@')) handle = `@${handle}`
  if (handle.length > 60) throw new LinkProfileError('El usuario visible supera los 60 caracteres.')

  const bio = text(input.bio, existing?.bio ?? '')
  if (bio.length > 500) throw new LinkProfileError('La biografía supera los 500 caracteres.')

  const email = text(input.email, existing?.email ?? '')
  if (email && !isEmail(email)) throw new LinkProfileError('El correo de contacto no es válido.')

  const websiteRaw = text(input.website, existing?.website ?? '')
  const website = (websiteRaw ? normalizeUrl(websiteRaw, false) : '') ?? ''
  if (websiteRaw && !website) throw new LinkProfileError('La página web no es una URL válida.')

  const accentRaw = text(input.accent, existing?.accent ?? '#7C3AED')
  if (!/^#[0-9a-fA-F]{6}$/.test(accentRaw)) {
    throw new LinkProfileError('El color de acento debe ser un hex de 6 dígitos (ej. #7C3AED).')
  }

  const initialsRaw = text(input.initials, existing?.initials ?? '')
  if (initialsRaw.length > 4) throw new LinkProfileError('Las iniciales admiten 4 caracteres como máximo.')

  const avatarRaw = text(input.avatarUrl, existing?.avatarUrl ?? '')
  const avatarUrl = (avatarRaw ? normalizeUrl(avatarRaw, false) : '') ?? ''
  if (avatarRaw && !avatarUrl) throw new LinkProfileError('La URL del avatar no es válida.')

  const phoneRaw = text(input.phone, existing?.phone ?? '')
  const socialsInput = input.socials ?? existing?.socials
  const socials = normalizeSocials(socialsInput, {
    whatsapp: '',
    tiktok: '',
    instagram: '',
    website: '',
  })
  if (!socials.whatsapp && phoneRaw) socials.whatsapp = normalizePhoneLink(phoneRaw)

  return {
    slug,
    name,
    handle,
    bio,
    initials: (initialsRaw || initialsFromName(name)).toUpperCase(),
    avatarUrl,
    verified: bool(input.verified, existing?.verified ?? false),
    statusEnabled: bool(input.statusEnabled, existing?.statusEnabled ?? true),
    statusText: text(input.statusText, existing?.statusText ?? 'Atención en línea disponible').slice(
      0,
      80
    ),
    location: text(input.location, existing?.location ?? '').slice(0, 80),
    phone: phoneRaw.slice(0, 40),
    email,
    website,
    accent: accentRaw.toUpperCase(),
    background: normalizeBackground(input.background, existing?.background ?? DEFAULT_BACKGROUND),
    tone: normalizeTone(input.tone ?? existing?.tone),
    footerNote: text(input.footerNote, existing?.footerNote ?? '').slice(0, 160),
    socials,
    links: normalizeLinks(input.links, existing?.links ?? []),
    published: bool(input.published, existing?.published ?? true),
  }
}

function assertUniqueSlug(store: StoreFile, slug: string, ignoreId?: string) {
  if (store.profiles.some((profile) => profile.slug === slug && profile.id !== ignoreId)) {
    throw new LinkProfileError('Ya existe otra página con este enlace público.', 409)
  }
}

export function listLinkProfiles() {
  return withRead((store) => store.profiles)
}

export function getLinkProfile(id: string) {
  return withRead((store) => store.profiles.find((profile) => profile.id === id) ?? null)
}

export function createLinkProfile(input: Partial<LinkProfileInput>) {
  return withStore((store) => {
    const data = validateProfile(input)
    assertUniqueSlug(store, data.slug)
    const profile: LinkProfile = {
      ...data,
      id: randomUUID(),
      updatedAt: new Date().toISOString(),
    }
    store.profiles.push(profile)
    return profile
  })
}

export function updateLinkProfile(id: string, input: Partial<LinkProfileInput>) {
  return withStore((store) => {
    const profile = store.profiles.find((item) => item.id === id)
    if (!profile) throw new LinkProfileError('La página ya no existe.', 404)

    const data = validateProfile(input, profile)
    assertUniqueSlug(store, data.slug, id)
    Object.assign(profile, data, { updatedAt: new Date().toISOString() })
    return profile
  })
}

export function deleteLinkProfile(id: string) {
  return withStore((store) => {
    const index = store.profiles.findIndex((profile) => profile.id === id)
    if (index === -1) throw new LinkProfileError('La página ya no existe.', 404)
    if (store.profiles.length === 1) {
      throw new LinkProfileError('Debe existir al menos una página AllMyLinks.', 400)
    }
    store.profiles.splice(index, 1)
  })
}
