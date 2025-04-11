import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { ProjectEntitySchema } from '@/server/db/repos/projects'
import { z } from 'zod'

const { name } = ProjectEntitySchema.shape

const singleItemSchema = z
  .object({
    _id: StringObjectIdSchema,
    name
  })
  .transform(({ _id, ...rest }) => ({ id: _id, ...rest }))

export const returnSchema = z.object({
  data: z.array(singleItemSchema)
})

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetProjectsNamesReturn = z.output<typeof returnSchema>
