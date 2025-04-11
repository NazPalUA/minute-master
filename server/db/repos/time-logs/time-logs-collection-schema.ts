import {
  ClerkUserIdSchema,
  ClientProvidedDateSchema,
  CreatedAtSchema,
  ObjectIdSchema,
  UpdatedAtSchema
} from '@/server/db/common-schemas'
import { z } from 'zod'

export type TimeLogEntity = z.infer<typeof TimeLogEntitySchema>
export type TimeLogInput = z.input<typeof TimeLogEntitySchema>

export const TimeLogEntitySchema = z.object({
  _id: ObjectIdSchema.optional(),
  userId: ClerkUserIdSchema,
  projectId: ObjectIdSchema,
  sectionId: ObjectIdSchema,
  taskId: ObjectIdSchema.nullable().describe(
    'Nullable for time entries not linked to specific tasks'
  ),

  startDate: ClientProvidedDateSchema.describe('Timestamp when work started'),
  endDate: ClientProvidedDateSchema.nullable().describe(
    'Timestamp when work ended (null if ongoing)'
  ),

  // Server-managed dates
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema
})
