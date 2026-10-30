import type { jsPDF } from 'jspdf'

export type QuoteDocumentParty = {
  name: string
  contact?: string
  documentType?: string
  documentNumber?: string
  address?: string
  email?: string
  phone?: string
}

export type QuoteDocumentItem = {
  name: string
  description?: string
  sku?: string
  quantity: number
  unitPrice: number
}

export type QuoteDocumentIssuer = {
  name: string
  legalName?: string
  ruc?: string
  address?: string
  email?: string
  phone?: string
  website?: string
}

export type QuoteDocumentConditions = {
  paymentTerms?: string
  deliveryTime?: string
  warranty?: string
}

export type QuoteDocumentData = {
  code: string
  issuedAt: string
  validUntil?: string
  currency: 'PEN' | 'USD'
  igvPercent: number
  discount?: number
  client: QuoteDocumentParty
  issuer: QuoteDocumentIssuer
  items: QuoteDocumentItem[]
  conditions?: QuoteDocumentConditions
  notes?: string
  logoDataUrl?: string
}

export type QuoteDocumentTotals = {
  subtotal: number
  discount: number
  igv: number
  total: number
  itemCount: number
  unitCount: number
}

type Rgb = [number, number, number]

const PAGE = {
  width: 210,
  height: 297,
  margin: 16,
  contentBottom: 268,
  footerTop: 276,
}

const COLORS = {
  navy: [11, 18, 32] as Rgb,
  blue: [37, 99, 235] as Rgb,
  blueDark: [29, 78, 216] as Rgb,
  blueSoft: [239, 246, 255] as Rgb,
  blueMuted: [219, 234, 254] as Rgb,
  cyan: [34, 211, 238] as Rgb,
  slate: [71, 85, 105] as Rgb,
  slateLight: [100, 116, 139] as Rgb,
  muted: [148, 163, 184] as Rgb,
  border: [226, 232, 240] as Rgb,
  rowBorder: [233, 238, 246] as Rgb,
  surface: [248, 250, 252] as Rgb,
  white: [255, 255, 255] as Rgb,
  footerText: [226, 232, 240] as Rgb,
  footerMuted: [147, 197, 253] as Rgb,
  footerShape: [17, 28, 51] as Rgb,
}

const COLUMNS = [
  { x: 16, width: 8, align: 'center' as const },
  { x: 24, width: 46, align: 'left' as const },
  { x: 70, width: 62, align: 'left' as const },
  { x: 132, width: 12, align: 'right' as const },
  { x: 144, width: 24, align: 'right' as const },
  { x: 168, width: 26, align: 'right' as const },
]

const CELL_PADDING = 2

const CONDITIONS_DEFAULT = {
  paymentTerms: 'Transferencia o depósito bancario contra confirmación del pedido.',
  deliveryTime: 'Coordinado con un asesor según disponibilidad del stock.',
  warranty: 'Según condiciones del fabricante y políticas de F&J Solutions.',
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function computeQuoteDocumentTotals(data: QuoteDocumentData): QuoteDocumentTotals {
  const gross = data.items.reduce(
    (sum, item) => sum + Math.max(0, item.quantity) * Math.max(0, item.unitPrice),
    0
  )
  const discount = clamp(data.discount ?? 0, 0, gross)
  const total = gross - discount
  const rate = clamp(data.igvPercent, 0, 100) / 100
  const subtotal = rate > 0 ? total / (1 + rate) : total
  const igv = total - subtotal

  return {
    subtotal: round2(subtotal),
    discount: round2(discount),
    igv: round2(igv),
    total: round2(total),
    itemCount: data.items.length,
    unitCount: data.items.reduce((sum, item) => sum + Math.max(0, item.quantity), 0),
  }
}

export function quoteDocumentFileName(code: string): string {
  const safe = code.replace(/[^\w.-]+/g, '-').replace(/-+/g, '-')
  return `Cotizacion-${safe}.pdf`
}

export async function loadImageDataUrl(url: string): Promise<string | null> {
  if (typeof window === 'undefined' || typeof FileReader === 'undefined') return null
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const blob = await response.blob()
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function formatDate(value?: string): string {
  if (!value) return 'Sin fecha'
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatIssuedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function currencySymbol(currency: QuoteDocumentData['currency']): string {
  return currency === 'USD' ? 'US$' : 'S/'
}

function formatMoney(value: number, currency: QuoteDocumentData['currency']): string {
  const amount = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))
  return `${value < 0 ? '-' : ''}${currencySymbol(currency)} ${amount}`
}

function setText(doc: jsPDF, color: Rgb) {
  doc.setTextColor(color[0], color[1], color[2])
}

function setFill(doc: jsPDF, color: Rgb) {
  doc.setFillColor(color[0], color[1], color[2])
}

function setDraw(doc: jsPDF, color: Rgb) {
  doc.setDrawColor(color[0], color[1], color[2])
}

function wrap(
  doc: jsPDF,
  text: string,
  width: number,
  size: number,
  style: 'normal' | 'bold' | 'italic' = 'normal'
): string[] {
  doc.setFont('helvetica', style)
  doc.setFontSize(size)
  return doc.splitTextToSize(text, width) as string[]
}

function drawWordmark(doc: jsPDF, x: number, y: number) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  setText(doc, COLORS.navy)
  doc.text('F&J', x, y + 8)
  const width = doc.getTextWidth('F&J')
  doc.setFontSize(8)
  setText(doc, COLORS.blue)
  doc.text('SYSTEMS', x + width + 1.2, y + 8)
}

