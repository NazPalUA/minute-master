import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { ClientSession, ObjectId } from 'mongodb'
import { TaskEntitySchema, type TaskEntity } from '../tasks-collection-schema'

export async function updateOneTask(
  _id: ObjectId,
  updateCandidate: Partial<TaskEntity>,
  session?: ClientSession
) {
  const updateData = TaskEntitySchema.partial().parse(updateCandidate)
  const { collection: tasks } = await getCollection('tasks')

  const result = await tasks.updateOne(
    { _id },
    { $set: updateData },
    { session }
  )

  if (result.modifiedCount !== 1) {
    throw new Error('Task not found or not updated')
  }

  return result
}
