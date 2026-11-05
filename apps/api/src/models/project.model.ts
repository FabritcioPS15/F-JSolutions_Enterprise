import { z } from 'zod'

const projectType = z.enum([
  'landing',
  'website',
  'webapp',
  'ecommerce',
  'maintenance',
  'software',
])

const projectStatus = z.enum([
  'planning',
  'development',
  'staging',
  'live',
  'paused',
  'archived',
])

const deploymentEnvironment = z.enum(['production', 'staging', 'preview'])

const urlField = z
  .string()
  .trim()
  .max(500)
  .refine((value) => !value || /^https?:\/\/\S+$/i.test(value), 'URL no válida')

const optionalDate = z
  .string()
  .trim()
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), 'Fecha no válida')
  .nullable()

const projectFields = {
  name: z.string().trim().min(2).max(200),
  clientId: z.union([z.literal(''), z.string().uuid()]).optional(),
  clientName: z.string().trim().max(200).default(''),
  type: projectType.default('website'),
  status: projectStatus.default('planning'),
  productionUrl: urlField.default(''),
  stagingUrl: urlField.default(''),
  repoUrl: urlField.default(''),
  hosting: z.string().trim().max(200).default(''),
  domain: z.string().trim().max(200).default(''),
  responsible: z.string().trim().max(160).default(''),
  credentialLocation: z.string().trim().max(300).default(''),
  launchedAt: optionalDate.optional(),
  renewalAt: optionalDate.optional(),
  notes: z.string().trim().max(5_000).default(''),
}

export const createProjectSchema = z.object({
  body: z.object(projectFields),
})

export const updateProjectSchema = z.object({
  body: z.object(projectFields).partial(),
})

export const projectDeploymentSchema = z.object({
  body: z.object({
    environment: deploymentEnvironment.default('production'),
    url: z.string().trim().url().max(500),
    version: z.string().trim().max(80).optional(),
    note: z.string().trim().max(1_000).optional(),
    deployedAt: optionalDate.optional(),
  }),
})

export const projectQuerySchema = z.object({
  query: z.object({
    q: z.string().trim().max(160).optional(),
    status: projectStatus.optional(),
    type: projectType.optional(),
  }),
})

export const projectIdSchema = z.object({
  params: z.object({ id: z.string().min(1).max(120) }),
})
