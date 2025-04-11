import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { TaskEntitySchema } from '@/server/db/repos/tasks'
import { z } from 'zod'

const { dueDate, startDate, completedDate } = TaskEntitySchema.shape

const singleItemSchema = TaskEntitySchema.omit({
  createdAt: true,
  updatedAt: true
})
  .extend({
    _id: StringObjectIdSchema,
    dueDate: dueDate.transform(date => date?.toISOString()),
    startDate: startDate.transform(date => date?.toISOString()),
    completedDate: completedDate.transform(date => date?.toISOString()),
    project: z.string(),
    section: z.string(),
    projectId: StringObjectIdSchema,
    sectionId: StringObjectIdSchema,
    totalRuntime: z.number().int().optional()
  })
  .transform(({ _id, ...rest }) => ({ id: _id, ...rest }))

export const returnSchema = z.object({
  data: z.array(singleItemSchema),
  pagination: z.object({
    totalItems: z.number().int(),
    totalPages: z.number().int(),
    currentPage: z.number().int(),
    itemsPerPage: z.number().int()
  })
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetTasksReturn = z.output<typeof returnSchema>
