import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  Check,
  Database,
  HardDrive,
  Headset,
  Network,
  Server,
  ShieldCheck,
  Wifi,
} from 'lucide-react'

const CONTAINER = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'

const TRUST_ITEMS = [
  'Diagnóstico técnico sin costo',
  'Soporte remoto y en sitio',
  'Atención en Lima y todo el Perú',
]

const operationRows = [
  { icon: Server, label: 'Servidores', detail: 'Nodos y respaldos', state: 'Operativo' },
  { icon: Wifi, label: 'Redes', detail: 'Wi-Fi y switches', state: 'Monitoreado' },
  { icon: Headset, label: 'Soporte', detail: 'Mesa de ayuda', state: 'En línea' },
]

export function ExecutiveHero() {
  return (
    <section id="inicio" className="hero-viewport relative isolate overflow-hidden bg-[#0A1C2E] text-white">
      {/* Fondo: degradado, retícula y halos de marca */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_8%,#12466F_0%,#0C2740_46%,#0A1C2E_100%)]" />
        <div className="hero-grid absolute inset-x-0 top-0 h-[520px] opacity-40" />
        <div className="absolute -right-40 -top-40 size-[620px] rounded-full bg-[#1769AA]/25 blur-[130px]" />
        <div className="absolute -left-32 top-1/3 size-[360px] rounded-full bg-[#00B8D9]/10 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A1C2E] to-transparent" />
      </div>

      <div className={`${CONTAINER} flex flex-1 items-center py-10 sm:py-14 lg:py-16`}>
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10 xl:gap-16">
          {/* Columna izquierda */}
          <div className="min-w-0 max-w-[700px]">


            <h1 className="hero-reveal hero-delay-1 mt-5 max-w-[19ch] text-balance font-heading text-[clamp(2.4rem,1.3rem+3.2vw,4.2rem)] font-bold leading-[1.04] tracking-[-0.04em] text-white">
              Impulsamos tu empresa con{' '}
              <span className="bg-gradient-to-r from-[#75D7E8] via-[#38CBE4] to-[#00B8D9] bg-clip-text text-transparent">
                tecnología inteligente.
              </span>
            </h1>

            <p className="hero-reveal hero-delay-2 mt-5 max-w-[56ch] text-[clamp(0.98rem,0.94rem+0.3vw,1.14rem)] leading-[1.7] text-[#B9CBDA]">
              Diseñamos, implementamos y gestionamos soluciones tecnológicas que conectan, protegen y potencian
              las operaciones de tu negocio.
            </p>

            <div className="hero-reveal hero-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/contacto"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1769AA] to-[#0F86B8] px-6 text-sm font-bold text-white shadow-[0_18px_38px_-18px_rgba(0,184,217,0.65)] transition duration-300 hover:-translate-y-0.5 hover:from-[#12568C] hover:to-[#00A9C7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75D7E8]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1C2E] motion-reduce:transition-none sm:w-auto"
              >
                Solicitar asesoría
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/#soluciones"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/[0.05] px-6 text-sm font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1C2E] motion-reduce:transition-none sm:w-auto"
              >
                Explorar soluciones
                <ArrowRight aria-hidden="true" className="size-4 text-[#75D7E8] transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <ul className="hero-reveal hero-delay-4 mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[12px] font-medium text-[#9FB3C8]">
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#00B8D9]/15 text-[#75D7E8]">
                    <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Columna derecha: composición de infraestructura */}
          <div className="hero-reveal hero-delay-2 relative min-w-0">
            <HeroInfrastructureVisual />
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroInfrastructureVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] pt-6 sm:pt-10 lg:max-w-none">
      {/* Conexiones y nodos detrás del panel */}
      <svg
        viewBox="0 0 560 520"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full text-[#75D7E8]"
      >
        <defs>
          <radialGradient id="hero-node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00B8D9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00B8D9" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M64 96 C 150 70, 250 60, 336 92" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.4" className="hero-dash" />
        <path d="M56 300 C 130 296, 190 250, 268 232" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.4" className="hero-dash" />
        <path d="M498 148 C 448 190, 430 228, 428 268" stroke="currentColor" strokeOpacity="0.24" strokeWidth="1.4" className="hero-dash" />
        <path d="M500 402 C 452 396, 420 380, 396 352" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.4" className="hero-dash" />
        <circle cx="64" cy="96" r="20" fill="url(#hero-node-glow)" className="hero-pulse" />
        <circle cx="64" cy="96" r="3.5" fill="#75D7E8" />
        <circle cx="56" cy="300" r="16" fill="url(#hero-node-glow)" className="hero-pulse" />
        <circle cx="56" cy="300" r="3" fill="#75D7E8" />
        <circle cx="500" cy="402" r="18" fill="url(#hero-node-glow)" className="hero-pulse" />
        <circle cx="500" cy="402" r="3" fill="#75D7E8" />
        <circle cx="498" cy="148" r="12" fill="url(#hero-node-glow)" className="hero-pulse" />
        <circle cx="498" cy="148" r="2.5" fill="#75D7E8" />
      </svg>

      <div className="relative [transform:perspective(1400px)_rotateY(-4deg)_rotateX(1.5deg)] motion-reduce:[transform:none]">
        {/* Panel principal */}
        <div className="hero-float-soft relative overflow-hidden rounded-[22px] border border-white/12 bg-[#0E263C]/85 text-white shadow-[0_50px_120px_-40px_rgba(2,10,20,0.9)] ring-1 ring-inset ring-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1769AA] to-[#0F86B8] text-white shadow-[0_8px_20px_-10px_rgba(0,184,217,0.8)]">
                <Activity aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-bold leading-4 text-white">Panel de operación</p>
                <p className="truncate text-[10px] leading-4 text-[#8FA6BA]">Infraestructura y soporte SparkTree</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#00B8D9]/30 bg-[#00B8D9]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#75D7E8]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2DD4BF] hero-pulse" />
              En línea
            </span>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Server, label: 'Servidores', value: 'Nodos' },
                { icon: Network, label: 'Redes', value: 'Sedes' },
                { icon: ShieldCheck, label: 'Seguridad', value: 'Perímetro' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2.5">
                  <item.icon aria-hidden="true" className="size-3.5 text-[#75D7E8]" />
                  <p className="mt-1.5 truncate text-[10px] font-bold text-white">{item.label}</p>
                  <p className="truncate text-[9px] text-[#8FA6BA]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-[#0A1C2E]/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10.5px] font-bold text-white">Actividad de la red</p>
                <span className="font-mono text-[9px] text-[#8FA6BA]">Vista de referencia</span>
              </div>
              <svg viewBox="0 0 320 84" className="mt-2 h-[70px] w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="exec-hero-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00B8D9" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#00B8D9" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[16, 38, 60].map((y) => (
                  <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#1C3A54" strokeWidth="1" strokeDasharray="3 5" />
                ))}
                <path
                  d="M0 62 C 18 60, 30 54, 44 56 S 68 44, 84 46 S 110 36, 128 40 S 154 30, 172 33 S 198 39, 216 31 S 244 18, 262 24 S 292 16, 320 20 L320 84 L0 84 Z"
                  fill="url(#exec-hero-area)"
                />
                <path
                  d="M0 62 C 18 60, 30 54, 44 56 S 68 44, 84 46 S 110 36, 128 40 S 154 30, 172 33 S 198 39, 216 31 S 244 18, 262 24 S 292 16, 320 20"
                  fill="none"
                  stroke="#38CBE4"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="hero-draw"
                />
                <circle cx="320" cy="20" r="4" fill="#75D7E8" className="hero-pulse" />
              </svg>
            </div>

            <div className="mt-3 space-y-1.5">
              {operationRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#00B8D9]/12 text-[#75D7E8]">
                    <row.icon aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold leading-4 text-white">{row.label}</span>
                    <span className="block truncate text-[8.5px] leading-3 text-[#8FA6BA]">{row.detail}</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#2DD4BF]/10 px-2 py-0.5 text-[8px] font-bold text-[#5EEAD4]">
                    <span aria-hidden="true" className="size-1 rounded-full bg-[#2DD4BF]" />
                    {row.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rack de servidores */}
        <div className="hero-float absolute -bottom-10 -right-3 hidden w-[168px] rounded-2xl border border-white/12 bg-[#0E263C]/95 p-3 text-white shadow-[0_30px_60px_-30px_rgba(2,10,20,0.9)] backdrop-blur-xl sm:block lg:-right-5">
          <div className="flex items-center gap-1.5">
            <HardDrive aria-hidden="true" className="size-3.5 text-[#75D7E8]" />
            <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#8FA6BA]">Servidores</p>
          </div>
          <div className="mt-2 space-y-1.5">
            {['Nodo primario', 'Nodo réplica', 'Almacenamiento'].map((label, index) => (
              <div key={label} className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5">
                <span className={`size-1.5 shrink-0 rounded-full ${index === 2 ? 'bg-[#75D7E8]' : 'bg-[#2DD4BF]'}`} />
                <span className="truncate text-[8.5px] font-semibold text-white">{label}</span>
                <span className="ml-auto font-mono text-[7.5px] text-[#5F7A90]">{index === 2 ? 'SYNC' : 'OK'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta flotante inferior */}
        <div className="hero-float absolute -bottom-8 -left-3 hidden items-center gap-2 rounded-xl border border-white/12 bg-[#0E263C]/95 px-2.5 py-2 text-white shadow-[0_22px_44px_-24px_rgba(2,10,20,0.9)] backdrop-blur-xl sm:flex lg:-left-5">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#00B8D9]/12 text-[#75D7E8]">
            <Database aria-hidden="true" className="size-3.5" />
          </span>
          <span>
            <span className="block text-[9.5px] font-bold leading-3.5">Respaldos</span>
            <span className="block text-[8px] leading-3.5 text-[#8FA6BA]">Verificación programada</span>
          </span>
        </div>
      </div>
    </div>
  )
}
