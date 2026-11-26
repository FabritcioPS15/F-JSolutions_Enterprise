import type { Metadata, Viewport } from 'next'
import { Fira_Sans } from 'next/font/google'
import { StoreFooter } from '@/components/store-footer'
import { StoreHeader } from '@/components/store-header'
import { products, getTaxonomyCategory } from '@/lib/catalog'
import { listBrands, listCategories } from '@/lib/catalog-query'
import './globals.css'

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-fira-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006'),
  title: 'SparkTree Store | Tienda Oficial de Hardware & Equipamiento TI',
  description:
    'Tienda oficial de SparkTree Group. Servidores, Laptops, Equipos de Red Cisco/MikroTik, Componentes y Licencias con garantía corporativa.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: 'white',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = listCategories().map(({ value, label, count }) => {
    const taxonomy = getTaxonomyCategory(value)
    return {
      value,
      label,
      count,
      subcategories:
        taxonomy?.subcategories.map((sub) => ({
          label: sub.label,
          types: sub.subSubcategories?.map((type) => type.label) ?? [],
        })) ?? [],
    }
  })

  const brandCounts = new Map<string, number>()
  for (const product of products) {
    brandCounts.set(product.brand, (brandCounts.get(product.brand) ?? 0) + 1)
  }
  const topBrands = listBrands()
    .sort((a, b) => (brandCounts.get(b) ?? 0) - (brandCounts.get(a) ?? 0))
    .slice(0, 10)

  return (
    <html lang="es" className={firaSans.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <StoreHeader categories={categories} brands={topBrands} />
        {children}
        <StoreFooter categories={categories} />
      </body>
    </html>
  )
}
