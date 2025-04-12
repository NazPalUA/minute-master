import { taskStatuses } from '@/lib/constants'
import { z } from 'zod'

export const defaultFilters = {
  sectionFilter: 'all',
  statusFilter: 'all'
} as const

export const filtersSchema = z
  .object({
    sectionFilter: z.union([z.literal('all'), z.string()]),
    statusFilter: z.enum(['all', ...taskStatuses])
  })
  .default(defaultFilters)
  .catch(defaultFilters)

export type Filters = z.infer<typeof filtersSchema>
export type StatusFilter = z.infer<typeof filtersSchema>['statusFilter']
export type SectionFilter = z.infer<typeof filtersSchema>['sectionFilter']
