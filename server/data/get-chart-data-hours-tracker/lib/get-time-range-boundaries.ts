import type { TimeRange } from './consts'

type TimeRangeBoundaries = {
  from?: Date
  to?: Date
}

/**
 * Returns the start and end dates for the given time range
 * @param timeRange The time range to get the dates for
 * @returns An object with from and to Date objects, or undefined values for 'allTime'
 */
export const getTimeRangeBoundaries = (
  timeRange: TimeRange
): TimeRangeBoundaries => {
  if (timeRange === 'allTime') return { from: undefined, to: undefined }

  const now = new Date()

  // Set time boundaries
  const startOfDay = (date: Date): Date => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const endOfDay = (date: Date): Date => {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
  }

  switch (timeRange) {
    case 'thisWeek': {
      const from = new Date(now)
      const to = new Date(now)
      const dayOfWeek = now.getDay()

      // Monday (1) to Sunday (0)
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek

      from.setDate(now.getDate() - daysFromMonday)
      to.setDate(now.getDate() + daysToSunday)

      return { from: startOfDay(from), to: endOfDay(to) }
    }

    case 'lastWeek': {
      const from = new Date(now)
      const to = new Date(now)
      const dayOfWeek = now.getDay()

      const daysFromLastMonday = dayOfWeek === 0 ? 13 : dayOfWeek + 6
      const daysFromLastSunday = dayOfWeek === 0 ? 7 : dayOfWeek

      from.setDate(now.getDate() - daysFromLastMonday)
      to.setDate(now.getDate() - daysFromLastSunday)

      return { from: startOfDay(from), to: endOfDay(to) }
    }

    case 'thisMonth': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1)
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      return { from: startOfDay(from), to: endOfDay(to) }
    }

    case 'lastMonth': {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const to = new Date(now.getFullYear(), now.getMonth(), 0)

      return { from: startOfDay(from), to: endOfDay(to) }
    }

    case 'thisYear': {
      const from = new Date(now.getFullYear(), 0, 1)
      const to = new Date(now.getFullYear(), 11, 31)

      return { from: startOfDay(from), to: endOfDay(to) }
    }

    case 'lastYear': {
      const from = new Date(now.getFullYear() - 1, 0, 1)
      const to = new Date(now.getFullYear() - 1, 11, 31)

      return { from: startOfDay(from), to: endOfDay(to) }
    }

    default: {
      console.error(`Unexpected time range: ${timeRange}`)
      return { from: undefined, to: undefined }
    }
  }
}
