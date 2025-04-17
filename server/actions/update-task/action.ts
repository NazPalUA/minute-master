'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { updateOneTask } from '@/server/db/repos/tasks'
import { auth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<void>

const updateTaskFn = async ({
  query: { taskId },
  payload
}: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await updateOneTask(new ObjectId(taskId), payload)

  const tg = new CacheTags(userId)
  revalidateTag(tg.task(taskId))

  if (payload.name || payload.description) revalidateTag(tg.allTasksMeta())

  if (payload.dueDate || payload.estimatedTime) revalidateTag(tg.allTasks())
}

export const updateTask = actionClient
  .metadata({ actionName: 'updateTask' })
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => updateTaskFn(parsedInput))
