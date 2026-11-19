import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  BadgeCheck,
  FileText,
  MessageCircle,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { findProductBySlug, products } from '@/lib/catalog'
import { formatPrice } from '@/lib/catalog-query'
import { corporateUrl } from '@/lib/store-nav'

const availabilityLabels = {
  available: 'Disponible',
  limited: 'Stock limitado',
  consult: 'A consultar',
} as const

const availabilityStyles = {
  available: 'bg-tint-green text-success-ink ring-emerald-500/25',
  limited: 'bg-tint-amber text-warning-ink ring-amber-500/25',
  consult: 'bg-muted text-muted-foreground ring-border',
} as const

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = findProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado | SparkTree Store' }

  return {
    title: `${product.name} | SparkTree Store`,
    description: product.description,
  }
}

export default async function StoreProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = findProductBySlug(slug)
  if (!product) notFound()

  const price = formatPrice(product.price)
  const images = product.images?.length ? product.images : [product.image]
  const availability = product.availability ?? 'consult'
  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4)
  const quoteMessage = encodeURIComponent(
    `Hola SparkTree Group, quiero cotizar: ${product.name}${product.sku ? ` (SKU ${product.sku})` : ''}.`
  )

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground"
      >
        <Link href="/" className="transition hover:text-foreground">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/productos" className="transition hover:text-foreground">
          Tienda
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[0]} alt={product.name} className="aspect-[4/3] w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((image) => (
                <div key={image} className="overflow-hidden rounded-xl border border-border bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={product.name} loading="lazy" className="aspect-square w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Link
            href={`/productos?categoria=${encodeURIComponent(product.category)}`}
            className="inline-flex items-center gap-1 rounded-full border border-[#2563EB]/20 bg-tint-blue px-2.5 py-1 text-[10.5px] font-bold text-blue-ink transition hover:border-[#2563EB]/40"
          >
            {product.category}
          </Link>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {product.brand}
            {product.model ? ` · ${product.model}` : ''}
          </p>
          <h1 className="mt-1.5 font-heading text-2xl font-black leading-tight text-foreground sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span
              className={`rounded-full px-2.5 py-1 ring-1 ring-inset ${availabilityStyles[availability]}`}
            >
              {availabilityLabels[availability]}
            </span>
            {product.sku && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                SKU {product.sku}
              </span>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Precio
            </p>
            <p className="mt-1 text-2xl font-black text-foreground">{price ?? 'Cotizar precio'}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Precio referencial en soles, sujeto a stock y cotización formal.
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={`https://wa.me/51923055963?text=${quoteMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Cotizar por WhatsApp
              </a>
              <a
                href={corporateUrl('/cotizacion')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground transition hover:border-[#2563EB]/40 hover:text-blue-ink"
              >
                Formulario de cotización
              </a>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <span className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-[11px] font-semibold text-muted-foreground">
              <ShieldCheck className="size-4 text-success-ink" aria-hidden="true" />
              Garantía oficial
            </span>
            <span className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-[11px] font-semibold text-muted-foreground">
              <Truck className="size-4 text-blue-ink" aria-hidden="true" />
              Envíos a Perú
            </span>
            <span className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-[11px] font-semibold text-muted-foreground">
              <BadgeCheck className="size-4 text-sky-ink" aria-hidden="true" />
              Asesoría técnica
            </span>
          </div>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-muted-foreground">
            Especificaciones
          </h2>
          {product.fullSpecs?.length ? (
            <div className="mt-4 space-y-4">
              {product.fullSpecs.map((group) => (
                <div key={group.category}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-ink">
                    {group.category}
                  </p>
                  <dl className="mt-2 divide-y divide-border">
                    {group.specs.map((spec) => (
                      <div key={`${group.category}-${spec.label}`} className="flex justify-between gap-4 py-1.5 text-xs">
                        <dt className="text-muted-foreground">{spec.label}</dt>
                        <dd className="text-right font-semibold text-foreground">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-4 list-disc space-y-1.5 pl-4 text-xs text-muted-foreground">
              {product.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          {product.documents?.length ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-muted-foreground">
                Documentos
              </h2>
              <ul className="mt-3 space-y-2">
                {product.documents.map((document) => (
                  <li key={document.url}>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground transition hover:text-blue-ink"
                    >
                      <FileText className="size-3.5" aria-hidden="true" />
                      {document.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.faq?.length ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-muted-foreground">
                Preguntas frecuentes
              </h2>
              <dl className="mt-3 space-y-3">
                {product.faq.map((entry) => (
                  <div key={entry.question}>
                    <dt className="text-xs font-bold text-foreground">{entry.question}</dt>
                    <dd className="mt-0.5 text-xs text-muted-foreground">{entry.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-heading text-xl font-black text-foreground">Productos relacionados</h2>
            <Link
              href={`/productos?categoria=${encodeURIComponent(product.category)}`}
              className="text-[11px] font-bold text-blue-ink hover:underline"
            >
              Ver categoría
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      <Link
        href="/productos"
        className="mt-10 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Volver a la tienda
      </Link>
    </main>
  )
}
