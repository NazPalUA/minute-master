'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { updateOneProject } from '@/server/db/repos/projects'
import { auth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<void>

const updateProjectStatusFn = async ({
  query: { projectId },
  payload
}: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await updateOneProject(new ObjectId(projectId), payload)

  const tg = new CacheTags(userId)
  revalidateTag(tg.project(projectId))
  revalidateTag(tg.allProjects())
}

export const updateProjectStatus = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => updateProjectStatusFn(parsedInput))
