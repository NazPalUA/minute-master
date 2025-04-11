import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { SectionEntitySchema } from '@/server/db/repos/sections'
import { TaskEntitySchema } from '@/server/db/repos/tasks'
import { TimeLogEntitySchema } from '@/server/db/repos/time-logs'
import { z } from 'zod'

const singleItemSchema = z.object({
  id: StringObjectIdSchema,
  start: TimeLogEntitySchema.shape.startDate.transform(date =>
    date.toISOString()
  ),
  end: TimeLogEntitySchema.shape.endDate.transform(
    date => date?.toISOString() || null
  ),
  duration: z.number().int(),

  taskId: StringObjectIdSchema.nullable(),
  taskName: TaskEntitySchema.shape.name.optional(),

  sectionId: StringObjectIdSchema,
  sectionName: SectionEntitySchema.shape.name,

  projectId: StringObjectIdSchema,
  projectName: z.string()
})

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
export type GetTimeLogsReturn = z.output<typeof returnSchema>
