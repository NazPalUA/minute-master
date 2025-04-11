import { z } from 'zod'

const changeSchema = z
  .number()
  .describe(
    'Difference compared to previous time period (positive for increase, negative for decrease)'
  )

export const returnSchema = z.object({
  value: z.object({
    total: z.number().describe('Total number of completed tasks'),
    average: z.number().describe('Average number of completed tasks per day'),
    averageDuration: z
      .number()
      .describe('Average duration of completed tasks in milliseconds')
  }),
  change: z.object({
    total: changeSchema,
    average: changeSchema,
    averageDuration: changeSchema
  })
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetMetricsTaskCompletionReturn = z.output<typeof returnSchema>
