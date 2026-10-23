'use client'

import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import type { QuoteItem } from '@/lib/quote'

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
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">Tu cotización</h2>
            <p className="text-xs text-[#475569]">
              {count === 0 ? 'Sin productos por ahora' : `${count} producto(s) seleccionado(s)`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar cotización"
            className="grid size-9 place-items-center rounded-full text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#0F172A]"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
              <ShoppingCart className="size-7" />
            </span>
            <p className="mt-5 text-base font-bold text-[#0F172A]">Tu cotización está vacía</p>
            <p className="mt-2 text-sm leading-6 text-[#475569]">
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
                <div key={item.productId} className="flex gap-3 rounded-xl border border-[#E2E8F0] p-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="size-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#2563EB]">
                      {item.productModel || item.productSku || ''}
                    </p>
                    <p className="line-clamp-2 text-xs font-bold leading-4 text-[#0F172A]">
                      {item.productName}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0]">
                        <button
                          onClick={() => onSetQty(item.productId, item.quantity - 1)}
                          aria-label={`Quitar una unidad de ${item.productName}`}
                          className="grid size-7 place-items-center text-[#475569] hover:text-[#2563EB]"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onAdd(item.productId)}
                          aria-label={`Agregar una unidad de ${item.productName}`}
                          className="grid size-7 place-items-center text-[#475569] hover:text-[#2563EB]"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.productId)}
                        aria-label={`Eliminar ${item.productName}`}
                        className="text-[#475569] transition hover:text-[#0E7490]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-5">
              <Link
                href="/cotizacion"
                onClick={onClose}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Completar cotización <ArrowRight className="size-4" />
              </Link>
              <button
                onClick={onClose}
                className="mt-2 h-10 w-full rounded-lg text-xs font-bold text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#0F172A]"
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
