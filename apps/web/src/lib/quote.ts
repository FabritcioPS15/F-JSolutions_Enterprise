export type QuoteItem = {
  productId: string
  productName: string
  productModel?: string
  productSku?: string
  productImage: string
  quantity: number
  notes?: string
  groupId?: string
}

export type Quote = {
  items: QuoteItem[]
  generalNotes?: string
  createdAt: string
  updatedAt: string
}

export type QuoteFormData = {
  name: string
  email: string
  phone: string
  company?: string
  ruc?: string
  contactPreference: 'email' | 'phone' | 'whatsapp'
  generalNotes?: string
}
