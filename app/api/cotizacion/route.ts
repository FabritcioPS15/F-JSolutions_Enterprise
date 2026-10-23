import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  // TODO: Guardar cotización en base de datos y notificar al equipo
  console.log('Cotización recibida:', body)
  return NextResponse.json({ success: true, message: 'Cotización enviada correctamente.' })
}
