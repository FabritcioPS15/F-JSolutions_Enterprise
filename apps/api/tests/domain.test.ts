import {
  buildQuoteCode,
  buildRequestCode,
  isEmail,
  isValidDocument,
  isValidRuc,
  lineTotal,
  onlyDigits,
  quoteTotals,
} from '@fj-solutions/contracts/domain'
import { computeQuoteAmounts } from '../src/services/commercial.service'

describe('reglas de dominio compartidas', () => {
  it('valida correos sin duplicar el patrón en cada app', () => {
    expect(isEmail('venta@fjsolutions.com.pe')).toBe(true)
    expect(isEmail('  venta@fjsolutions.com.pe ')).toBe(true)
    expect(isEmail('venta@fjsolutions')).toBe(false)
    expect(isEmail('')).toBe(false)
  })

  it('exige 8 dígitos de DNI y 11 de RUC', () => {
    expect(isValidDocument('dni', onlyDigits('45678 901'))).toBe(true)
    expect(isValidDocument('ruc', onlyDigits('20 123456789'))).toBe(true)
    expect(isValidDocument('ruc', '2012345678')).toBe(false)
    expect(isValidDocument('dni', '4567890')).toBe(false)
    expect(isValidRuc('20123456789')).toBe(true)
  })

  it('construye códigos de cotización y solicitud correlativos', () => {
    const date = new Date('2026-11-05T18:30:00.000Z')
    expect(buildQuoteCode(date)).toMatch(/^COT-20261105-[A-Z0-9]{4}$/)
    expect(buildRequestCode(date)).toMatch(/^SOL-20261105-[A-Z0-9]{4}$/)
  })

  it('separa la base imponible del IGV sobre importes ya gravados', () => {
    expect(lineTotal({ quantity: 3, unitPrice: 120.5 })).toBe(361.5)
    expect(lineTotal({ quantity: -2, unitPrice: 100 })).toBe(0)
    expect(quoteTotals([{ quantity: 2, unitPrice: 100 }], 18)).toEqual({
      total: 200,
      net: 169.49,
      tax: 30.51,
    })
    expect(quoteTotals([{ quantity: 1, unitPrice: 200 }], 0)).toEqual({
      total: 200,
      net: 200,
      tax: 0,
    })
  })

  it('usa las mismas cifras en la API y en el panel', () => {
    const items = [{ subtotal: 120 }, { subtotal: 80 }]

    expect(computeQuoteAmounts(items, 18)).toMatchObject({
      subtotal: 169.49,
      taxAmount: 30.51,
      total: 200,
    })
    expect(computeQuoteAmounts(items, 0).subtotal).toBe(200)
    expect(computeQuoteAmounts([{ subtotal: -50 }], 18).total).toBe(0)
  })
})
