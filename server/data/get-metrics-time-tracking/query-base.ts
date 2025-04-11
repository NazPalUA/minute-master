import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { projectId, period }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: timeLogs } = await getCollection('time-logs')

  // Calculate date ranges for current and previous periods
  const now = new Date()
  const currentPeriodStart = new Date()
  const previousPeriodStart = new Date()

  if (period === 'month') {
    // Set to first day of current month
    currentPeriodStart.setDate(1)
    currentPeriodStart.setHours(0, 0, 0, 0)

    // Set to first day of previous month
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1)
    previousPeriodStart.setDate(1)
    previousPeriodStart.setHours(0, 0, 0, 0)
  } else if (period === 'week') {
    // Set to beginning of current week (Sunday)
    const day = currentPeriodStart.getDay()
    currentPeriodStart.setDate(currentPeriodStart.getDate() - day)
    currentPeriodStart.setHours(0, 0, 0, 0)

    // Set to beginning of previous week
    previousPeriodStart.setDate(previousPeriodStart.getDate() - day - 7)
    previousPeriodStart.setHours(0, 0, 0, 0)
  }

  const query = {
    userId,
    ...(projectId && { projectId }),
    endDate: { $ne: null }
  }

  // Query for current period
  const currentPeriodQuery = {
    ...query,
    startDate: { $gte: currentPeriodStart, $lte: now }
  }

  // Query for previous period
  const previousPeriodQuery = {
    ...query,
    startDate: { $gte: previousPeriodStart, $lt: currentPeriodStart }
  }

  // Get time logs for current period
  const currentPeriodLogs = await timeLogs.find(currentPeriodQuery).toArray()

  // Get time logs for previous period
  const previousPeriodLogs = await timeLogs.find(previousPeriodQuery).toArray()

  // Calculate total time for current period (in milliseconds)
  const currentPeriodTotal = currentPeriodLogs.reduce((total, log) => {
    if (!log.startDate || !log.endDate) return total

    const start = new Date(log.startDate).getTime()
    const end = new Date(log.endDate).getTime()
    return total + (end - start)
  }, 0)

  // Calculate total time for previous period (in milliseconds)
  const previousPeriodTotal = previousPeriodLogs.reduce((total, log) => {
    if (!log.startDate || !log.endDate) return total

    const start = new Date(log.startDate).getTime()
    const end = new Date(log.endDate).getTime()
    return total + (end - start)
  }, 0)

  // Calculate days in current period
  const currentPeriodDays = Math.ceil(
    (now.getTime() - currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Calculate days in previous period
  const previousPeriodDays = Math.ceil(
    (currentPeriodStart.getTime() - previousPeriodStart.getTime()) /
      (1000 * 60 * 60 * 24)
  )

  // Calculate average time spent per day for current period (avoid division by zero)
  const currentAverageTimePerDay =
    currentPeriodDays > 0 ? currentPeriodTotal / currentPeriodDays : 0

  // Calculate average time spent per day for previous period (avoid division by zero)
  const previousAverageTimePerDay =
    previousPeriodDays > 0 ? previousPeriodTotal / previousPeriodDays : 0

  // Calculate changes for each metric
  const totalChange = currentPeriodTotal - previousPeriodTotal
  const averageChange = Math.round(
    currentAverageTimePerDay - previousAverageTimePerDay
  )

  return {
    value: {
      total: currentPeriodTotal,
      average: Math.round(currentAverageTimePerDay) // Round to nearest millisecond
    },
    change: {
      total: totalChange,
      average: averageChange
    }
  }
}
