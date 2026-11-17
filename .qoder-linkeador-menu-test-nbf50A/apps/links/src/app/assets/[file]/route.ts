import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ASSETS_DIR =
  process.env.FJ_DATA_DIR ??
  path.join(process.cwd(), '..', '..', '.data')
const ASSETS_PATH = path.join(ASSETS_DIR, 'link-assets')

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params
  const match = /^([a-z0-9-]+)\.(png|jpg|webp)$/i.exec(file)
  if (!match) return new Response('No encontrado', { status: 404 })

  try {
    const data = await readFile(path.join(ASSETS_PATH, file))
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': CONTENT_TYPES[match[2].toLowerCase()],
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('No encontrado', { status: 404 })
  }
}
