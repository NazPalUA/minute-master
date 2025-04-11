import { ObjectIdSchema } from '@/server/db/common-schemas'
import { z } from 'zod'
import { timeRanges } from './lib/consts'
import { getTimeRangeBoundaries } from './lib/get-time-range-boundaries'

export const paramsSchema = z
  .object({
    projectId: ObjectIdSchema.optional(),
    timeRange: z.enum(timeRanges)
  })
  .transform(data => {
    return {
      ...data,
      from: getTimeRangeBoundaries(data.timeRange)?.from,
      to: getTimeRangeBoundaries(data.timeRange)?.to
    }
  })

export type GetChartDataTimeDistributionInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
