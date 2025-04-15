import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { ClientSession } from 'mongodb'
import { z } from 'zod'
import { type TimeLogInput, TimeLogEntitySchema } from '..'

export async function insertManyTimeLogs(
  timeLogCandidates: TimeLogInput[],
  session?: ClientSession
) {
  const newTimeLogs = z.array(TimeLogEntitySchema).parse(timeLogCandidates)

  const { collection: timeLogs } = await getCollection('time-logs')

  const result = await timeLogs.insertMany(newTimeLogs, { session })

  return result.acknowledged
}
