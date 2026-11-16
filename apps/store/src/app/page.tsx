import Link from 'next/link'
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react'

export default function StoreHomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5B21B6] to-[#7C3AED] text-white">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <span className="font-heading font-black text-lg text-white">
                F&J <span className="text-[#A78BFA]">STORE</span>
              </span>
              <p className="text-[10px] text-slate-400">Hardware & Equipamiento TI</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://fjsolutions.com.pe"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Ir a Corporativo
            </a>
          </div>
        </div>
      </header>

      {/* Hero Store */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#5B21B6]/50 bg-[#1E1B4B]/60 px-4 py-1.5 text-xs font-semibold text-[#DDD6FE]">
          <Sparkles className="size-3.5 text-amber-400" />
          <span>F&J Store · Tienda Especializada en Hardware</span>
        </div>

        <h1 className="mt-6 font-heading text-4xl sm:text-5xl font-black text-white max-w-3xl leading-tight">
          Equipamiento y Tecnología Empresarial con Garantía Oficial
        </h1>

        <p className="mt-4 text-sm text-slate-400 max-w-xl">
          Estructura dedicada exclusivamente al catálogo, stock en tiempo real, pedidos y compras
          de hardware para clientes particulares y empresas.
        </p>

        {/* Benefits bar */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-left">
            <ShieldCheck className="size-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Garantía Corporativa</p>
              <p className="text-[11px] text-slate-400">Equipos 100% originales</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-left">
            <Truck className="size-6 text-[#A78BFA] shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Envíos a Todo el Perú</p>
              <p className="text-[11px] text-slate-400">Entrega rápida y segura</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-left">
            <Headphones className="size-6 text-sky-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Soporte Especializado</p>
              <p className="text-[11px] text-slate-400">Asesoría de ingenieros</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} F&J Store · F&J Solutions Enterprise
      </footer>
    </div>
  )
}
