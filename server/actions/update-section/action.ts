'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { updateOneSection } from '@/server/db/repos/sections'
import { auth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<void>

const updateSectionFn = async ({
  query: { projectId, sectionId },
  payload
}: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await updateOneSection(new ObjectId(sectionId), payload)

  const tg = new CacheTags(userId)
  revalidateTag(tg.section(sectionId))
  revalidateTag(tg.projectSectionsMeta(projectId))
}

export const updateSection = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => updateSectionFn(parsedInput))