function drawTopDecor(doc: jsPDF) {
  setFill(doc, COLORS.blueSoft)
  doc.ellipse(209, 2, 54, 44, 'F')
  setFill(doc, COLORS.blueMuted)
  doc.ellipse(216, 27, 17, 17, 'F')
  setFill(doc, COLORS.cyan)
  doc.circle(184, 21, 1.3, 'F')
  setFill(doc, COLORS.blue)
  doc.circle(177, 26.5, 0.9, 'F')
}

function drawFirstHeader(doc: jsPDF, data: QuoteDocumentData): number {
  drawTopDecor(doc)

  if (data.logoDataUrl) {
    try {
      doc.addImage(data.logoDataUrl, 'PNG', PAGE.margin, 13, 46, 23)
    } catch {
      drawWordmark(doc, PAGE.margin, 14)
    }
  } else {
    drawWordmark(doc, PAGE.margin, 14)
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.9)
  setText(doc, COLORS.slateLight)
  doc.text(`${data.issuer.name} · Soluciones tecnológicas para empresas`, PAGE.margin, 41.5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  setText(doc, COLORS.navy)
  doc.text('COTIZACIÓN', PAGE.width - PAGE.margin, 24, { align: 'right' })

  doc.setFontSize(8.4)
  setText(doc, COLORS.blue)
  doc.text(data.code, PAGE.width - PAGE.margin, 31, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.9)
  setText(doc, COLORS.slateLight)
  doc.text(`Emisión ${formatIssuedAt(data.issuedAt)}`, PAGE.width - PAGE.margin, 37.4, {
    align: 'right',
  })
  doc.text(
    data.validUntil ? `Vence ${formatDate(data.validUntil)}` : 'Vigencia por confirmar',
    PAGE.width - PAGE.margin,
    42,
    { align: 'right' }
  )

  setFill(doc, COLORS.blue)
  doc.rect(PAGE.margin, 49, 18, 1.5, 'F')
  setDraw(doc, COLORS.border)
  doc.setLineWidth(0.3)
  doc.line(36, 49.75, PAGE.width - PAGE.margin, 49.75)

  return 58
}

function drawContinuationHeader(doc: jsPDF, data: QuoteDocumentData): number {
  setFill(doc, COLORS.blueSoft)
  doc.ellipse(214, -8, 34, 30, 'F')

  if (data.logoDataUrl) {
    try {
      doc.addImage(data.logoDataUrl, 'PNG', PAGE.margin, 11, 30, 15)
    } catch {
      drawWordmark(doc, PAGE.margin, 11)
    }
  } else {
    drawWordmark(doc, PAGE.margin, 11)
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  setText(doc, COLORS.navy)
  doc.text('COTIZACIÓN', PAGE.width - PAGE.margin, 18, { align: 'right' })
  doc.setFontSize(7.4)
  setText(doc, COLORS.blue)
  doc.text(data.code, PAGE.width - PAGE.margin, 22.6, { align: 'right' })

  setDraw(doc, COLORS.border)
  doc.setLineWidth(0.3)
  doc.line(PAGE.margin, 30, PAGE.width - PAGE.margin, 30)
  setFill(doc, COLORS.blue)
  doc.rect(PAGE.margin, 29.4, 12, 1.2, 'F')

  return 38
}

type PartyBlock = {
  label: string
  nameLines: string[]
  contactLines: string[]
  detailLines: string[]
  height: number
}

function buildPartyBlock(
  doc: jsPDF,
  label: string,
  party: QuoteDocumentParty,
  width: number
): PartyBlock {
  const nameLines = wrap(doc, party.name || 'Sin nombre registrado', width, 9.4, 'bold')
  const contactLines = party.contact ? wrap(doc, party.contact, width, 7.1) : []
  const details: string[] = []

  if (party.documentNumber) {
    details.push(`${party.documentType || 'Documento'} ${party.documentNumber}`)
  }
  if (party.address) details.push(party.address)
  if (party.email) details.push(party.email)
  if (party.phone) details.push(party.phone)

  const detailLines = details.flatMap((line) => wrap(doc, line, width, 6.9))
  const height =
    10.5 +
    nameLines.length * 4.3 +
    (contactLines.length ? contactLines.length * 3.5 + 0.8 : 0) +
    detailLines.length * 3.6 +
    4

  return { label, nameLines, contactLines, detailLines, height }
}

function drawPartyBlock(doc: jsPDF, x: number, y: number, width: number, height: number, block: PartyBlock) {
  setFill(doc, COLORS.surface)
  setDraw(doc, COLORS.border)
  doc.setLineWidth(0.3)
  doc.roundedRect(x, y, width, height, 2.4, 2.4, 'FD')

  setFill(doc, COLORS.blue)
  doc.rect(x + 5, y + 5.1, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.1)
  setText(doc, COLORS.blue)
  doc.text(block.label, x + 9, y + 6.9)

  let cursor = y + 12
  doc.setFontSize(9.4)
  setText(doc, COLORS.navy)
  doc.text(block.nameLines, x + 5, cursor)
  cursor += block.nameLines.length * 4.3

  if (block.contactLines.length) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.1)
    setText(doc, COLORS.slate)
    doc.text(block.contactLines, x + 5, cursor + 0.6)
    cursor += block.contactLines.length * 3.5 + 0.8
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.9)
  setText(doc, COLORS.slateLight)
  if (block.detailLines.length) {
    doc.text(block.detailLines, x + 5, cursor + 1)
  }
}

