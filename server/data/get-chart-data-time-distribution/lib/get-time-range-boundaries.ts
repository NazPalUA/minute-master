import { TimeRange } from './consts'

/**
 * Returns the start and end dates for the given time range
 * @param timeRange The time range to get the boundaries for. Can be:
 *   - 'allTime': Returns undefined
 *   - 'day': Current day from midnight to 23:59:59.999
 *   - '24h': Last 24 hours from now
 *   - 'week': Current week from Monday midnight to Sunday 23:59:59.999
 *   - '7d': Last 7 days from now
 *   - 'month': Current month from 1st midnight to end of today
 *   - '30d': Last 30 days from now
 *   - 'year': Current year from Jan 1st midnight to end of today
 *   - '365d': Last 365 days from now
 * @returns An object with from and to Date objects, or undefined for 'allTime'
 */
export const getTimeRangeBoundaries = (
  timeRange: TimeRange
): { from: Date; to: Date } | undefined => {
  if (timeRange === 'allTime') return undefined

  const from = new Date()
  const to = new Date()
  to.setHours(23, 59, 59, 999)

  switch (timeRange) {
    case 'day': {
      from.setHours(0, 0, 0, 0)
      return { from, to }
    }
    case '24h': {
      from.setHours(from.getHours() - 24)
      return { from, to }
    }
    case 'week': {
      const dayOfWeek = from.getDay()
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      from.setDate(from.getDate() - daysToSubtract)
      from.setHours(0, 0, 0, 0)
      return { from, to }
    }
    case '7d': {
      from.setDate(from.getDate() - 7)
      return { from, to }
    }
    case 'month': {
      from.setDate(1)
      from.setHours(0, 0, 0, 0)
      return { from, to }
    }
    case '30d': {
      from.setDate(from.getDate() - 30)
      return { from, to }
    }
    case 'year': {
      from.setMonth(0, 1)
      from.setHours(0, 0, 0, 0)
      return { from, to }
    }
    case '365d': {
      from.setDate(from.getDate() - 365)
      return { from, to }
    }
    default: {
      console.error(`Unexpected time range: ${timeRange}`)
      return undefined
    }
  }
}
