import { notFound } from 'next/navigation'
import { UnitWorkspace, type ManagedUnit } from '@/components/admin/unit-workspace'

const managedUnits: ManagedUnit[] = ['systems', 'store', 'studio']

export function generateStaticParams() {
  return managedUnits.map((unit) => ({ unit }))
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unit: string }>
}) {
  const { unit } = await params
  if (!managedUnits.includes(unit as ManagedUnit)) notFound()

  return <UnitWorkspace unit={unit as ManagedUnit} />
}
