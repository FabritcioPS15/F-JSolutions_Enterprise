import type { ComplaintPatch } from '@fj-solutions/contracts/complaints-book'
import { updateComplaint } from '@fj-solutions/contracts/complaints-book'
import { NextResponse } from 'next/server'
import { complaintsFailure, guardComplaints } from '@/lib/complaints/http'

export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ success: false, message: 'Solicitud inválida.' }, { status: 400 })
  }

  const hasResponse = typeof body.response === 'string' && body.response.trim().length > 0
  const guard = await guardComplaints(hasResponse ? 'reply' : 'update')
  if (!guard.ok) return guard.response

  const patch: ComplaintPatch = {
    ...(typeof body.status === 'string' ? { status: body.status as ComplaintPatch['status'] } : {}),
    ...(typeof body.response === 'string' ? { response: body.response } : {}),
  }

  try {
    const complaint = await updateComplaint(id, patch)
    if (!complaint) {
      return NextResponse.json(
        { success: false, message: 'No encontramos ese reclamo.' },
        { status: 404 },
      )
    }
    return NextResponse.json({ success: true, data: complaint })
  } catch (error) {
    return complaintsFailure(error)
  }
}
