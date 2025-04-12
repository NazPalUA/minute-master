import 'server-only'

import { CacheTags } from '@/server/cache-tags'
import { auth } from '@clerk/nextjs/server'
import { unstable_cache as cache } from 'next/cache'
import { redirect } from 'next/navigation'
import { getData } from './query-base'
import {
  GetMetricsTimeTrackingInput,
  Params,
  paramsSchema
} from './schema-input'
import { GetMetricsTimeTrackingReturn, returnSchema } from './schema-return'

const getCachedAndValidatedData = (params: Params, userId: string) => {
  const tg = new CacheTags(userId)
  const cacheTags = [
    tg.user(),
    tg.allTimeLogs(),
    ...(params.projectId ? [tg.projectTimeLogs(params.projectId)] : [])
  ]

  return cache(
    async (params: Params, userId: string) => {
      // console.log(`[Cache Miss] getMetricsTimeTracking: ${JSON.stringify({ params, userId }, null, 2)}`)

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

export async function getMetricsTimeTracking(
  params: GetMetricsTimeTrackingInput
): Promise<GetMetricsTimeTrackingReturn> {
  const parsedParams = paramsSchema.parse(params)

  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return await getCachedAndValidatedData(parsedParams, userId)
}
