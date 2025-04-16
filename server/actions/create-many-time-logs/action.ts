'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import {
  insertManyTimeLogs,
  type TimeLogInput
} from '@/server/db/repos/time-logs'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<void>

const createManyTimeLogsFn = async (payload: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const timeLogCandidates: TimeLogInput[] = payload.map(timeLog => ({
    userId,
    ...timeLog
  }))

  await insertManyTimeLogs(timeLogCandidates)

  revalidateTag(new CacheTags(userId).allTimeLogs())
}

export const createManyTimeLogs = actionClient
  .metadata({ actionName: 'createManyTimeLogs' })
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => createManyTimeLogsFn(parsedInput))
