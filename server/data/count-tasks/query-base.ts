import 'server-only'

import { TASK_STATUSES, TaskStatus } from '@/lib/constants/task-statuses'
import { getCollection } from '@/server/db/getCollection'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { projectId }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: tasks } = await getCollection('tasks')

  const results = await tasks
    .aggregate([
      {
        $match: {
          projectId,
          userId
        }
      },
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ]
        }
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
          statusCounts: 1
        }
      }
    ])
    .toArray()

  const returnData: ReturnSchemaInput = {
    total: 0,
    [TASK_STATUSES.COMPLETED]: 0,
    [TASK_STATUSES.IN_PROGRESS]: 0,
    [TASK_STATUSES.NOT_STARTED]: 0,
    [TASK_STATUSES.ON_HOLD]: 0
  }

  if (!results.length) return returnData

  const { total, statusCounts } = results[0]
  returnData.total = total

  for (const { _id: status, count } of statusCounts) {
    if (isValidTaskStatus(status)) {
      returnData[status] = count
    }
  }

  return returnData
}

function isValidTaskStatus(status: string): status is TaskStatus {
  return Object.values(TASK_STATUSES).includes(status as TaskStatus)
}
