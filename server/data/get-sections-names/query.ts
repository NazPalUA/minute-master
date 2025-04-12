import 'server-only'

import { CacheTags } from '@/server/cache-tags'
import { auth } from '@clerk/nextjs/server'
import { unstable_cache as cache } from 'next/cache'
import { redirect } from 'next/navigation'
import { getData } from './query-base'
import { GetSectionsNamesInput, Params, paramsSchema } from './schema-input'
import { GetSectionsNamesReturn, returnSchema } from './schema-return'

const getCachedAndValidatedData = (params: Params, userId: string) => {
  const tg = new CacheTags(userId)
  const cacheTags = [
    tg.user(),
    tg.allSections(),
    tg.allSectionsMeta(),
    tg.projectSections(params.projectId),
    tg.projectSectionsMeta(params.projectId)
  ]

  return cache(
    async (params: Params, userId: string) => {
      // console.log(`[Cache Miss] getSectionsNames: ${JSON.stringify({ params, userId }, null, 2)}`)

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

export async function getSectionsNames(
  params: GetSectionsNamesInput
): Promise<GetSectionsNamesReturn> {
  const parsedParams = paramsSchema.parse(params)

  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return await getCachedAndValidatedData(parsedParams, userId)
}
