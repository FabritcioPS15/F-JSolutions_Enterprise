import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import type { LinkProfile } from '@/lib/link-profiles'
import { resolveInk } from '@/lib/theme'

const ENV_URL = (process.env.NEXT_PUBLIC_LINKS_APP_URL ?? '').replace(/\/+$/, '')

const DATA_DIR = process.env.FJ_DATA_DIR ?? path.join(process.cwd(), '..', '..', '.data')
const ASSETS_PATH = path.join(DATA_DIR, 'link-assets')
const PUBLIC_PATH = path.join(process.cwd(), 'public')

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

function bufferToDataUrl(buffer: Buffer, type: string) {
  return `data:${type};base64,${buffer.toString('base64')}`
}

function localAssetPath(url: string) {
  const asset = /^\/assets\/([a-z0-9-]+)\.(png|jpe?g|webp)$/i.exec(url)
  if (asset) return { file: path.join(ASSETS_PATH, `${asset[1]}.${asset[2]}`), ext: asset[2] }
  if (url === '/logo.png') return { file: path.join(PUBLIC_PATH, 'logo.png'), ext: 'png' }
  return null
}

// Los fondos y logos viven en .data/link-assets o en public. Leerlos desde
// disco evita depender de una URL pública (localhost o dominio interno) al
// generar la tarjeta que verá WhatsApp.
async function toDataUrl(url: string, baseUrl: string): Promise<string | null> {
  if (!url) return null

  const local = localAssetPath(url)
  if (local?.file) {
    try {
      const buffer = await readFile(local.file)
      const type = CONTENT_TYPES[local.ext.toLowerCase()] ?? 'image/png'
      return bufferToDataUrl(buffer, type)
    } catch {
      // Si el archivo aún no existe se intenta por HTTP como último recurso.
    }
  }

  const absolute = /^https?:\/\//i.test(url)
    ? url
    : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`

  try {
    const response = await fetch(absolute, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return null
    const buffer = Buffer.from(await response.arrayBuffer())
    const type = response.headers.get('content-type') ?? CONTENT_TYPES[url.split('.').pop() ?? ''] ?? 'image/png'
    return bufferToDataUrl(buffer, type)
  } catch {
    return null
  }
}

export function resolveBaseUrl(headers: Headers): string {
  if (ENV_URL) return ENV_URL
  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  if (!host) return 'http://localhost:3005'
  const proto =
    headers.get('x-forwarded-proto') ??
    (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host) ? 'http' : 'https')
  return `${proto}://${host}`
}

function accentRgba(hex: string, alpha: number) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#7C3AED'
  const r = parseInt(safe.slice(1, 3), 16)
  const g = parseInt(safe.slice(3, 5), 16)
  const b = parseInt(safe.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Tarjeta 1200×630 que se ve al compartir la página por WhatsApp o redes.
export async function profileOgImage(profile: LinkProfile, baseUrl: string) {
  const lightText = resolveInk(profile) === 'light'
  const ink = lightText ? '#F8FAFC' : '#0F172A'
  const softInk = lightText ? 'rgba(248, 250, 252, 0.78)' : 'rgba(15, 23, 42, 0.72)'
  const panel = lightText ? 'rgba(17, 24, 39, 0.55)' : 'rgba(255, 255, 255, 0.72)'
  const border = lightText ? 'rgba(255, 255, 255, 0.18)' : 'rgba(15, 23, 42, 0.12)'

  const background = profile.background
  const gradient =
    background.kind === 'gradient'
      ? `linear-gradient(${background.angle}deg, ${background.from}, ${background.to})`
      : background.kind === 'solid'
        ? background.color
        : '#0B1220'
  const photo =
    background.kind === 'image' ? await toDataUrl(background.url, baseUrl) : null
  const veil =
    background.kind === 'image'
      ? `rgba(2, 6, 23, ${Math.min(85, Math.max(0, background.dim)) / 100})`
      : null

  const logo = profile.avatarUrl ? await toDataUrl(profile.avatarUrl, baseUrl) : null
  const host = baseUrl.replace(/^https?:\/\//i, '')
  const link = `${host}/e/${profile.slug}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: gradient,
          fontFamily: 'sans-serif',
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : null}
        {veil ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: veil,
              display: 'flex',
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            background: `radial-gradient(circle at 85% 12%, ${accentRgba(profile.accent, 0.35)}, transparent 55%)`,
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '60px 72px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: logo ? 180 : 112,
                height: 112,
                borderRadius: 28,
                background: logo ? '#FFFFFF' : `linear-gradient(135deg, ${profile.accent}, ${profile.accent}99)`,
                padding: logo ? 18 : 0,
                color: '#FFFFFF',
                fontSize: 44,
                fontWeight: 900,
                overflow: 'hidden',
                boxShadow: logo ? '0 12px 30px rgba(2, 6, 23, 0.35)' : undefined,
              }}
            >
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                profile.initials || 'FJ'
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: ink, fontSize: 30, fontWeight: 800 }}>{profile.name}</span>
              <span style={{ color: softInk, fontSize: 24 }}>{profile.handle || profile.location}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span style={{ color: ink, fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>
              {profile.name}
            </span>
            {profile.bio ? (
              <span style={{ color: softInk, fontSize: 26, lineHeight: 1.35, maxWidth: 900 }}>
                {profile.bio.slice(0, 150)}
              </span>
            ) : null}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px 26px',
                borderRadius: 999,
                backgroundColor: panel,
                border: `1px solid ${border}`,
                color: ink,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  backgroundColor: profile.accent,
                }}
              />
              {link}
            </div>
            <span style={{ color: softInk, fontSize: 24, fontWeight: 700 }}>Linkeador</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
