import { ObjectIdSchema } from '@/server/db/common-schemas'
import { ProjectEntitySchema } from '@/server/db/repos/projects'
import { z } from 'zod'

const { name, description, dueDate, estimatedTime } = ProjectEntitySchema.shape

export const paramsSchema = z.object({
  query: z.object({
    projectId: ObjectIdSchema
  }),
  payload: z
    .object({
      name,
      description,
      dueDate,
      estimatedTime
    })
    .partial()
    .transform(data => ({
      ...data,
      updatedAt: new Date()
    }))
})

export type UpdateProjectInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