function drawSectionTitle(doc: jsPDF, y: number, title: string): number {
  setFill(doc, COLORS.blue)
  doc.rect(PAGE.margin, y - 2, 2.2, 2.2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.4)
  setText(doc, COLORS.navy)
  doc.text(title, PAGE.margin + 4.4, y)

  setDraw(doc, COLORS.border)
  doc.setLineWidth(0.3)
  doc.line(PAGE.margin + 4.4 + doc.getTextWidth(title) + 3, y - 0.8, PAGE.width - PAGE.margin, y - 0.8)

  return y + 5.4
}

function drawTableHeader(doc: jsPDF, y: number): number {
  setFill(doc, COLORS.blue)
  doc.rect(PAGE.margin, y, PAGE.width - PAGE.margin * 2, 8.6, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.2)
  setText(doc, COLORS.white)

  const labels = ['N.º', 'PRODUCTO', 'DESCRIPCIÓN', 'CANT.', 'P. UNIT.', 'SUBTOTAL']
  labels.forEach((label, index) => {
    const column = COLUMNS[index]
    const x =
      column.align === 'right'
        ? column.x + column.width - CELL_PADDING
        : column.align === 'center'
          ? column.x + column.width / 2
          : column.x + CELL_PADDING
    doc.text(label, x, y + 5.5, { align: column.align === 'left' ? 'left' : column.align })
  })

  return y + 8.6
}

function drawEmptyRow(doc: jsPDF, y: number): number {
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.4)
  setText(doc, COLORS.muted)
  doc.text('Esta cotización aún no tiene productos agregados.', PAGE.width / 2, y + 7, {
    align: 'center',
  })
  setDraw(doc, COLORS.rowBorder)
  doc.setLineWidth(0.25)
  doc.line(PAGE.margin, y + 13, PAGE.width - PAGE.margin, y + 13)
  return y + 13
}

