'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
import { ProductCard } from '@/components/cards/product-card'
import { findProductBySlug, products as staticProducts, type Product } from '@/lib/catalog'
import { fetchStoreProductBySlug, fetchStoreProducts } from '@/lib/catalog-api'
import { resolveRelatedProducts } from '@/lib/related-products'
import { useQuote } from '@/lib/use-quote'
import { useFavorites } from '@/lib/use-favorites'

type ProductDetailProps = {
  slug: string
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const staticProduct = findProductBySlug(slug)
  const [product, setProduct] = useState<Product | undefined>(staticProduct)
  const [catalog, setCatalog] = useState<Product[]>(staticProducts)
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

  // Los productos publicados amplían el catálogo local para calcular sugerencias.
  useEffect(() => {
    let active = true

    fetchStoreProducts()
      .then((items) => {
        if (active && items.length > 0) setCatalog(items)
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  const relatedProducts = useMemo(
    () => (product ? resolveRelatedProducts(product, catalog) : []),
    [product, catalog]
  )

  if (!product) {
    return (
      <main className="min-h-screen bg-card text-foreground">
        <EnhancedHeader />
        <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando producto…</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Producto no encontrado</h1>
              <p className="mt-2 text-muted-foreground">El producto que buscas no existe o ha sido eliminado.</p>
              <Link href="/productos" className="mt-4 inline-flex items-center gap-2 text-blue-ink hover:underline">
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
      iconClass: 'text-foreground',
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
      iconClass: 'text-muted-foreground',
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
    <main className="min-h-screen bg-card text-foreground">
      <EnhancedHeader quoteCount={quote.count} onQuoteClick={() => setShowQuote(true)} />

      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold hover:text-blue-ink">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/productos" className="font-semibold hover:text-blue-ink">
            Catálogo
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">{product.name}</span>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Galería */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={images[currentImageIndex]}
                alt={`${product.name} - vista ${currentImageIndex + 1}`}
                className="size-full object-contain p-8"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-card/90 shadow-lg transition hover:bg-card"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-card/90 shadow-lg transition hover:bg-card"
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
                        : 'border-border hover:border-[#2563EB]/50'
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
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{product.brand}</span>
                <span>/</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{product.name}</h1>
              {(product.model || product.sku) && (
                <div className="mt-2 flex flex-wrap gap-4 font-mono text-sm text-muted-foreground">
                  {product.model && <span>Modelo: {product.model}</span>}
                  {product.sku && <span>SKU: {product.sku}</span>}
                </div>
              )}
            </div>

            <p className="text-base leading-7 text-muted-foreground">{product.description}</p>

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
                <div key={spec} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0E7490]/60" />
                  {spec}
                </div>
              ))}
            </div>

            {/* Selector de cantidad y botón de cotización */}
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">Cantidad:</span>
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    aria-label="Reducir cantidad"
                    className="grid size-10 place-items-center text-muted-foreground hover:text-blue-ink disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-12 text-center font-mono text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    aria-label="Aumentar cantidad"
                    className="grid size-10 place-items-center text-muted-foreground hover:text-blue-ink"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToQuote}
                disabled={product.availability === 'consult'}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  added
                    ? 'bg-[#22D3EE] text-[#0B1220]'
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
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink"
                >
                  <Heart className={`size-4 ${isFavorite(product.id) ? 'fill-current text-brand-ink' : ''}`} />
                  {isFavorite(product.id) ? 'Guardado' : 'Guardar'}
                </button>
                <div ref={shareRef} className="relative flex-1">
                  <button
                    type="button"
                    onClick={toggleShare}
                    aria-expanded={shareOpen}
                    aria-haspopup="menu"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
                  >
                    <Share2 className="size-4" />
                    Compartir
                  </button>

                  {shareOpen && (
                    <div
                      role="menu"
                      aria-label="Opciones para compartir este producto"
                      className="absolute right-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.14)]"
                    >
                      <p className="border-b border-border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Compartir producto
                      </p>
                      <div className="p-1.5">
                        {canNativeShare && (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={handleNativeShare}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                          >
                            <span className="grid size-8 place-items-center rounded-lg border border-border bg-muted text-blue-ink">
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
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                            >
                              <span
                                className={`grid size-8 place-items-center rounded-lg border border-border bg-muted ${link.iconClass}`}
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
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                        >
                          <span
                            className={`grid size-8 place-items-center rounded-lg border border-border bg-muted ${
                              copied ? 'text-success' : 'text-muted-foreground'
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
          <div className="mt-12 border-t border-border pt-8">
            <h2 className="text-2xl font-bold">Especificaciones técnicas</h2>
            <div className="mt-6 space-y-6">
              {product.fullSpecs.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-4 font-semibold text-foreground">{group.category}</h3>
                  <div className="space-y-2">
                    {group.specs.map((spec) => (
                      <div key={spec.label} className="flex items-baseline gap-3 border-b border-border pb-2">
                        <span className="w-1/3 text-xs text-muted-foreground">{spec.label}</span>
                        <span className="w-2/3 text-xs font-mono text-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Descripción extendida */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-bold">Descripción del producto</h2>
          <div className="mt-4 space-y-4 text-xs leading-6 text-muted-foreground">
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
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Productos relacionados</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Equipos y accesorios que suelen elegirse junto a este producto.
                </p>
              </div>
              <Link
                href={`/productos?categoria=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-ink hover:underline"
              >
                Ver todos <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <div
                  key={related.id}
                  className="w-[78%] shrink-0 snap-start sm:w-auto"
                >
                  <ProductCard product={related} onAddToQuote={quote.addItem} />
                </div>
              ))}
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
