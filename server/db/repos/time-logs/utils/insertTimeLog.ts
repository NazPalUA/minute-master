import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { ClientSession } from 'mongodb'
import { type TimeLogInput, TimeLogEntitySchema } from '..'

export async function insertTimeLog(
  timeLogCandidate: TimeLogInput,
  session?: ClientSession
) {
  const newTimeLog = TimeLogEntitySchema.parse(timeLogCandidate)

  const { collection: timeLogs } = await getCollection('time-logs')

  const result = await timeLogs.insertOne(newTimeLog, { session })

  return result.insertedId
}