function drawItemRow(
  doc: jsPDF,
  y: number,
  item: QuoteDocumentItem,
  index: number,
  currency: QuoteDocumentData['currency']
): number {
  const productWidth = COLUMNS[1].width - CELL_PADDING * 2
  const descriptionWidth = COLUMNS[2].width - CELL_PADDING * 2
  const nameLines = wrap(doc, item.name || 'Producto', productWidth, 7.6, 'bold')
  const skuLines = item.sku ? wrap(doc, item.sku, productWidth, 6.1, 'normal') : []
  const descriptionLines = item.description
    ? wrap(doc, item.description, descriptionWidth, 6.7).slice(0, 8)
    : []

  const productHeight = nameLines.length * 3.6 + (skuLines.length ? skuLines.length * 3.1 + 0.7 : 0)
  const contentHeight = Math.max(productHeight, descriptionLines.length * 3.35, 5)
  const rowHeight = contentHeight + 4.8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.9)
  setText(doc, COLORS.muted)
  doc.text(String(index + 1), COLUMNS[0].x + COLUMNS[0].width / 2, y + 5.9, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.6)
  setText(doc, COLORS.navy)
  doc.text(nameLines, COLUMNS[1].x + CELL_PADDING, y + 5.9)

  let cursor = y + 5.9 + nameLines.length * 3.6
  if (skuLines.length) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.1)
    setText(doc, COLORS.muted)
    doc.text(skuLines, COLUMNS[1].x + CELL_PADDING, cursor + 0.4)
    cursor += skuLines.length * 3.1 + 0.7
  }

  if (descriptionLines.length) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.7)
    setText(doc, COLORS.slate)
    doc.text(descriptionLines, COLUMNS[2].x + CELL_PADDING, y + 5.6)
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.3)
  setText(doc, COLORS.slate)
  doc.text(String(item.quantity), COLUMNS[3].x + COLUMNS[3].width - CELL_PADDING, y + 5.9, {
    align: 'right',
  })
  doc.text(
    formatMoney(item.unitPrice, currency),
    COLUMNS[4].x + COLUMNS[4].width - CELL_PADDING,
    y + 5.9,
    { align: 'right' }
  )

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.7)
  setText(doc, COLORS.navy)
  doc.text(
    formatMoney(item.unitPrice * item.quantity, currency),
    COLUMNS[5].x + COLUMNS[5].width - CELL_PADDING,
    y + 5.9,
    { align: 'right' }
  )

  setDraw(doc, COLORS.rowBorder)
  doc.setLineWidth(0.25)
  doc.line(PAGE.margin, y + rowHeight, PAGE.width - PAGE.margin, y + rowHeight)

  return y + rowHeight
}

function drawTotals(doc: jsPDF, y: number, data: QuoteDocumentData, totals: QuoteDocumentTotals): number {
  const x = 122
  const width = 72
  const valueX = PAGE.width - PAGE.margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.1)
  setText(doc, COLORS.muted)
  doc.text('RESUMEN DE IMPORTES', valueX, y, { align: 'right' })

  let cursor = y + 5.2
  const rows: { label: string; value: string }[] = [
    { label: 'Subtotal (sin IGV)', value: formatMoney(totals.subtotal, data.currency) },
  ]
  if (totals.discount > 0) {
    rows.push({ label: 'Descuento', value: `- ${formatMoney(totals.discount, data.currency)}` })
  }
  if (totals.igv > 0) {
    rows.push({
      label: `IGV (${data.igvPercent}%)`,
      value: formatMoney(totals.igv, data.currency),
    })
  }

  rows.forEach((row) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.2)
    setText(doc, COLORS.slate)
    doc.text(row.label, x, cursor + 3.8)
    doc.setFont('helvetica', 'bold')
    setText(doc, COLORS.navy)
    doc.text(row.value, valueX, cursor + 3.8, { align: 'right' })
    setDraw(doc, COLORS.rowBorder)
    doc.setLineWidth(0.25)
    doc.line(x, cursor + 6, valueX, cursor + 6)
    cursor += 6
  })

  cursor += 1.4
  setFill(doc, COLORS.blue)
  doc.roundedRect(x, cursor, width, 12, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.4)
  setText(doc, COLORS.white)
  doc.text('TOTAL', x + 4, cursor + 7.6)
  doc.setFontSize(13.2)
  doc.text(formatMoney(totals.total, data.currency), valueX - 2, cursor + 8.1, {
    align: 'right',
  })

  cursor += 15.6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.1)
  setText(doc, COLORS.muted)
  doc.text(
    `Precios en ${data.currency === 'USD' ? 'dólares' : 'soles'}${totals.igv > 0 ? ' · IGV incluido' : ''}`,
    valueX,
    cursor,
    { align: 'right' }
  )

  return cursor + 2
}

