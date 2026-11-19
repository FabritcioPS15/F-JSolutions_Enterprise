import { redirect } from 'next/navigation'

const storeAppUrl = process.env.NEXT_PUBLIC_STORE_APP_URL ?? 'http://localhost:3006'

export default function CotizadorPage() {
  redirect(`${storeAppUrl}/cotizacion`)
}
