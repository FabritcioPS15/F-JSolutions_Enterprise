'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Heart,
  Link2,
  Mail,
  Minus,
  Plus,
  Share2,
} from 'lucide-react'
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaXTwitter } from 'react-icons/fa6'
import { EnhancedHeader } from '@/components/layout/enhanced-header'
import { QuotePanel } from '@/components/sections/quote-panel'
import { findProductBySlug, type Product } from '@/lib/catalog'
import { fetchStoreProductBySlug } from '@/lib/catalog-api'
import { useQuote } from '@/lib/use-quote'
import { useFavorites } from '@/lib/use-favorites'

type ProductDetailProps = {
  slug: string
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const staticProduct = findProductBySlug(slug)
  const [product, setProduct] = useState<Product | undefined>(staticProduct)
  const [loading, setLoading] = useState(!staticProduct)
  const quote = useQuote()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [added, setAdded] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const shareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  // El detalle local se muestra de inmediato; si el producto existe en la API,
  // su versión publicada reemplaza al dato estático.
  useEffect(() => {
    let active = true

    setProduct(staticProduct)
    setLoading(!staticProduct)

    fetchStoreProductBySlug(slug)
      .then((remote) => {
        if (!active || !remote) return
        setProduct(remote)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug, staticProduct])

  useEffect(() => {
    if (!shareOpen) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!shareRef.current?.contains(event.target as Node)) setShareOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShareOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shareOpen])

  if (!product) {
    return (
      <main className="min-h-screen bg-white text-[#0F172A]">
        <EnhancedHeader />
        <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-sm text-[#475569]">Cargando producto…</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Producto no encontrado</h1>
              <p className="mt-2 text-[#475569]">El producto que buscas no existe o ha sido eliminado.</p>
              <Link href="/productos" className="mt-4 inline-flex items-center gap-2 text-[#2563EB] hover:underline">
                <ChevronLeft className="size-4" /> Volver al catálogo
              </Link>
            </>
          )}
        </section>
      </main>
    )
  }

  const images = product.images || [product.image]

  const handleAddToQuote = () => {
    quote.addItem(product.id, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const toggleShare = () => {
    if (!shareOpen) {
      if (typeof window !== 'undefined') setShareUrl(window.location.href)
      setCopied(false)
    }
    setShareOpen((prev) => !prev)
  }

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `${product.name} | F&J Systems`,
        url: shareUrl,
      })
      setShareOpen(false)
    } catch {
      // El usuario canceló el diálogo nativo: no hay acción pendiente.
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(`${product.name} | F&J Systems`)
  const shareLinks = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      icon: FaWhatsapp,
      iconClass: 'text-[#25D366]',
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FaFacebookF,
      iconClass: 'text-[#1877F2]',
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: FaXTwitter,
      iconClass: 'text-[#0F172A]',
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: FaLinkedinIn,
      iconClass: 'text-[#0A66C2]',
    },
    {
      label: 'Correo',
      href: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
      icon: Mail,
      iconClass: 'text-[#64748B]',
    },
  ]

  const availabilityLabels = {
    available: 'Disponible',
    limited: 'Stock limitado',
    consult: 'Consultar disponibilidad',
  }

  const availabilityColors = {
    available: 'bg-[#14B8A6] text-white',
    limited: 'bg-[#F59E0B] text-white',
    consult: 'bg-[#64748B] text-white',
  }

  return (
    <main className="min-h-screen bg-white text-[#0F172A]">
      <EnhancedHeader quoteCount={quote.count} onQuoteClick={() => setShowQuote(true)} />

      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-[#475569] sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold hover:text-[#2563EB]">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/productos" className="font-semibold hover:text-[#2563EB]">
            Catálogo
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A]">{product.name}</span>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Galería */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9]">
              <img
                src={images[currentImageIndex]}
                alt={`${product.name} - vista ${currentImageIndex + 1}`}
                className="size-full object-contain p-8"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 shadow-lg transition hover:bg-white"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 shadow-lg transition hover:bg-white"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      currentImageIndex === index
                        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20'
                        : 'border-[#E2E8F0] hover:border-[#2563EB]/50'
                    }`}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <img src={image} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-[#475569]">
                <span className="font-medium">{product.brand}</span>
                <span>/</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{product.name}</h1>
              {(product.model || product.sku) && (
                <div className="mt-2 flex flex-wrap gap-4 font-mono text-sm text-[#64748B]">
                  {product.model && <span>Modelo: {product.model}</span>}
                  {product.sku && <span>SKU: {product.sku}</span>}
                </div>
              )}
            </div>

            <p className="text-base leading-7 text-[#475569]">{product.description}</p>

            {product.availability && (
              <div className="inline-flex">
                <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${availabilityColors[product.availability]}`}>
                  {availabilityLabels[product.availability]}
                </span>
              </div>
            )}

            {/* Especificaciones destacadas */}
            <div className="space-y-2">
              {product.specs.slice(0, 4).map((spec) => (
                <div key={spec} className="flex items-start gap-2 text-sm text-[#475569]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0E7490]/60" />
                  {spec}
                </div>
              ))}
            </div>

            {/* Selector de cantidad y botón de cotización */}
            <div className="space-y-4 border-t border-[#E2E8F0] pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">Cantidad:</span>
                <div className="flex items-center rounded-lg border border-[#E2E8F0]">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    aria-label="Reducir cantidad"
                    className="grid size-10 place-items-center text-[#475569] hover:text-[#2563EB] disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-12 text-center font-mono text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    aria-label="Aumentar cantidad"
                    className="grid size-10 place-items-center text-[#475569] hover:text-[#2563EB]"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToQuote}
                disabled={product.availability === 'consult'}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  added
                    ? 'bg-[#22D3EE] text-[#0B1120]'
                    : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:bg-[#64748B] disabled:cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="size-4" /> Agregado a cotización
                  </>
                ) : (
                  <>
                    <ClipboardList className="size-4" /> Agregar {quantity} a cotización
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                >
                  <Heart className={`size-4 ${isFavorite(product.id) ? 'fill-current text-[#6D28D9]' : ''}`} />
                  {isFavorite(product.id) ? 'Guardado' : 'Guardar'}
                </button>
                <div ref={shareRef} className="relative flex-1">
                  <button
                    type="button"
                    onClick={toggleShare}
                    aria-expanded={shareOpen}
                    aria-haspopup="menu"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB]/40 hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
                  >
                    <Share2 className="size-4" />
                    Compartir
                  </button>

                  {shareOpen && (
                    <div
                      role="menu"
                      aria-label="Opciones para compartir este producto"
                      className="absolute right-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.14)]"
                    >
                      <p className="border-b border-[#F1F5F9] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                        Compartir producto
                      </p>
                      <div className="p-1.5">
                        {canNativeShare && (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={handleNativeShare}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FAFC]"
                          >
                            <span className="grid size-8 place-items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#2563EB]">
                              <Share2 className="size-4" />
                            </span>
                            Compartir...
                          </button>
                        )}

                        {shareLinks.map((link) => {
                          const Icon = link.icon
                          const isExternal = link.href.startsWith('http')
                          return (
                            <a
                              key={link.label}
                              role="menuitem"
                              href={link.href}
                              target={isExternal ? '_blank' : undefined}
                              rel={isExternal ? 'noopener noreferrer' : undefined}
                              onClick={() => setShareOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FAFC]"
                            >
                              <span
                                className={`grid size-8 place-items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] ${link.iconClass}`}
                              >
                                <Icon className="size-4" aria-hidden="true" />
                              </span>
                              {link.label}
                            </a>
                          )
                        })}

                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleCopyLink}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FAFC]"
                        >
                          <span
                            className={`grid size-8 place-items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] ${
                              copied ? 'text-[#15803D]' : 'text-[#64748B]'
                            }`}
                          >
                            {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
                          </span>
                          {copied ? 'Enlace copiado' : 'Copiar enlace'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones técnicas */}
        {product.fullSpecs && product.fullSpecs.length > 0 && (
          <div className="mt-12 border-t border-[#E2E8F0] pt-8">
            <h2 className="text-2xl font-bold">Especificaciones técnicas</h2>
            <div className="mt-6 space-y-6">
              {product.fullSpecs.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-4 font-semibold text-[#0F172A]">{group.category}</h3>
                  <div className="space-y-2">
                    {group.specs.map((spec) => (
                      <div key={spec.label} className="flex items-baseline gap-3 border-b border-[#E2E8F0] pb-2">
                        <span className="w-1/3 text-xs text-[#64748B]">{spec.label}</span>
                        <span className="w-2/3 text-xs font-mono text-[#0F172A]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Descripción extendida */}
        <div className="mt-12 border-t border-[#E2E8F0] pt-8">
          <h2 className="text-2xl font-bold">Descripción del producto</h2>
          <div className="mt-4 space-y-4 text-xs leading-6 text-[#475569]">
            <p>
              {product.name} es una solución tecnológica diseñada para satisfacer las necesidades de usuarios profesionales y entusiastas. Este producto combina rendimiento, fiabilidad y diseño ergonómico para ofrecer una experiencia de uso excepcional.
            </p>
            <p>
              Fabricado por {product.brand}, cuenta con garantía de calidad y soporte técnico especializado. Ideal para uso en entornos de oficina, educativos o domésticos, proporcionando la versatilidad necesaria para adaptarse a diferentes escenarios de trabajo.
            </p>
            <p>
              Entre sus características destacadas se encuentran su diseño optimizado, eficiencia energética y compatibilidad con estándares industriales, lo que garantiza una integración fluida con otros equipos y sistemas de tu infraestructura tecnológica.
            </p>
          </div>
        </div>

        {/* Productos relacionados */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-12 border-t border-[#E2E8F0] pt-8">
            <h2 className="text-2xl font-bold">Productos relacionados</h2>
            <div className="mt-6">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline"
              >
                Ver productos similares <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {showQuote && (
        <QuotePanel
          items={quote.quote.items}
          count={quote.count}
          onClose={() => setShowQuote(false)}
          onAdd={quote.addItem}
          onRemove={quote.removeItem}
          onSetQty={quote.updateItemQuantity}
          onUpdateNotes={quote.updateItemNotes}
        />
      )}
    </main>
  )
}
