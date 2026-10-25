'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  Download,
  FileText,
  Heart,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Save,
  ShoppingCart,
  Trash2,
  UserRound,
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

const tabs: { id: Tab; label: string; icon: typeof UserRound }[] = [
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
  enviada: 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]',
  revisada: 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]',
  respondida: 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'FJ'
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
}

export function AccountPage() {
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

  useEffect(() => {
    if (account.isLoaded && account.profile) setForm(account.profile)
  }, [account.isLoaded, account.profile])

  useEffect(() => {
    if (typeof window === 'undefined' || !account.isLoaded) return
    if (window.location.hash === '#cotizaciones') setTab('cotizaciones')
    if (window.location.hash === '#favoritos') setTab('favoritos')
  }, [account.isLoaded])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.favorites.has(product.id)),
    [favorites.favorites],
  )

  const visibleQuotes = showAllQuotes ? account.quotes : account.quotes.slice(0, 4)
  const profileComplete = isProfileComplete(account.profile)

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

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <EnhancedHeader quoteCount={quote.count} />

      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-[#475569] sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold hover:text-[#2563EB]">
            Inicio
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A]">Mi cuenta</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Cabecera de cuenta */}
        <section className="overflow-hidden rounded-3xl bg-[#0B1220] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] font-heading text-xl font-bold">
                {getInitials(form.name || account.profile?.name || '')}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7DD3FC]">
                  Mi cuenta
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {profileComplete ? form.name : 'Completa tu perfil'}
                </h1>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  {profileComplete
                    ? form.email
                    : 'Guarda tus datos para agilizar tus próximas cotizaciones.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]">Favoritos</p>
                <p className="mt-1 text-xl font-bold">{favoriteProducts.length}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]">Cotizaciones</p>
                <p className="mt-1 text-xl font-bold">{account.quotes.length}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]">En curso</p>
                <p className="mt-1 text-xl font-bold">{quote.count}</p>
              </div>
            </div>
          </div>

          {!profileComplete && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#3B82F6]/30 bg-[#2563EB]/10 px-4 py-3 text-sm text-[#DBEAFE]">
              <BadgeCheck className="mt-0.5 size-4 shrink-0" />
              <p>
                Completa tu nombre y correo en la pestaña{' '}
                <strong className="font-semibold">Mi perfil</strong> para que tus cotizaciones lleguen
                con tus datos.
              </p>
            </div>
          )}
        </section>

        {notice && (
          <div className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-xl">
            <Check className="size-4 text-[#22D3EE]" />
            {notice}
          </div>
        )}

        {/* Pestañas */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-3" role="tablist" aria-label="Secciones de mi cuenta">
          {tabs.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            const count =
              item.id === 'favoritos'
                ? favoriteProducts.length
                : item.id === 'cotizaciones'
                  ? account.quotes.length
                  : 0

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setTab(item.id)
                  if (typeof window !== 'undefined') {
                    window.history.replaceState(null, '', `#${item.id}`)
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-sm shadow-[#2563EB]/30'
                    : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB]/40 hover:text-[#2563EB]'
                }`}
              >
                <Icon className="size-4" />
                {item.label}
                {count > 0 && (
                  <span
                    className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-[#EFF6FF] text-[#2563EB]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Perfil */}
        {tab === 'perfil' && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <form onSubmit={handleSaveProfile} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  <UserRound className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold">Datos personales</h2>
                  <p className="text-xs text-[#64748B]">
                    Se usarán para completar automáticamente tus cotizaciones.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-[#0F172A]">
                  Nombre completo *
                  <input
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Tu nombre"
                    className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${
                      errors.name ? 'border-[#EF4444]' : 'border-[#E2E8F0] focus:border-[#2563EB]'
                    }`}
                  />
                  {errors.name && <span className="mt-1 block text-[10px] font-normal text-[#EF4444]">{errors.name}</span>}
                </label>

                <label className="block text-xs font-semibold text-[#0F172A]">
                  Correo electrónico *
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="tu@email.com"
                    className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${
                      errors.email ? 'border-[#EF4444]' : 'border-[#E2E8F0] focus:border-[#2563EB]'
                    }`}
                  />
                  {errors.email && <span className="mt-1 block text-[10px] font-normal text-[#EF4444]">{errors.email}</span>}
                </label>

                <label className="block text-xs font-semibold text-[#0F172A]">
                  Teléfono
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    placeholder="+51 999 999 999"
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-normal outline-none transition focus:border-[#2563EB]"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#0F172A]">
                  Preferencia de contacto
                  <select
                    value={form.contactPreference}
                    onChange={(event) => updateField('contactPreference', event.target.value as ContactPreference)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#2563EB]"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Teléfono</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-[#0F172A] sm:col-span-2">
                  Empresa <span className="font-normal text-[#94A3B8]">(opcional)</span>
                  <input
                    value={form.company}
                    onChange={(event) => updateField('company', event.target.value)}
                    placeholder="Nombre de tu empresa"
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm font-normal outline-none transition focus:border-[#2563EB]"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#0F172A]">
                  Tipo de documento
                  <select
                    value={form.documentType}
                    onChange={(event) => updateField('documentType', event.target.value as DocumentType)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#2563EB]"
                  >
                    <option value="ruc">RUC (empresa)</option>
                    <option value="dni">DNI (persona natural)</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-[#0F172A]">
                  Número de documento <span className="font-normal text-[#94A3B8]">(opcional)</span>
                  <input
                    inputMode="numeric"
                    maxLength={11}
                    value={form.documentNumber}
                    onChange={(event) => updateField('documentNumber', onlyDigits(event.target.value))}
                    placeholder={form.documentType === 'dni' ? '12345678' : '20123456789'}
                    className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none transition ${
                      errors.documentNumber
                        ? 'border-[#EF4444] focus:border-[#EF4444]'
                        : 'border-[#E2E8F0] focus:border-[#2563EB]'
                    }`}
                  />
                  {errors.documentNumber && (
                    <span className="mt-1 block text-[10px] font-normal text-[#EF4444]">
                      {errors.documentNumber}
                    </span>
                  )}
                </label>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  {saved ? <Check className="size-4" /> : <Save className="size-4" />}
                  {saved ? 'Datos guardados' : 'Guardar cambios'}
                </button>
                <p className="text-[11px] text-[#64748B]">
                  Tus datos se guardan solo en este navegador.
                </p>
              </div>
            </form>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <Building2 className="size-4 text-[#2563EB]" /> Resumen
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#64748B]">Favoritos</dt>
                    <dd className="font-semibold">{favoriteProducts.length}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#64748B]">Cotizaciones enviadas</dt>
                    <dd className="font-semibold">{account.quotes.length}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#64748B]">Productos en curso</dt>
                    <dd className="font-semibold">{quote.count}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <MessageCircle className="size-4 text-[#2563EB]" /> ¿Necesitas ayuda?
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#64748B]">
                  Escríbenos y un asesor revisará tus cotizaciones contigo.
                </p>
                <Link
                  href="/contacto"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                >
                  Contactar a ventas <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </aside>
          </section>
        )}

        {/* Favoritos */}
        {tab === 'favoritos' && (
          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Productos favoritos</h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Los equipos que guardaste con el corazón desde el catálogo.
                </p>
              </div>
              <Link
                href="/productos"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-xs font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
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
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteProducts.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white"
                  >
                    <Link href={`/productos/${product.slug}`} className="block bg-[#F1F5F9] p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="mx-auto h-36 w-full object-contain"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
                        {product.brand} / {product.category}
                      </p>
                      <Link
                        href={`/productos/${product.slug}`}
                        className="mt-1.5 line-clamp-2 text-sm font-bold leading-5 hover:text-[#2563EB]"
                      >
                        {product.name}
                      </Link>
                      {(product.model || product.sku) && (
                        <p className="mt-1 font-mono text-[10px] text-[#64748B]">
                          {product.model || product.sku}
                        </p>
                      )}

                      <div className="mt-auto flex gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => addToQuote(product.id, product.name)}
                          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
                        >
                          <ShoppingCart className="size-3.5" /> Cotizar
                        </button>
                        <button
                          type="button"
                          onClick={() => favorites.toggleFavorite(product.id)}
                          aria-label={`Quitar ${product.name} de favoritos`}
                          className="grid size-9 place-items-center rounded-lg border border-[#E2E8F0] text-[#475569] transition hover:border-[#EF4444]/40 hover:text-[#EF4444]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Cotizaciones */}
        {tab === 'cotizaciones' && (
          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Historial de cotizaciones</h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Solicitudes enviadas desde este navegador.
                </p>
              </div>
              <div className="flex gap-2">
                {account.quotes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      account.clearQuotes()
                      setExpandedQuote(null)
                    }}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-xs font-bold text-[#475569] transition hover:border-[#EF4444]/40 hover:text-[#EF4444]"
                  >
                    <Trash2 className="size-3.5" /> Limpiar historial
                  </button>
                )}
                <Link
                  href="/productos"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
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
              <div className="mt-6 space-y-4">
                {visibleQuotes.map((savedQuote) => {
                  const isExpanded = expandedQuote === savedQuote.id

                  return (
                    <article
                      key={savedQuote.id}
                      className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white"
                    >
                      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#0F172A]">
                              {savedQuote.code}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusClasses[savedQuote.status]}`}
                            >
                              {statusLabels[savedQuote.status]}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#64748B]">
                            {formatQuoteDate(savedQuote.createdAt)} · {savedQuote.itemCount} producto(s)
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {savedQuote.items.slice(0, 3).map((item) => (
                                <img
                                  key={item.productId}
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="size-9 rounded-lg border-2 border-white bg-[#F1F5F9] object-contain"
                                />
                              ))}
                            </div>
                            {savedQuote.items.length > 3 && (
                              <span className="text-[11px] font-semibold text-[#64748B]">
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
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 text-xs font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                          >
                            {isExpanded ? 'Ocultar' : 'Ver detalle'}
                            <ChevronDown className={`size-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          <a
                            href={buildQuoteWhatsAppUrl(savedQuote)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 text-xs font-bold text-[#15803D] transition hover:bg-[#DCFCE7]"
                          >
                            <MessageCircle className="size-3.5" /> WhatsApp
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(savedQuote)}
                            disabled={downloadingId === savedQuote.id}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 text-xs font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
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
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
                          >
                            <ShoppingCart className="size-3.5" /> Repetir
                          </button>
                          <button
                            type="button"
                            onClick={() => account.removeQuote(savedQuote.id)}
                            aria-label={`Eliminar cotización ${savedQuote.code}`}
                            className="grid size-9 place-items-center rounded-lg text-[#64748B] transition hover:bg-[#FEF2F2] hover:text-[#EF4444]"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-5">
                          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                            <ul className="space-y-2">
                              {savedQuote.items.map((item) => (
                                <li
                                  key={item.productId}
                                  className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3"
                                >
                                  <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="size-12 shrink-0 rounded-lg bg-[#F1F5F9] object-contain"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="line-clamp-1 text-xs font-bold">{item.productName}</p>
                                    <p className="text-[10px] text-[#64748B]">
                                      {item.productModel || item.productSku || 'Producto'}
                                    </p>
                                    {item.notes && (
                                      <p className="mt-0.5 line-clamp-1 text-[10px] italic text-[#64748B]">
                                        Nota: {item.notes}
                                      </p>
                                    )}
                                  </div>
                                  <span className="rounded-lg bg-[#EFF6FF] px-2 py-1 text-xs font-bold text-[#2563EB]">
                                    x{item.quantity}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            <div className="space-y-3 text-xs">
                              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">
                                  Contacto
                                </p>
                                <p className="mt-2 font-semibold">{savedQuote.contactName}</p>
                                <p className="mt-1 flex items-center gap-1.5 text-[#64748B]">
                                  <Mail className="size-3" /> {savedQuote.contactEmail}
                                </p>
                                <p className="mt-1 flex items-center gap-1.5 text-[#64748B]">
                                  <Phone className="size-3" /> {savedQuote.contactPhone}
                                </p>
                                {savedQuote.companyName && (
                                  <p className="mt-1 flex items-center gap-1.5 text-[#64748B]">
                                    <Building2 className="size-3" /> {savedQuote.companyName}
                                  </p>
                                )}
                                {savedQuote.documentNumber && (
                                  <p className="mt-1 flex items-center gap-1.5 text-[#64748B]">
                                    <FileText className="size-3" /> {documentLabel(savedQuote.documentType)}:{' '}
                                    {savedQuote.documentNumber}
                                  </p>
                                )}
                              </div>

                              {savedQuote.generalNotes && (
                                <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">
                                    Comentarios
                                  </p>
                                  <p className="mt-2 leading-5 text-[#475569]">{savedQuote.generalNotes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}

                {account.quotes.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllQuotes((value) => !value)}
                    className="mx-auto flex h-10 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 text-xs font-bold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                  >
                    {showAllQuotes ? 'Ver menos' : `Ver todas (${account.quotes.length})`}
                    <ChevronDown className={`size-3.5 transition-transform ${showAllQuotes ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            )}
          </section>
        )}
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
    <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
        {icon}
      </span>
      <p className="mt-5 text-base font-bold">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">{description}</p>
      <Link
        href="/productos"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
      >
        Ver productos <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}
