import { ClientObjectIdStringSchema } from '@/lib/schemas'
import { z } from 'zod'

const defaultFilters = {
  section: undefined,
  task: undefined
} as const

export const filtersSchema = z
  .object({
    section: z
      .union([z.enum(['all']), ClientObjectIdStringSchema])
      .optional()
      .transform(val => (val === 'all' ? undefined : val)),
    task: z
      .union([z.enum(['all', 'none']), ClientObjectIdStringSchema])
      .optional()
      .transform(val =>
        val === 'all' ? undefined : val === 'none' ? null : val
      )
  })
  .default(defaultFilters)
  .catch(defaultFilters)

export type Filters = z.infer<typeof filtersSchema>
export type SectionFilter = z.infer<typeof filtersSchema>['section']
export type TaskFilter = z.infer<typeof filtersSchema>['task']
