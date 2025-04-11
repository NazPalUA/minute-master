import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { ObjectId } from 'mongodb'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { projectId }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: sections } = await getCollection('sections')

  const query = { userId, projectId: new ObjectId(projectId) }
  const cursor = sections.find<ReturnSchemaInput['data'][number]>(query, {
    sort: { updatedAt: 'descending' },
    projection: {
      name: 1
    }
  })

  const results = await cursor.toArray()

  return { data: results } as ReturnSchemaInput
}
