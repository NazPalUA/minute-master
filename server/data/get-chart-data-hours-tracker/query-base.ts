import 'server-only'

import { isoWeekToDate } from '@/lib/utils'
import { CollectionName, getCollection } from '@/server/db/getCollection'
import { getTimeRangeFilterForTimeLog } from '@/server/db/repos/time-logs'
import type { BarStep } from './lib/consts'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

/**
 * Parameters for time analysis queries.
 *
 * @property projectId - Optional project ID. When provided, returns time analysis
 *                       for sections for that project. When not provided, returns
 *                       time analysis for projects for the user.
 * @property barStep - The time step unit for the analysis (e.g. 'day', 'week', 'month', 'year')
 * @property from - Optional start date for filtering (inclusive)
 * @property to - Optional end date for filtering (inclusive)
 */

/**
 * Gets the date grouping expression for MongoDB based on the barStep
 */
function getDateGrouping(barStep: BarStep) {
  switch (barStep) {
    case 'day':
      return {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$effectiveStartDate'
        }
      }
    case 'week':
      return {
        $dateToString: {
          format: '%G-W%V',
          date: '$effectiveStartDate'
        }
      }
    case 'month':
      return {
        $dateToString: {
          format: '%Y-%m',
          date: '$effectiveStartDate'
        }
      }
    case 'year':
      return {
        $dateToString: {
          format: '%Y',
          date: '$effectiveStartDate'
        }
      }
    default:
      throw new Error(`Unsupported barStep: ${barStep}`)
  }
}

/**
 * Generates an array of date labels for all periods within the specified range
 */
