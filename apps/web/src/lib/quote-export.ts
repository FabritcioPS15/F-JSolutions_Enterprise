import { EMPRESA } from '@/lib/constants'
import { documentLabel, formatQuoteDate, type SavedQuote } from '@/lib/account'

const CONTACT_PREFERENCES: Record<SavedQuote['contactPreference'], string> = {
  email: 'Email',
  phone: 'Llamada telefónica',
  whatsapp: 'WhatsApp',
}

function whatsappNumber(): string {
  return EMPRESA.redesSociales.whatsapp.replace(/\D/g, '')
}

export function buildQuoteWhatsAppMessage(quote: SavedQuote): string {
  const lines = [
    `Hola ${EMPRESA.nombre}, acabo de enviar la cotización *${quote.code}*.`,
    '',
    'Productos solicitados:',
    ...quote.items.map(
      (item) => `• ${item.quantity} x ${item.productName}${item.productModel ? ` (${item.productModel})` : ''}`,
    ),
    '',
    `Contacto: ${quote.contactName}`,
    quote.companyName ? `Empresa: ${quote.companyName}` : '',
    quote.documentNumber ? `${documentLabel(quote.documentType)}: ${quote.documentNumber}` : '',
    `Email: ${quote.contactEmail}`,
    `Teléfono: ${quote.contactPhone}`,
    quote.generalNotes ? `Comentarios: ${quote.generalNotes}` : '',
  ].filter(Boolean)

  return lines.join('\n')
}

