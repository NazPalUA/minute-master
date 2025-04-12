'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import {
  findOneTimeLog,
  updateTimeLog as updateTimeLogRepo
} from '@/server/db/repos/time-logs'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<{ success: boolean }>

const updateTimeLogFn = async ({
  query: { timeLogId },
  payload
}: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const timeLog = await findOneTimeLog({ _id: timeLogId, userId })
  if (!timeLog) throw new Error('Time log not found')

  await updateTimeLogRepo(timeLogId, payload)

  revalidateTag(new CacheTags(userId).timeLog(timeLogId))
  revalidateTag(new CacheTags(userId).allTimeLogs())

  return { success: true }
}

export const updateTimeLog = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => updateTimeLogFn(parsedInput))
