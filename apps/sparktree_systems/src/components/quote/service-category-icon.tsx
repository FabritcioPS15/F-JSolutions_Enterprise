import { ClipboardList, Code2, Headset, Network } from 'lucide-react'

export function ServiceCategoryIcon({
  category,
  className,
}: {
  category: string
  className?: string
}) {
  const Icon =
    category === 'Soporte TI'
      ? Headset
      : category === 'Infraestructura TI'
        ? Network
        : category === 'Desarrollo de software'
          ? Code2
          : ClipboardList
  return <Icon aria-hidden="true" className={className} />
}
