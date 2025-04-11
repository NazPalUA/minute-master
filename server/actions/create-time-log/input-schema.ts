import { TimeLogEntitySchema } from '@/server/db/repos/time-logs'
import { z } from 'zod'

const { startDate, projectId, sectionId, taskId, endDate } =
  TimeLogEntitySchema.shape

export const paramsSchema = z
  .object({
    projectId,
    sectionId,
    taskId: taskId
      .unwrap()
      .optional()
      .transform(id => id || null),
    startDate,
    endDate: endDate
      .unwrap()
      .optional()
      .transform(date => date || null)
  })
  .transform(data => ({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  }))

export type CreateTimeLogInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
