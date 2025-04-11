import { z } from 'zod'
import { dbConnect } from './dbConnect'
import type { ProjectEntity } from './repos/projects'
import type { SectionEntity } from './repos/sections'
import type { TaskEntity } from './repos/tasks'
import type { TimeLogEntity } from './repos/time-logs'

// Validate collection names at runtime
const CollectionNamesSchema = z.object({
  projects: z.string().min(1),
  sections: z.string().min(1),
  tasks: z.string().min(1),
  'time-logs': z.string().min(1)
})

export const collections = CollectionNamesSchema.parse({
  projects: process.env.ATLAS_COLLECTION_PROJECTS,
  sections: process.env.ATLAS_COLLECTION_SECTIONS,
  tasks: process.env.ATLAS_COLLECTION_TASKS,
  'time-logs': process.env.ATLAS_COLLECTION_TIME_LOGS
})

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
