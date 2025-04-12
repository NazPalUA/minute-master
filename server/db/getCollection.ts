import { env } from '@/env'
import { dbConnect } from './dbConnect'
import type { ProjectEntity } from './repos/projects'
import type { SectionEntity } from './repos/sections'
import type { TaskEntity } from './repos/tasks'
import type { TimeLogEntity } from './repos/time-logs'

export const collections = {
  projects: env.ATLAS_COLLECTION_PROJECTS,
  sections: env.ATLAS_COLLECTION_SECTIONS,
  tasks: env.ATLAS_COLLECTION_TASKS,
  'time-logs': env.ATLAS_COLLECTION_TIME_LOGS
}

export type CollectionName = keyof typeof collections

type CollectionMap = {
  projects: ProjectEntity
  sections: SectionEntity
  tasks: TaskEntity
  'time-logs': TimeLogEntity
}

export async function getCollection<K extends keyof CollectionMap>(name: K) {
  const { database, mongoClient } = await dbConnect()

  if (!collections[name]) {
    throw new Error(`Collection ${name} not configured`)
  }

  return {
    collection: database.collection<CollectionMap[K]>(collections[name]),
    mongoClient,
    database,
    collectionName: collections[name]
  }
}