export function buildQuoteWhatsAppUrl(quote: SavedQuote): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(buildQuoteWhatsAppMessage(quote))}`
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

type PdfColor = [number, number, number]

const PAGE = {
  width: 210,
  height: 297,
  frame: 10,
  margin: 18,
  footerLine: 270,
  contentBottom: 261,
  colors: {
    dark: [15, 23, 42] as PdfColor,
    blue: [37, 99, 235] as PdfColor,
    gray: [100, 116, 139] as PdfColor,
    border: [226, 232, 240] as PdfColor,
    light: [248, 250, 252] as PdfColor,
    white: [255, 255, 255] as PdfColor,
  },
}

type InfoLine = {
  text: string
  style: 'label' | 'strong' | 'normal'
}

type PreparedLine = {
  line: InfoLine
  wrapped: string[]
  lineHeight: number
}

function sanitizeFileName(value: string): string {
  return value.replace(/[^\w.-]+/g, '-').replace(/-+/g, '-')
}

export async function downloadQuotePdf(quote: SavedQuote): Promise<boolean> {
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })

    const { width, height, frame, margin, footerLine, contentBottom, colors } = PAGE
    const contentWidth = width - margin * 2

    const setText = (color: PdfColor) => doc.setTextColor(color[0], color[1], color[2])
    const setDraw = (color: PdfColor) => doc.setDrawColor(color[0], color[1], color[2])
    const setFill = (color: PdfColor) => doc.setFillColor(color[0], color[1], color[2])

    const prepareLines = (lines: InfoLine[], maxWidth: number) => {
      let total = 0
      const prepared: PreparedLine[] = lines.map((line) => {
        doc.setFont('helvetica', line.style === 'normal' ? 'normal' : 'bold')
        doc.setFontSize(line.style === 'label' ? 6.5 : line.style === 'strong' ? 9.5 : 8)
        const wrapped = doc.splitTextToSize(line.text, maxWidth) as string[]
        const lineHeight = line.style === 'label' ? 3.8 : line.style === 'strong' ? 5 : 4.5
        total += wrapped.length * lineHeight + (line.style === 'label' ? 1.8 : 0.9)
        return { line, wrapped, lineHeight }
      })
      return { prepared, height: total }
    }

    const drawPreparedLines = (x: number, startY: number, prepared: PreparedLine[]) => {
      let cursor = startY
      for (const entry of prepared) {
        if (entry.line.style === 'label') {
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(6.5)
          setText(colors.blue)
        } else if (entry.line.style === 'strong') {
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(9.5)
          setText(colors.dark)
        } else {
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          setText(colors.gray)
        }
        doc.text(entry.wrapped, x, cursor)
        cursor += entry.wrapped.length * entry.lineHeight + (entry.line.style === 'label' ? 1.8 : 0.9)
      }
    }

    // Dibuja el marco del documento y el encabezado de la página.
    const drawPageShell = (isFirstPage: boolean) => {
      setFill(colors.white)
      setDraw(colors.border)
      doc.setLineWidth(0.4)
      doc.roundedRect(frame, frame, width - frame * 2, height - frame * 2, 3, 3, 'FD')

      if (isFirstPage) {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(19)
        setText(colors.dark)
        doc.text('FJ', margin, 25)
        const brandWidth = doc.getTextWidth('FJ ')
        setText(colors.blue)
        doc.text('Solutions', margin + brandWidth, 25)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7.5)
        setText(colors.gray)
        doc.text(EMPRESA.tagline, margin, 30)

        const metaWidth = 64
        const metaX = width - margin - metaWidth
        setFill(colors.light)
        setDraw(colors.border)
        doc.setLineWidth(0.3)
        doc.roundedRect(metaX, 15, metaWidth, 20, 2, 2, 'FD')

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6.5)
        setText(colors.blue)
        doc.text('COTIZACIÓN', metaX + 4, 20.5)

        doc.setFontSize(10)
        setText(colors.dark)
        doc.text(quote.code, metaX + 4, 26.5)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        setText(colors.gray)
        doc.text(formatQuoteDate(quote.createdAt), metaX + 4, 31.5)

        setDraw(colors.blue)
        doc.setLineWidth(1.1)
        doc.line(margin, 38, width - margin, 38)

        return 47
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      setText(colors.dark)
      doc.text('FJ', margin, 23)
      const brandWidth = doc.getTextWidth('FJ ')
      setText(colors.blue)
      doc.text('Solutions', margin + brandWidth, 23)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      setText(colors.gray)
      doc.text(`Cotización ${quote.code}`, width - margin, 23, { align: 'right' })

      setDraw(colors.blue)
      doc.setLineWidth(0.8)
      doc.line(margin, 27, width - margin, 27)

      return 36
    }

    let y = drawPageShell(true)

    // ── Datos del cliente / empresa ─────────────────────────────────────────
    const cardPadding = 5
    const gap = 6
    const columnWidth = (contentWidth - gap) / 2

    const contactLines: InfoLine[] = [
      { text: 'DATOS DEL CLIENTE', style: 'label' },
      { text: quote.contactName, style: 'strong' },
      { text: quote.contactEmail, style: 'normal' },
      { text: quote.contactPhone, style: 'normal' },
      { text: `Contacto preferido: ${CONTACT_PREFERENCES[quote.contactPreference]}`, style: 'normal' },
    ]

    const companyLines: InfoLine[] = [
      { text: 'EMPRESA Y DOCUMENTO', style: 'label' },
      { text: quote.companyName || 'Persona natural', style: 'strong' },
      {
        text: quote.documentNumber
          ? `${documentLabel(quote.documentType)}: ${quote.documentNumber}`
          : 'Sin documento registrado',
        style: 'normal',
      },
    ]

    const contactBlock = prepareLines(contactLines, columnWidth - cardPadding * 2)
    const companyBlock = prepareLines(companyLines, columnWidth - cardPadding * 2)
    const blockHeight = Math.max(contactBlock.height, companyBlock.height) + cardPadding * 2

    setFill(colors.light)
    setDraw(colors.border)
    doc.setLineWidth(0.3)
    doc.roundedRect(margin, y, columnWidth, blockHeight, 2, 2, 'FD')
    doc.roundedRect(margin + columnWidth + gap, y, columnWidth, blockHeight, 2, 2, 'FD')

    drawPreparedLines(margin + cardPadding, y + cardPadding + 3, contactBlock.prepared)
    drawPreparedLines(margin + columnWidth + gap + cardPadding, y + cardPadding + 3, companyBlock.prepared)

    y += blockHeight + 12

    // ── Título de la tabla ──────────────────────────────────────────────────
    setFill(colors.blue)
    doc.rect(margin, y - 3.2, 2.4, 2.4, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    setText(colors.dark)
    doc.text('Detalle de productos', margin + 5, y)

    y += 6

    // ── Tabla de productos ──────────────────────────────────────────────────
    const qtyWidth = 18
    const indexWidth = 10
    const productWidth = contentWidth - qtyWidth - indexWidth
    const cellPadding = 2.5

    const drawTableHeader = () => {
      setFill(colors.dark)
      doc.rect(margin, y, contentWidth, 8, 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.8)
      setText(colors.white)
      doc.text('N.º', margin + cellPadding, y + 5.2)
      doc.text('PRODUCTO', margin + indexWidth + cellPadding, y + 5.2)
      doc.text('CANT.', width - margin - cellPadding, y + 5.2, { align: 'right' })

      y += 8
    }

    drawTableHeader()

    quote.items.forEach((item, index) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      const nameLines = doc.splitTextToSize(item.productName, productWidth - cellPadding * 2) as string[]

      const meta = item.productModel || item.productSku || ''
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      const metaLines = meta ? (doc.splitTextToSize(meta, productWidth - cellPadding * 2) as string[]) : []

      const noteLines = item.notes
        ? (doc.splitTextToSize(`Nota: ${item.notes}`, productWidth - cellPadding * 2) as string[])
        : []

      const rowHeight =
        6 + nameLines.length * 4.2 + (metaLines.length ? 3.4 : 0) + (noteLines.length ? noteLines.length * 3.6 + 1.4 : 0) + 4

      if (y + rowHeight > contentBottom) {
        doc.addPage()
        y = drawPageShell(false)
        drawTableHeader()
      }

      if (index % 2 === 1) {
        setFill(colors.light)
        doc.rect(margin, y, contentWidth, rowHeight, 'F')
      }

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      setText(colors.gray)
      doc.text(String(index + 1), margin + cellPadding, y + 5)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      setText(colors.dark)
      doc.text(nameLines, margin + indexWidth + cellPadding, y + 5)

      let cursor = y + 5 + nameLines.length * 4.2
      if (metaLines.length) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        setText(colors.gray)
        doc.text(metaLines, margin + indexWidth + cellPadding, cursor)
        cursor += metaLines.length * 3.4
      }

      if (noteLines.length) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(7)
        setText(colors.gray)
        doc.text(noteLines, margin + indexWidth + cellPadding, cursor + 0.6)
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      setText(colors.dark)
      doc.text(String(item.quantity), width - margin - cellPadding, y + 5, { align: 'right' })

      setDraw(colors.border)
      doc.setLineWidth(0.25)
      doc.line(margin, y + rowHeight, width - margin, y + rowHeight)

      y += rowHeight
    })

    // ── Totales y validez ───────────────────────────────────────────────────
    y += 6
    const totalsWidth = 62
    const totalsX = width - margin - totalsWidth
    const totalsHeight = 18

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setText(colors.gray)
    const validity = doc.splitTextToSize(
      'Cotización válida por 15 días calendario. Los precios y la disponibilidad se confirman en la propuesta enviada por un asesor.',
      totalsX - margin - 8,
    ) as string[]
    doc.text(validity, margin, y + 5)

    setFill(colors.light)
    setDraw(colors.border)
    doc.setLineWidth(0.3)
    doc.roundedRect(totalsX, y, totalsWidth, totalsHeight, 2, 2, 'FD')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setText(colors.gray)
    doc.text('Ítems', totalsX + 4, y + 6.5)
    doc.text('Unidades', totalsX + 4, y + 12.5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setText(colors.dark)
    doc.text(String(quote.items.length), totalsX + totalsWidth - 4, y + 6.5, { align: 'right' })
    doc.text(String(quote.itemCount), totalsX + totalsWidth - 4, y + 12.5, { align: 'right' })

    y += totalsHeight + 10

    // ── Comentarios ─────────────────────────────────────────────────────────
    if (quote.generalNotes) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      const notesLines = doc.splitTextToSize(quote.generalNotes, contentWidth - cardPadding * 2) as string[]
      const notesHeight = 11 + notesLines.length * 4.2

      if (y + notesHeight > contentBottom) {
        doc.addPage()
        y = drawPageShell(false)
      }

      setFill(colors.light)
      setDraw(colors.border)
      doc.setLineWidth(0.3)
      doc.roundedRect(margin, y, contentWidth, notesHeight, 2, 2, 'FD')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      setText(colors.blue)
      doc.text('COMENTARIOS', margin + cardPadding, y + 5)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      setText(colors.gray)
      doc.text(notesLines, margin + cardPadding, y + 10)

      y += notesHeight + 6
    }

    // ── Pie de página ───────────────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages()
    for (let page = 1; page <= totalPages; page += 1) {
      doc.setPage(page)

      setDraw(colors.border)
      doc.setLineWidth(0.3)
      doc.line(margin, footerLine, width - margin, footerLine)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.5)
      setText(colors.gray)
      doc.text(`${EMPRESA.nombre} · ${EMPRESA.telefono} · ${EMPRESA.email}`, margin, footerLine + 5)
      doc.text(`${EMPRESA.direccion} · ${EMPRESA.horario}`, margin, footerLine + 9)
      doc.text(quote.code, width - margin, footerLine + 5, { align: 'right' })
      doc.text(`Página ${page} de ${totalPages}`, width - margin, footerLine + 9, { align: 'right' })
    }

    doc.save(`${sanitizeFileName(`Cotizacion-${quote.code}`)}.pdf`)
    return true
  } catch (error) {
    console.error('Error generating quote PDF:', error)
    return false
  }
}
