import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { projectId, sectionId, taskId, page, limit, getAllItems }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: timeLogs } = await getCollection('time-logs')

  const matchStage = {
    $match: {
      userId,
      projectId,
      ...(sectionId && { sectionId }),
      ...(taskId !== undefined && { taskId })
    }
  }

  const lookupStages = [
    {
      $lookup: {
        from: 'tasks',
        localField: 'taskId',
        foreignField: '_id',
        as: 'task',
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
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project',
        pipeline: [{ $project: { name: 1 } }]
      }
    }
  ]

  const transformStage = {
    $addFields: {
      taskName: { $arrayElemAt: ['$task.name', 0] },
      sectionName: { $arrayElemAt: ['$section.name', 0] },
      projectName: { $arrayElemAt: ['$project.name', 0] },
      duration: {
        $subtract: [{ $ifNull: ['$endDate', '$$NOW'] }, '$startDate']
      }
    }
  }

  const projectStage = {
    $project: {
      _id: 0,
      id: '$_id',
      start: '$startDate',
      end: '$endDate',
      duration: 1,
      taskId: 1,
      taskName: 1,
      sectionId: 1,
      sectionName: 1,
      projectId: 1,
      projectName: 1
    }
  }

  const sortStage = { $sort: { end: -1 } }

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

    const countResult = await timeLogs.aggregate(countPipeline).toArray()
    totalItems = countResult.length > 0 ? countResult[0].total : 0
    totalPages = Math.ceil(totalItems / limit)
    const skip = (page - 1) * limit

    // Add pagination stages
    dataPipeline.push({ $skip: skip }, { $limit: limit })
  }

  const results = await timeLogs.aggregate(dataPipeline).toArray()

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
