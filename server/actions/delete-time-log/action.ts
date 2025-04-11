'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import {
  deleteTimeLog as deleteTimeLogRepo,
  findOneTimeLog
} from '@/server/db/repos/time-logs'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<{ success: boolean }>

const deleteTimeLogFn = async ({ timeLogId }: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const timeLog = await findOneTimeLog({ _id: timeLogId, userId })
  if (!timeLog) throw new Error('Time log not found')

  await deleteTimeLogRepo(timeLogId)

  revalidateTag(new CacheTags(userId).timeLog(timeLogId))
  revalidateTag(new CacheTags(userId).allTimeLogs())

  return { success: true }
}

export const deleteTimeLog = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => deleteTimeLogFn(parsedInput))
