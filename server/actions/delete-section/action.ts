'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { deleteOneSection } from '@/server/db/repos/sections'
import { findOneTask } from '@/server/db/repos/tasks'
import { findOneTimeLog } from '@/server/db/repos/time-logs'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'
type ActionReturn = Promise<{ success: boolean }>

const deleteSectionFn = async ({ sectionId }: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const hasTimeLogs = !!(await findOneTimeLog({ sectionId }))
  if (hasTimeLogs) throw new Error('Section has time logs')

  const hasTasks = !!(await findOneTask({ sectionId }))
  if (hasTasks) throw new Error('Section has tasks')

  await deleteOneSection({ _id: sectionId, userId })

  revalidateTag(new CacheTags(userId).section(sectionId))
  revalidateTag(new CacheTags(userId).allSections())

  return { success: true }
}

export const deleteSection = actionClient
  .metadata({ actionName: 'deleteSection' })
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => deleteSectionFn(parsedInput))
