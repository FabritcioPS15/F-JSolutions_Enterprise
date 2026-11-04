import { ServiceOfferingEditor } from '@/components/admin/service-offering-editor'

export default async function EditarServicioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ServiceOfferingEditor serviceId={id} />
}
