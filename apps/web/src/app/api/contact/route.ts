import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  // TODO: Implementar envío de correo (Resend, Nodemailer, etc.)
  console.log('Contacto recibido:', body)
  return NextResponse.json({ success: true, message: 'Mensaje recibido correctamente.' })
}
