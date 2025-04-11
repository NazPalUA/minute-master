import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { SectionEntitySchema } from '@/server/db/repos/sections'
import { z } from 'zod'

const { name } = SectionEntitySchema.shape

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
export type GetSectionsNamesReturn = z.output<typeof returnSchema>
