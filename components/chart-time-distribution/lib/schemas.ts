import {
  defaultTimeRange,
  timeRanges
} from '@/server/data/get-chart-data-time-distribution'
import { z } from 'zod'

export const timeRangesSchema = z
  .enum(timeRanges)
  .optional()
  .default(defaultTimeRange)
  .catch(defaultTimeRange)

export type TimeRange = z.infer<typeof timeRangesSchema>
export type TimeRangeInput = z.input<typeof timeRangesSchema>
