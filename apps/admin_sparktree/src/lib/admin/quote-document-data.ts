import type {
  AdminProduct,
  Client,
  Quote,
  StoreSettings,
} from './types'
import type {
  QuoteDocumentData,
  QuoteDocumentItem,
  QuoteDocumentParty,
} from '@/lib/quote-document'

const DOCUMENT_TYPE_LABELS: Record<NonNullable<Client['documentType']>, string> = {
  ruc: 'RUC',
  dni: 'DNI',
}

function findClient(quote: Quote, clients: Client[]): Client | null {
  if (quote.clientId) {
    const byId = clients.find((client) => client.id === quote.clientId)
    if (byId) return byId
  }
  const email = quote.clientEmail.trim().toLowerCase()
  if (!email) return null
  return clients.find((client) => client.email.trim().toLowerCase() === email) ?? null
}

function websiteFromEmail(email: string): string | undefined {
  const domain = email.split('@')[1]?.trim()
  return domain || undefined
}

function buildClientParty(quote: Quote, client: Client | null): QuoteDocumentParty {
  const company = quote.clientCompany.trim()
  const person = quote.clientName.trim()

  return {
    name: company || person || 'Cliente',
    contact: company && person ? person : undefined,
    documentType: client?.documentType ? DOCUMENT_TYPE_LABELS[client.documentType] : undefined,
    documentNumber: client?.documentNumber?.trim() || undefined,
    address: client?.address?.trim() || client?.city?.trim() || undefined,
    email: quote.clientEmail.trim() || client?.email || undefined,
    phone: quote.clientPhone.trim() || client?.phone || undefined,
  }
}

function buildItems(quote: Quote, products: AdminProduct[]): QuoteDocumentItem[] {
  return quote.items.map((line) => {
    const product = line.productId
      ? products.find((item) => item.id === line.productId)
      : undefined
    return {
      name: line.name,
      sku: line.sku || product?.sku || undefined,
      description: product?.shortDescription?.trim() || product?.description?.trim() || undefined,
      quantity: Math.max(0, line.quantity),
      unitPrice: Math.max(0, line.unitPrice),
    }
  })
}

export function buildQuoteDocumentData({
  quote,
  settings,
  clients,
  products,
  logoDataUrl,
}: {
  quote: Quote
  settings: StoreSettings
  clients: Client[]
  products: AdminProduct[]
  logoDataUrl?: string
}): QuoteDocumentData {
  const client = findClient(quote, clients)

  return {
    code: quote.code,
    issuedAt: quote.createdAt,
    validUntil: quote.validUntil || undefined,
    currency: settings.currency,
    igvPercent: settings.igv,
    client: buildClientParty(quote, client),
    issuer: {
      name: settings.storeName,
      legalName: settings.legalName,
      ruc: settings.ruc,
      address: settings.address,
      email: settings.email,
      phone: settings.phone,
      website: websiteFromEmail(settings.email),
    },
    items: buildItems(quote, products),
    notes: quote.notes.trim() || undefined,
    logoDataUrl,
  }
}
