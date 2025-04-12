'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { insertSection } from '@/server/db/repos/sections'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<{ sectionId: string }>

const createSectionFn = async (payload: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const sectionId = await insertSection({
    userId,
    ...payload
  })

  revalidateTag(new CacheTags(userId).allSections())

  return { sectionId: sectionId.toString() }
}

export const createSection = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => createSectionFn(parsedInput))
