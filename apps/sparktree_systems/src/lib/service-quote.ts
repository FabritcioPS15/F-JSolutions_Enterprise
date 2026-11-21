import type { ServiceCategory } from './services'

export type QuoteKind = 'soporte' | 'infraestructura' | 'software'
export type QuoteBilling = 'proyecto' | 'mensual'
export type QuoteCoverage = 'remoto' | 'programado' | 'extendido'
export type QuoteUrgency = 'normal' | 'prioritario'

export type QuoteScope = {
  devices: number
  sites: number
  points: number
  modules: number
  users: number
  integrations: number
  coverage: QuoteCoverage
  mobileApp: boolean
  dataMigration: boolean
  urgency: QuoteUrgency
}

type MoneyRange = [number, number]

export type ServiceQuoteConfig = {
  slug: string
  kind: QuoteKind
  billing: QuoteBilling
  base: MoneyRange
  perDevice?: MoneyRange
  deviceLabel?: string
  perSite?: MoneyRange
  perPoint?: MoneyRange
  pointLabel?: string
  perModule?: { included: number; amount: MoneyRange }
  moduleLabel?: string
  perUserBlock?: { size: number; included: number; amount: MoneyRange }
  perIntegration?: MoneyRange
  integrationIncluded?: number
  mobileApp?: MoneyRange
  dataMigration?: MoneyRange
  coverage?: Partial<Record<Exclude<QuoteCoverage, 'remoto'>, MoneyRange>>
  urgencyFixed?: MoneyRange
  urgencyPercent?: MoneyRange
  note?: string
}

const configs: ServiceQuoteConfig[] = [
  {
    slug: 'soporte-tecnico',
    kind: 'soporte',
    billing: 'mensual',
    base: [450, 750],
    perDevice: [25, 45],
    deviceLabel: 'Equipos atendidos',
    perSite: [120, 240],
    coverage: { programado: [180, 320], extendido: [650, 1100] },
    urgencyFixed: [250, 450],
  },
  {
    slug: 'mantenimiento-de-equipos',
    kind: 'soporte',
    billing: 'proyecto',
    base: [800, 1500],
    perDevice: [55, 95],
    deviceLabel: 'Equipos a mantener',
    perSite: [100, 200],
    urgencyFixed: [150, 300],
    note: 'Estimación por jornada de mantenimiento programado.',
  },
  {
    slug: 'instalacion-de-software',
    kind: 'soporte',
    billing: 'proyecto',
    base: [350, 700],
    perDevice: [45, 80],
    deviceLabel: 'Equipos a configurar',
    perSite: [80, 150],
  },
  {
    slug: 'configuracion-de-impresoras',
    kind: 'soporte',
    billing: 'proyecto',
    base: [300, 550],
    perDevice: [60, 110],
    deviceLabel: 'Impresoras',
    perSite: [80, 160],
  },
  {
    slug: 'soporte-empresarial',
    kind: 'soporte',
    billing: 'mensual',
    base: [900, 1600],
    perDevice: [22, 38],
    deviceLabel: 'Equipos atendidos',
    perSite: [150, 280],
    coverage: { programado: [220, 380], extendido: [800, 1400] },
    urgencyFixed: [350, 600],
  },
  {
    slug: 'redes-y-conectividad',
    kind: 'infraestructura',
    billing: 'proyecto',
    base: [1500, 2800],
    perPoint: [90, 160],
    pointLabel: 'Puntos de red',
    perSite: [300, 600],
    urgencyFixed: [350, 650],
  },
  {
    slug: 'cableado-estructurado',
    kind: 'infraestructura',
    billing: 'proyecto',
    base: [1200, 2200],
    perPoint: [110, 190],
    pointLabel: 'Puntos de red',
    perSite: [250, 500],
  },
  {
    slug: 'implementacion-de-infraestructura',
    kind: 'infraestructura',
    billing: 'proyecto',
    base: [3500, 6500],
    perSite: [600, 1100],
    dataMigration: [500, 1200],
    urgencyFixed: [600, 1200],
  },
  {
    slug: 'equipamiento-tecnologico-empresarial',
    kind: 'infraestructura',
    billing: 'proyecto',
    base: [900, 1600],
    perDevice: [120, 260],
    deviceLabel: 'Equipos a implementar',
    perSite: [200, 400],
    urgencyFixed: [200, 400],
    note: 'No incluye el costo de los equipos: se cotizan según marca, modelo y stock.',
  },
  {
    slug: 'sistemas-web-a-medida',
    kind: 'software',
    billing: 'proyecto',
    base: [6500, 11000],
    perModule: { included: 3, amount: [1200, 2200] },
    moduleLabel: 'Módulos funcionales',
    perUserBlock: { size: 10, included: 20, amount: [300, 600] },
    perIntegration: [900, 1800],
    mobileApp: [3500, 6000],
    dataMigration: [800, 1500],
    urgencyPercent: [0.12, 0.18],
  },
  {
    slug: 'creacion-de-paginas-web',
    kind: 'software',
    billing: 'proyecto',
    base: [2500, 4500],
    perModule: { included: 4, amount: [350, 600] },
    moduleLabel: 'Páginas o secciones',
    perIntegration: [400, 800],
    dataMigration: [400, 900],
    urgencyPercent: [0.1, 0.15],
  },
  {
    slug: 'sistemas-de-gestion-empresarial',
    kind: 'software',
    billing: 'proyecto',
    base: [9000, 15000],
    perModule: { included: 4, amount: [1500, 2600] },
    moduleLabel: 'Módulos funcionales',
    perUserBlock: { size: 10, included: 15, amount: [350, 650] },
    perIntegration: [1000, 2000],
    mobileApp: [4000, 7000],
    dataMigration: [1200, 2200],
    urgencyPercent: [0.12, 0.18],
  },
  {
    slug: 'automatizacion-de-procesos',
    kind: 'software',
    billing: 'proyecto',
    base: [3500, 6000],
    perModule: { included: 2, amount: [1400, 2400] },
    moduleLabel: 'Procesos a automatizar',
    perUserBlock: { size: 10, included: 10, amount: [200, 400] },
    perIntegration: [800, 1500],
    urgencyPercent: [0.12, 0.18],
  },
  {
    slug: 'integraciones-y-api',
    kind: 'software',
    billing: 'proyecto',
    base: [3000, 5500],
    perIntegration: [1100, 2000],
    integrationIncluded: 2,
    perUserBlock: { size: 10, included: 10, amount: [150, 300] },
    urgencyPercent: [0.1, 0.16],
  },
  {
    slug: 'consultoria-y-proyectos-personalizados',
    kind: 'software',
    billing: 'proyecto',
    base: [2000, 3500],
    perModule: { included: 2, amount: [900, 1600] },
    moduleLabel: 'Entregables',
    perUserBlock: { size: 10, included: 10, amount: [150, 300] },
    perIntegration: [700, 1400],
    urgencyPercent: [0.1, 0.16],
  },
]

