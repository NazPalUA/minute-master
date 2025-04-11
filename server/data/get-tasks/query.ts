import 'server-only'

import { CacheTags } from '@/server/cache-tags'
import { auth } from '@clerk/nextjs/server'
import { unstable_cache as cache } from 'next/cache'
import { getData } from './query-base'
import { GetTasksInput, Params, paramsSchema } from './schema-input'
import { GetTasksReturn, returnSchema } from './schema-return'

const getCachedAndValidatedData = (params: Params, userId: string) => {
  const tg = new CacheTags(userId)
  const cacheTags = [
    tg.user(),
    tg.allTasks(),
    ...(params.projectId ? [tg.projectTasks(params.projectId)] : []),
    ...(params.sectionId ? [tg.sectionTasks(params.sectionId)] : []),
    tg.allProjects(),
    tg.allProjectsMeta(),
    tg.allSections(),
    tg.allSectionsMeta(),
    tg.allTimeLogs(),
    ...(params.projectId ? [tg.projectTimeLogs(params.projectId)] : []),
    ...(params.sectionId ? [tg.sectionTimeLogs(params.sectionId)] : [])
  ]

  return cache(
    async (params: Params, userId: string) => {
      // console.log(`[Cache Miss] getTasks: ${JSON.stringify({ params, userId }, null, 2)}`)

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

export async function getTasks(
  params: GetTasksInput = {}
): Promise<GetTasksReturn> {
  const parsedParams = paramsSchema.parse(params)

  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return await getCachedAndValidatedData(parsedParams, userId)
}
