import type { Filter } from 'mongodb'

type TimeLogDateFilter = Filter<{
  startDate: Date
  endDate: Date | null
}>

export function getTimeRangeFilterForTimeLog(
  from?: Date,
  to?: Date
): TimeLogDateFilter {
  let dateFilter: TimeLogDateFilter = {}

  if (from && to) {
    dateFilter = {
      $or: [
        // Time logs entirely within "from"-"to" time range
        {
          startDate: { $gte: from, $lt: to },
          endDate: { $ne: null, $gte: from, $lt: to }
        },
        // Time logs that started before "from" but ended within the range
        {
          startDate: { $lt: from },
          endDate: { $ne: null, $gte: from, $lt: to }
        },
        // Time logs that started within range but ended after "to"
        {
          startDate: { $gte: from, $lt: to },
          endDate: { $ne: null, $gte: to }
        },
        // Time logs that started before "from" and ended after "to"
        {
          startDate: { $lt: from },
          endDate: { $ne: null, $gte: to }
        }
      ]
    }
  } else if (from) {
    dateFilter = {
      $or: [
        // Time logs that started after "from" and have ended
        {
          startDate: { $gte: from },
          endDate: { $ne: null }
        },
        // Time logs that started before "from" but ended after "from"
        {
          startDate: { $lt: from },
          endDate: { $ne: null, $gte: from }
        }
      ]
    }
  } else if (to) {
    dateFilter = {
      $or: [
        // Time logs that started and ended before "to"
        {
          startDate: { $lt: to },
          endDate: { $ne: null, $lt: to }
        },
        // Time logs that started before "to" and ended after "to"
        {
          startDate: { $lt: to },
          endDate: { $ne: null, $gte: to }
        }
      ]
    }
  } else {
    dateFilter = {
      endDate: { $ne: null }
    }
  }
  return dateFilter
}
