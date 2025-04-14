import { ObjectIdSchema } from '@/server/db/common-schemas'
import { z } from 'zod'

export const paramsSchema = z.object({
  taskId: ObjectIdSchema
})

export type DeleteTaskInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
