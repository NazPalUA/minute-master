import { ObjectIdSchema } from '@/server/db/common-schemas'
import { SectionEntitySchema } from '@/server/db/repos/sections'
import { z } from 'zod'

const { name, description } = SectionEntitySchema.shape

export const paramsSchema = z.object({
  query: z.object({
    sectionId: ObjectIdSchema,
    projectId: ObjectIdSchema
  }),
  payload: z
    .object({
      name,
      description
    })
    .partial()
    .transform(data => ({
      ...data,
      updatedAt: new Date()
    }))
})

export type UpdateSectionInput = z.input<typeof paramsSchema>
export type Params = z.output<typeof paramsSchema>
