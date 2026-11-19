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
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0B2236] text-white">
              <Activity aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-foreground">Panel de operación</p>
              <p className="truncate text-[9.5px] text-muted-foreground">Infraestructura y soporte F&amp;J</p>
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
                className="rounded-xl border border-border bg-muted px-2.5 py-2.5 sm:px-3"
              >
                <p className="font-heading text-base font-bold tracking-[-0.03em] text-foreground sm:text-lg">
                  {item.value}
                </p>
                <p className="mt-0.5 truncate text-[9px] font-medium text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 hidden rounded-xl border border-border bg-muted p-3 lg:block">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold text-foreground">Actividad de la red</p>
              <span className="font-mono text-[9px] text-muted-foreground">Últimas 24 h</span>
            </div>
            <div className="relative mt-2">
              <svg viewBox="0 0 320 88" className="h-[72px] w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="fj-hero-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1769AA" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#1769AA" stopOpacity="0" />
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
                  stroke="#1769AA"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className="hero-draw"
                />
                <circle cx="320" cy="22" r="4.5" fill="#1769AA" className="hero-pulse" />
              </svg>
              <div className="pointer-events-none absolute inset-x-0 top-1 h-10 rounded-full bg-[linear-gradient(180deg,rgba(0,184,217,0.18),transparent)] hero-scan" />
            </div>
          </div>

          <div className="mt-3 hidden space-y-1.5 lg:block">
            {operationRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-2.5 py-2"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-tint-blue text-blue-ink">
                  {row.label === 'Servidores' ? (
                    <Server aria-hidden="true" className="size-3" />
                  ) : row.label === 'Redes' ? (
                    <Network aria-hidden="true" className="size-3" />
                  ) : (
                    <Headset aria-hidden="true" className="size-3" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold leading-4 text-foreground">{row.label}</span>
                  <span className="block truncate text-[8.5px] leading-3 text-muted-foreground">{row.detail}</span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold ${
                    row.tone === 'green'
                      ? 'bg-tint-green text-success'
                      : 'bg-tint-blue text-blue-ink'
                  }`}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 hidden items-center justify-between gap-2 border-t border-border pt-2.5 lg:flex">
            <span className="text-[8.5px] font-medium text-muted-foreground">Vista de referencia</span>
            <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-blue-ink">
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
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-tint-blue text-blue-ink">
              <FileText aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-foreground">Resumen de cotización</p>
              <p className="truncate text-[9.5px] text-muted-foreground">Solicitud asistida por un especialista</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-amber-400/45 bg-tint-amber px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-warning-ink">
            En preparación
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-1.5">
            {quoteRows.map((row, index) => (
              <div
                key={row.name}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-2.5 py-2.5"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-blue-ink">
                  <row.icon aria-hidden="true" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] font-bold text-foreground">{row.name}</span>
                  <span className="block truncate text-[8.5px] text-muted-foreground">{row.detail}</span>
                </span>
                <span className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[9px] font-bold text-muted-foreground">
                  ×{row.qty}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-muted px-3 py-2.5">
            <span className="text-[9.5px] font-semibold text-muted-foreground">4 productos · 6 unidades</span>
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-blue-ink">
              <Sparkles aria-hidden="true" className="size-3" />
              Propuesta a medida
            </span>
          </div>

          <div className="mt-3 rounded-xl border border-brand-ink/30 bg-tint-brand p-3">
            <div className="flex items-start gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-card text-blue-ink shadow-sm">
                <Headset aria-hidden="true" className="size-3.5" />
              </span>
              <div>
                <p className="text-[10px] font-bold text-foreground">Un asesor prepara tu propuesta</p>
                <p className="mt-0.5 text-[8.5px] leading-4 text-muted-foreground">
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
                    index < 2 ? 'bg-[#1769AA] text-white' : 'bg-border text-muted-foreground'
                  }`}
                >
                  {index < 2 ? <Check aria-hidden="true" className="size-2.5" strokeWidth={3} /> : index + 1}
                </span>
                <span
                  className={`truncate text-[8px] font-semibold ${
                    index < 2 ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step}
                </span>
                {index < 2 && <span aria-hidden="true" className="h-px flex-1 bg-blue-ink/15" />}
              </div>
            ))}
          </div>

          <p className="mt-2.5 text-[8px] leading-3.5 text-muted-foreground">
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
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0B2236] text-white">
              <Network aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-foreground">Mapa de infraestructura</p>
              <p className="truncate text-[9.5px] text-muted-foreground">Servicios conectados y monitoreados</p>
            </div>
          </div>
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-[radial-gradient(circle_at_50%_45%,#F1F6FA_0%,#FFFFFF_58%,#F1F6FA_100%)] dark:bg-[radial-gradient(circle_at_50%_45%,#14243D_0%,#0E1626_58%,#102A43_100%)]">
            <div aria-hidden="true" className="hero-grid absolute inset-0 opacity-50" />
            <svg
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 size-full"
              aria-hidden="true"
            >
              <path d="M200 150 L80 58" stroke="#9FE2EF" strokeWidth="1.4" className="hero-dash" />
              <path d="M200 150 L320 58" stroke="#9FE2EF" strokeWidth="1.4" className="hero-dash" />
              <path d="M200 150 L80 242" stroke="#9FE2EF" strokeWidth="1.4" className="hero-dash" />
              <path d="M200 150 L320 242" stroke="#9FE2EF" strokeWidth="1.4" className="hero-dash" />
              <circle cx="200" cy="150" r="52" fill="#1769AA" fillOpacity="0.06" />
              <circle cx="200" cy="150" r="70" fill="#1769AA" fillOpacity="0.035" />
            </svg>

            <div className="absolute left-1/2 top-1/2 w-[46%] max-w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#1769AA]/25 bg-card px-3 py-2.5 text-center shadow-[0_16px_40px_-20px_rgba(23,105,170,0.55)] sm:px-4 sm:py-3">
              <span className="mx-auto grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#2A82C4] to-[#1769AA] text-white shadow-sm sm:size-9">
                <Server aria-hidden="true" className="size-4" />
              </span>
              <p className="mt-1.5 text-[10px] font-bold leading-3 text-foreground sm:text-[11px]">Núcleo TI</p>
              <p className="mt-0.5 hidden text-[8px] leading-3 text-muted-foreground sm:block">
                Servidores · Redes · Respaldos
              </p>
            </div>

            {infrastructureNodes.map((node) => (
              <div
                key={node.title}
                className={`absolute ${node.className} w-[31%] max-w-[125px] rounded-lg border border-border bg-card/95 px-2 py-1.5 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.4)] backdrop-blur sm:px-2.5 sm:py-2`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-md bg-tint-blue text-blue-ink sm:size-6">
                    <node.icon aria-hidden="true" className="size-3" />
                  </span>
                  <p className="truncate text-[8.5px] font-bold text-foreground sm:text-[9.5px]">
                    {node.title}
                  </p>
                </div>
                <p className="mt-1 hidden truncate text-[7.5px] text-muted-foreground sm:block">{node.detail}</p>
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
                className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted px-1.5 py-1.5 text-[8px] font-semibold text-muted-foreground"
              >
                <item.icon aria-hidden="true" className="size-3 text-blue-ink" />
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
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0B2236] text-white">
              <Headset aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-foreground">Mesa de ayuda</p>
              <p className="truncate text-[9.5px] text-muted-foreground">Atención remota y en sitio</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-brand-ink/30 bg-tint-brand px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-brand-ink">
            SLA según plan
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-2">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.title}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-2.5 py-2.5"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-blue-ink">
                  <ticket.icon aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold text-foreground">{ticket.title}</p>
                  <p className="truncate text-[8.5px] text-muted-foreground">{ticket.detail}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[7.5px] font-bold ${
                    ticket.state === 'Resuelto'
                      ? 'bg-tint-green text-success'
                      : ticket.state === 'En curso'
                        ? 'bg-tint-blue text-blue-ink'
                        : 'bg-tint-amber text-warning-ink'
                  }`}
                >
                  {ticket.state}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-brand-ink/30 bg-tint-brand p-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2A82C4] to-[#1769AA] font-heading text-[9px] font-bold text-white">
                FJ
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-foreground">Especialista asignado</p>
                <p className="text-[8.5px] text-muted-foreground">Diagnóstico, seguimiento y cierre</p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2.5">
            <span className="text-[8.5px] font-medium text-muted-foreground">Vista de referencia</span>
            <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-blue-ink">
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
        <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2.5">
          <span className="flex gap-1" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-[#FCA5A5]" />
            <span className="size-1.5 rounded-full bg-[#FCD34D]" />
            <span className="size-1.5 rounded-full bg-[#86EFAC]" />
          </span>
          <div className="mx-auto flex h-5 w-[62%] items-center justify-center rounded-md border border-border bg-card font-mono text-[8px] text-muted-foreground">
            panel.fjsolutions / operaciones
          </div>
          <span className="text-[7.5px] font-bold uppercase tracking-wider text-muted-foreground">Vista</span>
        </div>

        <div className="flex">
          <aside className="flex w-10 shrink-0 flex-col items-center gap-2 border-r border-border bg-muted py-3 sm:w-11">
            <span className="grid size-6 place-items-center rounded-lg bg-[#1769AA] text-white">
              <Layers aria-hidden="true" className="size-3" />
            </span>
            <span className="grid size-6 place-items-center rounded-lg text-muted-foreground">
              <Workflow aria-hidden="true" className="size-3" />
            </span>
            <span className="grid size-6 place-items-center rounded-lg text-muted-foreground">
              <Database aria-hidden="true" className="size-3" />
            </span>
            <span className="mt-auto grid size-6 place-items-center rounded-lg text-muted-foreground">
              <Headset aria-hidden="true" className="size-3" />
            </span>
          </aside>

          <div className="min-w-0 flex-1 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold text-foreground">Panel de operaciones</p>
                <p className="text-[8px] text-muted-foreground">Procesos, integraciones y actividad</p>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              {[
                { value: '1,284', label: 'Registros' },
                { value: '92%', label: 'Automatizado' },
                { value: '3.2 h', label: 'Ahorro diario' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card px-2 py-1.5">
                  <p className="font-heading text-[11px] font-bold tracking-tight text-foreground">{item.value}</p>
                  <p className="truncate text-[7.5px] text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-2.5 rounded-xl border border-border bg-muted p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[8.5px] font-bold text-foreground">Actividad del proceso</p>
                <span className="font-mono text-[7.5px] text-muted-foreground">7 días</span>
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
                      fill={index === softwareBars.length - 1 ? '#1769AA' : '#BFE4F0'}
                      className="hero-grow"
                      style={{ animationDelay: `${index * 80}ms` }}
                    />
                  )
                })}
              </svg>
            </div>

            <div className="mt-2.5 rounded-xl border border-border bg-card p-2.5">
              <p className="text-[8.5px] font-bold text-foreground">Flujo de automatización</p>
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
                          ? 'border-blue-ink/25 bg-muted text-blue-ink'
                          : 'border-border bg-muted text-muted-foreground'
                      }`}
                    >
                      <span
                        className={`grid size-3 shrink-0 place-items-center rounded-full ${
                          step.done ? 'bg-[#1769AA] text-white' : 'bg-border text-muted-foreground'
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
                        <path d="M0 4 H14" stroke="#9FE2EF" strokeWidth="1.2" strokeDasharray="2 3" className="hero-dash" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[7.5px] font-medium text-muted-foreground">Datos de referencia</span>
              <span className="inline-flex items-center gap-1 text-[7.5px] font-bold text-blue-ink">
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
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#2A82C4] to-[#1769AA] text-white shadow-[0_12px_24px_-12px_rgba(23,105,170,0.7)]">
            {icon}
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Alcance del servicio
            </p>
            <p className="font-heading text-sm font-bold text-foreground">{title}</p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-xl border border-border bg-muted px-3 py-2.5">
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#1769AA] text-white">
                <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
              </span>
              <span className="text-[11px] font-medium leading-4 text-foreground/85">{item}</span>
            </li>
          ))}
        </ul>

        {note && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-blue-ink/25 bg-muted p-3">
            <BadgeCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-blue-ink" />
            <p className="text-[10px] leading-4 text-muted-foreground">{note}</p>
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
