import 'server-only'

import { CacheTags } from '@/server/cache-tags'
import { auth } from '@clerk/nextjs/server'
import { unstable_cache as cache } from 'next/cache'
import { redirect } from 'next/navigation'
import { getData } from './query-base'
import { GetRunningTimerReturn, returnSchema } from './schema-return'

const getCachedAndValidatedData = (userId: string) => {
  const tg = new CacheTags(userId)
  const cacheTags = [
    tg.user(),
    tg.allProjects(),
    tg.allProjectsMeta(),
    tg.allSections(),
    tg.allSectionsMeta(),
    tg.allTasks(),
    tg.allTasksMeta(),
    tg.allTimeLogs()
  ]

  return cache(
    async (userId: string) => {
      // console.log(`[Cache Miss] getRunningTimer: ${JSON.stringify({ userId }, null, 2)}`)

      const data = await getData(userId)
      return returnSchema.parse(data)
    },
    [],
    {
      tags: [...cacheTags],
      revalidate: 60 * 60 // 1 hour
    }
  )(userId)
}

export async function getRunningTimer(): Promise<GetRunningTimerReturn> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return await getCachedAndValidatedData(userId)
}