const fallbacks: Record<ServiceCategory, Omit<ServiceQuoteConfig, 'slug'>> = {
  'Soporte TI': {
    kind: 'soporte',
    billing: 'mensual',
    base: [500, 900],
    perDevice: [25, 45],
    deviceLabel: 'Equipos atendidos',
    perSite: [120, 240],
    coverage: { programado: [180, 320], extendido: [650, 1100] },
    urgencyFixed: [250, 450],
  },
  'Infraestructura TI': {
    kind: 'infraestructura',
    billing: 'proyecto',
    base: [1800, 3200],
    perPoint: [90, 170],
    pointLabel: 'Puntos de red',
    perSite: [300, 600],
    urgencyFixed: [350, 650],
  },
  'Desarrollo de software': {
    kind: 'software',
    billing: 'proyecto',
    base: [6000, 10000],
    perModule: { included: 3, amount: [1300, 2300] },
    moduleLabel: 'Módulos funcionales',
    perUserBlock: { size: 10, included: 15, amount: [300, 600] },
    perIntegration: [900, 1800],
    mobileApp: [3500, 6000],
    dataMigration: [800, 1500],
    urgencyPercent: [0.12, 0.18],
  },
}

const configBySlug = new Map(configs.map((config) => [config.slug, config]))

export function getServiceQuoteConfig(slug: string, category?: ServiceCategory): ServiceQuoteConfig {
  const known = configBySlug.get(slug)
  if (known) return known
  const fallback = fallbacks[category ?? 'Desarrollo de software']
  return { slug, ...fallback }
}

