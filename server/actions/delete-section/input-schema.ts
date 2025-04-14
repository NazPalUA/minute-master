import { ObjectIdSchema } from '@/server/db/common-schemas'
import { z } from 'zod'

export const paramsSchema = z.object({
  sectionId: ObjectIdSchema
})

export type DeleteSectionInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