function generateAllPeriods(barStep: BarStep, from: Date, to: Date): string[] {
  const periods: string[] = []
  const currentDate = new Date(from)

  // Format a date according to the barStep
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    switch (barStep) {
      case 'day':
        return `${year}-${month.toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      case 'week': {
        // Get ISO week number - this should match MongoDB's %G-W%V format
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)

        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay() || 7))

        // Get first day of year
        const yearStart = new Date(d.getFullYear(), 0, 1)

        // Calculate full weeks to nearest Thursday
        const week = Math.ceil(
          ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
        )

        // Get the ISO year
        // If the week number is 0 or 52/53, it belongs to the previous/next year
        let isoYear = d.getFullYear()
        if (week === 0) {
          // This is the last week of the previous year
          isoYear--
        } else if (week === 53 && new Date(isoYear, 11, 31).getDay() < 3) {
          // This is actually the first week of the next year
          isoYear++
        }

        return `${isoYear}-W${week.toString().padStart(2, '0')}`
      }
      case 'month':
        return `${year}-${month.toString().padStart(2, '0')}`
      case 'year':
        return `${year}`
      default:
        throw new Error(`Unsupported barStep: ${barStep}`)
    }
  }

  // Increment date by one period
  const incrementDate = (date: Date): void => {
    switch (barStep) {
      case 'day':
        date.setDate(date.getDate() + 1)
        break
      case 'week':
        date.setDate(date.getDate() + 7)
        break
      case 'month':
        date.setMonth(date.getMonth() + 1)
        break
      case 'year':
        date.setFullYear(date.getFullYear() + 1)
        break
    }
  }

  // Generate all periods
  while (currentDate <= to) {
    periods.push(formatDate(currentDate))
    incrementDate(currentDate)
  }

  return periods
}

/**
 * Retrieves time analysis data from MongoDB.
 *
 * This function handles both project and section time analysis:
 * - When projectId is not provided: Returns time analysis for projects for a user
 * - When projectId is provided: Returns time analysis for sections for that project
 *
 * The function uses a dynamic MongoDB aggregation pipeline that adapts based on whether
 * we're querying project or section analysis.
 *
 * @param userId - The ID of the authenticated user
 * @param params - Query parameters including barStep, optional projectId, from date, and to date
 * @returns Time analysis data with unified format for both project and section analysis
 */
export async function getData(
  { projectId, barStep, from, to, timeRange }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: timeLogs } = await getCollection('time-logs')

  // Determine target collection based on whether projectId is provided
  const targetColName: CollectionName = projectId ? 'sections' : 'projects'

  const dateFilter = getTimeRangeFilterForTimeLog(from, to)

  // Convert undefined values to null for MongoDB
  const fromDate = from || null
  const toDate = to || null

  const pipeline = [
    // Initial filter for time logs
    {
      $match: {
        userId,
        ...(projectId && { projectId }),
        ...dateFilter
      }
    },

    // Calculate effective start/end dates for partial overlaps with the date range
    {
      $addFields: {
        // If log starts before the 'from' date, use 'from' as the effective start
        effectiveStartDate: {
          $cond: {
            if: {
              $and: [
                { $ne: [fromDate, null] },
                { $lt: ['$startDate', fromDate] }
              ]
            },
            then: fromDate,
            else: '$startDate'
          }
        },
        // If log ends after the 'to' date, use 'to' as the effective end
        effectiveEndDate: {
          $cond: {
            if: {
              $and: [{ $ne: [toDate, null] }, { $gt: ['$endDate', toDate] }]
            },
            then: toDate,
            else: '$endDate'
          }
        }
      }
    },

    // Calculate duration based on effective dates
    {
      $addFields: {
        duration: {
          $subtract: ['$effectiveEndDate', '$effectiveStartDate']
        }
      }
    },

    // Filter out invalid durations
    {
      $match: {
        duration: { $gt: 0 }
      }
    },
    {
      $lookup: {
        from: targetColName,
        localField: targetColName === 'projects' ? 'projectId' : 'sectionId',
        foreignField: '_id',
        as: 'targetColDoc'
      }
    },
    {
      $match: {
        targetColDoc: { $ne: [] }
      }
    },
    {
      $addFields: {
        name: { $arrayElemAt: ['$targetColDoc.name', 0] }
      }
    },
    {
      $group: {
        _id: {
          period: getDateGrouping(barStep),
          entityId: targetColName === 'projects' ? '$projectId' : '$sectionId'
        },
        name: { $first: '$name' },
        totalTime: { $sum: '$duration' }
      }
    },
    // We only filter individual entities with 0 time, not entire periods
    {
      $match: {
        totalTime: { $gt: 0 }
      }
    },
    // Sort entities by time within each period
    {
      $sort: { '_id.period': 1, totalTime: -1 }
    },
    // Group by period, collecting all entities for each period
    {
      $group: {
        _id: '$_id.period',
        analysisArray: {
          $push: {
            id: '$_id.entityId',
            name: '$name',
            totalTime: '$totalTime'
          }
        }
      }
    },
    // Project to the final format
    {
      $project: {
        _id: 0,
        dateLabel: '$_id',
        analysisArray: 1
      }
    },
    // Sort periods chronologically
    {
      $sort: { dateLabel: 1 }
    }
  ]

  const result = await timeLogs.aggregate(pipeline).toArray()

  // Find the earliest and latest date labels from the result
  if (result.length > 0) {
    // If from/to weren't provided, we need to determine them from the data
    // to fill in missing periods between the earliest and latest data points
    if (!from || !to) {
      const sortedResults = [...result].sort((a, b) =>
        a.dateLabel.localeCompare(b.dateLabel)
      )

      if (sortedResults.length > 0) {
        // Extract the earliest and latest date labels
        const earliestLabel = sortedResults[0].dateLabel
        const latestLabel = sortedResults[sortedResults.length - 1].dateLabel

        // Convert these labels back to dates for use with generateAllPeriods
        const startDate = labelToDate(earliestLabel, barStep)
        const endDate = labelToDate(latestLabel, barStep)

        if (startDate && endDate) {
          const allPeriods = generateAllPeriods(barStep, startDate, endDate)

          // Create a map of existing periods from the query result
          const existingPeriodsMap = new Map(
            result.map(item => [item.dateLabel, item])
          )

          // Create the complete result with all periods
          const completeResult = allPeriods.map(period => {
            return (
              existingPeriodsMap.get(period) || {
                dateLabel: period,
                analysisArray: []
              }
            )
          })

          return {
            data: completeResult,
            barStep,
            timeRange
          } as ReturnSchemaInput
        }
      }
    } else {
      // Original logic for when from/to are provided
      const allPeriods = generateAllPeriods(barStep, from, to)

      // Create a map of existing periods from the query result
      const existingPeriodsMap = new Map(
        result.map(item => [item.dateLabel, item])
      )

      // Create the complete result with all periods
      let completeResult = allPeriods.map(period => {
        return (
          existingPeriodsMap.get(period) || {
            dateLabel: period,
            analysisArray: []
          }
        )
      })

      // Additional post-filtering for weeks that might cross year boundaries
      if (barStep === 'week' && from && to) {
        const fromYear = from.getFullYear()
        const toYear = to.getFullYear()

        // Filter out weeks that belong to different years than requested
        completeResult = completeResult.filter(item => {
          if (!item.dateLabel.includes('-W')) return true

          // Extract the year from the ISO week format (YYYY-WXX)
          const weekYear = parseInt(item.dateLabel.split('-W')[0], 10)

          // If the requested range is within a single year, only include that year's weeks
          if (fromYear === toYear) {
            return weekYear === fromYear
          }

          // For multi-year ranges, include weeks within the range of years
          return weekYear >= fromYear && weekYear <= toYear
        })
      }

      return {
        data: completeResult,
        barStep,
        timeRange
      } as ReturnSchemaInput
    }
  }

  return {
    data: [],
    barStep,
    timeRange
  } as ReturnSchemaInput
}

/**
 * Converts a period label (e.g., "2025-W01") back to a Date object
 */
function labelToDate(label: string, barStep: BarStep): Date | null {
  try {
    switch (barStep) {
      case 'day': {
        // Format: YYYY-MM-DD
        const [year, month, day] = label.split('-').map(Number)
        return new Date(year, month - 1, day)
      }
      case 'week': {
        // Format: YYYY-WXX
        return isoWeekToDate(label)
      }
      case 'month': {
        // Format: YYYY-MM
        const [year, month] = label.split('-').map(Number)
        return new Date(year, month - 1, 1)
      }
      case 'year': {
        // Format: YYYY
        return new Date(parseInt(label, 10), 0, 1)
      }
      default:
        return null
    }
  } catch (error) {
    console.error(`Error converting label ${label} to date:`, error)
    return null
  }
}
