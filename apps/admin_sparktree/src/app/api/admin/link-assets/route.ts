import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { guardLinkProfiles } from '@/lib/links/http'

export const dynamic = 'force-dynamic'

const MAX_BYTES = 2 * 1024 * 1024
const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

const ASSETS_DIR =
  process.env.FJ_DATA_DIR ??
  path.join(process.cwd(), '..', '..', '.data')
const ASSETS_PATH = path.join(ASSETS_DIR, 'link-assets')

export async function POST(request: NextRequest) {
  const guard = await guardLinkProfiles('update')
  if (!guard.ok) return guard.response

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!file || typeof file === 'string') {
    return NextResponse.json(
      { success: false, message: 'Adjunta una imagen para subir.' },
      { status: 400 }
    )
  }

  const extension = EXTENSIONS[file.type]
  if (!extension) {
    return NextResponse.json(
      { success: false, message: 'Usa una imagen PNG, JPG o WebP.' },
      { status: 415 }
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { success: false, message: 'La imagen no puede superar los 2 MB.' },
      { status: 413 }
    )
  }

  const name = `${randomUUID()}.${extension}`
  try {
    await mkdir(ASSETS_PATH, { recursive: true })
    await writeFile(path.join(ASSETS_PATH, name), Buffer.from(await file.arrayBuffer()))
  } catch (error) {
    console.error('[admin/link-assets]', error)
    return NextResponse.json(
      { success: false, message: 'No se pudo guardar la imagen.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, data: { url: `/assets/${name}` } }, { status: 201 })
}
