import { z } from 'zod'

export const returnSchema = z.object({
  total: z.number().int().min(0)
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type CountTotalRuntimeReturn = z.output<typeof returnSchema>
