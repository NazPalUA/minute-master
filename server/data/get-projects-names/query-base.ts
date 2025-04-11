import 'server-only'

import { projectStatuses } from '@/lib/constants'
import { getCollection } from '@/server/db/getCollection'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { includeStatuses = projectStatuses }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: projects } = await getCollection('projects')

  const query = { userId, status: { $in: includeStatuses } }
  const cursor = projects.find<ReturnSchemaInput['data'][number]>(query, {
    sort: { updatedAt: 'descending' },
    projection: { name: 1 }
  })

  const results = await cursor.toArray()

  return { data: results }
}
