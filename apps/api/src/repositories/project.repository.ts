import type { admin } from '@fj-solutions/contracts'

export type ProjectListFilters = {
  q?: string
  status?: admin.WebProjectStatus
  type?: admin.WebProjectType
}

export type ProjectWriteInput = admin.WebProjectInput

export type ProjectUpdateInput = Partial<admin.WebProjectInput>

export type DeploymentWriteInput = admin.DeploymentInput

export interface ProjectRepository {
  list(filters: ProjectListFilters): Promise<admin.WebProject[]>
  findById(id: string): Promise<admin.WebProject | null>
  create(input: ProjectWriteInput): Promise<admin.WebProject>
  update(id: string, input: ProjectWriteInput): Promise<admin.WebProject | null>
  delete(id: string): Promise<boolean>
  addDeployment(
    projectId: string,
    input: DeploymentWriteInput
  ): Promise<admin.WebProjectDeployment | null>
  clientExists(id: string): Promise<boolean>
}