export function createScopeFor(config: ServiceQuoteConfig): QuoteScope {
  return {
    devices: config.perDevice ? 10 : 0,
    sites: 1,
    points: config.perPoint ? 12 : 0,
    modules: config.perModule ? Math.max(config.perModule.included, 3) : 0,
    users: config.perUserBlock ? Math.max(config.perUserBlock.included, 10) : 0,
    integrations: config.perIntegration ? (config.integrationIncluded ?? 0) : 0,
    coverage: 'remoto',
    mobileApp: false,
    dataMigration: false,
    urgency: 'normal',
  }
}

export type QuoteScopeLine = {
  label: string
  value: string
  quantity?: number
}

const coverageLabels: Record<QuoteCoverage, string> = {
  remoto: 'Remoto',
  programado: 'En sitio programado',
  extendido: 'Extendido 24/7',
}

export function getScopeLines(config: ServiceQuoteConfig, scope: QuoteScope): QuoteScopeLine[] {
  const lines: QuoteScopeLine[] = []

  if (config.perDevice) {
    lines.push({ label: config.deviceLabel ?? 'Equipos', value: String(scope.devices), quantity: scope.devices })
  }
  if (config.perSite) {
    lines.push({ label: 'Sedes', value: String(scope.sites), quantity: scope.sites })
  }
  if (config.perPoint) {
    lines.push({ label: config.pointLabel ?? 'Puntos', value: String(scope.points), quantity: scope.points })
  }
  if (config.perModule && scope.modules > 0) {
    lines.push({ label: config.moduleLabel ?? 'Módulos', value: String(scope.modules), quantity: scope.modules })
  }
  if (config.perUserBlock && scope.users > 0) {
    lines.push({ label: 'Usuarios', value: String(scope.users), quantity: scope.users })
  }
  if (config.perIntegration && scope.integrations > 0) {
    lines.push({ label: 'Integraciones', value: String(scope.integrations), quantity: scope.integrations })
  }
  if (config.coverage && scope.coverage !== 'remoto') {
    lines.push({ label: 'Modalidad de soporte', value: coverageLabels[scope.coverage] })
  }
  if (config.mobileApp && scope.mobileApp) {
    lines.push({ label: 'App móvil', value: 'Incluida' })
  }
  if (config.dataMigration && scope.dataMigration) {
    lines.push({ label: 'Migración de datos', value: 'Incluida' })
  }
  if ((config.urgencyFixed || config.urgencyPercent) && scope.urgency === 'prioritario') {
    lines.push({ label: 'Prioridad', value: 'Atención prioritaria' })
  }

  return lines
}

function roundMoney(value: number) {
  return value >= 1000 ? Math.round(value / 100) * 100 : Math.round(value / 50) * 50
}

export type ServiceQuoteEstimate = {
  min: number
  max: number
  billing: QuoteBilling
  lines: QuoteScopeLine[]
}

export function estimateServiceQuote(
  config: ServiceQuoteConfig,
  scope: QuoteScope,
): ServiceQuoteEstimate {
  let min = config.base[0]
  let max = config.base[1]

  const add = (range: MoneyRange | undefined, factor: number) => {
    if (!range || factor <= 0) return
    min += range[0] * factor
    max += range[1] * factor
  }

  add(config.perDevice, scope.devices)
  add(config.perSite, Math.max(0, scope.sites - 1))
  add(config.perPoint, scope.points)

  if (config.perModule) {
    add(config.perModule.amount, Math.max(0, scope.modules - config.perModule.included))
  }

  if (config.perUserBlock) {
    const { size, included } = config.perUserBlock
    const blocks = scope.users > included ? Math.ceil((scope.users - included) / size) : 0
    add(config.perUserBlock.amount, blocks)
  }

  if (config.perIntegration) {
    add(config.perIntegration, Math.max(0, scope.integrations - (config.integrationIncluded ?? 0)))
  }

  if (scope.coverage !== 'remoto') {
    add(config.coverage?.[scope.coverage], 1)
  }

  if (scope.mobileApp) add(config.mobileApp, 1)
  if (scope.dataMigration) add(config.dataMigration, 1)

  if (scope.urgency === 'prioritario') {
    if (config.urgencyPercent) {
      const [minRate, maxRate] = config.urgencyPercent
      min += min * minRate
      max += max * maxRate
    } else {
      add(config.urgencyFixed, 1)
    }
  }

  const roundedMin = roundMoney(min)
  const roundedMax = Math.max(roundMoney(max), roundedMin + 100)

  return {
    min: roundedMin,
    max: roundedMax,
    billing: config.billing,
    lines: getScopeLines(config, scope),
  }
}

