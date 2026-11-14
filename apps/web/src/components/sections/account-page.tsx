'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Heart,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  Save,
  Search,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import {
  EMPTY_PROFILE,
  documentLabel,
  formatQuoteDate,
  isProfileComplete,
  isValidDocument,
  onlyDigits,
  type AccountProfile,
  type ContactPreference,
  type DocumentType,
  type SavedQuote,
} from '@/lib/account'
import { products } from '@/lib/catalog'
import { useAccount } from '@/lib/use-account'
import { useFavorites } from '@/lib/use-favorites'
import { useQuote } from '@/lib/use-quote'
import { buildQuoteWhatsAppUrl, downloadQuotePdf } from '@/lib/quote-export'

type Tab = 'perfil' | 'favoritos' | 'cotizaciones'
type FavoriteSort = 'name' | 'brand'
type QuoteFilter = 'todas' | SavedQuote['status']
type QuoteSort = 'recientes' | 'antiguas'

type SessionCustomer = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  documentType: 'dni' | 'ruc' | null
  documentNumber: string
  createdAt: string
}

// Marca a qué cuenta pertenece el perfil guardado en el navegador, para no
// mezclar datos si otra persona inicia sesión en el mismo equipo.
const PROFILE_OWNER_KEY = 'fj_account_owner'

const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'perfil', label: 'Mi perfil', icon: UserRound },
  { id: 'favoritos', label: 'Favoritos', icon: Heart },
  { id: 'cotizaciones', label: 'Mis cotizaciones', icon: FileText },
]

const statusLabels: Record<SavedQuote['status'], string> = {
  enviada: 'Enviada',
  revisada: 'En revisión',
  respondida: 'Respondida',
}

const statusClasses: Record<SavedQuote['status'], string> = {
  enviada: 'border-blue-ink/25 bg-tint-blue text-blue-ink',
  revisada: 'border-amber-400/45 bg-tint-amber text-warning-ink',
  respondida: 'border-success/35 bg-tint-green text-success',
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/35 focus-visible:ring-offset-1'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'FJ'
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
}

function formatMonthYear(value?: string): string | null {
  if (!value) return null
  try {
    return new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(new Date(value))
  } catch {
    return null
  }
}

function formatShortDate(value?: string): string {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return '—'
  }
}

function normalizeProfile(profile: AccountProfile): string {
  return [
    profile.name.trim(),
    profile.email.trim(),
    profile.phone.trim(),
    profile.company.trim(),
    profile.documentType,
    profile.documentNumber.trim(),
    profile.contactPreference,
  ].join('|')
}

