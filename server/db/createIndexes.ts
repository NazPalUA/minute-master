import { Db } from 'mongodb'
import { collections } from './getCollection'

export async function createIndexes(database: Db) {
  // Projects
  await database.collection(collections.projects).createIndexes([
    { key: { userId: 1 }, background: true },
    { key: { status: 1 }, background: true }
  ])

  // Sections
  await database.collection(collections.sections).createIndexes([
    { key: { userId: 1 }, background: true },
    { key: { projectId: 1 }, background: true }
  ])

  // Tasks
  await database.collection(collections.tasks).createIndexes([
    { key: { userId: 1 }, background: true },
    { key: { projectId: 1 }, background: true },
    { key: { sectionId: 1 }, background: true },
    { key: { status: 1 }, background: true }
  ])

  // Time Logs - optimized for time analytics
  await database.collection(collections['time-logs']).createIndexes([
    // Main analytics index (covers most common filters)
    {
      key: {
        userId: 1,
        projectId: 1,
        sectionId: 1,
        taskId: 1,
        startDate: -1 // -1 for descending time sorts
      },
      background: true,
      name: 'time_logs_main_analytics'
    },

    // Running time log - ensure only one active time log per user
    {
      key: {
        userId: 1
      },
      background: true,
      name: 'time_logs_running_unique',
      unique: true,
      partialFilterExpression: { endDate: null }
    },

    // Date range coverage (supports $gte/$lte queries) and duration calculation
    {
      key: {
        startDate: 1,
        endDate: 1
      },
      background: true,
      name: 'time_logs_date_ranges'
    },

    // User activity overview (with recency bias)
    {
      key: {
        userId: 1,
        startDate: -1 // Most recent first
      },
      background: true,
      name: 'user_activity_overview'
    }
  ])
}
