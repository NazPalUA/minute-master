import 'server-only'

import { env } from '@/env'
import { getCollection } from '@/server/db/getCollection'
import { ClientSession } from 'mongodb'
import { type ProjectInput, ProjectEntitySchema } from '..'

export async function insertProject(
  projectCandidate: ProjectInput,
  session?: ClientSession
) {
  const newProject = ProjectEntitySchema.parse(projectCandidate)

  const { collection: projects } = await getCollection('projects')

  const projectCount = await projects.countDocuments({
    userId: newProject.userId
  })
  if (projectCount >= env.PROJECTS_MAX_COUNT) {
    throw new Error('Project limit reached')
  }

  const result = await projects.insertOne(newProject, {
    session
  })

  return result.insertedId
}
