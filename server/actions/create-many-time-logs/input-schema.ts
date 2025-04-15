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
    timeLogs: z.array(
      z.object({
        startDate,
        endDate: endDate.unwrap()
      })
    )
  })
  .transform(data => ({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
  .transform(({ timeLogs, ...rest }) =>
    timeLogs.map(timeLog => ({
      ...rest,
      ...timeLog
    }))
  )

export type CreateManyTimeLogsInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
