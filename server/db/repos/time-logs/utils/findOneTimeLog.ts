import 'server-only'

import { getCollection } from '@/server/db/getCollection'
import { Filter } from 'mongodb'
import { TimeLogEntity } from '../time-logs-collection-schema'

export async function findOneTimeLog(filter: Filter<TimeLogEntity>) {
  const { collection: timeLogs } = await getCollection('time-logs')

  const result = await timeLogs.findOne(filter)

  return result
}
