import 'server-only'

import { CacheTags } from '@/server/cache-tags'
import { auth } from '@clerk/nextjs/server'
import { unstable_cache as cache } from 'next/cache'
import { getData } from './query-base'
import { GetTimeLogsInput, Params, paramsSchema } from './schema-input'
import { GetTimeLogsReturn, returnSchema } from './schema-return'

const getCachedAndValidatedData = (params: Params, userId: string) => {
  const tg = new CacheTags(userId)
  const cacheTags = [
    tg.user(),
    tg.allProjects(),
    tg.allProjectsMeta(),
    tg.allSections(),
    tg.allSectionsMeta(),
    tg.allTasks(),
    tg.allTasksMeta(),
    tg.allTimeLogs(),
    ...(params.taskId ? [tg.taskTimeLogs(params.taskId)] : []),
    ...(params.sectionId ? [tg.sectionTimeLogs(params.sectionId)] : []),
    ...(params.projectId ? [tg.projectTimeLogs(params.projectId)] : [])
  ]

  return cache(
    async (params: Params, userId: string) => {
      // console.log(`[Cache Miss] getTimeLogs: ${JSON.stringify({ params, userId }, null, 2)}`)

      const data = await getData(params, userId)
      return returnSchema.parse(data)
    },
    [],
    {
      tags: [...cacheTags],
      revalidate: 60 * 60 // 1 hour
    }
  )(params, userId)
}

export async function getTimeLogs(
  params: GetTimeLogsInput
): Promise<GetTimeLogsReturn> {
  const parsedParams = paramsSchema.parse(params)

  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return await getCachedAndValidatedData(parsedParams, userId)
}
