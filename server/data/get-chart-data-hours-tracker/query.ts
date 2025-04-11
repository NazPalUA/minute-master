import 'server-only'

import { CacheTags } from '@/server/cache-tags'
import { auth } from '@clerk/nextjs/server'
import { unstable_cache as cache } from 'next/cache'
import { getData } from './query-base'
import {
  GetChartDataHoursTrackerInput,
  Params,
  paramsSchema
} from './schema-input'
import { GetChartDataHoursTrackerReturn, returnSchema } from './schema-return'

const getCachedAndValidatedData = (params: Params, userId: string) => {
  const tg = new CacheTags(userId)
  const cacheTags = [
    tg.user(),
    tg.allTimeLogs(),
    ...(params.projectId ? [tg.projectTimeLogs(params.projectId)] : []),
    ...(params.projectId
      ? [
          tg.projectSections(params.projectId),
          tg.projectSectionsMeta(params.projectId)
        ]
      : [tg.allProjects(), tg.allProjectsMeta()])
  ]

  return cache(
    async (params: Params, userId: string) => {
      // console.log(`[Cache Miss] getChartDataHoursTracker: ${JSON.stringify({ params, userId }, null, 2)}`)

      const data = await getData(params, userId)
      return returnSchema.parse(data)
    },
    [],
    {
      tags: [...cacheTags],
      revalidate: 60 * 60 // 1 hour
    }
  )(params, userId)
}

/**
 * Retrieves time analysis data with caching support.
 *
 * This function provides a cached interface to time analysis data,
 * delegating the actual data retrieval to the base query implementation.
 * Results are cached for 1 hour to improve performance.
 *
 * ## Architecture
 * - **Caching Layer**: Implemented using Next.js unstable_cache
 * - **Data Layer**: Delegates to getData() in base-query.ts for MongoDB aggregation
 * - **Auth Layer**: Enforces user authentication via Clerk
 * - **Date Normalization**: Date parameters are normalized to hour boundaries (minutes, seconds, milliseconds set to 0)
 *
 * ## Analysis Modes
 * - **Project Analysis**: When projectId is not provided, analyzes time across projects
 * - **Section Analysis**: When projectId is provided, analyzes time across sections within that project
 *
 * ## Time Grouping
 * - Groups time data into periods based on barStep parameter
 * - Each period contains aggregated time data for all relevant entities
 * - Supports various time scales (daily, weekly, monthly) through barStep
 * - All time periods within the specified range are included in the result, even if they have 0 time logged
 *
 * ## Time Range Filtering
 * - **From Date (Optional)**: When specified, only includes time spent on or after this date
 * - **To Date (Optional)**: When specified, only includes time spent on or before this date
 * - **Handling Partial Overlaps**:
 *   - Excludes time logs that fall entirely outside the specified date range
 *   - For time logs that partially overlap with the date range, adjusts the duration as follows:
 *     - If a time log started before "from" date but ended within range:
 *       Counts only (end date - from date)
 *     - If a time log started within range but ended after "to" date:
 *       Counts only (to date - start date)
 *     - If a time log spans the entire range (started before "from" and ended after "to"):
 *       Counts only (to date - from date)
 *
 * ## Return Data Structure
 * Returns an array of time periods, each containing:
 * - dateLabel: Period identifier (e.g., "2025-01", "Day 1", "Week 1")
 * - analysisArray: Array of entity data for that period:
 *   - id: Entity identifier (project/section ID)
 *   - name: Entity name
 *   - totalTime: Time spent in milliseconds
 * - Note: All time periods within the specified range are included in the result, even if they have 0 time logged
 *
 * @param params - Query parameters
 * @param params.projectId - Optional project ID for section analysis
 * @param params.barStep - Time grouping step (e.g., "day", "week", "month")
 * @param params.from - Optional start date for filtering (inclusive)
 * @param params.to - Optional end date for filtering (inclusive)
 *
 * @returns Promise<GetChartDataHoursTrackerReturn> - Time analysis data grouped by periods
 * @throws {Error} If user is not authenticated
 *
 * @example
 * // Get daily project analysis for the last week
 * const result = await getChartDataHoursTracker({
 *   barStep: 'day',
 *   from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
 * });
 *
 * @example
 * // Get monthly section analysis for a specific project
 * const result = await getChartDataHoursTracker({
 *   projectId: 'project123',
 *   barStep: 'month',
 *   from: new Date('2024-01-01'),
 *   to: new Date('2024-12-31')
 * });
 */
export async function getChartDataHoursTracker(
  params: GetChartDataHoursTrackerInput
): Promise<GetChartDataHoursTrackerReturn> {
  const parsedParams = paramsSchema.parse(params)

  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return await getCachedAndValidatedData(parsedParams, userId)
}
