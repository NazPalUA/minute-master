export const timeRanges = [
  'thisWeek',
  'lastWeek',
  'thisMonth',
  'lastMonth',
  'thisYear',
  'lastYear',
  'allTime'
] as const
export type TimeRange = (typeof timeRanges)[number]

export const barSteps = ['day', 'week', 'month', 'year'] as const
export type BarStep = (typeof barSteps)[number]

type BarStepOptions = {
  stepOptions: BarStep[]
  defaultStep: BarStep
}

const weekBarStepOptions = {
  stepOptions: ['day'],
  defaultStep: 'day'
} as const satisfies BarStepOptions

const monthBarStepOptions = {
  stepOptions: ['day'],
  defaultStep: 'day'
} as const satisfies BarStepOptions

const yearBarStepOptions = {
  stepOptions: ['day', 'week', 'month'],
  defaultStep: 'month'
} as const satisfies BarStepOptions

export const timeRangeStepConfig = {
  thisWeek: weekBarStepOptions,
  lastWeek: weekBarStepOptions,
  thisMonth: monthBarStepOptions,
  lastMonth: monthBarStepOptions,
  thisYear: yearBarStepOptions,
  lastYear: yearBarStepOptions,
  allTime: {
    stepOptions: ['day', 'month', 'year'],
    defaultStep: 'year'
  }
} as const satisfies Record<TimeRange, BarStepOptions>
