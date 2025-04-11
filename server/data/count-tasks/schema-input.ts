import { TaskEntitySchema } from '@/server/db/repos/tasks'
import { z } from 'zod'

const { projectId } = TaskEntitySchema.shape

export const paramsSchema = z.object({
  projectId
})

export type CountTasksInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
