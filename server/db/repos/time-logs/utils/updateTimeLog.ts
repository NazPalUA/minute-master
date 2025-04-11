import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import type { ClientSession, ObjectId } from 'mongodb'
import { type TimeLogInput, TimeLogEntitySchema } from '..'

export async function updateTimeLog(
  _id: ObjectId,
  updateCandidate: Partial<TimeLogInput>,
  session?: ClientSession
) {
  const validatedUpdate = TimeLogEntitySchema.partial().parse(updateCandidate)

  const { collection: timeLogs } = await getCollection('time-logs')

  const result = await timeLogs.updateOne(
    { _id },
    { $set: validatedUpdate },
    { session }
  )

  if (result.modifiedCount !== 1) {
    throw new Error('Time log not found or not updated')
  }

  return result
}
