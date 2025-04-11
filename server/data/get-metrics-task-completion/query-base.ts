import 'server-only'

import { TASK_STATUSES } from '@/lib/constants/task-statuses'
import { getCollection } from '@/server/db/getCollection'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { projectId, period }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: tasks } = await getCollection('tasks')

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

  // Build the base query for completed tasks
  const baseQuery = {
    userId,
    status: TASK_STATUSES.COMPLETED,
    completedDate: { $ne: null }
  }

  // Add projectId filter if provided
  const query = projectId ? { ...baseQuery, projectId } : baseQuery

  // Query for current period
  const currentPeriodQuery = {
    ...query,
    completedDate: { $gte: currentPeriodStart, $lte: now }
  }

  // Query for previous period
  const previousPeriodQuery = {
    ...query,
    completedDate: { $gte: previousPeriodStart, $lt: currentPeriodStart }
  }

  // Count completed tasks for current period
  const currentPeriodCount = await tasks.countDocuments(currentPeriodQuery)

  // Count completed tasks for previous period
  const previousPeriodCount = await tasks.countDocuments(previousPeriodQuery)

  // Calculate days in current and previous periods
  const currentPeriodDays = Math.ceil(
    (now.getTime() - currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
  )

  const previousPeriodDays = Math.ceil(
    (currentPeriodStart.getTime() - previousPeriodStart.getTime()) /
      (1000 * 60 * 60 * 24)
  )

  // Calculate average tasks per day for current period
  const currentAverageTasksPerDay =
    currentPeriodDays > 0 ? currentPeriodCount / currentPeriodDays : 0

  // Calculate average tasks per day for previous period
  const previousAverageTasksPerDay =
    previousPeriodDays > 0 ? previousPeriodCount / previousPeriodDays : 0

  // Calculate average duration of completed tasks for current period
  let currentAverageDuration = 0
  if (currentPeriodCount > 0) {
    const currentDurationAggregation = await tasks
      .aggregate([
        { $match: currentPeriodQuery },
        {
          $project: {
            duration: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$startDate', null] },
                    { $ne: ['$completedDate', null] }
                  ]
                },
                { $subtract: ['$completedDate', '$startDate'] },
                0
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            totalDuration: { $sum: '$duration' },
            count: { $sum: 1 }
          }
        }
      ])
      .toArray()

    if (
      currentDurationAggregation.length > 0 &&
      currentDurationAggregation[0].count > 0
    ) {
      currentAverageDuration = Math.round(
        currentDurationAggregation[0].totalDuration /
          currentDurationAggregation[0].count
      )
    }
  }

  // Calculate average duration of completed tasks for previous period
  let previousAverageDuration = 0
  if (previousPeriodCount > 0) {
    const previousDurationAggregation = await tasks
      .aggregate([
        { $match: previousPeriodQuery },
        {
          $project: {
            duration: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$startDate', null] },
                    { $ne: ['$completedDate', null] }
                  ]
                },
                { $subtract: ['$completedDate', '$startDate'] },
                0
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            totalDuration: { $sum: '$duration' },
            count: { $sum: 1 }
          }
        }
      ])
      .toArray()

    if (
      previousDurationAggregation.length > 0 &&
      previousDurationAggregation[0].count > 0
    ) {
      previousAverageDuration = Math.round(
        previousDurationAggregation[0].totalDuration /
          previousDurationAggregation[0].count
      )
    }
  }

  // Calculate changes for each metric
  const totalChange = currentPeriodCount - previousPeriodCount
  const averageChange = parseFloat(
    (currentAverageTasksPerDay - previousAverageTasksPerDay).toFixed(1)
  )
  const durationChange = currentAverageDuration - previousAverageDuration

  return {
    value: {
      total: currentPeriodCount,
      average: parseFloat(currentAverageTasksPerDay.toFixed(1)), // Round to 1 decimal place
      averageDuration: currentAverageDuration
    },
    change: {
      total: totalChange,
      average: averageChange,
      averageDuration: durationChange
    }
  }
}
