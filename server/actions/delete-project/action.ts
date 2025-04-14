'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { deleteOneProject } from '@/server/db/repos/projects'
import { findOneTask } from '@/server/db/repos/tasks'
import { findOneTimeLog } from '@/server/db/repos/time-logs'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'
type ActionReturn = Promise<{ success: boolean }>

const deleteProjectFn = async ({ projectId }: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const hasTimeLogs = !!(await findOneTimeLog({ projectId }))
  if (hasTimeLogs) throw new Error('Project has time logs')

  const hasTasks = !!(await findOneTask({ projectId }))
  if (hasTasks) throw new Error('Project has tasks')

  await deleteOneProject({ _id: projectId, userId })

  revalidateTag(new CacheTags(userId).project(projectId))
  revalidateTag(new CacheTags(userId).allProjects())

  return { success: true }
}

export const deleteProject = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => deleteProjectFn(parsedInput))
