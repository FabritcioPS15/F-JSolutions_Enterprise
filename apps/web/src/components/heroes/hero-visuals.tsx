import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Cloud,
  Database,
  FileText,
  Headset,
  Laptop,
  Layers,
  Monitor,
  Network,
  Router,
  Server,
  ShieldCheck,
  Sparkles,
  Wifi,
  Workflow,
} from 'lucide-react'
import { HeroFloatingNote, HeroPanel } from '@/components/heroes/hero-primitives'

/* ─── A · Consola de operación ─────────────────────────────────────────────── */

const operationRows = [
  { label: 'Servidores', detail: 'Nodos y respaldos', status: 'Activo', tone: 'green' },
  { label: 'Redes', detail: 'Wi-Fi y switches', status: 'Activo', tone: 'green' },
  { label: 'Soporte', detail: 'Mesa de ayuda', status: '4 abiertos', tone: 'blue' },
] as const

export function OpsConsoleVisual() {
  return (
    <div className="relative pt-4">
      <HeroPanel className="hero-float-soft">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F7] px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0F172A] text-white">
              <Activity aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[#0F172A]">Panel de operación</p>
              <p className="truncate text-[9.5px] text-[#64748B]">Infraestructura y soporte F&amp;J</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: '99.9%', label: 'Disponibilidad' },
              { value: '128', label: 'Equipos' },
              { value: '24/7', label: 'Monitoreo' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] px-2.5 py-2.5 sm:px-3"
              >
                <p className="font-heading text-base font-bold tracking-[-0.03em] text-[#0F172A] sm:text-lg">
                  {item.value}
                </p>
                <p className="mt-0.5 truncate text-[9px] font-medium text-[#64748B]">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold text-[#0F172A]">Actividad de la red</p>
              <span className="font-mono text-[9px] text-[#64748B]">Últimas 24 h</span>
            </div>
            <div className="relative mt-2">
              <svg viewBox="0 0 320 88" className="h-[72px] w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="fj-hero-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[18, 42, 66].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="320"
                    y2={y}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                ))}
                <path
                  d="M0 66 C 18 64, 28 58, 42 60 S 66 48, 82 50 S 108 40, 126 44 S 152 32, 170 36 S 196 42, 214 34 S 242 20, 260 26 S 290 18, 320 22 L320 88 L0 88 Z"
                  fill="url(#fj-hero-area)"
                />
                <path
                  d="M0 66 C 18 64, 28 58, 42 60 S 66 48, 82 50 S 108 40, 126 44 S 152 32, 170 36 S 196 42, 214 34 S 242 20, 260 26 S 290 18, 320 22"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className="hero-draw"
                />
                <circle cx="320" cy="22" r="4.5" fill="#2563EB" className="hero-pulse" />
              </svg>
              <div className="pointer-events-none absolute inset-x-0 top-1 h-10 rounded-full bg-[linear-gradient(180deg,rgba(34,211,238,0.18),transparent)] hero-scan" />
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {operationRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-2.5 rounded-lg border border-[#EEF2F7] bg-white px-2.5 py-2"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#EFF6FF] text-[#2563EB]">
                  {row.label === 'Servidores' ? (
                    <Server aria-hidden="true" className="size-3" />
                  ) : row.label === 'Redes' ? (
                    <Network aria-hidden="true" className="size-3" />
                  ) : (
                    <Headset aria-hidden="true" className="size-3" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold leading-4 text-[#0F172A]">{row.label}</span>
                  <span className="block truncate text-[8.5px] leading-3 text-[#64748B]">{row.detail}</span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold ${
                    row.tone === 'green'
                      ? 'bg-[#F0FDF4] text-[#15803D]'
                      : 'bg-[#EFF6FF] text-[#1D4ED8]'
                  }`}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#EEF2F7] pt-2.5">
            <span className="text-[8.5px] font-medium text-[#94A3B8]">Vista de referencia</span>
            <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-[#1D4ED8]">
              Ver detalle <ArrowRight aria-hidden="true" className="size-2.5" />
            </span>
          </div>
        </div>
      </HeroPanel>

      <HeroFloatingNote
        icon={<ShieldCheck aria-hidden="true" className="size-3.5" />}
        title="Continuidad operativa"
        subtitle="Respaldos y monitoreo"
        className="-right-2 -top-2 hidden sm:flex"
        delay={400}
      />
      <HeroFloatingNote
        icon={<Headset aria-hidden="true" className="size-3.5" />}
        title="Soporte especializado"
        subtitle="Remoto y en sitio"
        className="-bottom-5 -left-3 hidden sm:flex"
        delay={900}
      />
    </div>
  )
}

/* ─── C · Resumen de cotización ────────────────────────────────────────────── */

const quoteRows = [
  { icon: Laptop, name: 'Laptop corporativa', detail: 'Equipo para oficina', qty: 2 },
  { icon: Monitor, name: 'Monitor profesional', detail: 'Pantalla para estación', qty: 2 },
  { icon: Router, name: 'Switch gestionable', detail: 'Conectividad de sede', qty: 1 },
  { icon: Database, name: 'Respaldo y almacenamiento', detail: 'Continuidad de datos', qty: 1 },
]

export function QuoteSummaryVisual() {
  return (
    <div className="relative pt-4">
      <HeroPanel className="hero-float-soft">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F7] px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <FileText aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[#0F172A]">Resumen de cotización</p>
              <p className="truncate text-[9.5px] text-[#64748B]">Solicitud asistida por un especialista</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#B45309]">
            En preparación
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-1.5">
            {quoteRows.map((row, index) => (
              <div
                key={row.name}
                className="flex items-center gap-2.5 rounded-xl border border-[#EEF2F7] bg-white px-2.5 py-2.5"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#F8FAFC] text-[#1D4ED8]">
                  <row.icon aria-hidden="true" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] font-bold text-[#0F172A]">{row.name}</span>
                  <span className="block truncate text-[8.5px] text-[#64748B]">{row.detail}</span>
                </span>
                <span className="shrink-0 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#475569]">
                  ×{row.qty}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2.5">
            <span className="text-[9.5px] font-semibold text-[#475569]">4 productos · 6 unidades</span>
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-[#1D4ED8]">
              <Sparkles aria-hidden="true" className="size-3" />
              Propuesta a medida
            </span>
          </div>

          <div className="mt-3 rounded-xl border border-[#DBEAFE] bg-[#F8FBFF] p-3">
            <div className="flex items-start gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                <Headset aria-hidden="true" className="size-3.5" />
              </span>
              <div>
                <p className="text-[10px] font-bold text-[#0F172A]">Un asesor prepara tu propuesta</p>
                <p className="mt-0.5 text-[8.5px] leading-4 text-[#475569]">
                  Revisamos disponibilidad, alternativas y tiempos de entrega.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            {['Productos', 'Tus datos', 'Propuesta'].map((step, index) => (
              <div key={step} className="flex min-w-0 flex-1 items-center gap-1.5">
                <span
                  className={`grid size-4 shrink-0 place-items-center rounded-full text-[7px] font-bold ${
                    index < 2 ? 'bg-[#2563EB] text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                  }`}
                >
                  {index < 2 ? <Check aria-hidden="true" className="size-2.5" strokeWidth={3} /> : index + 1}
                </span>
                <span
                  className={`truncate text-[8px] font-semibold ${
                    index < 2 ? 'text-[#0F172A]' : 'text-[#94A3B8]'
                  }`}
                >
                  {step}
                </span>
                {index < 2 && <span aria-hidden="true" className="h-px flex-1 bg-[#DBEAFE]" />}
              </div>
            ))}
          </div>

          <p className="mt-2.5 text-[8px] leading-3.5 text-[#94A3B8]">
            No es una compra online. Los precios y la disponibilidad se confirman en la propuesta.
          </p>
        </div>
      </HeroPanel>

      <HeroFloatingNote
        icon={<CheckCircle2 aria-hidden="true" className="size-3.5" />}
        title="Sin compromiso"
        subtitle="Solo una propuesta clara"
        className="-bottom-5 -right-2 hidden sm:flex"
        delay={700}
      />
    </div>
  )
}

/* ─── D · Mapa de infraestructura ──────────────────────────────────────────── */

const infrastructureNodes = [
  {
    icon: Wifi,
    title: 'Redes',
    detail: 'Wi-Fi y switches',
    className: 'left-[3%] top-[4%]',
  },
  {
    icon: Cloud,
    title: 'Nube',
    detail: 'Respaldos',
    className: 'right-[3%] top-[4%]',
  },
  {
    icon: Laptop,
    title: 'Equipos',
    detail: 'Laptops y PCs',
    className: 'left-[3%] bottom-[10%]',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad',
    detail: 'Accesos y políticas',
    className: 'right-[3%] bottom-[10%]',
  },
]

export function InfrastructureVisual() {
  return (
    <div className="relative pt-4">
      <HeroPanel className="hero-float-soft">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F7] px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0F172A] text-white">
              <Network aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[#0F172A]">Mapa de infraestructura</p>
              <p className="truncate text-[9.5px] text-[#64748B]">Servicios conectados y monitoreados</p>
            </div>
          </div>
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#EEF2F7] bg-[radial-gradient(circle_at_50%_45%,#EFF6FF_0%,#FFFFFF_58%,#F8FAFC_100%)]">
            <div aria-hidden="true" className="hero-grid absolute inset-0 opacity-50" />
            <svg
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 size-full"
              aria-hidden="true"
            >
              <path d="M200 150 L80 58" stroke="#93C5FD" strokeWidth="1.4" className="hero-dash" />
              <path d="M200 150 L320 58" stroke="#93C5FD" strokeWidth="1.4" className="hero-dash" />
              <path d="M200 150 L80 242" stroke="#93C5FD" strokeWidth="1.4" className="hero-dash" />
              <path d="M200 150 L320 242" stroke="#93C5FD" strokeWidth="1.4" className="hero-dash" />
              <circle cx="200" cy="150" r="52" fill="#2563EB" fillOpacity="0.06" />
              <circle cx="200" cy="150" r="70" fill="#2563EB" fillOpacity="0.035" />
            </svg>

            <div className="absolute left-1/2 top-1/2 w-[46%] max-w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#2563EB]/25 bg-white px-3 py-2.5 text-center shadow-[0_16px_40px_-20px_rgba(37,99,235,0.55)] sm:px-4 sm:py-3">
              <span className="mx-auto grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-white shadow-sm sm:size-9">
                <Server aria-hidden="true" className="size-4" />
              </span>
              <p className="mt-1.5 text-[10px] font-bold leading-3 text-[#0F172A] sm:text-[11px]">Núcleo TI</p>
              <p className="mt-0.5 hidden text-[8px] leading-3 text-[#64748B] sm:block">
                Servidores · Redes · Respaldos
              </p>
            </div>

            {infrastructureNodes.map((node) => (
              <div
                key={node.title}
                className={`absolute ${node.className} w-[31%] max-w-[125px] rounded-lg border border-[#E2E8F0] bg-white/95 px-2 py-1.5 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.4)] backdrop-blur sm:px-2.5 sm:py-2`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-md bg-[#EFF6FF] text-[#2563EB] sm:size-6">
                    <node.icon aria-hidden="true" className="size-3" />
                  </span>
                  <p className="truncate text-[8.5px] font-bold text-[#0F172A] sm:text-[9.5px]">
                    {node.title}
                  </p>
                </div>
                <p className="mt-1 hidden truncate text-[7.5px] text-[#64748B] sm:block">{node.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {[
              { icon: Activity, label: 'Monitoreo' },
              { icon: Headset, label: 'Soporte remoto' },
              { icon: BadgeCheck, label: 'En sitio' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[#EEF2F7] bg-[#F8FAFC] px-1.5 py-1.5 text-[8px] font-semibold text-[#475569]"
              >
                <item.icon aria-hidden="true" className="size-3 text-[#2563EB]" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </HeroPanel>

      <HeroFloatingNote
        icon={<ShieldCheck aria-hidden="true" className="size-3.5" />}
        title="Continuidad"
        subtitle="Respaldos programados"
        className="-top-3 right-0 hidden sm:flex"
        delay={500}
      />
    </div>
  )
}

/* ─── D2 · Mesa de ayuda ───────────────────────────────────────────────────── */

const supportTickets = [
  { icon: Wifi, title: 'Conectividad de sede', detail: 'Revisión de red y access points', state: 'En curso' },
  { icon: Monitor, title: 'Mantenimiento preventivo', detail: 'Equipos de oficina', state: 'Programado' },
  { icon: Database, title: 'Respaldo de información', detail: 'Verificación de restauración', state: 'Resuelto' },
] as const

export function SupportVisual() {
  return (
    <div className="relative pt-4">
      <HeroPanel className="hero-float-soft">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F7] px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0F172A] text-white">
              <Headset aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[#0F172A]">Mesa de ayuda</p>
              <p className="truncate text-[9.5px] text-[#64748B]">Atención remota y en sitio</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#1D4ED8]">
            SLA según plan
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-2">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.title}
                className="flex items-center gap-2.5 rounded-xl border border-[#EEF2F7] bg-white px-2.5 py-2.5"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#F8FAFC] text-[#2563EB]">
                  <ticket.icon aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold text-[#0F172A]">{ticket.title}</p>
                  <p className="truncate text-[8.5px] text-[#64748B]">{ticket.detail}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[7.5px] font-bold ${
                    ticket.state === 'Resuelto'
                      ? 'bg-[#F0FDF4] text-[#15803D]'
                      : ticket.state === 'En curso'
                        ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                        : 'bg-[#FFFBEB] text-[#B45309]'
                  }`}
                >
                  {ticket.state}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-[#DBEAFE] bg-[#F8FBFF] p-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] font-heading text-[9px] font-bold text-white">
                FJ
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-[#0F172A]">Especialista asignado</p>
                <p className="text-[8.5px] text-[#64748B]">Diagnóstico, seguimiento y cierre</p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#EEF2F7] pt-2.5">
            <span className="text-[8.5px] font-medium text-[#94A3B8]">Vista de referencia</span>
            <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-[#1D4ED8]">
              Ver planes <ArrowRight aria-hidden="true" className="size-2.5" />
            </span>
          </div>
        </div>
      </HeroPanel>

      <HeroFloatingNote
        icon={<CheckCircle2 aria-hidden="true" className="size-3.5" />}
        title="Diagnóstico sin costo"
        subtitle="Revisamos tu caso"
        className="-bottom-5 -left-2 hidden sm:flex"
        delay={600}
      />
    </div>
  )
}

/* ─── E · Interfaz de software ─────────────────────────────────────────────── */

const softwareBars = [34, 52, 44, 68, 58, 82, 74]

export function SoftwareVisual() {
  return (
    <div className="relative pt-4">
      <HeroPanel className="hero-float-soft">
        <div className="flex items-center gap-2 border-b border-[#EEF2F7] bg-[#F8FAFC] px-3 py-2.5">
          <span className="flex gap-1" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-[#FCA5A5]" />
            <span className="size-1.5 rounded-full bg-[#FCD34D]" />
            <span className="size-1.5 rounded-full bg-[#86EFAC]" />
          </span>
          <div className="mx-auto flex h-5 w-[62%] items-center justify-center rounded-md border border-[#E2E8F0] bg-white font-mono text-[8px] text-[#64748B]">
            panel.fjsolutions / operaciones
          </div>
          <span className="text-[7.5px] font-bold uppercase tracking-wider text-[#94A3B8]">Vista</span>
        </div>

        <div className="flex">
          <aside className="flex w-10 shrink-0 flex-col items-center gap-2 border-r border-[#EEF2F7] bg-[#FBFCFE] py-3 sm:w-11">
            <span className="grid size-6 place-items-center rounded-lg bg-[#2563EB] text-white">
              <Layers aria-hidden="true" className="size-3" />
            </span>
            <span className="grid size-6 place-items-center rounded-lg text-[#94A3B8]">
              <Workflow aria-hidden="true" className="size-3" />
            </span>
            <span className="grid size-6 place-items-center rounded-lg text-[#94A3B8]">
              <Database aria-hidden="true" className="size-3" />
            </span>
            <span className="mt-auto grid size-6 place-items-center rounded-lg text-[#94A3B8]">
              <Headset aria-hidden="true" className="size-3" />
            </span>
          </aside>

          <div className="min-w-0 flex-1 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold text-[#0F172A]">Panel de operaciones</p>
                <p className="text-[8px] text-[#64748B]">Procesos, integraciones y actividad</p>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              {[
                { value: '1,284', label: 'Registros' },
                { value: '92%', label: 'Automatizado' },
                { value: '3.2 h', label: 'Ahorro diario' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-[#EEF2F7] bg-white px-2 py-1.5">
                  <p className="font-heading text-[11px] font-bold tracking-tight text-[#0F172A]">{item.value}</p>
                  <p className="truncate text-[7.5px] text-[#64748B]">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-2.5 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[8.5px] font-bold text-[#0F172A]">Actividad del proceso</p>
                <span className="font-mono text-[7.5px] text-[#64748B]">7 días</span>
              </div>
              <svg viewBox="0 0 280 66" className="mt-1.5 h-14 w-full" aria-hidden="true">
                <line x1="0" y1="55" x2="280" y2="55" stroke="#E2E8F0" strokeWidth="1" />
                {softwareBars.map((height, index) => {
                  const barHeight = Math.round((height / 100) * 48)
                  return (
                    <rect
                      key={index}
                      x={8 + index * 39}
                      y={55 - barHeight}
                      width="18"
                      height={barHeight}
                      rx="4"
                      fill={index === softwareBars.length - 1 ? '#2563EB' : '#BFDBFE'}
                      className="hero-grow"
                      style={{ animationDelay: `${index * 80}ms` }}
                    />
                  )
                })}
              </svg>
            </div>

            <div className="mt-2.5 rounded-xl border border-[#EEF2F7] bg-white p-2.5">
              <p className="text-[8.5px] font-bold text-[#0F172A]">Flujo de automatización</p>
              <div className="mt-2 flex items-center gap-1">
                {[
                  { label: 'Solicitud', done: true },
                  { label: 'Validación', done: true },
                  { label: 'Facturación', done: false },
                ].map((step, index) => (
                  <div key={step.label} className="flex min-w-0 flex-1 items-center gap-1">
                    <div
                      className={`flex min-w-0 flex-1 items-center gap-1 rounded-md border px-1.5 py-1 ${
                        step.done
                          ? 'border-[#DBEAFE] bg-[#F8FBFF] text-[#1D4ED8]'
                          : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
                      }`}
                    >
                      <span
                        className={`grid size-3 shrink-0 place-items-center rounded-full ${
                          step.done ? 'bg-[#2563EB] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'
                        }`}
                      >
                        {step.done ? (
                          <Check aria-hidden="true" className="size-2" strokeWidth={3} />
                        ) : (
                          <span className="size-1 rounded-full bg-current" />
                        )}
                      </span>
                      <span className="truncate text-[7.5px] font-bold">{step.label}</span>
                    </div>
                    {index < 2 && (
                      <svg width="14" height="8" viewBox="0 0 14 8" className="shrink-0" aria-hidden="true">
                        <path d="M0 4 H14" stroke="#93C5FD" strokeWidth="1.2" strokeDasharray="2 3" className="hero-dash" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[7.5px] font-medium text-[#94A3B8]">Datos de referencia</span>
              <span className="inline-flex items-center gap-1 text-[7.5px] font-bold text-[#1D4ED8]">
                Exportar reporte <ArrowRight aria-hidden="true" className="size-2" />
              </span>
            </div>
          </div>
        </div>
      </HeroPanel>

      <HeroFloatingNote
        icon={<Workflow aria-hidden="true" className="size-3.5" />}
        title="Proceso automatizado"
        subtitle="Menos tareas manuales"
        className="-top-3 right-0 hidden sm:flex"
        delay={650}
      />
    </div>
  )
}

/* ─── F · Alcance del servicio ─────────────────────────────────────────────── */

type DetailVisualProps = {
  icon: React.ReactNode
  title: string
  items: string[]
  note?: string
}

export function DetailVisual({ icon, title, items, note }: DetailVisualProps) {
  return (
    <div className="relative pt-4">
      <HeroPanel className="hero-float-soft p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-white shadow-[0_12px_24px_-12px_rgba(37,99,235,0.7)]">
            {icon}
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
              Alcance del servicio
            </p>
            <p className="font-heading text-sm font-bold text-[#0F172A]">{title}</p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] px-3 py-2.5">
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#2563EB] text-white">
                <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
              </span>
              <span className="text-[11px] font-medium leading-4 text-[#334155]">{item}</span>
            </li>
          ))}
        </ul>

        {note && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#DBEAFE] bg-[#F8FBFF] p-3">
            <BadgeCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#2563EB]" />
            <p className="text-[10px] leading-4 text-[#475569]">{note}</p>
          </div>
        )}
      </HeroPanel>

      <HeroFloatingNote
        icon={<Headset aria-hidden="true" className="size-3.5" />}
        title="Acompañamiento"
        subtitle="Antes, durante y después"
        className="-bottom-5 -left-2 hidden sm:flex"
        delay={750}
      />
    </div>
  )
}
