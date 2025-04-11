import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { ClientSession, ObjectId } from 'mongodb'
import {
  ProjectEntitySchema,
  type ProjectEntity
} from '../projects-collection-schema'

export async function updateOneProject(
  _id: ObjectId,
  updateCandidate: Partial<ProjectEntity>,
  session?: ClientSession
) {
  const updateData = ProjectEntitySchema.partial().parse(updateCandidate)
  const { collection: projects } = await getCollection('projects')

  const result = await projects.updateOne(
    { _id },
    { $set: updateData },
    { session }
  )

  if (result.modifiedCount !== 1) {
    throw new Error('Project not found or not updated')
  }

  return result
}
