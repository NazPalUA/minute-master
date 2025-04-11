import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { TaskEntitySchema } from '@/server/db/repos/tasks'
import { z } from 'zod'

const singleItemSchema = z
  .object({
    _id: StringObjectIdSchema,
    name: TaskEntitySchema.shape.name
  })
  .transform(({ _id, ...rest }) => ({ id: _id, ...rest }))

export const returnSchema = z.object({
  data: z.array(singleItemSchema)
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetTasksNamesReturn = z.output<typeof returnSchema>
