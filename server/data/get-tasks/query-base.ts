import 'server-only'

import { taskStatuses } from '@/lib/constants'
import { getCollection } from '@/server/db/getCollection'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  {
    includeStatuses = taskStatuses,
    projectId,
    sectionId,
    page,
    limit,
    getAllItems
  }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: tasks } = await getCollection('tasks')

  const matchStage = {
    $match: {
      userId,
      ...(projectId && { projectId }),
      ...(sectionId && { sectionId }),
      status: { $in: includeStatuses }
    }
  }

  const lookupStages = [
    {
      $lookup: {
        from: 'time-logs',
        localField: '_id',
        foreignField: 'taskId',
        as: 'timeLogs',
        pipeline: [
          {
            $project: {
              startDate: 1,
              endDate: 1
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project',
        pipeline: [{ $project: { name: 1 } }]
      }
    },
    {
      $lookup: {
        from: 'sections',
        localField: 'sectionId',
        foreignField: '_id',
        as: 'section',
        pipeline: [{ $project: { name: 1 } }]
      }
    }
  ]

  const transformStage = {
    $addFields: {
      totalRuntime: {
        $reduce: {
          input: '$timeLogs',
          initialValue: 0,
          in: {
            $add: [
              '$$value',
              {
                $subtract: [
                  { $ifNull: ['$$this.endDate', '$$NOW'] },
                  '$$this.startDate'
                ]
              }
            ]
          }
        }
      },
      project: { $arrayElemAt: ['$project.name', 0] },
      section: { $arrayElemAt: ['$section.name', 0] }
    }
  }

  const projectStage = {
    $unset: ['createdAt', 'updatedAt', 'timeLogs']
  }

  const sortStage = { $sort: { updatedAt: -1 } }

  // Build the data pipeline
  const dataPipeline: any[] = [
    matchStage,
    ...lookupStages,
    transformStage,
    projectStage,
    sortStage
  ]

  let totalItems = 0
  let totalPages = 1

  if (!getAllItems) {
    // Get total count for pagination
    const countPipeline = [
      matchStage,
      {
        $count: 'total'
      }
    ]

    const countResult = await tasks.aggregate(countPipeline).toArray()
    totalItems = countResult.length > 0 ? countResult[0].total : 0
    totalPages = Math.ceil(totalItems / limit)
    const skip = (page - 1) * limit

    // Add pagination stages
    dataPipeline.push({ $skip: skip }, { $limit: limit })
  }

  const results = await tasks.aggregate(dataPipeline).toArray()

  // If getting all items, set totalItems to the actual count
  if (getAllItems) {
    totalItems = results.length
  }

  return {
    data: results,
    pagination: {
      totalItems,
      totalPages: getAllItems ? 1 : totalPages,
      currentPage: getAllItems ? 1 : page,
      itemsPerPage: getAllItems ? totalItems : limit
    }
  } as ReturnSchemaInput
}
