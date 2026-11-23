import Link from 'next/link'
import {
  ArrowRight,
  ClipboardList,
  Cpu,
  HardDrive,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Network,
  Printer,
  Server,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { HomeHeroCarousel, type HeroSlide } from '@/components/home-hero-carousel'
import { ProductCard } from '@/components/product-card'
import { findProductBySlug, products } from '@/lib/catalog'
import { categoryLabel, listCategories, matchesCategory } from '@/lib/catalog-query'

const heroSlides: HeroSlide[] = [
  {
    eyebrow: 'Laptops corporativas y gaming',
    title: 'Renueva tus laptops con garantía oficial',
    description:
      'Lenovo, HP, Dell y ASUS en stock. Guarda tu modelo en la cotización y recibe el precio formal con disponibilidad.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop',
    imageAlt: 'Laptop gaming ASUS TUF F15',
    categoryHref: '/productos?categoria=Laptops',
    categoryLabel: 'Ver laptops',
    productHref: '/productos/asus-tuf-f15',
    productLabel: 'ASUS TUF F15',
    note: 'Envíos a todo el Perú',
  },
  {
    eyebrow: 'PC y servidores',
    title: 'Arma tu infraestructura desde cero',
    description:
      'Torres corporativas, servidores tower y mini PCs listos para desplegar en tu oficina o centro de datos.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop',
    imageAlt: 'Servidor tower Dell PowerEdge',
    categoryHref: '/productos?categoria=PC%20y%20Servidores',
    categoryLabel: 'Ver servidores y PCs',
    productHref: '/productos/pc-gamer-fj-ryzen-7',
    productLabel: 'PC Gamer SparkTree',
    note: 'Atención a empresas y particulares',
  },
  {
    eyebrow: 'Redes y conectividad',
    title: 'Wi-Fi 6 y switches para tu oficina',
    description:
      'Routers mesh, access points y switches gestionables de TP-Link y Ubiquiti para redes estables.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80&auto=format&fit=crop',
    imageAlt: 'Router Wi-Fi 6 TP-Link Archer',
    categoryHref: '/productos?categoria=Redes',
    categoryLabel: 'Ver redes',
    productHref: '/productos/tp-link-deco-x50-2pack',
    productLabel: 'Deco X50 Mesh',
    note: 'Asesoría de ingenieros',
  },
  {
    eyebrow: 'Impresión y escaneo',
    title: 'Impresoras de alto volumen para tu empresa',
    description:
      'Tanque de tinta, láser color y escáneres dúplex con soporte especializado y consumibles originales.',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=1200&q=80&auto=format&fit=crop',
    imageAlt: 'Impresora multifuncional HP Smart Tank',
    categoryHref: '/productos?categoria=Impresoras%20y%20Esc%C3%A1neres',
    categoryLabel: 'Ver impresoras',
    productHref: '/productos/hp-smart-tank-580',
    productLabel: 'HP Smart Tank 580',
    note: 'Garantía corporativa',
  },
]

const categoryTiles = [
  { value: 'PC y Servidores', icon: Server },
  { value: 'Laptops', icon: Laptop },
  { value: 'Componentes', icon: Cpu },
  { value: 'Monitores', icon: Monitor },
  { value: 'Redes', icon: Network },
  { value: 'Almacenamiento', icon: HardDrive },
  { value: 'Periféricos', icon: Keyboard },
  { value: 'Impresoras y Escáneres', icon: Printer },
] as const

const featuredSlugs = [
  'asus-tuf-f15',
  'pc-gamer-fj-ryzen-7',
  'hp-elitebook-840-g9',
  'monitor-samsung-odyssey-g5',
  'lg-27up550-4k',
  'hp-smart-tank-580',
  'tp-link-deco-x50-2pack',
  'synology-ds223j',
  'logitech-mx-master-3s',
  'hyperx-cloud-ii',
]

const productRails = [
  {
    title: 'Laptops y portátiles',
    subtitle: 'Corporativas, gaming y ultraligeras.',
    category: 'Laptops',
  },
  {
    title: 'PC y servidores',
    subtitle: 'Torres, servidores tower y mini PCs.',
    category: 'PC y Servidores',
  },
  {
    title: 'Componentes para tu PC',
    subtitle: 'Procesadores, tarjetas gráficas y placas madre.',
    category: 'Componentes',
  },
  {
    title: 'Redes y conectividad',
    subtitle: 'Wi-Fi 6, mesh, switches y access points.',
    category: 'Redes',
  },
  {
    title: 'Monitores',
    subtitle: 'Gaming, oficina y color profesional.',
    category: 'Monitores',
  },
  {
    title: 'Almacenamiento',
    subtitle: 'SSD NVMe, discos duros y NAS.',
    category: 'Almacenamiento',
  },
  {
    title: 'Periféricos',
    subtitle: 'Teclados, mouse y headsets.',
    category: 'Periféricos',
  },
  {
    title: 'Impresoras y escáneres',
    subtitle: 'Tinta continua, láser y digitalización.',
    category: 'Impresoras y Escáneres',
  },
]

const benefits = [
  { icon: ShieldCheck, title: 'Garantía corporativa', text: 'Equipos 100% originales' },
  { icon: Truck, title: 'Envíos a todo el Perú', text: 'Entrega rápida y segura' },
  { icon: Headphones, title: 'Soporte especializado', text: 'Asesoría de ingenieros' },
  { icon: ClipboardList, title: 'Cotización en línea', text: 'Arma tu lista y envíala' },
]

function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = 'Ver todo',
}: {
  title: string
  subtitle?: string
  href: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="font-heading text-xl font-black text-foreground sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <Link href={href} className="shrink-0 text-[11px] font-bold text-blue-ink hover:underline">
        {linkLabel}
      </Link>
    </div>
  )
}

