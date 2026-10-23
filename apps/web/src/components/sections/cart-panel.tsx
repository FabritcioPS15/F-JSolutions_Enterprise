'use client'

import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingCart, Trash2, Truck, X } from 'lucide-react'
import { formatPrice } from '@/lib/catalog'
import type { CartLine } from '@/lib/use-cart'

type CartPanelProps = {
  lines: CartLine[]
  count: number
  subtotal: number
  onClose: () => void
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  onSetQty: (id: string, qty: number) => void
}

export function CartPanel({
  lines,
  count,
  subtotal,
  onClose,
  onAdd,
  onRemove,
  onSetQty,
}: CartPanelProps) {
  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <aside
        onClick={(event) => event.stopPropagation()}
        aria-label="Carrito de compras"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">Tu carrito</h2>
            <p className="text-xs text-[#475569]">
              {count === 0 ? 'Sin productos por ahora' : `${count} producto(s) seleccionado(s)`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="grid size-9 place-items-center rounded-full text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#0F172A]"
          >
            <X className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
              <ShoppingCart className="size-7" />
            </span>
            <p className="mt-5 text-base font-bold text-[#0F172A]">Tu carrito está vacío</p>
            <p className="mt-2 text-sm leading-6 text-[#475569]">
              Explora nuestro catálogo y agrega los equipos que necesitas para tu hogar u oficina.
            </p>
            <a
              href="/productos"
              onClick={onClose}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              Ver catálogo <ArrowRight className="size-4" />
            </a>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {lines.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-[#E2E8F0] p-3"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#2563EB]">
                      {product.brand}
                    </p>
                    <p className="line-clamp-2 text-xs font-bold leading-4 text-[#0F172A]">
                      {product.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0]">
                        <button
                          onClick={() => onSetQty(product.id, qty - 1)}
                          aria-label={`Quitar una unidad de ${product.name}`}
                          className="grid size-7 place-items-center text-[#475569] hover:text-[#2563EB]"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-medium">{qty}</span>
                        <button
                          onClick={() => onAdd(product.id)}
                          aria-label={`Agregar una unidad de ${product.name}`}
                          className="grid size-7 place-items-center text-[#475569] hover:text-[#2563EB]"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#0F172A]">
                          {formatPrice(product.price * qty)}
                        </p>
                        <button
                          onClick={() => onRemove(product.id)}
                          aria-label={`Eliminar ${product.name}`}
                          className="text-[#475569] transition hover:text-[#0E7490]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-5">
              <div className="flex items-center justify-between text-sm text-[#475569]">
                <span>Subtotal</span>
                <span className="font-medium text-[#0F172A]">{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-[#475569]">
                <span>Envío</span>
                <span className="font-semibold text-[#0E7490]">Calculado al cotizar</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#E2E8F0] pt-3">
                <span className="text-sm font-bold text-[#0F172A]">Total</span>
                <span className="text-xl font-semibold text-[#0F172A]">{formatPrice(subtotal)}</span>
              </div>
              <a
                href="/cotizador"
                onClick={onClose}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Solicitar cotización <ArrowRight className="size-4" />
              </a>
              <button
                onClick={onClose}
                className="mt-2 h-10 w-full rounded-lg text-xs font-bold text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              >
                Seguir comprando
              </button>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-[#475569]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-[#2563EB]" /> Compra segura
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="size-3.5 text-[#2563EB]" /> Envío a todo el Perú
                </span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

