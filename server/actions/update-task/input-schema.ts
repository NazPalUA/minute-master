import { ObjectIdSchema } from '@/server/db/common-schemas'
import { TaskEntitySchema } from '@/server/db/repos/tasks'
import { z } from 'zod'

const { name, description, dueDate, estimatedTime } = TaskEntitySchema.shape

export const paramsSchema = z.object({
  query: z.object({
    taskId: ObjectIdSchema
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

export type UpdateTaskInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