export default function StoreHomePage() {
  const categoryCounts = new Map(listCategories().map((category) => [category.value, category.count]))
  const featured = featuredSlugs.flatMap((slug) => {
    const product = findProductBySlug(slug)
    return product ? [product] : []
  })
  const limited = products.filter((product) => product.availability === 'limited')
  const rails = productRails.map((rail) => ({
    ...rail,
    items: products.filter((product) => matchesCategory(product, rail.category)),
    href: `/productos?categoria=${encodeURIComponent(rail.category)}`,
  }))

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
      <section className="pt-6">
        <HomeHeroCarousel slides={heroSlides} />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint-blue text-blue-ink">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">{title}</p>
                <p className="text-[11px] text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 space-y-12 sm:mt-12 lg:space-y-16">
        <section aria-labelledby="home-categorias">
          <h2
            id="home-categorias"
            className="font-heading text-xl font-black text-foreground sm:text-2xl"
          >
            Compra por categoría
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
            {categoryTiles.map(({ value, icon: Icon }) => {
              const count = categoryCounts.get(value) ?? 0
              return (
                <Link
                  key={value}
                  href={`/productos?categoria=${encodeURIComponent(value)}`}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-3 py-4 text-center transition hover:border-[#2563EB]/40 hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35)]"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-tint-blue text-blue-ink transition group-hover:bg-[#2563EB] group-hover:text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold leading-tight text-foreground">
                    {categoryLabel(value)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {count} {count === 1 ? 'producto' : 'productos'}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {limited.length > 0 && (
          <section aria-labelledby="home-stock-limitado">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2
                  id="home-stock-limitado"
                  className="font-heading text-xl font-black text-foreground sm:text-2xl"
                >
                  Stock limitado
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Unidades limitadas: asegura tu equipo con una cotización.
                </p>
              </div>
              <Link href="/productos" className="shrink-0 text-[11px] font-bold text-blue-ink hover:underline">
                Ver toda la tienda
              </Link>
            </div>
            <div className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:gap-4 sm:px-0">
              {limited.map((product) => (
                <div key={product.id} className="w-[210px] shrink-0 snap-start sm:w-[230px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="home-destacados">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2
                id="home-destacados"
                className="font-heading text-xl font-black text-foreground sm:text-2xl"
              >
                Destacados de la tienda
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Selección de equipos para trabajo, gaming y oficina.
              </p>
            </div>
            <Link href="/productos" className="shrink-0 text-[11px] font-bold text-blue-ink hover:underline">
              Ver todo
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {rails.map((rail) => (
          <section key={rail.category} aria-labelledby={`home-${rail.category.replace(/\s+/g, '-').toLowerCase()}`}>
            <SectionHeader
              title={rail.title}
              subtitle={rail.subtitle}
              href={rail.href}
              linkLabel="Ver categoría"
            />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {rail.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}

        <section className="overflow-hidden rounded-3xl bg-[#172554] px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#93C5FD]">
                Compra corporativa
              </p>
              <h2 className="mt-2 max-w-lg font-heading text-2xl font-black text-white sm:text-3xl">
                Arma tu lista de equipos y recibe una cotización formal
              </h2>
              <p className="mt-2 max-w-xl text-sm text-blue-100/80">
                Laptops, servidores, redes e impresoras. Guarda productos en tu cotización y envíala
                en línea; te respondemos con disponibilidad y precio.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/cotizacion"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-bold text-[#172554] transition hover:bg-[#D97706]"
              >
                Armar cotización
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
              >
                Ver toda la tienda
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