function drawConditions(doc: jsPDF, y: number, data: QuoteDocumentData): number {
  const width = PAGE.width - PAGE.margin * 2
  const leftWidth = 84
  const rightX = PAGE.margin + 98
  const rightWidth = width - 102

  const conditionRows = [
    {
      label: 'FORMA DE PAGO',
      value: data.conditions?.paymentTerms || CONDITIONS_DEFAULT.paymentTerms,
    },
    {
      label: 'VIGENCIA',
      value: data.validUntil
        ? `Hasta el ${formatDate(data.validUntil)}`
        : '15 días calendario desde la emisión.',
    },
    {
      label: 'TIEMPO DE ENTREGA',
      value: data.conditions?.deliveryTime || CONDITIONS_DEFAULT.deliveryTime,
    },
    {
      label: 'GARANTÍA',
      value: data.conditions?.warranty || CONDITIONS_DEFAULT.warranty,
    },
  ].map((row) => ({
    label: row.label,
    lines: wrap(doc, row.value, leftWidth, 6.8),
  }))

  const notes = data.notes?.trim() || 'Sin observaciones adicionales.'
  let notesLines = wrap(doc, notes, rightWidth, 6.8)

  const leftHeight = conditionRows.reduce((sum, row) => sum + 3 + row.lines.length * 3.3 + 2.2, 0)
  let blockHeight = 15 + Math.max(leftHeight, notesLines.length * 3.3) + 5

  const available = PAGE.contentBottom - y
  const fullPage = PAGE.contentBottom - 38
  if (blockHeight > available && blockHeight <= fullPage) {
    return -1
  }
  if (blockHeight > available) {
    const overflow = blockHeight - available
    const removable = Math.ceil(overflow / 3.3)
    notesLines = notesLines.slice(0, Math.max(1, notesLines.length - removable))
    blockHeight = 15 + Math.max(leftHeight, notesLines.length * 3.3) + 5
  }

  setFill(doc, COLORS.surface)
  setDraw(doc, COLORS.border)
  doc.setLineWidth(0.3)
  doc.roundedRect(PAGE.margin, y, width, blockHeight, 2.4, 2.4, 'FD')

  setFill(doc, COLORS.blue)
  doc.rect(PAGE.margin + 5, y + 5.1, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.1)
  setText(doc, COLORS.blue)
  doc.text('CONDICIONES COMERCIALES', PAGE.margin + 9, y + 6.9)

  let cursor = y + 13.6
  conditionRows.forEach((row) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(5.9)
    setText(doc, COLORS.muted)
    doc.text(row.label, PAGE.margin + 5, cursor)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.8)
    setText(doc, COLORS.slate)
    doc.text(row.lines, PAGE.margin + 5, cursor + 3.3)
    cursor += 3.3 + row.lines.length * 3.3 + 2.2
  })

  setDraw(doc, COLORS.border)
  doc.setLineWidth(0.25)
  doc.line(rightX - 6, y + 10.5, rightX - 6, y + blockHeight - 5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(5.9)
  setText(doc, COLORS.muted)
  doc.text('OBSERVACIONES', rightX, y + 13.6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.8)
  setText(doc, COLORS.slate)
  doc.text(notesLines, rightX, y + 17)

  return y + blockHeight
}

function drawFooter(doc: jsPDF, data: QuoteDocumentData, totalPages: number) {
  const website = data.issuer.website || ''
  const contactLine = [data.issuer.name, data.issuer.email, website].filter(Boolean).join(' · ')
  const addressLine = [data.issuer.address, data.issuer.phone].filter(Boolean).join(' · ')

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page)

    setFill(doc, COLORS.navy)
    doc.rect(0, PAGE.footerTop, PAGE.width, PAGE.height - PAGE.footerTop, 'F')
    setFill(doc, COLORS.footerShape)
    doc.ellipse(212, 300, 62, 24, 'F')
    setFill(doc, COLORS.blue)
    doc.rect(0, PAGE.footerTop, PAGE.width, 1, 'F')
    setFill(doc, COLORS.cyan)
    doc.circle(187, PAGE.footerTop + 5.2, 1.1, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.6)
    setText(doc, COLORS.footerText)
    doc.text(contactLine, PAGE.margin, PAGE.footerTop + 8.4)
    doc.setFontSize(6.3)
    doc.text(addressLine, PAGE.margin, PAGE.footerTop + 13.2)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.6)
    setText(doc, COLORS.footerMuted)
    doc.text(data.code, PAGE.width - PAGE.margin, PAGE.footerTop + 8.4, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.3)
    setText(doc, COLORS.footerText)
    doc.text(`Página ${page} de ${totalPages}`, PAGE.width - PAGE.margin, PAGE.footerTop + 13.2, {
      align: 'right',
    })
  }
}

