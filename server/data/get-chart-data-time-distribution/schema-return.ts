import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { z } from 'zod'

/**
 * Schema for time distribution data.
 *
 * This schema is used for both project and section time distribution:
 * - When querying project distribution: id = projectId, name = projectName
 * - When querying section distribution: id = sectionId, name = sectionName
 */
export const returnSchema = z.object({
  timeLogs: z.array(
    z.object({
      id: StringObjectIdSchema,
      name: z.string(),
      duration: z.number().describe('Total time spent in milliseconds'),
      percentage: z
        .number()
        .min(0)
        .max(100)
        .describe('Percentage of total time spent')
    })
  ),
  totalDuration: z
    .number()
    .nonnegative()
    .describe('Total time across all entities in milliseconds')
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetChartDataTimeDistributionReturn = z.output<typeof returnSchema>
