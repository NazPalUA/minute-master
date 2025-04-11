import 'server-only'

import { taskStatuses } from '@/lib/constants'
import { getCollection } from '@/server/db/getCollection'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { includeStatuses = taskStatuses, projectId, sectionId }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: tasks } = await getCollection('tasks')

  const query = {
    userId,
    status: { $in: includeStatuses },
    ...(projectId && { projectId }),
    ...(sectionId && { sectionId })
  }
  const cursor = tasks.find<ReturnSchemaInput['data'][number]>(query, {
    sort: { updatedAt: 'descending' },
    projection: {
      name: 1
    }
  })

  const results = await cursor.toArray()

  return { data: results }
}