export function AccountPage({ customer }: { customer: SessionCustomer }) {
  const account = useAccount()
  const favorites = useFavorites()
  const quote = useQuote()
  const router = useRouter()

  const [tab, setTab] = useState<Tab>('perfil')
  const [form, setForm] = useState<AccountProfile>(EMPTY_PROFILE)
  const [errors, setErrors] = useState<{ name?: string; email?: string; documentNumber?: string }>({})
  const [saved, setSaved] = useState(false)
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [showAllQuotes, setShowAllQuotes] = useState(false)

  const [favoriteQuery, setFavoriteQuery] = useState('')
  const [favoriteSort, setFavoriteSort] = useState<FavoriteSort>('name')
  const [confirmClearFavorites, setConfirmClearFavorites] = useState(false)

  const [quoteQuery, setQuoteQuery] = useState('')
  const [quoteFilter, setQuoteFilter] = useState<QuoteFilter>('todas')
  const [quoteSort, setQuoteSort] = useState<QuoteSort>('recientes')
  const [confirmClearQuotes, setConfirmClearQuotes] = useState(false)

  const [confirmWipe, setConfirmWipe] = useState(false)

  const isReady = account.isLoaded && favorites.isLoaded

  useEffect(() => {
    if (account.isLoaded && account.profile) setForm(account.profile)
  }, [account.isLoaded, account.profile])

  // La identidad de la cuenta inicia sesión en el servidor; el perfil local se
  // alinea con ella cuando el navegador todavía no tenía datos de esta cuenta.
  useEffect(() => {
    if (!account.isLoaded) return
    if (window.localStorage.getItem(PROFILE_OWNER_KEY) === customer.id) return
    window.localStorage.setItem(PROFILE_OWNER_KEY, customer.id)
    account.saveProfile({
      ...(account.profile ?? EMPTY_PROFILE),
      name: customer.name,
      email: customer.email,
      phone: customer.phone || account.profile?.phone || '',
      company: customer.company || account.profile?.company || '',
      documentType: customer.documentType ?? account.profile?.documentType ?? 'ruc',
      documentNumber: customer.documentNumber || account.profile?.documentNumber || '',
      createdAt: account.profile?.createdAt ?? customer.createdAt,
    })
  }, [
    account.isLoaded,
    account.profile,
    account.saveProfile,
    customer.id,
    customer.name,
    customer.email,
    customer.phone,
    customer.company,
    customer.documentType,
    customer.documentNumber,
    customer.createdAt,
  ])

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash !== 'perfil' && hash !== 'favoritos' && hash !== 'cotizaciones') return

      setTab(hash)
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
    }

    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [notice])

  useEffect(() => {
    setConfirmClearQuotes(false)
    setConfirmClearFavorites(false)
  }, [tab])

  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.favorites.has(product.id)),
    [favorites.favorites],
  )

  const filteredFavorites = useMemo(() => {
    const query = favoriteQuery.trim().toLowerCase()
    const matches = favoriteProducts.filter((product) => {
      if (!query) return true
      return [product.name, product.brand, product.category, product.model, product.sku]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    })

    return [...matches].sort((a, b) => {
      if (favoriteSort === 'brand') {
        return a.brand.localeCompare(b.brand, 'es') || a.name.localeCompare(b.name, 'es')
      }
      return a.name.localeCompare(b.name, 'es')
    })
  }, [favoriteProducts, favoriteQuery, favoriteSort])

  const statusCounts = useMemo(() => {
    const counts: Record<SavedQuote['status'], number> = { enviada: 0, revisada: 0, respondida: 0 }
    for (const savedQuote of account.quotes) counts[savedQuote.status] += 1
    return counts
  }, [account.quotes])

  const filteredQuotes = useMemo(() => {
    const query = quoteQuery.trim().toLowerCase()

    return account.quotes
      .filter((savedQuote) => quoteFilter === 'todas' || savedQuote.status === quoteFilter)
      .filter((savedQuote) => {
        if (!query) return true
        return (
          savedQuote.code.toLowerCase().includes(query) ||
          (savedQuote.companyName ?? '').toLowerCase().includes(query) ||
          savedQuote.items.some((item) => item.productName.toLowerCase().includes(query))
        )
      })
      .sort((a, b) => {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        return quoteSort === 'recientes' ? diff : -diff
      })
  }, [account.quotes, quoteFilter, quoteQuery, quoteSort])

  const visibleQuotes = showAllQuotes ? filteredQuotes : filteredQuotes.slice(0, 4)

  const completion = useMemo(() => {
    const checks = [
      { label: 'Nombre completo', done: Boolean(form.name.trim()) },
      { label: 'Correo electrónico', done: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) },
      { label: 'Teléfono', done: Boolean(form.phone.trim()) },
      { label: 'Documento', done: isValidDocument(form.documentType, form.documentNumber) },
    ]
    const done = checks.filter((item) => item.done).length

    return {
      checks,
      completed: done,
      percent: Math.round((done / checks.length) * 100),
      missing: checks.filter((item) => !item.done).map((item) => item.label),
    }
  }, [form])

  const isDirty = useMemo(() => {
    const base = account.profile ?? EMPTY_PROFILE
    return normalizeProfile(form) !== normalizeProfile(base)
  }, [form, account.profile])

  const profileComplete = isProfileComplete(account.profile)
  const memberSince = formatMonthYear(account.profile?.createdAt)
  const counts: Record<Tab, number> = {
    perfil: 0,
    favoritos: favoriteProducts.length,
    cotizaciones: account.quotes.length,
  }

  const switchTab = (next: Tab) => {
    setTab(next)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${next}`)
    }
  }

  const updateField = (field: keyof AccountProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === 'name' || field === 'email' || field === 'documentNumber') {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault()

    const nextErrors: { name?: string; email?: string; documentNumber?: string } = {}
    if (!form.name.trim()) nextErrors.name = 'Ingresa tu nombre'
    if (!form.email.trim()) nextErrors.email = 'Ingresa tu correo'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Correo inválido'
    if (form.documentNumber.trim() && !isValidDocument(form.documentType, form.documentNumber)) {
      nextErrors.documentNumber =
        form.documentType === 'dni' ? 'El DNI debe tener 8 dígitos' : 'El RUC debe tener 11 dígitos'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    account.saveProfile({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      createdAt: account.profile?.createdAt,
    })
    setSaved(true)
    setNotice('Guardamos tus datos')
    window.setTimeout(() => setSaved(false), 2400)
  }

  const addToQuote = (productId: string, productName: string) => {
    quote.addItem(productId)
    setNotice(`“${productName}” se agregó a tu cotización`)
  }

  const repeatQuote = (savedQuote: SavedQuote) => {
    quote.replaceQuote(savedQuote.items)
    router.push('/cotizacion')
  }

  const handleDownloadPdf = async (savedQuote: SavedQuote) => {
    setDownloadingId(savedQuote.id)
    try {
      await downloadQuotePdf(savedQuote)
    } finally {
      setDownloadingId(null)
    }
  }

  const copyQuoteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setNotice(`Código ${code} copiado`)
    } catch {
      setNotice('No pudimos copiar el código')
    }
  }

  const clearQuotes = () => {
    account.clearQuotes()
    setExpandedQuote(null)
    setConfirmClearQuotes(false)
    setNotice('Historial de cotizaciones eliminado')
  }

  const clearFavorites = () => {
    favorites.clearFavorites()
    setConfirmClearFavorites(false)
    setNotice('Eliminamos tus favoritos')
  }

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: account.profile,
      favorites: favoriteProducts.map(({ id, name, brand, category, model, sku }) => ({
        id,
        name,
        brand,
        category,
        model,
        sku,
      })),
      quotes: account.quotes,
      currentQuote: quote.quote,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `fj-systems-mis-datos-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setNotice('Descargamos un archivo con tus datos')
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/customer/logout', { method: 'POST' })
    } finally {
      router.push('/login')
      router.refresh()
    }
  }

  const wipeData = () => {
    account.clearProfile()
    account.clearQuotes()
    favorites.clearFavorites()
    quote.clearQuote()
    setForm(EMPTY_PROFILE)
    setErrors({})
    setExpandedQuote(null)
    setConfirmWipe(false)
    setNotice('Eliminamos tus datos guardados en este navegador')
  }

  const fieldClass = (hasError = false) =>
    `mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${FOCUS_RING} ${
      hasError
        ? 'border-destructive focus-visible:border-destructive'
        : 'border-border focus-visible:border-[#2563EB]'
    }`

  if (!isReady) {
    return (
      <main className="min-h-screen bg-muted text-foreground">
        <EnhancedHeader quoteCount={quote.count} />
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
            <Link href="/" className="font-semibold hover:text-blue-ink">
              Inicio
            </Link>
            <span>/</span>
            <span className="font-semibold text-foreground">Mi cuenta</span>
          </div>
        </div>
        <div className="mx-auto max-w-[1280px] animate-pulse px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="h-56 rounded-3xl bg-border" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[264px_minmax(0,1fr)]">
            <div className="hidden h-64 rounded-2xl bg-border lg:block" />
            <div className="h-96 rounded-2xl bg-border" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted text-foreground">
      <EnhancedHeader quoteCount={quote.count} />

      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold hover:text-blue-ink">
            Inicio
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">Mi cuenta</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Cabecera de cuenta */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1D4ED8] p-6 text-white sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-[#3B82F6]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-[#2563EB]/15 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] font-heading text-xl font-bold ring-1 ring-white/20">
                {getInitials(form.name || account.profile?.name || '')}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7DD3FC]">
                  Mi cuenta
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {profileComplete ? form.name : 'Completa tu perfil'}
                </h1>
                <p
                  className={`mt-1 text-sm text-muted-foreground ${profileComplete ? 'truncate' : 'leading-5'}`}
                >
                  {profileComplete
                    ? form.email
                    : 'Guarda tus datos para agilizar tus próximas cotizaciones.'}
                </p>
                {memberSince && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <CalendarDays className="size-3.5" /> Miembro desde {memberSince}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-[#E2E8F0] transition hover:border-white/30 hover:bg-white/10"
                >
                  <LogOut aria-hidden="true" className="size-3.5" />
                  Cerrar sesión
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(
                [
                  {
                    label: 'Favoritos',
                    value: favoriteProducts.length,
                    icon: Heart,
                    tab: 'favoritos' as Tab,
                  },
                  {
                    label: 'Cotizaciones',
                    value: account.quotes.length,
                    icon: FileText,
                    tab: 'cotizaciones' as Tab,
                  },
                  { label: 'En curso', value: quote.count, icon: ShoppingCart, href: '/cotizacion' },
                ] as {
                  label: string
                  value: number
                  icon: LucideIcon
                  tab?: Tab
                  href?: string
                }[]
              ).map((item) => {
                const Icon = item.icon
                const active = item.tab ? tab === item.tab : false
                const className = `rounded-xl border px-3 py-3 text-left transition ${FOCUS_RING} ${
                  active
                    ? 'border-[#3B82F6]/60 bg-[#2563EB]/20'
                    : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                }`
                const content = (
                  <>
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      <Icon className="size-3" /> {item.label}
                    </span>
                    <span className="mt-1 block text-xl font-bold">{item.value}</span>
                  </>
                )

                return item.href ? (
                  <Link key={item.label} href={item.href} aria-label={`Ir a ${item.label}`} className={className}>
                    {content}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => item.tab && switchTab(item.tab)}
                    aria-label={`Ir a ${item.label}`}
                    className={className}
                  >
                    {content}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#DBEAFE]">
                <ShieldCheck className="size-4 text-[#7DD3FC]" />
                Perfil {completion.percent}% completo
              </p>
              <p className="text-[11px] text-muted-foreground">
                {completion.completed} de {completion.checks.length} datos clave
              </p>
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completion.percent}
              aria-label="Perfil completo"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] transition-[width] duration-500"
                style={{ width: `${completion.percent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {completion.missing.length === 0
                ? 'Todo listo: tus cotizaciones llegarán con tus datos completos.'
                : `Falta completar: ${completion.missing.join(', ')}.`}
            </p>
          </div>
        </section>

        {notice && (
          <div className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-xl">
            <Check className="size-4 text-[#22D3EE]" />
            {notice}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[264px_minmax(0,1fr)] lg:items-start">
          {/* Navegación lateral (escritorio) */}
          <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:block">
            <nav aria-label="Secciones de mi cuenta" className="rounded-2xl border border-border bg-card p-2">
              {tabs.map((item) => {
                const Icon = item.icon
                const active = tab === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => switchTab(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${FOCUS_RING} ${
                      active
                        ? 'bg-tint-blue text-blue-ink'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span
                      className={`grid size-8 place-items-center rounded-lg transition ${
                        active
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-muted text-muted-foreground group-hover:bg-card'
                      }`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {counts[item.id] > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          active ? 'bg-[#2563EB]/10 text-blue-ink' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {counts[item.id]}
                      </span>
                    )}
                  </button>
                )
              })}

              <div className="mt-2 space-y-1 border-t border-border pt-2">
                <Link
                  href="/productos"
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-blue-ink ${FOCUS_RING}`}
                >
                  <ShoppingCart className="size-3.5" /> Ver catálogo
                </Link>
                <Link
                  href="/cotizacion"
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-blue-ink ${FOCUS_RING}`}
                >
                  <FileText className="size-3.5" /> Pedir cotización
                </Link>
              </div>
            </nav>

            <div className="rounded-2xl border border-blue-ink/25 bg-tint-blue p-4">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-ink">
                <ShieldCheck className="size-3.5" /> Tus datos
              </p>
              <p className="mt-2 text-[11px] leading-5 text-blue-ink">
                Se guardan solo en este navegador. Puedes descargarlos o eliminarlos cuando quieras
                desde la pestaña Mi perfil.
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            {/* Pestañas (móvil) */}
            <div
              className="flex flex-wrap gap-2 border-b border-border pb-3 lg:hidden"
              role="tablist"
              aria-label="Secciones de mi cuenta"
            >
              {tabs.map((item) => {
                const Icon = item.icon
                const active = tab === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => switchTab(item.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${FOCUS_RING} ${
                      active
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-[#2563EB]/30'
                        : 'border border-border bg-card text-muted-foreground hover:border-[#2563EB]/40 hover:text-blue-ink'
                    }`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                    {counts[item.id] > 0 && (
                      <span
                        className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold ${
                          active ? 'bg-white/20 text-white' : 'bg-tint-blue text-blue-ink'
                        }`}
                      >
                        {counts[item.id]}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Perfil */}
            {tab === 'perfil' && (
              <section
                id="perfil"
                className="mt-6 scroll-mt-24 grid gap-6 lg:mt-0 lg:grid-cols-[minmax(0,1fr)_320px]"
              >
                <form
                  onSubmit={handleSaveProfile}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                      <UserRound className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold">Datos personales</h2>
                      <p className="text-xs text-muted-foreground">
                        Se usarán para completar automáticamente tus cotizaciones.
                      </p>
                    </div>
                  </div>

                  <fieldset className="mt-6 border-0 p-0">
                    <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Contacto
                    </legend>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <label className="block text-xs font-semibold text-foreground">
                        Nombre completo *
                        <input
                          value={form.name}
                          onChange={(event) => updateField('name', event.target.value)}
                          placeholder="Tu nombre"
                          autoComplete="name"
                          aria-invalid={Boolean(errors.name)}
                          className={fieldClass(Boolean(errors.name))}
                        />
                        {errors.name && (
                          <span className="mt-1 block text-[10px] font-normal text-destructive">
                            {errors.name}
                          </span>
                        )}
                      </label>

                      <label className="block text-xs font-semibold text-foreground">
                        Correo electrónico *
                        <input
                          type="email"
                          value={form.email}
                          onChange={(event) => updateField('email', event.target.value)}
                          placeholder="tu@email.com"
                          autoComplete="email"
                          aria-invalid={Boolean(errors.email)}
                          className={fieldClass(Boolean(errors.email))}
                        />
                        {errors.email && (
                          <span className="mt-1 block text-[10px] font-normal text-destructive">
                            {errors.email}
                          </span>
                        )}
                      </label>

                      <label className="block text-xs font-semibold text-foreground">
                        Teléfono
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(event) => updateField('phone', event.target.value)}
                          placeholder="+51 999 999 999"
                          autoComplete="tel"
                          className={fieldClass()}
                        />
                      </label>

                      <label className="block text-xs font-semibold text-foreground">
                        Preferencia de contacto
                        <select
                          value={form.contactPreference}
                          onChange={(event) =>
                            updateField('contactPreference', event.target.value as ContactPreference)
                          }
                          className={`${fieldClass()} bg-card`}
                        >
                          <option value="email">Email</option>
                          <option value="phone">Teléfono</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset className="mt-6 border-0 border-t border-border p-0 pt-6">
                    <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Empresa y facturación
                    </legend>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Opcional, pero agiliza la emisión de tu cotización y comprobantes.
                    </p>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <label className="block text-xs font-semibold text-foreground sm:col-span-2">
                        Empresa
                        <input
                          value={form.company}
                          onChange={(event) => updateField('company', event.target.value)}
                          placeholder="Nombre de tu empresa"
                          autoComplete="organization"
                          className={fieldClass()}
                        />
                      </label>

                      <label className="block text-xs font-semibold text-foreground">
                        Tipo de documento
                        <select
                          value={form.documentType}
                          onChange={(event) =>
                            updateField('documentType', event.target.value as DocumentType)
                          }
                          className={`${fieldClass()} bg-card`}
                        >
                          <option value="ruc">RUC (empresa)</option>
                          <option value="dni">DNI (persona natural)</option>
                        </select>
                      </label>

                      <label className="block text-xs font-semibold text-foreground">
                        Número de documento
                        <input
                          inputMode="numeric"
                          maxLength={11}
                          value={form.documentNumber}
                          onChange={(event) =>
                            updateField('documentNumber', onlyDigits(event.target.value))
                          }
                          placeholder={form.documentType === 'dni' ? '12345678' : '20123456789'}
                          aria-invalid={Boolean(errors.documentNumber)}
                          className={fieldClass(Boolean(errors.documentNumber))}
                        />
                        {errors.documentNumber ? (
                          <span className="mt-1 block text-[10px] font-normal text-destructive">
                            {errors.documentNumber}
                          </span>
                        ) : (
                          <span className="mt-1 block text-[10px] font-normal text-muted-foreground">
                            {form.documentType === 'dni' ? '8 dígitos' : '11 dígitos'}
                          </span>
                        )}
                      </label>
                    </div>
                  </fieldset>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
                    <button
                      type="submit"
                      disabled={!isDirty}
                      className={`inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition ${FOCUS_RING} ${
                        isDirty
                          ? 'bg-[#2563EB] hover:bg-[#1D4ED8]'
                          : 'cursor-not-allowed bg-[#CBD5E1]'
                      }`}
                    >
                      {saved ? <Check className="size-4" /> : <Save className="size-4" />}
                      {saved ? 'Datos guardados' : 'Guardar cambios'}
                    </button>

                    {isDirty && !saved && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/45 bg-tint-amber px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-warning-ink">
                        Cambios sin guardar
                      </span>
                    )}

                    <p className="text-[11px] text-muted-foreground">
                      Tus datos se guardan solo en este navegador.
                    </p>
                  </div>
                </form>

                <aside className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="flex items-center gap-2 text-sm font-bold">
                      <Building2 className="size-4 text-blue-ink" /> Estado del perfil
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {completion.checks.map((item) => (
                        <li key={item.label} className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-muted-foreground">{item.label}</span>
                          {item.done ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-success">
                              <Check className="size-3.5" /> Listo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                              <X className="size-3.5" /> Pendiente
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
                      Última actualización: {formatShortDate(account.profile?.updatedAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="flex items-center gap-2 text-sm font-bold">
                      <ShieldCheck className="size-4 text-blue-ink" /> Tus datos
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Tu perfil, favoritos e historial viven en este navegador. Descárgalos o bórralos
                      cuando quieras.
                    </p>
                    <div className="mt-4 space-y-2">
                      <button
                        type="button"
                        onClick={exportData}
                        className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink ${FOCUS_RING}`}
                      >
                        <Download className="size-3.5" /> Exportar mis datos
                      </button>

                      {confirmWipe ? (
                        <div className="rounded-xl border border-destructive/35 bg-tint-red p-3">
                          <p className="text-[11px] leading-5 text-destructive">
                            Se borrarán tu perfil, favoritos, cotizaciones e historial de este navegador.
                            Esta acción no se puede deshacer.
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={wipeData}
                              className={`flex-1 rounded-lg bg-[#DC2626] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#B91C1C] ${FOCUS_RING}`}
                            >
                              Sí, eliminar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmWipe(false)}
                              className={`flex-1 rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-bold text-muted-foreground transition hover:border-input ${FOCUS_RING}`}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmWipe(true)}
                          className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-xs font-bold text-muted-foreground transition hover:border-destructive/40 hover:text-destructive ${FOCUS_RING}`}
                        >
                          <Trash2 className="size-3.5" /> Eliminar mis datos
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="flex items-center gap-2 text-sm font-bold">
                      <MessageCircle className="size-4 text-blue-ink" /> ¿Necesitas ayuda?
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Escríbenos y un asesor revisará tus cotizaciones contigo.
                    </p>
                    <Link
                      href="/contacto"
                      className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink ${FOCUS_RING}`}
                    >
                      Contactar a ventas <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </aside>
              </section>
            )}

            {/* Favoritos */}
            {tab === 'favoritos' && (
              <section id="favoritos" className="mt-6 scroll-mt-24 lg:mt-0">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">Productos favoritos</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Los equipos que guardaste con el corazón desde el catálogo.
                    </p>
                  </div>
                  <Link
                    href="/productos"
                    className={`inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink ${FOCUS_RING}`}
                  >
                    Explorar catálogo <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                {favoriteProducts.length === 0 ? (
                  <EmptyState
                    icon={<Heart className="size-7" />}
                    title="Todavía no tienes favoritos"
                    description="Agrega productos desde el catálogo para encontrarlos rápidamente aquí."
                  />
                ) : (
                  <>
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <label className="relative block w-full sm:max-w-xs">
                        <span className="sr-only">Buscar en favoritos</span>
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={favoriteQuery}
                          onChange={(event) => setFavoriteQuery(event.target.value)}
                          placeholder="Buscar por nombre, marca o categoría"
                          className={`h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition focus-visible:border-[#2563EB] ${FOCUS_RING}`}
                        />
                      </label>

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                          Ordenar
                          <select
                            value={favoriteSort}
                            onChange={(event) => setFavoriteSort(event.target.value as FavoriteSort)}
                            className={`h-10 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground outline-none transition focus-visible:border-[#2563EB] ${FOCUS_RING}`}
                          >
                            <option value="name">Nombre (A-Z)</option>
                            <option value="brand">Marca</option>
                          </select>
                        </label>

                        {confirmClearFavorites ? (
                          <div className="flex items-center gap-2 rounded-xl border border-destructive/35 bg-tint-red px-3 py-1.5 text-[11px] font-semibold text-destructive">
                            ¿Quitar todos?
                            <button
                              type="button"
                              onClick={clearFavorites}
                              className={`rounded-lg bg-[#DC2626] px-2 py-1 text-[11px] font-bold text-white transition hover:bg-[#B91C1C] ${FOCUS_RING}`}
                            >
                              Sí
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmClearFavorites(false)}
                              className={`rounded-lg bg-card px-2 py-1 text-[11px] font-bold text-muted-foreground ${FOCUS_RING}`}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmClearFavorites(true)}
                            className={`inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground transition hover:border-destructive/40 hover:text-destructive ${FOCUS_RING}`}
                          >
                            <Trash2 className="size-3.5" /> Quitar todos
                          </button>
                        )}
                      </div>
                    </div>

                    {filteredFavorites.length === 0 ? (
                      <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-input bg-card px-6 py-12 text-center">
                        <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                          <Search className="size-5" />
                        </span>
                        <p className="mt-4 text-sm font-bold">Sin coincidencias</p>
                        <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                          No encontramos favoritos para “{favoriteQuery}”. Prueba con otra marca o
                          categoría.
                        </p>
                        <button
                          type="button"
                          onClick={() => setFavoriteQuery('')}
                          className={`mt-4 inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink ${FOCUS_RING}`}
                        >
                          Limpiar búsqueda
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          {filteredFavorites.length} de {favoriteProducts.length} favoritos
                        </p>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {filteredFavorites.map((product) => (
                            <article
                              key={product.id}
                              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-[#2563EB]/30 hover:shadow-lg hover:shadow-black/5"
                            >
                              <Link href={`/productos/${product.slug}`} className="block bg-muted p-4">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="mx-auto h-36 w-full object-contain"
                                  loading="lazy"
                                />
                              </Link>
                              <div className="flex flex-1 flex-col p-4">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-ink">
                                  {product.brand} / {product.category}
                                </p>
                                <Link
                                  href={`/productos/${product.slug}`}
                                  className={`mt-1.5 line-clamp-2 text-sm font-bold leading-5 hover:text-blue-ink ${FOCUS_RING}`}
                                >
                                  {product.name}
                                </Link>
                                {(product.model || product.sku) && (
                                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                                    {product.model || product.sku}
                                  </p>
                                )}

                                <div className="mt-auto flex gap-2 pt-4">
                                  <button
                                    type="button"
                                    onClick={() => addToQuote(product.id, product.name)}
                                    className={`inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-xs font-bold text-white transition hover:bg-[#1D4ED8] ${FOCUS_RING}`}
                                  >
                                    <ShoppingCart className="size-3.5" /> Cotizar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => favorites.toggleFavorite(product.id)}
                                    aria-label={`Quitar ${product.name} de favoritos`}
                                    className={`grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition hover:border-destructive/40 hover:text-destructive ${FOCUS_RING}`}
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </section>
            )}

            {/* Cotizaciones */}
            {tab === 'cotizaciones' && (
              <section id="cotizaciones" className="mt-6 scroll-mt-24 lg:mt-0">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">Historial de cotizaciones</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Solicitudes enviadas desde este navegador.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {account.quotes.length > 0 && (
                      <>
                        {confirmClearQuotes ? (
                          <div className="flex items-center gap-2 rounded-xl border border-destructive/35 bg-tint-red px-3 py-1.5 text-[11px] font-semibold text-destructive">
                            ¿Borrar historial?
                            <button
                              type="button"
                              onClick={clearQuotes}
                              className={`rounded-lg bg-[#DC2626] px-2 py-1 text-[11px] font-bold text-white transition hover:bg-[#B91C1C] ${FOCUS_RING}`}
                            >
                              Sí
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmClearQuotes(false)}
                              className={`rounded-lg bg-card px-2 py-1 text-[11px] font-bold text-muted-foreground ${FOCUS_RING}`}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmClearQuotes(true)}
                            className={`inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground transition hover:border-destructive/40 hover:text-destructive ${FOCUS_RING}`}
                          >
                            <Trash2 className="size-3.5" /> Limpiar historial
                          </button>
                        )}
                      </>
                    )}
                    <Link
                      href="/productos"
                      className={`inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white transition hover:bg-[#1D4ED8] ${FOCUS_RING}`}
                    >
                      Nueva cotización <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                {account.quotes.length === 0 ? (
                  <EmptyState
                    icon={<FileText className="size-7" />}
                    title="Aún no tienes cotizaciones"
                    description="Cuando envíes una solicitud desde la página de cotización aparecerá aquí."
                  />
                ) : (
                  <>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          [
                            { id: 'todas', label: 'Todas', count: account.quotes.length },
                            { id: 'enviada', label: statusLabels.enviada, count: statusCounts.enviada },
                            { id: 'revisada', label: statusLabels.revisada, count: statusCounts.revisada },
                            {
                              id: 'respondida',
                              label: statusLabels.respondida,
                              count: statusCounts.respondida,
                            },
                          ] as { id: QuoteFilter; label: string; count: number }[]
                        ).map((filter) => {
                          const active = quoteFilter === filter.id
                          return (
                            <button
                              key={filter.id}
                              type="button"
                              onClick={() => {
                                setQuoteFilter(filter.id)
                                setShowAllQuotes(false)
                              }}
                              aria-pressed={active}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${FOCUS_RING} ${
                                active
                                  ? 'border-[#2563EB] bg-[#2563EB] text-white'
                                  : 'border-border bg-card text-muted-foreground hover:border-[#2563EB]/40 hover:text-blue-ink'
                              }`}
                            >
                              {filter.label}
                              <span
                                className={`rounded-full px-1.5 text-[10px] ${
                                  active ? 'bg-white/20' : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {filter.count}
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="relative block w-full sm:w-56">
                          <span className="sr-only">Buscar cotizaciones</span>
                          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            value={quoteQuery}
                            onChange={(event) => {
                              setQuoteQuery(event.target.value)
                              setShowAllQuotes(false)
                            }}
                            placeholder="Código o producto"
                            className={`h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition focus-visible:border-[#2563EB] ${FOCUS_RING}`}
                          />
                        </label>

                        <label className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                          <span className="sr-only">Ordenar cotizaciones</span>
                          <select
                            value={quoteSort}
                            onChange={(event) => setQuoteSort(event.target.value as QuoteSort)}
                            className={`h-10 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground outline-none transition focus-visible:border-[#2563EB] ${FOCUS_RING}`}
                          >
                            <option value="recientes">Más recientes</option>
                            <option value="antiguas">Más antiguas</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    {filteredQuotes.length === 0 ? (
                      <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-input bg-card px-6 py-12 text-center">
                        <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                          <Search className="size-5" />
                        </span>
                        <p className="mt-4 text-sm font-bold">No encontramos cotizaciones</p>
                        <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                          Ajusta el estado o la búsqueda para ver más resultados.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setQuoteFilter('todas')
                            setQuoteQuery('')
                          }}
                          className={`mt-4 inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink ${FOCUS_RING}`}
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {visibleQuotes.map((savedQuote) => {
                          const isExpanded = expandedQuote === savedQuote.id
                          const totalUnits = savedQuote.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )

                          return (
                            <article
                              key={savedQuote.id}
                              className="overflow-hidden rounded-2xl border border-border bg-card transition hover:border-[#2563EB]/30"
                            >
                              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-foreground">
                                      {savedQuote.code}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => copyQuoteCode(savedQuote.code)}
                                      aria-label={`Copiar código ${savedQuote.code}`}
                                      className={`grid size-6 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-blue-ink ${FOCUS_RING}`}
                                    >
                                      <Copy className="size-3.5" />
                                    </button>
                                    <span
                                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusClasses[savedQuote.status]}`}
                                    >
                                      {statusLabels[savedQuote.status]}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {formatQuoteDate(savedQuote.createdAt)} · {savedQuote.itemCount}{' '}
                                    producto(s) · {totalUnits} unidad(es)
                                  </p>
                                  <div className="mt-3 flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                      {savedQuote.items.slice(0, 3).map((item) => (
                                        <img
                                          key={item.productId}
                                          src={item.productImage}
                                          alt={item.productName}
                                          className="size-9 rounded-lg border-2 border-white bg-muted object-contain"
                                        />
                                      ))}
                                    </div>
                                    {savedQuote.items.length > 3 && (
                                      <span className="text-[11px] font-semibold text-muted-foreground">
                                        +{savedQuote.items.length - 3} más
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedQuote(isExpanded ? null : savedQuote.id)}
                                    aria-expanded={isExpanded}
                                    className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink ${FOCUS_RING}`}
                                  >
                                    {isExpanded ? 'Ocultar' : 'Ver detalle'}
                                    <ChevronDown
                                      className={`size-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                  </button>
                                  <a
                                    href={buildQuoteWhatsAppUrl(savedQuote)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-success/35 bg-tint-green px-3 text-xs font-bold text-success transition hover:bg-success/15 ${FOCUS_RING}`}
                                  >
                                    <MessageCircle className="size-3.5" /> WhatsApp
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadPdf(savedQuote)}
                                    disabled={downloadingId === savedQuote.id}
                                    className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
                                  >
                                    {downloadingId === savedQuote.id ? (
                                      <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                      <Download className="size-3.5" />
                                    )}
                                    {downloadingId === savedQuote.id ? 'Generando...' : 'PDF'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => repeatQuote(savedQuote)}
                                    className={`inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 text-xs font-bold text-white transition hover:bg-[#1D4ED8] ${FOCUS_RING}`}
                                  >
                                    <ShoppingCart className="size-3.5" /> Repetir
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      account.removeQuote(savedQuote.id)
                                      setExpandedQuote(null)
                                      setNotice('Cotización eliminada')
                                    }}
                                    aria-label={`Eliminar cotización ${savedQuote.code}`}
                                    className={`grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-tint-red hover:text-destructive ${FOCUS_RING}`}
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="border-t border-border bg-muted p-5">
                                  <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                                    <ul className="space-y-2">
                                      {savedQuote.items.map((item) => (
                                        <li
                                          key={item.productId}
                                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                                        >
                                          <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="size-12 shrink-0 rounded-lg bg-muted object-contain"
                                          />
                                          <div className="min-w-0 flex-1">
                                            <p className="line-clamp-1 text-xs font-bold">
                                              {item.productName}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                              {item.productModel || item.productSku || 'Producto'}
                                            </p>
                                            {item.notes && (
                                              <p className="mt-0.5 line-clamp-1 text-[10px] italic text-muted-foreground">
                                                Nota: {item.notes}
                                              </p>
                                            )}
                                          </div>
                                          <span className="rounded-lg bg-tint-blue px-2 py-1 text-xs font-bold text-blue-ink">
                                            x{item.quantity}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>

                                    <div className="space-y-3 text-xs">
                                      <div className="rounded-xl border border-border bg-card p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-ink">
                                          Contacto
                                        </p>
                                        <p className="mt-2 font-semibold">{savedQuote.contactName}</p>
                                        <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                                          <Mail className="size-3" /> {savedQuote.contactEmail}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                                          <Phone className="size-3" /> {savedQuote.contactPhone}
                                        </p>
                                        {savedQuote.companyName && (
                                          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                                            <Building2 className="size-3" /> {savedQuote.companyName}
                                          </p>
                                        )}
                                        {savedQuote.documentNumber && (
                                          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                                            <FileText className="size-3" />{' '}
                                            {documentLabel(savedQuote.documentType)}:{' '}
                                            {savedQuote.documentNumber}
                                          </p>
                                        )}
                                      </div>

                                      {savedQuote.generalNotes && (
                                        <div className="rounded-xl border border-border bg-card p-4">
                                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-ink">
                                            Comentarios
                                          </p>
                                          <p className="mt-2 leading-5 text-muted-foreground">
                                            {savedQuote.generalNotes}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </article>
                          )
                        })}

                        {filteredQuotes.length > 4 && (
                          <button
                            type="button"
                            onClick={() => setShowAllQuotes((value) => !value)}
                            className={`mx-auto flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink ${FOCUS_RING}`}
                          >
                            {showAllQuotes
                              ? 'Ver menos'
                              : `Ver todas (${filteredQuotes.length})`}
                            <ChevronDown
                              className={`size-3.5 transition-transform ${showAllQuotes ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-input bg-card px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-tint-blue text-blue-ink">
        {icon}
      </span>
      <p className="mt-5 text-base font-bold">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      <Link
        href="/productos"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
      >
        Ver productos <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}
