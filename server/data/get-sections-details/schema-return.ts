import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { SectionEntitySchema } from '@/server/db/repos/sections'
import { z } from 'zod'

const { name, description } = SectionEntitySchema.shape

const singleItemSchema = z
  .object({
    _id: StringObjectIdSchema,
    name,
    description,
    taskCount: z
      .number()
      .describe(
        'Number of tasks in this section, aggregated from tasks in this section'
      ),
    timeSpent: z
      .number()
      .int()
      .nonnegative()
      .describe(
        'Total time spent in milliseconds, aggregated from time-logs for this section'
      )
  })
  .transform(({ _id, ...rest }) => ({ id: _id, ...rest }))

export const returnSchema = z.object({
  data: z.array(singleItemSchema)
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetSectionsDetailsReturn = z.output<typeof returnSchema>
