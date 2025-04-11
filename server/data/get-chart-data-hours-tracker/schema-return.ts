import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { z } from 'zod'
import { barSteps, timeRanges } from './lib/consts'

/**
 * Schema for hours tracker chart data.
 *
 * Defines the structure for chart data, supporting both project-level
 * and section-level analysis with consistent time grouping.
 *
 * The schema provides a flexible structure where each time period (day, week, month)
 * contains an array of analyzed entities (projects or sections) with their time data.
 *
 * @usage
 * - Project Analysis: id = projectId, name = projectName
 * - Section Analysis: id = sectionId, name = sectionName
 *
 * @structure
 * - timeAnalysis: Array of time periods
 *   - dateLabel: Identifies the time period (e.g., "2025-01", "Day 1", "Week 1")
 *   - analysisArray: Array of entity analysis for that period
 *     - id: Entity identifier (project or section ID)
 *     - name: Entity name
 *     - totalTime: Time spent in milliseconds
 */

// TODO: fix type of dateLabel
const singleItemSchema = z.object({
  dateLabel: z
    .string()
    .describe(
      'Label for the date range (e.g. "2025-01", "Day 1", "Week 1", "Month 1", etc.)'
    ),
  analysisArray: z.array(
    z.object({
      id: StringObjectIdSchema,
      name: z.string().describe('Name of the entity (project or section)'),
      totalTime: z.number().describe('Total time spent in milliseconds')
    })
  )
})

export const returnSchema = z.object({
  data: z.array(singleItemSchema),
  barStep: z.enum(barSteps),
  timeRange: z.enum(timeRanges)
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetChartDataHoursTrackerReturn = z.output<typeof returnSchema>
