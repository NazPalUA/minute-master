'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { deleteOneTimeLog } from '@/server/db/repos/time-logs'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<{ success: boolean }>

const deleteTimeLogFn = async ({ timeLogId }: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await deleteOneTimeLog({ _id: timeLogId, userId })

  revalidateTag(new CacheTags(userId).timeLog(timeLogId))
  revalidateTag(new CacheTags(userId).allTimeLogs())

  return { success: true }
}

export const deleteTimeLog = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => deleteTimeLogFn(parsedInput))
