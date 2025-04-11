import { ObjectIdSchema } from '@/server/db/common-schemas'
import { TimeLogEntitySchema } from '@/server/db/repos/time-logs'
import { z } from 'zod'

const { startDate, endDate, taskId, projectId, sectionId } =
  TimeLogEntitySchema.shape

export const paramsSchema = z.object({
  query: z.object({
    timeLogId: ObjectIdSchema
  }),
  payload: z
    .object({
      projectId,
      sectionId,
      taskId: taskId.unwrap(),
      startDate,
      endDate: endDate.unwrap()
    })
    .partial()
    .transform(data => ({
      ...data,
      updatedAt: new Date()
    }))
})

export type UpdateTimeLogInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
