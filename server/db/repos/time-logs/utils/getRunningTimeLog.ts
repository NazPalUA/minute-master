import 'server-only'

import { getCollection } from '@/server/db/getCollection'

export async function getRunningTimeLog(userId: string) {
  const { collection: timeLogs } = await getCollection('time-logs')

  const result = await timeLogs.findOne({ userId, endDate: null })

  return result
}
