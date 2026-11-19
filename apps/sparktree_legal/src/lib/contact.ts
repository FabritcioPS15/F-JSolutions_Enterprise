export const LEGAL_CONTACT = {
  whatsapp: process.env.NEXT_PUBLIC_LEGAL_WHATSAPP ?? '51958077827',
  email: process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? 'admin@sparktree.pe',
  hours: 'Lun a Vie · 9:00 a 18:00',
  location: 'Lima, Perú',
}

export function whatsappUrl(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('51')) {
    return `+51 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }
  return `+${digits}`
}
