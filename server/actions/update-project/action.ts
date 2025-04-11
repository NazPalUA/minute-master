'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { updateOneProject } from '@/server/db/repos/projects'
import { auth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<void>

const updateProjectFn = async ({
  query: { projectId },
  payload
}: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await updateOneProject(new ObjectId(projectId), payload)

  const tg = new CacheTags(userId)
  revalidateTag(tg.project(projectId))
  if (payload.name || payload.description) revalidateTag(tg.allProjectsMeta())
  if (payload.dueDate || payload.estimatedTime) revalidateTag(tg.allProjects())
}

export const updateProject = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => updateProjectFn(parsedInput))