export async function createQuoteDocument(data: QuoteDocumentData): Promise<jsPDF> {
  const { jsPDF: JsPdf } = await import('jspdf')
  const doc = new JsPdf({ unit: 'mm', format: 'a4', compress: true })

  doc.setProperties({
    title: `Cotización ${data.code}`,
    subject: 'Propuesta comercial',
    author: data.issuer.name,
    creator: data.issuer.name,
  })

  const totals = computeQuoteDocumentTotals(data)
  let y = drawFirstHeader(doc, data)

  const clientBlock = buildPartyBlock(doc, 'CLIENTE', data.client, 76)
  const issuerBlock = buildPartyBlock(
    doc,
    'EMISOR',
    {
      name: data.issuer.legalName || data.issuer.name,
      contact: data.issuer.name,
      documentType: 'RUC',
      documentNumber: data.issuer.ruc,
      address: data.issuer.address,
      email: data.issuer.email,
      phone: data.issuer.phone,
    },
    76
  )
  const cardHeight = Math.max(clientBlock.height, issuerBlock.height, 30)
  const cardWidth = 86

  drawPartyBlock(doc, PAGE.margin, y, cardWidth, cardHeight, clientBlock)
  drawPartyBlock(doc, PAGE.margin + cardWidth + 6, y, cardWidth, cardHeight, issuerBlock)

  y += cardHeight + 12
  y = drawSectionTitle(doc, y, 'DETALLE DE PRODUCTOS Y SERVICIOS')
  y = drawTableHeader(doc, y)

  if (data.items.length === 0) {
    y = drawEmptyRow(doc, y)
  } else {
    data.items.forEach((item, index) => {
      const productWidth = COLUMNS[1].width - CELL_PADDING * 2
      const descriptionWidth = COLUMNS[2].width - CELL_PADDING * 2
      const nameLines = wrap(doc, item.name || 'Producto', productWidth, 7.6, 'bold')
      const skuLines = item.sku ? wrap(doc, item.sku, productWidth, 6.1) : []
      const descriptionLines = item.description
        ? wrap(doc, item.description, descriptionWidth, 6.7).slice(0, 8)
        : []
      const rowHeight =
        Math.max(
          nameLines.length * 3.6 + (skuLines.length ? skuLines.length * 3.1 + 0.7 : 0),
          descriptionLines.length * 3.35,
          5
        ) + 4.8

      if (y + rowHeight > PAGE.contentBottom) {
        doc.addPage()
        y = drawContinuationHeader(doc, data)
        y = drawSectionTitle(doc, y, 'DETALLE DE PRODUCTOS Y SERVICIOS')
        y = drawTableHeader(doc, y)
      }

      y = drawItemRow(doc, y, item, index, data.currency)
    })
  }

  y += 9
  const totalsHeight = 5.2 + (totals.discount > 0 ? 6 : 0) + (totals.igv > 0 ? 6 : 0) + 6 + 15.6 + 2
  if (y + totalsHeight > PAGE.contentBottom) {
    doc.addPage()
    y = drawContinuationHeader(doc, data)
  }
  y = drawTotals(doc, y, data, totals)

  y += 8
  let conditionsEnd = drawConditions(doc, y, data)
  if (conditionsEnd === -1) {
    doc.addPage()
    y = drawContinuationHeader(doc, data)
    conditionsEnd = drawConditions(doc, y, data)
  }

  drawFooter(doc, data, doc.getNumberOfPages())
  return doc
}

export async function createQuoteDocumentBlob(data: QuoteDocumentData): Promise<Blob> {
  const doc = await createQuoteDocument(data)
  return doc.output('blob')
}
