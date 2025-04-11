import { ObjectIdSchema } from '@/server/db/common-schemas'
import { TaskEntitySchema } from '@/server/db/repos/tasks'
import { z } from 'zod'

const { status } = TaskEntitySchema.shape

export const paramsSchema = z.object({
  query: z.object({
    taskId: ObjectIdSchema
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

export type UpdateTaskStatusInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
