'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { getRunningTimeLog, updateTimeLog } from '@/server/db/repos/time-logs'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<{ runtime: number }>

const finishTimeLogFn = async ({ payload }: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const runningTimeLog = await getRunningTimeLog(userId)
  if (!runningTimeLog) throw new Error('No running time log found')

  const runtime = payload.endDate.getTime() - runningTimeLog.startDate.getTime()

  await updateTimeLog(runningTimeLog._id, payload)

  revalidateTag(new CacheTags(userId).allTimeLogs())

  return { runtime }
}

export const finishTimeLog = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => finishTimeLogFn(parsedInput))
