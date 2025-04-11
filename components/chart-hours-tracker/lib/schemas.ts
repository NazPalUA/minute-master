import {
  type BarStep,
  type TimeRange,
  timeRanges,
  timeRangeStepConfig
} from '@/server/data/get-chart-data-hours-tracker/lib/consts'
import { z } from 'zod'

const createBarStepOptionsSchema = (timeRange: TimeRange) =>
  z
    .enum(timeRangeStepConfig[timeRange].stepOptions)
    .default(timeRangeStepConfig[timeRange].defaultStep)
    .catch(timeRangeStepConfig[timeRange].defaultStep)

// [timeRange, barStep]
const settingsOptionsSchemas = timeRanges.map(timeRange =>
  z.tuple([z.literal(timeRange), createBarStepOptionsSchema(timeRange)])
)

export const defaultSettings = {
  timeRange: 'thisWeek',
  barStep: 'day'
} as const
export const defaultSettingsArr = ['thisWeek', 'day'] as const satisfies [
  TimeRange,
  BarStep
]

const [first, second, ...rest] = settingsOptionsSchemas

export const settingsSchema = z
  .union([first, second, ...rest])
  .default(defaultSettingsArr)
  .catch(defaultSettingsArr)
  .transform(arr => ({
    timeRange: arr[0],
    barStep: arr[1]
  }))

export type Settings = z.infer<typeof settingsSchema>
