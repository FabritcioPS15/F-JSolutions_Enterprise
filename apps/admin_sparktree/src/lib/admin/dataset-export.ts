import { downloadFile } from './format'
import {
  downloadExcel,
  excelFileName,
  type ExcelSheet,
  type ExcelSheetColumn,
  type ExcelValue,
} from './excel'

export type ExportFormat = 'excel' | 'csv' | 'pdf' | 'json'

export type DatasetExport = {
  prefix: string
  title: string
  sheets: ExcelSheet[]
  json?: unknown
}

export const exportFormatLabels: Record<ExportFormat, string> = {
  excel: 'Excel',
  csv: 'CSV',
  pdf: 'PDF',
  json: 'JSON',
}

export function datasetFileName(
  prefix: string,
  format: ExportFormat,
  date = new Date()
): string {
  const stamp = date.toISOString().slice(0, 10)
  const extension = format === 'excel' ? 'xlsx' : format
  return `${prefix}-fj-systems-${stamp}.${extension}`
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function formatDate(value: Date, format?: string): string {
  const date = `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`
  return format === 'dd/mm/yyyy' ? date : `${date} ${pad(value.getHours())}:${pad(value.getMinutes())}`
}

function formatNumber(value: number, format?: string): string {
  const decimals = format === '#,##0.00' ? 2 : format === '#,##0' ? 0 : Number.isInteger(value) ? 0 : 2
  return value.toLocaleString('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function cellText(value: ExcelValue, column: ExcelSheetColumn): string {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return formatDate(value, column.format)
  if (typeof value === 'number') return String(value)
  return String(value)
}

function escapeCsv(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

function sheetToCsv(sheet: ExcelSheet): string {
  const headers = sheet.columns.map((column) => escapeCsv(column.header))
  const rows = sheet.rows.map((row) =>
    row.map((value, index) => escapeCsv(cellText(value, sheet.columns[index]))).join(',')
  )
  return [headers.join(','), ...rows].join('\r\n')
}

function pdfCellText(value: ExcelValue, column: ExcelSheetColumn): string {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return formatDate(value, column.format)
  if (typeof value === 'number') return formatNumber(value, column.format)
  const text = String(value).replace(/\s+/g, ' ').trim()
  return text.length > 180 ? `${text.slice(0, 177)}…` : text
}

function pdfAlign(
  column: ExcelSheetColumn,
  value: ExcelValue
): 'left' | 'center' | 'right' {
  if (column.align) return column.align
  if (value instanceof Date) return 'center'
  if (typeof value === 'number') return 'right'
  return 'left'
}

async function downloadPdf(dataset: DatasetExport) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 12
  const marginTop = 16
  const marginBottom = 14
  const usableWidth = pageWidth - marginX * 2
  const fontSize = 7
  const headerFontSize = 6.5
  const lineHeight = 3.1
  const paddingY = 1.8
  const minRowHeight = 6

  dataset.sheets.forEach((sheet, sheetIndex) => {
    if (sheetIndex > 0) doc.addPage()

    const weights = sheet.columns.map((column) => column.width ?? 18)
    const totalWeight = weights.reduce((total, weight) => total + weight, 0) || 1
    const widths = weights.map((weight) => (weight / totalWeight) * usableWidth)
    const offsets = widths.map((_, index) =>
      marginX + widths.slice(0, index).reduce((total, width) => total + width, 0)
    )

    let y = marginTop

    function drawHeading() {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor('#0F172A')
      doc.text(dataset.title, marginX, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor('#64748B')
      const count = sheet.rows.length
      const subtitle = `${sheet.name} · ${count} ${count === 1 ? 'registro' : 'registros'} · Generado el ${formatDate(new Date())}`
      doc.text(subtitle, marginX, y + 5)
      y += 11
    }

    function drawTableHeader() {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(headerFontSize)
      const lines = sheet.columns.map((column, index) =>
        doc.splitTextToSize(column.header, Math.max(8, widths[index] - 3))
      )
      const headerHeight = Math.max(...lines.map((entry) => entry.length)) * lineHeight + 3.4

      doc.setFillColor('#0F172A')
      doc.rect(marginX, y, usableWidth, headerHeight, 'F')
      doc.setTextColor('#FFFFFF')

      lines.forEach((entry, index) => {
        const align = sheet.columns[index].align ?? 'left'
        const x =
          align === 'center'
            ? offsets[index] + widths[index] / 2
            : align === 'right'
              ? offsets[index] + widths[index] - 1.5
              : offsets[index] + 1.5
        doc.text(entry, x, y + 2.2, { align, baseline: 'top' })
      })

      y += headerHeight
    }

    function breakPageIfNeeded(height: number) {
      if (y + height <= pageHeight - marginBottom) return
      doc.addPage()
      y = marginTop
      drawHeading()
      drawTableHeader()
    }

    drawHeading()
    drawTableHeader()

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(fontSize)

    sheet.rows.forEach((row, rowIndex) => {
      const cells = row.map((value, index) => ({
        value,
        align: pdfAlign(sheet.columns[index], value),
        lines: doc.splitTextToSize(
          pdfCellText(value, sheet.columns[index]),
          Math.max(8, widths[index] - 3)
        ) as string[],
      }))
      const rowHeight = Math.max(
        minRowHeight,
        Math.max(...cells.map((cell) => cell.lines.length)) * lineHeight + paddingY * 2
      )

      breakPageIfNeeded(rowHeight)

      if (rowIndex % 2 === 1) {
        doc.setFillColor('#F8FAFC')
        doc.rect(marginX, y, usableWidth, rowHeight, 'F')
      }

      doc.setTextColor('#334155')
      cells.forEach((cell, index) => {
        const x =
          cell.align === 'center'
            ? offsets[index] + widths[index] / 2
            : cell.align === 'right'
              ? offsets[index] + widths[index] - 1.5
              : offsets[index] + 1.5
        doc.text(cell.lines, x, y + paddingY, { align: cell.align, baseline: 'top' })
      })

      doc.setDrawColor('#E2E8F0')
      doc.setLineWidth(0.15)
      doc.line(marginX, y + rowHeight, marginX + usableWidth, y + rowHeight)
      y += rowHeight
    })
  })

  const totalPages = doc.getNumberOfPages()
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor('#94A3B8')
    doc.text('FJ Systems · Panel de administración', marginX, pageHeight - 7)
    doc.text(`${page} / ${totalPages}`, pageWidth - marginX, pageHeight - 7, {
      align: 'right',
    })
  }

  doc.save(datasetFileName(dataset.prefix, 'pdf'))
}

export async function downloadDataset(dataset: DatasetExport, format: ExportFormat) {
  if (format === 'excel') {
    await downloadExcel(excelFileName(dataset.prefix), dataset.sheets)
    return
  }

  if (format === 'csv') {
    const sheet = dataset.sheets[0]
    downloadFile(
      datasetFileName(dataset.prefix, 'csv'),
      `\uFEFF${sheetToCsv(sheet)}`,
      'text/csv;charset=utf-8;'
    )
    return
  }

  if (format === 'json') {
    if (dataset.json === undefined) {
      throw new Error('Este conjunto de datos no admite respaldo JSON.')
    }
    downloadFile(
      datasetFileName(dataset.prefix, 'json'),
      JSON.stringify(dataset.json, null, 2),
      'application/json'
    )
    return
  }

  await downloadPdf(dataset)
}
