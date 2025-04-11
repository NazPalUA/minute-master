import { ObjectIdSchema } from '@/server/db/common-schemas'
import { ProjectEntitySchema } from '@/server/db/repos/projects'
import { z } from 'zod'

const { status } = ProjectEntitySchema.shape

export const paramsSchema = z.object({
  query: z.object({
    projectId: ObjectIdSchema
  }),
  payload: z
    .object({
      status
    })
    .transform(data => ({
      ...data,
      updatedAt: new Date()
    }))
})

export type UpdateProjectStatusInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
