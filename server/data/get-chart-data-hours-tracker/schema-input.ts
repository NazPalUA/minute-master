import { ObjectIdSchema } from '@/server/db/common-schemas'
import { z } from 'zod'
import {
  BarStep,
  barSteps,
  timeRanges,
  timeRangeStepConfig
} from './lib/consts'
import { getTimeRangeBoundaries } from './lib/get-time-range-boundaries'

export const paramsSchema = z
  .object({
    projectId: ObjectIdSchema.optional(),
    timeRange: z.enum(timeRanges),
    barStep: z.enum(barSteps)
  })
  .transform(params => {
    const { from, to } = getTimeRangeBoundaries(params.timeRange)
    const { stepOptions, defaultStep } = timeRangeStepConfig[params.timeRange]
    return {
      ...params,
      barStep: (stepOptions as BarStep[]).includes(params.barStep)
        ? params.barStep
        : defaultStep,
      from,
      to
    }
  })

export type GetChartDataHoursTrackerInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
