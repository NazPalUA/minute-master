'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import {
  getRunningTimeLog,
  insertTimeLog,
  type TimeLogInput
} from '@/server/db/repos/time-logs'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<void>

const createTimeLogFn = async (payload: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const runningTimeLog = await getRunningTimeLog(userId)
  if (runningTimeLog) throw new Error('Running time log already exists')

  const timeLogCandidate: TimeLogInput = {
    userId,
    ...payload
  }

  await insertTimeLog(timeLogCandidate)

  revalidateTag(new CacheTags(userId).allTimeLogs())
}

export const createTimeLog = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => createTimeLogFn(parsedInput))
