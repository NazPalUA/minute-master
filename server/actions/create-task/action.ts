'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { insertTask } from '@/server/db/repos/tasks'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<{ taskId: string }>

const createTaskFn = async (payload: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const taskId = await insertTask({
    userId,
    ...payload
  })

  revalidateTag(new CacheTags(userId).allTasks())

  return { taskId: taskId.toString() }
}

export const createTask = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => createTaskFn(parsedInput))
