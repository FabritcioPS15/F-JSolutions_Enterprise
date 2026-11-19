'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Code2,
  Copy,
  ExternalLink,
  Globe,
  GraduationCap,
  Image as ImageIcon,
  Camera,
  Link2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Save,
  ShoppingBag,
  Trash2,
  Upload,
  UserPlus,
  Video,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  Field,
  LoadingState,
  PageHeader,
  SectionCard,
  Select,
  btnPrimary,
  btnSecondary,
  iconButton,
  inputClass,
  textareaClass,
} from '@/components/admin/ui'
import { cn } from '@/lib/utils'
import {
  ACCENT_PRESETS,
  BADGE_COLOR_OPTIONS,
  BACKGROUND_PRESETS,
  DEFAULT_BACKGROUND,
  LINK_ICON_OPTIONS,
  initialsFromName,
  type BadgeColor,
  type LinkAction,
  type LinkIconKey,
  type LinkProfile,
  type ProfileBackground,
  type ProfileLink,
  type ProfileTone,
} from '@/lib/links/types'

const linksBase = (process.env.NEXT_PUBLIC_LINKS_APP_URL ?? 'http://localhost:3005').replace(
  /\/+$/,
  ''
)

const iconMap: Record<LinkIconKey, LucideIcon> = {
  MessageCircle,
  ShoppingBag,
  Code2,
  GraduationCap,
  Wrench,
  Instagram: Camera,
  Video,
  Globe,
  UserPlus,
  Mail,
  Phone,
  Calendar,
}

const badgeStyles: Record<BadgeColor, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/25',
  amber: 'bg-amber-500/10 text-amber-600 ring-amber-500/25',
  purple: 'bg-violet-500/10 text-violet-600 ring-violet-500/25',
  blue: 'bg-blue-500/10 text-blue-600 ring-blue-500/25',
}

function normalizeSlug(raw: string) {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function backgroundPreview(background: ProfileBackground): string {
  if (background.kind === 'solid') return background.color
  if (background.kind === 'gradient') {
    return `linear-gradient(${background.angle}deg, ${background.from}, ${background.to})`
  }
  const veil = Math.min(85, Math.max(0, background.dim)) / 100
  const src = /^https?:\/\//i.test(background.url)
    ? background.url
    : `${linksBase}${background.url}`
  return `linear-gradient(rgba(2, 6, 23, ${veil}), rgba(2, 6, 23, ${veil})), url("${src}") center / cover`
}

function previewLuminance(hex: string) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#16112E'
  const channel = (value: number) => {
    const ratio = parseInt(safe.slice(value, value + 2), 16) / 255
    return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

function previewInk(background: ProfileBackground, tone: ProfileTone): 'light' | 'dark' {
  if (tone !== 'auto') return tone
  if (background.kind === 'solid') return previewLuminance(background.color) < 0.45 ? 'light' : 'dark'
  if (background.kind === 'gradient') {
    return Math.min(previewLuminance(background.from), previewLuminance(background.to)) < 0.45
      ? 'light'
      : 'dark'
  }
  return background.dim >= 35 ? 'light' : 'dark'
}

function assetSrc(url: string) {
  return /^https?:\/\//i.test(url) ? url : `${linksBase}${url}`
}

function ProfilePagePreview({ draft }: { draft: LinkProfile }) {
  const light = previewInk(draft.background, draft.tone) === 'light'
  const textMain = light ? 'text-white' : 'text-slate-900'
  const textSoft = light ? 'text-white/75' : 'text-slate-600'
  const card = light ? 'bg-white/10 border-white/15' : 'bg-white/70 border-slate-900/10'
  const links = draft.links.slice(0, 3)
  const domain = linksBase.replace(/^https?:\/\//i, '')

  return (
    <div className="mx-auto w-full max-w-[260px]">
      <div
        className="relative overflow-hidden rounded-[2rem] border-[6px] border-slate-900 shadow-xl"
        style={{ background: backgroundPreview(draft.background) }}
      >
        <div className="flex flex-col items-center px-4 py-6 text-center">
          <span
            className="grid size-14 place-items-center overflow-hidden rounded-full text-base font-black text-white ring-2 ring-white/30"
            style={{ backgroundColor: draft.accent }}
          >
            {draft.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assetSrc(draft.avatarUrl)} alt="" className="size-full object-cover" />
            ) : (
              draft.initials || initialsFromName(draft.name)
            )}
          </span>
          <p className={cn('mt-2 max-w-full truncate text-[13px] font-black', textMain)}>
            {draft.name || 'Nombre de la empresa'}
          </p>
          {draft.handle && (
            <p className="text-[9px] font-semibold" style={{ color: draft.accent }}>
              {draft.handle}
            </p>
          )}
          {draft.bio && (
            <p className={cn('mt-1.5 line-clamp-2 text-[9px] leading-snug', textSoft)}>{draft.bio}</p>
          )}
          {draft.statusEnabled && draft.statusText && (
            <span className="mt-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[8px] font-bold text-emerald-400">
              {draft.statusText}
            </span>
          )}

          <div className="mt-3 w-full space-y-1.5">
            {links.length === 0 ? (
              <p className={cn('rounded-lg border px-2 py-3 text-[9px]', card, textSoft)}>
                Sin enlaces todavía
              </p>
            ) : (
              links.map((link) => (
                <div
                  key={link.id}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left',
                    card
                  )}
                >
                  <span
                    className={cn(
                      'size-5 shrink-0 rounded-md',
                      link.highlight ? 'bg-white/25' : light ? 'bg-white/10' : 'bg-slate-900/10'
                    )}
                  />
                  <span className={cn('min-w-0 truncate text-[9px] font-bold', textMain)}>
                    {link.title || 'Enlace'}
                  </span>
                </div>
              ))
            )}
          </div>

          <p className={cn('mt-3 text-[8px]', textSoft)}>{draft.name || 'Empresa'} · Linkeador</p>
          <p className={cn('text-[7px] opacity-70', textSoft)}>{domain}</p>
        </div>
      </div>
    </div>
  )
}

