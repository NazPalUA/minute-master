import {
  ClientProvidedDateSchema,
  ObjectIdSchema
} from '@/server/db/common-schemas'
import { z } from 'zod'

export const paramsSchema = z
  .object({
    projectId: ObjectIdSchema.optional(),
    sectionId: ObjectIdSchema.optional(),
    taskId: ObjectIdSchema.optional(),
    from: ClientProvidedDateSchema.optional(),
    to: ClientProvidedDateSchema.optional()
  })
  .refine(
    data => {
      if (data.sectionId && !data.projectId) {
        return false
      }
      return true
    },
    {
      message:
        'Error in count-total-runtime schema-input: Project ID is required when section ID is provided'
    }
  )
  .refine(
    data => {
      if (data.taskId && !data.sectionId) {
        return false
      }
      return true
    },
    {
      message:
        'Error in count-total-runtime schema-input: Section ID is required when task ID is provided'
    }
  )

export type CountTotalRuntimeInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
