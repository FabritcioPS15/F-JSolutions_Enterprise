'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ClipboardList } from 'lucide-react'
import { useQuote } from '@/lib/use-quote'

export function AddToQuoteButton({
  productId,
  productName,
}: {
  productId: string
  productName: string
}) {
  const quote = useQuote()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    quote.addItem(productId)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Agregar ${productName} a la cotización`}
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
          added ? 'bg-[#10B981]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
        }`}
      >
        {added ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <ClipboardList className="size-4" aria-hidden="true" />
        )}
        {added ? 'Agregado a cotización' : 'Agregar a cotización'}
      </button>
      <Link
        href="/cotizacion"
        className="text-center text-[11px] font-semibold text-blue-ink hover:underline"
      >
        Ver mi cotización
        {quote.count > 0 ? ` (${quote.count})` : ''}
      </Link>
    </div>
  )
}