function ShareLinkPreview({ draft, publicUrl }: { draft: LinkProfile; publicUrl: string }) {
  const light = previewInk(draft.background, draft.tone) === 'light'
  const textMain = light ? 'text-white' : 'text-slate-900'
  const domain = linksBase.replace(/^https?:\/\//i, '')
  const url = publicUrl.replace(/^https?:\/\//i, '')

  return (
    <div className="rounded-2xl border border-border bg-[#0B141A] p-3">
      <div className="ml-auto w-fit max-w-[95%] rounded-xl rounded-tr-sm bg-[#005C4B] p-2 shadow-lg">
        <p className="px-1 text-[11px] text-white/90">Mira nuestra página 👇</p>
        <div className="mt-2 overflow-hidden rounded-lg bg-[#111B21]">
          <div
            className="relative flex h-32 items-center gap-2.5 px-3"
            style={{ background: backgroundPreview(draft.background) }}
          >
            <span
              className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl text-sm font-black text-white"
              style={{ backgroundColor: draft.accent }}
            >
              {draft.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={assetSrc(draft.avatarUrl)} alt="" className="size-full object-cover" />
              ) : (
                draft.initials || initialsFromName(draft.name)
              )}
            </span>
            <div className="min-w-0">
              <p className={cn('truncate text-xs font-black', textMain)}>
                {draft.name || 'Nombre de la empresa'}
              </p>
              <p className={cn('truncate text-[9px]', light ? 'text-white/70' : 'text-slate-600')}>
                {draft.bio || 'Enlaces oficiales'}
              </p>
            </div>
          </div>
          <div className="space-y-0.5 px-3 py-2">
            <p className="text-[8px] uppercase tracking-wide text-slate-400">{domain}</p>
            <p className="truncate text-[11px] font-semibold text-white">
              {draft.name || 'Empresa'} | Linkeador
            </p>
            <p className="line-clamp-2 text-[9px] text-slate-400">
              {draft.bio || 'Todos nuestros enlaces oficiales en un solo lugar.'}
            </p>
          </div>
        </div>
        <div className="mt-1 px-1 text-[9px] text-white/60">{url}</div>
      </div>
    </div>
  )
}

function emptyDraft(): LinkProfile {
  return {
    id: '',
    slug: '',
    name: '',
    handle: '',
    bio: '',
    initials: '',
    avatarUrl: '',
    verified: false,
    statusEnabled: true,
    statusText: 'Atención en línea disponible',
    location: 'Lima, Perú',
    phone: '',
    email: '',
    website: '',
    accent: '#6A54B8',
    background: DEFAULT_BACKGROUND,
    tone: 'auto',
    footerNote: 'Lima, Perú',
    socials: { whatsapp: '', tiktok: '', instagram: '', website: '' },
    links: [],
    published: false,
    updatedAt: '',
  }
}

function cloneProfile(profile: LinkProfile): LinkProfile {
  return JSON.parse(JSON.stringify(profile)) as LinkProfile
}

type CompanyAccount = {
  id: string
  name: string
  email: string
  role: string
  status: string
  linkProfileId?: string | null
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/40 px-4 py-3">
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-foreground">{label}</span>
        {hint && <span className="mt-0.5 block text-[11px] text-muted-foreground">{hint}</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-[#5946A6]"
      />
    </label>
  )
}

export function LinksProfilesView() {
  const { can } = useAdmin()
  const toast = useToast()
  const canEdit = can('links', 'update')
  const canCreate = can('links', 'create')
  const canDelete = can('links', 'delete')
  const canManageAccess = can('users', 'create')

  const [profiles, setProfiles] = useState<LinkProfile[] | null>(null)
  const [mainProfileId, setMainProfileId] = useState<string | null>(null)
  const [draft, setDraft] = useState<LinkProfile | null>(null)
  const [baseline, setBaseline] = useState('')
  const [expandedLink, setExpandedLink] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState<'logo' | 'background' | ''>('')
  const [error, setError] = useState('')
  const [companyAccounts, setCompanyAccounts] = useState<CompanyAccount[] | null>(null)
  const [companyReload, setCompanyReload] = useState(0)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyPassword, setCompanyPassword] = useState('')
  const [companyBusy, setCompanyBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/link-profiles', { cache: 'no-store' })
      const payload = (await response.json()) as {
        success?: boolean
        message?: string
        data?: { profiles?: LinkProfile[]; mainProfileId: string | null }
      }
      if (!response.ok || !payload.data?.profiles) {
        throw new Error(payload.message ?? 'No se pudieron cargar las páginas.')
      }
      setProfiles(payload.data.profiles)
      setMainProfileId(payload.data.mainProfileId)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar las páginas.')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  // Solo el superadministrador habilita el acceso de la empresa a su página.
  useEffect(() => {
    if (!canManageAccess) return
    const profileId = draft?.id
    if (!profileId) {
      setCompanyAccounts([])
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const response = await fetch('/api/admin/users', { cache: 'no-store' })
        const payload = (await response.json()) as {
          success?: boolean
          data?: { users?: CompanyAccount[] }
        }
        if (!response.ok || !payload.data?.users) throw new Error('Sin acceso')
        if (!cancelled) {
          setCompanyAccounts(
            payload.data.users.filter(
              (user) => user.role === 'empresa' && user.linkProfileId === profileId
            )
          )
        }
      } catch {
        if (!cancelled) setCompanyAccounts([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [canManageAccess, draft?.id, companyReload])

  // Abre la primera página en cuanto llega la carga inicial.
  useEffect(() => {
    if (!profiles || draft) return
    const first = profiles[0]
    if (!first) return
    setDraft(cloneProfile(first))
    setBaseline(JSON.stringify(first))
    setSlugTouched(true)
  }, [profiles, draft])

  const dirty = draft ? JSON.stringify(draft) !== baseline : false
  const isMainProfile = Boolean(draft?.id && mainProfileId === draft.id)
  const publicUrl = isMainProfile ? linksBase : `${linksBase}/e/${draft?.slug || 'sin-slug'}`

  function update(patch: Partial<LinkProfile>) {
    setDraft((current) => (current ? { ...current, ...patch } : current))
  }

  function updateLinks(links: ProfileLink[]) {
    setDraft((current) => (current ? { ...current, links } : current))
  }

  function patchBackground(patch: Partial<ProfileBackground>) {
    setDraft((current) =>
      current
        ? { ...current, background: { ...current.background, ...patch } as ProfileBackground }
        : current
    )
  }

  async function uploadAsset(file: File, target: 'logo' | 'background') {
    if (uploading) return
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      setError('Usa una imagen PNG, JPG o WebP.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no puede superar los 2 MB.')
      return
    }

    setUploading(target)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const response = await fetch('/api/admin/link-assets', { method: 'POST', body: form })
      const payload = (await response.json()) as {
        success?: boolean
        message?: string
        data?: { url?: string }
      }
      const url = payload.data?.url
      if (!response.ok || !url) throw new Error(payload.message ?? 'No se pudo subir la imagen.')
      if (target === 'logo') {
        update({ avatarUrl: url })
      } else {
        update({ background: { kind: 'image', url, dim: 45 } })
      }
      toast.success('Imagen subida', 'Recuerda guardar los cambios.')
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen.'
      setError(message)
      toast.error('No se pudo subir', message)
    } finally {
      setUploading('')
    }
  }

  function changeName(name: string) {
    setDraft((current) => {
      if (!current) return current
      const nextInitials =
        current.initials === '' || current.initials === initialsFromName(current.name)
          ? initialsFromName(name)
          : current.initials
      return {
        ...current,
        name,
        initials: nextInitials,
        slug: slugTouched ? current.slug : normalizeSlug(name),
      }
    })
  }

  function selectProfile(profile: LinkProfile) {
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Descartarlos y abrir otra página?')) {
      return
    }
    setDraft(cloneProfile(profile))
    setBaseline(JSON.stringify(profile))
    setSlugTouched(true)
    setExpandedLink(null)
    setError('')
  }

  function startNew() {
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Descartarlos y crear otra página?')) {
      return
    }
    const next = emptyDraft()
    setDraft(next)
    setBaseline(JSON.stringify(next))
    setSlugTouched(false)
    setExpandedLink(null)
    setError('')
  }

  async function copyPublicUrl() {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(publicUrl)
      toast.success('Enlace público copiado', publicUrl)
    } catch {
      toast.error('No se pudo copiar', publicUrl)
    }
  }

  function openPublicPage() {
    if (!draft) return
    const suffix = draft.published ? '' : '?preview=1'
    window.open(`${publicUrl}${suffix}`, '_blank', 'noopener')
  }

  async function handleSave() {
    if (!draft || saving) return
    setSaving(true)
    setError('')
    const isNew = !draft.id
    const body = {
      ...draft,
      handle: draft.handle.trim() ? draft.handle : `@${draft.slug || 'empresa'}`,
    }
    try {
      const response = await fetch(
        isNew ? '/api/admin/link-profiles' : `/api/admin/link-profiles/${draft.id}`,
        {
          method: isNew ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )
      const payload = (await response.json()) as {
        success?: boolean
        message?: string
        data?: { profile?: LinkProfile }
      }
      const saved = payload.data?.profile
      if (!response.ok || !saved) {
        throw new Error(payload.message ?? 'No se pudo guardar la página.')
      }
      setProfiles((current) => {
        if (!current) return [saved]
        return isNew
          ? [...current, saved]
          : current.map((profile) => (profile.id === saved.id ? saved : profile))
      })
      setDraft(cloneProfile(saved))
      setBaseline(JSON.stringify(saved))
      setSlugTouched(true)
      toast.success(isNew ? 'Página creada' : 'Página actualizada', saved.id === mainProfileId ? linksBase : `${linksBase}/e/${saved.slug}`)
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'No se pudo guardar la página.'
      setError(message)
      toast.error('No se pudo guardar', message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!draft?.id || deleting) return
    if (!window.confirm(`¿Eliminar la página "${draft.name}"? Esta acción no se puede deshacer.`)) {
      return
    }
    setDeleting(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/link-profiles/${draft.id}`, { method: 'DELETE' })
      const payload = (await response.json()) as { success?: boolean; message?: string }
      if (!response.ok) throw new Error(payload.message ?? 'No se pudo eliminar la página.')
      const remaining = (profiles ?? []).filter((profile) => profile.id !== draft.id)
      setProfiles(remaining)
      if (draft.id === mainProfileId) setMainProfileId(remaining[0]?.id ?? null)
      const next = remaining[0] ?? null
      setDraft(next ? cloneProfile(next) : null)
      setBaseline(next ? JSON.stringify(next) : '')
      toast.success('Página eliminada')
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar la página.'
      setError(message)
      toast.error('No se pudo eliminar', message)
    } finally {
      setDeleting(false)
    }
  }

  const totalLinks = useMemo(
    () => (profiles ?? []).reduce((sum, profile) => sum + profile.links.length, 0),
    [profiles]
  )

  async function createCompanyAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft?.id || companyBusy) return
    if (companyPassword.length < 8) {
      setError('La contraseña del acceso debe tener al menos 8 caracteres.')
      return
    }
    setCompanyBusy(true)
    setError('')
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName.trim(),
          email: companyEmail.trim(),
          phone: '',
          role: 'empresa',
          status: 'active',
          twoFactorEnabled: false,
          password: companyPassword,
          linkProfileId: draft.id,
        }),
      })
      const payload = (await response.json()) as { success?: boolean; message?: string }
      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? 'No se pudo crear el acceso.')
      }
      setCompanyName('')
      setCompanyEmail('')
      setCompanyPassword('')
      setCompanyReload((value) => value + 1)
      toast.success('Acceso creado', 'La empresa ya puede entrar con su página asignada.')
    } catch (accessError) {
      const message =
        accessError instanceof Error ? accessError.message : 'No se pudo crear el acceso.'
      setError(message)
      toast.error('No se pudo crear el acceso', message)
    } finally {
      setCompanyBusy(false)
    }
  }

  async function removeCompanyAccount(account: CompanyAccount) {
    if (companyBusy) return
    if (!window.confirm(`¿Quitar el acceso de ${account.email}? Esta acción no se puede deshacer.`)) {
      return
    }
    setCompanyBusy(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(account.id)}`, {
        method: 'DELETE',
      })
      const payload = (await response.json()) as { success?: boolean; message?: string }
      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? 'No se pudo quitar el acceso.')
      }
      setCompanyReload((value) => value + 1)
      toast.success('Acceso eliminado', account.email)
    } catch (accessError) {
      const message =
        accessError instanceof Error ? accessError.message : 'No se pudo quitar el acceso.'
      setError(message)
      toast.error('No se pudo quitar el acceso', message)
    } finally {
      setCompanyBusy(false)
    }
  }

  if (profiles === null && !error) return <LoadingState label="Cargando páginas Linkeador…" />

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="General"
        title="Linkeador"
        description="Personaliza la página principal del Linkeador: identidad, colores, contacto y enlaces. También puedes administrar páginas adicionales por empresa."
        actions={
          canCreate ? (
            <button type="button" onClick={startNew} className={btnPrimary}>
              <Plus className="size-4" aria-hidden="true" />
              Nueva página
            </button>
          ) : undefined
        }
      />

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-danger-ink">
          {error}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <SectionCard
          title="Páginas"
          description={`${profiles?.length ?? 0} páginas · ${totalLinks} enlaces`}
          icon={Link2}
          bodyClassName="p-2"
        >
          {!profiles || profiles.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              Aún no hay páginas. Crea la primera.
            </p>
          ) : (
            <ul className="space-y-1">
              {profiles.map((profile) => {
                const active = draft?.id === profile.id
                return (
                  <li key={profile.id}>
                    <button
                      type="button"
                      onClick={() => selectProfile(profile)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                        active ? 'bg-tint-brand ring-1 ring-[#5946A6]/25' : 'hover:bg-muted'
                      )}
                    >
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-lg text-[11px] font-black text-white"
                        style={{ backgroundColor: profile.accent }}
                      >
                        {profile.initials || initialsFromName(profile.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-semibold text-foreground">
                            {profile.name}
                          </span>
                          {profile.verified && (
                            <CheckCircle2 className="size-3.5 shrink-0 text-[#5946A6]" aria-hidden="true" />
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground">
                          {profile.id === mainProfileId ? 'Página principal' : `/e/${profile.slug}`} · {profile.links.length} enlaces
                        </span>
                      </span>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1 ring-inset',
                          profile.published
                            ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/25'
                            : 'bg-muted text-muted-foreground ring-border'
                        )}
                      >
                        {profile.published ? 'Publicada' : 'Borrador'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </SectionCard>

        {!draft ? (
          <EmptyState
            icon={Link2}
            title="Selecciona una página"
            description="Elige una página de la lista para editar su perfil, sus colores y sus enlaces."
          />
        ) : (
          <div className="space-y-5">
            <SectionCard
              title="Vista previa"
              description="Se actualiza mientras editas: la tarjeta al compartir el enlace y la página al abrirla."
              icon={ImageIcon}
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Al compartir por WhatsApp o redes
                  </p>
                  <ShareLinkPreview draft={draft} publicUrl={publicUrl} />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Al abrir el enlace
                  </p>
                  <ProfilePagePreview draft={draft} />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title={draft.id ? draft.name || 'Página sin nombre' : 'Nueva página'}
              description={
                draft.slug
                  ? `${isMainProfile ? 'Página principal' : 'Vista pública'}: ${publicUrl}`
                  : 'Completa el nombre para generar el enlace público.'
              }
              icon={Link2}
              action={
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={copyPublicUrl}
                    className={iconButton}
                    aria-label="Copiar enlace público"
                    title="Copiar enlace público"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={openPublicPage}
                    className={btnSecondary}
                    disabled={!draft.slug}
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    Ver página
                  </button>
                </div>
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre de la empresa" htmlFor="link-name" required>
                  <input
                    id="link-name"
                    value={draft.name}
                    onChange={(event) => changeName(event.target.value)}
                    className={inputClass}
                    placeholder="Ej. SparkTree Group"
                    disabled={!canEdit}
                  />
                </Field>
                <Field
                  label="Enlace público"
                  htmlFor="link-slug"
                  required
                  hint={`${isMainProfile ? 'Enlace alternativo: ' : ''}${linksBase}/e/${draft.slug || '…'}`}
                >
                  <input
                    id="link-slug"
                    value={draft.slug}
                    onChange={(event) => {
                      setSlugTouched(true)
                      update({ slug: normalizeSlug(event.target.value) })
                    }}
                    className={inputClass}
                    placeholder="nombre-empresa"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Usuario visible" htmlFor="link-handle">
                  <input
                    id="link-handle"
                    value={draft.handle}
                    onChange={(event) => update({ handle: event.target.value })}
                    className={inputClass}
                    placeholder="@empresa"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Ubicación" htmlFor="link-location">
                  <input
                    id="link-location"
                    value={draft.location}
                    onChange={(event) => update({ location: event.target.value })}
                    className={inputClass}
                    placeholder="Lima, Perú"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Biografía" htmlFor="link-bio" className="sm:col-span-2">
                  <textarea
                    id="link-bio"
                    value={draft.bio}
                    onChange={(event) => update({ bio: event.target.value })}
                    className={textareaClass}
                    rows={3}
                    placeholder="Describe la empresa en una línea"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Teléfono" htmlFor="link-phone">
                  <input
                    id="link-phone"
                    value={draft.phone}
                    onChange={(event) => update({ phone: event.target.value })}
                    className={inputClass}
                    placeholder="+51 999 999 999"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Correo de contacto" htmlFor="link-email">
                  <input
                    id="link-email"
                    type="email"
                    value={draft.email}
                    onChange={(event) => update({ email: event.target.value })}
                    className={inputClass}
                    placeholder="ventas@empresa.com"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Página web" htmlFor="link-website">
                  <input
                    id="link-website"
                    value={draft.website}
                    onChange={(event) => update({ website: event.target.value })}
                    className={inputClass}
                    placeholder="https://empresa.com"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Iniciales del logo" htmlFor="link-initials">
                  <input
                    id="link-initials"
                    value={draft.initials}
                    onChange={(event) => update({ initials: event.target.value.toUpperCase() })}
                    className={inputClass}
                    maxLength={4}
                    placeholder="SP"
                    disabled={!canEdit}
                  />
                </Field>
                <div className="space-y-2 sm:col-span-2">
                  <p className="text-xs font-semibold text-foreground">Logo del negocio</p>
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <span
                      className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl text-sm font-black text-white"
                      style={{ backgroundColor: draft.accent }}
                    >
                      {draft.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            /^https?:\/\//i.test(draft.avatarUrl)
                              ? draft.avatarUrl
                              : `${linksBase}${draft.avatarUrl}`
                          }
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        draft.initials || initialsFromName(draft.name)
                      )}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-[11px] text-muted-foreground">
                        Se muestra en la página y en la tarjeta al compartir por WhatsApp u otras
                        redes.
                      </p>
                      <input
                        id="link-avatar"
                        value={draft.avatarUrl}
                        onChange={(event) => update({ avatarUrl: event.target.value })}
                        className={inputClass}
                        placeholder="https://…/logo.png"
                        disabled={!canEdit}
                      />
                    </div>
                    <label
                      className={cn(
                        btnSecondary,
                        'cursor-pointer',
                        (!canEdit || uploading !== '') && 'pointer-events-none opacity-50'
                      )}
                    >
                      <Upload className="size-4" aria-hidden="true" />
                      {uploading === 'logo' ? 'Subiendo…' : 'Subir logo'}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        disabled={!canEdit || uploading !== ''}
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) void uploadAsset(file, 'logo')
                          event.target.value = ''
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Apariencia y estado"
              description="Fondo, logo, color de acento y estado de la página pública."
            >
              <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">Fondo de la página</p>
                  <div className="flex gap-1 rounded-lg border border-border bg-card p-0.5">
                    {(
                      [
                        { kind: 'solid', label: 'Color' },
                        { kind: 'gradient', label: 'Degradado' },
                        { kind: 'image', label: 'Imagen' },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.kind}
                        type="button"
                        disabled={!canEdit}
                        onClick={() => {
                          if (draft.background.kind === option.kind) return
                          if (option.kind === 'solid') {
                            const color =
                              draft.background.kind === 'gradient'
                                ? draft.background.from
                                : '#16112E'
                            update({ background: { kind: 'solid', color } })
                          } else if (option.kind === 'gradient') {
                            update({
                              background: { kind: 'gradient', from: '#16112E', to: '#1D1740', angle: 160 },
                            })
                          } else {
                            update({
                              background: {
                                kind: 'image',
                                url: draft.background.kind === 'image' ? draft.background.url : '',
                                dim: 45,
                              },
                            })
                          }
                        }}
                        className={cn(
                          'rounded-md px-2.5 py-1 text-[11px] font-semibold transition',
                          draft.background.kind === option.kind
                            ? 'bg-tint-brand text-[#4A3A8F]'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {BACKGROUND_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      disabled={!canEdit}
                      onClick={() => update({ background: preset.background })}
                      title={preset.label}
                      aria-label={`Fondo ${preset.label}`}
                      className={cn(
                        'size-10 rounded-lg border-2 transition hover:scale-105',
                        JSON.stringify(draft.background) === JSON.stringify(preset.background)
                          ? 'border-[#5946A6]'
                          : 'border-border'
                      )}
                      style={{ background: backgroundPreview(preset.background) }}
                    />
                  ))}
                  {draft.background.kind === 'image' && (
                    <span
                      className="h-10 w-16 rounded-lg border-2 border-border"
                      style={{ background: backgroundPreview(draft.background) }}
                    />
                  )}
                </div>

                {draft.background.kind === 'solid' && (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="color"
                      value={draft.background.color}
                      onChange={(event) =>
                        update({
                          background: { kind: 'solid', color: event.target.value.toUpperCase() },
                        })
                      }
                      disabled={!canEdit}
                      aria-label="Color del fondo"
                      className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-card p-0.5"
                    />
                    <input
                      value={draft.background.color}
                      onChange={(event) =>
                        update({
                          background: { kind: 'solid', color: event.target.value.toUpperCase() },
                        })
                      }
                      disabled={!canEdit}
                      aria-label="Código hex del fondo"
                      className="h-9 w-28 rounded-lg border border-border bg-card px-2 font-mono text-[11px] uppercase text-foreground"
                    />
                  </div>
                )}

                {draft.background.kind === 'gradient' && (
                  <div className="flex flex-wrap items-end gap-3">
                    <Field label="Color inicial" htmlFor="bg-from">
                      <input
                        id="bg-from"
                        type="color"
                        value={draft.background.from}
                        onChange={(event) =>
                          patchBackground({ from: event.target.value.toUpperCase() })
                        }
                        disabled={!canEdit}
                        className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-card p-0.5"
                      />
                    </Field>
                    <Field label="Color final" htmlFor="bg-to">
                      <input
                        id="bg-to"
                        type="color"
                        value={draft.background.to}
                        onChange={(event) =>
                          patchBackground({ to: event.target.value.toUpperCase() })
                        }
                        disabled={!canEdit}
                        className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-card p-0.5"
                      />
                    </Field>
                    <Field label="Ángulo" htmlFor="bg-angle">
                      <input
                        id="bg-angle"
                        type="number"
                        min={0}
                        max={360}
                        value={draft.background.angle}
                        onChange={(event) =>
                          patchBackground({
                            angle: Math.min(360, Math.max(0, Number(event.target.value) || 0)),
                          })
                        }
                        disabled={!canEdit}
                        className={cn(inputClass, 'w-24')}
                      />
                    </Field>
                  </div>
                )}

                {draft.background.kind === 'image' && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={draft.background.url}
                        onChange={(event) => patchBackground({ url: event.target.value })}
                        disabled={!canEdit}
                        placeholder="Sube una imagen o pega https://…/fondo.jpg"
                        className={cn(inputClass, 'min-w-0 flex-1')}
                      />
                      <label
                        className={cn(
                          btnSecondary,
                          'cursor-pointer',
                          (!canEdit || uploading !== '') && 'pointer-events-none opacity-50'
                        )}
                      >
                        <ImageIcon className="size-4" aria-hidden="true" />
                        {uploading === 'background' ? 'Subiendo…' : 'Subir imagen'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          disabled={!canEdit || uploading !== ''}
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file) void uploadAsset(file, 'background')
                            event.target.value = ''
                          }}
                        />
                      </label>
                    </div>
                    <Field label={`Velo oscuro · ${draft.background.dim}%`} htmlFor="bg-dim">
                      <input
                        id="bg-dim"
                        type="range"
                        min={0}
                        max={85}
                        value={draft.background.dim}
                        onChange={(event) => patchBackground({ dim: Number(event.target.value) })}
                        disabled={!canEdit}
                        className="w-full accent-[#5946A6]"
                      />
                    </Field>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
                  <Field label="Color del texto" htmlFor="link-tone">
                    <Select
                      id="link-tone"
                      value={draft.tone}
                      onChange={(event) => update({ tone: event.target.value as ProfileTone })}
                      disabled={!canEdit}
                    >
                      <option value="auto">Automático según el fondo</option>
                      <option value="light">Claro (para fondos oscuros)</option>
                      <option value="dark">Oscuro (para fondos claros)</option>
                    </Select>
                  </Field>
                  <div
                    className="grid h-[74px] place-items-center rounded-lg border border-border text-center"
                    style={{ background: backgroundPreview(draft.background) }}
                  >
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-white drop-shadow">Vista del fondo</p>
                      <span
                        className="mx-auto block h-1.5 w-10 rounded-full"
                        style={{ backgroundColor: draft.accent }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-foreground/80">Color de acento</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {ACCENT_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => update({ accent: preset.value })}
                        disabled={!canEdit}
                        aria-label={preset.label}
                        aria-pressed={draft.accent.toUpperCase() === preset.value}
                        title={preset.label}
                        className={cn(
                          'size-8 rounded-full border-2 transition hover:scale-105',
                          draft.accent.toUpperCase() === preset.value
                            ? 'border-foreground shadow-sm'
                            : 'border-transparent'
                        )}
                        style={{ backgroundColor: preset.value }}
                      />
                    ))}
                    <input
                      type="color"
                      value={/^#[0-9a-fA-F]{6}$/.test(draft.accent) ? draft.accent : '#6A54B8'}
                      onChange={(event) => update({ accent: event.target.value.toUpperCase() })}
                      disabled={!canEdit}
                      aria-label="Color personalizado"
                      className="h-8 w-12 cursor-pointer rounded-lg border border-border bg-card p-0.5"
                    />
                    <input
                      value={draft.accent}
                      onChange={(event) => update({ accent: event.target.value.toUpperCase() })}
                      disabled={!canEdit}
                      aria-label="Código hex del color"
                      className="h-8 w-24 rounded-lg border border-border bg-card px-2 font-mono text-[11px] uppercase text-foreground"
                    />
                  </div>
                  <Field label="Texto del estado" htmlFor="link-status-text">
                    <input
                      id="link-status-text"
                      value={draft.statusText}
                      onChange={(event) => update({ statusText: event.target.value })}
                      className={inputClass}
                      placeholder="Atención en línea disponible"
                      disabled={!canEdit}
                    />
                  </Field>
                </div>

                <div className="space-y-2.5">
                  <Toggle
                    label="Mostrar estado en vivo"
                    hint="Píldora animada debajo de la biografía."
                    checked={draft.statusEnabled}
                    onChange={(value) => update({ statusEnabled: value })}
                    disabled={!canEdit}
                  />
                  <Toggle
                    label="Empresa verificada"
                    hint="Muestra la insignia azul junto al avatar."
                    checked={draft.verified}
                    onChange={(value) => update({ verified: value })}
                    disabled={!canEdit}
                  />
                  <Toggle
                    label="Página publicada"
                    hint="Si está desactivada, solo se puede ver con el enlace de vista previa del panel."
                    checked={draft.published}
                    onChange={(value) => update({ published: value })}
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="WhatsApp del pie" htmlFor="link-social-wa">
                  <input
                    id="link-social-wa"
                    value={draft.socials.whatsapp}
                    onChange={(event) =>
                      update({ socials: { ...draft.socials, whatsapp: event.target.value } })
                    }
                    className={inputClass}
                    placeholder="https://wa.me/51999999999"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="TikTok del pie" htmlFor="link-social-tiktok">
                  <input
                    id="link-social-tiktok"
                    value={draft.socials.tiktok}
                    onChange={(event) =>
                      update({ socials: { ...draft.socials, tiktok: event.target.value } })
                    }
                    className={inputClass}
                    placeholder="https://tiktok.com/@empresa"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Instagram del pie" htmlFor="link-social-ig">
                  <input
                    id="link-social-ig"
                    value={draft.socials.instagram}
                    onChange={(event) =>
                      update({ socials: { ...draft.socials, instagram: event.target.value } })
                    }
                    className={inputClass}
                    placeholder="https://instagram.com/empresa"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Web del pie" htmlFor="link-social-web">
                  <input
                    id="link-social-web"
                    value={draft.socials.website}
                    onChange={(event) =>
                      update({ socials: { ...draft.socials, website: event.target.value } })
                    }
                    className={inputClass}
                    placeholder="https://empresa.com"
                    disabled={!canEdit}
                  />
                </Field>
                <Field label="Nota del pie" htmlFor="link-footer-note" className="sm:col-span-2">
                  <input
                    id="link-footer-note"
                    value={draft.footerNote}
                    onChange={(event) => update({ footerNote: event.target.value })}
                    className={inputClass}
                    placeholder="Lima, Perú · RUC & Marca Registrada"
                    disabled={!canEdit}
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard
              title="Enlaces"
              description={`${draft.links.length} de 40 enlaces. El orden aquí es el orden de la página pública.`}
              action={
                canEdit ? (
                  <button
                    type="button"
                    onClick={() => {
                      const link: ProfileLink = {
                        id: crypto.randomUUID(),
                        title: 'Nuevo enlace',
                        subtitle: '',
                        url: 'https://',
                        icon: 'Globe',
                        badge: '',
                        badgeColor: 'purple',
                        highlight: false,
                        action: '',
                      }
                      updateLinks([...draft.links, link])
                      setExpandedLink(link.id)
                    }}
                    disabled={draft.links.length >= 40}
                    className={btnSecondary}
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Añadir enlace
                  </button>
                ) : undefined
              }
              bodyClassName="space-y-2.5 p-3 sm:p-4"
            >
              {draft.links.length === 0 ? (
                <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                  Esta página aún no tiene enlaces. Añade el primero.
                </p>
              ) : (
                draft.links.map((link, index) => {
                  const currentLinks = draft.links
                  const Icon = iconMap[link.icon] ?? Globe
                  const expanded = expandedLink === link.id
                  function patchLink(patch: Partial<ProfileLink>) {
                    updateLinks(
                      currentLinks.map((item) =>
                        item.id === link.id ? { ...item, ...patch } : item
                      )
                    )
                  }
                  function move(offset: number) {
                    const target = index + offset
                    if (target < 0 || target >= currentLinks.length) return
                    const next = [...currentLinks]
                    const [moved] = next.splice(index, 1)
                    next.splice(target, 0, moved)
                    updateLinks(next)
                  }
                  return (
                    <div
                      key={link.id}
                      className={cn(
                        'rounded-xl border bg-card transition',
                        expanded ? 'border-[#5946A6]/30' : 'border-border'
                      )}
                    >
                      <div className="flex items-center gap-2 p-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedLink(expanded ? null : link.id)}
                          aria-expanded={expanded}
                          className="min-w-0 flex-1 text-left"
                        >
                          <span className="flex items-center gap-2">
                            <span className="truncate text-xs font-semibold text-foreground">
                              {index + 1}. {link.title || 'Enlace sin título'}
                            </span>
                            {link.highlight && (
                              <span className="shrink-0 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-600 ring-1 ring-inset ring-amber-500/25">
                                Destacado
                              </span>
                            )}
                            {link.badge && (
                              <span
                                className={cn(
                                  'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ring-1 ring-inset',
                                  badgeStyles[link.badgeColor]
                                )}
                              >
                                {link.badge}
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground">
                            {link.action ? 'Acción especial · ' : ''}
                            {link.url}
                          </span>
                        </button>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => move(-1)}
                            disabled={!canEdit || index === 0}
                            className={iconButton}
                            aria-label="Subir enlace"
                            title="Subir"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => move(1)}
                            disabled={!canEdit || index === draft.links.length - 1}
                            className={iconButton}
                            aria-label="Bajar enlace"
                            title="Bajar"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandedLink(expanded ? null : link.id)}
                            className={iconButton}
                            aria-label={expanded ? 'Contraer enlace' : 'Expandir enlace'}
                          >
                            <ChevronDown
                              className={cn('size-4 transition-transform', expanded && 'rotate-180')}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateLinks(draft.links.filter((item) => item.id !== link.id))
                              if (expanded) setExpandedLink(null)
                            }}
                            disabled={!canEdit}
                            className={cn(iconButton, 'hover:text-danger-ink')}
                            aria-label="Eliminar enlace"
                            title="Eliminar"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {expanded && (
                        <div className="grid gap-3 border-t border-border p-3 sm:grid-cols-2 sm:p-4">
                          <Field label="Título" htmlFor={`link-title-${link.id}`} required>
                            <input
                              id={`link-title-${link.id}`}
                              value={link.title}
                              onChange={(event) => patchLink({ title: event.target.value })}
                              className={inputClass}
                              disabled={!canEdit}
                            />
                          </Field>
                          <Field label="Subtítulo" htmlFor={`link-subtitle-${link.id}`}>
                            <input
                              id={`link-subtitle-${link.id}`}
                              value={link.subtitle}
                              onChange={(event) => patchLink({ subtitle: event.target.value })}
                              className={inputClass}
                              disabled={!canEdit}
                            />
                          </Field>
                          <Field
                            label="URL"
                            htmlFor={`link-url-${link.id}`}
                            required
                            hint={
                              link.action
                                ? 'Con acción especial la URL se fuerza a "#".'
                                : 'Acepta https://, mailto:, tel: o una ruta /…'
                            }
                          >
                            <input
                              id={`link-url-${link.id}`}
                              value={link.url}
                              onChange={(event) => patchLink({ url: event.target.value })}
                              className={inputClass}
                              disabled={!canEdit || Boolean(link.action)}
                            />
                          </Field>
                          <Field label="Icono" htmlFor={`link-icon-${link.id}`}>
                            <Select
                              id={`link-icon-${link.id}`}
                              value={link.icon}
                              onChange={(event) =>
                                patchLink({ icon: event.target.value as LinkIconKey })
                              }
                              disabled={!canEdit}
                            >
                              {LINK_ICON_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                          </Field>
                          <Field label="Etiqueta (badge)" htmlFor={`link-badge-${link.id}`}>
                            <input
                              id={`link-badge-${link.id}`}
                              value={link.badge}
                              onChange={(event) => patchLink({ badge: event.target.value })}
                              className={inputClass}
                              placeholder="NUEVO"
                              disabled={!canEdit}
                            />
                          </Field>
                          <Field label="Color de la etiqueta" htmlFor={`link-badge-color-${link.id}`}>
                            <Select
                              id={`link-badge-color-${link.id}`}
                              value={link.badgeColor}
                              onChange={(event) =>
                                patchLink({ badgeColor: event.target.value as BadgeColor })
                              }
                              disabled={!canEdit}
                            >
                              {BADGE_COLOR_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                          </Field>
                          <Field label="Acción especial" htmlFor={`link-action-${link.id}`}>
                            <Select
                              id={`link-action-${link.id}`}
                              value={link.action}
                              onChange={(event) => {
                                const action = event.target.value as LinkAction | ''
                                patchLink({ action, url: action ? '#' : 'https://' })
                              }}
                              disabled={!canEdit}
                            >
                              <option value="">Ninguna</option>
                              <option value="vcard">Guardar contacto (VCard)</option>
                              <option value="share">Compartir la página</option>
                            </Select>
                          </Field>
                          <div className="flex items-end">
                            <Toggle
                              label="Destacar enlace"
                              checked={link.highlight}
                              onChange={(value) => patchLink({ highlight: value })}
                              disabled={!canEdit}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </SectionCard>

            {canManageAccess && draft.id && (
              <SectionCard
                title="Acceso del negocio"
                description="Cuenta con la que la empresa entra al panel y administra únicamente esta página."
                icon={UserPlus}
              >
                <div className="space-y-3">
                  {companyAccounts === null ? (
                    <p className="text-[11px] text-muted-foreground">Cargando accesos…</p>
                  ) : companyAccounts.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-4 text-[11px] text-muted-foreground">
                      Esta página todavía no tiene una cuenta de empresa. Crea una para que el
                      negocio pueda administrarla sin acceso al resto del panel.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {companyAccounts.map((account) => (
                        <li
                          key={account.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-foreground">
                              {account.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {account.email} ·{' '}
                              {account.status === 'active' ? 'Activo' : 'Desactivado'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void removeCompanyAccount(account)}
                            disabled={companyBusy}
                            className={cn(btnSecondary, 'text-danger-ink hover:border-red-500/40')}
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                            Quitar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {companyOpen ? (
                    <form
                      onSubmit={createCompanyAccount}
                      className="grid gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-2"
                    >
                      <Field label="Nombre del contacto" htmlFor="company-name" required>
                        <input
                          id="company-name"
                          value={companyName}
                          onChange={(event) => setCompanyName(event.target.value)}
                          className={inputClass}
                          placeholder="Ej. Ana Torres"
                          autoComplete="off"
                        />
                      </Field>
                      <Field label="Correo de acceso" htmlFor="company-email" required>
                        <input
                          id="company-email"
                          type="email"
                          value={companyEmail}
                          onChange={(event) => setCompanyEmail(event.target.value)}
                          className={inputClass}
                          placeholder="equipo@empresa.com"
                          autoComplete="off"
                        />
                      </Field>
                      <Field
                        label="Contraseña temporal"
                        htmlFor="company-password"
                        required
                        hint="Mínimo 8 caracteres. Compártela por un canal seguro."
                      >
                        <input
                          id="company-password"
                          type="password"
                          value={companyPassword}
                          onChange={(event) => setCompanyPassword(event.target.value)}
                          className={inputClass}
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                      </Field>
                      <div className="flex items-end gap-2">
                        <button type="submit" disabled={companyBusy} className={btnPrimary}>
                          <UserPlus className="size-4" aria-hidden="true" />
                          {companyBusy ? 'Creando…' : 'Crear acceso'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCompanyOpen(false)}
                          className={btnSecondary}
                          disabled={companyBusy}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCompanyOpen(true)}
                      className={btnSecondary}
                    >
                      <UserPlus className="size-4" aria-hidden="true" />
                      Crear acceso para la empresa
                    </button>
                  )}
                </div>
              </SectionCard>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-xs">
              <p className="text-[11px] text-muted-foreground">
                {dirty ? 'Hay cambios sin guardar.' : 'Todos los cambios están guardados.'}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {draft.id && canDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting || saving}
                    className={cn(btnSecondary, 'text-danger-ink hover:border-red-500/40')}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    {deleting ? 'Eliminando…' : 'Eliminar página'}
                  </button>
                )}
                {canEdit && (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !dirty}
                    className={btnPrimary}
                  >
                    <Save className="size-4" aria-hidden="true" />
                    {saving ? 'Guardando…' : draft.id ? 'Guardar cambios' : 'Crear página'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
