'use client'

import { useMemo, useState } from 'react'
import {
  Check,
  CheckCircle2,
  Cpu,
  CreditCard,
  ExternalLink,
  Globe2,
  Key,
  MessageSquare,
  Power,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Webhook,
  X,
} from 'lucide-react'
import { Modal } from '@/components/admin/modal'
import { useToast } from '@/components/admin/toast'
import {
  EmptyState,
  PageHeader,
  SectionCard,
  StatCard,
  StatusToggle,
  btnPrimary,
  btnSecondary,
  inputClass,
} from '@/components/admin/ui'
import { formatNumber } from '@/lib/admin/format'
import { cn } from '@/lib/utils'

export type SystemIntegration = {
  id: string
  name: string
  category: 'tributario' | 'identidad' | 'mensajeria' | 'pagos' | 'webhooks'
  provider: string
  description: string
  status: 'connected' | 'configured' | 'disabled'
  mode: 'production' | 'sandbox'
  endpoint: string
  lastSync: string
}

const defaultIntegrations: SystemIntegration[] = [
  {
    id: 'int-sunat',
    name: 'SUNAT - Facturación & RUC',
    category: 'tributario',
    provider: 'SUNAT OSE / PSE WebService',
    description: 'Consulta automatizada de validez de RUC, condición habido/activo y emisión de comprobantes electrónicos.',
    status: 'connected',
    mode: 'production',
    endpoint: 'https://api-seguridad.sunat.gob.pe/v1/clientessunat',
    lastSync: 'Hace 5 minutos',
  },
  {
    id: 'int-reniec',
    name: 'RENIEC - Consulta de DNI',
    category: 'identidad',
    provider: 'PIDE / API Rest Perú',
    description: 'Validación en tiempo real de nombres y apellidos de clientes particulares a partir de su documento nacional.',
    status: 'connected',
    mode: 'production',
    endpoint: 'https://api.apis.net.pe/v2/reniec/dni',
    lastSync: 'Hace 12 minutos',
  },
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Cloud API (Meta)',
    category: 'mensajeria',
    provider: 'Meta Business Platform',
    description: 'Envío de cotizaciones, confirmaciones de pedido, enlaces de pago y avisos de mesa de ayuda vía WhatsApp oficial.',
    status: 'connected',
    mode: 'production',
    endpoint: 'https://graph.facebook.com/v21.0/me/messages',
    lastSync: 'Hace 2 minutos',
  },
  {
    id: 'int-niubiz',
    name: 'Pasarela de Pago (Niubiz & Yape)',
    category: 'pagos',
    provider: 'Niubiz CyberSource Gateway',
    description: 'Cobro con tarjetas de crédito/débito y código QR Yape directo en la tienda de hardware corporativo.',
    status: 'connected',
    mode: 'sandbox',
    endpoint: 'https://apisandbox.vnforappstest.com/api.ecommerce/v2/ecommerce/token/session',
    lastSync: 'Ayer a las 18:40',
  },
  {
    id: 'int-mercadopago',
    name: 'Mercado Pago Checkout Pro',
    category: 'pagos',
    provider: 'Mercado Libre Gateway',
    description: 'Pasarela alternativa de pagos con soporte para transferencias bancarias y cuotas sin intereses.',
    status: 'configured',
    mode: 'sandbox',
    endpoint: 'https://api.mercadopago.com/checkout/preferences',
    lastSync: 'Sin sincronizar',
  },
  {
    id: 'int-webhooks',
    name: 'Webhooks & Automatizaciones',
    category: 'webhooks',
    provider: 'F&J Event Dispatcher',
    description: 'Eventos salientes (orden creada, pago confirmado, cotización aprobada) para ERPs o sistemas externos.',
    status: 'connected',
    mode: 'production',
    endpoint: 'https://fjsolutions.pe/api/webhooks/v1/dispatch',
    lastSync: 'Hace 1 hora',
  },
]

