import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { projectId }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: sections } = await getCollection('sections')

  const pipeline = [
    {
      $match: {
        userId,
        projectId
      }
    },
    {
      $sort: { updatedAt: -1 }
    },
    {
      $lookup: {
        from: 'tasks',
        localField: '_id',
        foreignField: 'sectionId',
        as: 'tasks',
        pipeline: [{ $count: 'count' }]
      }
    },
    {
      $lookup: {
        from: 'time-logs',
        localField: '_id',
        foreignField: 'sectionId',
        as: 'timeLogs',
        pipeline: [
          {
            $project: {
              duration: {
                $cond: {
                  if: { $ifNull: ['$endDate', false] },
                  then: { $subtract: ['$endDate', '$startDate'] },
                  else: 0
                }
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$duration' }
            }
          }
        ]
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        taskCount: { $ifNull: [{ $arrayElemAt: ['$tasks.count', 0] }, 0] },
        timeSpent: { $ifNull: [{ $arrayElemAt: ['$timeLogs.total', 0] }, 0] }
      }
    }
  ]

  const results = await sections.aggregate(pipeline).toArray()

  return { data: results } as ReturnSchemaInput
}
