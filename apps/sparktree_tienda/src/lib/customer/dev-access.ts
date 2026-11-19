import {
  listCustomerAccounts,
  registerCustomerAccount,
  verifyCustomerEmail,
  verifyCustomerManually,
} from '@fj-solutions/contracts/customer-accounts'

// Accesos de prueba de la tienda: solo existen fuera de producción. Las
// cuentas se crean y confirman solas para poder entrar sin SMTP configurado.

export type DevCustomerKind = 'persona' | 'empresa'

type DevCustomerSpec = {
  kind: DevCustomerKind
  label: string
  name: string
  email: string
  company: string
  password: string
  marketingConsent: boolean
}

function specs(): Record<DevCustomerKind, DevCustomerSpec> {
  return {
    persona: {
      kind: 'persona',
      label: 'Persona natural',
      name: 'Cliente de prueba',
      email: process.env.SEED_CUSTOMER_EMAIL?.trim() || 'cliente.demo@fjsolutions.pe',
      company: '',
      password: process.env.SEED_CUSTOMER_PASSWORD || 'Cliente12345!',
      marketingConsent: false,
    },
    empresa: {
      kind: 'empresa',
      label: 'Empresa',
      name: 'Compras de prueba',
      email: process.env.SEED_COMPANY_EMAIL?.trim() || 'empresa.demo@fjsolutions.pe',
      company: 'Empresa de prueba S.A.C.',
      password: process.env.SEED_COMPANY_PASSWORD || 'Empresa12345!',
      marketingConsent: false,
    },
  }
}

export function devAccessEnabled() {
  return process.env.NODE_ENV !== 'production'
}

export function isDevCustomerKind(value: unknown): value is DevCustomerKind {
  return value === 'persona' || value === 'empresa'
}

export async function ensureDevCustomer(kind: DevCustomerKind) {
  const spec = specs()[kind]

  // Solo se comparan correos; el resto del registro no se expone en la web.
  const accounts = await listCustomerAccounts()
  const existing = accounts.find((account) => account.email === spec.email)

  if (existing) {
    if (existing.status !== 'active') {
      await verifyCustomerManually(existing.id)
    }
    return { id: existing.id, email: spec.email, name: spec.name }
  }

  const { account, email } = await registerCustomerAccount({
    name: spec.name,
    email: spec.email,
    company: spec.company,
    password: spec.password,
    marketingConsent: spec.marketingConsent,
  })

  const token = new URL(email.link).searchParams.get('token')
  if (!token) throw new Error('El enlace de confirmación de desarrollo no es válido.')

  const verified = await verifyCustomerEmail(token)
  if (!verified.ok) {
    // La cuenta ya existía sin confirmar: se activa igual en entorno local.
    await verifyCustomerManually(account.id)
  }

  return { id: account.id, email: spec.email, name: spec.name }
}
