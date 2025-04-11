import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import type { ClientSession } from 'mongodb'
import { type TaskInput, TaskEntitySchema } from '..'

const MAX_TASKS = 100

export async function insertTask(
  taskCandidate: TaskInput,
  session?: ClientSession
) {
  const newTask = TaskEntitySchema.parse(taskCandidate)

  const { collection: tasks } = await getCollection('tasks')

  const taskCount = await tasks.countDocuments({
    projectId: newTask.projectId
  })
  if (taskCount >= MAX_TASKS) {
    throw new Error('Task limit reached')
  }

  const result = await tasks.insertOne(newTask, { session })

  return result.insertedId
}
