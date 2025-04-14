import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import type { ClientSession, Filter } from 'mongodb'
import { TimeLogEntity } from '../time-logs-collection-schema'

export async function deleteOneTimeLog(
  filter: Filter<TimeLogEntity>,
  session?: ClientSession
) {
  const { collection: timeLogs } = await getCollection('time-logs')

  const result = await timeLogs.deleteOne(filter, { session })

  if (result.deletedCount !== 1) {
    throw new Error('Time log not found or not deleted')
  }

  return result
}
