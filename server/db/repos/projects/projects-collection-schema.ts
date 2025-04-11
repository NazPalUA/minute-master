import { PROJECT_STATUSES } from '@/lib/constants/project-statuses'
import {
  ClerkUserIdSchema,
  ClientProvidedDateSchema,
  CreatedAtSchema,
  ObjectIdSchema,
  UpdatedAtSchema
} from '@/server/db/common-schemas'
import { z } from 'zod'

export type ProjectEntity = z.infer<typeof ProjectEntitySchema>
export type ProjectInput = z.input<typeof ProjectEntitySchema>

export const ProjectEntitySchema = z.object({
  _id: ObjectIdSchema.optional(),
  userId: ClerkUserIdSchema,

  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  status: z
    .nativeEnum(PROJECT_STATUSES)
    .default(PROJECT_STATUSES.NOT_STARTED)
    .describe('Current project status'),

  // Client-provided dates (parsed and validated)
  startDate: ClientProvidedDateSchema.optional().describe(
    'Project start date (optional)'
  ),
  dueDate: ClientProvidedDateSchema.optional().describe(
    'Project target completion date (optional)'
  ),
  completedDate: ClientProvidedDateSchema.optional().describe(
    'Actual completion date (optional)'
  ),

  estimatedTime: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Estimated time in milliseconds'),

  // Server-managed dates
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema
})
