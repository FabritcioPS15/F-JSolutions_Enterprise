'use client'

import {
  AppWindow,
  BatteryCharging,
  Boxes,
  Cable,
  Cpu,
  Gamepad2,
  HardDrive,
  Headset,
  House,
  Keyboard,
  Laptop,
  Monitor,
  Package,
  Printer,
  Router,
  Server,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const categoryIcons: Record<string, LucideIcon> = {
  'PC y Servidores': Server,
  Laptops: Laptop,
  Componentes: Cpu,
  Monitores: Monitor,
  Periféricos: Keyboard,
  Almacenamiento: HardDrive,
  Redes: Router,
  'Impresoras y Escáneres': Printer,
  'Audio y Video': Headset,
  Gaming: Gamepad2,
  Accesorios: Cable,
  Software: AppWindow,
  Telefonía: Smartphone,
  'Cables y Energía': BatteryCharging,
  'Hogar inteligente': House,
}

export function CategoryGlyph({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  const Icon = categoryIcons[label] ?? Boxes
  return <Icon className={cn('size-5', className)} aria-hidden="true" />
}