const penFormatter = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 })

export function formatPen(value: number) {
  return `S/ ${penFormatter.format(value)}`
}

export function formatEstimate(min: number, max: number, billing: QuoteBilling) {
  return `${formatPen(min)} – ${formatPen(max)}${billing === 'mensual' ? ' al mes' : ''}`
}

export type QuoteSelection = {
  title: string
  category: ServiceCategory
  config: ServiceQuoteConfig
  scope: QuoteScope
}

export type QuoteGroupItem = {
  title: string
  category: ServiceCategory
  estimate: ServiceQuoteEstimate
}

export type QuoteGroupEstimate = {
  items: QuoteGroupItem[]
  project: { min: number; max: number } | null
  monthly: { min: number; max: number } | null
}

export function estimateQuoteGroup(selections: QuoteSelection[]): QuoteGroupEstimate {
  const items = selections.map((selection) => ({
    title: selection.title,
    category: selection.category,
    estimate: estimateServiceQuote(selection.config, selection.scope),
  }))

  let projectMin = 0
  let projectMax = 0
  let monthlyMin = 0
  let monthlyMax = 0

  for (const item of items) {
    if (item.estimate.billing === 'mensual') {
      monthlyMin += item.estimate.min
      monthlyMax += item.estimate.max
    } else {
      projectMin += item.estimate.min
      projectMax += item.estimate.max
    }
  }

  return {
    items,
    project: projectMin > 0 ? { min: roundMoney(projectMin), max: roundMoney(projectMax) } : null,
    monthly: monthlyMin > 0 ? { min: roundMoney(monthlyMin), max: roundMoney(monthlyMax) } : null,
  }
}

export function formatGroupEstimate(group: {
  project: { min: number; max: number } | null
  monthly: { min: number; max: number } | null
}) {
  const parts: string[] = []

  if (group.project) {
    const label = group.monthly ? ' (proyecto)' : ''
    parts.push(`${formatPen(group.project.min)} – ${formatPen(group.project.max)}${label}`)
  }
  if (group.monthly) {
    parts.push(`${formatPen(group.monthly.min)} – ${formatPen(group.monthly.max)} al mes`)
  }

  return parts.join(' + ')
}

export function buildGroupQuoteItems(group: QuoteGroupEstimate) {
  const items: Array<{ name: string; quantity: number }> = []

  for (const item of group.items) {
    items.push({
      name: `${item.title} — estimación referencial ${formatEstimate(
        item.estimate.min,
        item.estimate.max,
        item.estimate.billing,
      )}`,
      quantity: 1,
    })

    for (const line of item.estimate.lines) {
      if (line.quantity !== undefined) {
        if (line.quantity > 0) {
          items.push({ name: `${item.title}: ${line.label}`, quantity: line.quantity })
        }
      } else {
        items.push({ name: `${item.title}: ${line.label} — ${line.value}`, quantity: 1 })
      }
    }
  }

  return items
}

export function buildGroupQuoteNotes({
  group,
  comments,
  contactPreference,
}: {
  group: QuoteGroupEstimate
  comments?: string
  contactPreference?: string
}) {
  const preferenceLabels: Record<string, string> = {
    email: 'Correo electrónico',
    phone: 'Llamada telefónica',
    whatsapp: 'WhatsApp',
  }

  const lines = [
    'Solicitud desde el cotizador de servicios (SparkTree Systems).',
    `Servicios solicitados: ${group.items.length}.`,
  ]

  group.items.forEach((item, index) => {
    const scopeText = item.estimate.lines
      .map((line) => `${line.label}: ${line.value}`)
      .join(' · ')
    const scope = scopeText ? ` Alcance: ${scopeText}.` : ''
    lines.push(
      `${index + 1}. ${item.title} (${item.category}) — Estimación referencial: ${formatEstimate(
        item.estimate.min,
        item.estimate.max,
        item.estimate.billing,
      )}.${scope}`,
    )
  })

  lines.push(
    `Total estimado: ${formatGroupEstimate(group)}. El precio final puede variar según los requerimientos del cliente y el diagnóstico técnico.`,
    'No incluye IGV.',
  )

  if (contactPreference) {
    lines.push(`Preferencia de contacto: ${preferenceLabels[contactPreference] ?? contactPreference}.`)
  }
  if (comments) lines.push(`Comentarios del cliente: ${comments}`)

  return lines.join('\n')
}
