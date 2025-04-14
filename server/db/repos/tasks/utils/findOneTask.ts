import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { Filter } from 'mongodb'
import { TaskEntity } from '../tasks-collection-schema'

export async function findOneTask(filter: Filter<TaskEntity>) {
  const { collection: tasks } = await getCollection('tasks')

  const result = await tasks.findOne(filter)

  return result
}
