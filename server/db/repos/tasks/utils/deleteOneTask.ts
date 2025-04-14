import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import type { ClientSession, Filter } from 'mongodb'
import { TaskEntity } from '../tasks-collection-schema'

export async function deleteOneTask(
  filter: Filter<TaskEntity>,
  session?: ClientSession
) {
  const { collection: tasks } = await getCollection('tasks')

  const result = await tasks.deleteOne(filter, { session })

  if (result.deletedCount !== 1) {
    throw new Error('Task not found or not deleted')
  }

  return result
}
