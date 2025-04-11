import { SectionEntitySchema } from '@/server/db/repos/sections'
import { z } from 'zod'

const { name, description, projectId } = SectionEntitySchema.shape

export const paramsSchema = z
  .object({
    projectId,
    name,
    description
  })
  .transform(data => ({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  }))

export type CreateSectionInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
