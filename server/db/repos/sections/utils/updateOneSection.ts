import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { ClientSession, ObjectId } from 'mongodb'
import {
  SectionEntitySchema,
  type SectionEntity
} from '../sections-collection-schema'

export async function updateOneSection(
  _id: ObjectId,
  updateCandidate: Partial<SectionEntity>,
  session?: ClientSession
) {
  const updateData = SectionEntitySchema.partial().parse(updateCandidate)
  const { collection: sections } = await getCollection('sections')

  const result = await sections.updateOne(
    { _id },
    { $set: updateData },
    { session }
  )

  if (result.modifiedCount !== 1) {
    throw new Error('Section not found or not updated')
  }

  return result
}
