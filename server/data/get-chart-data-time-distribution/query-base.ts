import 'server-only'

import { CollectionName, getCollection } from '@/server/db/getCollection'
import { getTimeRangeFilterForTimeLog } from '@/server/db/repos/time-logs'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

/**
 * Parameters for time distribution queries.
 *
 * @property projectId - Optional project ID. When provided, returns time distribution
 *                       between sections for that project. When not provided, returns
 *                       time distribution between projects for the user.
 * @property from - Optional start date for filtering (inclusive)
 * @property to - Optional end date for filtering (inclusive)
 */

/**
 * Retrieves time distribution data from MongoDB.
 *
 * This function handles both project and section time distribution:
 * - When projectId is not provided: Returns time distribution between projects for a user
 * - When projectId is provided: Returns time distribution between sections for that project
 *
 * The function uses a dynamic MongoDB aggregation pipeline that adapts based on whether
 * we're querying project or section distribution.
 *
 * @param userId - The ID of the authenticated user
 * @param params - Query parameters including optional projectId, from date, and to date
 * @returns Time distribution data with unified format for both project and section distribution
 */
export async function getData(
  { projectId, from, to }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: timeLogs } = await getCollection('time-logs')

  // Determine target collection based on whether projectId is provided
  const targetColName: CollectionName = projectId ? 'sections' : 'projects'

  // Convert undefined values to null for MongoDB
  const fromDate = from || null
  const toDate = to || null

  const dateFilter = getTimeRangeFilterForTimeLog(from, to)

  const pipeline = [
    {
      $match: {
        userId,
        ...(projectId && { projectId }),
        ...dateFilter
      }
    },
    {
      $addFields: {
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
    {
      $addFields: {
        duration: {
          $subtract: ['$effectiveEndDate', '$effectiveStartDate']
        }
      }
    },
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
        _id: targetColName === 'projects' ? '$projectId' : '$sectionId',
        name: { $first: '$name' },
        timeLogDuration: { $sum: '$duration' }
      }
    },
    {
      $match: {
        timeLogDuration: { $gt: 0 }
      }
    },
    {
      $sort: { timeLogDuration: -1 }
    }
  ]

  const entityTimes = await timeLogs.aggregate(pipeline).toArray()

  const totalTimeAcrossEntities = entityTimes.reduce(
    (sum, targetColDoc) => sum + targetColDoc.timeLogDuration,
    0
  )

  const timeLogsWithShare = entityTimes.map(targetColDoc => ({
    id: targetColDoc._id,
    name: targetColDoc.name,
    duration: targetColDoc.timeLogDuration,
    percentage:
      totalTimeAcrossEntities > 0
        ? Number(
            (
              (targetColDoc.timeLogDuration / totalTimeAcrossEntities) *
              100
            ).toFixed(2)
          )
        : 0
  }))

  return {
    timeLogs: timeLogsWithShare,
    totalDuration: totalTimeAcrossEntities
  } as ReturnSchemaInput
}
