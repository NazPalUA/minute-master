import { TimeLogEntitySchema } from '@/server/db/repos/time-logs'
import { z } from 'zod'

const { endDate } = TimeLogEntitySchema.shape

export const paramsSchema = z.object({
  payload: z
    .object({
      endDate: endDate.unwrap()
    })
    .transform(data => ({
      ...data,
      updatedAt: new Date()
    }))
})

export type FinishTimeLogInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
