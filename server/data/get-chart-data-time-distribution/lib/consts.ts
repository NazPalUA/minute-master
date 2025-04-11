export const timeRanges = [
  'day',
  '24h',
  'week',
  '7d',
  'month',
  '30d',
  'year',
  '365d',
  'allTime'
] as const

export type TimeRange = (typeof timeRanges)[number]

export const defaultTimeRange = 'week' as const satisfies TimeRange
