import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { ClientSession } from 'mongodb'
import { type SectionInput, SectionEntitySchema } from '..'

const MAX_SECTIONS = 10

export async function insertSection(
  sectionCandidate: SectionInput,
  session?: ClientSession
) {
  const newSection = SectionEntitySchema.parse(sectionCandidate)

  const { collection: sections } = await getCollection('sections')

  const sectionCount = await sections.countDocuments({
    projectId: newSection.projectId
  })
  if (sectionCount >= MAX_SECTIONS) {
    throw new Error('Section limit reached')
  }

  const result = await sections.insertOne(newSection, { session })

  return result.insertedId
}
