import { ProjectEntitySchema } from '@/server/db/repos/projects'
import { SectionEntitySchema } from '@/server/db/repos/sections'
import { z } from 'zod'

const { name, description, dueDate, estimatedTime } = ProjectEntitySchema.shape
const { name: sectionName, description: sectionDescription } =
  SectionEntitySchema.shape

export const paramsSchema = z
  .object({
    name,
    description,
    dueDate,
    estimatedTime,

    sectionName,
    sectionDescription
  })
  .transform(data => ({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  }))

export type CreateProjectInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
