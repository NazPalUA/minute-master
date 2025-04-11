import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { ObjectId } from 'mongodb'
import { Params } from './schema-input'
import { ReturnSchemaInput } from './schema-return'

export async function getData(
  { projectId }: Params,
  userId: string
): Promise<ReturnSchemaInput> {
  const { collection: projects } = await getCollection('projects')

  const query = { _id: new ObjectId(projectId), userId }
  const results = await projects.findOne<ReturnSchemaInput>(query, {
    sort: { updatedAt: 'descending' },
    projection: { createdAt: 0, updatedAt: 0 }
  })

  if (!results) throw new Error('Project not found')

  return results
}
