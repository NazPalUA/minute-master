import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { getTimeRangeFilterForTimeLog } from '@/server/db/repos/time-logs/utils'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { projectId, sectionId, taskId, from, to }: Params = {},
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: timeLogs } = await getCollection('time-logs')

  const dateFilter = getTimeRangeFilterForTimeLog(from, to)

  const pipeline = [
    {
      $match: {
        userId,
        ...(projectId && { projectId }),
        ...(sectionId && { sectionId }),
        ...(taskId && { taskId }),
        ...dateFilter
      }
    },
    {
      $project: {
        duration: {
          $subtract: [
            // Use the minimum of endDate and 'to' date
            { $min: ['$endDate', ...(to ? [to] : [])] },
            // Use the maximum of startDate and 'from' date
            { $max: ['$startDate', ...(from ? [from] : [])] }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        totalRuntime: { $sum: '$duration' }
      }
    }
  ]

  const result = await timeLogs.aggregate(pipeline).next()

  return { total: result?.totalRuntime ?? 0 }
}
