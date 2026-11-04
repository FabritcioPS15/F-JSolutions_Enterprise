import type { admin } from '@fj-solutions/contracts'

export type ServiceOfferingListFilters = {
  q?: string
  status?: admin.ServiceOfferingStatus
  category?: admin.ServiceOfferingCategory
}

export type ServiceOfferingWriteInput = admin.ServiceOfferingInput

export interface ServiceOfferingRepository {
  list(filters: ServiceOfferingListFilters): Promise<admin.ServiceOffering[]>
  listPublished(): Promise<admin.ServiceOffering[]>
  findById(id: string): Promise<admin.ServiceOffering | null>
  findBySlug(slug: string): Promise<admin.ServiceOffering | null>
  create(input: ServiceOfferingWriteInput): Promise<admin.ServiceOffering>
  update(id: string, input: ServiceOfferingWriteInput): Promise<admin.ServiceOffering | null>
  delete(id: string): Promise<boolean>
  existingSlugs(slugs: string[]): Promise<Set<string>>
}
