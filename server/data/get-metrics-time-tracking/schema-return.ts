import { z } from 'zod'

const changeSchema = z
  .number()
  .describe(
    'Difference compared to previous time period (positive for increase, negative for decrease)'
  )

export const returnSchema = z.object({
  value: z.object({
    total: z.number().describe('Total time spent in milliseconds'),
    average: z.number().describe('Average time spent per day in milliseconds')
  }),
  change: z.object({
    total: changeSchema,
    average: changeSchema
  })
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetMetricsTimeTrackingReturn = z.output<typeof returnSchema>
