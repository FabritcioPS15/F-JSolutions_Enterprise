import type { Cell, Sheet } from 'write-excel-file/browser'

export type ExcelValue = string | number | Date | null | undefined

export type ExcelColumn<Row> = {
  header: string
  width?: number
  getValue: (row: Row) => ExcelValue
  format?: string
  align?: 'left' | 'center' | 'right'
  wrap?: boolean
}

export type ExcelSheetColumn = Omit<ExcelColumn<unknown>, 'getValue'>

export type ExcelSheet = {
  name: string
  columns: ExcelSheetColumn[]
  rows: ExcelValue[][]
}

export function buildSheet<Row>(
  name: string,
  columns: ExcelColumn<Row>[],
  rows: Row[]
): ExcelSheet {
  return {
    name,
    columns: columns.map(({ header, width, format, align, wrap }) => ({
      header,
      width,
      format,
      align,
      wrap,
    })),
    rows: rows.map((row) => columns.map((column) => column.getValue(row))),
  }
}

export function excelFileName(prefix: string, date = new Date()): string {
  return `${prefix}-fj-systems-${date.toISOString().slice(0, 10)}.xlsx`
}

export function excelDate(value?: string | null): Date | null {
  if (!value) return null
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value)
  return Number.isNaN(date.getTime()) ? null : date
}

function headerCell(column: ExcelSheetColumn): Cell {
  return {
    value: column.header,
    type: String,
    fontWeight: 'bold',
    backgroundColor: '#0F172A',
    textColor: '#FFFFFF',
    align: column.align ?? 'left',
    wrap: true,
  }
}

function bodyCell(column: ExcelSheetColumn, value: ExcelValue): Cell {
  if (value === null || value === undefined || value === '') return null

  if (value instanceof Date) {
    return {
      value,
      type: Date,
      format: column.format ?? 'dd/mm/yyyy hh:mm',
      align: column.align ?? 'center',
    }
  }

  if (typeof value === 'number') {
    return {
      value,
      type: Number,
      format: column.format,
      align: column.align ?? 'right',
    }
  }

  return {
    value,
    type: String,
    align: column.align ?? 'left',
    wrap: column.wrap ?? false,
  }
}

export async function downloadExcel(fileName: string, sheets: ExcelSheet[]) {
  const { default: writeExcelFile } = await import('write-excel-file/browser')

  const payload: Sheet<Blob>[] = sheets.map((sheet) => ({
    sheet: sheet.name,
    stickyRowsCount: 1,
    columns: sheet.columns.map((column) => ({ width: column.width ?? 18 })),
    data: [
      sheet.columns.map((column) => headerCell(column)),
      ...sheet.rows.map((row) =>
        row.map((value, index) => bodyCell(sheet.columns[index], value))
      ),
    ],
  }))

  await writeExcelFile(payload).toFile(fileName)
}
