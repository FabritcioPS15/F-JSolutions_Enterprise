'use client'

import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import type { QuoteItem } from '@/lib/quote'
import { QuantityInput } from '@/components/ui/quantity-input'

type QuotePanelProps = {
  items: QuoteItem[]
  count: number
  onClose: () => void
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  onSetQty: (id: string, qty: number) => void
  onUpdateNotes: (id: string, notes: string) => void
}

export function QuotePanel({
  items,
  count,
  onClose,
  onAdd,
  onRemove,
  onSetQty,
  onUpdateNotes,
}: QuotePanelProps) {
  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <aside
        onClick={(event) => event.stopPropagation()}
        aria-label="Panel de cotización"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Tu cotización</h2>
            <p className="text-xs text-muted-foreground">
              {count === 0 ? 'Sin productos por ahora' : `${count} producto(s) seleccionado(s)`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar cotización"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-[#2563EB]/10 text-blue-ink">
              <ShoppingCart className="size-7" />
            </span>
            <p className="mt-5 text-base font-bold text-foreground">Tu cotización está vacía</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Explora nuestro catálogo y agrega los equipos que necesitas para tu hogar u oficina.
            </p>
            <Link
              href="/productos"
              onClick={onClose}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              Ver catálogo <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 rounded-xl border border-border p-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="size-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-blue-ink">
                      {item.productModel || item.productSku || ''}
                    </p>
                    <p className="line-clamp-2 text-xs font-bold leading-4 text-foreground">
                      {item.productName}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 rounded-lg border border-border">
                        <button
                          onClick={() => onSetQty(item.productId, item.quantity - 1)}
                          aria-label={`Quitar una unidad de ${item.productName}`}
                          className="grid size-7 place-items-center text-muted-foreground hover:text-blue-ink"
                        >
                          <Minus className="size-3" />
                        </button>
                        <QuantityInput
                          value={item.quantity}
                          onChange={(qty) => onSetQty(item.productId, qty)}
                          ariaLabel={`Cantidad de ${item.productName}`}
                          className="h-7 w-9 rounded-md text-xs font-semibold text-foreground focus:bg-tint-blue"
                        />
                        <button
                          onClick={() => onAdd(item.productId)}
                          aria-label={`Agregar una unidad de ${item.productName}`}
                          className="grid size-7 place-items-center text-muted-foreground hover:text-blue-ink"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.productId)}
                        aria-label={`Eliminar ${item.productName}`}
                        className="text-muted-foreground transition hover:text-brand-ink"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border bg-muted px-6 py-5">
              <Link
                href="/cotizacion"
                onClick={onClose}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Completar cotización <ArrowRight className="size-4" />
              </Link>
              <button
                onClick={onClose}
                className="mt-2 h-10 w-full rounded-lg text-xs font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Seguir explorando
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
