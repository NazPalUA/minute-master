import { TASK_STATUSES } from '@/lib/constants/task-statuses'
import { z } from 'zod'

// Using the exact status strings as keys for consistency
export const returnSchema = z.object({
  total: z.number().describe('Total number of tasks'),
  [TASK_STATUSES.COMPLETED]: z.number().describe('Number of completed tasks'),
  [TASK_STATUSES.IN_PROGRESS]: z
    .number()
    .describe('Number of in-progress tasks'),
  [TASK_STATUSES.NOT_STARTED]: z
    .number()
    .describe('Number of not started tasks'),
  [TASK_STATUSES.ON_HOLD]: z.number().describe('Number of on-hold tasks')
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type CountTasksReturn = z.output<typeof returnSchema>
