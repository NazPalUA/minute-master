'use server'

import { actionClient } from '@/lib/safe-action'
import { CacheTags } from '@/server/cache-tags'
import { withTransaction } from '@/server/db'
import { insertProject } from '@/server/db/repos/projects'
import { insertSection } from '@/server/db/repos/sections'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { paramsSchema, type Params } from './input-schema'

type ActionReturn = Promise<{
  projectId: string
  sectionId: string
}>

const createProjectFn = async (payload: Params): ActionReturn => {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const {
    name,
    description,
    dueDate,
    estimatedTime,
    sectionName,
    sectionDescription,
    createdAt,
    updatedAt
  } = payload

  const result = await withTransaction(async session => {
    const projectId = await insertProject(
      {
        userId,
        name,
        description,
        dueDate,
        estimatedTime,
        createdAt,
        updatedAt
      },
      session
    )

    const sectionId = await insertSection(
      {
        userId,
        projectId: projectId,
        name: sectionName,
        description: sectionDescription,
        createdAt,
        updatedAt
      },
      session
    )

    return { projectId: projectId.toString(), sectionId: sectionId.toString() }
  })

  revalidateTag(new CacheTags(userId).allProjects())

  return result
}

export const createProject = actionClient
  .schema(paramsSchema)
  .action(async ({ parsedInput }) => createProjectFn(parsedInput))
