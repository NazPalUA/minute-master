import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import type { ClientSession, Filter } from 'mongodb'
import { ProjectEntity } from '../projects-collection-schema'

export async function deleteOneProject(
  filter: Filter<ProjectEntity>,
  session?: ClientSession
) {
  const { collection: projects } = await getCollection('projects')

  const result = await projects.deleteOne(filter, { session })

  if (result.deletedCount !== 1) {
    throw new Error('Project not found or not deleted')
  }

  return result
}
