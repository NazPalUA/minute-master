import { TASK_STATUSES } from '@/lib/constants'
import { getPageSchema, getPageSizeSchema } from '@/lib/schemas'
import { ObjectIdSchema } from '@/server/db/common-schemas'
import { z } from 'zod'

export const paramsSchema = z
  .object({
    projectId: ObjectIdSchema.optional(),
    sectionId: ObjectIdSchema.optional(),
    includeStatuses: z.array(z.nativeEnum(TASK_STATUSES)).optional(),
    page: getPageSchema(),
    limit: getPageSizeSchema(),
    getAllItems: z.boolean().optional().default(false)
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
        'Error in get-tasks schema-input: Project ID is required when section ID is provided'
    }
  )

export type GetTasksInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
