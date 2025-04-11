import { getPageSchema, getPageSizeSchema } from '@/lib/schemas'
import { ObjectIdSchema } from '@/server/db/common-schemas'
import { z } from 'zod'

export const paramsSchema = z
  .object({
    projectId: ObjectIdSchema,
    sectionId: ObjectIdSchema.optional(),
    taskId: ObjectIdSchema.nullable().optional(),
    page: getPageSchema(),
    limit: getPageSizeSchema(),
    getAllItems: z.boolean().optional().default(false)
  })
  .refine(
    data => {
      if (data.taskId && !data.sectionId) {
        return false
      }
      return true
    },
    {
      message:
        'Error in get-time-logs schema-input: Section ID is required when task ID is provided'
    }
  )

export type GetTimeLogsInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
