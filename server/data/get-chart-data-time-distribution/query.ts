import 'server-only'

import { CacheTags } from '@/server/cache-tags'
import { auth } from '@clerk/nextjs/server'
import { unstable_cache as cache } from 'next/cache'
import { getData } from './query-base'
import {
  GetChartDataTimeDistributionInput,
  Params,
  paramsSchema
} from './schema-input'
import {
  GetChartDataTimeDistributionReturn,
  returnSchema
} from './schema-return'

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
      // console.log(`[Cache Miss] getChartDataTimeDistribution: ${JSON.stringify({ params, userId }, null, 2)}`)

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
 * Retrieves time distribution statistics with caching support.
 *
 * This function provides a cached interface to time distribution data,
 * delegating the actual data retrieval to the base query implementation.
 * Results are cached for 1 hour to improve performance.
 *
 * ## Architecture
 * - **Caching Layer**: Implemented using Next.js unstable_cache
 * - **Data Layer**: Delegates to getData() in base-query.ts for MongoDB aggregation
 * - **Auth Layer**: Enforces user authentication via Clerk
 *
 * ## Time Distribution Modes
 * - **Project Distribution**: When projectId is not provided, returns time distribution across projects
 * - **Section Distribution**: When projectId is provided, returns time distribution across sections for that project
 *
 * ## Time Aggregation
 * - Groups all time logs by their associated project or section
 * - Includes only completed time logs (those with a non-null endDate)
 * - Excludes entities that have no associated time logs
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
 * ## Sorting
 * - Sorts the aggregated data in descending order based on total time spent
 *
 * @param params - Query parameters
 * @param params.projectId - Optional project ID for section distribution (if not provided, returns project distribution)
 * @param params.from - Optional start date for filtering (inclusive)
 * @param params.to - Optional end date for filtering (inclusive)
 *
 * @returns A promise that resolves to:
 * - `timeLogs`: Array of time statistics, each containing:
 *   - `id`: Unique identifier of the project or section
 *   - `name`: Display name of the project or section
 *   - `duration`: Total milliseconds spent
 *   - `percentage`: Percentage of total time spent
 * - `totalDuration`: Total milliseconds spent across all entities
 *
 * @throws {Error} If the user is not authenticated
 *
 * @example
 * // Get time distribution between projects for the last 7 days
 * const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
 * const result = await getChartDataTimeDistribution({ from: lastWeek });
 *
 * @example
 * // Get time distribution between sections for a specific project and date range
 * const startDate = new Date('2023-01-01');
 * const endDate = new Date('2023-01-31');
 * const result = await getChartDataTimeDistribution({ projectId: 'project123', from: startDate, to: endDate });
 */
export async function getChartDataTimeDistribution(
  params: GetChartDataTimeDistributionInput
): Promise<GetChartDataTimeDistributionReturn> {
  const parsedParams = paramsSchema.parse(params)

  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return await getCachedAndValidatedData(parsedParams, userId)
}