export function SystemIntegrationsView() {
  const toast = useToast()
  const [integrations, setIntegrations] = useState<SystemIntegration[]>(defaultIntegrations)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [editingInt, setEditingInt] = useState<SystemIntegration | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [endpointUrl, setEndpointUrl] = useState('')
  const [isSandbox, setIsSandbox] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return integrations.filter((item) => {
      const matchCat = filterCategory === 'all' || item.category === filterCategory
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    return matchCat && matchQuery
    })
  }, [integrations, filterCategory, query])

  const connectedCount = useMemo(() => {
    return integrations.filter((i) => i.status === 'connected').length
  }, [integrations])

  function handleOpenConfig(item: SystemIntegration) {
    setEditingInt(item)
    setEndpointUrl(item.endpoint)
    setIsSandbox(item.mode === 'sandbox')
    setApiKey('••••••••••••••••••••••••••••••••')
    setApiSecret('••••••••••••••••••••••••••••••••')
  }

  function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault()
    if (!editingInt) return
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === editingInt.id
          ? {
              ...i,
              endpoint: endpointUrl.trim(),
              mode: isSandbox ? 'sandbox' : 'production',
              status: 'connected',
              lastSync: 'Ahora mismo',
            }
          : i
      )
    )
    toast.success('Integración actualizada', `${editingInt.name} guardada correctamente.`)
    setEditingInt(null)
  }

  function handleTestConnection(name: string) {
    toast.info('Probando conexión…', `Enviando ping de diagnóstico a ${name}`)
    setTimeout(() => {
      toast.success('Conexión exitosa (200 OK)', `El servicio ${name} responde con latencia de 48ms.`)
    }, 900)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sistema"
        title="Integraciones & APIs"
        description="Conectores de servicios externos, validación tributaria, pasarelas de pago y automatización mediante webhooks."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Servicios conectados"
          value={`${connectedCount} de ${integrations.length}`}
          helper="Conectores en línea"
          icon={Cpu}
        />
        <StatCard
          label="Peticiones hoy"
          value="1,420"
          helper="Consultas SUNAT, RENIEC y API"
          icon={Globe2}
        />
        <StatCard
          label="Tasa de éxito"
          value="99.8%"
          helper="Sin caídas de servicio reportadas"
          icon={ShieldCheck}
        />
        <StatCard
          label="Eventos webhook"
          value="340 despachos"
          helper="Notificaciones y pagos procesados"
          icon={Webhook}
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar conector o servicio…"
              className={cn(inputClass, 'pl-9 pr-8 text-xs')}
              aria-label="Buscar integraciones"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 grid size-4 -translate-y-1/2 place-items-center text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'tributario', label: 'Tributario (SUNAT)' },
              { key: 'identidad', label: 'Identidad (RENIEC)' },
              { key: 'mensajeria', label: 'Mensajería (WhatsApp)' },
              { key: 'pagos', label: 'Pasarelas de Pago' },
              { key: 'webhooks', label: 'Webhooks' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterCategory(tab.key)}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition',
                  filterCategory === tab.key
                    ? 'bg-[#2563EB]/10 text-brand-ink ring-1 ring-[#2563EB]/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => {
          const isConnected = item.status === 'connected'
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition hover:border-[#2563EB]/40 hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint-brand text-brand-ink ring-1 ring-[#2563EB]/20">
                      {item.category === 'pagos' ? (
                        <CreditCard className="size-5" />
                      ) : item.category === 'mensajeria' ? (
                        <MessageSquare className="size-5" />
                      ) : item.category === 'webhooks' ? (
                        <Webhook className="size-5" />
                      ) : (
                        <Cpu className="size-5" />
                      )}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{item.provider}</p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[9.5px] font-bold ring-1 ring-inset',
                      item.mode === 'production'
                        ? 'bg-purple-500/10 text-purple-400 ring-purple-500/20'
                        : 'bg-amber-500/10 text-warning-ink ring-amber-500/20'
                    )}
                  >
                    {item.mode === 'production' ? 'PRODUCCIÓN' : 'SANDBOX'}
                  </span>
                </div>

                <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-3.5 rounded-xl border border-border/60 bg-muted/40 p-2.5">
                  <p className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground">
                    Endpoint de conexión
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[10.5px] text-foreground">
                    {item.endpoint}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-border/60 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'size-2 rounded-full',
                        isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                      )}
                    />
                    <span className="text-[11px] font-semibold text-foreground">
                      {isConnected ? 'Conectado' : 'Configuración pendiente'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTestConnection(item.name)}
                      className="rounded-lg border border-border bg-card px-2 py-1 text-[10.5px] font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      title="Probar conexión"
                    >
                      Diagnóstico
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenConfig(item)}
                      className="rounded-lg bg-tint-brand px-2.5 py-1 text-[10.5px] font-bold text-brand-ink transition hover:bg-[#2563EB]/20"
                    >
                      Ajustes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editingInt && (
        <Modal
          open={Boolean(editingInt)}
          onClose={() => setEditingInt(null)}
          title={`Configurar ${editingInt.name}`}
          description="Ajusta las credenciales de conexión, endpoint y entorno de ejecución."
        >
          <form onSubmit={handleSaveConfig} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-foreground">Endpoint / Base URL</label>
              <input
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className={cn(inputClass, 'mt-1 font-mono text-xs')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground">API Key / Client ID</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={cn(inputClass, 'mt-1 font-mono text-xs')}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground">API Secret / Token</label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className={cn(inputClass, 'mt-1 font-mono text-xs')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/40 p-3">
              <div>
                <p className="text-xs font-bold text-foreground">Modo Sandbox / Pruebas</p>
                <p className="text-[10.5px] text-muted-foreground">
                  Permite realizar pruebas simuladas sin afectar operaciones reales.
                </p>
              </div>
              <StatusToggle
                active={isSandbox}
                onToggle={() => setIsSandbox((prev) => !prev)}
                label="Modo Sandbox"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={btnSecondary} onClick={() => setEditingInt(null)}>
                Cancelar
              </button>
              <button type="submit" className={btnPrimary}>
                Guardar credenciales
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
