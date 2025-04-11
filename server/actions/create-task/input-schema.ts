import { TaskEntitySchema } from '@/server/db/repos/tasks'
import { z } from 'zod'

const { name, description, projectId, sectionId, dueDate, estimatedTime } =
  TaskEntitySchema.shape

export const paramsSchema = z
  .object({
    projectId,
    sectionId,
    name,
    description,
    dueDate,
    estimatedTime
  })
  .transform(data => ({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  }))

export type CreateTaskInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
