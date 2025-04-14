import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { Filter } from 'mongodb'
import { SectionEntity } from '../sections-collection-schema'

export async function findOneSection(filter: Filter<SectionEntity>) {
  const { collection: sections } = await getCollection('sections')

  const result = await sections.findOne(filter)

  return result
}
