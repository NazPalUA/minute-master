import { PROJECT_STATUSES } from '@/lib/constants'
import { z } from 'zod'

export const paramsSchema = z.object({
  includeStatuses: z.array(z.nativeEnum(PROJECT_STATUSES)).optional()
})

export type GetProjectsInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
