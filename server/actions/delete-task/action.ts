'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { deleteOneTask } from '@/server/db/repos/tasks'
import { findOneTimeLog } from '@/server/db/repos/time-logs'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'
type ActionReturn = Promise<{ success: boolean }>

const deleteTaskFn = async ({ taskId }: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const hasTimeLogs = !!(await findOneTimeLog({ taskId }))
  if (hasTimeLogs) throw new Error('Task has time logs')

  await deleteOneTask({ _id: taskId, userId })

  revalidateTag(new CacheTags(userId).task(taskId))
  revalidateTag(new CacheTags(userId).allTasks())

  return { success: true }
}

export const deleteTask = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => deleteTaskFn(parsedInput))
