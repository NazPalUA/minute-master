import {
  ClerkUserIdSchema,
  CreatedAtSchema,
  ObjectIdSchema,
  UpdatedAtSchema
} from '@/server/db/common-schemas'
import { z } from 'zod'

export type SectionEntity = z.infer<typeof SectionEntitySchema>
export type SectionInput = z.input<typeof SectionEntitySchema>

export const SectionEntitySchema = z.object({
  _id: ObjectIdSchema.optional(),
  userId: ClerkUserIdSchema,
  projectId: ObjectIdSchema,

  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),

  // Server-managed dates
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema
})
