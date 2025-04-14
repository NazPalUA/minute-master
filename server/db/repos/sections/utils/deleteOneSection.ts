import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import type { ClientSession, Filter } from 'mongodb'
import { SectionEntity } from '../sections-collection-schema'

export async function deleteOneSection(
  filter: Filter<SectionEntity>,
  session?: ClientSession
) {
  const { collection: sections } = await getCollection('sections')

  const result = await sections.deleteOne(filter, { session })

  if (result.deletedCount !== 1) {
    throw new Error('Section not found or not deleted')
  }

  return result
}
