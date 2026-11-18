'use client'

import { useServerInsertedHTML } from 'next/navigation'

export function ThemeScript({ script }: { script: string }) {
  useServerInsertedHTML(() => <script dangerouslySetInnerHTML={{ __html: script }} />)

  return null
}
