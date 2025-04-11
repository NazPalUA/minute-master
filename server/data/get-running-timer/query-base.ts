import 'server-only'

import { collections, getCollection } from '@/server/db/getCollection'
import { ReturnSchemaInput } from './schema-return'

export async function getData(userId: string): Promise<ReturnSchemaInput> {
  const { collection: timeLogs } = await getCollection('time-logs')

  const pipeline = [
    {
      $match: {
        userId,
        endDate: null
      }
    },
    {
      $project: {
        _id: 1,
        startDate: 1,
        projectId: 1,
        sectionId: 1,
        taskId: 1
      }
    },
    { $limit: 1 },
    {
      $lookup: {
        from: collections.projects,
        localField: 'projectId',
        foreignField: '_id',
        as: 'project',
        pipeline: [{ $project: { name: 1 } }]
      }
    },
    {
      $lookup: {
        from: collections.sections,
        localField: 'sectionId',
        foreignField: '_id',
        as: 'section',
        pipeline: [{ $project: { name: 1 } }]
      }
    },
    {
      $lookup: {
        from: collections.tasks,
        localField: 'taskId',
        foreignField: '_id',
        as: 'task',
        pipeline: [{ $project: { name: 1 } }]
      }
    },
    {
      $project: {
        timeLog: {
          _id: '$_id',
          startDate: '$startDate'
        },
        project: { $mergeObjects: [{ $arrayElemAt: ['$project', 0] }, {}] },
        section: { $mergeObjects: [{ $arrayElemAt: ['$section', 0] }, {}] },
        task: { $ifNull: [{ $arrayElemAt: ['$task', 0] }, null] }
      }
    }
  ]

  const result = await timeLogs.aggregate(pipeline).next()

  return result as ReturnSchemaInput
}
