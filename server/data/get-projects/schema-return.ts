import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { ProjectEntitySchema } from '@/server/db/repos/projects'
import { z } from 'zod'

const { dueDate, startDate, completedDate } = ProjectEntitySchema.shape

const singleItemSchema = ProjectEntitySchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
})
  .extend({
    _id: StringObjectIdSchema,
    dueDate: dueDate.transform(date => date?.toISOString()),
    startDate: startDate.transform(date => date?.toISOString()),
    completedDate: completedDate.transform(date => date?.toISOString())
  })
  .transform(({ _id, ...rest }) => ({ id: _id, ...rest }))

export const returnSchema = z.object({
  data: z.array(singleItemSchema)
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetProjectsReturn = z.output<typeof returnSchema>
