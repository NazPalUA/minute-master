import { ObjectIdSchema } from '@/server/db/common-schemas'
import { z } from 'zod'

export const paramsSchema = z.object({
  projectId: ObjectIdSchema
})

export type GetSectionsDetailsInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
