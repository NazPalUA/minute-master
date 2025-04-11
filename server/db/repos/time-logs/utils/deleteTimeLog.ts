import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import type { ClientSession, ObjectId } from 'mongodb'

export async function deleteTimeLog(_id: ObjectId, session?: ClientSession) {
  const { collection: timeLogs } = await getCollection('time-logs')

  const result = await timeLogs.deleteOne({ _id }, { session })

  if (result.deletedCount !== 1) {
    throw new Error('Time log not found or not deleted')
  }

  return result
}
